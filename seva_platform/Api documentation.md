# Seva Platform - Backend API Documentation

## Project Overview

**Project Name:** Sode Sri Vadiraja Matha - Backend Platform  
**Technology Stack:** Spring Boot 4.0.2, Java 21, PostgreSQL, Firebase  
**Architecture:** REST API with JPA/Hibernate ORM  
**Authentication:** Firebase Authentication  
**Payment Gateway:** Razorpay

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Data Transfer Objects (DTOs)](#data-transfer-objects)
5. [Authentication & Security](#authentication--security)
6. [Deployment Instructions](#deployment-instructions)
7. [Environment Configuration](#environment-configuration)

---

## System Architecture

### Technology Stack

**Backend Framework:**
- Spring Boot 4.0.2
- Spring Data JPA
- Spring Security
- Spring Validation
- Flyway Migration

**Database:**
- PostgreSQL (Production)
- Flyway for schema versioning

**External Services:**
- Firebase Admin SDK (Authentication & Push Notifications)
- Razorpay Payment Gateway
- Firebase Storage (File uploads)

**Build Tool:**
- Maven

---

## Database Schema

### Core Tables

#### 1. **app_config** (Configuration)
```sql
- id (INTEGER, PK)
- enable_events (BOOLEAN)
- enable_gallery (BOOLEAN)
- enable_artefacts (BOOLEAN)
- enable_history (BOOLEAN)
- enable_room_booking (BOOLEAN)
- enable_seva (BOOLEAN)
- enable_quiz (BOOLEAN)
- updated_at (TIMESTAMP)
```

#### 2. **news** (News Articles)
```sql
- id (UUID, PK)
- title (VARCHAR(255), NOT NULL)
- image_url (TEXT, NOT NULL)
- body (TEXT)
- active (BOOLEAN, DEFAULT TRUE)
- created_at (TIMESTAMP)
```

#### 3. **flash_updates** (Flash Messages)
```sql
- id (UUID, PK)
- text (VARCHAR(500), NOT NULL)
- active (BOOLEAN, DEFAULT TRUE)
- created_at (TIMESTAMP)
```

#### 4. **events** (Temple Events)
```sql
- id (UUID, PK)
- title (VARCHAR(255), NOT NULL)
- description (TEXT)
- event_date (DATE, NOT NULL)
- location (VARCHAR(255))
- image_url (TEXT)
- type (ENUM: ARADHANA, PARYAYA, UTSAVA, GENERAL)
- scope (ENUM: LOCAL, NATIONAL)
- notify_users (BOOLEAN)
- tithi_label (TEXT)
- active (BOOLEAN)
- created_at (TIMESTAMP)
```

#### 5. **social_links** (Social Media Links)
```sql
- id (UUID, PK)
- platform (VARCHAR(50), NOT NULL)
- url (TEXT, NOT NULL)
- active (BOOLEAN)
- created_at (TIMESTAMP)
```

#### 6. **gallery_albums** (Photo Albums)
```sql
- id (UUID, PK)
- title (VARCHAR(255), NOT NULL)
- description (TEXT)
- cover_image_url (TEXT)
- active (BOOLEAN)
- created_at (TIMESTAMP)
```

#### 7. **gallery_media** (Album Photos/Videos)
```sql
- id (UUID, PK)
- album_id (UUID, FK → gallery_albums)
- type (ENUM: IMAGE, VIDEO)
- title (VARCHAR(255))
- url (TEXT, NOT NULL)
- thumbnail_url (TEXT)
- created_at (TIMESTAMP)
```

#### 8. **artefacts** (PDFs/Audio Files)
```sql
- id (UUID, PK)
- title (TEXT, NOT NULL)
- category (VARCHAR(100), NOT NULL)
- type (ENUM: PDF, AUDIO)
- description (TEXT)
- url (TEXT, NOT NULL)
- thumbnail_url (TEXT)
- active (BOOLEAN)
- created_at (TIMESTAMP)
```

#### 9. **history_sections** (Temple History)
```sql
- id (UUID, PK)
- title (TEXT, NOT NULL)
- subtitle (TEXT)
- period (TEXT)
- description (TEXT)
- image_url (TEXT)
- sort_order (INTEGER, NOT NULL)
- active (BOOLEAN)
- created_at (TIMESTAMP)
```

#### 10. **sevas** (Seva Services)
```sql
- id (UUID, PK)
- title (VARCHAR(255), NOT NULL)
- description (TEXT)
- amount_in_paise (INTEGER, NOT NULL)
- active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 11. **seva_orders** (Seva Bookings)
```sql
- id (UUID, PK)
- uid (VARCHAR(255), NOT NULL) -- Firebase User ID
- seva_id (UUID, FK → sevas)
- seva_title (VARCHAR(255), NOT NULL)
- amount_in_paise (INTEGER, NOT NULL)
- status (ENUM: INITIATED, PAID, FAILED, CANCELLED)
- consent_to_store (BOOLEAN)
- full_name, mobile, email (optional)
- address_line1, address_line2, city, state, pincode (optional)
- razorpay_order_id (VARCHAR(255))
- razorpay_payment_id (VARCHAR(255))
- razorpay_signature (VARCHAR(512))
- created_at, updated_at (TIMESTAMP)
```

#### 12. **room_bookings** (Room Reservations)
```sql
- id (UUID, PK)
- name (VARCHAR(255), NOT NULL)
- mobile (VARCHAR(20), NOT NULL)
- email (VARCHAR(255))
- people_count (INTEGER, NOT NULL)
- check_in_date (DATE, NOT NULL)
- notes (TEXT)
- consent_to_store (BOOLEAN)
- status (ENUM: NEW, EMAIL_SENT, EMAIL_FAILED)
- created_at (TIMESTAMP)
```

#### 13. **quiz_questions** (Quiz Questions)
```sql
- id (UUID, PK)
- question_text (TEXT, NOT NULL)
- option_a, option_b, option_c, option_d (TEXT, NOT NULL)
- correct_option (ENUM: A, B, C, D)
- active (BOOLEAN)
- created_at (TIMESTAMP)
```

#### 14. **quiz_attempts** (Quiz Leaderboard)
```sql
- id (UUID, PK)
- user_uid (VARCHAR(255), NOT NULL)
- user_name (VARCHAR(255), NOT NULL)
- score (INTEGER, NOT NULL)
- total (INTEGER, NOT NULL)
- created_at (TIMESTAMP)
```

#### 15. **temple_info** (Temple Information)
```sql
- id (VARCHAR(50), PK) -- Always "default"
- morning_darshan (TEXT, NOT NULL)
- morning_prasada (TEXT, NOT NULL)
- evening_darshan (TEXT, NOT NULL)
- evening_prasada (TEXT, NOT NULL)
- updated_at (TIMESTAMP)
```

#### 16. **legal_content** (Privacy Policy, Terms)
```sql
- id (INTEGER, PK) -- Always 1
- privacy_policy (TEXT, NOT NULL)
- terms_and_conditions (TEXT, NOT NULL)
- consent_text (TEXT, NOT NULL)
- updated_at (TIMESTAMP)
```

#### 17. **push_tokens** (FCM Tokens)
```sql
- id (UUID, PK)
- user_uid (VARCHAR(255), NOT NULL)
- token (TEXT, UNIQUE, NOT NULL)
- enabled (BOOLEAN)
- updated_at (TIMESTAMP)
```


---

## API Endpoints

### Base URL
```
Production: https://api.sodematha.org/api
Development: http://localhost:8080/api
```

---

### 1. **Home API**

#### GET `/home`
Get home screen data (news, flash updates, upcoming events, panchanga).

**Response:**
```json
{
  "news": [
    {
      "id": "uuid",
      "title": "Latest News",
      "imageUrl": "https://...",
      "body": "News content...",
      "active": true,
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ],
  "flashUpdates": ["Flash message 1", "Flash message 2"],
  "upcomingEvents": [
    {
      "id": "uuid",
      "title": "Aradhana Utsava",
      "description": "Annual celebration...",
      "eventDate": "2024-12-25",
      "location": "Main Temple",
      "imageUrl": "https://...",
      "type": "ARADHANA",
      "scope": "LOCAL",
      "tithiLabel": "Purnima",
      "active": true
    }
  ],
  "panchanga": {
    "weekday": "Monday",
    "tithi": "Purnima"
  }
}
```

---

### 2. **Events API**

#### GET `/events`
Get all active events.

**Query Parameters:**
- `month` (optional): Filter by month (1-12)
- `year` (optional): Filter by year

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Event Name",
    "description": "Event description...",
    "eventDate": "2024-12-25",
    "location": "Temple Hall",
    "imageUrl": "https://...",
    "type": "ARADHANA",
    "scope": "NATIONAL",
    "tithiLabel": "Purnima",
    "active": true,
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```

---

### 3. **Gallery API**

#### GET `/gallery/albums`
Get all active gallery albums.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Album Title",
    "description": "Album description...",
    "coverImageUrl": "https://...",
    "active": true,
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```

#### GET `/gallery/albums/{albumId}/media`
Get all media items in an album.

**Response:**
```json
[
  {
    "id": "uuid",
    "albumId": "album-uuid",
    "type": "IMAGE",
    "title": "Photo Title",
    "url": "https://...",
    "thumbnailUrl": "https://...",
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```

---

### 4. **Artefacts API**

#### GET `/artefacts`
Get all active artefacts (PDFs, Audio).

**Query Parameters:**
- `type` (optional): "PDF" | "AUDIO"
- `category` (optional): Filter by category

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Stotra Name",
    "category": "Stotra",
    "type": "PDF",
    "description": "Description...",
    "url": "https://...",
    "thumbnailUrl": "https://...",
    "active": true,
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```

---

### 5. **History API**

#### GET `/history`
Get all active history sections (sorted by sort_order).

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "History Section",
    "subtitle": "Subtitle",
    "period": "1900-1950",
    "description": "Historical content...",
    "imageUrl": "https://...",
    "sortOrder": 1,
    "active": true,
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```

---

### 6. **Sevas API**

#### GET `/sevas`
Get all active sevas.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Ekadina Seva",
    "description": "One day seva...",
    "amountInPaise": 10000,
    "active": true,
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z"
  }
]
```

#### POST `/seva-orders`
Create a new seva order.

**Request Body:**
```json
{
  "sevaId": "uuid",
  "consentToStore": true,
  "fullName": "John Doe",
  "mobile": "+919876543210",
  "email": "john@example.com",
  "addressLine1": "123 Street",
  "addressLine2": "Apartment 4B",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001"
}
```

**Response:**
```json
{
  "orderId": "uuid",
  "razorpayOrderId": "order_xxx",
  "amount": 10000,
  "currency": "INR",
  "keyId": "rzp_live_xxx"
}
```

#### POST `/seva-orders/{orderId}/verify`
Verify Razorpay payment.

**Request Body:**
```json
{
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

---

### 7. **Room Booking API**

#### POST `/room-bookings`
Create a room booking request.

**Request Body:**
```json
{
  "name": "John Doe",
  "mobile": "+919876543210",
  "email": "john@example.com",
  "peopleCount": 2,
  "checkInDate": "2024-12-25",
  "notes": "Early check-in if possible",
  "consentToStore": true
}
```

**Response:**
```json
{
  "id": "uuid",
  "message": "Booking request submitted successfully"
}
```

---

### 8. **Quiz API**

#### GET `/quiz/questions`
Get random active quiz questions.

**Query Parameters:**
- `count` (optional, default=10): Number of questions

**Response:**
```json
[
  {
    "id": "uuid",
    "questionText": "Who is the founder?",
    "optionA": "Option A",
    "optionB": "Option B",
    "optionC": "Option C",
    "optionD": "Option D"
  }
]
```

#### POST `/quiz/submit`
Submit quiz answers and get score.

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": "uuid",
      "selectedOption": "A"
    }
  ],
  "userName": "John Doe"
}
```

**Response:**
```json
{
  "score": 8,
  "total": 10,
  "percentage": 80.0,
  "attemptId": "uuid"
}
```

#### GET `/quiz/leaderboard`
Get quiz leaderboard.

**Query Parameters:**
- `limit` (optional, default=10): Number of top scores

**Response:**
```json
[
  {
    "rank": 1,
    "userName": "John Doe",
    "score": 10,
    "total": 10,
    "percentage": 100.0,
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```

---

### 9. **Legal API**

#### GET `/legal`
Get privacy policy and terms.

**Response:**
```json
{
  "privacyPolicy": "Privacy policy content...",
  "termsAndConditions": "Terms and conditions...",
  "consentText": "I consent to..."
}
```

---

### 10. **Config API**

#### GET `/config`
Get app configuration (feature flags).

**Response:**
```json
{
  "enableEvents": true,
  "enableGallery": true,
  "enableArtefacts": true,
  "enableHistory": true,
  "enableRoomBooking": true,
  "enableSeva": true,
  "enableQuiz": true
}
```

#### GET `/config/temple-info`
Get temple/matha information.

**Response:**
```json
{
  "morningDarshan": "6:00 AM - 9:00 AM",
  "morningPrasada": "9:00 AM - 10:00 AM",
  "eveningDarshan": "6:00 PM - 8:00 PM",
  "eveningPrasada": "8:00 PM - 9:00 PM"
}
```

#### GET `/config/social-links`
Get social media links.

**Response:**
```json
[
  {
    "platform": "INSTAGRAM",
    "url": "https://instagram.com/...",
    "active": true
  }
]
```

---

### 11. **Push Notifications API**

#### POST `/push/register`
Register FCM token for push notifications.

**Request Body:**
```json
{
  "token": "fcm_token_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token registered successfully"
}
```

#### DELETE `/push/unregister`
Unregister FCM token.

**Request Body:**
```json
{
  "token": "fcm_token_xxx"
}
```

---

### 12. **Admin APIs** (Require Authentication)

All admin endpoints are prefixed with `/admin` and require Firebase authentication token.

**Authentication Header:**
```
Authorization: Bearer <firebase-id-token>
```

#### **Admin - Events**

**GET** `/admin/events` - List all events  
**POST** `/admin/events` - Create event  
**PUT** `/admin/events/{id}` - Update event  
**DELETE** `/admin/events/{id}` - Delete event

#### **Admin - Gallery**

**GET** `/admin/gallery/albums` - List albums  
**POST** `/admin/gallery/albums` - Create album  
**PUT** `/admin/gallery/albums/{id}` - Update album  
**DELETE** `/admin/gallery/albums/{id}` - Delete album  
**POST** `/admin/gallery/media` - Add media to album  
**DELETE** `/admin/gallery/media/{id}` - Delete media

#### **Admin - Artefacts**

**GET** `/admin/artefacts` - List artefacts  
**POST** `/admin/artefacts` - Create artefact  
**PUT** `/admin/artefacts/{id}` - Update artefact  
**DELETE** `/admin/artefacts/{id}` - Delete artefact

#### **Admin - History**

**GET** `/admin/history` - List history sections  
**POST** `/admin/history` - Create history section  
**PUT** `/admin/history/{id}` - Update history section  
**DELETE** `/admin/history/{id}` - Delete history section

#### **Admin - Sevas**

**GET** `/admin/sevas` - List sevas  
**POST** `/admin/sevas` - Create seva  
**PUT** `/admin/sevas/{id}` - Update seva  
**DELETE** `/admin/sevas/{id}` - Delete seva

#### **Admin - Seva Orders**

**GET** `/admin/seva-orders` - List all seva orders  
**GET** `/admin/seva-orders/{id}` - Get order details

#### **Admin - Room Bookings**

**GET** `/admin/room-bookings` - List all bookings  
**GET** `/admin/room-bookings/{id}` - Get booking details  
**PUT** `/admin/room-bookings/{id}/status` - Update booking status

#### **Admin - Quiz**

**GET** `/admin/quiz/questions` - List questions  
**POST** `/admin/quiz/questions` - Create question  
**PUT** `/admin/quiz/questions/{id}` - Update question  
**DELETE** `/admin/quiz/questions/{id}` - Delete question

#### **Admin - News**

**GET** `/admin/news` - List news  
**POST** `/admin/news` - Create news  
**PUT** `/admin/news/{id}` - Update news  
**DELETE** `/admin/news/{id}` - Delete news

#### **Admin - Flash Updates**

**GET** `/admin/flash` - List flash updates  
**POST** `/admin/flash` - Create flash update  
**PUT** `/admin/flash/{id}` - Update flash update  
**DELETE** `/admin/flash/{id}` - Delete flash update

#### **Admin - Config**

**GET** `/admin/config` - Get app config  
**PUT** `/admin/config` - Update app config  
**GET** `/admin/temple-info` - Get temple info  
**PUT** `/admin/temple-info` - Update temple info  
**GET** `/admin/social` - Get social links  
**POST** `/admin/social` - Create social link  
**PUT** `/admin/social/{id}` - Update social link  
**DELETE** `/admin/social/{id}` - Delete social link

---

## Data Transfer Objects (DTOs)

### Example Request/Response DTOs

```java
// Seva Order Create Request
public record SevaOrderCreateRequest(
    String sevaId,
    boolean consentToStore,
    String fullName,
    String mobile,
    String email,
    String addressLine1,
    String addressLine2,
    String city,
    String state,
    String pincode
) {}

// Event Admin Create/Update
public record EventCreateOrUpdate(
    String title,
    String description,
    LocalDate eventDate,
    String location,
    String imageUrl,
    EventType type,
    EventScope scope,
    Boolean notifyUsers,
    String tithiLabel,
    Boolean active
) {}

// Quiz Submit Request
public record QuizSubmitRequest(
    List<Answer> answers,
    String userName
) {
    public record Answer(
        String questionId,
        CorrectOption selectedOption
    ) {}
}
```

---

## Authentication & Security

### Firebase Authentication

All admin endpoints require Firebase ID token:

```http
Authorization: Bearer <firebase-id-token>
```

### Security Configuration

- CORS enabled for frontend domains
- CSRF protection enabled
- Rate limiting on sensitive endpoints
- Input validation using Jakarta Validation

### Role-Based Access

- **Public APIs**: No authentication required
- **Admin APIs**: Firebase authentication required
- **User-specific APIs**: Firebase UID validation

---

## Environment Configuration

### application.properties

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/seva_platform
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

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

# Server
server.port=8080
```

### Required Environment Variables

```bash
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
FIREBASE_CREDENTIALS_PATH=/path/to/firebase-credentials.json
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=your_secret
EMAIL_USERNAME=your@email.com
EMAIL_PASSWORD=your_password
```

---

## Deployment Instructions

### Prerequisites

1. Java 21 installed
2. PostgreSQL database
3. Firebase project setup
4. Razorpay account

### Build Steps

```bash
# Build the project
./mvnw clean package

# Run migrations
./mvnw flyway:migrate

# Run the application
java -jar target/seva_platform-0.0.1-SNAPSHOT.jar
```

### Database Setup

```bash
# Create database
createdb seva_platform

# Run Flyway migrations
./mvnw flyway:migrate
```

### Production Deployment

1. Set environment variables
2. Build JAR: `./mvnw clean package`
3. Deploy to server
4. Run with: `java -jar seva_platform.jar`
5. Setup reverse proxy (Nginx) for SSL
6. Configure firewall rules

---

## Error Handling

### Standard Error Response

```json
{
  "timestamp": "2024-01-01T10:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/seva-orders"
}
```

### HTTP Status Codes

- **200 OK**: Success
- **201 Created**: Resource created
- **400 Bad Request**: Validation error
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

## Contact & Support

**Developer:** Seva Platform Team  
**Email:** support@sodematha.org  
**Documentation Version:** 1.0  
**Last Updated:** February 2025