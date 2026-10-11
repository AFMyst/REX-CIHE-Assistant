# REX - CIHE Student Academic Copilot

An institutional AI copilot and academic advisor for Crown Institute of Higher Education (CIHE) students and staff, featuring RAG-grounded policy lookups, multi-turn chat sessions with persistent history, census deadline calculations, academic appeals guidelines, course schedules, and TEQSA/ESOS compliant citations.

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun** or **yarn**

### 2. Installation
```bash
# Clone or unzip the project folder
cd rex-cihe-copilot

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory (copied from `.env.example`):
```bash
cp .env.example .env
```

Set your Google Gemini API key:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```
*(Note: If no API key is provided, the copilot will automatically fall back to the built-in institutional RAG knowledge base.)*

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🏛️ Features Included

- **Continuous Multi-Turn Chat Conversation**: Natural conversation loop with concise, professional responses powered by Gemini 2.5 Flash / institutional RAG.
- **Saved Answers & Session Management**:
  - Save, reload, rename, and manage multiple chat history sessions.
  - Export chat transcripts as formatted Markdown or PDF Academic Memos.
  - Pre-seeded institutional scenarios (Census dates, Special Consideration, MIT courses).
- **Interactive Academic Tools**:
  - Course Navigator (Master of Information Technology, Bachelor of Business, etc.)
  - Academic Calendar & Census Dates Countdown.
  - Campus Directory (Sydney CBD & North Sydney).
  - Human Advisor Escalation & Referral Desk.
  - Staff Admin Ingestion & Policy Gap Analysis.
