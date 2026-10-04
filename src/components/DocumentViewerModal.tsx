import React from 'react';
import { CIHEDocument } from '../data/ciheKnowledgeBase';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentCode?: string;
  version?: string;
  page?: number | string;
  highlightedQuote?: string;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  documentCode = 'DOC-CIHE-2026-POL-04',
  version = 'v2025.10',
  page = 4,
  highlightedQuote
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#000a1e]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Viewer Bar */}
        <div className="h-16 bg-[#002147] text-white px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-[#86f2e4]">
              <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm truncate font-geist">{documentTitle}</h3>
              <p className="text-xs text-[#d6e3ff]/70 font-mono truncate">{documentCode} • Version {version}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 text-xs text-[#86f2e4] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#86f2e4]"></span>
              TEQSA PRV12014 Verified
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              title="Close Viewer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="h-12 bg-[#eff4ff] border-b border-[#c4c6cf]/40 px-6 flex items-center justify-between text-xs text-[#44474e]">
          <div className="flex items-center gap-4">
            <span className="font-medium text-[#0b1c30]">Page {page} of 28</span>
            <div className="h-4 w-px bg-[#c4c6cf]/60"></div>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-[#dce9ff] rounded transition-colors" title="Previous Page">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button className="p-1 hover:bg-[#dce9ff] rounded transition-colors" title="Next Page">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-[#dce9ff] text-[#006a61] font-semibold transition-colors">
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Download PDF</span>
            </button>
            <button className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-[#dce9ff] text-[#0b1c30] transition-colors">
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* PDF Simulated Canvas */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#f8f9ff] flex justify-center">
          <div className="w-full max-w-2xl bg-white shadow-md border border-[#c4c6cf]/30 rounded-lg p-8 sm:p-12 text-[#0b1c30] font-serif space-y-6 leading-relaxed">
            {/* Header in doc */}
            <div className="border-b border-[#0b1c30]/20 pb-4 flex justify-between items-start text-xs font-sans text-[#44474e]">
              <div>
                <p className="font-bold text-sm text-[#002147] tracking-tight">CROWN INSTITUTE OF HIGHER EDUCATION</p>
                <p>Academic Governance & Regulations Manual • Section 7.2</p>
              </div>
              <div className="text-right font-mono">
                <p>{documentCode}</p>
                <p>Adopted Nov 2025</p>
              </div>
            </div>

            <h2 className="text-xl font-bold font-sans text-[#002147]">
              Section 7.4: Special Consideration and Assessment Provisions
            </h2>

            <p className="text-sm">
              7.4.1 Preamble: Crown Institute of Higher Education recognises that students may experience sudden, unforeseen, and severe circumstances beyond their reasonable control that significantly impair their ability to complete an assessment task or attend an examination.
            </p>

            {highlightedQuote ? (
              <div className="p-4 bg-[#86f2e4]/20 border-l-4 border-[#006a61] my-4 rounded-r text-sm font-sans font-medium text-[#006a61]">
                <div className="text-[11px] uppercase tracking-wider font-bold text-[#006a61] mb-1">
                  Retrieved Passage (Grounding Citation):
                </div>
                "{highlightedQuote}"
              </div>
            ) : (
              <div className="p-4 bg-[#86f2e4]/20 border-l-4 border-[#006a61] my-4 rounded-r text-sm font-sans font-medium text-[#006a61]">
                <div className="text-[11px] uppercase tracking-wider font-bold text-[#006a61] mb-1">
                  Retrieved Passage (Grounding Citation):
                </div>
                "Clause 7.2.1: Applications for special consideration must be lodged within three (3) working days of the scheduled assessment date, accompanied by a registered practitioner medical certificate stating the impact on performance."
              </div>
            )}

            <p className="text-sm">
              7.4.2 Non-Compensable Events: Applications for Special Consideration will be declined where the circumstances relate to routine misadventure, transport delays, employment commitments, vacation plans, or irregular sleep schedules (such as oversleeping). Students must provide verifiable external documentation from an AHPRA-registered healthcare practitioner.
            </p>

            <p className="text-sm">
              7.4.3 Procedure for Lodgement: The applicant must complete Form REG-04 (Application for Special Consideration) and lodge the submission directly with the Registry Desk or electronically to registry@cihe.edu.au within the stipulated 3-working-day timeframe.
            </p>

            <div className="pt-8 border-t border-[#0b1c30]/10 flex justify-between text-xs text-[#74777f] font-sans">
              <span>Page {page}</span>
              <span>Approved by CIHE Academic Board</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 bg-white border-t border-[#c4c6cf]/30 px-6 flex items-center justify-between text-xs text-[#44474e]">
          <span>Official CIHE Document Repository • Read-Only Viewer</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#002147] text-white rounded-lg hover:bg-[#000a1e] font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
