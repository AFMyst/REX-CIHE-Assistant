import React, { useState } from 'react';
import { POLICY_GAPS, PolicyGap } from '../data/ciheKnowledgeBase';

export const AnalyticsView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'coverage' | 'referral' | 'retrieval'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'staff'>('all');
  const [termFilter, setTermFilter] = useState('Term 1 2026 (Active)');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filteredGaps = POLICY_GAPS.filter(gap => {
    if (activeFilter === 'coverage') return gap.classification.includes('No Source');
    if (activeFilter === 'referral') return gap.classification.includes('Referral');
    if (activeFilter === 'retrieval') return gap.classification.includes('Retrieval');
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f9ff] overflow-y-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-10 right-8 z-50 bg-[#000a1e] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[16px] text-[#86f2e4]">check_circle</span>
          {toastMessage}
        </div>
      )}

      <div className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-8 space-y-8 pb-32">
        {/* Top Control Bar / Dashboard Context */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#002147] text-white text-[11px] font-bold tracking-wider uppercase font-geist">
                Governance & Intelligence
              </span>
              <span className="text-[#c4c6cf]">•</span>
              <span className="text-[#006a61] text-xs font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                Zero Chunk Leakage Enforced
              </span>
            </div>
            <h1 className="font-geist text-2xl md:text-3xl font-bold text-[#000a1e] tracking-tight">
              Institutional Intelligence & RAG Governance
            </h1>
            <p className="text-xs md:text-sm text-[#44474e]">
              Holistic retrieval auditing, groundedness validation, and proactive policy content gap intelligence for CIHE Australia.
            </p>
          </div>

          {/* Scoping Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Term Selector */}
            <div className="flex items-center bg-white border border-[#c4c6cf]/40 px-3 py-1.5 rounded-xl shadow-sm text-xs">
              <span className="material-symbols-outlined text-[#44474e] text-[18px] mr-2">event_available</span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-[#74777f] uppercase font-semibold">Academic Term</span>
                <select
                  value={termFilter}
                  onChange={(e) => setTermFilter(e.target.value)}
                  className="bg-transparent font-semibold text-[#000a1e] focus:outline-none cursor-pointer"
                >
                  <option>Term 1 2026 (Active)</option>
                  <option>Term 3 2025</option>
                  <option>Term 2 2025</option>
                </select>
              </div>
            </div>

            {/* Role Filter */}
            <div className="flex items-center bg-white border border-[#c4c6cf]/40 p-1 rounded-xl shadow-sm text-xs">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  roleFilter === 'all' ? 'bg-[#002147] text-white shadow-sm' : 'text-[#44474e] hover:text-[#000a1e]'
                }`}
              >
                All Roles
              </button>
              <button
                onClick={() => setRoleFilter('student')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  roleFilter === 'student' ? 'bg-[#002147] text-white shadow-sm' : 'text-[#44474e] hover:text-[#000a1e]'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setRoleFilter('staff')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  roleFilter === 'staff' ? 'bg-[#002147] text-white shadow-sm' : 'text-[#44474e] hover:text-[#000a1e]'
                }`}
              >
                Staff
              </button>
            </div>

            {/* Action Group */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('Compiled and exported TEQSA Compliance Audit Pack (ZIP)')}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#002147] rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[17px]">download</span>
                <span>TEQSA Audit Pack</span>
              </button>
              <button
                onClick={() => showToast('Real-time audit log stream active (3,428 traces)')}
                className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#eff4ff] border border-[#c4c6cf]/40 text-[#002147] rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[17px]">receipt_long</span>
                <span>Logs</span>
              </button>
            </div>
          </div>
        </div>

        {/* Compliance Callout Strip */}
        <div className="w-full bg-white border border-[#c4c6cf]/40 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#86f2e4]/30 text-[#006f66] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">shield</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#000a1e] font-geist">
                Data-Minimisation & Australian Privacy Principles Protocol
              </p>
              <p className="text-[11px] text-[#44474e]">
                All query traces de-identified & stripped of student identifiers before persistence. Zero semantic retention of conversational PII.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end md:self-center shrink-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eff4ff] text-[#002147] text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006a61]"></span>
              Strict Role Isolation Active
            </span>
            <span className="text-[11px] text-[#74777f] font-mono">APP 11 Compliant</span>
          </div>
        </div>

        {/* 6 Headline KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Total Queries */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-[#c4c6cf]/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[#74777f]">
                <span className="text-[11px] uppercase tracking-wider font-semibold font-geist">Total Queries</span>
                <span className="material-symbols-outlined text-[18px]">query_stats</span>
              </div>
              <div className="pt-2">
                <span className="font-geist text-2xl md:text-3xl font-bold text-[#000a1e]">14,820</span>
              </div>
            </div>
            <div className="pt-3 flex items-center justify-between text-[11px] border-t border-[#c4c6cf]/20 mt-2">
              <span className="text-[#006a61] font-bold">+18.4%</span>
              <span className="text-[#74777f]">vs Term 3 2025</span>
            </div>
          </div>

          {/* Cited Answers */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-[#c4c6cf]/30 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#006a61]"></div>
            <div>
              <div className="flex items-center justify-between text-[#74777f]">
                <span className="text-[11px] uppercase tracking-wider font-semibold font-geist">Cited Answers</span>
                <span className="material-symbols-outlined text-[#006a61] text-[18px]">verified</span>
              </div>
              <div className="pt-2 flex items-baseline gap-2">
                <span className="font-geist text-2xl md:text-3xl font-bold text-[#000a1e]">94.2%</span>
                <span className="text-[11px] text-[#006a61] font-bold">Pass</span>
              </div>
            </div>
            <div className="pt-3 flex items-center justify-between border-t border-[#c4c6cf]/20 mt-2">
              <div className="w-full bg-[#eff4ff] rounded-full h-1.5 overflow-hidden mr-2">
                <div className="bg-[#006a61] h-1.5 rounded-full" style={{ width: '94.2%' }}></div>
              </div>
              <span className="text-[10px] text-[#74777f] font-medium whitespace-nowrap">Target ≥90%</span>
            </div>
          </div>

          {/* Safe Fallback */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-[#c4c6cf]/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[#74777f]">
                <span className="text-[11px] uppercase tracking-wider font-semibold font-geist">Safe Fallback</span>
                <span className="material-symbols-outlined text-[#725c00] text-[18px]">shield_lock</span>
              </div>
              <div className="pt-2">
                <span className="font-geist text-2xl md:text-3xl font-bold text-[#000a1e]">5.8%</span>
              </div>
            </div>
            <div className="pt-3 flex items-center justify-between text-[11px] border-t border-[#c4c6cf]/20 mt-2">
              <span className="text-[#44474e]">860 Graceful</span>
              <span className="text-[#006a61] font-semibold">0% Hallucination</span>
            </div>
          </div>

          {/* Median Latency */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-[#c4c6cf]/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[#74777f]">
                <span className="text-[11px] uppercase tracking-wider font-semibold font-geist">Median Latency</span>
                <span className="material-symbols-outlined text-[18px]">speed</span>
              </div>
              <div className="pt-2 flex items-baseline gap-1.5">
                <span className="font-geist text-2xl md:text-3xl font-bold text-[#000a1e]">1.42s</span>
                <span className="text-[11px] text-[#74777f]">p50</span>
              </div>
            </div>
            <div className="pt-3 flex items-center justify-between text-[11px] border-t border-[#c4c6cf]/20 mt-2">
              <span className="text-[#74777f]">p95: 3.10s</span>
              <span className="text-[#006a61] font-semibold">&lt;10s SLA</span>
            </div>
          </div>

          {/* Cross-Role Leaks */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-[#c4c6cf]/30 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#86f2e4]"></div>
            <div>
              <div className="flex items-center justify-between text-[#74777f]">
                <span className="text-[11px] uppercase tracking-wider font-semibold font-geist">Cross-Role Leaks</span>
                <span className="material-symbols-outlined text-[#006a61] text-[18px]">gpp_good</span>
              </div>
              <div className="pt-2 flex items-baseline gap-2">
                <span className="font-geist text-2xl md:text-3xl font-bold text-[#006a61]">0</span>
                <span className="text-[11px] text-[#006a61] font-bold">100% Isolated</span>
              </div>
            </div>
            <div className="pt-3 flex items-center justify-between text-[11px] border-t border-[#c4c6cf]/20 mt-2">
              <span className="text-[#74777f]">Boundary tests:</span>
              <span className="font-semibold text-[#000a1e]">1,240 / 1,240</span>
            </div>
          </div>

          {/* Human Referral */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-[#c4c6cf]/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[#74777f]">
                <span className="text-[11px] uppercase tracking-wider font-semibold font-geist">Human Referral</span>
                <span className="material-symbols-outlined text-[18px]">contact_support</span>
              </div>
              <div className="pt-2">
                <span className="font-geist text-2xl md:text-3xl font-bold text-[#000a1e]">8.1%</span>
              </div>
            </div>
            <div className="pt-3 flex items-center justify-between text-[11px] border-t border-[#c4c6cf]/20 mt-2">
              <span className="text-[#74777f]">1,200 High-Consequence</span>
              <span className="text-[#002147] font-semibold">Assigned Desk</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: 30-Day Query Volume vs Grounding Rate */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-[#c4c6cf]/30 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#c4c6cf]/20">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#002147]"></span>
                  <h2 className="font-geist text-base md:text-lg font-bold text-[#000a1e]">
                    Daily Volume vs Grounding Correctness
                  </h2>
                </div>
                <p className="text-xs text-[#74777f]">
                  Dual-metric trajectory tracking RAG corpus recall and user query load over the active term.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#002147]"></span>
                  <span className="text-[#44474e]">Queries/day</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 rounded-full bg-[#006a61]"></span>
                  <span className="text-[#44474e]">Citation Grounding %</span>
                </div>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="w-full h-60 mt-4 relative flex items-end">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 200">
                {/* Horizontal reference lines */}
                <line x1="0" x2="600" y1="40" y2="40" stroke="#eff4ff" strokeWidth="1.5" />
                <line x1="0" x2="600" y1="80" y2="80" stroke="#eff4ff" strokeWidth="1.5" />
                <line x1="0" x2="600" y1="120" y2="120" stroke="#eff4ff" strokeWidth="1.5" />
                <line x1="0" x2="600" y1="160" y2="160" stroke="#eff4ff" strokeWidth="1.5" />

                {/* Bars */}
                <g fill="#dce9ff">
                  {[90, 105, 80, 95, 120, 130, 115, 110, 135, 145, 125, 140, 150, 155, 160, 142, 138, 130, 150, 158, 162, 165, 152, 148, 160, 170, 166, 158, 162].map((height, i) => {
                    const isLatest = i >= 25;
                    return (
                      <rect
                        key={i}
                        x={10 + i * 20}
                        y={200 - height}
                        width="12"
                        height={height}
                        rx="3"
                        fill={isLatest ? '#002147' : '#dce9ff'}
                      />
                    );
                  })}
                </g>

                {/* Grounding line curve */}
                <path
                  d="M 16 35 Q 80 32 150 28 T 290 22 T 430 20 T 576 16"
                  fill="none"
                  stroke="#006a61"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="150" cy="28" r="4" fill="#86f2e4" stroke="#006a61" strokeWidth="2" />
                <circle cx="290" cy="22" r="4" fill="#86f2e4" stroke="#006a61" strokeWidth="2" />
                <circle cx="430" cy="20" r="4" fill="#86f2e4" stroke="#006a61" strokeWidth="2" />
                <circle cx="576" cy="16" r="5" fill="#006a61" stroke="#ffffff" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex items-center justify-between pt-3 text-[11px] text-[#74777f] font-mono border-t border-[#c4c6cf]/20">
              <span>Day 1 (Feb 02)</span>
              <span>Day 10 (Census Prep)</span>
              <span>Day 20 (Week 4 Assessments)</span>
              <span className="text-[#000a1e] font-semibold">Today (Day 30)</span>
            </div>
          </div>

          {/* Right 1 Col: Evidence Quality Distribution */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#c4c6cf]/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#c4c6cf]/20">
                <h3 className="font-geist text-base font-bold text-[#000a1e]">Evidence Quality</h3>
                <span className="material-symbols-outlined text-[#006a61] text-[20px]">donut_large</span>
              </div>
              <p className="text-xs text-[#74777f] mt-1">Automated attribution & certainty breakdown.</p>
            </div>

            {/* Proportion Bar */}
            <div className="py-4 space-y-4">
              <div className="h-4 w-full rounded-full overflow-hidden flex bg-[#eff4ff] p-0.5">
                <div className="bg-[#006a61] h-full rounded-l-full" style={{ width: '82%' }}></div>
                <div className="bg-[#cba829] h-full mx-0.5" style={{ width: '12%' }}></div>
                <div className="bg-[#002147] h-full rounded-r-full" style={{ width: '6%' }}></div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff]">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#006a61]"></span>
                    <div>
                      <p className="text-xs font-bold text-[#000a1e]">Strong Evidence</p>
                      <p className="text-[10px] text-[#74777f]">Multiple approved chunks (Recall ≥0.85)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#000a1e]">82%</span>
                    <span className="block text-[10px] text-[#006a61] font-semibold">12,152</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff]">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#cba829]"></span>
                    <div>
                      <p className="text-xs font-bold text-[#000a1e]">Limited Evidence</p>
                      <p className="text-[10px] text-[#74777f]">Single source or low retrieval margin</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#000a1e]">12%</span>
                    <span className="block text-[10px] text-[#44474e]">1,778</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff]">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#002147]"></span>
                    <div>
                      <p className="text-xs font-bold text-[#000a1e]">Fallback / Referral</p>
                      <p className="text-[10px] text-[#74777f]">Ungrounded or high consequence outcome</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#000a1e]">6%</span>
                    <span className="block text-[10px] text-[#44474e]">890</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[#74777f] text-[11px] border-t border-[#c4c6cf]/20">
              <span>Model: CIHE Institutional RAG Engine</span>
              <span className="font-semibold text-[#006a61]">Zero Speculation</span>
            </div>
          </div>
        </div>

        {/* Content-Gap Analysis Panel */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-[#c4c6cf]/30 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#c4c6cf]/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#002147] text-[22px]">find_in_page</span>
                <h3 className="font-geist text-lg md:text-xl font-bold text-[#000a1e]">
                  Unanswered Questions & Institutional Policy Gaps
                </h3>
              </div>
              <p className="text-xs md:text-sm text-[#44474e] mt-0.5">
                Turning ungrounded queries into actionable governance insights. Automated clustering of fallbacks and high-consequence referrals requiring source updates.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[#74777f] font-medium mr-1">Filter Type:</span>
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeFilter === 'all' ? 'bg-[#002147] text-white' : 'bg-[#eff4ff] text-[#44474e] hover:bg-[#dce9ff]'
                }`}
              >
                All (24)
              </button>
              <button
                onClick={() => setActiveFilter('coverage')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeFilter === 'coverage' ? 'bg-[#002147] text-white' : 'bg-[#eff4ff] text-[#44474e] hover:bg-[#dce9ff]'
                }`}
              >
                No Source Coverage (11)
              </button>
              <button
                onClick={() => setActiveFilter('referral')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeFilter === 'referral' ? 'bg-[#002147] text-white' : 'bg-[#eff4ff] text-[#44474e] hover:bg-[#dce9ff]'
                }`}
              >
                Policy Referral (8)
              </button>
              <button
                onClick={() => setActiveFilter('retrieval')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeFilter === 'retrieval' ? 'bg-[#002147] text-white' : 'bg-[#eff4ff] text-[#44474e] hover:bg-[#dce9ff]'
                }`}
              >
                Retrieval Issues (5)
              </button>
            </div>
          </div>

          {/* Policy Gap Registry Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm border-separate border-spacing-y-2.5">
              <thead>
                <tr className="text-[#74777f] uppercase font-geist text-[11px] tracking-wider">
                  <th className="py-2 px-4 font-semibold">Frequent Query Category</th>
                  <th className="py-2 px-4 font-semibold">Trigger / Sample Student Question</th>
                  <th className="py-2 px-4 font-semibold text-center">Fallback Events</th>
                  <th className="py-2 px-4 font-semibold">Classification & Reason</th>
                  <th className="py-2 px-4 font-semibold">Recommended Governance Action</th>
                  <th className="py-2 px-4 font-semibold text-right">Priority & Assignee</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {filteredGaps.map((gap) => (
                  <tr key={gap.id} className="bg-[#eff4ff]/60 hover:bg-[#eff4ff] transition-colors rounded-xl">
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            gap.priority === 'HIGH' ? 'bg-[#ba1a1a]' : 'bg-[#cba829]'
                          }`}
                        ></span>
                        <span className="font-bold text-[#000a1e] font-geist">{gap.category}</span>
                      </div>
                      <span className="text-[11px] text-[#74777f] font-mono pl-4">{gap.code}</span>
                    </td>

                    <td className="py-3.5 px-4 align-top max-w-xs">
                      <p className="font-semibold text-[#000a1e]">“{gap.sampleQuestion}”</p>
                      <span className="text-[11px] text-[#74777f] block mt-0.5">Cluster: {gap.cluster}</span>
                    </td>

                    <td className="py-3.5 px-4 align-top text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          gap.priority === 'HIGH'
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : 'bg-white border border-[#c4c6cf]/40 text-[#000a1e]'
                        }`}
                      >
                        {gap.fallbackCount} events
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#c4c6cf]/40 text-[#000a1e] text-xs font-semibold">
                        <span className="material-symbols-outlined text-[14px] text-[#006a61]">policy</span>
                        {gap.classification}
                      </span>
                      <p className="text-[11px] text-[#74777f] mt-1">{gap.classificationReason}</p>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <p className="text-xs font-bold text-[#000a1e]">{gap.recommendedAction}</p>
                      <span className="text-[11px] text-[#44474e]">{gap.actionDetails}</span>
                    </td>

                    <td className="py-3.5 px-4 align-top text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          gap.priority === 'HIGH'
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : 'bg-[#ffe081] text-[#725c00]'
                        }`}
                      >
                        {gap.priority}
                      </span>
                      <p className="text-[11px] text-[#44474e] font-semibold mt-1">{gap.assignee}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#c4c6cf]/20 text-xs">
            <span className="text-[#74777f]">Showing {filteredGaps.length} actionable policy gap clusters</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => showToast('Dispatched Jira tickets to Dean of Studies and Registrar')}
                className="px-4 py-2 bg-white hover:bg-[#eff4ff] border border-[#c4c6cf]/40 text-[#000a1e] rounded-xl font-semibold transition-colors shadow-sm"
              >
                Assign Governance Tickets
              </button>
              <button
                onClick={() => showToast('Redirecting to Staff Ingestion Desk with clarifying schema')}
                className="px-4 py-2 bg-[#000a1e] text-white rounded-xl font-semibold hover:bg-[#002147] transition-colors shadow-sm"
              >
                Ingest Clarifying Sources
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
