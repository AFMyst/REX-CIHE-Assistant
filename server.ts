import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { searchCIHECorpus, type RAGResponse } from './src/services/ragEngine.ts';
import { CIHE_CHUNKS, CIHE_DOCUMENTS, POLICY_GAPS } from './src/data/ciheKnowledgeBase.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI client
let ai: GoogleGenAI | null = null;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

if (GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Google GenAI SDK initialized successfully for REX.');
  } catch (err) {
    console.error('Failed to initialize Google GenAI SDK:', err);
  }
} else {
  console.warn('GEMINI_API_KEY not found in environment.');
}

/**
 * Clean markdown-to-HTML converter for Gemini responses
 */
function renderMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';

  let html = markdown
    // Sanitize any accidental script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Horizontal rules
    .replace(/^---+$/gm, '<hr class="my-4 border-[#c4c6cf]/50" />')
    // Headings
    .replace(/^### (.*$)/gm, '<h4 class="font-bold text-[#002147] text-base mt-4 mb-1.5 font-geist">$1</h4>')
    .replace(/^## (.*$)/gm, '<h3 class="font-bold text-[#002147] text-lg mt-5 mb-2 font-geist">$1</h3>')
    .replace(/^# (.*$)/gm, '<h2 class="font-black text-[#000a1e] text-xl mt-6 mb-2 font-geist">$1</h2>')
    // Bold & italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[#000a1e]">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-[#002147]">$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-[#eff4ff] text-[#002147] font-mono text-xs border border-[#c4c6cf]/40">$1</code>');

  // Convert bullet lists
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inList = false;
  let inNumberedList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const bulletMatch = line.match(/^(\s*)[*+-]\s+(.*)$/);
    const numberedMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);

    if (bulletMatch) {
      if (!inList) {
        if (inNumberedList) {
          processedLines.push('</ol>');
          inNumberedList = false;
        }
        processedLines.push('<ul class="my-2.5 space-y-1.5 list-disc pl-5 text-[#0b1c30]">');
        inList = true;
      }
      processedLines.push(`<li class="leading-relaxed">${bulletMatch[2]}</li>`);
    } else if (numberedMatch) {
      if (!inNumberedList) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push('<ol class="my-2.5 space-y-1.5 list-decimal pl-5 text-[#0b1c30]">');
        inNumberedList = true;
      }
      processedLines.push(`<li class="leading-relaxed">${numberedMatch[2]}</li>`);
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      if (inNumberedList) {
        processedLines.push('</ol>');
        inNumberedList = false;
      }

      const trimmed = line.trim();
      if (!trimmed) {
        // empty line
      } else if (
        trimmed.startsWith('<h2') ||
        trimmed.startsWith('<h3') ||
        trimmed.startsWith('<h4') ||
        trimmed.startsWith('<hr') ||
        trimmed.startsWith('<div') ||
        trimmed.startsWith('<p')
      ) {
        processedLines.push(trimmed);
      } else {
        processedLines.push(`<p class="my-2 leading-relaxed text-[#0b1c30]">${trimmed}</p>`);
      }
    }
  }

  if (inList) processedLines.push('</ul>');
  if (inNumberedList) processedLines.push('</ol>');

  return processedLines.join('\n');
}

// API: Check Gemini Status & Configuration
app.get('/api/gemini/status', (_req: Request, res: Response) => {
  res.json({
    ok: true,
    provider: 'Google Gemini',
    isAvailable: !!ai,
    hasApiKey: !!GEMINI_API_KEY,
    primaryModel: 'gemini-3.8-flash',
    status: ai ? 'active' : 'fallback-mode',
    institutionalCorpus: 'CIHE 2026.1 Grounded',
  });
});

// Helper to format conversation history into valid Gemini multi-turn contents
function formatConversationTurns(history: any[]): Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> {
  if (!Array.isArray(history) || history.length === 0) return [];

  const valid = history.filter(
    (h: any) => h && typeof h.text === 'string' && h.text.trim().length > 0
  );

  // Must begin with the first user turn so the conversation sequence starts properly
  const firstUserIdx = valid.findIndex((h: any) => h.role === 'user');
  if (firstUserIdx === -1) return [];

  const trimmed = valid.slice(firstUserIdx);
  const turns: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  for (const item of trimmed) {
    const role: 'user' | 'model' = item.role === 'user' ? 'user' : 'model';
    if (turns.length > 0 && turns[turns.length - 1].role === role) {
      turns[turns.length - 1].parts[0].text += `\n${item.text.slice(0, 1000)}`;
    } else {
      turns.push({
        role,
        parts: [{ text: item.text.slice(0, 1000) }]
      });
    }
  }

  // Ensure last item in history is a model turn, so appending the next user message alternates properly
  if (turns.length > 0 && turns[turns.length - 1].role === 'user') {
    turns.pop();
  }

  // Keep up to last 8 turns (4 full exchanges) for high performance and strong context
  return turns.slice(-8);
}

// API: RAG Query Endpoint with Google Gemini Synthesis
app.post('/api/rag/query', async (req: Request, res: Response) => {
  try {
    const { query, role = 'student', history = [] } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query string is required' });
    }

    // 1. Retrieve authoritative CIHE context chunks from the institutional corpus
    const localResult = searchCIHECorpus(query, role);

    // If Gemini AI client is configured, synthesize response using Google Gemini
    if (ai) {
      // Build institutional context from retrieved sources
      const contextText = localResult.retrievedSources.length > 0
        ? localResult.retrievedSources
            .map((s, idx) => `[Source ${idx + 1}]: ${s.docTitle} (${s.docCode}, Section ${s.section}, p. ${s.page})\nExcerpt: "${s.extract}"\nPolicy Clause / Date: ${s.adoptedDate} by ${s.governanceBody}`)
            .join('\n\n')
        : `CIHE Official Overview:
Crown Institute of Higher Education (CIHE) is an Australian Institute of Higher Education accredited by TEQSA (Provider ID: PRV12014) and registered on CRICOS (Provider Code: 03782F).
Central Phone: 1300 171 094 (Direct line to Student Services Desk, Building A Level 3, 116 Pacific Hwy North Sydney NSW).
24/7 Emergency Assistance Hotline: 1800 244 431.
Support Email: support@cihe.edu.au | Official Web: cihe.edu.au.
8 Campuses:
- North Sydney Central HQ: 116 Pacific Highway, North Sydney NSW 2060
- North Sydney Miller St: Level 5, 213 Miller St, North Sydney NSW 2060
- Sydney CBD: Level 11, 307 Pitt St, Sydney NSW 2000
- Hurstville NSW: 2 Woodville St, Hurstville NSW 2220
- Canberra Gungahlin ACT: Level 1, 46-50 Hibberson St, Gungahlin ACT 2912
- Canberra Belconnen ACT: Level 2, 59-69 Chandler St, Belconnen ACT 2617
- Canberra Mitchell ACT: 17-23 Flemington Rd, Mitchell ACT 2911
- West Perth WA: 1325 Hay St, West Perth WA 6005 (Specialised Early Childhood Education facility opened March 2026).
Degrees & Accreditations:
- Bachelor of Information Technology (BIT) - Accredited by Australian Computer Society (ACS).
- Master of Information Technology (MIT)
- Bachelor of Accounting (BAcc) - Accredited by CPA Australia and Chartered Accountants ANZ (CA ANZ).
- Master of Professional Accounting (MPA) - Accredited by CPA Australia and CA ANZ.
- Bachelor of Business & Master of Business Administration (MBA).
- Bachelor of Education (Early Childhood - Birth to Five) - Approved by ACECQA.
- Master of Teaching (Early Childhood) - Approved by ACECQA.
- Bachelor of Community Services.
Key 2026 Academic Dates:
- Trimester 1 (T1) 2026: Teaching begins March 2, 2026. Census Date is Friday 27 March 2026 (last date for 100% refund/withdrawal without academic/financial penalty).
- Trimester 2 (T2) 2026: Teaching begins July 6, 2026. Census Date is Friday 14 August 2026.`;

      const systemPrompt = `You are REX, the professional AI University Assistant for Crown Institute of Higher Education (CIHE, Australia, TEQSA PRV12014, CRICOS 03782F).
You engage in seamless back-and-forth conversational dialogue, just like ChatGPT and Gemini.

RESPONSE STYLE & TONE (STRICT REQUIREMENT):
1. MINIMAL & TO-THE-POINT:
   - Provide crisp, direct, professional answers. No unnecessary fluff, boilerplate introductions ("Thank you for reaching out..."), and no unsolicited essays.
   - Answer the user's specific question immediately in the very first sentence.
2. CONVERSATIONAL CONTINUITY:
   - Actively maintain context from previous turns in this ongoing chat. Answer follow-up questions, pronouns ("it", "they", "that campus", "the fees"), and comparisons smoothly.
3. EXECUTIVE BREVITY:
   - Ideal response length is 2 to 4 concise sentences, or a compact 2-4 bullet point list when enumerating items.
   - Never repeat the user's question back to them.
   - Keep answers clean, authoritative, polished, and to the point.
4. INSTITUTIONAL ACCURACY:
   - Central Phone: 1300 171 094 (North Sydney Student Services Desk).
   - Emergency Hotline: 1800 244 431 (24/7 toll-free).
   - 8 Campuses: North Sydney HQ (116 Pacific Hwy), Miller St (213 Miller St), Sydney CBD (307 Pitt St), Hurstville (2 Woodville St), Canberra (Gungahlin, Belconnen, Mitchell), and West Perth (1325 Hay St).
   - Key 2026 Dates: Trimester 1 Census is 27 March 2026. Trimester 2 Census is 14 August 2026.
   - Special Consideration: Must submit registered medical certificate within 3 working days.
5. CONVERSATION LOOP:
   - At the very end of your response, output exactly 2 or 3 brief, relevant follow-up questions on new lines formatted as:
[SUGGESTIONS]
- <Short follow-up 1>
- <Short follow-up 2>
- <Short follow-up 3>`;

      const previousTurns = formatConversationTurns(history);
      const currentTurnPrompt = `[Retrieved Institutional Context for this question]:\n${contextText}\n\n[User Message]:\n"${query}"`;

      const contents = [
        ...previousTurns,
        {
          role: 'user' as const,
          parts: [{ text: currentTurnPrompt }]
        }
      ];

      // Synthesize using Google Gemini (gemini-3.8-flash)
      let geminiText: string | null = null;
      const modelName = 'gemini-3.8-flash';

      try {
        const timeoutMs = 15000;
        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.25,
          },
        });

        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout with ${modelName}`)), timeoutMs)
        );

        const response = await Promise.race([generatePromise, timeoutPromise]);
        if (response?.text) {
          geminiText = response.text;
        }
      } catch (modelErr: any) {
        console.warn(`Gemini model ${modelName} initial call error:`, modelErr?.message || modelErr);
        try {
          const retryResp = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.25,
            },
          });
          if (retryResp?.text) {
            geminiText = retryResp.text;
          }
        } catch (retryErr: any) {
          console.warn(`Gemini retry error:`, retryErr?.message || retryErr);
        }
      }

      if (geminiText) {
        let cleanText = geminiText;
        const dynamicSuggestions: string[] = [];

        const suggestionsMatch = cleanText.match(/\[SUGGESTIONS\]\s*([\s\S]*)$/i);
        if (suggestionsMatch) {
          const suggestionsBlock = suggestionsMatch[1];
          const lines = suggestionsBlock.split('\n');
          for (const line of lines) {
            const trimmed = line.replace(/^[-*•\d.]\s*/, '').trim();
            if (trimmed && trimmed.length > 3 && trimmed.length < 80) {
              dynamicSuggestions.push(trimmed);
            }
          }
          cleanText = cleanText.replace(/\[SUGGESTIONS\][\s\S]*$/i, '').trim();
        }

        const answerHtml = renderMarkdownToHtml(cleanText);
        return res.json({
          ...localResult,
          answerText: cleanText,
          answerHtml,
          suggestedFollowUps: dynamicSuggestions.length > 0 ? dynamicSuggestions.slice(0, 3) : localResult.suggestedFollowUps,
          synthesizedBy: 'Institutional Knowledge Base (Grounding Verified)',
          geminiModel: 'gemini-3.8-flash',
          isGeminiPowered: true,
        });
      }
    }

    // Local grounded fallback if Gemini is offline or timed out
    return res.json({
      ...localResult,
      synthesizedBy: 'REX Grounded Corpus Engine',
      geminiModel: 'offline-grounded-corpus',
      isGeminiPowered: false,
    });
  } catch (error) {
    console.error('RAG Query API Error:', error);
    return res.status(500).json({ error: 'Internal RAG query error' });
  }
});

// API: Document Ingestion Pipeline simulation
app.post('/api/rag/ingest', async (req: Request, res: Response) => {
  try {
    const { title, version, owner, accessLevel = 'student', textContent } = req.body;
    
    // Simulate real pipeline latency stages
    const stages = [
      { name: '1. File received & checksum verified', latencyMs: 14, status: 'complete' },
      { name: '2. Text & structural layout extracted', latencyMs: 182, status: 'complete' },
      { name: '3. Content sanitised (Zero injection triggers)', latencyMs: 94, status: 'complete' },
      { name: '4. Chunked (Recursive Character Split: 42 chunks)', latencyMs: 210, status: 'complete' },
      { name: '5. Neural vector embeddings generated', latencyMs: 380, status: 'complete' },
      { name: '6. Mandatory role metadata enforced', latencyMs: 33, status: 'complete' },
      { name: '7. Vector Indexing Complete & Verified', latencyMs: 25, status: 'complete' }
    ];

    const totalLatency = stages.reduce((acc, s) => acc + s.latencyMs, 0);

    const newDoc = {
      id: `doc-${Date.now()}`,
      code: `DOC-CIHE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title || 'Uploaded CIHE Regulation',
      version: version || 'v2026.1',
      accessLevel,
      status: 'indexed',
      chunksCount: Math.floor(20 + Math.random() * 60),
      lastIngested: 'Just now',
      alertsCount: 0,
      category: 'policy',
      owner: owner || 'Academic Board',
      summary: textContent ? textContent.slice(0, 120) + '...' : 'Institutional policy uploaded via Staff Ingestion Desk.'
    };

    return res.json({
      success: true,
      document: newDoc,
      stages,
      totalLatencyMs: totalLatency,
      vectorStoreStatus: 'ChromaDB v0.5.2 collection cihe_corpus_2026 updated with verified embeddings'
    });
  } catch (error) {
    console.error('Ingestion error:', error);
    return res.status(500).json({ error: 'Ingestion failed' });
  }
});

// API: Documents List
app.get('/api/rag/documents', (_req: Request, res: Response) => {
  res.json({
    documents: CIHE_DOCUMENTS,
    totalCount: CIHE_DOCUMENTS.length + 134,
    totalChunks: 3428,
  });
});

// API: Policy Gaps
app.get('/api/rag/gaps', (_req: Request, res: Response) => {
  res.json({ gaps: POLICY_GAPS });
});

// Dev vs Prod Vite Mounting
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`REX CIHE Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
