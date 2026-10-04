import React, { useState, useEffect } from 'react';
import { SAVED_ANSWERS } from '../data/ciheKnowledgeBase';
import { 
  ChatSession, 
  getSavedSessions, 
  saveSession, 
  deleteSession, 
  renameSession, 
  togglePinSession, 
  exportSessionAsText,
  createNewSessionFromMessages
} from '../services/chatSessionService';
import { ChatMessage } from './ChatView';

interface SavedAnswersViewProps {
  onOpenQuery: (query: string) => void;
  onOpenPdf: (title: string) => void;
  onLoadSession?: (session: ChatSession) => void;
  currentActiveMessages?: ChatMessage[];
  currentSessionId?: string | null;
  onStartNewChat?: () => void;
}

export const SavedAnswersView: React.FC<SavedAnswersViewProps> = ({
  onOpenQuery,
  onOpenPdf,
  onLoadSession,
  currentActiveMessages = [],
  currentSessionId = null,
  onStartNewChat
}) => {
  // Primary Navigation: Chat History Sessions vs Official Repository Answers
  const [mainTab, setMainTab] = useState<'chat-sessions' | 'curated-answers'>('chat-sessions');

  // Sessions state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionSearch, setSessionSearch] = useState('');
  const [sessionCategoryFilter, setSessionCategoryFilter] = useState<string>('all');
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  // Rename session modal/input state
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [renameInputValue, setRenameInputValue] = useState('');

  // Transcript Preview Modal state
  const [previewSession, setPreviewSession] = useState<ChatSession | null>(null);

  // Curated Answers state
  const [activeCategory, setActiveCategory] = useState<'all' | 'policy' | 'fees-visas' | 'course-guides'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load sessions from localStorage
  useEffect(() => {
    setSessions(getSavedSessions());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/#saved-${id}`);
    setCopiedId(id);
    showToast('Citation link copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Session Actions
  const handleSaveActiveChat = () => {
    if (!currentActiveMessages || currentActiveMessages.length === 0) {
      showToast('No active conversation to save. Start a chat first!');
      return;
    }

    const newSession = createNewSessionFromMessages(currentActiveMessages);
    const updated = saveSession(newSession);
    setSessions(updated);
    showToast(`Conversation saved: "${newSession.title.slice(0, 35)}..."`);
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the saved session "${title}"?`)) {
      const updated = deleteSession(id);
      setSessions(updated);
      showToast('Conversation session deleted');
      if (expandedSessionId === id) setExpandedSessionId(null);
      if (previewSession?.id === id) setPreviewSession(null);
    }
  };

  const handleTogglePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = togglePinSession(id);
    setSessions(updated);
    const target = updated.find(s => s.id === id);
    showToast(target?.pinned ? 'Session pinned to top' : 'Session unpinned');
  };

  const handleStartRename = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setRenameInputValue(session.title);
  };

  const handleSaveRename = (id: string) => {
    if (!renameInputValue.trim()) {
      setEditingSessionId(null);
      return;
    }
    const updated = renameSession(id, renameInputValue.trim());
    setSessions(updated);
    setEditingSessionId(null);
    showToast('Session title updated');
  };

  const handleExportSession = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    exportSessionAsText(session);
    showToast(`Exported transcript for "${session.title.slice(0, 25)}..."`);
  };

  const handleResumeSession = (session: ChatSession) => {
    if (onLoadSession) {
      onLoadSession(session);
    }
  };

  // Filtered Sessions
  const filteredSessions = sessions.filter(session => {
    const matchesCategory = 
      sessionCategoryFilter === 'all' ? true :
      sessionCategoryFilter === 'pinned' ? session.pinned :
      session.category === sessionCategoryFilter;

    const q = sessionSearch.toLowerCase().trim();
    if (!q) return matchesCategory;

    const inTitle = session.title.toLowerCase().includes(q);
    const inSummary = session.summary?.toLowerCase().includes(q);
    const inTags = (session.tags || []).some(t => t.toLowerCase().includes(q));
    const inMessages = session.messages.some(m => m.text.toLowerCase().includes(q));

    return matchesCategory && (inTitle || inSummary || inTags || inMessages);
  });

  // Filtered Curated Answers
  const filteredAnswers = SAVED_ANSWERS.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.citation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const canSaveCurrentConversation = currentActiveMessages.length > 0;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f9ff] overflow-y-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 right-8 z-50 bg-[#000a1e] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce border border-[#86f2e4]/30">
          <span className="material-symbols-outlined text-[16px] text-[#86f2e4]">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Rename Modal */}
      {editingSessionId && (
        <div className="fixed inset-0 z-50 bg-[#000a1e]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#c4c6cf]/40 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-geist font-bold text-base text-[#000a1e] flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#006a61]">edit_note</span>
                Rename Chat Session
              </h3>
              <button
                onClick={() => setEditingSessionId(null)}
                className="text-[#74777f] hover:text-[#000a1e] p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="text-xs text-[#44474e]">
              Enter a descriptive institutional title for this conversation so you can easily reference it later.
            </p>
            <input
              type="text"
              value={renameInputValue}
              onChange={(e) => setRenameInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveRename(editingSessionId);
                if (e.key === 'Escape') setEditingSessionId(null);
              }}
              autoFocus
              className="w-full h-11 px-3.5 bg-[#eff4ff] text-sm text-[#0b1c30] rounded-xl border border-[#c4c6cf]/60 focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147]"
              placeholder="e.g. Special Consideration Form Submission"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingSessionId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#44474e] hover:bg-[#eff4ff]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveRename(editingSessionId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#000a1e] text-white hover:bg-[#002147] shadow-sm"
              >
                Save Title
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transcript Preview Modal */}
      {previewSession && (
        <div className="fixed inset-0 z-50 bg-[#000a1e]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#c4c6cf]/40 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-[#c4c6cf]/30 flex items-center justify-between bg-[#eff4ff]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#006a61] bg-[#86f2e4]/30 px-2 py-0.5 rounded">
                  {previewSession.category}
                </span>
                <h3 className="font-geist font-bold text-lg text-[#000a1e] mt-1 leading-snug">
                  {previewSession.title}
                </h3>
                <p className="text-xs text-[#74777f] mt-0.5">
                  Recorded: {previewSession.createdAt} • {previewSession.messages.length} messages
                </p>
              </div>
              <button
                onClick={() => setPreviewSession(null)}
                className="text-[#44474e] hover:text-[#000a1e] p-1.5 rounded-lg hover:bg-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f8f9ff]">
              {previewSession.messages.map((m, idx) => (
                <div 
                  key={m.id || idx}
                  className={`p-4 rounded-xl text-xs leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-[#000a1e] text-white ml-6' 
                      : 'bg-white text-[#0b1c30] mr-6 border border-[#c4c6cf]/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 opacity-80 text-[10px] font-semibold">
                    <span>{m.sender === 'user' ? 'STUDENT INQUIRY' : 'REX CIHE ASSISTANT'}</span>
                    <span>{m.timestamp}</span>
                  </div>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#c4c6cf]/30 bg-white flex items-center justify-between">
              <button
                onClick={() => exportSessionAsText(previewSession)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#eff4ff] text-[#002147] hover:bg-[#dce9ff] flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Download Transcript (.txt)
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewSession(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#44474e] hover:bg-[#eff4ff]"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleResumeSession(previewSession);
                    setPreviewSession(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#000a1e] text-white hover:bg-[#002147] flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  Resume in Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 md:p-8 lg:p-10 max-w-[1400px] mx-auto w-full space-y-8 pb-24">
        {/* Top Header & Operational Overview */}
        <section className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#86f2e4]/30 text-[#006f66] text-xs font-semibold">
                  <span className="material-symbols-outlined text-[14px]">history_edu</span>
                  CIHE Session & Answers Hub
                </span>
                <span className="text-xs text-[#44474e]">Persistent Local Storage • Semester 1, 2026</span>
              </div>
              <h1 className="font-geist text-2xl md:text-4xl font-bold text-[#000a1e] tracking-tight">
                Saved Answers & Chat History
              </h1>
              <p className="text-sm md:text-base text-[#44474e] max-w-2xl mt-1 leading-relaxed">
                Save, load, and manage your full conversational threads with REX, or browse curated statutory advisory records and university policies.
              </p>
            </div>

            {/* Quick Actions Group */}
            <div className="flex flex-wrap items-center gap-2.5">
              {canSaveCurrentConversation && (
                <button
                  onClick={handleSaveActiveChat}
                  className="bg-[#006a61] hover:bg-[#00524b] text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                  title="Bookmark and archive your active chat conversation"
                >
                  <span className="material-symbols-outlined text-[17px]">bookmark_add</span>
                  <span>Save Current Chat</span>
                </button>
              )}
              {onStartNewChat && (
                <button
                  onClick={onStartNewChat}
                  className="bg-[#000a1e] hover:bg-[#002147] text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">add_comment</span>
                  <span>New Conversation</span>
                </button>
              )}
            </div>
          </div>

          {/* Primary View Toggle: My Chat Sessions vs Institutional Repository */}
          <div className="flex border-b border-[#c4c6cf]/40 gap-6">
            <button
              onClick={() => setMainTab('chat-sessions')}
              className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all relative ${
                mainTab === 'chat-sessions'
                  ? 'text-[#002147]'
                  : 'text-[#74777f] hover:text-[#000a1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">forum</span>
              <span>My Chat History Sessions</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                mainTab === 'chat-sessions' ? 'bg-[#002147] text-white' : 'bg-[#eff4ff] text-[#44474e]'
              }`}>
                {sessions.length}
              </span>
              {mainTab === 'chat-sessions' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002147] rounded-full"></div>
              )}
            </button>

            <button
              onClick={() => setMainTab('curated-answers')}
              className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all relative ${
                mainTab === 'curated-answers'
                  ? 'text-[#002147]'
                  : 'text-[#74777f] hover:text-[#000a1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">verified</span>
              <span>CIHE Knowledge Repository</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                mainTab === 'curated-answers' ? 'bg-[#002147] text-white' : 'bg-[#eff4ff] text-[#44474e]'
              }`}>
                {SAVED_ANSWERS.length}
              </span>
              {mainTab === 'curated-answers' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002147] rounded-full"></div>
              )}
            </button>
          </div>
        </section>

        {/* TAB 1: Chat History Sessions */}
        {mainTab === 'chat-sessions' && (
          <div className="space-y-6">
            {/* Filter Bar & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'All Sessions', count: sessions.length },
                  { id: 'pinned', label: 'Pinned', icon: 'push_pin', count: sessions.filter(s => s.pinned).length },
                  { id: 'Academic Policies', label: 'Policies' },
                  { id: 'Fees & Enrolment', label: 'Fees & Visas' },
                  { id: 'Courses & Campuses', label: 'Courses' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSessionCategoryFilter(cat.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                      sessionCategoryFilter === cat.id
                        ? 'bg-[#002147] text-white'
                        : 'bg-[#eff4ff] text-[#44474e] hover:bg-[#dce9ff]'
                    }`}
                  >
                    {cat.icon && <span className="material-symbols-outlined text-[13px]">{cat.icon}</span>}
                    <span>{cat.label}</span>
                    {cat.count !== undefined && (
                      <span className="bg-white/20 px-1.5 py-0.2 rounded text-[10px]">{cat.count}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Session Search */}
              <div className="w-full sm:w-80 relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#74777f]">search</span>
                <input
                  type="text"
                  value={sessionSearch}
                  onChange={(e) => setSessionSearch(e.target.value)}
                  placeholder="Search past conversations..."
                  className="w-full h-10 pl-9 pr-4 bg-white text-[#0b1c30] text-xs rounded-xl border border-[#c4c6cf]/60 shadow-xs placeholder:text-[#74777f] focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147]"
                />
              </div>
            </div>

            {/* Sessions List */}
            {filteredSessions.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#c4c6cf]/30 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#eff4ff] text-[#002147] flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[28px]">search_off</span>
                </div>
                <h3 className="font-geist font-bold text-lg text-[#000a1e]">No chat sessions match your search</h3>
                <p className="text-xs text-[#74777f] max-w-md mx-auto">
                  Try adjusting your search terms or switch categories to view other saved university dialogues.
                </p>
                <button
                  onClick={() => { setSessionSearch(''); setSessionCategoryFilter('all'); }}
                  className="px-4 py-2 rounded-xl bg-[#002147] text-white text-xs font-semibold hover:bg-[#000a1e]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSessions.map((session) => {
                  const isExpanded = expandedSessionId === session.id;
                  const isCurrentActive = currentSessionId === session.id;
                  const turnsCount = Math.floor(session.messages.length / 2) || 1;

                  return (
                    <div
                      key={session.id}
                      className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                        session.pinned 
                          ? 'border-[#006a61]/50 bg-gradient-to-b from-emerald-50/20 to-white' 
                          : 'border-[#c4c6cf]/35 hover:border-[#002147]/40'
                      }`}
                    >
                      {/* Top Header of Card */}
                      <div className="p-5 pb-4 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#002147] border border-blue-200/50">
                            {session.category}
                          </span>

                          <div className="flex items-center gap-1">
                            {isCurrentActive && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#006a61] bg-[#86f2e4]/30 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#006a61] animate-ping"></span>
                                Active
                              </span>
                            )}
                            <button
                              onClick={(e) => handleTogglePin(e, session.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                session.pinned ? 'text-[#006a61] bg-[#86f2e4]/30' : 'text-[#74777f] hover:bg-[#eff4ff]'
                              }`}
                              title={session.pinned ? 'Unpin session' : 'Pin to top'}
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                {session.pinned ? 'push_pin' : 'push_pin'}
                              </span>
                            </button>
                            <button
                              onClick={(e) => handleStartRename(e, session)}
                              className="p-1.5 rounded-lg text-[#74777f] hover:text-[#000a1e] hover:bg-[#eff4ff] transition-colors"
                              title="Rename session title"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button
                              onClick={(e) => handleDeleteSession(e, session.id, session.title)}
                              className="p-1.5 rounded-lg text-[#74777f] hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete session"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </div>

                        {/* Session Title */}
                        <h3 
                          onClick={() => handleResumeSession(session)}
                          className="font-geist font-bold text-base text-[#000a1e] hover:text-[#006a61] cursor-pointer transition-colors leading-snug line-clamp-2"
                        >
                          {session.title}
                        </h3>

                        {/* Summary */}
                        <p className="text-xs text-[#44474e] leading-relaxed line-clamp-2">
                          {session.summary || session.messages[0]?.text || 'Conversational interaction.'}
                        </p>

                        {/* Tags */}
                        {session.tags && session.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {session.tags.map((tag, i) => (
                              <span key={i} className="text-[10px] bg-[#eff4ff] text-[#44474e] px-2 py-0.5 rounded font-mono">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Inline Messages Expand Toggle */}
                        {isExpanded && (
                          <div className="pt-3 border-t border-[#c4c6cf]/30 space-y-2.5 max-h-60 overflow-y-auto pr-1">
                            {session.messages.map((m, idx) => (
                              <div 
                                key={m.id || idx}
                                className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                                  m.sender === 'user' ? 'bg-[#000a1e] text-white ml-3' : 'bg-[#eff4ff] text-[#0b1c30] mr-3'
                                }`}
                              >
                                <div className="text-[10px] opacity-75 font-semibold mb-0.5">
                                  {m.sender === 'user' ? 'You' : 'REX'}:
                                </div>
                                <p className="line-clamp-4">{m.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer Toolbar */}
                      <div className="p-4 bg-[#f8f9ff] border-t border-[#c4c6cf]/30 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between text-[11px] text-[#74777f]">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                            {session.createdAt}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-[#002147]">
                            <span className="material-symbols-outlined text-[14px]">chat_bubble_outline</span>
                            {session.messages.length} msgs ({turnsCount} {turnsCount === 1 ? 'turn' : 'turns'})
                          </span>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleResumeSession(session)}
                            className="flex-1 bg-[#000a1e] hover:bg-[#002147] text-white py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                            <span>Resume Chat</span>
                          </button>

                          <button
                            onClick={() => setPreviewSession(session)}
                            className="p-2 rounded-xl bg-white hover:bg-[#eff4ff] text-[#002147] border border-[#c4c6cf]/40 transition-colors"
                            title="Preview complete transcript"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                          </button>

                          <button
                            onClick={(e) => handleExportSession(e, session)}
                            className="p-2 rounded-xl bg-white hover:bg-[#eff4ff] text-[#002147] border border-[#c4c6cf]/40 transition-colors"
                            title="Export transcript as text file"
                          >
                            <span className="material-symbols-outlined text-[16px]">download</span>
                          </button>

                          <button
                            onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                            className="p-2 rounded-xl bg-white hover:bg-[#eff4ff] text-[#002147] border border-[#c4c6cf]/40 transition-colors"
                            title={isExpanded ? 'Collapse preview' : 'Expand conversation preview'}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {isExpanded ? 'unfold_less' : 'unfold_more'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Institutional Knowledge Base Curated Answers */}
        {mainTab === 'curated-answers' && (
          <div className="space-y-6">
            {/* Search Bar & Categories */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shadow-sm ${
                    activeCategory === 'all'
                      ? 'bg-[#002147] text-white'
                      : 'bg-[#eff4ff] text-[#44474e] hover:bg-[#dce9ff]'
                  }`}
                >
                  <span>All Curated</span>
                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-[11px]">{SAVED_ANSWERS.length}</span>
                </button>

                <button
                  onClick={() => setActiveCategory('policy')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shadow-sm ${
                    activeCategory === 'policy'
                      ? 'bg-[#002147] text-white'
                      : 'bg-[#eff4ff] text-[#44474e] hover:bg-[#dce9ff]'
                  }`}
                >
                  <span>Academic Policies</span>
                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-[11px]">2</span>
                </button>

                <button
                  onClick={() => setActiveCategory('fees-visas')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shadow-sm ${
                    activeCategory === 'fees-visas'
                      ? 'bg-[#002147] text-white'
                      : 'bg-[#eff4ff] text-[#44474e] hover:bg-[#dce9ff]'
                  }`}
                >
                  <span>Fees & Visas</span>
                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-[11px]">2</span>
                </button>
              </div>

              <div className="w-full sm:w-96 relative">
                <span className="material-symbols-outlined absolute left-3.5 top-3 text-[19px] text-[#74777f]">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search verified institutional statutes..."
                  className="w-full h-11 pl-10 pr-4 bg-white text-[#0b1c30] text-xs rounded-xl border border-[#c4c6cf]/60 shadow-xs placeholder:text-[#74777f] focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147]"
                />
              </div>
            </div>

            {/* Main Grid: Left Cards (8 Cols) / Right Portals (4 Cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Primary Column: Saved Answer Cards */}
              <main className="lg:col-span-8 flex flex-col gap-6">
                {filteredAnswers.map((item) => (
                  <article
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm academic-shadow-level-1 overflow-hidden transition-all duration-200 border border-[#c4c6cf]/30 hover:border-[#006a61]/50 hover:shadow-md"
                  >
                    <div className="flex">
                      {/* Institutional Vertical Bar */}
                      <div
                        className={`w-1.5 flex-shrink-0 ${
                          item.category === 'fees-visas'
                            ? 'bg-[#cba829]'
                            : item.category === 'policy'
                            ? 'bg-[#006a61]'
                            : 'bg-[#002147]'
                        }`}
                      ></div>

                      <div className="p-6 md:p-7 w-full flex flex-col justify-between">
                        <div>
                          {/* Meta Strip */}
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="bg-[#e5eeff] text-[#002147] px-2.5 py-0.5 rounded-full text-xs font-semibold">
                                {item.categoryLabel}
                              </span>
                              <span className="bg-[#eff4ff] text-[#44474e] px-2.5 py-0.5 rounded-full text-xs">
                                {item.sourceBadge}
                              </span>
                              <span className="text-[#74777f] text-xs flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                Saved {item.savedDate}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-[#725c00] font-medium bg-[#ffe081]/30 px-2 py-0.5 rounded-full">
                              <span className="material-symbols-outlined text-[15px]">lock</span>
                              <span>{item.bindingStatus}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h2 className="font-geist text-lg md:text-xl text-[#000a1e] font-bold mb-3 tracking-tight">
                            {item.title}
                          </h2>

                          {/* REX Verified Excerpt */}
                          <div className="bg-[#eff4ff] rounded-xl p-4 mb-4 border border-[#c4c6cf]/30">
                            <div className="flex items-center gap-2 text-[#002147] text-xs font-bold mb-2">
                              <span className="material-symbols-outlined text-[16px] text-[#006a61] icon-fill">
                                auto_awesome
                              </span>
                              <span>{item.synthesisTitle}</span>
                            </div>
                            <blockquote className="text-sm text-[#44474e] leading-relaxed">
                              {item.excerpt}
                            </blockquote>
                          </div>

                          {/* Citation Strip */}
                          <div className="flex items-center gap-2 text-[#44474e] text-xs mb-4">
                            <span className="material-symbols-outlined text-[16px] text-[#002147]">menu_book</span>
                            <span>{item.citation}</span>
                          </div>
                        </div>

                        {/* Action Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#c4c6cf]/30">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onOpenQuery(`Tell me full details about ${item.title}`)}
                              className="bg-[#000a1e] text-white hover:bg-[#002147] px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">visibility</span>
                              Ask REX in Chat
                            </button>
                            <button
                              onClick={() => handleCopyLink(item.id)}
                              className="bg-[#eff4ff] text-[#002147] hover:bg-[#dce9ff] px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                {copiedId === item.id ? 'check' : 'link'}
                              </span>
                              <span>{copiedId === item.id ? 'Copied' : 'Copy Link'}</span>
                            </button>
                            <button
                              onClick={() => onOpenPdf(item.title)}
                              className="bg-[#eff4ff] text-[#002147] hover:bg-[#dce9ff] px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">download</span>
                              Export PDF
                            </button>
                          </div>

                          <span className="text-[#006a61] text-xs flex items-center gap-1 font-semibold">
                            <span className="material-symbols-outlined text-[16px]">verified_user</span>
                            Approved by Registry
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </main>

              {/* Secondary Column: Portals Sidebar */}
              <aside className="lg:col-span-4 flex flex-col gap-6 sticky top-20">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#c4c6cf]/30 academic-shadow-level-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-geist text-lg font-bold text-[#000a1e] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-[#006a61]">bookmarks</span>
                      CIHE Portals
                    </h3>
                    <span className="text-xs text-[#006a61] bg-[#86f2e4]/30 px-2 py-0.5 rounded font-semibold">
                      SSO Active
                    </span>
                  </div>
                  <p className="text-xs text-[#44474e] mb-4">
                    Direct authenticated shortcuts to verified institutional learning environments.
                  </p>

                  <div className="space-y-2.5">
                    <a
                      href="https://cihe.edu.au"
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#002147] text-white flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">school</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#000a1e] group-hover:text-[#006a61] transition-colors">
                            Moodle LMS
                          </div>
                          <div className="text-[11px] text-[#44474e]">Course modules & lecture archives</div>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[18px] text-[#74777f] group-hover:translate-x-1 transition-transform">
                        arrow_outward
                      </span>
                    </a>

                    <a
                      href="https://cihe.edu.au"
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#86f2e4] text-[#006f66] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">badge</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#000a1e] group-hover:text-[#006a61] transition-colors">
                            Student Portal
                          </div>
                          <div className="text-[11px] text-[#44474e]">Enrolments, transcripts & billing</div>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[18px] text-[#74777f] group-hover:translate-x-1 transition-transform">
                        arrow_outward
                      </span>
                    </a>
                  </div>
                </div>

                {/* Concierge Assistance Card */}
                <div className="relative overflow-hidden rounded-2xl bg-[#000a1e] text-white p-6 shadow-md border border-[#002147]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#86f2e4]">
                      <span className="material-symbols-outlined text-[18px]">neurology</span>
                    </div>
                    <span className="text-xs uppercase tracking-wider text-[#aec7f6] font-semibold font-geist">
                      Personalized Reference
                    </span>
                  </div>
                  <h4 className="font-geist text-base font-bold mb-1">Need a custom official statement?</h4>
                  <p className="text-xs text-[#d6e3ff]/80 leading-relaxed mb-4">
                    Ask REX to extract citations, verify prerequisites, or compile a complete portfolio of approved policy clauses for formal submission.
                  </p>
                  <button
                    onClick={() => onOpenQuery('Can you compile an official summary of CIHE course completion requirements for my degree?')}
                    className="w-full bg-white text-[#000a1e] hover:bg-[#eff4ff] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    Initiate Policy Query
                  </button>
                </div>
              </aside>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
