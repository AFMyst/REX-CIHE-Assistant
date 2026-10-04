import React, { useState } from 'react';
import { CIHE_CALENDAR, CIHECalendarEvent } from '../data/ciheKnowledgeBase';

interface AcademicCalendarViewProps {
  onAskRexAboutDeadlines: (topic: string) => void;
}

export const AcademicCalendarView: React.FC<AcademicCalendarViewProps> = ({ onAskRexAboutDeadlines }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL');

  const filteredEvents = CIHE_CALENDAR.filter(e => {
    return selectedPeriod === 'ALL' || e.period === selectedPeriod;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f9ff] overflow-y-auto">
      {/* Top Header */}
      <div className="bg-white border-b border-[#c4c6cf]/30 px-6 py-4 sticky top-0 z-10 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#002147] tracking-wider uppercase bg-[#eff4ff] px-2 py-0.5 rounded border border-[#002147]/10 font-geist">
                Statutory Timetable · Census & Examination Schedules
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#000a1e] tracking-tight mt-1 font-geist">
              CIHE Academic Calendar & Deadlines Tracker
            </h1>
          </div>

          {/* Quick Registry Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onAskRexAboutDeadlines('Trimester 1 Census Date and refund rules')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#000a1e] text-white text-xs font-semibold hover:bg-[#002147] transition shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-300">chat</span>
              <span>Ask REX About Deadlines</span>
            </button>
          </div>
        </div>

        {/* Filter Period Tabs */}
        <div className="max-w-7xl mx-auto mt-4 flex items-center gap-2 text-xs">
          {['ALL', 'Trimester 1, 2026', 'Trimester 2, 2026', 'Summer Intake, 2026-2027'].map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-xl font-semibold transition ${
                selectedPeriod === period
                  ? 'bg-[#002147] text-white shadow-xs'
                  : 'bg-[#eff4ff] text-[#44474e] hover:text-[#000a1e]'
              }`}
            >
              {period === 'ALL' ? 'Full Academic Year 2026' : period}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6 w-full">
        {/* Critical Statutory Census Alert Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#002147] to-[#003875] text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-[#000a1e] uppercase">
                High Consequence Statutory Date
              </span>
              <span className="text-xs text-blue-200">Higher Education Support Act (HESA)</span>
            </div>
            <h3 className="text-lg font-bold font-geist">
              Trimester 1 Statutory Census Date: Friday, 27 March 2026 (11:59 PM AEDT)
            </h3>
            <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
              Before this cutoff, students can withdraw with a <strong>100% tuition refund</strong> and no academic penalty recorded on their official transcript. Withdrawals past this date forfeit 100% of subject tuition fees.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={() => onAskRexAboutDeadlines('How to withdraw before Census Date without penalty')}
              className="px-4 py-2 rounded-xl bg-white text-[#002147] text-xs font-bold font-geist hover:bg-blue-50 transition shadow-xs text-center"
            >
              Check Refund Rules
            </button>
          </div>
        </div>

        {/* Milestone Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className={`p-5 rounded-2xl border transition-all ${
                event.isCrucialDeadline
                  ? 'bg-white border-amber-400/80 ring-2 ring-amber-400/10 shadow-md'
                  : 'bg-white border-[#c4c6cf]/30 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#002147] bg-[#eff4ff] px-2 py-0.5 rounded">
                  {event.period}
                </span>
                {event.isCrucialDeadline && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    Mandatory Cutoff
                  </span>
                )}
              </div>

              <h4 className="text-base font-bold text-[#000a1e] mt-2 font-geist">
                {event.title}
              </h4>
              <p className="text-xs font-semibold text-[#002147] mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">event</span>
                <span>{event.dateRange}</span>
              </p>
              <p className="text-xs text-[#44474e] mt-2 leading-relaxed">
                {event.description}
              </p>

              <div className="mt-4 pt-3 border-t border-[#c4c6cf]/20 flex items-center justify-between">
                <span className="text-[11px] text-[#74777f] capitalize">
                  Type: {event.category}
                </span>
                <button
                  onClick={() => onAskRexAboutDeadlines(event.title)}
                  className="text-xs font-semibold text-[#002147] hover:underline"
                >
                  Verify Clause ↗
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Penalty Policy Matrix */}
        <div className="p-6 rounded-2xl bg-white border border-[#c4c6cf]/30 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#000a1e] font-geist">
                Tuition Refund & Withdrawal Liability Matrix
              </h3>
              <p className="text-xs text-[#44474e]">Official CIHE Financial Regulations (DOC-CIHE-2026-FN-01)</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#c4c6cf]/30 bg-[#eff4ff]">
                  <th className="py-2.5 px-3 font-bold text-[#000a1e]">Withdrawal Timing</th>
                  <th className="py-2.5 px-3 font-bold text-[#000a1e]">Financial Liability</th>
                  <th className="py-2.5 px-3 font-bold text-[#000a1e]">Academic Transcript Status</th>
                  <th className="py-2.5 px-3 font-bold text-[#000a1e]">Required Documentation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c4c6cf]/20">
                <tr className="hover:bg-[#f8f9ff]">
                  <td className="py-2.5 px-3 font-medium text-[#000a1e]">Prior to Census Date</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">100% Refund (0% Penalty)</td>
                  <td className="py-2.5 px-3 text-[#44474e]">No record on transcript</td>
                  <td className="py-2.5 px-3 text-[#44474e]">Form REG-WDL-01 via Student Portal</td>
                </tr>
                <tr className="hover:bg-[#f8f9ff]">
                  <td className="py-2.5 px-3 font-medium text-[#000a1e]">Post Census Date (Standard)</td>
                  <td className="py-2.5 px-3 text-red-700 font-bold">0% Refund (100% Fee Forfeited)</td>
                  <td className="py-2.5 px-3 text-red-700 font-semibold">Withdrawn Fail (WF) recorded</td>
                  <td className="py-2.5 px-3 text-[#44474e]">Late withdrawal notification</td>
                </tr>
                <tr className="hover:bg-[#f8f9ff]">
                  <td className="py-2.5 px-3 font-medium text-[#000a1e]">Post Census with Compassionate Grounds</td>
                  <td className="py-2.5 px-3 text-[#002147] font-semibold">Special Consideration Fee Remission</td>
                  <td className="py-2.5 px-3 text-[#002147] font-semibold">Withdrawn without Academic Penalty (W)</td>
                  <td className="py-2.5 px-3 text-[#44474e]">Registered Medical Practitioner Cert + Form REG-04</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
