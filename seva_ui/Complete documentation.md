# ADMIN WEB DASHBOARD
## Complete Project Deliverables Documentation

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Wireframes & User Flows](#2-wireframes--user-flows)
3. [UI/UX Design](#3-uiux-design)
4. [Source Code Structure](#4-source-code-structure)
5. [Features & Functionality](#5-features--functionality)
6. [Build & Deployment](#6-build--deployment)
7. [Backend Integration](#7-backend-integration)

---

## 1. PROJECT OVERVIEW

### 1.1 Project Information

**Project Name:** Sode Sri Vadiraja Matha - Admin Web Dashboard  
**Version:** 1.0.0  
**Type:** Single Page Application (SPA)  
**Primary Language:** TypeScript  
**Framework:** React 18 + Vite  

### 1.2 Technology Stack

**Frontend:**
- React 18.2.0
- TypeScript 5.3.3
- Vite 5.1.0 (Build tool)

**UI Framework:**
- Material-UI (MUI) 5.15.10
- MUI X Data Grid 6.19.5
- MUI X Date Pickers 6.19.5
- Emotion (CSS-in-JS)

**State Management:**
- Zustand 4.5.0 (Lightweight state)

**Form Management:**
- React Hook Form 7.50.1
- Yup 1.3.3 (Validation)

**Routing:**
- React Router DOM 6.22.0

**HTTP Client:**
- Axios 1.6.7

**Authentication:**
- Firebase 10.8.0 (Auth)

**Charts:**
- Chart.js 4.4.1
- React Chart.js 2 5.2.0

**Date Handling:**
- date-fns 3.3.1

### 1.3 Key Features

1. **Dashboard**
   - Statistics overview
   - Recent bookings
   - Pending approvals
   - Quick actions

2. **Content Management**
   - News articles (CRUD)
   - Events (CRUD)
   - Flash updates (CRUD)
   - Gallery albums & media (CRUD)
   - Artefacts (PDFs/Audio) (CRUD)
   - History sections (CRUD)
   - Users (promote/revoke admin role)

3. **Service Management**
   - Seva services (CRUD)
   - Seva orders (View, Filter)
   - Room bookings (View, Approve/Reject)

4. **Interactive Content**
   - Quiz questions (CRUD)

5. **Configuration**
   - App settings (Feature toggles)
   - Temple information (Timings)
   - Social media links (CRUD)

6. **Authentication**
   - Firebase email/password login
   - Secure admin access
   - Session management

---

## 2. WIREFRAMES & USER FLOWS

### 2.1 Application Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        ADMIN WEB APP                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────┐
│  Login Screen   │
│                 │
│  ┌───────────┐  │
│  │  Email    │  │
│  ├───────────┤  │
│  │  Password │  │
│  ├───────────┤  │
│  │ [Sign In] │  │
│  └───────────┘  │
└─────────────────┘
        │
        ▼ (Authenticated)
┌──────────────────────────────────────────────────────────────┐
│  Main Layout                                                 │
│  ┌────────────┬──────────────────────────────────────────┐  │
│  │  Sidebar   │         Main Content Area                │  │
│  │  (Nav)     │                                          │  │
│  │            │  ┌────────────────────────────────────┐  │  │
│  │ Dashboard  │  │         Page Content               │  │  │
│  │ News       │  │                                    │  │  │
│  │ Events     │  │  (Dashboard / News / Events /      │  │  │
│  │ Gallery    │  │   Gallery / Sevas / Bookings /     │  │  │
│  │ Artefacts  │  │   Quiz / Config / etc.)            │  │  │
│  │ History    │  │                                    │  │  │
│  │ Sevas      │  └────────────────────────────────────┘  │  │
│  │ Bookings   │                                          │  │
│  │ Quiz       │                                          │  │
│  │ Config     │                                          │  │
│  │ Users      │                                          │  │
│  │ [Logout]   │                                          │  │
│  └────────────┴──────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 User Flows

#### 2.2.1 Login Flow
```
Start
  │
  ▼
[Login Page]
  │
  ├─ Enter email/password
  │
  ├─ Click "Sign In"
  │
  ▼
[Firebase Authentication]
  │
  ├─ Success ──────────────► [Dashboard]
  │
  └─ Failure ──────────────► [Error message] ─► [Login Page]
```

#### 2.2.2 Content Management Flow (Example: News)
```
[News List Page]
  │
  ├─► View all news articles in data grid
  │   ├─ Filter by active/inactive
  │   └─ Search by title
  │
  ├─► Click "Add News"
  │   │
  │   ▼
  │   [News Form Dialog]
  │   ├─ Enter title
  │   ├─ Upload image
  │   ├─ Enter content (body)
  │   ├─ Set active/inactive
  │   ├─ Click "Save"
  │   │   │
  │   │   ▼
  │   │   [API POST /admin/news]
  │   │   │
  │   │   ├─ Success ──► [Close dialog] ──► [Refresh list]
  │   │   └─ Error ────► [Show error] ────► [Form remains open]
  │   │
  │   └─ Click "Cancel" ──► [Close dialog]
  │
  ├─► Click "Edit" on row
  │   │
  │   ▼
  │   [News Form Dialog] (pre-filled)
  │   ├─ Modify fields
  │   ├─ Click "Update"
  │   │   │
  │   │   ▼
  │   │   [API PUT /admin/news/:id]
  │   │   │
  │   │   ├─ Success ──► [Close dialog] ──► [Refresh list]
  │   │   └─ Error ────► [Show error]
  │   │
  │   └─ Click "Cancel" ──► [Close dialog]
  │
  └─► Click "Delete" on row
      │
      ▼
      [Confirmation Dialog]
      │
      ├─ Click "Confirm"
      │   │
      │   ▼
      │   [API DELETE /admin/news/:id]
      │   │
      │   ├─ Success ──► [Refresh list]
      │   └─ Error ────► [Show error]
      │
      └─ Click "Cancel" ──► [Close dialog]
```

#### 2.2.3 Room Booking Management Flow
```
[Room Bookings Page]
  │
  ├─► View all bookings in data grid
  │   ├─ Filter by status (NEW, EMAIL_SENT, EMAIL_FAILED)
  │   ├─ Filter by date range
  │   └─ Search by name/mobile
  │
  ├─► Click on booking row
  │   │
  │   ▼
  │   [Booking Details Dialog]
  │   ├─ View devotee details
  │   ├─ View check-in date
  │   ├─ View people count
  │   ├─ View notes
  │   ├─ View consent status
  │   │
  │   ├─► Click "Mark as Email Sent"
  │   │   │
  │   │   ▼
  │   │   [API PUT /admin/room-bookings/:id/status]
  │   │   │ { status: "EMAIL_SENT" }
  │   │   │
  │   │   ├─ Success ──► [Update status] ──► [Refresh list]
  │   │   └─ Error ────► [Show error]
  │   │
  │   └─► Click "Close" ──► [Close dialog]
  │
  └─► Export bookings
      │
      ▼
      [Download CSV file]
```

#### 2.2.4 Payment Order Management Flow
```
[Seva Orders Page]
  │
  ├─► View all seva orders
  │   ├─ Filter by status (INITIATED, PAID, FAILED, CANCELLED)
  │   ├─ Filter by seva type
  │   ├─ Filter by date range
  │   └─ Search by order ID/devotee info
  │
  ├─► Click on order row
  │   │
  │   ▼
  │   [Order Details Dialog]
  │   ├─ View seva details
  │   ├─ View devotee information (if consent given)
  │   ├─ View payment details
  │   │   ├─ Amount (₹)
  │   │   ├─ Razorpay Order ID
  │   │   ├─ Razorpay Payment ID
  │   │   └─ Payment status
  │   ├─ View order timeline
  │   │
  │   └─► Click "Close" ──► [Close dialog]
  │
  └─► Export orders
      │
      ▼
      [Download CSV file]
```

### 2.3 Page Wireframes

#### Dashboard
```
┌────────────────────────────────────────────────────────────┐
│  Dashboard                                                 │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Total   │  │  Active  │  │ Pending  │  │  Total   │  │
│  │  Sevas   │  │  Events  │  │ Bookings │  │  Orders  │  │
│  │    12    │  │    8     │  │    5     │  │   234    │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                            │
│  Recent Room Bookings                                      │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Name     │ Mobile       │ Check-in  │ Status         │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ John Doe │ 9876543210   │ 2024-12-25│ NEW           │ │
│  │ Jane     │ 9876543211   │ 2024-12-26│ EMAIL_SENT    │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Quick Actions                                             │
│  [Add News] [Add Event] [Add Seva] [View All Orders]      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### List Page (Example: News)
```
┌────────────────────────────────────────────────────────────┐
│  News Management                             [+ Add News]  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Filters: [All] [Active] [Inactive]    Search: [_______ ] │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Image │ Title       │ Active │ Created    │ Actions  │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │  [▓]  │ News Title  │   ✓    │ 2024-01-01 │ [✏][🗑] │ │
│  │  [▓]  │ Another     │   ✗    │ 2024-01-02 │ [✏][🗑] │ │
│  │  [▓]  │ Latest News │   ✓    │ 2024-01-03 │ [✏][🗑] │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Showing 1-10 of 25        [< Prev] [1] [2] [3] [Next >]  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### Form Dialog (Example: Add/Edit Event)
```
┌────────────────────────────────────────────┐
│  Add Event                          [X]    │
├────────────────────────────────────────────┤
│                                            │
│  Title *                                   │
│  [_____________________________________]   │
│                                            │
│  Description                               │
│  [_____________________________________]   │
│  [_____________________________________]   │
│  [_____________________________________]   │
│                                            │
│  Event Date *                              │
│  [2024-12-25]  📅                          │
│                                            │
│  Location                                  │
│  [_____________________________________]   │
│                                            │
│  Image URL                                 │
│  [_____________________________________]   │
│  [Upload Image]                            │
│                                            │
│  Type *                                    │
│  [▼ Select Type]                           │
│  ├─ ARADHANA                               │
│  ├─ PARYAYA                                │
│  ├─ UTSAVA                                 │
│  └─ GENERAL                                │
│                                            │
│  Scope *                                   │
│  [▼ Select Scope]                          │
│  ├─ LOCAL                                  │
│  └─ NATIONAL                               │
│                                            │
│  ☐ Notify Users                            │
│                                            │
│  Tithi Label                               │
│  [_____________________________________]   │
│                                            │
│  ☑ Active                                  │
│                                            │
├────────────────────────────────────────────┤
│                    [Cancel]  [Save Event]  │
└────────────────────────────────────────────┘
```

---

## 3. UI/UX DESIGN

### 3.1 Design System

**Color Palette:**
```
Primary:   #1976d2 (Blue)
Secondary: #dc004e (Pink)
Success:   #4caf50 (Green)
Error:     #f44336 (Red)
Warning:   #ff9800 (Orange)
Info:      #2196f3 (Light Blue)

Background: #fafafa (Light Gray)
Surface:    #ffffff (White)
Text:       #000000 (Black)
Text Sec:   #666666 (Gray)
```

**Typography:**
```
Font Family: "Roboto", "Helvetica", "Arial", sans-serif
Headings:    500-700 weight
Body:        400 weight
Buttons:     500 weight
```

**Spacing:**
```
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
xxl: 48px
```

**Border Radius:**
```
Default: 4px
Cards:   8px
Buttons: 4px
Dialogs: 8px
```

### 3.2 Component Design

#### Navigation Sidebar
```
┌──────────────────┐
│  📊 Dashboard    │ ← Active (Highlighted)
│  📰 News         │
│  📅 Events       │
│  🖼 Gallery      │
│  📚 Artefacts    │
│  📜 History      │
│  🕉 Sevas        │
│  🏨 Bookings     │
│  📋 Orders       │
│  ❓ Quiz         │
│  🔧 Config       │
│  ─────────────── │
│  🚪 Logout       │
└──────────────────┘
```

#### Data Grid Features
- Sortable columns
- Filterable columns
- Searchable
- Paginated (10/25/50 rows per page)
- Row selection
- Action buttons (Edit, Delete)
- Export to CSV
- Responsive design

#### Form Validation
- Real-time validation
- Error messages below fields
- Required field indicators (*)
- Success feedback
- Disabled submit until valid

### 3.3 Responsive Design

**Breakpoints:**
```
xs: 0px     (Mobile)
sm: 600px   (Tablet portrait)
md: 900px   (Tablet landscape)
lg: 1200px  (Desktop)
xl: 1536px  (Large desktop)
```

**Mobile Adaptations:**
- Collapsible sidebar (drawer)
- Stacked form fields
- Simplified data grid
- Touch-friendly buttons (min 44px height)
- Bottom navigation alternative

---

## 4. SOURCE CODE STRUCTURE

### 4.1 Directory Structure

```
admin-web-corrected/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Root component
│   ├── components/
│   │   ├── layout/
│   │   │   └── MainLayout.tsx      # Main app layout with sidebar
│   │   └── common/
│   │       ├── DataTable.tsx       # Reusable data grid
│   │       └── FileUpload.tsx      # File upload component
│   ├── pages/
│   │   ├── Login.tsx               # Login page
│   │   ├── LandingPage.tsx         # Dashboard
│   │   ├── News/
│   │   │   └── index.tsx           # News management
│   │   ├── Events/
│   │   │   └── index.tsx           # Events management
│   │   ├── Gallery/
│   │   │   └── index.tsx           # Gallery management
│   │   ├── Artefacts/
│   │   │   └── index.tsx           # Artefacts management
│   │   ├── History/
│   │   │   └── index.tsx           # History management
│   │   ├── Sevas/
│   │   │   └── index.tsx           # Sevas management
│   │   ├── RoomBookings/
│   │   │   └── index.tsx           # Room bookings
│   │   ├── SevaOrders/
│   │   │   └── index.tsx           # Seva orders
│   │   ├── Quiz/
│   │   │   └── index.tsx           # Quiz management
│   │   ├── Config/
│   │   │   └── index.tsx           # App configuration
│   │   ├── MathaInfo/
│   │   │   └── index.tsx           # Temple info
│   │   └── SocialLinks/
│   │       └── index.tsx           # Social links
│   │   ├── Users/
│   │       └── index.tsx           # User info
│   ├── services/
│   │   └── index.ts                # API service functions
│   ├── store/
│   │   └── index.ts                # Zustand store
│   ├── types/
│   │   └── index.ts                # TypeScript types
│   ├── utils/
│   │   ├── axios.ts                # Axios instance
│   │   └── firebase.ts             # Firebase config
│   └── styles/
│       └── theme.ts                # MUI theme
├── .env.example                    # Environment variables template
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite config
├── README.md                       # Project README
├── BACKEND_ANALYSIS.md             # Backend compatibility notes
└── PAGES_FIX_GUIDE.md              # Page-by-page fixes
```

### 4.2 Key Files

**Component Count:**
- Pages: 12
- Layout components: 1
- Common components: 2
- Total: 15+ components

**Service Functions:**
- Authentication: 2
- Content APIs: 10+
- Config APIs: 3
- Total: 15+ API functions

**TypeScript Interfaces:**
- 20+ type definitions matching backend DTOs

---

## 5. FEATURES & FUNCTIONALITY

### 5.1 Feature List

#### ✅ Implemented Features

1. **Authentication**
   - Firebase email/password login
   - Session persistence
   - Protected routes
   - Logout functionality

2. **Dashboard**
   - Statistics cards
   - Recent bookings table
   - Quick action buttons

3. **News Management**
   - List all news articles
   - Create new article
   - Edit existing article
   - Delete article
   - Image upload (Firebase Storage)
   - Active/inactive toggle

4. **Events Management**
   - List all events
   - Create new event
   - Edit existing event
   - Delete event
   - Image upload
   - Event type (ARADHANA, PARYAYA, UTSAVA, GENERAL)
   - Event scope (LOCAL, NATIONAL)
   - Date picker
   - Tithi label input
   - Notify users option

5. **Gallery Management**
   - List albums
   - Create album
   - Edit album
   - Delete album
   - Cover image upload
   - Add media to album (images/videos)
   - Delete media

6. **Artefacts Management**
   - List artefacts (PDFs/Audio)
   - Create artefact
   - Edit artefact
   - Delete artefact
   - File upload (PDF/Audio)
   - Category management
   - Type selection (PDF/AUDIO)

7. **History Management**
   - List history sections
   - Create section
   - Edit section
   - Delete section
   - Sort order management
   - Image upload

8. **Sevas Management**
   - List sevas
   - Create seva
   - Edit seva
   - Delete seva
   - Amount in rupees (auto-converts to paise)

9. **Room Bookings**
   - View all bookings
   - Filter by status
   - Update booking status
   - View devotee details (if consent given)
   - Export to CSV

10. **Seva Orders**
    - View all orders
    - Filter by status
    - Filter by date
    - View payment details
    - View devotee details (if consent given)
    - Amount display (paise to rupees conversion)

11. **Quiz Management**
    - List questions
    - Create question
    - Edit question
    - Delete question
    - Options (A, B, C, D)
    - Correct answer selection

12. **Flash Updates**
    - List flash messages
    - Create flash message
    - Edit flash message
    - Delete flash message
    - Active/inactive toggle

13. **Configuration**
    - Feature toggles (enable/disable modules)
    - Update app config

14. **Temple Information**
    - Edit temple timings
    - Darshan timings
    - Prasada timings

15. **Social Links**
    - List social links
    - Create link
    - Edit link
    - Delete link
    - Platform selection
16. **Users**
    - List All Users
    - Promote as Admin
    - Revoke as Admin

### 5.2 User Permissions

**Admin Role:**
- Full CRUD access to all content
- View all bookings and orders
- Update configuration
- Cannot delete orders (view only)

---

## 6. BUILD & DEPLOYMENT

### 6.1 Prerequisites

```bash
Node.js 18+
npm or yarn
```

### 6.2 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
```

### 6.3 Environment Variables

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Backend API
VITE_API_BASE_URL=http://localhost:8080/api
```

### 6.4 Development

```bash
# Start development server
npm run dev

# Access at http://localhost:5173
```

### 6.5 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### 6.6 Deployment

**Option 1: Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Option 2: Netlify**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
netlify deploy --prod
```

**Option 3: Traditional Server**
```bash
# Build
npm run build

# Copy dist/ folder to server
scp -r dist/* user@server:/var/www/admin-web/

# Configure nginx
server {
    listen 80;
    server_name admin.sodematha.org;
    root /var/www/admin-web;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 7. BACKEND INTEGRATION

### 7.1 API Configuration

**Base URL:** Configured in `.env`
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

**Authentication:**
```typescript
// Add Firebase ID token to requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 7.2 API Endpoints Used

**Admin endpoints (all require authentication):**
```
GET    /admin/news
POST   /admin/news
PUT    /admin/news/:id
DELETE /admin/news/:id

GET    /admin/events
POST   /admin/events
PUT    /admin/events/:id
DELETE /admin/events/:id

GET    /admin/gallery/albums
POST   /admin/gallery/albums
PUT    /admin/gallery/albums/:id
DELETE /admin/gallery/albums/:id

POST   /admin/gallery/media
DELETE /admin/gallery/media/:id

GET    /admin/artefacts
POST   /admin/artefacts
PUT    /admin/artefacts/:id
DELETE /admin/artefacts/:id

GET    /admin/history
POST   /admin/history
PUT    /admin/history/:id
DELETE /admin/history/:id

GET    /admin/sevas
POST   /admin/sevas
PUT    /admin/sevas/:id
DELETE /admin/sevas/:id

GET    /admin/seva-orders
GET    /admin/seva-orders/:id

GET    /admin/room-bookings
GET    /admin/room-bookings/:id
PUT    /admin/room-bookings/:id/status

GET    /admin/quiz/questions
POST   /admin/quiz/questions
PUT    /admin/quiz/questions/:id
DELETE /admin/quiz/questions/:id

GET    /admin/flash
POST   /admin/flash
PUT    /admin/flash/:id
DELETE /admin/flash/:id

GET    /admin/config
PUT    /admin/config

GET    /admin/temple-info
PUT    /admin/temple-info

GET    /admin/social
POST   /admin/social
PUT    /admin/social/:id
DELETE /admin/social/:id

GET    /admin/users
POST   /admin/users/promote
POST   /admin/users/demote
```

### 7.3 Data Transformations

**Important conversions handled:**

1. **Amount (Paise ↔ Rupees)**
```typescript
// Display: paise to rupees
display = amountInPaise / 100

// Save: rupees to paise
save = rupeesAmount * 100
```

2. **Quiz Options (Array ↔ Individual fields)**
```typescript
// Backend expects:
{
  optionA: "Option A text",
  optionB: "Option B text",
  optionC: "Option C text",
  optionD: "Option D text",
  correctOption: "A" // enum
}

// Frontend uses:
{
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctAnswer: 0 // index
}
```

3. **Field Name Mappings**
```typescript
// Backend → Frontend
{
  title → name (Sevas)
  body → content (News)
  text → message (Flash)
  sortOrder → displayOrder (History)
  questionText → question (Quiz)
}
```

### 7.4 Error Handling

```typescript
// API call wrapper
try {
  const response = await api.get('/admin/news');
  return response.data;
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error('Server error:', error.response.data);
    throw new Error(error.response.data.message);
  } else if (error.request) {
    // No response from server
    throw new Error('No response from server');
  } else {
    // Request setup error
    throw new Error('Request failed');
  }
}
```

---

## APPENDICES

### A. Dependencies Summary

**Production Dependencies:**
- @emotion/react, @emotion/styled
- @mui/material, @mui/icons-material, @mui/x-data-grid, @mui/x-date-pickers
- axios
- chart.js, react-chartjs-2
- date-fns
- firebase
- react, react-dom
- react-hook-form
- react-router-dom
- yup
- zustand

**Development Dependencies:**
- @types/react, @types/react-dom
- @typescript-eslint/*
- @vitejs/plugin-react
- eslint
- typescript
- vite

### B. Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### C. Performance Optimizations

- Code splitting by route
- Lazy loading of components
- Memoization of expensive calculations
- Debounced search inputs
- Pagination for large lists
- Image optimization

### D. Known Issues & Limitations

1. Backend doesn't support some fields (see BACKEND_ANALYSIS.md)
2. File uploads go to Firebase Storage (separate from backend)
3. Image previews loaded from external URLs
4. No offline support
5. Single language (English) only

---

## CONTACT INFORMATION

**Project Team:** Admin Web Development  
**Email:** dev@sodematha.org  
**Documentation Version:** 1.0.0  
**Last Updated:** February 2025

---

**END OF DOCUMENTATION**