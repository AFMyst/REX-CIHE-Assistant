import React, { useState } from 'react';

interface HumanReferralViewProps {
  onStartChatWithQuery?: (query: string) => void;
}

export const HumanReferralView: React.FC<HumanReferralViewProps> = ({
  onStartChatWithQuery
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [bookingOfficer, setBookingOfficer] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleBookSlot = (officerName: string) => {
    setBookingOfficer(officerName);
    showToast(`15-minute consultation slot requested with ${officerName}. Calendar invite dispatched.`);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f9ff] overflow-y-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-10 right-8 z-50 bg-[#000a1e] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[16px] text-[#86f2e4]">check_circle</span>
          {toastMessage}
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6 pb-32">
        {/* Active Inquiry Header Context */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#eff4ff] text-[#002147] font-semibold text-xs font-geist">
              04
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#44474e] font-geist">
              Active Student Inquiry • Session #STU-8821
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#006a61]"></span>
            <span className="text-xs text-[#44474e] font-medium">Live Regulatory Mode: ESOS / TEQSA</span>
          </div>
        </div>

        {/* 2-Column Split Workspace */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols) */}
          <section className="xl:col-span-7 flex flex-col space-y-6">
            {/* User Query Bubble */}
            <div className="flex justify-end">
              <div className="max-w-xl bg-[#000a1e] text-white rounded-2xl rounded-tr-sm p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2 text-xs">
                  <span className="text-[#aec7f6] uppercase tracking-wider font-semibold">
                    Student • CIHE International
                  </span>
                  <span className="text-[#d6e3ff]/70">14:28 AEDT</span>
                </div>
                <p className="text-sm md:text-base leading-relaxed text-white">
                  I missed two compulsory tutorials and failed one unit. Will my student visa be cancelled immediately?
                </p>
              </div>
            </div>

            {/* High-Consequence Regulatory Decision Notice */}
            <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-md border-l-4 border-[#cba829] space-y-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#ffe081] text-[#725c00] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">gavel</span>
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#cba829]/20 text-[#725c00] text-xs uppercase font-bold tracking-wide font-geist">
                      Regulatory Decision Notice
                    </span>
                    <span className="text-xs text-[#74777f]">ESOS Act 2000 Protocol</span>
                  </div>
                  <h2 className="font-geist text-lg md:text-xl font-bold text-[#000a1e] tracking-tight">
                    This question requires a formal CIHE decision.
                  </h2>
                  <p className="text-xs md:text-sm text-[#44474e] leading-relaxed">
                    REX can explain published academic progression and attendance policies, but <strong className="text-[#000a1e] font-semibold">CANNOT determine individual enrolment, visa status, or progression outcomes.</strong> Formal decisions rest solely with the Academic Board and the Australian Department of Home Affairs.
                  </p>
                </div>
              </div>
            </div>

            {/* Evidence-Grounded Policy Explanation */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#c4c6cf]/30 space-y-5">
              <div className="flex items-center justify-between border-b border-[#c4c6cf]/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#006a61] text-white flex items-center justify-center font-bold text-xs font-geist">
                    R
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#000a1e] font-geist">REX Response</span>
                    <span className="text-xs text-[#74777f] ml-2">Grounding: Authoritative Corpus</span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#86f2e4]/30 text-[#006f66]">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  <span className="text-xs font-semibold">Strong Evidence (Published Framework)</span>
                </div>
              </div>

              <div className="space-y-3 text-xs md:text-sm text-[#0b1c30] leading-relaxed">
                <p>
                  Under standard Australian Higher Education visa conditions (Subclass 500) and CIHE institutional regulations, <strong className="text-[#000a1e] font-semibold">a visa is not cancelled automatically or immediately</strong> by CIHE following missing two tutorials or failing a single unit.
                </p>
                <p>
                  However, student visa holders must maintain both satisfactory course attendance and academic progression. CIHE follows a mandatory staged intervention process before any formal escalation to PRISMS:
                </p>
              </div>

              {/* Mandatory 3-Stage Intervention Framework */}
              <div className="p-4 rounded-xl bg-[#eff4ff] space-y-3 border border-[#c4c6cf]/30">
                <span className="text-xs uppercase font-bold tracking-wider text-[#002147] block font-geist">
                  Mandatory 3-Stage Intervention Framework
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-[#c4c6cf]/30">
                    <span className="text-xs font-bold text-[#006a61] block mb-1">01 · Stage 1 Flag</span>
                    <p className="text-[11px] text-[#44474e] leading-snug">Early academic intervention & study plan review with course coordinator.</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-[#c4c6cf]/30">
                    <span className="text-xs font-bold text-[#725c00] block mb-1">02 · Formal Notice</span>
                    <p className="text-[11px] text-[#44474e] leading-snug">Notice of Intention to Report (ITR) issued only if progression thresholds fail across consecutive terms.</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-[#c4c6cf]/30">
                    <span className="text-xs font-bold text-[#002147] block mb-1">03 · 20-Day Appeals</span>
                    <p className="text-[11px] text-[#44474e] leading-snug">Strict 20-working-day internal appeal window prior to any federal reporting.</p>
                  </div>
                </div>
              </div>

              {/* Citation Link */}
              <div className="p-3.5 rounded-xl bg-[#eff4ff] flex items-center justify-between gap-3 border border-[#c4c6cf]/30">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#002147] text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#000a1e] truncate font-geist">
                      CIHE International Student Compliance Framework
                    </div>
                    <div className="text-[11px] text-[#44474e]">
                      Version 2025.2 · Section 4.3 & 4.7 · Page 9 (Attendance & Academic Interventions)
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Opened International Compliance Framework v2025.2')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-[#dce9ff] text-[#002147] text-xs font-semibold transition-colors shrink-0 shadow-sm border border-[#c4c6cf]/30"
                >
                  <span>View Source</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </button>
              </div>

              {/* Recommended Immediate Actions */}
              <div className="space-y-2 pt-1">
                <span className="text-xs uppercase font-bold tracking-wider text-[#000a1e] font-geist">
                  Recommended Immediate Actions
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => handleBookSlot('Sarah Nankervis')}
                    className="p-3 rounded-xl bg-[#000a1e] text-white flex flex-col justify-between hover:bg-[#002147] transition-all text-left shadow-sm group active:scale-95"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="material-symbols-outlined text-[20px] text-[#86f2e4]">support_agent</span>
                      <span className="material-symbols-outlined text-[16px] opacity-60 group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                    </div>
                    <div>
                      <span className="font-bold block font-geist">International Liaison</span>
                      <span className="text-[11px] text-[#aec7f6]">Official Student Advisory</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleBookSlot('Dr. David Chen')}
                    className="p-3 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#002147] flex flex-col justify-between transition-all text-left border border-[#c4c6cf]/30 group active:scale-95"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="material-symbols-outlined text-[20px] text-[#002147]">calendar_month</span>
                      <span className="material-symbols-outlined text-[16px] text-[#74777f] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                    </div>
                    <div>
                      <span className="font-bold block font-geist">Academic Advising</span>
                      <span className="text-[11px] text-[#44474e]">Book mandatory session</span>
                    </div>
                  </button>

                  <button
                    onClick={() => showToast('Downloaded Form REG-11: Formal Show Cause Appeal (PDF)')}
                    className="p-3 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#002147] flex flex-col justify-between transition-all text-left border border-[#c4c6cf]/30 group active:scale-95"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="material-symbols-outlined text-[20px] text-[#002147]">download</span>
                      <span className="material-symbols-outlined text-[16px] text-[#74777f] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                    </div>
                    <div>
                      <span className="font-bold block font-geist">Form REG-11</span>
                      <span className="text-[11px] text-[#44474e]">Show Cause Appeal (PDF)</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Support Desk & Designated Officers (5 cols) */}
          <aside className="xl:col-span-5 flex flex-col space-y-6">
            {/* Escalation Desk Master Header Card */}
            <div className="rounded-2xl bg-[#000a1e] text-white p-6 shadow-md relative overflow-hidden border border-[#002147]">
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#006a61] text-white text-[10px] uppercase font-bold tracking-wider font-geist">
                    Immediate Case Escalation
                  </span>
                  <span className="text-xs text-[#aec7f6]">Floor 2, Student Hub</span>
                </div>
                <h3 className="font-geist text-xl font-bold tracking-tight text-white">
                  Official Human Escalation & Support Desk
                </h3>
                <p className="text-xs text-[#d6e3ff]/80 leading-relaxed">
                  International student visa and progression matters are overseen by qualified institutional officers. Connect directly to preserve your official rights and compliance status.
                </p>
              </div>
            </div>

            {/* Designated Officers Card */}
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-[#c4c6cf]/30 space-y-4">
              <div className="flex items-center justify-between border-b border-[#c4c6cf]/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a61] text-[20px]">badge</span>
                  <span className="text-xs uppercase font-bold tracking-wider text-[#000a1e] font-geist">
                    Designated Compliance Officers
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-[#006a61] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#006a61]"></span> 2 On Campus Today
                </span>
              </div>

              {/* Officer 1: Sarah Nankervis */}
              <div className="p-3.5 rounded-xl bg-[#eff4ff] space-y-2.5 border border-[#c4c6cf]/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold text-xs font-geist">
                      SN
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#000a1e] block font-geist">Sarah Nankervis</span>
                      <span className="text-[11px] text-[#44474e]">Senior International Student Liaison</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#86f2e4]/30 text-[#006f66] text-[10px] font-bold">
                    Available
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#44474e] pt-1 border-t border-[#c4c6cf]/20">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#002147]">location_on</span>
                    <span>Room 2.14, Level 2</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#002147]">schedule</span>
                    <span>10:00 - 16:30 AEDT</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="mailto:liaison.international@cihe.edu.au"
                    className="flex-1 py-1.5 rounded-lg bg-white hover:bg-[#dce9ff] text-center text-xs font-semibold text-[#002147] transition-colors border border-[#c4c6cf]/30 shadow-sm"
                  >
                    Email Officer
                  </a>
                  <button
                    onClick={() => handleBookSlot('Sarah Nankervis')}
                    className="flex-1 py-1.5 rounded-lg bg-[#000a1e] text-white hover:bg-[#002147] text-center text-xs font-semibold transition-colors shadow-sm"
                  >
                    Book Today (15m)
                  </button>
                </div>
              </div>

              {/* Officer 2: Dr. David Chen */}
              <div className="p-3.5 rounded-xl bg-[#eff4ff] space-y-2.5 border border-[#c4c6cf]/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#cbdbf5] text-[#002147] flex items-center justify-center font-bold text-xs font-geist">
                      DC
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#000a1e] block font-geist">Dr. David Chen</span>
                      <span className="text-[11px] text-[#44474e]">Academic Registrar & Progression Chair</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#e5eeff] text-[#002147] text-[10px] font-bold">
                    Next: 15:30
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#44474e] pt-1 border-t border-[#c4c6cf]/20">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#002147]">location_on</span>
                    <span>Registry Desk 4</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#002147]">call</span>
                    <a href="tel:1300171094" className="hover:underline">1300 171 094</a>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleBookSlot('Dr. David Chen')}
                    className="w-full py-1.5 rounded-lg bg-white hover:bg-[#dce9ff] text-center text-xs font-semibold text-[#002147] transition-colors border border-[#c4c6cf]/30 shadow-sm"
                  >
                    Request Case Review Slot
                  </button>
                </div>
              </div>
            </div>

            {/* Official Handbooks & Forms */}
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-[#c4c6cf]/30 space-y-3">
              <div className="flex items-center justify-between border-b border-[#c4c6cf]/20 pb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-[#000a1e] font-geist">
                  Official Handbooks & Forms
                </span>
                <span className="text-xs text-[#74777f]">Current Corpus</span>
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => showToast('Downloaded Form REG-11: Formal Show Cause Appeal')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#eff4ff] transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="material-symbols-outlined text-[#006a61] text-[18px]">description</span>
                      <div className="min-w-0">
                        <span className="font-bold text-[#000a1e] block truncate font-geist">
                          Form REG-11: Formal Show Cause Appeal
                        </span>
                        <span className="text-[11px] text-[#74777f]">PDF • Mandatory within 20 working days</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#74777f] text-[18px]">download</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => showToast('Opened International Student Handbook 2026')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#eff4ff] transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="material-symbols-outlined text-[#002147] text-[18px]">auto_stories</span>
                      <div className="min-w-0">
                        <span className="font-bold text-[#000a1e] block truncate font-geist">
                          International Student Handbook 2026
                        </span>
                        <span className="text-[11px] text-[#74777f]">Version 2026.1 • Comprehensive Guide</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#74777f] text-[18px]">open_in_new</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => showToast('Opened ESOS Act & National Code Summary 2025')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#eff4ff] transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="material-symbols-outlined text-[#002147] text-[18px]">policy</span>
                      <div className="min-w-0">
                        <span className="font-bold text-[#000a1e] block truncate font-geist">
                          ESOS Act & National Code Summary 2025
                        </span>
                        <span className="text-[11px] text-[#74777f]">Standard 8: Overseas Student Visas</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#74777f] text-[18px]">open_in_new</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Urgent Student Welfare Hotline */}
            <div className="rounded-2xl bg-[#eff4ff] p-4 flex items-center justify-between gap-4 border border-[#c4c6cf]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">emergency</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#ba1a1a] uppercase tracking-wide block font-geist">
                    Urgent Student Welfare
                  </span>
                  <span className="text-xs text-[#000a1e] font-medium">24/7 CIHE Emergency Assistance Hotline</span>
                </div>
              </div>
              <a
                href="tel:1800244431"
                className="px-3.5 py-2 rounded-xl bg-white font-geist text-xs font-bold text-[#000a1e] hover:bg-[#dce9ff] transition-colors shadow-sm shrink-0 border border-[#c4c6cf]/30"
              >
                1800 244 431
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
