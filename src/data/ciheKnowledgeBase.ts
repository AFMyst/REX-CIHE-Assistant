/**
 * Official CIHE (Crown Institute of Higher Education) Institutional Knowledge Base
 * Website: cihe.edu.au | TEQSA Provider ID: PRV12014 | CRICOS Provider Code: 03782F
 * Central Phone: 1300 171 094 | Central Email: support@cihe.edu.au | Emergency: 1800 244 431
 */

export interface CIHEDocument {
  id: string;
  code: string;
  title: string;
  version: string;
  accessLevel: 'student' | 'staff' | 'admin';
  status: 'indexed' | 'processing' | 'review' | 'superseded';
  chunksCount: number;
  lastIngested: string;
  alertsCount: number;
  category: 'policy' | 'fees-visas' | 'course-guides' | 'governance' | 'campus-guide';
  owner: string;
  summary: string;
}

export interface CIHEChunk {
  id: string;
  docId: string;
  docTitle: string;
  docCode: string;
  version: string;
  page: number | string;
  section: string;
  accessLevel: 'student' | 'staff' | 'admin';
  content: string;
  exactQuote: string;
  tags: string[];
}

export interface CIHECampus {
  id: string;
  name: string;
  state: 'NSW' | 'ACT' | 'WA';
  address: string;
  suburb: string;
  postcode: string;
  phone: string;
  email: string;
  operatingHours: string;
  isHeadCampus?: boolean;
  isNew2026?: boolean;
  facilities: string[];
  publicTransport: string;
  offeredPrograms: string[];
  studentSupportHours: string;
}

export interface CIHECourse {
  id: string;
  code: string;
  cricosCode: string;
  title: string;
  level: 'Undergraduate' | 'Postgraduate' | 'Diploma' | 'Research';
  faculty: 'Information Technology' | 'Business & Commerce' | 'Accounting' | 'Education' | 'Community Services' | 'Research';
  durationYears: number;
  totalUnits: number;
  annualFeeIntlAUD: number;
  perSemesterFeeAUD: number;
  accreditation: string;
  intakes: string[];
  ieltsRequirement: string;
  pteRequirement: string;
  campuses: string[];
  careerOutcomes: string[];
  overview: string;
}

export interface CIHECalendarEvent {
  id: string;
  period: 'Trimester 1, 2026' | 'Trimester 2, 2026' | 'Summer Intake, 2026-2027';
  title: string;
  dateRange: string;
  category: 'orientation' | 'census' | 'exams' | 'teaching' | 'break';
  isCrucialDeadline?: boolean;
  description: string;
}

export interface SavedAnswer {
  id: string;
  title: string;
  category: 'policy' | 'fees-visas' | 'course-guides';
  categoryLabel: string;
  sourceBadge: string;
  savedDate: string;
  bindingStatus: string;
  synthesisTitle: string;
  excerpt: string;
  citation: string;
  formCode?: string;
  metaDetails?: {
    type: 'metric' | 'timeline' | 'providers';
    data?: any;
  };
  contactEmail?: string;
  pdfDownloadName?: string;
}

export interface PolicyGap {
  id: string;
  category: string;
  code: string;
  sampleQuestion: string;
  cluster: string;
  fallbackCount: number;
  classification: string;
  classificationReason: string;
  recommendedAction: string;
  actionDetails: string;
  priority: 'HIGH' | 'MEDIUM';
  assignee: string;
}

// ---------------------------------------------------------
// 1. Authoritative CIHE Campuses (NSW, ACT, WA)
// ---------------------------------------------------------
export const CIHE_CAMPUSES: CIHECampus[] = [
  {
    id: "campus-nsw-northsydney",
    name: "North Sydney Central Campus",
    state: "NSW",
    address: "116 Pacific Highway",
    suburb: "North Sydney",
    postcode: "2060",
    phone: "1300 171 094",
    email: "support@cihe.edu.au",
    operatingHours: "Mon-Fri: 8:00 AM – 9:00 PM | Sat: 9:00 AM – 5:00 PM",
    isHeadCampus: true,
    facilities: [
      "Student Services Hub (Level 3)",
      "High-Tech IT Labs & Networking Suites",
      "Central Library & Quiet Study Pods",
      "Faculty Consultation Suites",
      "Follow-Me Cloud Printing & High-Speed WiFi"
    ],
    publicTransport: "5-minute walk from North Sydney Train Station; Victoria Cross Metro Station (3 mins).",
    offeredPrograms: ["BIT", "MIT", "BBus", "MBA", "BAcc", "MPA", "BEI", "DipIT", "DipAcc"],
    studentSupportHours: "Mon-Fri: 8:30 AM – 5:00 PM (Drop-in & Scheduled)"
  },
  {
    id: "campus-nsw-miller",
    name: "Miller Street Campus",
    state: "NSW",
    address: "Level 5, 213 Miller Street",
    suburb: "North Sydney",
    postcode: "2060",
    phone: "1300 171 094",
    email: "northsydney@cihe.edu.au",
    operatingHours: "Mon-Fri: 8:30 AM – 7:30 PM",
    facilities: [
      "Postgraduate Executive Seminar Rooms",
      "Business Analytics & Finance Terminal Suite",
      "Collaborative Group Project Pods",
      "Student Lounge & Kitchenette"
    ],
    publicTransport: "Short stroll from Miller St bus interchange and North Sydney Station.",
    offeredPrograms: ["MBA", "MBA (Advanced)", "MIT", "MPA", "Graduate Certificate of Business Administration"],
    studentSupportHours: "Mon-Fri: 9:00 AM – 5:00 PM"
  },
  {
    id: "campus-nsw-cbd",
    name: "Sydney CBD Campus",
    state: "NSW",
    address: "Level 11, 307 Pitt Street",
    suburb: "Sydney",
    postcode: "2000",
    phone: "1300 171 094",
    email: "sydneycbd@cihe.edu.au",
    operatingHours: "Mon-Fri: 8:30 AM – 8:30 PM",
    facilities: [
      "Modern Tiered Lecture Theatres",
      "Dedicated Career Development Centre",
      "Multimedia Production Studio",
      "Quiet Research Carrels"
    ],
    publicTransport: "Opposite Town Hall Station (Pitt St exit) and Light Rail stops.",
    offeredPrograms: ["BIT", "BBus", "BAcc", "MBA", "DipIT", "DipAcc"],
    studentSupportHours: "Mon-Fri: 9:00 AM – 5:00 PM"
  },
  {
    id: "campus-nsw-hurstville",
    name: "Hurstville Campus",
    state: "NSW",
    address: "2 Woodville Street",
    suburb: "Hurstville",
    postcode: "2220",
    phone: "1300 171 094",
    email: "hurstville@cihe.edu.au",
    operatingHours: "Mon-Fri: 8:30 AM – 6:00 PM",
    facilities: [
      "Early Childhood Simulation Classroom",
      "Interactive Learning Hubs",
      "Student Resource Centre & Bookable Study Desks"
    ],
    publicTransport: "3-minute walk from Hurstville Train Station and Bus Interchange.",
    offeredPrograms: ["Bachelor of Education (Early Childhood)", "Graduate Diploma in Education", "Bachelor of Community Services"],
    studentSupportHours: "Mon-Fri: 8:30 AM – 4:30 PM"
  },
  {
    id: "campus-act-gungahlin",
    name: "Canberra Gungahlin Campus",
    state: "ACT",
    address: "Level 1, 5 Fussell Lane",
    suburb: "Gungahlin",
    postcode: "2912",
    phone: "1300 171 094",
    email: "canberra@cihe.edu.au",
    operatingHours: "Mon-Fri: 8:30 AM – 6:30 PM",
    facilities: [
      "Digital Innovation & Coding Lab",
      "Student Commons & Peer Mentoring Zone",
      "Library Resource Centre with e-Catalogue Access"
    ],
    publicTransport: "Adjacent to Gungahlin Light Rail Terminus.",
    offeredPrograms: ["BIT", "MIT", "BBus", "MBA", "Diploma of IT"],
    studentSupportHours: "Mon-Fri: 9:00 AM – 5:00 PM"
  },
  {
    id: "campus-act-belconnen",
    name: "Canberra Belconnen Campus",
    state: "ACT",
    address: "Level 4, 40 Cameron Avenue",
    suburb: "Belconnen",
    postcode: "2617",
    phone: "1300 171 094",
    email: "canberra@cihe.edu.au",
    operatingHours: "Mon-Fri: 8:30 AM – 6:00 PM",
    facilities: [
      "Advanced Seminar Rooms",
      "Community Services Skills Lab",
      "Student Kitchen & Breakout Terraces"
    ],
    publicTransport: "Moments from Belconnen Community Bus Station and Westfield Belconnen.",
    offeredPrograms: ["Bachelor of Community Services", "Bachelor of Business", "Master of Business Administration"],
    studentSupportHours: "Mon-Fri: 9:00 AM – 4:30 PM"
  },
  {
    id: "campus-act-mitchell",
    name: "Canberra Mitchell Campus",
    state: "ACT",
    address: "Unit 2A, 118 Lysaght Street",
    suburb: "Mitchell",
    postcode: "2911",
    phone: "1300 171 094",
    email: "canberra@cihe.edu.au",
    operatingHours: "Mon-Fri: 8:30 AM – 5:00 PM",
    facilities: [
      "Research Methodologies Lab",
      "Academic Staff Offices & Research Scholar Workspaces"
    ],
    publicTransport: "Walking distance to Well Station Drive Light Rail Station.",
    offeredPrograms: ["Master of Research", "Graduate Certificate in Research Methods"],
    studentSupportHours: "By appointment: Mon-Fri"
  },
  {
    id: "campus-wa-perth",
    name: "West Perth Campus (WA)",
    state: "WA",
    address: "1325 Hay Street",
    suburb: "West Perth",
    postcode: "6005",
    phone: "1300 171 094",
    email: "perth@cihe.edu.au",
    operatingHours: "Mon-Fri: 8:00 AM – 6:00 PM",
    isNew2026: true,
    facilities: [
      "Specialized Early Childhood Demonstration Rooms",
      "State-of-the-Art Interactive Hybrid Classrooms",
      "Library Hub with Online Resource Portals",
      "Dedicated Perth Student Services & Welfare Desk"
    ],
    publicTransport: "Free Red CAT bus stop outside the door; 8 mins from Perth CBD.",
    offeredPrograms: [
      "Bachelor of Education (Early Childhood) (Birth to Five)",
      "Graduate Diploma in Education (Early Childhood)",
      "Master of Teaching (Early Childhood)",
      "Bachelor of Business (from July 2026)"
    ],
    studentSupportHours: "Mon-Fri: 8:30 AM – 5:00 PM AWST"
  }
];

// ---------------------------------------------------------
// 2. Comprehensive CIHE Degree & Diploma Programs
// ---------------------------------------------------------
export const CIHE_COURSES: CIHECourse[] = [
  {
    id: "course-bit",
    code: "BIT-2026",
    cricosCode: "098124A",
    title: "Bachelor of Information Technology",
    level: "Undergraduate",
    faculty: "Information Technology",
    durationYears: 3,
    totalUnits: 24,
    annualFeeIntlAUD: 18000,
    perSemesterFeeAUD: 9000,
    accreditation: "Accredited by Australian Computer Society (ACS) at Professional Level",
    intakes: ["March (Semester 1)", "July (Semester 2)", "November (Summer)"],
    ieltsRequirement: "Overall 6.0 (no band less than 5.5)",
    pteRequirement: "Overall 50 (no communicative skill score below 42)",
    campuses: ["North Sydney Central", "Sydney CBD", "Gungahlin ACT"],
    careerOutcomes: ["Full Stack Developer", "Cybersecurity Analyst", "Systems Architect", "Cloud Engineer", "IT Project Manager"],
    overview: "Delivers comprehensive foundation in software engineering, cloud architecture, cybersecurity, and data structures. Accredited by ACS, leading directly to ACS Professional Membership."
  },
  {
    id: "course-mit",
    code: "MIT-2026",
    cricosCode: "099432B",
    title: "Master of Information Technology",
    level: "Postgraduate",
    faculty: "Information Technology",
    durationYears: 2,
    totalUnits: 16,
    annualFeeIntlAUD: 22000,
    perSemesterFeeAUD: 11000,
    accreditation: "ACS Aligned, TEQSA Accredited AQF Level 9",
    intakes: ["March (Semester 1)", "July (Semester 2)", "November (Summer)"],
    ieltsRequirement: "Overall 6.5 (no band less than 6.0)",
    pteRequirement: "Overall 58 (no communicative skill score below 50)",
    campuses: ["North Sydney Central", "Miller Street", "Gungahlin ACT"],
    careerOutcomes: ["Senior IT Consultant", "Lead Software Architect", "Data Engineering Lead", "AI Solutions Specialist"],
    overview: "Advanced study in enterprise computing, machine learning deployment, secure architecture, and strategic technology management for future tech leaders."
  },
  {
    id: "course-bacc",
    code: "BACC-2026",
    cricosCode: "098125M",
    title: "Bachelor of Accounting",
    level: "Undergraduate",
    faculty: "Accounting",
    durationYears: 3,
    totalUnits: 24,
    annualFeeIntlAUD: 18000,
    perSemesterFeeAUD: 9000,
    accreditation: "Accredited pathway with CPA Australia & Chartered Accountants Australia and New Zealand (CA ANZ)",
    intakes: ["March (Semester 1)", "July (Semester 2)", "November (Summer)"],
    ieltsRequirement: "Overall 6.0 (no band less than 5.5)",
    pteRequirement: "Overall 50 (no communicative skill score below 42)",
    campuses: ["North Sydney Central", "Sydney CBD"],
    careerOutcomes: ["Certified Practising Accountant", "Corporate Financial Analyst", "Taxation Consultant", "Auditor"],
    overview: "Prepares students for professional accounting careers with direct entry eligibility into CPA and CA ANZ graduate programmes upon completion."
  },
  {
    id: "course-mpa",
    code: "MPA-2026",
    cricosCode: "099433A",
    title: "Master of Professional Accounting",
    level: "Postgraduate",
    faculty: "Accounting",
    durationYears: 2,
    totalUnits: 16,
    annualFeeIntlAUD: 24000,
    perSemesterFeeAUD: 12000,
    accreditation: "Fully accredited by CPA Australia & CA ANZ",
    intakes: ["March (Semester 1)", "July (Semester 2)"],
    ieltsRequirement: "Overall 6.5 (no band less than 6.0)",
    pteRequirement: "Overall 58 (no communicative skill score below 50)",
    campuses: ["North Sydney Central", "Miller Street"],
    careerOutcomes: ["Financial Controller", "Forensic Accountant", "Chief Financial Officer (CFO)", "Senior Auditor"],
    overview: "Designed for graduates of non-accounting disciplines seeking professional accreditation as well as accounting graduates advancing to managerial financial leadership."
  },
  {
    id: "course-bbus",
    code: "BBUS-2026",
    cricosCode: "098126K",
    title: "Bachelor of Business",
    level: "Undergraduate",
    faculty: "Business & Commerce",
    durationYears: 3,
    totalUnits: 24,
    annualFeeIntlAUD: 18000,
    perSemesterFeeAUD: 9000,
    accreditation: "TEQSA Accredited AQF Level 7",
    intakes: ["March (Semester 1)", "July (Semester 2)", "November (Summer)"],
    ieltsRequirement: "Overall 6.0 (no band less than 5.5)",
    pteRequirement: "Overall 50 (no communicative skill score below 42)",
    campuses: ["North Sydney Central", "Sydney CBD", "Belconnen ACT"],
    careerOutcomes: ["Business Development Manager", "Marketing Executive", "Operations Lead", "Management Consultant"],
    overview: "Broad strategic foundation in international marketing, human resource governance, business analytics, and ethical leadership."
  },
  {
    id: "course-mba",
    code: "MBA-2026",
    cricosCode: "099434K",
    title: "Master of Business Administration (MBA)",
    level: "Postgraduate",
    faculty: "Business & Commerce",
    durationYears: 2,
    totalUnits: 16,
    annualFeeIntlAUD: 24000,
    perSemesterFeeAUD: 12000,
    accreditation: "TEQSA Accredited AQF Level 9",
    intakes: ["March (Semester 1)", "July (Semester 2)", "November (Summer)"],
    ieltsRequirement: "Overall 6.5 (no band less than 6.0)",
    pteRequirement: "Overall 58 (no communicative skill score below 50)",
    campuses: ["North Sydney Central", "Miller Street", "Sydney CBD", "Gungahlin ACT"],
    careerOutcomes: ["General Manager", "Executive Director", "Strategic Consultant", "Entrepreneur / Founder"],
    overview: "Intensive executive programme cultivating leadership, cross-border corporate governance, agile negotiation, and disruptive venture management."
  },
  {
    id: "course-bed-earlychildhood",
    code: "BED-EC-2026",
    cricosCode: "107842C",
    title: "Bachelor of Education (Early Childhood) (Birth to Five)",
    level: "Undergraduate",
    faculty: "Education",
    durationYears: 4,
    totalUnits: 32,
    annualFeeIntlAUD: 20000,
    perSemesterFeeAUD: 10000,
    accreditation: "ACECQA Approved Early Childhood Teaching Qualification",
    intakes: ["March (Semester 1)", "July (Semester 2)"],
    ieltsRequirement: "Overall 6.5 (no band less than 6.0)",
    pteRequirement: "Overall 58 (no communicative skill score below 50)",
    campuses: ["West Perth WA", "Hurstville NSW"],
    careerOutcomes: ["Early Childhood Teacher (ECT)", "Early Learning Centre Director", "Child Development Specialist", "Curriculum Advisor"],
    overview: "Prepares qualified early childhood educators with 80+ days of supervised professional placement across licensed early learning centres. Launched in West Perth in March 2026!"
  },
  {
    id: "course-mteach-earlychildhood",
    code: "MTEACH-EC-2026",
    cricosCode: "107844A",
    title: "Master of Teaching (Early Childhood) (Birth to Five)",
    level: "Postgraduate",
    faculty: "Education",
    durationYears: 2,
    totalUnits: 16,
    annualFeeIntlAUD: 25000,
    perSemesterFeeAUD: 12500,
    accreditation: "ACECQA Recognized Early Childhood Teaching Qualification",
    intakes: ["March (Semester 1)", "July (Semester 2)"],
    ieltsRequirement: "Overall 7.0 (no band less than 6.5)",
    pteRequirement: "Overall 65 (no communicative skill score below 58)",
    campuses: ["West Perth WA", "Hurstville NSW"],
    careerOutcomes: ["Lead Early Childhood Teacher", "Centre Pedagogical Coordinator", "Policy Officer in Early Education"],
    overview: "Accelerated master-level initial teacher education qualification for graduates holding a bachelor degree in any discipline seeking certified Early Childhood Teacher status."
  },
  {
    id: "course-bcomm-serv",
    code: "BCS-2026",
    cricosCode: "102914F",
    title: "Bachelor of Community Services",
    level: "Undergraduate",
    faculty: "Community Services",
    durationYears: 3,
    totalUnits: 24,
    annualFeeIntlAUD: 19000,
    perSemesterFeeAUD: 9500,
    accreditation: "ACWA Accredited Pathway, TEQSA Accredited AQF Level 7",
    intakes: ["March (Semester 1)", "July (Semester 2)"],
    ieltsRequirement: "Overall 6.0 (no band less than 5.5)",
    pteRequirement: "Overall 50 (no communicative skill score below 42)",
    campuses: ["Belconnen ACT", "Hurstville NSW"],
    careerOutcomes: ["Community Care Manager", "Disability Services Coordinator", "Youth Case Worker", "Social Policy Advocate"],
    overview: "Combines social psychology, crisis intervention, ethics, and 400 hours of mandatory fieldwork practice in community organisations."
  },
  {
    id: "course-dip-it",
    code: "DIPIT-2026",
    cricosCode: "098127J",
    title: "Diploma of Information Technology",
    level: "Diploma",
    faculty: "Information Technology",
    durationYears: 1,
    totalUnits: 8,
    annualFeeIntlAUD: 18000,
    perSemesterFeeAUD: 9000,
    accreditation: "AQF Level 5, Direct Articulation into Year 2 of CIHE BIT",
    intakes: ["March (Semester 1)", "July (Semester 2)", "November (Summer)"],
    ieltsRequirement: "Overall 5.5 (no band less than 5.0)",
    pteRequirement: "Overall 42 (no communicative skill score below 36)",
    campuses: ["North Sydney Central", "Sydney CBD", "Gungahlin ACT"],
    careerOutcomes: ["IT Support Specialist", "Junior Web Developer", "Network Assistant"],
    overview: "Direct pathway program guaranteeing credit transfer into the second year of the Bachelor of Information Technology with academic support tutorials."
  }
];

// ---------------------------------------------------------
// 3. Official CIHE 2026 Academic Calendar
// ---------------------------------------------------------
export const CIHE_CALENDAR: CIHECalendarEvent[] = [
  {
    id: "cal-1",
    period: "Trimester 1, 2026",
    title: "Semester 1 Orientation & Enrolment Week",
    dateRange: "23 Feb 2026 – 06 Mar 2026",
    category: "orientation",
    description: "Compulsory for all commencing students. Campus tours, timetable allocations, ID badge issuing, and Moodle workshops."
  },
  {
    id: "cal-2",
    period: "Trimester 1, 2026",
    title: "Semester 1 Lectures & Tutorials Begin",
    dateRange: "09 Mar 2026",
    category: "teaching",
    description: "Week 1 formal classes commence across North Sydney, Sydney CBD, Hurstville, ACT, and Perth campuses."
  },
  {
    id: "cal-3",
    period: "Trimester 1, 2026",
    title: "Trimester 1 Statutory Census Date",
    dateRange: "Friday, 27 March 2026 (11:59 PM AEDT)",
    category: "census",
    isCrucialDeadline: true,
    description: "Final deadline to drop units with 0% financial penalty and no academic penalty recorded. FEE-HELP debts lock in."
  },
  {
    id: "cal-4",
    period: "Trimester 1, 2026",
    title: "Mid-Trimester Examination & Reflection Week",
    dateRange: "13 Apr 2026 – 17 Apr 2026",
    category: "exams",
    description: "Mid-term tests, Stage 1 progress check-ins, and study skills refresher webinars."
  },
  {
    id: "cal-5",
    period: "Trimester 1, 2026",
    title: "Final Examination Period",
    dateRange: "08 Jun 2026 – 19 Jun 2026",
    category: "exams",
    isCrucialDeadline: true,
    description: "Formal invigilated examinations. Special Consideration must be submitted within 3 working days if ill."
  },
  {
    id: "cal-6",
    period: "Trimester 2, 2026",
    title: "Semester 2 Orientation Week",
    dateRange: "06 Jul 2026 – 17 Jul 2026",
    category: "orientation",
    description: "Welcoming Mid-Year Intake students. Course advising and international student visa compliance briefings."
  },
  {
    id: "cal-7",
    period: "Trimester 2, 2026",
    title: "Semester 2 Classes Commence",
    dateRange: "20 Jul 2026",
    category: "teaching",
    description: "Week 1 commencement for all undergraduate and postgraduate programs."
  },
  {
    id: "cal-8",
    period: "Trimester 2, 2026",
    title: "Trimester 2 Statutory Census Date",
    dateRange: "Friday, 14 August 2026 (11:59 PM AEST)",
    category: "census",
    isCrucialDeadline: true,
    description: "Final cutoff to withdraw without tuition fee liability."
  },
  {
    id: "cal-9",
    period: "Summer Intake, 2026-2027",
    title: "Summer Accelerated Intake Orientation & Start",
    dateRange: "16 Nov 2026 (Orientation) / 23 Nov 2026 (Classes)",
    category: "teaching",
    description: "Accelerated 7-week intensive study period to fast-track unit completion."
  },
  {
    id: "cal-10",
    period: "Summer Intake, 2026-2027",
    title: "Summer Term Census Date",
    dateRange: "Friday, 04 December 2026",
    category: "census",
    isCrucialDeadline: true,
    description: "Summer intensive refund and withdrawal statutory deadline."
  }
];

// ---------------------------------------------------------
// 4. Institutional Document Register
// ---------------------------------------------------------
export const CIHE_DOCUMENTS: CIHEDocument[] = [
  {
    id: "doc-1",
    code: "DOC-CIHE-2026-POL-04",
    title: "CIHE Student Assessment & Moderation Policy",
    version: "v2025.10",
    accessLevel: "student",
    status: "indexed",
    chunksCount: 68,
    lastIngested: "12 Mar 2026, 09:14",
    alertsCount: 0,
    category: "policy",
    owner: "Academic Board",
    summary: "Governs assessment submission deadlines, special consideration rules, grading moderation, and academic integrity procedures."
  },
  {
    id: "doc-2",
    code: "DOC-CIHE-2026-HB-01",
    title: "CIHE Student Handbook 2026",
    version: "v2026.02",
    accessLevel: "student",
    status: "indexed",
    chunksCount: 142,
    lastIngested: "15 Jan 2026, 11:20",
    alertsCount: 0,
    category: "course-guides",
    owner: "Office of the Dean",
    summary: "Comprehensive guide to student rights, deferment, leaves of absence, campus amenities, code of conduct, and academic milestones across Sydney, ACT, and Perth."
  },
  {
    id: "doc-3",
    code: "DOC-CIHE-2025-INT-02",
    title: "CIHE International Student Compliance Framework",
    version: "v2025.2",
    accessLevel: "student",
    status: "indexed",
    chunksCount: 54,
    lastIngested: "04 Mar 2026, 16:30",
    alertsCount: 0,
    category: "fees-visas",
    owner: "International Student Office",
    summary: "Covers Australian Student Visa (Subclass 500) compliance, ESOS Act National Code Standard 8, 48-hour fortnightly work limits, and OSHC."
  },
  {
    id: "doc-4",
    code: "DOC-CIHE-2026-FN-01",
    title: "Census Date & Tuition Refund Schedule 2026",
    version: "v2026.1",
    accessLevel: "student",
    status: "indexed",
    chunksCount: 38,
    lastIngested: "15 Feb 2026, 10:15",
    alertsCount: 0,
    category: "fees-visas",
    owner: "Bursar & Student Accounts",
    summary: "Trimester 1, 2, and 3 statutory census dates, refund percentage thresholds, and financial penalties for mid-term withdrawal."
  },
  {
    id: "doc-5",
    code: "DOC-CIHE-2026-CAMP-08",
    title: "CIHE Multi-Campus Directory & Operations Guide 2026",
    version: "v2026.1",
    accessLevel: "student",
    status: "indexed",
    chunksCount: 46,
    lastIngested: "08 Mar 2026, 14:00",
    alertsCount: 0,
    category: "campus-guide",
    owner: "Campus Facilities & Safety",
    summary: "Official address guide, campus opening hours, lab access, security protocols, and student amenities for North Sydney, Sydney CBD, Hurstville, ACT, and Perth."
  },
  {
    id: "doc-6",
    code: "DOC-CIHE-2026-ADM-03",
    title: "Admissions Policy & English Language Proficiency Benchmarks",
    version: "v2026.2",
    accessLevel: "student",
    status: "indexed",
    chunksCount: 52,
    lastIngested: "01 Mar 2026, 12:00",
    alertsCount: 0,
    category: "course-guides",
    owner: "Admissions Directorate",
    summary: "Direct entry criteria, recognized English tests (IELTS, PTE, TOEFL, Duolingo), EAP Level 2 articulation, and credit recognition (RPL)."
  },
  {
    id: "doc-7",
    code: "DOC-CIHE-2026-AIP-05",
    title: "Academic Integrity & Generative AI Code of Practice",
    version: "v2026.01",
    accessLevel: "student",
    status: "indexed",
    chunksCount: 60,
    lastIngested: "10 Feb 2026, 09:30",
    alertsCount: 0,
    category: "policy",
    owner: "Academic Integrity Committee",
    summary: "Defines proper citation of AI assistance, rules against ghostwriting/contract cheating, plagiarism penalties, and Turnitin similarity review thresholds."
  },
  {
    id: "doc-8",
    code: "DOC-CIHE-2026-AMND-09",
    title: "Academic Regulations Amendment Annex C",
    version: "v2026.02",
    accessLevel: "staff",
    status: "review",
    chunksCount: 114,
    lastIngested: "11 Mar 2026, 17:42",
    alertsCount: 1,
    category: "governance",
    owner: "Academic Board Secretariat",
    summary: "Staff internal provisions on exam script moderation and assessment scaling. Contains quarantined prompt-injection test."
  }
];

// ---------------------------------------------------------
// 5. Authoritative Knowledge Chunks for RAG Vector Index
// ---------------------------------------------------------
export const CIHE_CHUNKS: CIHEChunk[] = [
  {
    id: "chunk-sc-1",
    docId: "doc-1",
    docTitle: "CIHE Student Assessment Policy",
    docCode: "DOC-CIHE-2026-POL-04",
    version: "v2025.10",
    page: 4,
    section: "Clause 7.2.1",
    accessLevel: "student",
    tags: ["special consideration", "exam", "illness", "medical certificate", "deadline", "exemption", "reg-04"],
    content: "Clause 7.2.1: Applications for special consideration must be lodged within three (3) working days of the scheduled assessment date, accompanied by a registered practitioner medical certificate stating the impact on performance. Applications received past this cutoff are summarily declined unless severe incapacitation is evidenced.",
    exactQuote: "Clause 7.2.1: Applications for special consideration must be lodged within three (3) working days of the scheduled assessment date, accompanied by a registered practitioner medical certificate stating the impact on performance."
  },
  {
    id: "chunk-sc-2",
    docId: "doc-1",
    docTitle: "CIHE Student Assessment Policy",
    docCode: "DOC-CIHE-2026-POL-04",
    version: "v2025.10",
    page: 5,
    section: "Section 7.4.2",
    accessLevel: "student",
    tags: ["overslept", "traffic", "transport", "non-medical", "grounds", "misadventure", "exemption"],
    content: "Under Section 7.4.2 of the Assessment Governance By-Laws, severe disruptions are strictly evaluated on documented extenuating circumstances beyond a student's control. Routine misadventure, transport delays, and sleep schedule irregularities are explicitly classified as non-compensable events. Exemption without formal medical certificate is not permitted.",
    exactQuote: "Routine misadventure, transport delays, and sleep schedule irregularities are explicitly classified as non-compensable events."
  },
  {
    id: "chunk-def-1",
    docId: "doc-2",
    docTitle: "CIHE Student Handbook 2026",
    docCode: "DOC-CIHE-2026-HB-01",
    version: "v2026.02",
    page: 18,
    section: "Section 4.2",
    accessLevel: "student",
    tags: ["defer", "deferment", "leave of absence", "suspension", "reg-04", "compassionate", "census"],
    content: "Section 4.2: Deferment and Suspension of Studies. Students may apply for a formal deferral of their academic programme for a maximum cumulative period of up to two regular trimesters (one academic year), subject to faculty board endorsement and registry approval. Applications must be submitted no later than Census Date. Acceptable grounds include certified medical conditions, severe financial hardship, compassionate family needs, or compulsory civic duties. Students must complete Form REG-04 (Application for Deferment of Studies).",
    exactQuote: "Under Section 4.2 (Compassionate & Compelling Circumstances), applications for deferment must be submitted prior to the term census date. Deferrals are capped at two consecutive trimesters. Supporting documentation must accompany form REG-DEF-04."
  },
  {
    id: "chunk-prog-1",
    docId: "doc-2",
    docTitle: "CIHE Student Handbook 2026",
    docCode: "DOC-CIHE-2026-HB-01",
    version: "v2026.02",
    page: 24,
    section: "Section 4.5",
    accessLevel: "student",
    tags: ["progression", "gpa", "pass benchmark", "academic warning", "fail", "exclusion"],
    content: "Academic Progression & GPA Requirements: Satisfactory academic progression mandates passing at least 50% of credit points attempted in any study period. A cumulative GPA below 3.0 triggers Academic Warning Stage 1. Repeat unit failures trigger Stage 2 requiring mandatory consultation with the Learning Support Coordinator before census date.",
    exactQuote: "Satisfactory progression mandates passing at least 50% of credit points attempted in any study period. A cumulative GPA below 3.0 triggers Academic Warning Stage 1."
  },
  {
    id: "chunk-visa-1",
    docId: "doc-3",
    docTitle: "CIHE International Student Compliance Framework",
    docCode: "DOC-CIHE-2025-INT-02",
    version: "v2025.2",
    page: 9,
    section: "Section 4.3 & 4.7",
    accessLevel: "student",
    tags: ["visa", "cancellation", "attendance", "failed unit", "subclass 500", "prisms", "esos", "appeal"],
    content: "Under standard Australian Higher Education visa conditions (Subclass 500) and CIHE institutional regulations, a student visa is NOT cancelled automatically or immediately by CIHE following missing two tutorials or failing a single unit. CIHE follows a mandatory 3-stage intervention framework: Stage 1 (Early academic intervention & study plan review), Stage 2 (Formal Notice of Intention to Report - ITR issued only if progression thresholds fail across consecutive terms), Stage 3 (Strict 20-working-day internal appeal window prior to any federal PRISMS reporting).",
    exactQuote: "A student visa is not cancelled automatically or immediately by CIHE following missing two tutorials or failing a single unit. CIHE follows a mandatory staged intervention process before any formal escalation to PRISMS."
  },
  {
    id: "chunk-oshc-1",
    docId: "doc-3",
    docTitle: "CIHE International Student Compliance Framework",
    docCode: "DOC-CIHE-2025-INT-02",
    version: "v2025.2",
    page: 14,
    section: "Section 5.1",
    accessLevel: "student",
    tags: ["oshc", "health cover", "bupa", "medibank", "condition 8501", "insurance"],
    content: "Holders of Student Visa (subclass 500) must maintain continuous Overseas Student Health Cover (OSHC) throughout their entire enrolment duration until COE conclusion date under Department of Home Affairs condition 8501. CIHE institutional partners include Bupa Global and Medibank Comprehensive. Dual policy certificates must be uploaded to the Student Portal 14 days prior to term commencement.",
    exactQuote: "Holders of Student Visa (subclass 500) must maintain continuous OSHC throughout their entire enrolment duration until COE conclusion date."
  },
  {
    id: "chunk-fee-1",
    docId: "doc-4",
    docTitle: "Census Date & Tuition Refund Schedule 2026",
    docCode: "DOC-CIHE-2026-FN-01",
    version: "v2026.1",
    page: 2,
    section: "Section 2.1",
    accessLevel: "student",
    tags: ["census date", "refund", "tuition", "deadline", "fees", "withdrawal"],
    content: "Trimester 1 Census Date is finalized on Friday, 27 March 2026 at 11:59 PM AEDT. Withdrawals registered beforehand incur 0% financial penalty with 100% refund. Withdrawals occurring post-census date forfeit 100% of subject tuition fees (0% refund) and incur an academic penalty, unless documented Special Consideration is approved by the Academic Registrar.",
    exactQuote: "Trimester 1 Census Date is finalized on Friday, 27 March 2026 at 11:59 PM AEDT. Withdrawals registered beforehand incur 0% financial penalty."
  },
  {
    id: "chunk-courses-1",
    docId: "doc-2",
    docTitle: "CIHE Student Handbook 2026",
    docCode: "DOC-CIHE-2026-HB-01",
    version: "v2026.02",
    page: 8,
    section: "Section 2.0",
    accessLevel: "student",
    tags: ["courses", "programs", "degrees", "bachelor of information technology", "bachelor of business", "master", "bit", "bbus", "mit", "mpa", "education", "accounting"],
    content: "Crown Institute of Higher Education (CIHE) delivers TEQSA-accredited undergraduate and postgraduate programs across faculties of Information Technology, Business & Commerce, Accounting, and Education. Flagship degrees include Bachelor of Information Technology (BIT - 3 years, 24 units, ACS Accredited), Bachelor of Business (BBus - 3 years, 24 units), Master of Information Technology (MIT - 2 years, 16 units), Master of Professional Accounting (MPA - 2 years, CPA Australia & CA ANZ accredited), Bachelor of Education (Early Childhood - Birth to Five, 4 years, ACECQA approved), and Master of Teaching (Early Childhood).",
    exactQuote: "CIHE offers accredited higher education degrees including Bachelor of Information Technology (BIT), Bachelor of Business (BBus), Master of Information Technology (MIT), Master of Professional Accounting (MPA), and Bachelor of Education (Early Childhood)."
  },
  {
    id: "chunk-campus-all",
    docId: "doc-5",
    docTitle: "CIHE Multi-Campus Directory & Operations Guide 2026",
    docCode: "DOC-CIHE-2026-CAMP-08",
    version: "v2026.1",
    page: 4,
    section: "Section 1.0",
    accessLevel: "student",
    tags: ["campuses", "locations", "north sydney", "miller st", "sydney cbd", "hurstville", "canberra", "act", "perth", "wa", "address"],
    content: "CIHE operates across New South Wales (NSW), the Australian Capital Territory (ACT), and Western Australia (WA). Main locations: (1) North Sydney Central: 116 Pacific Highway, North Sydney NSW 2060. (2) Miller St: Level 5, 213 Miller St, North Sydney NSW 2060. (3) Sydney CBD: Level 11, 307 Pitt Street, Sydney NSW 2000. (4) Hurstville: 2 Woodville St, Hurstville NSW 2220. (5) Canberra Gungahlin: Level 1, 5 Fussell Lane, Gungahlin ACT 2912. (6) Canberra Belconnen: Level 4, 40 Cameron Ave, Belconnen ACT 2617. (7) Canberra Mitchell: Unit 2A, 118 Lysaght St, Mitchell ACT 2911. (8) West Perth WA: 1325 Hay Street, West Perth WA 6005 (launched March 2026 for Early Childhood Education). Central telephone: 1300 171 094.",
    exactQuote: "CIHE operates across NSW, ACT, and WA with central headquarters at 116 Pacific Highway, North Sydney, and modern campuses in Sydney CBD, Hurstville, Canberra, and West Perth."
  },
  {
    id: "chunk-fees-intl",
    docId: "doc-4",
    docTitle: "Census Date & Tuition Refund Schedule 2026",
    docCode: "DOC-CIHE-2026-FN-01",
    version: "v2026.1",
    page: 6,
    section: "Section 3.2",
    accessLevel: "student",
    tags: ["fees", "tuition", "cost", "international", "annual fee", "per semester", "price"],
    content: "International Tuition Fees 2026: Undergraduate courses (Bachelor of Information Technology, Bachelor of Business, Bachelor of Accounting, Bachelor of Entrepreneurship) are AUD $18,000 per year ($9,000 per semester). Bachelor of Education (Early Childhood) is AUD $20,000 per year ($10,000 per semester). Postgraduate courses (Master of IT, MBA, Master of Professional Accounting) range from AUD $22,000 to $24,000 per year ($11,000 to $12,000 per semester). Master of Teaching (Early Childhood) is AUD $25,000 per year ($12,500 per semester). Eligible domestic students can access Australian Government FEE-HELP loans.",
    exactQuote: "Undergraduate tuition fees for international students start at AUD $18,000 per year, while postgraduate degrees range from AUD $22,000 to AUD $25,000 per year."
  },
  {
    id: "chunk-english-entry",
    docId: "doc-6",
    docTitle: "Admissions Policy & English Language Proficiency Benchmarks",
    docCode: "DOC-CIHE-2026-ADM-03",
    version: "v2026.2",
    page: 3,
    section: "Clause 3.1",
    accessLevel: "student",
    tags: ["english", "ielts", "pte", "toefl", "duolingo", "admissions", "entry requirements", "eap"],
    content: "English Proficiency Requirements: (1) Undergraduate degrees: Academic IELTS overall 6.0 with no band less than 5.5, or PTE Academic 50 with no skill score below 42, TOEFL iBT 60 (min 18 writing), or Duolingo 105. (2) Postgraduate & Bachelor of Education: IELTS overall 6.5 (no band below 6.0), or PTE Academic 58 (no score below 50). (3) Master of Teaching (Early Childhood): IELTS overall 7.0 with no band below 6.5, or PTE Academic 65 (no score below 58). Direct entry is available via successful completion of CIHE English for Academic Purposes (EAP) Level 2 without re-taking IELTS.",
    exactQuote: "Undergraduate admission requires IELTS 6.0 (no band < 5.5) or PTE 50; Master of Teaching requires IELTS 7.0 (no band < 6.5). Successful completion of CIHE EAP Level 2 grants direct entry."
  },
  {
    id: "chunk-ai-integrity",
    docId: "doc-7",
    docTitle: "Academic Integrity & Generative AI Code of Practice",
    docCode: "DOC-CIHE-2026-AIP-05",
    version: "v2026.01",
    page: 2,
    section: "Clause 4.3",
    accessLevel: "student",
    tags: ["academic integrity", "generative ai", "chatgpt", "plagiarism", "cheating", "turnitin", "citation"],
    content: "CIHE Generative AI Guidelines: Students may use AI tools (such as REX, ChatGPT) for brainstorming, background research, and grammar refinement, provided the tool and prompts are explicitly acknowledged in the assessment declaration. Submitting AI-generated code or text verbatim as one's own work constitutes academic misconduct under Section 5. Turnitin similarity indexes above 20% are flagged for manual viva-voce examination by the Academic Integrity Officer.",
    exactQuote: "Submitting AI-generated text or code without formal disclosure is considered academic misconduct. Students must declare all generative AI usage in their submission statement."
  },
  {
    id: "chunk-moodle-support",
    docId: "doc-2",
    docTitle: "CIHE Student Handbook 2026",
    docCode: "DOC-CIHE-2026-HB-01",
    version: "v2026.02",
    page: 38,
    section: "Section 9.2",
    accessLevel: "student",
    tags: ["moodle", "student portal", "library", "ebsco", "proquest", "wifi", "login", "password"],
    content: "Moodle Learning Management System & Digital Resources: Students access lecture slides, assessment portals, and online quizzes via moodle.cihe.edu.au using their student email credentials (e.g. s12345@student.cihe.edu.au). The CIHE Library provides full-text access to EBSCO Host, ProQuest, IEEE Xplore, and emerald databases 24/7. IT Helpdesk is contactable via support@cihe.edu.au or phone 1300 171 094.",
    exactQuote: "Students access course materials, discussion boards, and submit assessments through CIHE Moodle at moodle.cihe.edu.au."
  },
  {
    id: "chunk-welfare-emergency",
    docId: "doc-2",
    docTitle: "CIHE Student Handbook 2026",
    docCode: "DOC-CIHE-2026-HB-01",
    version: "v2026.02",
    page: 44,
    section: "Section 11.0",
    accessLevel: "student",
    tags: ["emergency", "welfare", "hotline", "mental health", "counselling", "safety", "1800 244 431", "1300 171 094"],
    content: "Emergency & Student Wellbeing Support: CIHE provides free, confidential counselling for all enrolled students. 24/7 CIHE Emergency Assistance Hotline: 1800 244 431 (toll-free in Australia). Central Student Inquiries: 1300 171 094. For immediate life-threatening emergencies in Australia, dial 000 (Police/Fire/Ambulance).",
    exactQuote: "CIHE 24/7 Emergency Assistance Hotline: 1800 244 431. Student Services Phone: 1300 171 094."
  }
];

// ---------------------------------------------------------
// 6. Saved Answers Repository
// ---------------------------------------------------------
export const SAVED_ANSWERS: SavedAnswer[] = [
  {
    id: "saved-1",
    title: "Deferment of Studies Procedure",
    category: "policy",
    categoryLabel: "Academic Policy",
    sourceBadge: "Student Registry",
    savedDate: "12 Mar 2026",
    bindingStatus: "Statutory Binding",
    synthesisTitle: "REX Synthesis • CIHE Academic Regulations Manual",
    excerpt: "Under Section 4.2 (Compassionate & Compelling Circumstances), applications for deferment must be submitted prior to the term census date. Deferrals are capped at two consecutive trimesters. Supporting documentation (e.g., registered medical practitioner certificate, bereavement certificate) must accompany form REG-DEF-04.",
    citation: "CIHE Student Handbook 2026 · Section 4.2 · p. 18",
    formCode: "FORM REG-04",
    pdfDownloadName: "CIHE-Deferment-Procedure-2026.pdf"
  },
  {
    id: "saved-2",
    title: "OSHC Requirements & Provider Compliance",
    category: "fees-visas",
    categoryLabel: "Visa & Healthcare",
    sourceBadge: "International Office",
    savedDate: "04 Mar 2026",
    bindingStatus: "Condition 8501",
    synthesisTitle: "REX Synthesis • International Student Compliance Framework",
    excerpt: "Holders of Student Visa (subclass 500) must maintain continuous Overseas Student Health Cover (OSHC) for the entirety of their CoE validity. Dual policy certificates must be uploaded to the Student Portal 14 days prior to term commencement.",
    citation: "CIHE International Compliance Framework · Section 5.1 · p. 14",
    metaDetails: {
      type: "providers",
      data: [
        { name: "Bupa Global OSHC", tier: "Direct Institutional Partner", directBilling: true },
        { name: "Medibank Comprehensive", tier: "Accredited Provider", directBilling: true }
      ]
    },
    pdfDownloadName: "CIHE-OSHC-Guideline-2026.pdf"
  },
  {
    id: "saved-3",
    title: "Academic Progression & GPA Requirements",
    category: "policy",
    categoryLabel: "Progression Framework",
    sourceBadge: "Academic Board",
    savedDate: "28 Feb 2026",
    bindingStatus: "Institutional Policy",
    synthesisTitle: "REX Synthesis • CIHE Course Progression Guidelines",
    excerpt: "Satisfactory progression mandates passing at least 50% of credit points attempted in any study period. A cumulative GPA below 3.0 triggers Academic Warning Stage 1. Repeat unit failures trigger Stage 2 requiring mandatory consultation with the Learning Support Coordinator.",
    citation: "CIHE Course Progression Guidelines · Section 4.5 · p. 24",
    metaDetails: {
      type: "metric",
      data: {
        currentStatus: "Clear Standing",
        minimumPassRate: "50%",
        warningThresholdGPA: "3.0"
      }
    },
    pdfDownloadName: "CIHE-Progression-Rules-2026.pdf"
  },
  {
    id: "saved-4",
    title: "Census Date & Tuition Refund Schedule",
    category: "fees-visas",
    categoryLabel: "Fees & Finance",
    sourceBadge: "Bursar Office",
    savedDate: "15 Feb 2026",
    bindingStatus: "Financial Regulation",
    synthesisTitle: "REX Synthesis • Census Date & Refund Policy",
    excerpt: "Trimester 1 Census Date is finalized on Friday, 27 March 2026 at 11:59 PM AEDT. Withdrawals registered beforehand incur 0% financial penalty with 100% refund. Withdrawals occurring post-census date forfeit 100% of subject tuition fees (0% refund).",
    citation: "Census Date & Tuition Refund Schedule 2026 · Section 2.1 · p. 2",
    metaDetails: {
      type: "timeline",
      data: [
        { event: "Classes Begin", date: "09 Mar 2026", status: "Past" },
        { event: "T1 Census Date (100% Refund Cutoff)", date: "27 Mar 2026", status: "Critical" },
        { event: "Post-Census (0% Refund, Academic Penalty)", date: "28 Mar 2026 onwards", status: "Forfeit" }
      ]
    },
    pdfDownloadName: "CIHE-Census-Schedule-2026.pdf"
  },
  {
    id: "saved-5",
    title: "Perth West Campus & Early Childhood Education",
    category: "course-guides",
    categoryLabel: "Campus & Courses",
    sourceBadge: "Dean of Education",
    savedDate: "09 Mar 2026",
    bindingStatus: "Campus Advisory",
    synthesisTitle: "REX Synthesis • West Perth Campus Launch",
    excerpt: "CIHE West Perth campus officially commenced teaching on 09 March 2026 at 1325 Hay Street, West Perth WA 6005. Programs include Bachelor of Education (Early Childhood), Graduate Diploma in Education, and Master of Teaching, all ACECQA recognized with local placement partnerships.",
    citation: "CIHE Multi-Campus Directory & Operations Guide 2026 · p. 4",
    pdfDownloadName: "CIHE-West-Perth-Campus-Guide.pdf"
  }
];

// ---------------------------------------------------------
// 7. Policy Gap & Audit Intelligence Data
// ---------------------------------------------------------
export const POLICY_GAPS: PolicyGap[] = [
  {
    id: "gap-1",
    category: "Special Consideration",
    code: "GAP-SC-01",
    sampleQuestion: "Does a telehealth statutory declaration count for late extension submissions?",
    cluster: "Medical Evidence Authenticity",
    fallbackCount: 42,
    classification: "Coverage Gap",
    classificationReason: "Current policy specifies AHPRA practitioner certificates; lack of explicit telehealth platform clause.",
    recommendedAction: "Publish official criteria on registered telehealth practitioners.",
    actionDetails: "Academic Board Annex review scheduled for next cycle.",
    priority: "HIGH",
    assignee: "Registry Directorate"
  },
  {
    id: "gap-2",
    category: "Visa Compliance",
    code: "GAP-VISA-04",
    sampleQuestion: "Can I work 52 hours in a fortnight if my exam was cancelled?",
    cluster: "ESOS Work Limit Ambiguity",
    fallbackCount: 38,
    classification: "Human Referral Required",
    classificationReason: "Complex visa condition 8105 interpretation. Requires designated compliance liaison review.",
    recommendedAction: "Mandate immediate referral to International Student Office.",
    actionDetails: "Workflow automated in REX triage queue STU-882.",
    priority: "HIGH",
    assignee: "International Office"
  },
  {
    id: "gap-3",
    category: "Deferment / Leave",
    code: "GAP-DEF-02",
    sampleQuestion: "Does mental health leave pause my course progress timeline?",
    cluster: "Leave of Absence Rules",
    fallbackCount: 29,
    classification: "Coverage Gap",
    classificationReason: "Ambiguity between medical suspension and maximum course duration limit (6 years).",
    recommendedAction: "Update Section 4.3 of Student Handbook with suspension time allowance rules.",
    actionDetails: "Dean of Academic Operations endorsing clarification note.",
    priority: "MEDIUM",
    assignee: "Academic Operations"
  },
  {
    id: "gap-4",
    category: "Course Fees",
    code: "GAP-FEE-03",
    sampleQuestion: "Is FEE-HELP available for international students on permanent resident pathway?",
    cluster: "Domestic vs International Fee Subsidies",
    fallbackCount: 21,
    classification: "Retrieval Miss",
    classificationReason: "FEE-HELP eligibility depends on citizenship / permanent humanitarian visa status.",
    recommendedAction: "Add explicit FEE-HELP eligibility matrix to Finance chunk index.",
    actionDetails: "Bursar fee schedule v2026.2 published to repository.",
    priority: "MEDIUM",
    assignee: "Bursar Accounts"
  }
];
