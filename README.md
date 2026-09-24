# HalalVeritas: AI-Powered Halal Dining & Certificate Verification Engine

> Production-Grade Full-Stack Web Platform for Halal Dining Discovery with Google Gemini 2.5 Flash Multimodal Vision Verification and Real-Time Dietary Concierge.

---

## 🌟 Executive Overview & Architectural Philosophy

**HalalVeritas** eliminates dietary ambiguity for Muslim consumers and conscious diners worldwide. It establishes an automated, zero-trust marketplace for Halal-certified dining featuring:

1. **Multimodal AI Certificate Vision Engine:** Powered by the official `@google/genai` SDK using `gemini-2.5-flash` with strict JSON schema enforcement to optically verify physical accreditation documents, validate regulatory stamps/seals, and detect fraud risk or expired credentials.
2. **Dynamic Geospatial Discovery Engine:** High-performance spatial querying (haversine radius calculations), customized interactive Leaflet map layers, and multi-variable filtering matrices (100% Halal kitchen, strictly alcohol-free premises, prayer spaces on-site, hand-slaughtered meat, specific global certifiers like JAKIM, IFANCA, HMC, SANHA, MUIS).
3. **Conversational AI Dietary Concierge:** Low-temperature (0.2) RAG assistant synthesizing real-time database context to answer complex dietary questions without hallucination.
4. **Dual-Role User Ecosystem:** Public diners, establishment merchants (venue profile creation, drag-and-drop certificate upload, menu management), and administrative compliance auditors.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18+, Vite, Tailwind CSS, Lucide Icons, TanStack React Query, Leaflet UI |
| **Backend** | Node.js (ES Modules), Express.js, Async Error Boundary, Express Rate Limit |
| **Database** | PostgreSQL with Raw SQL Migrations (`schema.sql`) + Smart Embedded Fallback Engine |
| **AI Orchestration** | `@google/genai` SDK utilizing `gemini-2.5-flash` with `responseSchema` JSON validation |
| **Validation** | Zod (`z`) unified schemas for frontend forms and backend API payloads |
| **Authentication** | JWT (JSON Web Tokens) with `bcryptjs` password hashing and role-based access control |
| **File Processing** | Multer memory buffer pipeline, 10MB limit, strict MIME type validation |

---

## 📂 Project Repository Structure

```
halal-dining-engine/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIChatWidget.jsx
│   │   │   ├── CertificateViewerModal.jsx
│   │   │   ├── HeroSearch.jsx
│   │   │   ├── InteractiveMap.jsx
│   │   │   ├── MerchantCertificateUploader.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── VenueCard.jsx
│   │   │   └── VerificationBadge.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   └── AuditQueuePage.jsx
│   │   │   ├── merchant/
│   │   │   │   ├── CertificateUploadPage.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── MenuManagement.jsx
│   │   │   │   └── VenueEdit.jsx
│   │   │   ├── AIConciergePage.jsx
│   │   │   ├── CertifiersPage.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── VenueDetail.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── gemini.js
│   ├── db/
│   │   ├── schema.sql
│   │   ├── seed.js
│   │   └── seedData.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── certificateRoutes.js
│   │   ├── certifierRoutes.js
│   │   ├── menuRoutes.js
│   │   └── venueRoutes.js
│   ├── services/
│   │   ├── aiAdvisorService.js
│   │   └── visionService.js
│   ├── .env
│   ├── index.js
│   └── package.json
├── shared/
│   └── schemas.js
├── .env.template
├── package.json
└── README.md
```

---

## ⚡ Quick Start & Running Locally

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 2. Install Dependencies
In the root directory or respective subdirectories:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Configuration
Ensure `server/.env` contains your settings:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=production-grade-halal-dining-jwt-secret-key-2026-secure
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/halal_directory_db
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```
> **Zero-Friction Offline / Local Ready:** If PostgreSQL is not active locally or `DATABASE_URL` is unreachable, the system automatically falls back to an embedded in-memory relational engine with identical schema and rich seed data, allowing immediate testing of all routes, uploads, and AI queries without database setup blockers!

### 4. Launch Application
In two separate terminals:

```bash
# Terminal 1: Launch Backend API Server (Port 5000)
cd server
npm run dev

# Terminal 2: Launch Frontend Client (Port 5173)
cd client
npm run dev
```

Open your browser at: **[http://localhost:5173](http://localhost:5173)**

---

## 🎭 One-Click Demo Personas

On the navigation bar and on `/login`, you can switch between three pre-configured test personas with a single click:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Diner** | `diner@halalfinder.com` | `password123` | Search, GPS radar, inspect certificates, leave verified reviews, chat with AI concierge |
| **Merchant** | `merchant@halalfinder.com` | `password123` | Venue portal, upload Halal certificates, manage menu items with Halal tags |
| **Admin** | `admin@halalfinder.com` | `password123` | Lead auditor console, review flagged AI extractions, manual override decisions |

---

## 🤖 Google Gemini 2.5 Flash Multimodal Vision Pipeline

The certificate analysis runs through the `@google/genai` SDK with strict JSON schema enforcement:

```json
{
  "is_valid_halal_certificate": true,
  "confidence_score": 98.4,
  "extracted_venue_name": "Al-Madina Artisan Prime Steakhouse",
  "venue_name_matches": true,
  "certifying_body_name": "Islamic Food and Nutrition Council of America (IFANCA)",
  "certificate_id": "IFANCA-USA-2026-9812A",
  "issue_date": "2026-01-15",
  "expiration_date": "2027-01-14",
  "is_expired": false,
  "detected_flags": [],
  "summary_explanation": "Official IFANCA accreditation seal confirmed. Full scope covers hand-slaughtered beef and poultry operations. Zero cross-contamination issues identified."
}
```

### Verification Thresholds:
- **`AI_VERIFIED`**: Confidence ≥ 80%, venue name matches, official seal verified, not expired.
- **`PENDING_HUMAN_REVIEW`**: Confidence between 40% and 79%, name discrepancy, or image glare.
- **`EXPIRED` / `REJECTED`**: Validity date has elapsed or document failed regulatory checks.

---

## 🗺️ Geospatial & Dietary Filtering Engine

- **Haversine Distance Search:** Real-time distance calculation in kilometers from user GPS coordinates.
- **Dietary Filter Matrix:**
  - `is_alcohol_free`: Strictly 100% alcohol-free kitchen prep and zero alcohol sales on premises.
  - `has_prayer_space`: Dedicated on-site prayer facilities.
  - `is_hand_slaughtered_only`: 100% hand-slaughtered (Zabiha) meats.
  - `certifying_body_id`: Filter by certifying authorities (JAKIM, IFANCA, HMC, SANHA, MUIS, HFCAA).

---

## 🛡️ Security & Zero-Trust Guarantees

- **Zero Hallucination AI Concierge:** Real-time PostgreSQL database state injected into Gemini prompt with low temperature (0.2). Explicitly warns users if a venue is unverified, expired, or self-declared.
- **File Upload Protection:** Memory buffer processing with Multer, 10MB limit, strict MIME verification.
- **Rate Limiting:** IP-based express rate limiter on API endpoints with stricter quotas on AI routes.
- **Authentication:** Standard JWT auth stored in secure cookies and Bearer headers.
