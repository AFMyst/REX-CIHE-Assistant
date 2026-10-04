import { ChatMessage } from '../components/ChatView';
import { searchCIHECorpus } from './ragEngine';

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  category: 'Academic Policies' | 'Fees & Enrolment' | 'Courses & Campuses' | 'Student Visa & Welfare' | 'General';
  summary: string;
  messages: ChatMessage[];
  pinned?: boolean;
  tags?: string[];
}

const STORAGE_KEY = 'cihe_saved_chat_sessions_v1';

// Pre-seeded high quality realistic CIHE student sessions
const DEFAULT_SESSIONS: ChatSession[] = [
  {
    id: 'session-special-consideration',
    title: 'Special Consideration & Medical Certificate Inquiry',
    createdAt: 'Yesterday at 3:15 PM',
    updatedAt: 'Yesterday at 3:22 PM',
    category: 'Academic Policies',
    summary: 'Procedures for lodging medical evidence for missed mid-term exams under Clause 7.2.1 and retrospective certificates.',
    pinned: true,
    tags: ['DOC-CIHE-2026-POL-04', 'Clause 7.2.1', 'Assessment Policy', '3-Day Deadline'],
    messages: [
      {
        id: 'sc-1',
        sender: 'user',
        timestamp: 'Yesterday at 3:15 PM',
        text: 'How do I apply for special consideration for my mid-term exam if I was ill?'
      },
      {
        id: 'sc-2',
        sender: 'assistant',
        timestamp: 'Yesterday at 3:16 PM',
        text: 'Under Clause 7.2.1 of the CIHE Student Assessment Policy (DOC-CIHE-2026-POL-04), if you missed a scheduled mid-term exam due to sudden acute illness, you must lodge an official Application for Special Consideration within three (3) working days of the exam date.\n\nYou must attach an authentic medical certificate issued by an AHPRA-registered medical practitioner stating the severity and dates of incapacitation.',
        ragData: searchCIHECorpus('How do I apply for special consideration for my mid-term exam if I was ill?', 'student')
      },
      {
        id: 'sc-3',
        sender: 'user',
        timestamp: 'Yesterday at 3:19 PM',
        text: 'What if my doctor certificate was issued the day after the exam?'
      },
      {
        id: 'sc-4',
        sender: 'assistant',
        timestamp: 'Yesterday at 3:20 PM',
        text: 'Under CIHE Assessment Policy Section 7.4 (Medical Evidence Authenticity):\n\n• The medical consultation must ideally occur on or before the examination date.\n• If obtained the day after, the practitioner must explicitly document clinical findings affirming that your severe incapacitation commenced prior to or on the examination day.\n• Retrospective certificates stating only "student reports they were ill yesterday" without clinical diagnosis are generally disallowed by the CIHE Academic Board.\n• Submit the medical certificate via the Student Portal within the mandatory 3 working day window.',
        ragData: searchCIHECorpus('What if my doctor certificate was issued the day after the exam?', 'student')
      }
    ]
  },
  {
    id: 'session-census-refund',
    title: 'Semester 1 Census Date & Tuition Fee Refund Rules',
    createdAt: '3 days ago at 11:05 AM',
    updatedAt: '3 days ago at 11:14 AM',
    category: 'Fees & Enrolment',
    summary: 'Deadlines for withdrawing from units before 27 March 2026 to receive 100% refund without academic penalty.',
    pinned: false,
    tags: ['Census Date', '27 March 2026', '100% Refund', 'International Fees'],
    messages: [
      {
        id: 'cr-1',
        sender: 'user',
        timestamp: '3 days ago at 11:05 AM',
        text: 'When is the Semester 1 census date and what happens to my tuition fees if I drop a unit before then?'
      },
      {
        id: 'cr-2',
        sender: 'assistant',
        timestamp: '3 days ago at 11:06 AM',
        text: 'The official Census Date for Semester 1, 2026 is Friday, 27 March 2026 at 11:59 PM (AEST).\n\nIf you formally withdraw from a unit via the Student Portal prior to this cutoff:\n1. 100% Tuition Fee Refund / Credit: All tuition fees paid for that unit are fully re-credited to your student account or refunded in accordance with the International Student Refund Policy.\n2. Zero Academic Penalty: The unit will not appear on your official academic transcript (no WN or Fail grade recorded).\n3. Visa Warning: International students on Subclass 500 must maintain a minimum standard full-time study load of 24 credit points (typically 4 units) unless approved for reduced study load by Student Services.',
        ragData: searchCIHECorpus('When is the Semester 1 census date and refund policy?', 'student')
      }
    ]
  },
  {
    id: 'session-mit-course-planning',
    title: 'Master of Information Technology Core Units & Sydney Campus Schedule',
    createdAt: '5 days ago at 4:40 PM',
    updatedAt: '5 days ago at 4:52 PM',
    category: 'Courses & Campuses',
    summary: 'Core subject prerequisites, Cloud Systems architecture, and evening lecture timetable at North Sydney.',
    pinned: false,
    tags: ['MIT Program', 'CRICOS 0101824', 'North Sydney', 'Course Units'],
    messages: [
      {
        id: 'mit-1',
        sender: 'user',
        timestamp: '5 days ago at 4:40 PM',
        text: 'What are the first semester core units for the Master of Information Technology at the North Sydney campus?'
      },
      {
        id: 'mit-2',
        sender: 'assistant',
        timestamp: '5 days ago at 4:42 PM',
        text: 'The Master of Information Technology (CRICOS: 0101824 | 96 Credit Points / 16 Units) offers foundational core units in Semester 1 at CIHE North Sydney (Level 3, 51 Walker St):\n\n1. MIT501 - Enterprise Systems & Cloud Architecture (6 CP)\n2. MIT502 - Database Design & Big Data Analytics (6 CP)\n3. MIT503 - Advanced Software Engineering Practice (6 CP)\n4. MIT504 - Cybersecurity Fundamentals & Governance (6 CP)\n\nClasses run in weekday evening cohorts (6:00 PM – 9:00 PM) as well as Saturday intensive labs to accommodate postgraduate working schedules.',
        ragData: searchCIHECorpus('Master of Information Technology units North Sydney', 'student')
      }
    ]
  }
];

export const getSavedSessions = (): ChatSession[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SESSIONS));
      return DEFAULT_SESSIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SESSIONS));
    return DEFAULT_SESSIONS;
  } catch (err) {
    console.warn('Failed to read saved chat sessions from localStorage:', err);
    return DEFAULT_SESSIONS;
  }
};

export const saveSession = (session: ChatSession): ChatSession[] => {
  const current = getSavedSessions();
  const existingIdx = current.findIndex(s => s.id === session.id);
  let updated: ChatSession[];

  if (existingIdx >= 0) {
    updated = current.map((s, idx) => idx === existingIdx ? { ...session, updatedAt: 'Just now' } : s);
  } else {
    updated = [{ ...session, updatedAt: 'Just now' }, ...current];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to persist chat session:', err);
  }

  return updated;
};

export const deleteSession = (sessionId: string): ChatSession[] => {
  const current = getSavedSessions();
  const updated = current.filter(s => s.id !== sessionId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update sessions after deletion:', err);
  }
  return updated;
};

export const renameSession = (sessionId: string, newTitle: string): ChatSession[] => {
  const current = getSavedSessions();
  const updated = current.map(s => s.id === sessionId ? { ...s, title: newTitle.trim() || s.title, updatedAt: 'Just now' } : s);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to rename session:', err);
  }
  return updated;
};

export const togglePinSession = (sessionId: string): ChatSession[] => {
  const current = getSavedSessions();
  const updated = current.map(s => s.id === sessionId ? { ...s, pinned: !s.pinned } : s);
  // Sort pinned first
  updated.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to toggle pin session:', err);
  }
  return updated;
};

export const createNewSessionFromMessages = (
  messages: ChatMessage[],
  customTitle?: string
): ChatSession => {
  const firstUserMessage = messages.find(m => m.sender === 'user');
  let title = customTitle || '';
  if (!title) {
    if (firstUserMessage?.text) {
      title = firstUserMessage.text.length > 50 
        ? firstUserMessage.text.slice(0, 47) + '...' 
        : firstUserMessage.text;
    } else {
      title = `CIHE Advisory Session (${new Date().toLocaleDateString()})`;
    }
  }

  // Derive category and tags from messages
  let category: ChatSession['category'] = 'General';
  const fullText = messages.map(m => m.text).join(' ').toLowerCase();
  if (fullText.includes('policy') || fullText.includes('consideration') || fullText.includes('misconduct') || fullText.includes('appeal')) {
    category = 'Academic Policies';
  } else if (fullText.includes('fee') || fullText.includes('census') || fullText.includes('refund') || fullText.includes('visa')) {
    category = 'Fees & Enrolment';
  } else if (fullText.includes('course') || fullText.includes('campus') || fullText.includes('degree') || fullText.includes('unit')) {
    category = 'Courses & Campuses';
  } else if (fullText.includes('welfare') || fullText.includes('oshc') || fullText.includes('health') || fullText.includes('counseling')) {
    category = 'Student Visa & Welfare';
  }

  const tags: string[] = [];
  messages.forEach(m => {
    if (m.ragData?.retrievedSources) {
      m.ragData.retrievedSources.forEach(s => {
        if (s.docCode && !tags.includes(s.docCode)) tags.push(s.docCode);
      });
    }
  });
  if (tags.length === 0) tags.push('Verified Dialogue');

  const summary = firstUserMessage 
    ? `Student query on ${firstUserMessage.text.slice(0, 80)}...`
    : 'Multi-turn conversational exchange with REX CIHE AI Assistant.';

  return {
    id: `session-${Date.now()}`,
    title,
    createdAt: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    updatedAt: 'Just now',
    category,
    summary,
    pinned: false,
    tags: tags.slice(0, 4),
    messages: [...messages]
  };
};

export const exportSessionAsText = (session: ChatSession): void => {
  const lines: string[] = [
    `================================================================`,
    `CROWN INSTITUTE OF HIGHER EDUCATION (CIHE)`,
    `REX AI ASSISTANT - OFFICIAL CONVERSATIONAL TRANSCRIPT`,
    `TEQSA Provider ID: PRV12014 | CRICOS: 03782F`,
    `================================================================`,
    `Session ID:    ${session.id}`,
    `Topic:         ${session.title}`,
    `Category:      ${session.category}`,
    `Created:       ${session.createdAt}`,
    `Last Updated:  ${session.updatedAt}`,
    `Total Turns:   ${session.messages.length} messages`,
    `Policy Tags:   ${(session.tags || []).join(', ')}`,
    `----------------------------------------------------------------`,
    `EXCHANGE TRANSCRIPT:`,
    `----------------------------------------------------------------\n`
  ];

  session.messages.forEach((msg, idx) => {
    const senderLabel = msg.sender === 'user' ? 'STUDENT' : 'REX CIHE ASSISTANT';
    lines.push(`[${idx + 1}] ${senderLabel} (${msg.timestamp}):`);
    lines.push(msg.text.trim());

    if (msg.ragData?.retrievedSources && msg.ragData.retrievedSources.length > 0) {
      lines.push(`\n   Verified Statutory Citations:`);
      msg.ragData.retrievedSources.forEach(src => {
        lines.push(`   - ${src.docTitle} (${src.docCode || src.version}), ${src.section}, p. ${src.page}`);
      });
    }
    lines.push('\n' + '-'.repeat(40) + '\n');
  });

  lines.push(`\n================================================================`);
  lines.push(`Institutional Disclaimer: This transcript is generated by REX AI Assistant`);
  lines.push(`grounded in verified CIHE policies. For formal decisions, please contact`);
  lines.push(`the Registry Office at support@cihe.edu.au or phone 1300 171 094.`);
  lines.push(`================================================================`);

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `CIHE_Session_${session.id}_${session.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30)}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
