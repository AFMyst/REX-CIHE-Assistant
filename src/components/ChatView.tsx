import React, { useState, useRef, useEffect } from 'react';
import { RAGResponse, RetrievedSource } from '../services/ragEngine';
import { MemoExportModal } from './MemoExportModal';
import { TypewriterMessage } from './TypewriterMessage';
import { CIHELogo } from './CIHELogo';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  ragData?: RAGResponse;
  isLoading?: boolean;
}

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (query: string) => void;
  onOpenDocumentViewer: (source: RetrievedSource) => void;
  onSelectSuggestedPrompt: (prompt: string) => void;
  onNavigateToView?: (view: string) => void;
  userRole: 'student' | 'staff' | 'admin';
  currentSessionId?: string | null;
  currentSessionTitle?: string;
  onSaveCurrentSession?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  onOpenDocumentViewer,
  onSelectSuggestedPrompt,
  onNavigateToView,
  userRole,
  currentSessionId,
  currentSessionTitle,
  onSaveCurrentSession
}) => {
  const [inputText, setInputText] = useState('');
  const [activeSourceIndex, setActiveSourceIndex] = useState<number | null>(0);
  const [feedbackState, setFeedbackState] = useState<{ [msgId: string]: 'like' | 'dislike' | null }>({});
  const [showIssueReport, setShowIssueReport] = useState<{ [msgId: string]: boolean }>({});
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Advanced Voice & Speech States
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  // Typewriter Streaming State: keep track of messages that have completed streaming
  const [completedMessageIds, setCompletedMessageIds] = useState<Set<string>>(() => {
    return new Set(messages.map(m => m.id));
  });

  const handleSkipStreaming = (msgId: string) => {
    setCompletedMessageIds(prev => new Set(prev).add(msgId));
  };

  // Memo Export Modal State
  const [memoModalOpen, setMemoModalOpen] = useState(false);
  const [selectedMemoData, setSelectedMemoData] = useState<{ response: RAGResponse; query: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    showToast('Response copied to clipboard');
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Text-to-Speech (TTS)
  const handleToggleSpeak = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('Text-to-speech is not supported by your browser');
      return;
    }

    if (speakingMsgId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/\[.*?\]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-AU';

    utterance.onend = () => {
      setSpeakingMsgId(null);
    };

    utterance.onerror = () => {
      setSpeakingMsgId(null);
    };

    setSpeakingMsgId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Speech-to-Text (STT)
  const handleToggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Speech recognition is not supported in this browser');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-AU';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        showToast('Listening... Speak your question now');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        showToast('Voice capture failed or permission denied');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      showToast('Microphone initialization error');
    }
  };

  const handleOpenMemoExport = (ragData: RAGResponse, query: string) => {
    setSelectedMemoData({ response: ragData, query });
    setMemoModalOpen(true);
  };

  const handleFeedback = (msgId: string, type: 'like' | 'dislike') => {
    setFeedbackState(prev => ({
      ...prev,
      [msgId]: prev[msgId] === type ? null : type
    }));
    if (type === 'dislike') {
      setShowIssueReport(prev => ({ ...prev, [msgId]: true }));
    } else {
      showToast('Thank you for verifying institutional grounding');
    }
  };

  // Find latest assistant message with retrieved sources
  const latestAssistantMessage = [...messages].reverse().find(m => m.sender === 'assistant' && m.ragData);
  const currentSources = latestAssistantMessage?.ragData?.retrievedSources || [];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f9ff] overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 bg-[#000a1e] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[16px] text-[#86f2e4]">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Breadcrumb & Institutional Integrity Protocol Header Bar */}
      <div className="bg-white border-b border-[#c4c6cf]/40 px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 text-xs min-w-0">
          <CIHELogo size={22} rounded="rounded-md" />
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e5eeff] text-[#002147] font-semibold tracking-wider uppercase font-geist shrink-0">
            <span className="material-symbols-outlined text-[14px] text-[#006a61] icon-fill">shield</span>
            Protocol 4.2
          </span>
          <span className="text-[#c4c6cf]">/</span>
          {currentSessionTitle ? (
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <span className="material-symbols-outlined text-[15px] text-[#006a61] shrink-0">forum</span>
              <span className="text-[#000a1e] font-bold truncate max-w-[280px]" title={currentSessionTitle}>
                {currentSessionTitle}
              </span>
            </div>
          ) : (
            <span className="text-[#002147] font-medium truncate">Policy Verification Engine</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Save Session CTA */}
          {onSaveCurrentSession && (
            <button
              onClick={() => {
                onSaveCurrentSession();
                showToast('Chat conversation saved to history');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] text-[#002147] text-xs font-semibold border border-[#c4c6cf]/50 transition-colors cursor-pointer shadow-2xs"
              title="Save current session to revisit later in Saved Answers"
            >
              <span className="material-symbols-outlined text-[15px] text-[#006a61]">bookmark</span>
              <span>Save Session</span>
            </button>
          )}

          {/* Jump to Saved Sessions view */}
          {onNavigateToView && (
            <button
              onClick={() => onNavigateToView('saved-answers')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#eff4ff] text-[#44474e] hover:text-[#002147] text-xs font-medium border border-[#c4c6cf]/40 transition-colors cursor-pointer shadow-2xs"
              title="View all saved chat history sessions"
            >
              <span className="material-symbols-outlined text-[15px]">history</span>
              <span>Saved History</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-[#eff4ff] px-3 py-1 rounded-full text-xs border border-[#c4c6cf]/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[#002147] font-bold hidden md:inline">2026.1 Verified</span>
            <span className="text-[#44474e]">Corpus Grounded</span>
          </div>
        </div>
      </div>

      {/* Main Split Grid (Editorial Canvas) */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Messages Stream & Fallback Advisory (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6 pb-40">
            {messages.map((msg) => {
              const isStreaming = msg.sender === 'assistant' && !msg.isLoading && !completedMessageIds.has(msg.id);
              
              return (
              <div key={msg.id} className="flex flex-col gap-2">
                {msg.sender === 'user' ? (
                  // User Message Bubble
                  <div className="flex flex-col items-end gap-1.5 pl-8 md:pl-16">
                    <div className="flex items-center gap-2 pr-1 text-xs text-[#44474e]">
                      <span className="font-semibold text-[#002147]">You</span>
                      <span className="text-[#c4c6cf]">• {msg.timestamp}</span>
                    </div>
                    <div className="bg-[#000a1e] text-white text-sm md:text-base leading-relaxed px-5 py-3.5 rounded-2xl rounded-tr-none shadow-sm max-w-[620px]">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  // Assistant Message Container
                  <div className="flex flex-col gap-4">
                    {/* Author Meta Row */}
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2.5">
                        <CIHELogo size={28} rounded="rounded-lg" className="shadow-xs" />
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-geist font-bold text-[#000a1e]">REX</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#44474e]">
                        {isStreaming ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#002147] text-[11px] font-semibold border border-blue-200/60 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#006a61] animate-ping"></span>
                              Typing response...
                            </span>
                            <button
                              onClick={() => handleSkipStreaming(msg.id)}
                              className="inline-flex items-center gap-1 text-[11px] text-[#44474e] hover:text-[#002147] px-2 py-0.5 rounded-md hover:bg-[#eff4ff] border border-transparent hover:border-[#c4c6cf]/50 transition-colors font-medium cursor-pointer"
                              title="Instantly reveal complete response"
                            >
                              <span className="material-symbols-outlined text-[13px] text-[#006a61]">fast_forward</span>
                              Skip
                            </button>
                          </div>
                        ) : (
                          <>
                            {msg.ragData?.isGrounded && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#86f2e4]/30 text-[#006a61] font-semibold text-[11px]">
                                <span className="material-symbols-outlined text-[14px]">verified</span>
                                Corpus Grounded
                              </span>
                            )}
                            <span>{msg.timestamp}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {msg.isLoading ? (
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#c4c6cf]/30 flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#002147] typing-dot"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#006a61] typing-dot"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#86f2e4] typing-dot"></div>
                        </div>
                        <span className="text-xs text-[#002147] font-medium flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#002147] animate-spin">sync</span>
                          REX is searching CIHE institutional evidence & verifying policies...
                        </span>
                      </div>
                    ) : (
                    /* AI Card Content */
                    <div
                      onDoubleClick={() => isStreaming && handleSkipStreaming(msg.id)}
                      className="bg-white rounded-2xl p-5 md:p-7 shadow-sm border border-[#c4c6cf]/30 space-y-5 relative"
                      title={isStreaming ? 'Double-click to finish typing immediately' : undefined}
                    >
                      {/* Left Institutional Accent Bar */}
                      <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r bg-[#006a61]"></div>

                      {/* Top Notification Banner: Ungrounded Alert (if applicable) */}
                      {msg.ragData?.isUngrounded && msg.ragData.ungroundedNotice && (
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-[#cba829]/15 border border-[#cba829]/30">
                          <div className="w-9 h-9 rounded-lg bg-[#725c00] text-white flex items-center justify-center shrink-0 shadow-sm">
                            <span className="material-symbols-outlined text-[20px] icon-fill">gavel</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs uppercase tracking-wider font-bold text-[#725c00] font-geist">
                                {msg.ragData.ungroundedNotice.title}
                              </span>
                              <span className="text-[11px] bg-white px-2 py-0.5 rounded text-[#0b1c30] font-semibold border border-[#cba829]/30">
                                {msg.ragData.ungroundedNotice.confidenceLabel}
                              </span>
                            </div>
                            <p className="text-sm text-[#0b1c30] leading-relaxed">
                              {msg.ragData.ungroundedNotice.description}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Regulatory Decision Notice (if high consequence e.g. visa cancellation) */}
                      {msg.ragData?.isHighConsequence && msg.ragData.regulatoryNotice && (
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-[#cba829]/15 border-l-4 border-[#cba829]">
                          <div className="w-9 h-9 rounded-lg bg-[#cba829] text-[#000a1e] flex items-center justify-center shrink-0 shadow-sm">
                            <span className="material-symbols-outlined text-[20px] icon-fill">gavel</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs uppercase tracking-wider font-bold text-[#725c00] font-geist">
                                Regulatory Decision Notice
                              </span>
                              <span className="text-[11px] text-[#44474e]">
                                {msg.ragData.regulatoryNotice.protocol}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-[#002147] mb-1 font-geist">
                              {msg.ragData.regulatoryNotice.title}
                            </h4>
                            <p className="text-xs md:text-sm text-[#44474e] leading-relaxed">
                              {msg.ragData.regulatoryNotice.description}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Main Prose / Answer Text with Typewriter Streaming Effect */}
                      <TypewriterMessage
                        contentHtml={msg.ragData?.answerHtml || msg.text}
                        isStreaming={isStreaming}
                        onStreamingComplete={() => handleSkipStreaming(msg.id)}
                        onScrollToBottom={() => {
                          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      />

                      {/* Interactive Inline Citations Strip (reveals when streaming completes) */}
                      {msg.ragData?.retrievedSources && msg.ragData.retrievedSources.length > 0 && !isStreaming && (
                        <div className="p-3 bg-[#eff4ff] rounded-xl flex flex-wrap items-center justify-between gap-2 animate-fadeIn">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-[#002147] flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px] text-[#006a61]">menu_book</span>
                              Verified Citations:
                            </span>
                            {msg.ragData.retrievedSources.map((source, idx) => (
                              <button
                                key={source.id}
                                onClick={() => {
                                  setActiveSourceIndex(idx);
                                  onOpenDocumentViewer(source);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white hover:bg-[#86f2e4]/30 text-[#002147] text-xs font-medium border border-[#c4c6cf]/40 transition-colors shadow-sm"
                                title="Click to view exact official document"
                              >
                                <span className="material-symbols-outlined text-[13px] text-[#006a61]">article</span>
                                <span>[{source.docTitle} · {source.section} · p. {source.page}]</span>
                              </button>
                            ))}
                          </div>
                          <span className="text-[11px] text-[#006a61] font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">verified_user</span>
                            Registry Validated
                          </span>
                        </div>
                      )}

                      {/* Recommended Institutional Next Steps (reveals when streaming completes) */}
                      {msg.ragData?.recommendedSteps && msg.ragData.recommendedSteps.length > 0 && !isStreaming && (
                        <div className="pt-2 space-y-2 animate-fadeIn">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#44474e] font-geist block">
                            Recommended Institutional Next Steps
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {msg.ragData.recommendedSteps.map((step, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (step.formCode) {
                                    showToast(`Opened ${step.formCode} application form`);
                                  } else {
                                    showToast(`Forwarded to ${step.title}`);
                                  }
                                }}
                                className={`flex flex-col items-start p-3.5 rounded-xl transition-all text-left shadow-sm group active:scale-[0.98] ${
                                  idx === 0
                                    ? 'bg-[#000a1e] text-white hover:bg-[#002147]'
                                    : 'bg-[#eff4ff] text-[#002147] hover:bg-[#dce9ff]'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[20px] mb-1.5 group-hover:translate-x-0.5 transition-transform text-[#86f2e4]">
                                  {step.actionType === 'form'
                                    ? 'assignment_turned_in'
                                    : step.actionType === 'contact'
                                    ? 'support_agent'
                                    : 'calendar_month'}
                                </span>
                                <span className="text-xs font-bold leading-tight font-geist">{step.title}</span>
                                <span className="text-[11px] opacity-80 mt-0.5">{step.subtitle}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Feedback & Review Assurance Bar */}
                      <div className={`flex flex-wrap items-center justify-between pt-3 border-t border-[#c4c6cf]/30 gap-3 transition-opacity duration-300 ${isStreaming ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#44474e]">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#002147] bg-[#eff4ff] px-2 py-0.5 rounded-md border border-[#c4c6cf]/40">
                            <span className="material-symbols-outlined text-[13px] text-[#006a61]">verified</span>
                            Institutional Evidence Grounded
                          </span>
                          <span className="text-[#c4c6cf] hidden sm:inline">•</span>
                          <a
                            href="mailto:support@cihe.edu.au?subject=CIHE%20Inquiry"
                            className="text-[#006a61] font-semibold hover:underline flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">support_agent</span>
                            Contact Registry Desk
                          </a>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleSpeak(msg.ragData?.answerText || msg.text, msg.id)}
                            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold ${
                              speakingMsgId === msg.id
                                ? 'bg-[#002147] text-white shadow-xs animate-pulse'
                                : 'text-[#44474e] hover:bg-[#eff4ff] hover:text-[#002147]'
                            }`}
                            title={speakingMsgId === msg.id ? 'Stop reading' : 'Read answer aloud (Speech Synthesis)'}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {speakingMsgId === msg.id ? 'volume_up' : 'volume_down'}
                            </span>
                            <span className="hidden sm:inline text-[11px]">
                              {speakingMsgId === msg.id ? 'Speaking...' : 'Listen'}
                            </span>
                          </button>

                          {msg.ragData && (
                            <button
                              onClick={() => {
                                const userQ = messages.slice(0, messages.findIndex(m => m.id === msg.id)).reverse().find(m => m.sender === 'user')?.text || 'CIHE Institutional Inquiry';
                                handleOpenMemoExport(msg.ragData!, userQ);
                              }}
                              className="p-1.5 rounded-lg text-[#002147] hover:bg-[#eff4ff] transition-colors flex items-center gap-1 text-xs font-semibold"
                              title="Export Official Institutional Verification Memo (Print/PDF)"
                            >
                              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                              <span className="hidden sm:inline text-[11px]">Export Memo</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleFeedback(msg.id, 'like')}
                            className={`p-1.5 rounded-lg hover:bg-[#eff4ff] transition-colors ${
                              feedbackState[msg.id] === 'like' ? 'text-[#006a61] bg-[#86f2e4]/30' : 'text-[#44474e]'
                            }`}
                            title="Accurate citation"
                          >
                            <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, 'dislike')}
                            className={`p-1.5 rounded-lg hover:bg-[#eff4ff] transition-colors ${
                              feedbackState[msg.id] === 'dislike' ? 'text-[#ba1a1a] bg-[#ffdad6]' : 'text-[#44474e]'
                            }`}
                            title="Flag ambiguity / report issue"
                          >
                            <span className="material-symbols-outlined text-[18px]">thumb_down</span>
                          </button>
                          <button
                            onClick={() => handleCopy(msg.ragData?.answerText || msg.text, msg.id)}
                            className="p-1.5 hover:bg-[#eff4ff] rounded-lg text-[#44474e] transition-colors"
                            title="Copy response trace"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {copiedMsgId === msg.id ? 'check' : 'content_copy'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Expandable Issue Report Box */}
                      {showIssueReport[msg.id] && (
                        <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#c4c6cf]/40 space-y-3">
                          <div className="flex items-center justify-between text-xs font-bold text-[#002147]">
                            <span>Report an issue with this response</span>
                            <button
                              onClick={() => setShowIssueReport(prev => ({ ...prev, [msg.id]: false }))}
                              className="text-[#44474e] hover:text-[#0b1c30]"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <label className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#c4c6cf]/40 cursor-pointer">
                              <input type="radio" name={`reason-${msg.id}`} defaultChecked /> Incorrect policy citation
                            </label>
                            <label className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#c4c6cf]/40 cursor-pointer">
                              <input type="radio" name={`reason-${msg.id}`} /> Outdated census/deadline date
                            </label>
                            <label className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#c4c6cf]/40 cursor-pointer">
                              <input type="radio" name={`reason-${msg.id}`} /> Missing procedure detail
                            </label>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                setShowIssueReport(prev => ({ ...prev, [msg.id]: false }));
                                showToast('De-identified report submitted for governance audit');
                              }}
                              className="px-3.5 py-1.5 bg-[#000a1e] text-white rounded-lg text-xs font-semibold hover:bg-[#002147]"
                            >
                              Submit Audit Report
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    )}

                    {/* Continuous Conversation: Suggested Follow-up Inquiries */}
                    {msg.ragData?.suggestedFollowUps && msg.ragData.suggestedFollowUps.length > 0 && !isStreaming && (
                      <div className="flex flex-col gap-2 pt-1 animate-fadeIn">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#006a61] px-1 font-geist flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px]">forum</span>
                          Suggested Follow-up Questions
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {msg.ragData.suggestedFollowUps.map((prompt, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                onSelectSuggestedPrompt(prompt);
                                setTimeout(() => inputRef.current?.focus(), 50);
                              }}
                              className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#eff4ff] text-[#002147] hover:text-[#000a1e] text-xs font-medium border border-[#c4c6cf]/50 hover:border-[#002147]/50 transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[13px] text-[#006a61] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
            <div ref={messagesEndRef} />
          </div>

          {/* Right Column: Persistent Institutional Sources & Support Desk Panel (4 cols) */}
          <aside className="lg:col-span-4 flex flex-col gap-6 sticky top-20 pb-40">
            {/* Sources Inspector Card */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-[#c4c6cf]/30 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#006a61]">fact_check</span>
                  <h3 className="font-geist font-bold text-base text-[#000a1e]">
                    Sources ({currentSources.length} Retrieved)
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#86f2e4]/30 text-[#006f66] text-[11px] font-bold tracking-wide">
                  Access: {userRole === 'admin' ? 'Admin Tier' : userRole === 'staff' ? 'Staff Tier' : 'Student Tier'}
                </span>
              </div>
              <p className="text-xs text-[#44474e] leading-relaxed">
                Grounding citations verified against active institutional database. Content above your student tier is restricted.
              </p>

              {/* Source Cards List */}
              <div className="space-y-3.5">
                {currentSources.map((source, index) => {
                  const isActive = activeSourceIndex === index;
                  return (
                    <div
                      key={source.id}
                      onClick={() => setActiveSourceIndex(index)}
                      className={`p-4 rounded-xl transition-all cursor-pointer relative overflow-hidden border ${
                        isActive
                          ? 'bg-[#f8f9ff] border-[#006a61] ring-2 ring-[#006a61]/30 shadow-sm'
                          : 'bg-white border-[#c4c6cf]/40 hover:bg-[#eff4ff]'
                      }`}
                    >
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                          index === 0 ? 'bg-[#006a61]' : 'bg-[#cba829]'
                        }`}
                      ></div>

                      <div className="pl-2 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-5 h-5 rounded text-[11px] font-bold flex items-center justify-center ${
                                  index === 0 ? 'bg-[#006a61] text-white' : 'bg-[#e5eeff] text-[#002147]'
                                }`}
                              >
                                {index + 1}
                              </span>
                              <h4 className="font-geist text-xs md:text-sm font-bold text-[#000a1e] leading-snug">
                                {source.docTitle}
                              </h4>
                            </div>
                            <div className="text-[11px] text-[#44474e] mt-0.5">
                              <span>{source.version}</span> • <span className="font-semibold">{source.section}</span> • p. {source.page}
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#006a61] text-[10px] font-bold uppercase tracking-wider shrink-0">
                            {source.matchScore}% Match
                          </span>
                        </div>

                        {/* Verbatim Extract Quote Box */}
                        <div className="p-3 bg-[#eff4ff] rounded-lg text-xs text-[#0b1c30] italic leading-relaxed border border-[#c4c6cf]/20">
                          "{source.extract}"
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenDocumentViewer(source);
                            }}
                            className="flex-1 py-1.5 px-3 rounded-lg bg-[#000a1e] hover:bg-[#002147] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[15px]">visibility</span>
                            <span>View in Document Viewer</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(`${source.docTitle}, ${source.version}, ${source.section}, p. ${source.page}`);
                              showToast('Citation copied to clipboard');
                            }}
                            className="p-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#002147] transition-colors"
                            title="Copy citation"
                          >
                            <span className="material-symbols-outlined text-[16px]">content_copy</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Official Institutional Support Hub */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-[#c4c6cf]/30 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-geist font-bold text-base text-[#000a1e]">Institutional Support</h3>
                <span className="w-2.5 h-2.5 rounded-full bg-[#006a61] animate-pulse" title="Desk Active"></span>
              </div>

              {/* Campus Desk Visual Info */}
              <div className="flex gap-3.5 items-start p-3.5 bg-[#eff4ff] rounded-xl border border-[#c4c6cf]/30">
                <div className="w-10 h-10 rounded-xl bg-[#002147] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">domain</span>
                </div>
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-[#000a1e]">Student Services Desk</span>
                  <span className="text-[#44474e]">Level 3, Central Campus Building A</span>
                  <span className="text-[#006a61] font-semibold mt-1">Open today • 8:30 AM – 5:00 PM</span>
                </div>
              </div>

              {/* Direct Contact Channels */}
              <div className="flex flex-col gap-2 text-xs">
                <a
                  href="mailto:support@cihe.edu.au"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#eff4ff] transition-colors border border-transparent hover:border-[#c4c6cf]/40"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#44474e] text-[18px]">mail</span>
                    <span className="font-medium text-[#0b1c30]">support@cihe.edu.au</span>
                  </div>
                  <span className="material-symbols-outlined text-[#c4c6cf] text-[16px]">chevron_right</span>
                </a>
                <a
                  href="tel:1300171094"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#eff4ff] transition-colors border border-transparent hover:border-[#c4c6cf]/40"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#44474e] text-[18px]">call</span>
                    <span className="font-medium text-[#0b1c30]">1300 171 094</span>
                  </div>
                  <span className="material-symbols-outlined text-[#c4c6cf] text-[16px]">chevron_right</span>
                </a>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#eff4ff]">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#725c00] text-[18px]">access_alarm</span>
                    <span className="text-[#44474e]">Exam Day Urgent Hotline</span>
                  </div>
                  <span className="font-bold text-[#000a1e]">Ext. #889</span>
                </div>
              </div>
            </div>

            {/* Official CIHE Documents Library */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-[#c4c6cf]/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[#000a1e] font-geist">
                  Official CIHE Documents
                </h4>
                <span className="material-symbols-outlined text-[#74777f] text-[18px]">menu_book</span>
              </div>

              <div className="space-y-2 text-xs">
                <button
                  onClick={() => showToast('Downloaded Special Consideration Form 7B (PDF)')}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-[#eff4ff] transition-colors text-left border border-transparent hover:border-[#c4c6cf]/40"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-[#000a1e] block truncate">
                      Special Consideration Form (PDF)
                    </span>
                    <span className="text-[#44474e] text-[11px] block">Form 7B • Version 2026.1 • 240 KB</span>
                  </div>
                  <span className="material-symbols-outlined text-[#c4c6cf] text-[16px] self-center">download</span>
                </button>

                <button
                  onClick={() => showToast('Opened Assessment & Integrity Guidelines POL-AC-2023')}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-[#eff4ff] transition-colors text-left border border-transparent hover:border-[#c4c6cf]/40"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#002147] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">policy</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-[#000a1e] block truncate">
                      Assessment & Integrity Guidelines
                    </span>
                    <span className="text-[#44474e] text-[11px] block">Academic Board Ref: POL-AC-2023</span>
                  </div>
                  <span className="material-symbols-outlined text-[#c4c6cf] text-[16px] self-center">open_in_new</span>
                </button>

                <button
                  onClick={() => showToast('Opened Student Appeals Charter')}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-[#eff4ff] transition-colors text-left border border-transparent hover:border-[#c4c6cf]/40"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#002147] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">history_edu</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-[#000a1e] block truncate">
                      Student Appeals Charter
                    </span>
                    <span className="text-[#44474e] text-[11px] block">Sections 9.1 – 9.6 • Updated Feb 2026</span>
                  </div>
                  <span className="material-symbols-outlined text-[#c4c6cf] text-[16px] self-center">open_in_new</span>
                </button>
              </div>
            </div>

            {/* Campus Advisory Notice Callout */}
            <div className="bg-gradient-to-br from-[#000a1e] to-[#002147] rounded-2xl p-5 text-white shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#ffe081] text-xs font-bold tracking-wide font-geist">
                <span className="material-symbols-outlined text-[18px]">info</span>
                IMPORTANT NOTICE
              </div>
              <p className="text-xs text-[#eaf1ff]/90 leading-relaxed font-sans">
                Submitting false or manufactured medical statements constitutes major academic misconduct under CIHE Rule 14. Always seek formal counsel from an accredited advisor before petitioning.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-[#aec7f6]">
                <span className="font-mono">HASH: 9F4A-CIHE-GROUNDED</span>
                <span>TEQSA PRV12014</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Persistent Bottom Composer Area */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-gradient-to-t from-[#f8f9ff] via-[#f8f9ff]/95 to-transparent pt-4 pb-6 px-4 md:px-8 z-30">
        <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-2">
            {/* Quick Filter Topic Chips */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
              {onNavigateToView && (
                <>
                  <button
                    onClick={() => onNavigateToView('campuses-explorer')}
                    className="whitespace-nowrap px-3 py-1 rounded-full bg-[#002147] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 hover:bg-[#000a1e] transition"
                  >
                    <span className="material-symbols-outlined text-[14px] text-amber-300">location_on</span>
                    8 Campuses (NSW · ACT · WA)
                  </button>
                  <button
                    onClick={() => onNavigateToView('courses-finder')}
                    className="whitespace-nowrap px-3 py-1 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] text-[#002147] text-xs font-semibold border border-[#c4c6cf]/40 shadow-xs flex items-center gap-1.5 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[14px]">school</span>
                    Courses & Fee Calculator
                  </button>
                  <button
                    onClick={() => onNavigateToView('academic-calendar')}
                    className="whitespace-nowrap px-3 py-1 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] text-[#002147] text-xs font-semibold border border-[#c4c6cf]/40 shadow-xs flex items-center gap-1.5 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                    Calendar & Census Date
                  </button>
                </>
              )}
              <button
                onClick={() => onSendMessage('What are the rules under Special Consideration?')}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-white hover:bg-[#eff4ff] text-[#002147] text-xs font-medium border border-[#c4c6cf]/40 shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-[14px] text-[#006a61]">gavel</span>
                Special Consideration
              </button>
              <button
                onClick={() => onSendMessage('What are the English IELTS and PTE requirements for admission?')}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-white hover:bg-[#eff4ff] text-[#002147] text-xs font-medium border border-[#c4c6cf]/40 shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-[14px] text-indigo-700">translate</span>
                IELTS & PTE Benchmarks
              </button>
            </div>

            {/* Persistent Disclaimer (Section 11) */}
            <div className="px-3.5 py-1.5 rounded-lg bg-[#eff4ff] flex items-center justify-between gap-3 text-[#44474e] text-xs border border-[#c4c6cf]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[15px] text-[#006a61]">shield</span>
                <p className="text-[11px]">
                  <strong className="text-[#000a1e]">REX Institutional Disclaimer:</strong> REX provides information from approved CIHE sources and does not replace formal CIHE decisions. Central Phone: <strong>1300 171 094</strong>
                </p>
              </div>
              <span className="hidden sm:inline font-mono text-[10px] text-[#74777f]">TEQSA PRV12014</span>
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={handleSend}
              className="relative bg-white rounded-2xl p-2 border border-[#c4c6cf]/60 shadow-[0px_4px_24px_rgba(0,33,71,0.06)] flex items-center gap-2 focus-within:border-[#002147] focus-within:ring-2 focus-within:ring-[#002147]/20 transition-all"
            >
              <button
                type="button"
                onClick={() => showToast('Select supporting medical certificate or statutory declaration')}
                className="p-2 text-[#44474e] hover:text-[#000a1e] rounded-xl hover:bg-[#eff4ff] transition-colors"
                title="Attach student documentation"
              >
                <span className="material-symbols-outlined text-[20px]">attach_file</span>
              </button>

              {/* Voice Speech-to-Text Button */}
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className={`p-2 rounded-xl transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-[#44474e] hover:text-[#000a1e] hover:bg-[#eff4ff]'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Voice Input: Speak your question'}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isListening ? 'mic' : 'mic_none'}
                </span>
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? 'Listening to your speech...' : 'Ask a question or continue the conversation...'}
                className="flex-1 bg-transparent border-none focus:outline-none text-sm md:text-base text-[#0b1c30] placeholder:text-[#74777f] px-2 py-1.5"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="h-10 px-4 md:px-5 rounded-xl bg-[#000a1e] hover:bg-[#002147] text-white text-xs md:text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              >
                <span>Ask REX</span>
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Official Institutional Verification Memo Modal */}
      <MemoExportModal
        isOpen={memoModalOpen}
        onClose={() => setMemoModalOpen(false)}
        ragResponse={selectedMemoData?.response || null}
        queryText={selectedMemoData?.query || ''}
      />
    </div>
  );
};
