import React, { useState } from 'react';
import { CIHE_COURSES, CIHECourse } from '../data/ciheKnowledgeBase';

interface CourseNavigatorViewProps {
  onAskRexAboutCourse: (courseTitle: string) => void;
}

export const CourseNavigatorView: React.FC<CourseNavigatorViewProps> = ({ onAskRexAboutCourse }) => {
  const [selectedFaculty, setSelectedFaculty] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<CIHECourse>(CIHE_COURSES[0]);

  // Fee Calculator State
  const [trimestersToCalculate, setTrimestersToCalculate] = useState<number>(6);

  const filteredCourses = CIHE_COURSES.filter(course => {
    const matchesFaculty = selectedFaculty === 'ALL' || course.faculty === selectedFaculty;
    const matchesLevel = selectedLevel === 'ALL' || course.level === selectedLevel;
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.accreditation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFaculty && matchesLevel && matchesSearch;
  });

  const estimatedTuition = (selectedCourse.perSemesterFeeAUD * trimestersToCalculate).toLocaleString();

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f9ff] overflow-y-auto">
      {/* Top Header */}
      <div className="bg-white border-b border-[#c4c6cf]/30 px-6 py-4 sticky top-0 z-10 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#002147] tracking-wider uppercase bg-[#eff4ff] px-2 py-0.5 rounded border border-[#002147]/10 font-geist">
                Academic Curriculum & Accreditations
              </span>
              <span className="text-[11px] text-[#44474e]">ACS · CPA Australia · CA ANZ · ACECQA</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#000a1e] tracking-tight mt-1 font-geist">
              CIHE Degree & Tuition Fee Navigator
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="mailto:admissions@cihe.edu.au"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eff4ff] text-[#002147] text-xs font-semibold hover:bg-[#dce9ff] transition border border-[#c4c6cf]/30"
            >
              <span className="material-symbols-outlined text-[16px]">mail</span>
              <span>admissions@cihe.edu.au</span>
            </a>
            <a
              href="tel:1300171094"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#000a1e] text-white text-xs font-semibold hover:bg-[#002147] transition shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-300">call</span>
              <span>1300 171 094</span>
            </a>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="max-w-7xl mx-auto mt-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Faculty Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#eff4ff] p-1 rounded-xl border border-[#c4c6cf]/30 text-xs">
              {['ALL', 'Information Technology', 'Accounting', 'Business & Commerce', 'Education', 'Community Services'].map(fac => (
                <button
                  key={fac}
                  onClick={() => setSelectedFaculty(fac)}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    selectedFaculty === fac
                      ? 'bg-[#002147] text-white shadow-xs'
                      : 'text-[#44474e] hover:text-[#000a1e]'
                  }`}
                >
                  {fac === 'ALL' ? 'All Disciplines' : fac}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative min-w-[240px]">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#44474e] text-[16px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search courses, CRICOS, major..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-[#eff4ff] border border-[#c4c6cf]/40 focus:outline-none focus:ring-2 focus:ring-[#002147] text-[#000a1e]"
              />
            </div>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#44474e] font-medium">Study Level:</span>
            {['ALL', 'Undergraduate', 'Postgraduate', 'Diploma'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-semibold transition ${
                  selectedLevel === lvl
                    ? 'bg-[#002147] text-white border-[#002147]'
                    : 'bg-white text-[#44474e] border-[#c4c6cf]/40 hover:bg-[#eff4ff]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Left Column: Courses List */}
        <div className="lg:col-span-7 space-y-4">
          {filteredCourses.map(course => {
            const isSelected = selectedCourse.id === course.id;
            return (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-white border-[#002147] ring-2 ring-[#002147]/10 shadow-md'
                    : 'bg-white border-[#c4c6cf]/30 hover:border-[#002147]/40 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#eff4ff] text-[#002147] border border-[#002147]/20 uppercase">
                        {course.level}
                      </span>
                      <span className="text-[11px] text-[#44474e] font-mono">
                        CRICOS: {course.cricosCode}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {course.durationYears} Years ({course.totalUnits} Units)
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#000a1e] mt-1.5 font-geist">
                      {course.title}
                    </h3>
                    <p className="text-xs text-[#002147] font-medium flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      <span>{course.accreditation}</span>
                    </p>
                  </div>

                  <span className="material-symbols-outlined text-[#002147] text-[20px]">
                    {isSelected ? 'check_circle' : 'chevron_right'}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-[#c4c6cf]/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-[10px] text-[#74777f] uppercase block">Annual Tuition</span>
                      <span className="font-bold text-[#000a1e]">AUD ${course.annualFeeIntlAUD.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#74777f] uppercase block">Per Semester</span>
                      <span className="font-semibold text-[#44474e]">AUD ${course.perSemesterFeeAUD.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAskRexAboutCourse(course.title);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#eff4ff] text-[#002147] font-semibold text-[11px] hover:bg-[#dce9ff] transition border border-[#c4c6cf]/30"
                    >
                      Ask REX
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Degree Profile & Calculator */}
        <div className="lg:col-span-5 space-y-5">
          <div className="sticky top-28 bg-white rounded-2xl p-6 border border-[#c4c6cf]/30 shadow-sm space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#002147] uppercase tracking-wider bg-[#eff4ff] px-2 py-0.5 rounded border border-[#002147]/10 font-geist">
                  Course Specification
                </span>
                <span className="text-xs font-mono text-[#74777f]">CRICOS {selectedCourse.cricosCode}</span>
              </div>
              <h2 className="text-lg font-black text-[#000a1e] mt-1 font-geist">
                {selectedCourse.title}
              </h2>
              <p className="text-xs text-[#44474e] mt-1 leading-relaxed">
                {selectedCourse.overview}
              </p>
            </div>

            {/* Key Academic Specs */}
            <div className="p-3.5 rounded-xl bg-[#f8f9ff] border border-[#c4c6cf]/20 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#44474e]">Accreditation:</span>
                <span className="font-bold text-[#002147] text-right">{selectedCourse.accreditation}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#44474e]">Duration & Units:</span>
                <span className="font-semibold text-[#000a1e]">{selectedCourse.durationYears} Years / {selectedCourse.totalUnits} Units</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#44474e]">English Entry Benchmark:</span>
                <span className="font-semibold text-[#000a1e]">{selectedCourse.ieltsRequirement}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#44474e]">PTE Academic Benchmark:</span>
                <span className="font-semibold text-[#000a1e]">{selectedCourse.pteRequirement}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#44474e]">Intake Semesters:</span>
                <span className="font-semibold text-[#000a1e]">{selectedCourse.intakes.join(', ')}</span>
              </div>
            </div>

            {/* Interactive Tuition Fee Estimator */}
            <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#002147]/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#002147] uppercase tracking-wider font-geist">
                  🧮 Tuition Fee Estimator
                </span>
                <span className="text-[10px] text-[#44474e]">AUD Currency</span>
              </div>

              <div>
                <label className="text-[11px] text-[#44474e] block mb-1">
                  Estimated Study Load: {trimestersToCalculate} Trimesters ({trimestersToCalculate / 2} Years)
                </label>
                <input
                  type="range"
                  min="1"
                  max={selectedCourse.durationYears * 2}
                  value={trimestersToCalculate}
                  onChange={e => setTrimestersToCalculate(Number(e.target.value))}
                  className="w-full accent-[#002147]"
                />
                <div className="flex justify-between text-[10px] text-[#74777f] mt-0.5">
                  <span>1 Sem</span>
                  <span>Full Course ({selectedCourse.durationYears * 2} Semesters)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#002147]/10 flex items-center justify-between">
                <span className="text-xs text-[#000a1e] font-medium">Estimated Tuition:</span>
                <span className="text-base font-black text-[#002147] font-geist">
                  AUD ${estimatedTuition}
                </span>
              </div>
              <p className="text-[10px] text-[#44474e]">
                * Eligible domestic Australian students may defer tuition fees through Commonwealth FEE-HELP.
              </p>
            </div>

            {/* Campus Availability */}
            <div>
              <span className="text-xs font-bold text-[#000a1e] block uppercase tracking-wider font-geist mb-1.5">
                🏛️ Campuses Delivering this Degree
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCourse.campuses.map((camp, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-white border border-[#c4c6cf]/40 text-[#002147] text-[11px] font-medium"
                  >
                    📍 {camp}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => onAskRexAboutCourse(selectedCourse.title)}
                className="w-full py-2.5 rounded-xl bg-[#000a1e] hover:bg-[#002147] text-white text-xs font-bold font-geist transition flex items-center justify-center gap-2 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-300">chat</span>
                <span>Ask REX About {selectedCourse.title}</span>
              </button>
              <a
                href="mailto:admissions@cihe.edu.au"
                className="w-full py-2 rounded-xl bg-white hover:bg-[#eff4ff] text-[#002147] text-xs font-semibold transition text-center border border-[#c4c6cf]/40"
              >
                Inquire with Admissions Desk ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
