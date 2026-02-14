<<<<<<< HEAD
# 🕉️ Seva Platform - Complete Ecosystem

> A comprehensive digital platform for Sode Sri Vadiraja Matha to manage devotee services, events, donations, and spiritual content.

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.2-brightgreen)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0-black)](https://expo.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-blue)](https://www.postgresql.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.8.0-orange)](https://firebase.google.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Individual Project Setup](#individual-project-setup)
- [Environment Configuration](#environment-configuration)
- [Features](#features)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

The Seva Platform is a three-tier application ecosystem designed to digitize and streamline the operations of Sode Sri Vadiraja Matha:

### **🎯 Platform Components:**

1. **Backend API (seva_platform)** - RESTful API server with Spring Boot
2. **Admin Web Portal (seva_ui)** - React-based admin dashboard for management
3. **Mobile App (seva_mobile)** - React Native + Expo app for devotees

### **💡 Key Objectives:**

- Digitize traditional seva booking and management
- Enable online donations with Razorpay integration
- Manage events, notifications, and spiritual content
- Provide multilingual support (Kannada, English)
- Real-time push notifications via Firebase Cloud Messaging
- Secure authentication using Firebase Auth

---

## 📁 Project Structure

```
seva-ecosystem/
│
├── seva_platform/          # Backend API (Spring Boot + PostgreSQL)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/seva/platform/
│   │   │   │   ├── config/           # Security, Firebase, Mail config
│   │   │   │   ├── controller/       # REST API endpoints
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── model/            # JPA Entities
│   │   │   │   ├── repository/       # Database repositories
│   │   │   │   ├── security/         # Firebase authentication
│   │   │   │   └── service/          # Business logic
│   │   │   └── resources/
│   │   │       ├── application.yml    # Main config
│   │   │       ├── db.migration/      # Flyway SQL scripts
│   │   │       └── firebase-service-account.json
│   │   └── test/
│   ├── pom.xml
│   └── README.md
│
├── seva_ui/                # Admin Web Dashboard (React + Vite + MUI)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Dashboard pages
│   │   ├── services/       # API client services
│   │   ├── store/          # Zustand state management
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Helper functions
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
│
└── seva_mobile/            # Mobile App (React Native + Expo)
    ├── src/
    │   ├── components/     # UI components
    │   ├── navigation/     # Stack & tab navigation
    │   ├── screens/        # App screens
    │   ├── services/       # API & Firebase services
    │   ├── store/          # Redux Toolkit
    │   ├── i18n/           # Internationalization (Kannada/English)
    │   └── theme/          # Design system
    ├── app.json
    ├── package.json
    └── README.md
```

---

## 🛠️ Technology Stack

### **Backend (seva_platform)**

| Category | Technology | Version |
|----------|------------|---------|
| Language | Java | 21 |
| Framework | Spring Boot | 4.0.2 |
| Database | PostgreSQL | 15+ |
| ORM | Hibernate (JPA) | - |
| Migration | Flyway | - |
| Security | Spring Security + Firebase Auth | - |
| Payments | Razorpay Java SDK | 1.4.5 |
| Cloud | Firebase Admin SDK | 9.2.0 |
| Email | Spring Mail (SMTP) | - |
| Build Tool | Maven | 3.9+ |

### **Admin Web (seva_ui)**

| Category | Technology | Version |
|----------|------------|---------|
| Language | TypeScript | 5.3.3 |
| Framework | React | 18.2.0 |
| Build Tool | Vite | 5.1.0 |
| UI Library | Material-UI (MUI) | 5.15.10 |
| State Management | Zustand | 4.5.0 |
| Forms | React Hook Form | 7.50.1 |
| HTTP Client | Axios | 1.6.7 |
| Routing | React Router | 6.22.0 |
| Authentication | Firebase | 10.8.0 |
| Charts | Chart.js + react-chartjs-2 | 4.4.1 / 5.2.0 |

### **Mobile App (seva_mobile)**

| Category | Technology | Version |
|----------|------------|---------|
| Language | TypeScript | 5.9.2 |
| Framework | React Native | 0.81.5 |
| Platform | Expo | ~54.0.33 |
| Navigation | React Navigation | 7.x |
| State Management | Redux Toolkit | 2.11.2 |
| Forms | React Hook Form | 7.71.1 |
| Authentication | Firebase Auth | 23.8.6 |
| Database | Firestore | 23.8.6 |
| Payments | Razorpay | 2.3.1 |
| Push Notifications | Firebase Messaging | 23.8.6 |
| Internationalization | i18next | 25.8.4 |
| Persistence | Redux Persist | 6.0.0 |

---

## 🚀 Getting Started

### **Prerequisites**

Ensure you have the following installed:

- **Java 21+** (for backend)
- **Node.js 18+** and **npm/yarn** (for web & mobile)
- **PostgreSQL 15+** (for database)
- **Maven 3.9+** (for backend build)
- **Expo CLI** (for mobile development)
- **Git**
- **Firebase Account** (for authentication & FCM)
- **Razorpay Account** (for payments)

### **Quick Setup (All Projects)**

```bash
# Clone the repository
git clone <repository-url>

# Setup Backend
cd seva_platform
cp src/main/resources/application.yml.example src/main/resources/application.yml
# Edit application.yml with your database credentials
mvn clean install
mvn spring-boot:run

# Setup Admin Web (in new terminal)
cd seva_ui
npm install
# Create .env file with API endpoint
echo "VITE_API_URL=http://localhost:8080" > .env
npm run dev

# Setup Mobile App (in new terminal)
cd seva_mobile
npm install
# Create .env file
echo "API_URL=http://localhost:8080" > .env
npx expo start
```

---

## 📦 Individual Project Setup

### **1. Backend API (seva_platform)**

#### **Database Setup**

```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE sodematha_dev;
\q
```

#### **Configuration**

```bash
cd seva_platform
cp src/main/resources/application.yml.example src/main/resources/application.yml
```

Edit `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/sodematha_dev
    username: your_db_username
    password: your_db_password
```

#### **Firebase Setup**

1. Download your `firebase-service-account.json` from Firebase Console
2. Place it in `src/main/resources/`
3. **Add to .gitignore** (critical!)

#### **Run Backend**

```bash
# Development
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Build JAR
mvn clean package

# Run JAR
java -jar target/seva_platform-0.0.1-SNAPSHOT.jar
```

**Backend will run on:** `http://localhost:8080`

**API Documentation:** See `seva_platform/Api documentation.md`

---

### **2. Admin Web Portal (seva_ui)**

#### **Environment Setup**

```bash
cd seva_ui
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:8080
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
EOF
```

#### **Run Development Server**

```bash
npm run dev
```

**Web app runs on:** `http://localhost:5173`

#### **Build for Production**

```bash
npm run build
npm run preview  # Preview production build
```

**Features:**

- ✅ Dashboard with analytics
- ✅ Event management
- ✅ Seva booking management
- ✅ Donation tracking
- ✅ Content management (articles, videos)
- ✅ User management
- ✅ Push notification sending

---

### **3. Mobile App (seva_mobile)**

#### **Environment Setup**

```bash
cd seva_mobile
npm install

# Create .env file
cat > .env << EOF
API_URL=http://localhost:8080
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
RAZORPAY_KEY=your_razorpay_key_id
EOF
```

#### **Firebase Configuration**

1. Download `google-services.json` from Firebase Console (Android)
2. Place in project root
3. **Add to .gitignore**

#### **Run Development**

```bash
# Start Expo dev server
npx expo start

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios

# Run on Web
npx expo start --web
```

#### **Build for Production**

```bash
# Android APK
eas build --platform android --profile preview

# iOS
eas build --platform ios --profile production
```

**Features:**

- ✅ Multilingual support (Kannada/English)
- ✅ Event browsing and registration
- ✅ Seva booking with calendar
- ✅ Online donations via Razorpay
- ✅ Spiritual content (articles, videos, audio)
- ✅ Push notifications
- ✅ User profile management

---

## 🔧 Environment Configuration

### **Critical Files to Configure:**

#### **.gitignore (Root)**

```gitignore
# Secrets - NEVER COMMIT
**/.env
**/.env.local
**/firebase-service-account.json
**/google-services.json
**/application.yml
**/application.properties

# Dependencies
**/node_modules/
**/target/

# Build outputs
**/dist/
**/build/
```

### **Environment Variables Reference:**

#### **Backend (.env / application.yml)**

```bash
DATABASE_URL=jdbc:postgresql://localhost:5432/sodematha
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your_app_password
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
ADMIN_UIDS=firebase_uid1,firebase_uid2
```

#### **Admin Web (.env)**

```bash
VITE_API_URL=http://localhost:8080
VITE_FIREBASE_API_KEY=xxxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxxxx
```

#### **Mobile App (.env)**

```bash
API_URL=http://your-backend-url:8080
FIREBASE_API_KEY=xxxxx
RAZORPAY_KEY=rzp_test_xxxxx
```

---

## ✨ Features

### **Core Functionality**

| Feature | Backend API | Admin Web | Mobile App |
|---------|-------------|-----------|------------|
| **User Authentication** | ✅ Firebase Auth | ✅ Firebase Auth | ✅ Firebase Auth |
| **Event Management** | ✅ CRUD APIs | ✅ Create/Edit/Delete | ✅ Browse/Register |
| **Seva Booking** | ✅ Booking System | ✅ Manage Bookings | ✅ Book Sevas |
| **Donations** | ✅ Razorpay Integration | ✅ Track Donations | ✅ Donate via Razorpay |
| **Content Management** | ✅ Articles/Videos API | ✅ Upload/Manage | ✅ View Content |
| **Push Notifications** | ✅ FCM Integration | ✅ Send Notifications | ✅ Receive Notifications |
| **Multilingual** | - | - | ✅ Kannada/English |
| **Analytics** | ✅ Data APIs | ✅ Dashboard Charts | - |
| **Email Notifications** | ✅ SMTP | - | - |

---

## 🔗 API Integration

### **Base URL**

- Development: `http://localhost:8080`
- Production: `https://your-domain.com`

### **Authentication**

All API requests require Firebase ID Token in header:

```bash
Authorization: Bearer <firebase-id-token>
```

### **Key Endpoints**

```bash
# Events
GET    /api/events
POST   /api/events
GET    /api/events/{id}
PUT    /api/events/{id}
DELETE /api/events/{id}

# Sevas
GET    /api/sevas
POST   /api/sevas/book
GET    /api/sevas/my-bookings

# Donations
POST   /api/donations/create
POST   /api/donations/verify

# Content
GET    /api/articles
GET    /api/videos
POST   /api/articles
```

See complete API documentation: `seva_platform/Api documentation.md`

---

## 🚢 Deployment

### **Backend Deployment**

#### **Option 1: Docker**

```dockerfile
FROM openjdk:21-jdk-slim
COPY target/seva_platform-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

```bash
docker build -t seva-backend .
docker run -p 8080:8080 --env-file .env seva-backend
```

#### **Option 2: Traditional Server**

```bash
# Build
mvn clean package -DskipTests

# Deploy JAR to server
scp target/seva_platform-0.0.1-SNAPSHOT.jar user@server:/opt/seva/

# Run with systemd service
sudo systemctl start seva-backend
```

### **Admin Web Deployment**

```bash
# Build
npm run build

# Deploy to Vercel/Netlify
vercel deploy --prod

# Or serve with nginx
cp -r dist/* /var/www/html/
```

### **Mobile App Deployment**

```bash
# Android - Play Store
eas build --platform android --profile production
eas submit --platform android

# iOS - App Store
eas build --platform ios --profile production
eas submit --platform ios
```

---

## 🔐 Security Best Practices

### **🚨 CRITICAL - Never Commit:**

- ❌ `firebase-service-account.json`
- ❌ `google-services.json`
- ❌ `.env` files
- ❌ `application.yml` with credentials
- ❌ API keys or secrets

### **✅ DO:**

- ✅ Use `.env.example` templates
- ✅ Use environment variables in production
- ✅ Enable Firebase App Check
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Regular security audits
- ✅ Keep dependencies updated

### **Production Checklist:**

- [ ] All `.env` files created with production values
- [ ] Firebase production project configured
- [ ] Razorpay LIVE keys configured (not test keys)
- [ ] Database migrations applied
- [ ] SSL/TLS certificates installed
- [ ] CORS configured properly
- [ ] Backup strategy in place
- [ ] Monitoring & logging enabled

---

## 🧪 Testing

### **Backend Tests**

```bash
cd seva_platform
mvn test
```

### **Frontend Tests**

```bash
cd seva_ui
npm run test
```

### **Mobile Tests**

```bash
cd seva_mobile
npm run test
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

This project is proprietary software for Sode Sri Vadiraja Matha.

---

## 📞 Support

For issues and questions:

- 📧 Email: support@sodemath.org
- 📱 Phone: +91-XXXX-XXXXXX
- 🌐 Website: https://sodemath.org

---

## 🙏 Acknowledgments

- **Spring Boot Community** - Backend framework
- **React Community** - Frontend frameworks
- **Expo Team** - Mobile development platform
- **Firebase** - Authentication & Cloud services
- **Razorpay** - Payment gateway integration

---

**Built with ❤️ for Sode Sri Vadiraja Matha**

Last Updated: February 2026
=======
[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Op9BxO3Q)
# hackathon-starter (Seva Platform)

Hackathon Starter Repo

Seva Platform is a modern, scalable, full-stack application designed to serve mobile users, web users, and backend services through a secure and modular architecture.

This repository is the **starter blueprint** for the Seva Platform. It defines:
- What the project is
- How the repository is organized
- What technologies (latest stable) should be used
- The standard directory structure each module must follow

The platform consists of:
- A **mobile application** for Android and iOS
- A **web application** for browser-based access
- A **backend platform** providing APIs, business logic, and data persistence


All components communicate through secure REST APIs and follow cloud-ready, production-grade design principles.


```text
.
├── seva_mobile/        # React Native mobile application
├── seva_ui/            # Web UI application (React or Angular)
├── seva_platform/      # Backend platform (Java + Spring Boot)
└── README.md           # Project documentation


---

## High-Level Architecture

> Both Mobile and Web clients communicate only with the backend APIs (clients do not talk to the database directly).

```text
Mobile App (React Native) ──┐
                            ├──> Backend APIs (Spring Boot) ───> Database (MySQL 8.x)
Web UI (React / Angular) ───┘



# Application project structre to be followed

seva_mobile/
├── android/                 # Android native project
├── ios/                     # iOS native project
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/             # App screens
│   ├── navigation/          # Navigation setup
│   ├── services/            # API services
│   ├── store/               # State management
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Utilities
│   └── assets/              # Images, fonts, icons
├── .env
├── package.json
└── tsconfig.json




seva_ui/
├── src/
│   ├── components/          # Shared UI components
│   ├── pages/               # Route-based pages
│   ├── layouts/             # App layouts
│   ├── services/            # API clients
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Helper utilities
│   └── assets/              # Static assets
├── public/
├── .env
├── package.json
└── tsconfig.json



seva_platform/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/seva/platform/
│   │   │       ├── controller/     # REST controllers
│   │   │       ├── service/        # Business logic
│   │   │       ├── repository/     # Database repositories
│   │   │       ├── model/          # Entity models
│   │   │       ├── dto/            # Request/response DTOs
│   │   │       ├── security/       # Authentication & security
│   │   │       └── config/         # Configuration classes
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── db/migration/       # Flyway migrations
│   └── test/
├── Dockerfile
├── pom.xml / build.gradle
└── README.md


>>>>>>> 0f9be679a8d3019a185666b923d5d1efe384630b
