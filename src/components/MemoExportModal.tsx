import React from 'react';
import { RAGResponse } from '../services/ragEngine';
import { CIHELogo } from './CIHELogo';

interface MemoExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  ragResponse: RAGResponse | null;
  queryText: string;
}

export const MemoExportModal: React.FC<MemoExportModalProps> = ({
  isOpen,
  onClose,
  ragResponse,
  queryText
}) => {
  if (!isOpen || !ragResponse) return null;

  const memoRefId = `CIHE-MEMO-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const timestamp = new Date().toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-[#c4c6cf]/40 overflow-hidden my-8">
        {/* Actions Bar */}
        <div className="bg-[#eff4ff] px-6 py-3 border-b border-[#c4c6cf]/30 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#002147] text-[18px]">verified_user</span>
            <span className="text-xs font-bold text-[#002147] font-geist uppercase tracking-wider">
              Official Institutional Verification Memorandum
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#000a1e] text-white text-xs font-semibold hover:bg-[#002147] transition shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px]">print</span>
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-black/5 text-[#44474e] transition"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Memo Content */}
        <div className="p-8 md:p-10 space-y-6 text-[#000a1e] bg-white">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-[#002147] pb-6">
            <div className="flex items-center gap-4">
              <CIHELogo size={56} rounded="rounded-xl" className="shadow-xs" />
              <div>
                <span className="text-2xl font-black tracking-tight text-[#002147] font-geist block leading-tight">
                  CROWN INSTITUTE
                </span>
                <span className="text-xs tracking-widest text-[#44474e] block uppercase font-bold">
                  OF HIGHER EDUCATION
                </span>
                <p className="text-[11px] text-[#74777f] mt-1">
                  TEQSA Provider ID: PRV12014 · CRICOS Code: 03782F · cihe.edu.au
                </p>
              </div>
            </div>

            <div className="text-right text-xs space-y-0.5">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px] uppercase font-geist">
                Grounding Verified
              </span>
              <p className="font-mono text-[11px] text-[#44474e] mt-1">{memoRefId}</p>
              <p className="text-[11px] text-[#74777f]">{timestamp}</p>
            </div>
          </div>

          {/* Inquiry Subject */}
          <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#c4c6cf]/30 space-y-1.5">
            <span className="text-[10px] font-bold text-[#002147] uppercase tracking-wider block font-geist">
              Formal Student Query Specification
            </span>
            <p className="text-sm font-semibold text-[#000a1e]">
              "{queryText}"
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#44474e] pt-1">
              <span>Authority Mode: <strong>Strict Evidence Retrieval</strong></span>
              <span>Grounding Confidence: <strong>{Math.round(ragResponse.confidence * 100)}%</strong></span>
              <span>Grounding Mode: <strong>Institutional RAG Protocol 4.2</strong></span>
            </div>
          </div>

          {/* Verified Institutional Statement */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#002147] uppercase tracking-wider block font-geist border-b border-[#c4c6cf]/20 pb-1">
              Executive Institutional Guidance & Statutory Synthesis
            </span>
            <div className="text-xs leading-relaxed space-y-2 whitespace-pre-line text-[#000a1e]">
              {ragResponse.answerText}
            </div>
          </div>

          {/* Citations Matrix */}
          {ragResponse.retrievedSources.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-[#002147] uppercase tracking-wider block font-geist border-b border-[#c4c6cf]/20 pb-1">
                Authoritative Primary Source Citations
              </span>
              <div className="space-y-2">
                {ragResponse.retrievedSources.map((src, idx) => (
                  <div key={idx} className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c4c6cf]/30 text-xs">
                    <div className="flex items-center justify-between font-semibold text-[#002147]">
                      <span>{src.docTitle} ({src.docCode})</span>
                      <span className="text-[10px] text-[#44474e]">Section {src.section}, p. {src.page}</span>
                    </div>
                    <blockquote className="mt-1 pl-2 border-l-2 border-[#002147]/40 text-[#44474e] italic text-[11px]">
                      "{src.extract}"
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Registry Disclaimer */}
          <div className="pt-6 border-t border-[#c4c6cf]/30 text-[10px] text-[#74777f] space-y-1">
            <p className="font-semibold text-[#002147]">Institutional Notice & Policy Grounding:</p>
            <p>
              This document is synthesized by REX CIHE, the institutional AI University Assistant, grounded strictly in Crown Institute of Higher Education published bylaws, handbooks, and schedules. For formal individual delegated determinations (including final examination grades, student visa reporting, or formal exclusion), consultations with the Academic Registrar or International Student Office are mandated.
            </p>
            <p>Central Registry Phone: <strong>1300 171 094</strong> | Email: <strong>support@cihe.edu.au</strong> | Campus: <strong>116 Pacific Highway, North Sydney NSW 2060</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};
