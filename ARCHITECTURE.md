# Mis Gestiones - Architecture Documentation

## Overview

**Mis Gestiones** is a personal management system for tracking finances, budgets, and family activities. The system is composed of 4 repositories that work together to provide a complete solution across web, mobile, and backend platforms.

---

## 1. Repository Overview

### 1.1 mis-gestiones (Main Web App)

**Repository:** `TomasNati/mis-gestiones`

**Main Purpose:**
- Primary web application for managing personal finances, budgets, and family activities
- Provides comprehensive UI for desktop/web users
- User-facing application for end-users

**Main Functionalities:**
- **Finance Management:**
  - Track income/expenses (movimientos)
  - View monthly transactions
  - Search and filter movements
  - Budget tracking per month
  - Payment due dates tracking (vencimientos)
  - Import financial data
- **Family Management:**
  - Tomi's schedule/agenda
- **Settings & Configuration:**
  - User preferences
  - Category management

**Technologies:**
- **Framework:** Next.js 16.2.3 (React 19.2.1)
- **Language:** TypeScript
- **UI Library:** Material-UI (MUI) v6
  - MUI X Data Grid
  - MUI X Charts
  - MUI X Date Pickers
- **Database ORM:** Drizzle ORM
- **Database:** PostgreSQL (via @vercel/postgres, @neondatabase/serverless)
- **State Management:** TanStack React Query v5
- **Data Tables:** Material React Table
- **Styling:** Tailwind CSS + Emotion
- **Build Tool:** Next.js with Turbopack
- **Deployment:** Vercel
- **Dev Server:** Port 9999

**API Routes:**
Located in `/api` folder with serverless functions:
- `conceptos-movimientos.ts` - Movement concepts
- `movimientos.ts` - Financial movements
- `subcategoria.ts` - Subcategories
- `agenda-tomi` - Tomi's agenda
- `finanzas` - Financial endpoints
- `hello.ts` - Health check

---

### 1.2 mis-gestiones-admin (Admin Panel)

**Repository:** `TomasNati/mis-gestiones-admin` (assumed)

**Main Purpose:**
- Administrative interface for managing backend configuration
- Category and subcategory management
- System administration tasks

**Main Functionalities:**
- Category CRUD operations
- Subcategory management
- Data administration
- System configuration

**Technologies:**
- **Framework:** React 19.1.1 with Vite
- **Build Tool:** Vite (using Rolldown-Vite 7.1.14)
- **Language:** TypeScript 5.9.3
- **UI Library:** Material-UI (MUI) v7
  - MUI X Date Pickers
- **State Management:** TanStack React Query v5
- **Forms:** React Hook Form v7 with Zod v4 validation
- **Data Tables:** Material React Table v3
- **HTTP Client:** Axios v1.12.2
- **Styling:** Emotion
- **Compiler:** React Compiler enabled (experimental)
- **Deployment:** Vercel (https://mis-gestiones-admin.vercel.app)

---

### 1.3 mis-gestiones-backend (API Backend)

**Repository:** `TomasNati/mis-gestiones-backend` (assumed)

**Main Purpose:**
- Centralized REST API backend
- Database operations and business logic
- Integration with external services (Google Drive)
- Serves both web and admin applications

**Main Functionalities:**
- **Category Management:**
  - Get/Create/Update/Delete categories
  - Get/Create/Update/Delete subcategories
- **Movement Management:**
  - Search and filter movements (movimientos-gasto)
  - CRUD operations for financial transactions
- **File Management:**
  - Google Drive integration for file storage
  - File upload/download endpoints
- **Data Models:**
  - SQLAlchemy models for database schema
  - Pydantic models for API validation

**Technologies:**
- **Framework:** FastAPI
- **Language:** Python
- **Database ORM:** SQLAlchemy
- **Database Driver:** psycopg2-binary (PostgreSQL)
- **External APIs:** Google Drive API
  - google-api-python-client
  - google-auth
- **Web Server:** Uvicorn
- **Configuration:** python-dotenv
- **File Upload:** python-multipart
- **Deployment:** Vercel (Serverless Functions)
- **Dev Server:** Port 5001

**CORS Configuration:**
- http://localhost:5173 (Vite default)
- http://localhost:9999 (Next.js dev)
- https://mis-gestiones-admin.vercel.app
- https://mis-gestiones-opal-kappa.vercel.app

---

### 1.4 mis-gestiones-mobile (Mobile App)

**Repository:** `TomasNati/mis-gestiones-mobile` (assumed)

**Main Purpose:**
- Mobile application for iOS/Android
- On-the-go access to finances and family activities
- Optimized mobile UX for quick data entry

**Main Functionalities:**
- Finance tracking on mobile
- Tomi's schedule access
- Quick expense entry
- View financial summaries

**Technologies:**
- **Framework:** Expo 54
- **Router:** Expo Router 6 (file-based routing)
- **Language:** TypeScript 5.9.2
- **UI Framework:** React Native 0.81.5
- **React:** React 19.1.0
- **Navigation:** 
  - @react-navigation/native v7
  - @react-navigation/bottom-tabs v7
- **Native Components:**
  - DateTimePicker
  - Picker
  - WebView
  - Gesture Handler
  - Reanimated v4
- **Math:** math-expression-evaluator (shared with web)
- **Build:** EAS Build
- **Testing:** Jest with jest-expo
- **Deployment:** Android APK via EAS Build (preview profile)

**Project Structure:**
- File-based routing with Expo Router
- Tab navigation (finanzas, tomi, index)
- Shared styles across components

---

## 2. System Architecture

### 2.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACES                         │
├─────────────────────────┬───────────────────┬───────────────────┤
│                         │                   │                   │
│  ┌───────────────────┐  │  ┌─────────────┐  │  ┌─────────────┐  │
│  │  mis-gestiones    │  │  │mis-gestiones│  │  │mis-gestiones│  │
│  │   (Main Web)      │  │  │   -admin    │  │  │   -mobile   │  │
│  │                   │  │  │(Admin Panel)│  │  │(Mobile App) │  │
│  │  Next.js + MUI    │  │  │ Vite + MUI  │  │  │Expo + RN    │  │
│  │  Port: 9999       │  │  │ Port: 5173  │  │  │iOS/Android  │  │
│  └─────────┬─────────┘  │  └──────┬──────┘  │  └──────┬──────┘  │
│            │            │         │         │         │         │
│            │  Serverless│         │   HTTP  │         │  HTTP   │
│            │  Functions │         │   API   │         │   API   │
│            │            │         │         │         │         │
└────────────┼────────────┴─────────┼─────────┴─────────┼─────────┘
             │                      │                   │
             │ Direct DB            │                   │
             │ Access via           │                   │
             │ Drizzle ORM          │                   │
             │                      │                   │
             ▼                      ▼                   │
    ┌─────────────────┐    ┌─────────────────┐         │
    │   PostgreSQL    │◄───│ mis-gestiones-  │◄────────┘
    │    Database     │    │    backend      │
    │                 │    │                 │
    │ (Vercel/Neon)   │    │  FastAPI + SA   │
    └─────────────────┘    │  Port: 5001     │
                           └────────┬────────┘
                                    │
                                    │ Google API
                                    ▼
                           ┌─────────────────┐
                           │  Google Drive   │
                           │  File Storage   │
                           └─────────────────┘
```

### 2.2 Data Flow

**1. Direct Database Access (mis-gestiones web app):**
```
User → Next.js App → API Routes → Drizzle ORM → PostgreSQL
```

**2. Backend API Flow (admin panel & mobile):**
```
Admin/Mobile → HTTP Request → FastAPI Backend → SQLAlchemy → PostgreSQL
                                    ↓
                              Google Drive API
```

**3. File Management:**
```
User Upload → Backend API → Google Drive → Storage
User Download → Backend API ← Google Drive ← Fetch
```

---

## 3. Database Architecture

### Shared PostgreSQL Database

All applications connect to a single PostgreSQL database hosted on Vercel/Neon.

**Access Patterns:**
- **mis-gestiones (web):** Direct access via Drizzle ORM through serverless functions
- **mis-gestiones-backend:** Direct access via SQLAlchemy
- **mis-gestiones-admin:** Indirect access via backend API
- **mis-gestiones-mobile:** Indirect access via backend API

**Key Entities:**
- Categories & Subcategories
- Movimientos (Financial transactions)
- Conceptos (Transaction concepts)
- Vencimientos (Payment due dates)
- Presupuesto (Budgets)
- Agenda Tomi (Family schedule)

**Backup Strategy:**
- Manual backups using `pg_dump`
- Stored in: Google Drive > Finanzas > Backups-MisGestiones

---

## 4. Deployment Architecture

### Production URLs

| Application | URL | Platform |
|------------|-----|----------|
| Main Web App | https://mis-gestiones-opal-kappa.vercel.app | Vercel |
| Admin Panel | https://mis-gestiones-admin.vercel.app | Vercel |
| Backend API | (Vercel Functions) | Vercel |
| Mobile App | (APK via EAS Build) | Native |

### Environment Configuration

All projects use environment variables for:
- Database connection strings
- API endpoints
- Google API credentials
- CORS origins

---

## 5. Development Workflow

### Local Development

**Main Web App:**
```bash
cd mis-gestiones
yarn dev  # Starts on port 9999
vercel dev  # For testing serverless functions
```

**Admin Panel:**
```bash
cd mis-gestiones-admin
npm run dev  # Starts on port 5173
```

**Backend API:**
```bash
cd mis-gestiones-backend
pip install -r requirements.txt
uvicorn main:app --reload --port 5001
```

**Mobile App:**
```bash
cd mis-gestiones-mobile
npm start  # Opens Expo DevTools
npm run android  # Android emulator
npm run ios  # iOS simulator
```

### Deployment

- **Web & Admin:** Automatic deployment via Vercel on git push
- **Backend:** Serverless deployment on Vercel
- **Mobile:** Manual build via `eas build --platform android --profile preview`

---

## 6. Technology Stack Summary

### Frontend Technologies
- **React 19** - UI library (all apps)
- **TypeScript** - Type safety (all apps)
- **Material-UI v6/v7** - Component library
- **TanStack Query** - Server state management
- **React Hook Form + Zod** - Form validation

### Backend Technologies
- **FastAPI** - Python web framework
- **SQLAlchemy** - Python ORM
- **Drizzle ORM** - TypeScript ORM (web app)
- **PostgreSQL** - Primary database

### Mobile Technologies
- **React Native** - Mobile framework
- **Expo** - Development platform
- **Expo Router** - File-based routing

### Infrastructure
- **Vercel** - Hosting & serverless functions
- **Neon/Vercel Postgres** - Database hosting
- **Google Drive** - File storage
- **EAS Build** - Mobile app builds

### Shared Libraries
- **math-expression-evaluator** - Calculator functionality (web + mobile)
- **axios** - HTTP client (admin + backend communication)
- **dayjs** - Date manipulation

---

## 7. Key Integration Points

### 1. Web App ↔ Database
- Direct connection via Drizzle ORM
- Serverless API routes in `/api` folder
- Type-safe database queries

### 2. Admin Panel ↔ Backend API
- REST API calls via Axios
- CORS enabled for localhost:5173
- Material React Table for data display

### 3. Mobile App ↔ Backend API
- HTTP requests to FastAPI endpoints
- Expo WebView for embedded content
- Native date pickers and UI components

### 4. Backend ↔ Google Drive
- File upload/download via Google Drive API
- OAuth authentication
- File metadata management

### 5. Shared Database Schema
- SQLAlchemy models (Python)
- Drizzle schema (TypeScript)
- Must be kept in sync manually

---

## 8. Security Considerations

- **Authentication:** Vercel authentication for web apps
- **API Security:** HMAC verification in backend endpoints
- **CORS:** Restricted to known origins only
- **Environment Variables:** Sensitive data in .env files (not committed)
- **Database:** Secure connection strings via environment variables
- **Google Drive:** OAuth 2.0 authentication

---

## 9. Future Considerations

### Potential Improvements
- Unified API gateway (consolidate direct DB access)
- Shared TypeScript types across all projects
- Automated database migrations
- CI/CD pipeline for mobile builds
- Real-time sync between applications
- PWA support for mobile web
- GraphQL API layer for flexible querying

---

## 10. Repository Links

| Repository | Purpose | Status |
|-----------|---------|--------|
| mis-gestiones | Main web application | ✅ Active |
| mis-gestiones-admin | Admin panel | ✅ Active |
| mis-gestiones-backend | API backend | ✅ Active |
| mis-gestiones-mobile | Mobile app | ✅ Active |

---

## Maintenance Notes

- Keep dependencies updated across all repos
- Sync database schema changes between Drizzle and SQLAlchemy
- Test CORS configuration when adding new deployment URLs
- Maintain backup schedule for database
- Monitor Vercel function usage and limits

---

**Last Updated:** 2026-04-24
**Documentation Version:** 1.0
