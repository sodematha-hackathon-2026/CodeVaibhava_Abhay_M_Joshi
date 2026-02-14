# SODEMATHA MOBILE APP
## Complete Project Deliverables Documentation

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Wireframes & User Flows](#2-wireframes--user-flows)
3. [UI/UX Design](#3-uiux-design)
4. [Features & Screens](#4-features--screens)
5. [Source Code Structure](#5-source-code-structure)
6. [Build & Deployment](#6-build--deployment)
7. [Backend Integration](#7-backend-integration)

---

## 1. PROJECT OVERVIEW

### 1.1 Project Information

**Project Name:** Sode Sri Vadiraja Matha - Mobile Application  
**Version:** 1.0.0  
**Platforms:** iOS & Android  
**Type:** Native Mobile Application  
**Primary Language:** TypeScript  
**Framework:** React Native (Expo)  

### 1.2 Technology Stack

**Framework:**
- Expo SDK 54.0.33
- React Native 0.81.5
- React 19.1.0

**Navigation:**
- React Navigation 7.x
  - Native Stack Navigator
  - Bottom Tab Navigator

**State Management:**
- Redux Toolkit 2.11.2
- React Redux 9.2.0
- Redux Persist 6.0.0

**Form Management:**
- React Hook Form 7.71.1
- Yup 1.7.1 (Validation)
- @hookform/resolvers 5.2.2

**Authentication:**
- Firebase Auth (@react-native-firebase/auth)
- Firebase Firestore (@react-native-firebase/firestore)
- Firebase Messaging (@react-native-firebase/messaging)

**Payments:**
- React Native Razorpay 2.3.1

**UI Components:**
- React Native built-in components
- Custom UI components
- @react-native-community/datetimepicker
- react-native-calendars

**Internationalization:**
- i18next 25.8.4
- react-i18next 16.5.4

**Audio/Video:**
- expo-av (Audio/Video playback)

**Storage:**
- @react-native-async-storage/async-storage
- expo-secure-store

**Other:**
- expo-file-system
- @react-native-voice/voice (Voice search)
- expo-linking (Deep linking)
- expo-notifications (Push notifications)

### 1.3 Key Features

1. **User Authentication**
   - Phone number authentication (OTP)
   - Firebase Auth integration
   - Persistent login

2. **Home Screen**
   - Latest news
   - Upcoming events
   - Flash updates
   - Panchanga (Hindu calendar)
   - Quick navigation

3. **Events Calendar**
   - Monthly calendar view
   - Filter by event type
   - Event details
   - Reminders/Notifications

4. **Gallery**
   - Photo albums
   - Video gallery
   - Image viewer
   - Share functionality

5. **Artefacts (Digital Library)**
   - PDF viewer
   - Audio player
   - Category filtering
   - Search functionality

6. **History**
   - Temple history sections
   - Timeline view
   - Image galleries

7. **Sevas (Services)**
   - Browse available sevas
   - Seva booking
   - Payment integration (Razorpay)
   - Order history

8. **Room Booking**
   - Booking form
   - Date selection
   - Confirmation

9. **Quiz**
   - Interactive quiz
   - Multiple choice questions
   - Score tracking
   - Leaderboard

10. **Multilingual Support**
    - English
    - Kannada
    - Hindi
    - Language switcher

11. **Push Notifications**
    - Event reminders
    - News updates
    - Flash messages

12. **Profile Management**
    - User profile
    - Order history
    - Booking history

---

## 2. WIREFRAMES & USER FLOWS

### 2.1 Application Navigation Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    SODEMATHA MOBILE APP                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  Splash Screen   │
│                  │
│     Logo         │
│   Loading...     │
└────────┬─────────┘
         │
         ▼
    ┌────────────────┐
    │ Auth Check     │
    └───────┬────────┘
            │
    ┌───────┴────────┐
    │                │
    ▼                ▼
┌─────────┐    ┌──────────────────────────────────┐
│  Login  │    │      Main App (Tab Navigation)   │
│  Screen │    │                                  │
│         │    │  ┌────┬────┬────┬────┬────┐      │
│ Phone#  │    │  │Home│Evts│More│Quiz│Prof│      │
│  OTP    │    │  └─┬──┴──┬─┴──┬─┴──┬─┴──┬─┘      │
│         │    │    │     │    │    │    │        │
└────┬────┘    └────┼─────┼────┼────┼────┼────────┘
     │              │     │    │    │    │
     │              ▼     ▼    ▼    ▼    ▼
     └──────►  Home  Events  More Quiz Profile
               Stack  Stack  Stack
```

### 2.2 Bottom Tab Navigation

```
┌──────────────────────────────────────────────────────────┐
│                    MAIN APP SCREEN                       │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │                                                    │ │
│  │           Active Screen Content                    │ │
│  │                                                    │ │
│  │      (Home / Events / More / Quiz / Profile)      │ │
│  │                                                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐  │
│  │  🏠    │  📅     │   ⋯     │   ❓    │   👤   │  │
│  │  Home  │ Events  │  More   │  Quiz   │ Profile │  │
│  └─────────┴─────────┴─────────┴─────────┴─────────┘  │
└──────────────────────────────────────────────────────────┘
```

### 2.3 User Flows

#### 2.3.1 Authentication Flow
```
App Launch
    │
    ▼
Check Logged In?
    │
    ├─ YES ──────────────► Main App (Home Screen)
    │
    └─ NO
       │
       ▼
   [Login Screen]
       │
       ├─ Enter Phone Number
       │
       ▼
   [Firebase Send OTP]
       │
       ▼
   [OTP Input Screen]
       │
       ├─ Enter OTP Code
       │
       ▼
   [Firebase Verify OTP]
       │
       ├─ Success ──────► [Create/Load Profile] ──► Main App
       │
       └─ Failure ──────► [Error Message] ──► [Login Screen]
```

#### 2.3.2 Seva Booking Flow
```
[Sevas Screen]
    │
    ├─ View list of available sevas
    │  ├─ Filter by category
    │  └─ Search sevas
    │
    ├─ Tap on a seva
    │
    ▼
[Seva Details Screen]
    │
    ├─ View description
    ├─ View price
    ├─ View terms
    │
    ├─ Tap "Book Seva"
    │
    ▼
[Seva Booking Form]
    │
    ├─ Enter personal details
    │  ├─ Full Name *
    │  ├─ Mobile *
    │  ├─ Email
    │  ├─ Address
    │  └─ ☑ Consent to store data
    │
    ├─ Review order
    │  ├─ Seva name
    │  ├─ Amount
    │  └─ Details
    │
    ├─ Tap "Proceed to Payment"
    │
    ▼
[Create Order]
    │
    ├─ API POST /seva-orders
    │
    ▼
[Razorpay Payment Screen]
    │
    ├─ Select payment method
    │  ├─ UPI
    │  ├─ Card
    │  ├─ Net Banking
    │  └─ Wallet
    │
    ├─ Complete payment
    │
    ▼
[Payment Status]
    │
    ├─ Success
    │  │
    │  ├─ API POST /seva-orders/{id}/verify
    │  │
    │  ▼
    │  [Order Confirmed]
    │  │
    │  ├─ Show success message
    │  ├─ Show order ID
    │  └─ Navigate to Order History
    │
    └─ Failure
       │
       ├─ Show error message
       └─ Option to retry
```

#### 2.3.3 Room Booking Flow
```
[More Tab] → [Room Booking]
    │
    ▼
[Room Booking Form]
    │
    ├─ Enter details
    │  ├─ Full Name *
    │  ├─ Mobile *
    │  ├─ Email
    │  ├─ Number of People *
    │  ├─ Check-in Date * (Calendar picker)
    │  ├─ Special Requests
    │  └─ ☑ Consent to store data
    │
    ├─ Validate form
    │
    ├─ Tap "Submit Request"
    │
    ▼
[API POST /room-bookings]
    │
    ├─ Success
    │  │
    │  ▼
    │  [Confirmation Screen]
    │  │
    │  ├─ "Request submitted successfully!"
    │  ├─ "Admin will contact you via email/phone"
    │  └─ [Back to Home]
    │
    └─ Failure
       │
       ├─ Show error message
       └─ Option to retry
```

#### 2.3.4 Quiz Flow
```
[Quiz Tab]
    │
    ▼
[Quiz Landing Screen]
    │
    ├─ Show leaderboard preview
    ├─ Show quiz instructions
    │
    ├─ Tap "Start Quiz"
    │
    ▼
[Fetch Questions]
    │
    ├─ API GET /quiz/questions?count=10
    │
    ▼
[Quiz Question Screen]
    │
    ├─ Display Question 1/10
    ├─ Show 4 options (A, B, C, D)
    ├─ Timer (optional)
    │
    ├─ Select answer
    ├─ Tap "Next"
    │
    ├─ Repeat for all 10 questions
    │
    ▼
[Submit Quiz]
    │
    ├─ API POST /quiz/submit
    │  └─ Send answers + userName
    │
    ▼
[Quiz Result Screen]
    │
    ├─ Show score (e.g., "8/10")
    ├─ Show percentage (80%)
    ├─ Show correct answers
    │
    ├─ Tap "View Leaderboard"
    │
    ▼
[Leaderboard Screen]
    │
    ├─ Show top scores
    ├─ Highlight user's position
    └─ Option to retake quiz
```

### 2.4 Screen Wireframes

#### Home Screen
```
┌────────────────────────────────────────┐
│  ☰  Sode Sri Vadiraja Matha    🔔  ⚙  │ ← Header
├────────────────────────────────────────┤
│                                        │
│  📰 Latest News                        │
│  ┌──────────────────────────────────┐ │
│  │ [Image]                          │ │
│  │ News Title                       │ │
│  │ Brief description...             │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ⚡ Flash Updates                      │
│  • Important announcement              │
│  • Temple closed on...                 │
│                                        │
│  📅 Upcoming Events                    │
│  ┌──────────────────────────────────┐ │
│  │ DEC 25  Aradhana Utsava          │ │
│  │ DEC 31  Special Pooja            │ │
│  └──────────────────────────────────┘ │
│                                        │
│  🗓 Today's Panchanga                  │
│  Monday | Purnima                      │
│                                        │
│  Quick Actions                         │
│  [🕉 Sevas] [🏨 Room] [📚 Library]     │
│                                        │
├────────────────────────────────────────┤
│  🏠   📅   ⋯   ❓   👤               │ ← Bottom Tabs
└────────────────────────────────────────┘
```

#### Events Screen
```
┌────────────────────────────────────────┐
│  ←  Events Calendar           [Month]  │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐ │
│  │   December 2024                  │ │
│  │  S  M  T  W  T  F  S             │ │
│  │  1  2  3  4  5  6  7             │ │
│  │  8  9 10 11 12 13 14             │ │
│  │ 15 16 17 18 19 20 21             │ │
│  │ 22 23 24 (25)26 27 28            │ │ ← Event marked
│  │ 29 30 31                         │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Filter: [All ▼] [Type ▼]             │
│                                        │
│  Events on Dec 25, 2024                │
│  ┌──────────────────────────────────┐ │
│  │ [Image]                          │ │
│  │ Aradhana Utsava                  │ │
│  │ Main Temple | 6:00 AM            │ │
│  │ Purnima                          │ │
│  └──────────────────────────────────┘ │
│                                        │
├────────────────────────────────────────┤
│  🏠   📅   ⋯   ❓   👤               │
└────────────────────────────────────────┘
```

#### Seva Form Screen
```
┌────────────────────────────────────────┐
│  ←  Book Seva                          │
├────────────────────────────────────────┤
│                                        │
│  Seva: Ekadina Seva                    │
│  Amount: ₹100                          │
│                                        │
│  Personal Details                      │
│  ┌──────────────────────────────────┐ │
│  │ Full Name *                      │ │
│  │ [_____________________________]  │ │
│  │                                  │ │
│  │ Mobile Number *                  │ │
│  │ [_____________________________]  │ │
│  │                                  │ │
│  │ Email                            │ │
│  │ [_____________________________]  │ │
│  │                                  │ │
│  │ Address Line 1                   │ │
│  │ [_____________________________]  │ │
│  │                                  │ │
│  │ City                             │ │
│  │ [_____________________________]  │ │
│  │                                  │ │
│  │ State                            │ │
│  │ [_____________________________]  │ │
│  │                                  │ │
│  │ Pincode                          │ │
│  │ [_____________________________]  │ │
│  │                                  │ │
│  │ ☑ I consent to store my data    │ │
│  │                                  │ │
│  │      [Proceed to Payment]        │ │
│  └──────────────────────────────────┘ │
│                                        │
└────────────────────────────────────────┘
```

#### Gallery Screen
```
┌────────────────────────────────────────┐
│  ←  Gallery Albums                     │
├────────────────────────────────────────┤
│                                        │
│  ┌────────────┬────────────┐          │
│  │ [Cover    ]│ [Cover    ]│          │
│  │  Image 1  ]│  Image 2  ]│          │
│  │            │            │          │
│  │ Album Name │ Album Name │          │
│  │ 15 photos  │ 20 photos  │          │
│  └────────────┴────────────┘          │
│                                        │
│  ┌────────────┬────────────┐          │
│  │ [Cover    ]│ [Cover    ]│          │
│  │  Image 3  ]│  Image 4  ]│          │
│  │            │            │          │
│  │ Album Name │ Album Name │          │
│  │ 8 photos   │ 12 photos  │          │
│  └────────────┴────────────┘          │
│                                        │
├────────────────────────────────────────┤
│  🏠   📅   ⋯   ❓   👤               │
└────────────────────────────────────────┘
```

#### Quiz Screen
```
┌────────────────────────────────────────┐
│  ←  Quiz                    Question 3/10│
├────────────────────────────────────────┤
│                                        │
│  Who is the founder of Madhva         │
│  Sampradaya?                           │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ A. Sri Madhvacharya              │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ B. Sri Ramanuja                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ C. Sri Shankaracharya            │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ D. Sri Chaitanya                 │ │
│  └──────────────────────────────────┘ │
│                                        │
│                                        │
│               [Next Question]           │
│                                        │
└────────────────────────────────────────┘
```

#### Profile Screen
```
┌────────────────────────────────────────┐
│  Profile                        [Edit] │
├────────────────────────────────────────┤
│                                        │
│          [👤 Avatar]                   │
│                                        │
│          User Name                     │
│          +91 9876543210                │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ 📱 Account Settings              │ │
│  │ 🔔 Notifications                 │ │
│  │ 🌐 Language (English ▼)          │ │
│  │ 📋 My Seva Orders                │ │
│  │ 🏨 My Room Bookings              │ │
│  │ ℹ️ About Temple                  │ │
│  │ 📞 Contact Us                    │ │
│  │ 📄 Privacy Policy                │ │
│  │ 📜 Terms & Conditions            │ │
│  │                                  │ │
│  │ 🚪 Logout                        │ │
│  └──────────────────────────────────┘ │
│                                        │
├────────────────────────────────────────┤
│  🏠   📅   ⋯   ❓   👤               │
└────────────────────────────────────────┘
```

---

## 3. UI/UX DESIGN

### 3.1 Design System

**Color Palette:**
```
Primary:    #FF6B35 (Saffron/Orange)
Secondary:  #004E89 (Deep Blue)
Accent:     #FFC857 (Golden Yellow)
Success:    #4CAF50 (Green)
Error:      #F44336 (Red)
Warning:    #FF9800 (Orange)

Background: #FFFFFF (White)
Surface:    #F5F5F5 (Light Gray)
Text:       #212121 (Dark Gray)
Text Sec:   #757575 (Gray)
Border:     #E0E0E0 (Light Border)
```

**Typography:**
```
Font Family: System default (San Francisco/Roboto)

Headings:
  H1: 28px, Bold
  H2: 24px, SemiBold
  H3: 20px, SemiBold
  H4: 18px, Medium

Body:
  Large:  16px, Regular
  Normal: 14px, Regular
  Small:  12px, Regular

Button: 16px, SemiBold
```

**Spacing Scale:**
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
Small:  4px  (Buttons, inputs)
Medium: 8px  (Cards)
Large:  12px (Modals, sheets)
Round:  50%  (Avatars, icons)
```

**Shadows:**
```
Light:  elevation: 2
Medium: elevation: 4
Heavy:  elevation: 8
```

### 3.2 Component Library

**Custom Components:**
1. **Card** - Content container with shadow
2. **Button** - Primary, Secondary, Outline variants
3. **Input** - Text, Number, Phone inputs
4. **DatePicker** - Date selection
5. **Header** - App header with title and actions
6. **TabBar** - Bottom navigation
7. **ListItem** - Touchable list item
8. **ImageCard** - Image with overlay text
9. **Badge** - Status indicators
10. **LoadingSpinner** - Activity indicator
11. **EmptyState** - No data placeholder
12. **ErrorBoundary** - Error handling

### 3.3 Animations

**Transitions:**
- Screen transitions: Slide from right (iOS), Fade (Android)
- Modal: Slide from bottom
- Fade in/out for content loading

**Micro-interactions:**
- Button press: Scale down (0.95)
- Swipe gestures on image galleries
- Pull to refresh
- Skeleton loading for content

### 3.4 Accessibility

✅ Large touch targets (min 44x44 points)  
✅ Color contrast ratio > 4.5:1  
✅ Screen reader support (accessibilityLabel)  
✅ Voice control support  
✅ Keyboard navigation (where applicable)  
✅ Error messages clearly visible  

---

## 4. FEATURES & SCREENS

### 4.1 Screen Inventory

**Total Screens: 17**

#### Authentication (2 screens)
1. **LoginScreen** - Phone number + OTP authentication

#### Tab Screens (5 screens)
2. **HomeScreen** - News, events, panchanga, quick actions
3. **EventCalendarScreen** - Monthly calendar with events
4. **MoreScreen** - Navigation hub for other features
5. **QuizScreen** - Quiz interface
6. **ProfileScreen** - User profile and settings

#### Content Screens (6 screens)
7. **GalleryAlbumsScreen** - Photo album listing
8. **GalleryAlbumDetailScreen** - Photos in an album
9. **ArtefactsScreen** - PDFs and audio files
10. **HistoryScreen** - Temple history sections

#### Service Screens (4 screens)
11. **SevasScreen** - Available sevas listing
12. **SevaFormScreen** - Seva booking form
13. **SevaRazorpayPaymentScreen** - Payment interface
14. **BookingScreen** - Room booking form

#### Utility Screens (3 screens)
15. **QuizResultScreen** - Quiz score and results
16. **QuizLeaderboardScreen** - Top scores
17. **SectionsSearchScreen** - Universal search

### 4.2 Feature Details

#### 4.2.1 Authentication
**Technology:** Firebase Phone Authentication
**Flow:**
1. Enter phone number (+91 format)
2. Receive OTP via SMS
3. Enter 6-digit OTP
4. Auto-verify and login
5. Store auth state in Redux + SecureStore

**Error Handling:**
- Invalid phone number
- OTP timeout (60 seconds)
- Wrong OTP (retry allowed)
- Network errors

#### 4.2.2 Home Feed
**Components:**
- News carousel (swipeable)
- Flash updates marquee
- Upcoming events list (next 3)
- Panchanga widget
- Quick action buttons

**Data Sources:**
- API GET /home (all data in one call)
- Cached in Redux
- Pull to refresh

#### 4.2.3 Events Calendar
**Features:**
- Monthly calendar view
- Event markers on dates
- Filter by type (ARADHANA, PARYAYA, UTSAVA, GENERAL)
- Filter by scope (LOCAL, NATIONAL)
- Event detail modal
- Share event

**Library:** react-native-calendars

#### 4.2.4 Gallery
**Features:**
- Album grid view
- Tap to open album
- Photo grid within album
- Full-screen image viewer
- Pinch to zoom
- Share image
- Video playback

**Libraries:**
- Image: Built-in Image component
- Video: expo-av

#### 4.2.5 Artefacts (Digital Library)
**Categories:**
- Stotras (PDFs)
- Lectures (Audio)
- Bhajanas (Audio)
- Documents (PDFs)

**Features:**
- Category filter tabs
- Search by title
- PDF viewer (in-app)
- Audio player with controls
  - Play/Pause
  - Seek bar
  - Speed control (0.5x - 2x)
  - Background playback

**Libraries:**
- PDF: expo-file-system + WebView
- Audio: expo-av

#### 4.2.6 History
**Features:**
- Vertical timeline view
- Section cards with image
- Expandable descriptions
- Sort by period

#### 4.2.7 Seva Booking
**Flow:**
1. Browse sevas (list view)
2. Tap seva → See details
3. Tap "Book" → Fill form
4. Review order
5. Pay via Razorpay
6. Payment verification
7. Confirmation screen

**Form Fields:**
- Full Name (required)
- Mobile (required)
- Email (optional)
- Address (optional but multiple fields)
- Consent checkbox (required)

**Payment:**
- Razorpay integration
- Support for UPI, Cards, Net Banking, Wallets
- Payment signature verification

**Libraries:** react-native-razorpay

#### 4.2.8 Room Booking
**Flow:**
1. Fill booking form
2. Submit request
3. Confirmation message
4. Admin approval (external)

**Form Fields:**
- Name (required)
- Mobile (required)
- Email (optional)
- Number of people (required)
- Check-in date (required)
- Special requests (optional)
- Consent checkbox (required)

**Note:** No payment required, request-based booking

#### 4.2.9 Quiz
**Features:**
- 10 random questions per quiz
- Multiple choice (A, B, C, D)
- Timer (optional feature)
- Progress indicator (3/10)
- Submit and score
- View correct answers
- Leaderboard (top 10)

**Score Calculation:**
- 1 point per correct answer
- Percentage displayed
- Saved to leaderboard (if user provides name)

#### 4.2.10 Push Notifications
**Types:**
- New event published
- Flash update
- News article
- Payment confirmation
- Booking confirmation

**Technology:** Firebase Cloud Messaging (FCM)
**Implementation:**
- Token registration on login
- Background notification handler
- Foreground notification display
- Deep linking to relevant screen

**Libraries:** @react-native-firebase/messaging

#### 4.2.11 Multilingual Support
**Languages:**
- English (default)
- Kannada (ಕನ್ನಡ)
- Hindi (हिन्दी)

**Implementation:**
- i18next for translations
- Language selector in Profile
- Persistent language preference
- RTL support for future languages

**Translatable Content:**
- UI labels and buttons
- Screen titles
- Error messages
- Placeholders

**Note:** Backend content (news, events, etc.) is managed per language by admin.

#### 4.2.12 Voice Search
**Feature:** Voice-based search in artefacts/history
**Implementation:**
- Microphone button in search bar
- @react-native-voice/voice library
- Speech to text conversion
- Trigger search with voice input

---

## 5. SOURCE CODE STRUCTURE

### 5.1 Directory Structure

```
sodematha-app/
├── assets/
│   ├── images/
│   ├── fonts/
│   └── icons/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── EventCalendarScreen.tsx
│   │   ├── GalleryAlbumsScreen.tsx
│   │   ├── GalleryAlbumDetailScreen.tsx
│   │   ├── ArtefactsScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   ├── SevasScreen.tsx
│   │   ├── SevaFormScreen.tsx
│   │   ├── SevaRazorpayPaymentScreen.tsx
│   │   ├── BookingScreen.tsx
│   │   ├── QuizScreen.tsx
│   │   ├── QuizResultScreen.tsx
│   │   ├── QuizLeaderboardScreen.tsx
│   │   ├── MoreScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── SectionsSearchScreen.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── home/
│   │   │   ├── NewsCard.tsx
│   │   │   ├── FlashMarquee.tsx
│   │   │   ├── EventCard.tsx
│   │   │   └── PanchangaWidget.tsx
│   │   ├── gallery/
│   │   │   ├── AlbumCard.tsx
│   │   │   └── ImageGrid.tsx
│   │   └── quiz/
│   │       ├── QuestionCard.tsx
│   │       └── LeaderboardItem.tsx
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx (Tab Navigator)
│   │   └── linking.ts
│   ├── services/
│   │   ├── backend.ts             # API client
│   │   ├── homeApi.ts
│   │   ├── eventsApi.ts
│   │   ├── galleryApi.ts
│   │   ├── artefactsApi.ts
│   │   ├── historyApi.ts
│   │   ├── configApi.ts
│   │   ├── legalApi.ts
│   │   ├── quizApi.ts
│   │   ├── firebase.ts           # Firebase config
│   │   ├── phoneAuth.ts          # Phone auth functions
│   │   ├── pushService.ts        # FCM handlers
│   │   └── profileService.ts
│   ├── store/
│   │   ├── store.ts              # Redux store
│   │   └── slices/
│   │       ├── appSlice.ts       # App state (user, config)
│   │       └── cacheSlice.ts     # Data cache
│   ├── i18n/
│   │   ├── index.ts              # i18next config
│   │   └── translations/
│   │       ├── en.json
│   │       ├── kn.json
│   │       └── hi.json
│   ├── types/
│   │   └── language.ts           # TypeScript types
│   ├── utils/
│   │   ├── formatters.ts         # Date, currency formatters
│   │   ├── validators.ts         # Form validators
│   │   └── constants.ts          # App constants
│   └── theme/
│       ├── colors.ts
│       ├── typography.ts
│       └── spacing.ts
├── App.tsx                        # Root component
├── index.ts                       # Entry point
├── app.json                       # Expo config
├── package.json
├── tsconfig.json
├── eas.json                       # Expo EAS Build config
├── google-services.json           # Firebase Android config
└── plugins/
    └── withFirebaseConfig.js      # Custom Expo config plugin
```

### 5.2 Component Count

- **Screens:** 17
- **Reusable Components:** 20+
- **Navigation Components:** 4
- **Services:** 10
- **Redux Slices:** 2
- **i18n Files:** 3

**Total TypeScript Files:** ~60

---

## 6. BUILD & DEPLOYMENT

### 6.1 Prerequisites

```bash
Node.js 18+
npm or yarn
Expo CLI
EAS CLI (for builds)
```

### 6.2 Installation

```bash
# Install dependencies
npm install

# Install EAS CLI globally
npm install -g eas-cli
```

### 6.3 Configuration Files

**app.json:**
```json
{
  "expo": {
    "name": "Sode Matha",
    "slug": "sodematha-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FF6B35"
    },
    "ios": {
      "bundleIdentifier": "org.sodematha.app",
      "supportsTablet": true
    },
    "android": {
      "package": "org.sodematha.app",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "googleServicesFile": "./google-services.json"
    },
    "plugins": [
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      "@react-native-firebase/messaging",
      "expo-notifications"
    ]
  }
}
```

**eas.json:**
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": false
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 6.4 Development

```bash
# Start Expo development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Run on physical device (scan QR code with Expo Go app)
```

### 6.5 Building for Production

**Android APK:**
```bash
# Build APK
eas build --platform android --profile production

# Download APK from Expo dashboard
```

**Android AAB (Google Play):**
```bash
# Build AAB bundle
eas build --platform android --profile production --auto-submit

# Submit to Google Play
eas submit --platform android
```

**iOS IPA:**
```bash
# Build IPA
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

### 6.6 Environment Variables

Create `.env` file:
```bash
# API Configuration
API_BASE_URL=https://api.sodematha.org/api

# Firebase Configuration (from google-services.json)
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:android:abc123

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxx
```

### 6.7 Firebase Setup

**Required Firebase Services:**
1. Authentication (Phone)
2. Cloud Messaging (FCM)
3. Storage (File uploads)
4. Firestore (Optional - User profiles)

**Setup Steps:**
1. Create Firebase project
2. Add Android/iOS apps
3. Download `google-services.json` (Android)
4. Download `GoogleService-Info.plist` (iOS)
5. Enable Phone Authentication
6. Enable Cloud Messaging
7. Generate server key for FCM

### 6.8 App Store Preparation

**Android (Google Play):**
- Min SDK: 21 (Android 5.0)
- Target SDK: 34 (Android 14)
- APK size: ~50MB
- Permissions: Internet, Camera (for future), Storage
- Generate signing key
- Create Play Store listing
- Upload AAB bundle
- Internal testing → Closed testing → Production

**iOS (App Store):**
- Min iOS: 13.0
- IPA size: ~60MB
- Permissions: Notifications, Camera (for future)
- Create App Store Connect listing
- Upload IPA via EAS or Xcode
- TestFlight → Production

### 6.9 Version Management

**Semantic Versioning:**
```
Major.Minor.Patch (1.0.0)

Major: Breaking changes
Minor: New features
Patch: Bug fixes

Example progression:
1.0.0 → Initial release
1.0.1 → Bug fix
1.1.0 → New feature (Quiz)
2.0.0 → Major redesign
```

---

## 7. BACKEND INTEGRATION

### 7.1 API Client Configuration

**Base URL:** `https://api.sodematha.org/api`

**Axios Instance:**
```typescript
import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add Firebase token to requests
api.interceptors.request.use(async (config) => {
  const user = auth().currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      auth().signOut();
    }
    return Promise.reject(error);
  }
);
```

### 7.2 API Endpoints Used

**Public Endpoints (No Auth):**
```typescript
// Home
GET /home
Response: { news[], flashUpdates[], upcomingEvents[], panchanga }

// Events
GET /events?month={month}&year={year}
Response: Event[]

// Gallery
GET /gallery/albums
Response: GalleryAlbum[]

GET /gallery/albums/{albumId}/media
Response: GalleryMedia[]

// Artefacts
GET /artefacts?type={PDF|AUDIO}&category={category}
Response: Artefact[]

// History
GET /history
Response: HistorySection[]

// Sevas
GET /sevas
Response: Seva[]

POST /seva-orders
Body: { sevaId, consentToStore, fullName, mobile, email, address... }
Response: { orderId, razorpayOrderId, amount, currency, keyId }

POST /seva-orders/{orderId}/verify
Body: { razorpayPaymentId, razorpaySignature }
Response: { success, message }

// Room Booking
POST /room-bookings
Body: { name, mobile, email, peopleCount, checkInDate, notes, consentToStore }
Response: { id, message }

// Quiz
GET /quiz/questions?count={count}
Response: QuizQuestion[]

POST /quiz/submit
Body: { answers: [{ questionId, selectedOption }], userName }
Response: { score, total, percentage, attemptId }

GET /quiz/leaderboard?limit={limit}
Response: LeaderboardEntry[]

// Config
GET /config
Response: { enableEvents, enableGallery, enableArtefacts, ... }

GET /config/temple-info
Response: { morningDarshan, morningPrasada, eveningDarshan, eveningPrasada }

GET /config/social-links
Response: SocialLink[]

// Legal
GET /legal
Response: { privacyPolicy, termsAndConditions, consentText }

// Push Notifications
POST /push/register
Body: { token }
Response: { success, message }

DELETE /push/unregister
Body: { token }
Response: { success }
```

### 7.3 Data Models (TypeScript Interfaces)

```typescript
interface News {
  id: string;
  title: string;
  imageUrl: string;
  body: string;
  active: boolean;
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string; // YYYY-MM-DD
  location: string;
  imageUrl?: string;
  type: 'ARADHANA' | 'PARYAYA' | 'UTSAVA' | 'GENERAL';
  scope: 'LOCAL' | 'NATIONAL';
  tithiLabel?: string;
  active: boolean;
  createdAt: string;
}

interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  active: boolean;
  createdAt: string;
}

interface GalleryMedia {
  id: string;
  albumId: string;
  type: 'IMAGE' | 'VIDEO';
  title?: string;
  url: string;
  thumbnailUrl?: string;
  createdAt: string;
}

interface Artefact {
  id: string;
  title: string;
  category: string;
  type: 'PDF' | 'AUDIO';
  description?: string;
  url: string;
  thumbnailUrl?: string;
  active: boolean;
  createdAt: string;
}

interface HistorySection {
  id: string;
  title: string;
  subtitle?: string;
  period?: string;
  description: string;
  imageUrl?: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
}

interface Seva {
  id: string;
  title: string;
  description?: string;
  amountInPaise: number; // Convert to rupees: amount/100
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface QuizQuestion {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  // No correctOption sent to client
}

interface QuizSubmitRequest {
  answers: {
    questionId: string;
    selectedOption: 'A' | 'B' | 'C' | 'D';
  }[];
  userName: string;
}

interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  attemptId: string;
}

interface LeaderboardEntry {
  rank: number;
  userName: string;
  score: number;
  total: number;
  percentage: number;
  createdAt: string;
}
```


**Example:**
```typescript
// Load from cache
const cachedNews = useSelector(state => state.cache.news);

// Fetch fresh data
useEffect(() => {
  async function fetchNews() {
    try {
      const freshNews = await homeApi.getNews();
      dispatch(updateNewsCache(freshNews));
    } catch (error) {
      // Show cached data with offline indicator
      setOffline(true);
    }
  }
  fetchNews();
}, []);
```

---

## APPENDICES

### A. Dependencies Summary

**Core:**
- expo ~54.0.33
- react-native 0.81.5
- react 19.1.0

**Navigation:**
- @react-navigation/native 7.x
- @react-navigation/native-stack
- @react-navigation/bottom-tabs

**State:**
- @reduxjs/toolkit
- react-redux
- redux-persist

**Forms:**
- react-hook-form
- yup

**Firebase:**
- @react-native-firebase/app
- @react-native-firebase/auth
- @react-native-firebase/messaging

**Payments:**
- react-native-razorpay

**UI/UX:**
- @react-native-community/datetimepicker
- react-native-calendars
- expo-av
- @expo/vector-icons

**i18n:**
- i18next
- react-i18next

**Storage:**
- @react-native-async-storage/async-storage
- expo-secure-store

### B. Known Limitations

1. **iOS/Android differences:**
   - Date picker UI varies
   - Push notification handling differs
   - Payment flow slightly different

2. **Network dependency:**
   - Most features require internet
   - Limited offline functionality
   - No sync mechanism

3. **Language support:**
   - UI translated, content is not
   - Admin must upload content in each language

4. **File size limits:**
   - PDFs: Recommended < 10MB
   - Images: Auto-compressed
   - Videos: Streamed, not downloaded

### C. Future Enhancements

🚀 **Planned Features:**
- [ ] Offline mode with full sync
- [ ] Push notification customization
- [ ] Advanced search filters
- [ ] Bookmark/Favorite content
- [ ] Share to social media
- [ ] Dark mode
- [ ] Accessibility improvements
- [ ] More languages (Tamil, Telugu, Sanskrit)
- [ ] Live streaming events
- [ ] Chat support

### D. Testing

**Manual Testing Checklist:**
- [ ] Login flow (valid/invalid OTP)
- [ ] All tab navigation works
- [ ] Home data loads correctly
- [ ] Events calendar displays properly
- [ ] Gallery images load
- [ ] PDF viewer works
- [ ] Audio player works
- [ ] Seva booking completes
- [ ] Payment flow works
- [ ] Room booking submits
- [ ] Quiz loads and submits
- [ ] Profile updates save
- [ ] Push notifications received
- [ ] Language switching works
- [ ] Logout works

**Device Testing:**
- [ ] iOS 13+ (iPhone 8 and up)
- [ ] Android 5+ (Various manufacturers)
- [ ] Different screen sizes
- [ ] Different orientations (if supported)

---

## CONTACT INFORMATION

**Project Team:** Sodematha App Development  
**Email:** dev@sodematha.org  
**App Support:** support@sodematha.org  
**Documentation Version:** 1.0.0  
**Last Updated:** February 2025

---

**END OF DOCUMENTATION**