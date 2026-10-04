import React, { useState } from 'react';
import { CIHE_CAMPUSES, CIHECampus } from '../data/ciheKnowledgeBase';

interface CampusesViewProps {
  onAskRexAboutCampus: (campusName: string) => void;
}

export const CampusesView: React.FC<CampusesViewProps> = ({ onAskRexAboutCampus }) => {
  const [selectedState, setSelectedState] = useState<'ALL' | 'NSW' | 'ACT' | 'WA'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState<CIHECampus>(CIHE_CAMPUSES[0]);

  const filteredCampuses = CIHE_CAMPUSES.filter(c => {
    const matchesState = selectedState === 'ALL' || c.state === selectedState;
    const matchesQuery = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.suburb.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.offeredPrograms.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesState && matchesQuery;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f9ff] overflow-y-auto">
      {/* Top Header */}
      <div className="bg-white border-b border-[#c4c6cf]/30 px-6 py-4 sticky top-0 z-10 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#002147] tracking-wider uppercase bg-[#eff4ff] px-2 py-0.5 rounded border border-[#002147]/10 font-geist">
                Institutional Directory · TEQSA PRV12014
              </span>
              <span className="text-[11px] text-[#44474e]">8 Active Campuses Across 3 States</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#000a1e] tracking-tight mt-1 font-geist">
              CIHE Campus Network & Facilities Locator
            </h1>
          </div>

          {/* Quick Central Contact */}
          <div className="flex items-center gap-3">
            <a
              href="tel:1300171094"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#000a1e] text-white text-xs font-semibold hover:bg-[#002147] transition shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-300">call</span>
              <span>1300 171 094</span>
            </a>
            <a
              href="tel:1800244431"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-xs font-semibold hover:bg-[#ffb4ab] transition shadow-xs"
              title="24/7 Urgent Student Assistance"
            >
              <span className="material-symbols-outlined text-[16px]">emergency</span>
              <span>1800 244 431</span>
            </a>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="max-w-7xl mx-auto mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-[#eff4ff] p-1 rounded-xl border border-[#c4c6cf]/30">
            {(['ALL', 'NSW', 'ACT', 'WA'] as const).map(state => (
              <button
                key={state}
                onClick={() => setSelectedState(state)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedState === state
                    ? 'bg-[#002147] text-white shadow-xs'
                    : 'text-[#44474e] hover:text-[#000a1e]'
                }`}
              >
                {state === 'ALL' ? 'All Campuses (8)' : state === 'NSW' ? 'Sydney NSW (4)' : state === 'ACT' ? 'Canberra ACT (3)' : 'Perth WA (1)'}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#44474e] text-[16px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter by suburb, program, address..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-[#eff4ff] border border-[#c4c6cf]/40 focus:outline-none focus:ring-2 focus:ring-[#002147] text-[#000a1e]"
            />
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Left Column: Campus Cards List */}
        <div className="lg:col-span-7 space-y-4">
          {filteredCampuses.map(campus => {
            const isSelected = selectedCampus.id === campus.id;
            return (
              <div
                key={campus.id}
                onClick={() => setSelectedCampus(campus)}
                className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-white border-[#002147] ring-2 ring-[#002147]/10 shadow-md'
                    : 'bg-white border-[#c4c6cf]/30 hover:border-[#002147]/40 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#eff4ff] text-[#002147] border border-[#002147]/20 uppercase">
                        {campus.state}
                      </span>
                      {campus.isHeadCampus && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          Central Headquarters
                        </span>
                      )}
                      {campus.isNew2026 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 animate-pulse">
                          ✨ New Campus 2026
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-[#000a1e] mt-1 font-geist">
                      {campus.name}
                    </h3>
                    <p className="text-xs text-[#44474e] flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px] text-[#002147]">location_on</span>
                      <span>{campus.address}, {campus.suburb} {campus.postcode}</span>
                    </p>
                  </div>

                  <span className="material-symbols-outlined text-[#002147] text-[20px]">
                    {isSelected ? 'check_circle' : 'chevron_right'}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-[#c4c6cf]/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[#44474e]">
                    <span className="material-symbols-outlined text-[15px] text-[#002147]">schedule</span>
                    <span>{campus.operatingHours.split('|')[0]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAskRexAboutCampus(campus.name);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#eff4ff] text-[#002147] font-semibold text-[11px] hover:bg-[#dce9ff] transition border border-[#c4c6cf]/30"
                    >
                      Ask REX
                    </button>
                    <a
                      href={`tel:${campus.phone.replace(/\s+/g, '')}`}
                      onClick={e => e.stopPropagation()}
                      className="px-2.5 py-1 rounded-lg bg-[#000a1e] text-white font-semibold text-[11px] hover:bg-[#002147] transition"
                    >
                      Call Desk
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Campus Inspector */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-white rounded-2xl p-6 border border-[#c4c6cf]/30 shadow-sm space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#002147] uppercase tracking-wider bg-[#eff4ff] px-2 py-0.5 rounded border border-[#002147]/10 font-geist">
                  Selected Facility Profile
                </span>
                <h2 className="text-lg font-black text-[#000a1e] mt-1 font-geist">
                  {selectedCampus.name}
                </h2>
                <p className="text-xs text-[#44474e] mt-0.5">
                  {selectedCampus.address}, {selectedCampus.suburb} {selectedCampus.state} {selectedCampus.postcode}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#002147] flex items-center justify-center font-bold font-geist">
                {selectedCampus.state}
              </div>
            </div>

            {/* Hours & Support */}
            <div className="p-3.5 rounded-xl bg-[#f8f9ff] border border-[#c4c6cf]/20 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#44474e]">Operating Hours:</span>
                <span className="font-semibold text-[#000a1e]">{selectedCampus.operatingHours}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#44474e]">Student Services Desk:</span>
                <span className="font-semibold text-[#000a1e]">{selectedCampus.studentSupportHours}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#44474e]">Direct Phone:</span>
                <a href={`tel:${selectedCampus.phone.replace(/\s+/g, '')}`} className="font-bold text-[#002147] hover:underline">
                  {selectedCampus.phone}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#44474e]">Email:</span>
                <a href={`mailto:${selectedCampus.email}`} className="font-semibold text-[#002147] hover:underline">
                  {selectedCampus.email}
                </a>
              </div>
            </div>

            {/* Public Transport */}
            <div>
              <span className="text-xs font-bold text-[#000a1e] block uppercase tracking-wider font-geist mb-1.5">
                🚆 Public Transit & Access
              </span>
              <p className="text-xs text-[#44474e] bg-[#eff4ff] p-3 rounded-xl border border-[#c4c6cf]/20">
                {selectedCampus.publicTransport}
              </p>
            </div>

            {/* Campus Facilities */}
            <div>
              <span className="text-xs font-bold text-[#000a1e] block uppercase tracking-wider font-geist mb-2">
                🏛️ On-Campus Amenities & Resources
              </span>
              <div className="space-y-1.5">
                {selectedCampus.facilities.map((fac, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#000a1e]">
                    <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Programs Offered */}
            <div>
              <span className="text-xs font-bold text-[#000a1e] block uppercase tracking-wider font-geist mb-2">
                📚 Programs Taught at this Campus
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCampus.offeredPrograms.map((prog, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-[#eff4ff] text-[#002147] text-[11px] font-medium border border-[#c4c6cf]/30"
                  >
                    {prog}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => onAskRexAboutCampus(selectedCampus.name)}
                className="w-full py-2.5 rounded-xl bg-[#000a1e] hover:bg-[#002147] text-white text-xs font-bold font-geist transition flex items-center justify-center gap-2 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-300">chat</span>
                <span>Ask REX About {selectedCampus.name}</span>
              </button>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${selectedCampus.address}, ${selectedCampus.suburb} ${selectedCampus.state} ${selectedCampus.postcode}`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 rounded-xl bg-white hover:bg-[#eff4ff] text-[#002147] text-xs font-semibold transition text-center border border-[#c4c6cf]/40"
              >
                Open in Google Maps ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
