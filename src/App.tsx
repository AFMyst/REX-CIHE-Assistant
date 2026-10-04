import React, { useState } from 'react';
import { WelcomeView } from './components/WelcomeView';
import { ChatView, ChatMessage } from './components/ChatView';
import { SavedAnswersView } from './components/SavedAnswersView';
import { StaffAdminView } from './components/StaffAdminView';
import { AnalyticsView } from './components/AnalyticsView';
import { HumanReferralView } from './components/HumanReferralView';
import { CampusesView } from './components/CampusesView';
import { CourseNavigatorView } from './components/CourseNavigatorView';
import { AcademicCalendarView } from './components/AcademicCalendarView';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { CIHELogo } from './components/CIHELogo';
import { searchCIHECorpus, RetrievedSource } from './services/ragEngine';
import { 
  ChatSession, 
  getSavedSessions, 
  saveSession, 
  createNewSessionFromMessages 
} from './services/chatSessionService';

export type AppTab = 
  | 'chat-assistant' 
  | 'campuses-explorer' 
  | 'courses-finder' 
  | 'academic-calendar' 
  | 'saved-answers' 
  | 'staff-administration' 
  | 'analytics-dashboard' 
  | 'referral-desk';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('chat-assistant');
  const [userRole, setUserRole] = useState<'student' | 'staff' | 'admin'>('student');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);

  // Document Viewer Modal State
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{
    title: string;
    code?: string;
    version?: string;
    page?: number | string;
    quote?: string;
  }>({
    title: 'CIHE Student Assessment Policy',
    code: 'DOC-CIHE-2026-POL-04',
    version: 'v2025.10',
    page: 4,
    quote: 'Clause 7.2.1: Applications for special consideration must be lodged within three (3) working days of the scheduled assessment date, accompanied by a registered practitioner medical certificate stating the impact on performance.'
  });

  // Chat Session Management
  const [currentSessionId, setCurrentSessionId] = useState<string | null>('session-special-consideration');
  const [currentSessionTitle, setCurrentSessionTitle] = useState<string>('Special Consideration & Medical Certificate Inquiry');
  const [savedSessionsCount, setSavedSessionsCount] = useState<number>(() => {
    return getSavedSessions().length;
  });

  // Seed with an initial sample grounded query from the designs
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'user',
      timestamp: 'Today at 10:42 AM',
      text: 'How do I apply for special consideration for my mid-term exam if I was ill?'
    },
    {
      id: 'msg-2',
      sender: 'assistant',
      timestamp: 'Today at 10:42 AM',
      text: 'If you were unable to sit your mid-term examination due to sudden illness, you can lodge an application for Special Consideration.',
      ragData: searchCIHECorpus('How do I apply for special consideration for my mid-term exam if I was ill?', 'student')
    }
  ]);

  const handleStartNewConversation = () => {
    // If previous messages had content, ensure they are saved if user had a session
    if (messages.length > 0 && currentSessionId) {
      const existing = getSavedSessions().find(s => s.id === currentSessionId);
      if (existing) {
        saveSession({
          ...existing,
          messages,
          updatedAt: 'Just now'
        });
      }
    }

    setActiveTab('chat-assistant');
    setHasStartedChat(false);
    setCurrentSessionId(null);
    setCurrentSessionTitle('');
    setMessages([]);
    setMobileMenuOpen(false);
  };

  const handleLoadSession = (session: ChatSession) => {
    setMessages([...session.messages]);
    setCurrentSessionId(session.id);
    setCurrentSessionTitle(session.title);
    setHasStartedChat(true);
    setActiveTab('chat-assistant');
    setMobileMenuOpen(false);
    setSavedSessionsCount(getSavedSessions().length);
  };

  const handleSaveCurrentSession = () => {
    if (messages.length === 0) return;
    const session = createNewSessionFromMessages(messages, currentSessionTitle || undefined);
    if (currentSessionId) {
      session.id = currentSessionId;
    } else {
      setCurrentSessionId(session.id);
    }
    setCurrentSessionTitle(session.title);
    const updated = saveSession(session);
    setSavedSessionsCount(updated.length);
  };

  const handleSendMessage = async (queryText: string) => {
    setActiveTab('chat-assistant');
    setHasStartedChat(true);

    // If starting a fresh session without a title, assign one
    if (!currentSessionTitle) {
      const title = queryText.length > 45 ? queryText.slice(0, 42) + '...' : queryText;
      setCurrentSessionTitle(title);
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      text: queryText
    };

    const loadingId = `msg-loading-${Date.now()}`;
    const loadingMsg: ChatMessage = {
      id: loadingId,
      sender: 'assistant',
      timestamp: 'Just now',
      text: '',
      isLoading: true
    };

    // Prepare conversational history for multi-turn back-and-forth dialogue
    const history = messages
      .filter(m => !m.isLoading && m.text.trim())
      .slice(-10)
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

    setMessages(prev => [...prev, userMsg, loadingMsg]);

    // Query backend RAG endpoint (or fallback to local engine)
    let ragResult;
    try {
      const res = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText, role: userRole, history })
      });
      if (res.ok) {
        ragResult = await res.json();
      } else {
        ragResult = searchCIHECorpus(queryText, userRole);
      }
    } catch {
      ragResult = searchCIHECorpus(queryText, userRole);
    }

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'assistant',
      timestamp: 'Just now',
      text: ragResult.answerText,
      ragData: ragResult
    };

    setMessages(prev => {
      const nextMsgs = prev.map(m => m.id === loadingId ? assistantMsg : m);
      
      // Auto-sync active session to localStorage
      try {
        const activeId = currentSessionId || `session-${Date.now()}`;
        if (!currentSessionId) setCurrentSessionId(activeId);
        const titleToUse = currentSessionTitle || (queryText.length > 45 ? queryText.slice(0, 42) + '...' : queryText);
        
        const existing = getSavedSessions().find(s => s.id === activeId);
        const sessionToPersist: ChatSession = {
          id: activeId,
          title: titleToUse,
          createdAt: existing?.createdAt || ('Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
          updatedAt: 'Just now',
          category: existing?.category || 'General',
          summary: `Discussion: ${queryText.slice(0, 65)}...`,
          messages: nextMsgs,
          pinned: existing?.pinned || false,
          tags: existing?.tags || ['Active Discussion']
        };
        saveSession(sessionToPersist);
        setSavedSessionsCount(getSavedSessions().length);
      } catch (err) {
        console.warn('Session auto-sync error:', err);
      }

      return nextMsgs;
    });
  };

  const handleOpenDocViewer = (source: RetrievedSource) => {
    setSelectedDoc({
      title: source.docTitle,
      code: source.docCode,
      version: source.version,
      page: source.page,
      quote: source.extract
    });
    setViewerOpen(true);
  };

  return (
    <div className="flex h-screen w-full bg-[#f8f9ff] text-[#0b1c30] overflow-hidden font-sans">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-72 bg-white border-r border-[#c4c6cf]/40 flex-col justify-between shrink-0 shadow-sm z-30">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand */}
          <div className="h-20 flex items-center px-5 gap-3 border-b border-[#c4c6cf]/20">
            <CIHELogo size={42} rounded="rounded-xl" className="shadow-sm ring-1 ring-black/5" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-geist text-lg tracking-tight font-bold text-[#000a1e]">REX</span>
                <span className="px-1.5 py-0.5 rounded bg-[#144694]/10 text-[#144694] text-[10px] uppercase font-bold">
                  CIHE
                </span>
              </div>
              <span className="text-[11px] text-[#44474e] truncate">Crown Institute of Higher Ed</span>
            </div>
          </div>

          {/* Institutional Corpus Status Badge */}
          <div className="px-4 py-3">
            <div className="px-3 py-2.5 rounded-xl bg-[#eff4ff] border border-[#c4c6cf]/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#006a61] animate-pulse"></span>
                <span className="text-[11px] text-[#44474e] uppercase font-semibold tracking-wider font-geist">
                  Corpus Active
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#002147] font-bold">8 Campuses · 2026</span>
            </div>
          </div>

          {/* New Conversation CTA Button */}
          <div className="px-4 mb-3">
            <button
              onClick={handleStartNewConversation}
              className="w-full bg-[#000a1e] text-white hover:bg-[#002147] text-xs font-semibold rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-transform duration-200 active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>New Conversation</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 space-y-1">
            <button
              onClick={() => {
                setActiveTab('chat-assistant');
                setHasStartedChat(true);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-left transition-all text-xs font-semibold ${
                activeTab === 'chat-assistant'
                  ? 'bg-[#002147] text-white shadow-sm'
                  : 'text-[#44474e] hover:bg-[#eff4ff] hover:text-[#000a1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">chat_bubble</span>
              <span>Chat Assistant</span>
            </button>

            <button
              onClick={() => setActiveTab('campuses-explorer')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-left transition-all text-xs font-semibold ${
                activeTab === 'campuses-explorer'
                  ? 'bg-[#002147] text-white shadow-sm'
                  : 'text-[#44474e] hover:bg-[#eff4ff] hover:text-[#000a1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px] text-[#002147] active:text-white">location_on</span>
              <div className="flex items-center justify-between flex-1">
                <span>8 Campuses (NSW·ACT·WA)</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">New</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('courses-finder')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-left transition-all text-xs font-semibold ${
                activeTab === 'courses-finder'
                  ? 'bg-[#002147] text-white shadow-sm'
                  : 'text-[#44474e] hover:bg-[#eff4ff] hover:text-[#000a1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">school</span>
              <span>Degrees & Fees Navigator</span>
            </button>

            <button
              onClick={() => setActiveTab('academic-calendar')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-left transition-all text-xs font-semibold ${
                activeTab === 'academic-calendar'
                  ? 'bg-[#002147] text-white shadow-sm'
                  : 'text-[#44474e] hover:bg-[#eff4ff] hover:text-[#000a1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">calendar_month</span>
              <span>Calendar & Census Dates</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('saved-answers');
                setSavedSessionsCount(getSavedSessions().length);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-left transition-all text-xs font-semibold ${
                activeTab === 'saved-answers'
                  ? 'bg-[#002147] text-white shadow-sm'
                  : 'text-[#44474e] hover:bg-[#eff4ff] hover:text-[#000a1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">bookmark</span>
              <div className="flex items-center justify-between flex-1">
                <span>Saved Answers & History</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  activeTab === 'saved-answers' ? 'bg-white/20 text-white' : 'bg-[#e5eeff] text-[#002147]'
                }`}>
                  {savedSessionsCount}
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('referral-desk')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-left transition-all text-xs font-semibold ${
                activeTab === 'referral-desk'
                  ? 'bg-[#002147] text-white shadow-sm'
                  : 'text-[#44474e] hover:bg-[#eff4ff] hover:text-[#000a1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">contact_support</span>
              <span>Human Referral Desk</span>
            </button>

            <div className="pt-2 border-t border-[#c4c6cf]/20 my-1">
              <span className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-[#74777f] font-geist block mb-1">
                Institutional Tools
              </span>

              <button
                onClick={() => setActiveTab('staff-administration')}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-left transition-all text-xs font-semibold ${
                  activeTab === 'staff-administration'
                    ? 'bg-[#002147] text-white shadow-sm'
                    : 'text-[#44474e] hover:bg-[#eff4ff] hover:text-[#000a1e]'
                }`}
              >
                <span className="material-symbols-outlined text-[19px]">admin_panel_settings</span>
                <span>Staff Ingestion Desk</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics-dashboard')}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-left transition-all text-xs font-semibold ${
                  activeTab === 'analytics-dashboard'
                    ? 'bg-[#002147] text-white shadow-sm'
                    : 'text-[#44474e] hover:bg-[#eff4ff] hover:text-[#000a1e]'
                }`}
              >
                <span className="material-symbols-outlined text-[19px]">insights</span>
                <span>Analytics & Citations</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Footer User Profile & Settings */}
        <div className="p-3 border-t border-[#c4c6cf]/20 space-y-2">
          <div className="p-3 rounded-xl bg-[#eff4ff] flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#002147] flex items-center justify-center text-white shrink-0 text-xs font-bold font-geist">
                AM
              </div>
              <div className="min-w-0 flex flex-col">
                <span className="text-xs font-bold text-[#000a1e] truncate font-geist">Alex Morgan</span>
                <span className="text-[10px] text-[#74777f] truncate">CIHE #94203</span>
              </div>
            </div>
            <button
              onClick={() => setUserRole(userRole === 'student' ? 'staff' : userRole === 'staff' ? 'admin' : 'student')}
              className="px-2 py-0.5 rounded-full bg-white border border-[#c4c6cf]/50 text-[#002147] text-[10px] font-bold hover:bg-[#dce9ff] transition-colors"
              title="Click to switch role preview"
            >
              {userRole === 'student' ? 'Student' : userRole === 'staff' ? 'Staff' : 'Admin'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 md:h-20 bg-white border-b border-[#c4c6cf]/30 px-4 md:px-8 flex items-center justify-between gap-4 shrink-0 z-20">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#44474e] hover:bg-[#eff4ff] rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

            {/* Mobile Title with CIHE Logo */}
            <div className="md:hidden flex items-center gap-2">
              <CIHELogo size={30} rounded="rounded-lg" />
              <span className="font-geist font-bold text-lg text-[#000a1e]">REX CIHE</span>
            </div>

            {/* Global Search Bar (Desktop) */}
            <div className="hidden md:flex w-full items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#eff4ff] text-[#44474e] border border-[#c4c6cf]/30">
              <span className="material-symbols-outlined text-[19px] text-[#74777f]">search</span>
              <input
                type="text"
                placeholder="Ask about degrees, campuses, fees, census dates, policies..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                    handleSendMessage((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
                className="w-full bg-transparent border-none focus:outline-none text-xs text-[#0b1c30] placeholder:text-[#74777f]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Dial Badge */}
            <a
              href="tel:1300171094"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] border border-[#c4c6cf]/30 text-xs transition"
              title="Central Student Desk"
            >
              <span className="material-symbols-outlined text-[#002147] text-[17px]">call</span>
              <span className="text-[#000a1e] font-semibold">1300 171 094</span>
            </a>

            {/* TEQSA status */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eff4ff] border border-[#c4c6cf]/30 text-xs">
              <span className="material-symbols-outlined text-[#006a61] text-[17px]">verified</span>
              <span className="text-[#000a1e] font-semibold">TEQSA PRV12014</span>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#eff4ff] border border-[#c4c6cf]/30 text-[#000a1e] text-xs">
              <span className="text-[#74777f]">Role:</span>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as any)}
                className="bg-transparent font-bold text-[#002147] focus:outline-none cursor-pointer"
              >
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin / Board</option>
              </select>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold text-xs font-geist">
              AM
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-[#000a1e]/60 backdrop-blur-sm flex">
            <div className="w-72 bg-white h-full flex flex-col p-4 shadow-2xl animate-in slide-in-from-left">
              <div className="flex items-center justify-between pb-4 border-b border-[#c4c6cf]/30">
                <div className="flex items-center gap-2.5">
                  <CIHELogo size={36} rounded="rounded-lg" />
                  <div className="flex flex-col">
                    <span className="font-geist font-bold text-base text-[#000a1e] leading-tight">REX CIHE</span>
                    <span className="text-[10px] text-[#44474e]">Crown Institute of Higher Ed</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-[#44474e] hover:bg-[#eff4ff]"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="py-4 space-y-1.5 flex-1 overflow-y-auto">
                <button
                  onClick={() => {
                    handleStartNewConversation();
                  }}
                  className="w-full bg-[#000a1e] text-white py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 mb-3"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>New Conversation</span>
                </button>

                {[
                  { id: 'chat-assistant', label: 'Chat Assistant', icon: 'chat_bubble' },
                  { id: 'campuses-explorer', label: '8 Campuses (NSW·ACT·WA)', icon: 'location_on' },
                  { id: 'courses-finder', label: 'Degrees & Fees', icon: 'school' },
                  { id: 'academic-calendar', label: 'Calendar & Census Dates', icon: 'calendar_month' },
                  { id: 'saved-answers', label: 'Saved Answers & History', icon: 'bookmark' },
                  { id: 'referral-desk', label: 'Human Referral Desk', icon: 'contact_support' },
                  { id: 'staff-administration', label: 'Staff Ingestion Desk', icon: 'admin_panel_settings' },
                  { id: 'analytics-dashboard', label: 'Analytics & Citations', icon: 'insights' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      if (item.id === 'chat-assistant') setHasStartedChat(true);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs font-semibold ${
                      activeTab === item.id ? 'bg-[#002147] text-white' : 'text-[#44474e] hover:bg-[#eff4ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Content Views */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'chat-assistant' && !hasStartedChat && (
            <WelcomeView
              onSelectPrompt={handleSendMessage}
              onSubmitPrompt={handleSendMessage}
              onNavigateToCategory={(cat) => setActiveTab(cat as any)}
            />
          )}

          {activeTab === 'chat-assistant' && hasStartedChat && (
            <ChatView
              messages={messages}
              onSendMessage={handleSendMessage}
              onOpenDocumentViewer={handleOpenDocViewer}
              onSelectSuggestedPrompt={handleSendMessage}
              onNavigateToView={(view) => {
                setActiveTab(view as any);
                setSavedSessionsCount(getSavedSessions().length);
              }}
              userRole={userRole}
              currentSessionId={currentSessionId}
              currentSessionTitle={currentSessionTitle}
              onSaveCurrentSession={handleSaveCurrentSession}
            />
          )}

          {activeTab === 'campuses-explorer' && (
            <CampusesView
              onAskRexAboutCampus={(campusName) => {
                handleSendMessage(`Tell me all details about CIHE ${campusName} campus, including address, facilities, programs, and public transport.`);
              }}
            />
          )}

          {activeTab === 'courses-finder' && (
            <CourseNavigatorView
              onAskRexAboutCourse={(courseTitle) => {
                handleSendMessage(`What are the units, tuition fees, IELTS/PTE benchmarks, and career outcomes for ${courseTitle}?`);
              }}
            />
          )}

          {activeTab === 'academic-calendar' && (
            <AcademicCalendarView
              onAskRexAboutDeadlines={(topic) => {
                handleSendMessage(`What are the key dates, census cutoff rules, and exam schedules regarding ${topic}?`);
              }}
            />
          )}

          {activeTab === 'saved-answers' && (
            <SavedAnswersView
              onOpenQuery={handleSendMessage}
              onOpenPdf={(title) => {
                setSelectedDoc({
                  title,
                  code: 'DOC-CIHE-2026-REF',
                  version: 'v2026.1',
                  page: 1,
                  quote: 'Official verified extract archived in CIHE Institutional Repository.'
                });
                setViewerOpen(true);
              }}
              onLoadSession={handleLoadSession}
              currentActiveMessages={messages}
              currentSessionId={currentSessionId}
              onStartNewChat={handleStartNewConversation}
            />
          )}

          {activeTab === 'staff-administration' && (
            <StaffAdminView />
          )}

          {activeTab === 'analytics-dashboard' && (
            <AnalyticsView />
          )}

          {activeTab === 'referral-desk' && (
            <HumanReferralView onStartChatWithQuery={handleSendMessage} />
          )}
        </main>
      </div>

      {/* Global Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        documentTitle={selectedDoc.title}
        documentCode={selectedDoc.code}
        version={selectedDoc.version}
        page={selectedDoc.page}
        highlightedQuote={selectedDoc.quote}
      />
    </div>
  );
}
