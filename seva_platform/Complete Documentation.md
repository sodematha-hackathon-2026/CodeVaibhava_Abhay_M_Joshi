# SEVA PLATFORM - BACKEND
## Complete Project Deliverables Documentation

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Architecture & Design](#2-architecture--design)
3. [Database Schema](#3-database-schema)
4. [API Documentation](#4-api-documentation)
5. [Source Code Structure](#5-source-code-structure)
6. [Build & Deployment](#6-build--deployment)
7. [Testing](#7-testing)
8. [Security](#8-security)

---

## 1. PROJECT OVERVIEW

### 1.1 Project Information

**Project Name:** Sode Sri Vadiraja Matha - Backend API Platform  
**Version:** 1.0.0  
**Type:** REST API Backend Service  
**Primary Language:** Java 21  
**Framework:** Spring Boot 4.0.2

### 1.2 Technology Stack

**Backend:**
- Spring Boot 4.0.2
- Spring Data JPA (Hibernate)
- Spring Security
- Spring Validation
- Flyway Migration

**Database:**
- PostgreSQL 15+

**External Integrations:**
- Firebase Admin SDK 9.2.0 (Authentication & FCM)
- Razorpay Java SDK 1.4.5 (Payments)
- Firebase Storage (File uploads)
- SMTP (Email notifications)

**Build & Deployment:**
- Maven 3.9+
- Docker (optional)
- Java 21 Runtime

### 1.3 Key Features

1. **Content Management**
    - News articles
    - Events (Aradhana, Paryaya, Utsava)
    - Gallery (Photo albums, videos)
    - Artefacts (PDFs, Audio files)
    - History sections

2. **Service Booking**
    - Seva (religious service) booking with payment
    - Room booking requests
    - Payment processing via Razorpay

3. **Interactive Features**
    - Quiz with leaderboard
    - Push notifications
    - Panchanga (Hindu calendar)

4. **Admin Panel APIs**
    - Full CRUD operations for all content
    - Booking management
    - Configuration management

---

## 2. ARCHITECTURE & DESIGN

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT APPLICATIONS                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Mobile App  │  │  Admin Web   │  │  Public Web  │  │
│  │ (React Native│  │   (React)    │  │   (Future)   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │
          │    HTTPS/TLS     │                  │
          └──────────────────┼──────────────────┘
                             ▼
          ┌─────────────────────────────────────┐
          │      NGINX REVERSE PROXY (SSL)      │
          └───────────────┬─────────────────────┘
                          ▼
          ┌─────────────────────────────────────┐
          │       SPRING BOOT APPLICATION       │
          │  ┌───────────────────────────────┐  │
          │  │    Security Layer (Firebase)  │  │
          │  └───────────────┬───────────────┘  │
          │                  ▼                   │
          │  ┌───────────────────────────────┐  │
          │  │     Controller Layer (REST)   │  │
          │  └───────────────┬───────────────┘  │
          │                  ▼                   │
          │  ┌───────────────────────────────┐  │
          │  │     Service Layer (Business)  │  │
          │  └───────────────┬───────────────┘  │
          │                  ▼                   │
          │  ┌───────────────────────────────┐  │
          │  │  Repository Layer (JPA/JDBC)  │  │
          │  └───────────────┬───────────────┘  │
          └──────────────────┼──────────────────┘
                             ▼
          ┌─────────────────────────────────────┐
          │      POSTGRESQL DATABASE (RDS)      │
          └─────────────────────────────────────┘

          ┌─────────────────────────────────────┐
          │       EXTERNAL SERVICES             │
          │  ┌──────────┐  ┌──────────┐        │
          │  │ Firebase │  │ Razorpay │        │
          │  │  (Auth)  │  │(Payments)│        │
          │  └──────────┘  └──────────┘        │
          │  ┌──────────┐  ┌──────────┐        │
          │  │   SMTP   │  │ Firebase │        │
          │  │  (Email) │  │ Storage  │        │
          │  └──────────┘  └──────────┘        │
          └─────────────────────────────────────┘
```

### 2.2 Application Layers

#### 2.2.1 Controller Layer
- Handles HTTP requests/responses
- Input validation
- DTO transformations
- Authentication/Authorization

**Key Controllers:**
- `HomeController` - Public home data
- `EventController` - Events listing
- `SevaController` - Seva services
- `SevaOrderController` - Payment processing
- `RoomBookingController` - Room reservations
- `QuizController` - Quiz functionality
- `Admin*Controller` - Admin operations

#### 2.2.2 Service Layer
- Business logic implementation
- Transaction management
- External service integration
- Data validation

**Key Services:**
- Content services (News, Events, Gallery, etc.)
- Payment service (Razorpay integration)
- Notification service (Firebase FCM)
- Email service (SMTP)

#### 2.2.3 Repository Layer
- Database operations
- JPA entity management
- Custom queries
- Data persistence

#### 2.2.4 Model Layer
- JPA entities
- Database mapping
- Relationships
- Constraints

### 2.3 Security Architecture

```
┌────────────────────────────────────────┐
│       Incoming HTTP Request            │
└────────────────┬───────────────────────┘
                 ▼
         ┌───────────────┐
         │  CORS Filter  │ → Allow specific origins
         └───────┬───────┘
                 ▼
      ┌──────────────────┐
      │  Firebase Auth   │ → Verify ID Token
      │  Filter (Admin)  │ → Extract UID
      └──────────┬───────┘
                 ▼
      ┌──────────────────┐
      │  Authorization   │ → Check permissions
      │  Filter          │ → Role validation
      └──────────┬───────┘
                 ▼
      ┌──────────────────┐
      │   Controller     │
      └──────────────────┘
```

---

## 3. DATABASE SCHEMA

### 3.1 Entity Relationship Diagram

```
┌─────────────────┐
│   app_config    │
│  (singleton)    │
└─────────────────┘

┌─────────────────┐
│  legal_content  │
│  (singleton)    │
└─────────────────┘

┌─────────────────┐
│  temple_info    │
│  (singleton)    │
└─────────────────┘

┌─────────────────┐      ┌─────────────────┐
│     sevas       │◄─────│  seva_orders    │
└─────────────────┘  1:N └─────────────────┘

┌─────────────────┐      ┌─────────────────┐
│ gallery_albums  │◄─────│  gallery_media  │
└─────────────────┘  1:N └─────────────────┘

┌─────────────────┐
│     events      │
└─────────────────┘

┌─────────────────┐
│      news       │
└─────────────────┘

┌─────────────────┐
│ flash_updates   │
└─────────────────┘

┌─────────────────┐
│   artefacts     │
└─────────────────┘

┌─────────────────┐
│history_sections │
└─────────────────┘

┌─────────────────┐
│ room_bookings   │
└─────────────────┘

┌─────────────────┐
│ quiz_questions  │
└─────────────────┘

┌─────────────────┐
│  quiz_attempts  │
└─────────────────┘

┌─────────────────┐
│  push_tokens    │
└─────────────────┘

┌─────────────────┐
│panchanga_cache  │
└─────────────────┘

┌─────────────────┐
│  social_links   │
└─────────────────┘
```

### 3.2 Database Tables

See `V1__initial_schema.sql` for complete table definitions.

**Key Tables:**
1. **Configuration Tables** (3): app_config, legal_content, temple_info
2. **Content Tables** (7): news, events, flash_updates, artefacts, history_sections, social_links
3. **Gallery Tables** (2): gallery_albums, gallery_media
4. **Service Tables** (4): sevas, seva_orders, room_bookings, push_tokens
5. **Quiz Tables** (2): quiz_questions, quiz_attempts

**Total: 18 Tables**

### 3.3 Indexes

**Performance Indexes:**
- `idx_news_active` - Fast active news filtering
- `idx_events_date` - Event date range queries
- `idx_seva_orders_uid` - User order lookup
- `idx_quiz_attempts_score` - Leaderboard sorting
- And 15+ more for optimal query performance

---

## 4. API DOCUMENTATION

### 4.1 Base URLs

**Production:** `https://api.sodematha.org/api`  
**Development:** `http://localhost:8080/api`

### 4.2 Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/home` | Home screen data (news, flash, events, panchanga) |
| GET | `/events` | List all active events |
| GET | `/gallery/albums` | List photo albums |
| GET | `/gallery/albums/{id}/media` | Get album media |
| GET | `/artefacts` | List PDFs and audio files |
| GET | `/history` | List history sections |
| GET | `/sevas` | List available sevas |
| POST | `/seva-orders` | Create seva order (payment) |
| POST | `/seva-orders/{id}/verify` | Verify payment |
| POST | `/room-bookings` | Create room booking |
| GET | `/quiz/questions` | Get quiz questions |
| POST | `/quiz/submit` | Submit quiz answers |
| GET | `/quiz/leaderboard` | Quiz leaderboard |
| GET | `/legal` | Privacy policy & terms |
| GET | `/config` | App configuration |
| GET | `/config/temple-info` | Temple timings |
| GET | `/config/social-links` | Social media links |
| POST | `/push/register` | Register FCM token |
| DELETE | `/push/unregister` | Unregister FCM token |

### 4.3 Admin Endpoints (Auth Required)

**Authentication:** `Authorization: Bearer <firebase-id-token>`

| Method | Endpoint Pattern | Description |
|--------|------------------|-------------|
| GET/POST/PUT/DELETE | `/admin/events/*` | Manage events |
| GET/POST/PUT/DELETE | `/admin/gallery/*` | Manage gallery |
| GET/POST/PUT/DELETE | `/admin/artefacts/*` | Manage artefacts |
| GET/POST/PUT/DELETE | `/admin/history/*` | Manage history |
| GET/POST/PUT/DELETE | `/admin/sevas/*` | Manage sevas |
| GET | `/admin/seva-orders/*` | View seva orders |
| GET/PUT | `/admin/room-bookings/*` | Manage bookings |
| GET/POST/PUT/DELETE | `/admin/quiz/*` | Manage quiz questions |
| GET/POST/PUT/DELETE | `/admin/news/*` | Manage news |
| GET/POST/PUT/DELETE | `/admin/flash/*` | Manage flash updates |
| GET/PUT | `/admin/config` | Manage configuration |
| GET/PUT | `/admin/temple-info` | Manage temple info |
| GET/POST/PUT/DELETE | `/admin/social/*` | Manage social links |

**Total Endpoints:** 60+

For detailed request/response schemas, see `API_DOCUMENTATION.md`.

---

## 5. SOURCE CODE STRUCTURE

### 5.1 Project Directory Structure

```
seva_platform/
├── src/
│   ├── main/
│   │   ├── java/com/seva/platform/
│   │   │   ├── SevaPlatformApplication.java (Main)
│   │   │   ├── config/
│   │   │   │   ├── AdminBootstrapConfig.java
│   │   │   │   ├── SecurityConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── HomeController.java
│   │   │   │   ├── EventController.java
│   │   │   │   ├── SevaController.java
│   │   │   │   ├── SevaOrderController.java
│   │   │   │   ├── RoomBookingController.java
│   │   │   │   ├── QuizController.java
│   │   │   │   ├── GalleryController.java
│   │   │   │   ├── ArtefactController.java
│   │   │   │   ├── HistoryController.java
│   │   │   │   ├── NewsController.java
│   │   │   │   ├── FlashController.java
│   │   │   │   ├── LegalController.java
│   │   │   │   ├── ConfigController.java
│   │   │   │   ├── PushController.java
│   │   │   │   └── admin/
│   │   │   │       ├── AdminEventController.java
│   │   │   │       ├── AdminGalleryController.java
│   │   │   │       ├── AdminArtefactController.java
│   │   │   │       ├── AdminHistoryController.java
│   │   │   │       ├── AdminSevaController.java
│   │   │   │       ├── AdminSevaOrderController.java
│   │   │   │       ├── AdminRoomBookingController.java
│   │   │   │       ├── AdminQuizController.java
│   │   │   │       ├── AdminNewsController.java
│   │   │   │       ├── AdminFlashController.java
│   │   │   │       ├── AdminConfigController.java
│   │   │   │       ├── AdminMathaInfoController.java
│   │   │   │       └── AdminSocialController.java
│   │   │   ├── service/
│   │   │   │   ├── EventService.java
│   │   │   │   ├── SevaService.java
│   │   │   │   ├── PaymentService.java
│   │   │   │   ├── RoomBookingService.java
│   │   │   │   ├── QuizService.java
│   │   │   │   ├── GalleryService.java
│   │   │   │   ├── ArtefactService.java
│   │   │   │   ├── HistoryService.java
│   │   │   │   ├── NewsService.java
│   │   │   │   ├── FlashService.java
│   │   │   │   ├── PushNotificationService.java
│   │   │   │   ├── EmailService.java
│   │   │   ├── repository/
│   │   │   │   ├── EventRepository.java
│   │   │   │   ├── SevaRepository.java
│   │   │   │   ├── SevaOrderRepository.java
│   │   │   │   ├── RoomBookingRepository.java
│   │   │   │   ├── QuizQuestionRepository.java
│   │   │   │   ├── QuizAttemptRepository.java
│   │   │   │   ├── GalleryAlbumRepository.java
│   │   │   │   ├── GalleryMediaRepository.java
│   │   │   │   ├── ArtefactRepository.java
│   │   │   │   ├── HistorySectionRepository.java
│   │   │   │   ├── NewsRepository.java
│   │   │   │   ├── FlashUpdateRepository.java
│   │   │   │   ├── AppConfigRepository.java
│   │   │   │   ├── MathaInfoRepository.java
│   │   │   │   ├── SocialLinkRepository.java
│   │   │   │   ├── LegalContentRepository.java
│   │   │   │   ├── PushTokenRepository.java
│   │   │   ├── model/
│   │   │   │   ├── Event.java
│   │   │   │   ├── EventType.java (enum)
│   │   │   │   ├── EventScope.java (enum)
│   │   │   │   ├── Seva.java
│   │   │   │   ├── SevaOrder.java
│   │   │   │   ├── RoomBooking.java
│   │   │   │   ├── QuizQuestion.java
│   │   │   │   ├── QuizAttempt.java
│   │   │   │   ├── CorrectOption.java (enum)
│   │   │   │   ├── GalleryAlbum.java
│   │   │   │   ├── GalleryMedia.java
│   │   │   │   ├── MediaType.java (enum)
│   │   │   │   ├── Artefact.java
│   │   │   │   ├── HistorySection.java
│   │   │   │   ├── News.java
│   │   │   │   ├── FlashUpdate.java
│   │   │   │   ├── AppConfig.java
│   │   │   │   ├── MathaInfo.java
│   │   │   │   ├── SocialLink.java
│   │   │   │   ├── LegalContent.java
│   │   │   │   ├── PushToken.java
│   │   │   ├── dto/
│   │   │   │   ├── request/
│   │   │   │   │   ├── SevaOrderCreateRequest.java
│   │   │   │   │   ├── PaymentVerificationRequest.java
│   │   │   │   │   ├── RoomBookingRequest.java
│   │   │   │   │   ├── QuizSubmitRequest.java
│   │   │   │   │   └── ... (admin request DTOs)
│   │   │   │   └── response/
│   │   │   │       ├── HomeResponse.java
│   │   │   │       ├── EventResponse.java
│   │   │   │       ├── RazorpayOrderResponse.java
│   │   │   │       ├── QuizResultResponse.java
│   │   │   │       └── ... (other response DTOs)
│   │   │   └── security/
│   │   │       ├── AuthUser.java
│   │   │       └── FirebaseAuthFilter.java
│   │   │       └── FirebaseInitializer.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       ├── application-prod.properties
│   │       └── db/
│   │           └── migration/
│   │               └── V1__initial_schema.sql
│   └── test/
│       └── java/com/seva/platform/
│           └── SevaPlatformApplicationTests.java
├── pom.xml
├── HELP.md
├── mvnw
└── mvnw.cmd
```

### 5.2 Key Components Count

- **Controllers:** 29 (15 public + 14 admin)
- **Services:** 13
- **Repositories:** 17
- **Models/Entities:** 21
- **DTOs:** 40+
- **Configuration Classes:** 3
- **Security Filters:** 2

**Total Java Files:** ~120

---

## 6. BUILD & DEPLOYMENT

### 6.1 Prerequisites

```bash
- Java 21 (JDK)
- Maven 3.9+
- PostgreSQL 15+
- Firebase Project (credentials JSON)
- Razorpay Account (API keys)
```

### 6.2 Environment Setup

**1. Clone Repository**
```bash
git clone <repository-url>
cd seva_platform
```

**2. Configure Database**
```bash
# Create database
createdb seva_platform

# Update application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/seva_platform
spring.datasource.username=your_username
spring.datasource.password=your_password
```

**3. Set Environment Variables**
```bash
export FIREBASE_CREDENTIALS_PATH=/path/to/firebase-credentials.json
export RAZORPAY_KEY_ID=rzp_live_xxx
export RAZORPAY_KEY_SECRET=your_secret_key
export EMAIL_USERNAME=your@email.com
export EMAIL_PASSWORD=your_email_password
```

### 6.3 Build Commands

**Maven Build:**
```bash
# Clean and compile
./mvnw clean compile

# Run tests
./mvnw test

# Package JAR
./mvnw clean package

# Skip tests during build
./mvnw clean package -DskipTests
```

**Run Application:**
```bash
# Using Maven
./mvnw spring-boot:run

# Using JAR
java -jar target/seva_platform-0.0.1-SNAPSHOT.jar

# With profile
java -jar -Dspring.profiles.active=prod target/seva_platform-0.0.1-SNAPSHOT.jar
```

### 6.4 Database Migration

**Flyway Commands:**
```bash
# Check migration status
./mvnw flyway:info

# Run migrations
./mvnw flyway:migrate

# Validate migrations
./mvnw flyway:validate

# Clean database (development only!)
./mvnw flyway:clean
```

### 6.5 Production Deployment

**Option 1: Traditional Server**
```bash
# 1. Build production JAR
./mvnw clean package -Pprod

# 2. Transfer to server
scp target/seva_platform.jar user@server:/opt/seva/

# 3. Create systemd service
sudo vi /etc/systemd/system/seva-platform.service

# 4. Start service
sudo systemctl start seva-platform
sudo systemctl enable seva-platform
```

**Option 2: Docker**
```dockerfile
FROM openjdk:21-jdk-slim
WORKDIR /app
COPY target/seva_platform.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```bash
# Build image
docker build -t seva-platform:latest .

# Run container
docker run -d \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_URL=jdbc:postgresql://db:5432/seva \
  --name seva-backend \
  seva-platform:latest
```

**Option 3: Cloud (AWS/GCP)**
- Deploy JAR to Elastic Beanstalk / App Engine
- Use RDS/Cloud SQL for PostgreSQL
- Configure environment variables
- Setup CloudWatch/Stackdriver logging

### 6.6 Nginx Configuration

```nginx
server {
    listen 80;
    server_name api.sodematha.org;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 8. SECURITY

### 8.1 Authentication Flow

```
1. Client obtains Firebase ID token
2. Client sends request with: Authorization: Bearer <token>
3. FirebaseAuthFilter validates token
4. Extract user UID from token
5. Check user permissions (if admin endpoint)
6. Allow/Deny request
```

### 8.2 Security Measures

1. **Firebase Authentication**
    - Token-based authentication
    - Automatic token expiry
    - Secure token validation

2. **Input Validation**
    - Jakarta Validation annotations
    - Custom validators
    - SQL injection prevention (JPA)

3. **CORS Configuration**
    - Allowed origins whitelist
    - Credentials support
    - Method restrictions

4. **HTTPS/TLS**
    - Enforced in production
    - Certificate management
    - Secure headers

5. **Data Protection**
    - Consent-based data storage
    - Masked PII in logs
    - Encrypted storage (database level)

6. **Rate Limiting**
    - Per-endpoint limits
    - IP-based throttling
    - DDoS protection

### 8.3 Security Best Practices

✅ Never commit credentials  
✅ Use environment variables  
✅ Rotate API keys regularly  
✅ Monitor access logs  
✅ Keep dependencies updated  
✅ Use HTTPS in production  
✅ Validate all inputs  
✅ Sanitize outputs

---

## APPENDICES

### A. Dependencies (pom.xml)

**Spring Boot Starters:**
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- spring-boot-starter-validation
- spring-boot-starter-mail
- spring-boot-starter-flyway

**Database:**
- postgresql
- flyway-database-postgresql

**External Services:**
- firebase-admin (9.2.0)
- razorpay-java (1.4.5)

**Utilities:**
- lombok

### B. Configuration Files

**application.properties**
```properties
# Server
server.port=8080

# Database
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# Flyway
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration

# Firebase
firebase.credentials.path=${FIREBASE_CREDENTIALS_PATH}

# Razorpay
razorpay.key.id=${RAZORPAY_KEY_ID}
razorpay.key.secret=${RAZORPAY_KEY_SECRET}

# Email
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${EMAIL_USERNAME}
spring.mail.password=${EMAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### C. Monitoring & Logging

**Application Logs:**
```
/var/log/seva-platform/application.log
```

**Log Levels:**
- INFO: General information
- WARN: Warning messages
- ERROR: Error messages
- DEBUG: Debug information (dev only)

**Monitoring Endpoints:**
```
/actuator/health - Health check
/actuator/info - Application info
/actuator/metrics - Metrics
```

### D. Backup & Recovery

**Database Backup:**
```bash
# Daily backup
pg_dump seva_platform > backup_$(date +%Y%m%d).sql

# Restore
psql seva_platform < backup_20240101.sql
```

**File Backup:**
- Firebase Storage files (automatic replication)
- Application logs (rotate daily)
- Configuration files (version controlled)

---


**Documentation Version:** 1.0.0  
**Last Updated:** February 2025

---

## DOCUMENT REVISION HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | Feb 2025 | Dev Team | Initial documentation |

---

**END OF DOCUMENTATION**