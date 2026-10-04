import React, { useState } from 'react';
import { CIHELogo } from './CIHELogo';

interface WelcomeViewProps {
  onSelectPrompt: (prompt: string) => void;
  onSubmitPrompt: (prompt: string) => void;
  onNavigateToCategory?: (category: string) => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onSelectPrompt,
  onSubmitPrompt,
  onNavigateToCategory,
}) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    onSubmitPrompt(inputVal.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex flex-col relative h-full overflow-y-auto bg-[#f8f9ff]">
      {/* Scrollable Canvas */}
      <div className="flex-1 w-full max-w-[1040px] mx-auto px-4 md:px-8 py-8 md:py-14 flex flex-col items-center pb-48">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center space-y-3 mb-8 md:mb-12">
          <CIHELogo size={76} rounded="rounded-2xl" className="shadow-lg border-2 border-white ring-1 ring-blue-900/15 mb-2 hover:scale-105 transition-transform" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eff4ff] border border-[#002147]/10 text-xs font-semibold text-[#002147]">
            <span>TEQSA PRV12014 · CRICOS 03782F</span>
            <span>•</span>
            <span>8 Campuses (NSW · ACT · WA)</span>
          </div>
          <h1 className="font-geist text-3xl md:text-5xl font-black text-[#000a1e] tracking-tight">
            REX: Your AI University Assistant
          </h1>
          <p className="font-sans text-sm md:text-base text-[#44474e] max-w-2xl leading-relaxed">
            Institutional intelligence for Crown Institute of Higher Education, strictly grounded in official university regulations, 8 campuses, degree accreditations, and 2026 census deadlines.
          </p>
        </section>

        {/* Multi-Campus & Institutional Highlights Strip */}
        <div className="w-full max-w-[880px] mb-6 p-4 rounded-2xl bg-white border border-[#c4c6cf]/30 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-[#000a1e]">Multi-State Network:</span>
            <span className="text-[#44474e]">Sydney (North Sydney, CBD, Hurstville) · Canberra (ACT) · Perth (WA)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#44474e]">Student Services:</span>
            <a href="tel:1300171094" className="font-bold text-[#002147] hover:underline">
              📞 1300 171 094
            </a>
            <span className="text-[#c4c6cf]">|</span>
            <a href="tel:1800244431" className="font-bold text-red-700 hover:underline">
              🚨 1800 244 431
            </a>
          </div>
        </div>

        {/* Action Cards / Bento Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 w-full max-w-[880px]">
          {/* Card 1: Academic Programs & Degrees */}
          <button
            onClick={() => onNavigateToCategory ? onNavigateToCategory('courses-finder') : onSelectPrompt('What courses and degrees does CIHE offer?')}
            className="group text-left bg-white border border-[#c4c6cf]/40 rounded-2xl p-5 md:p-6 shadow-xs hover:shadow-md hover:border-[#002147]/50 transition-all duration-200 border-l-4 border-l-[#006a61] flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="mb-3 text-[#006a61] bg-[#86f2e4]/20 w-11 h-11 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">school</span>
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-geist text-base md:text-lg font-bold text-[#000a1e] group-hover:text-[#006a61] transition-colors">
                  Degrees & Programs
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#eff4ff] text-[#002147]">
                  ACS / CPA Accredited
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#44474e] leading-relaxed mt-1">
                Bachelor & Master of IT, Accounting, Business, and Early Childhood Education.
              </p>
            </div>
            <div className="mt-4 flex items-center text-[#006a61] text-xs font-semibold opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              Explore Courses & Fees <span className="material-symbols-outlined text-[15px] ml-1">arrow_forward</span>
            </div>
          </button>

          {/* Card 2: Multi-Campus Directory */}
          <button
            onClick={() => onNavigateToCategory ? onNavigateToCategory('campuses-explorer') : onSelectPrompt('Where are CIHE campuses located across Sydney, Canberra, and Perth?')}
            className="group text-left bg-white border border-[#c4c6cf]/40 rounded-2xl p-5 md:p-6 shadow-xs hover:shadow-md hover:border-[#002147]/50 transition-all duration-200 border-l-4 border-l-[#002147] flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="mb-3 text-[#002147] bg-[#d6e3ff] w-11 h-11 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">location_on</span>
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-geist text-base md:text-lg font-bold text-[#000a1e] group-hover:text-[#002147] transition-colors">
                  8 Campuses Directory
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                  New West Perth
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#44474e] leading-relaxed mt-1">
                North Sydney HQ, Sydney CBD, Hurstville, Canberra (ACT), and West Perth (WA).
              </p>
            </div>
            <div className="mt-4 flex items-center text-[#002147] text-xs font-semibold opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              Locate Campuses & Transit <span className="material-symbols-outlined text-[15px] ml-1">arrow_forward</span>
            </div>
          </button>

          {/* Card 3: Academic Calendar & Census Dates */}
          <button
            onClick={() => onNavigateToCategory ? onNavigateToCategory('academic-calendar') : onSelectPrompt('When is the Trimester 1 Census Date and tuition refund cutoff?')}
            className="group text-left bg-white border border-[#c4c6cf]/40 rounded-2xl p-5 md:p-6 shadow-xs hover:shadow-md hover:border-[#002147]/50 transition-all duration-200 border-l-4 border-l-[#cba829] flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="mb-3 text-[#725c00] bg-[#cba829]/20 w-11 h-11 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">calendar_month</span>
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-geist text-base md:text-lg font-bold text-[#000a1e] group-hover:text-[#725c00] transition-colors">
                  Calendar & Deadlines
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                  Census 27 Mar
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#44474e] leading-relaxed mt-1">
                Statutory census dates, 100% refund cutoffs, and exam periods for Trimesters 1, 2, and Summer.
              </p>
            </div>
            <div className="mt-4 flex items-center text-[#725c00] text-xs font-semibold opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              Check 2026 Deadlines <span className="material-symbols-outlined text-[15px] ml-1">arrow_forward</span>
            </div>
          </button>

          {/* Card 4: International Student Support & Visas */}
          <button
            onClick={() => onSelectPrompt('What are the international student visa Subclass 500 work limits and OSHC rules?')}
            className="group text-left bg-white border border-[#c4c6cf]/40 rounded-2xl p-5 md:p-6 shadow-xs hover:shadow-md hover:border-[#002147]/50 transition-all duration-200 border-l-4 border-l-[#725c00] flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="mb-3 text-[#006f66] bg-[#89f5e7]/30 w-11 h-11 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">public</span>
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-geist text-base md:text-lg font-bold text-[#000a1e] group-hover:text-[#006f66] transition-colors">
                  Visa & Compliance
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#eff4ff] text-[#002147]">
                  Subclass 500
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#44474e] leading-relaxed mt-1">
                ESOS Act compliance, 48-hour fortnightly work limits, and OSHC healthcare coverage.
              </p>
            </div>
            <div className="mt-4 flex items-center text-[#006f66] text-xs font-semibold opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              Visa Requirements <span className="material-symbols-outlined text-[15px] ml-1">arrow_forward</span>
            </div>
          </button>
        </section>
      </div>

      {/* Sticky Bottom Composer */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-gradient-to-t from-[#f8f9ff] via-[#f8f9ff]/95 to-transparent pt-8 pb-6 px-4 md:px-8 z-30">
        <div className="w-full max-w-[760px] mx-auto">
          {/* Suggestion Chips */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 mb-3 pb-1 justify-start md:justify-center">
            <button
              onClick={() => onSelectPrompt('Where are CIHE campuses located?')}
              className="whitespace-nowrap px-3.5 py-1.5 bg-white text-[#000a1e] rounded-full text-xs font-medium border border-[#c4c6cf]/50 hover:bg-[#eff4ff] transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <span className="material-symbols-outlined text-[15px] text-[#002147]">location_on</span>
              8 Campus Locations
            </button>
            <button
              onClick={() => onSelectPrompt('What courses does CIHE offer?')}
              className="whitespace-nowrap px-3.5 py-1.5 bg-white text-[#000a1e] rounded-full text-xs font-medium border border-[#c4c6cf]/50 hover:bg-[#eff4ff] transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <span className="material-symbols-outlined text-[15px] text-[#006a61]">school</span>
              Degrees & Accreditations
            </button>
            <button
              onClick={() => onSelectPrompt('What is the tuition fee for the Bachelor of IT?')}
              className="whitespace-nowrap px-3.5 py-1.5 bg-white text-[#000a1e] rounded-full text-xs font-medium border border-[#c4c6cf]/50 hover:bg-[#eff4ff] transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <span className="material-symbols-outlined text-[15px] text-[#725c00]">payments</span>
              Tuition Fees 2026
            </button>
            <button
              onClick={() => onSelectPrompt('When is the Trimester 1 Census Date?')}
              className="whitespace-nowrap px-3.5 py-1.5 bg-white text-[#000a1e] rounded-full text-xs font-medium border border-[#c4c6cf]/50 hover:bg-[#eff4ff] transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <span className="material-symbols-outlined text-[15px] text-[#002147]">timer</span>
              Census Deadlines
            </button>
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#c4c6cf]/60 rounded-2xl shadow-[0_12px_32px_rgba(0,33,71,0.08)] p-2 flex items-center gap-2 focus-within:border-[#002147] focus-within:ring-2 focus-within:ring-[#002147]/20 transition-all"
          >
            <button
              type="button"
              className="p-2 text-[#44474e] hover:text-[#002147] rounded-xl hover:bg-[#eff4ff] transition-colors"
              title="Attach document or inquiry"
            >
              <span className="material-symbols-outlined text-[22px]">add_circle</span>
            </button>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask REX about CIHE policies, degrees, campuses, or deadlines..."
              className="flex-1 bg-transparent border-none focus:outline-none text-sm md:text-base text-[#0b1c30] placeholder:text-[#74777f] px-2 py-2"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="w-10 h-10 rounded-xl bg-[#000a1e] text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#002147] active:scale-95 shadow-sm"
              title="Ask REX"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
            </button>
          </form>

          <p className="text-center mt-2.5 text-[11px] text-[#74777f]">
            REX AI Assistant · Grounded in official CIHE handbooks & regulations · Dial 1300 171 094
          </p>
        </div>
      </div>
    </div>
  );
};
