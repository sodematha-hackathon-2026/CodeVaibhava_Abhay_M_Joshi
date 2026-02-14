# 🚀 Quick Start Guide - Seva Platform

> Get all three projects running in 10 minutes

## ⚡ Prerequisites Check

```bash
# Check versions
java -version        # Need Java 21+
node -v             # Need Node 18+
npm -v              # Need npm 9+
psql --version      # Need PostgreSQL 15+
mvn -v              # Need Maven 3.9+
```

---

## 🎯 Step-by-Step Setup

### **Step 1: Clone & Navigate**

```bash
git clone <repository-url>
```

### **Step 2: Database Setup (2 minutes)**

```bash
# Start PostgreSQL service
sudo service postgresql start  # Linux
brew services start postgresql # Mac

# Create database
psql -U postgres -c "CREATE DATABASE sodematha_dev;"
```

### **Step 3: Backend Setup (3 minutes)**

```bash
cd seva_platform

# Copy config template
cp src/main/resources/application.yml.example src/main/resources/application.yml

# Edit application.yml - Set these values:
# - Database URL, username, password
# - Mail credentials (Gmail App Password)
# - Razorpay test keys

# Add Firebase service account
# Download from: Firebase Console → Project Settings → Service Accounts
# Place as: src/main/resources/firebase-service-account.json

# Install dependencies & run
mvn clean install
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Backend is live at:** `http://localhost:8080`

```

---

### **Step 4: Admin Web Setup (2 minutes)**

**Open new terminal:**

```bash
cd seva_ui

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
VITE_API_URL=http://localhost:8080
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
EOF

# Edit .env with your Firebase web config
# Get from: Firebase Console → Project Settings → General → Your apps → Web app

# Run dev server
npm run dev
```

**Admin portal is live at:** `http://localhost:5173`

---

### **Step 5: Mobile App Setup (3 minutes)**

**Open new terminal:**

```bash
cd seva_mobile

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
API_URL=http://localhost:8080
FIREBASE_API_KEY=your_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
RAZORPAY_KEY=rzp_test_xxxxx
EOF

# Add google-services.json
# Download from: Firebase Console → Project Settings → Your apps → Android app
# Place at: seva_mobile/google-services.json

# Start Expo
npx expo start
```

**Scan QR code with Expo Go app** or press `a` for Android emulator / `i` for iOS simulator

---

## 🎉 You're Done!

You should now have:

✅ Backend API running on `http://localhost:8080`  
✅ Admin Web running on `http://localhost:5173`  
✅ Mobile App running in Expo

---

## 📱 Test the Flow

### **1. Create an account:**
- Open mobile app or web portal
- Sign up with email/password
- Verify account

### **2. Test features:**
- Browse events
- Book a seva
- Make a donation (use Razorpay test card: 4111 1111 1111 1111)
- View content (articles/videos)

---

## 🐛 Common Issues & Fixes

### **Backend won't start?**

```bash
# Check if port 8080 is in use
lsof -i :8080
kill -9 <PID>

# Check database connection
psql -U postgres -d sodematha_dev -c "SELECT 1;"

# Check Java version
java -version  # Must be 21+
```

### **Web app can't connect to backend?**

```bash
# Check CORS in backend application.yml
# Should allow http://localhost:5173

# Check .env file
cat seva_ui/.env  # Verify VITE_API_URL

# Clear browser cache
# Hard reload: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
```

### **Mobile app crashes?**

```bash
# Clear Expo cache
npx expo start -c

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check .env file exists
ls -la seva_mobile/.env
```

### **Firebase authentication fails?**

```bash
# Verify Firebase config
# - Check API keys in .env files
# - Enable Email/Password auth in Firebase Console
# - Add authorized domains (localhost for dev)
```

### **Database migration errors?**

```bash
# Reset database
psql -U postgres -c "DROP DATABASE sodematha_dev;"
psql -U postgres -c "CREATE DATABASE sodematha_dev;"

# Flyway will auto-run migrations on next startup
mvn spring-boot:run
```

---

## 🔑 Getting Required Credentials

### **Firebase Setup:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project or select existing
3. Enable Authentication → Email/Password
4. Get web config: Project Settings → General → Your apps → Web
5. Download service account: Project Settings → Service Accounts → Generate new key
6. Download google-services.json: Project Settings → Your apps → Android

### **Razorpay Setup:**

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up / Log in
3. Navigate to Settings → API Keys
4. Generate Test Key (for development)
5. Note down Key ID and Secret

### **Gmail App Password:**

1. Enable 2FA on Gmail account
2. Go to Google Account → Security → 2-Step Verification
3. Scroll to "App passwords"
4. Generate new app password for "Mail"
5. Copy 16-character password

---

## 📚 Next Steps

- Read `README.md` for comprehensive documentation
- Check `seva_platform/Api documentation.md` for API details
- Review individual project READMEs for specific features
- Join the development team communication channel

---

## 🆘 Get Help

**Stuck?** Check these resources:

1. **Project Documentation:** Each project has detailed docs in their folders
2. **API Docs:** `seva_platform/Api documentation.md`
3. **Complete Documentation:** `seva_platform/Complete Documentation.md`
4. **Firebase Docs:** https://firebase.google.com/docs
5. **Spring Boot Docs:** https://spring.io/projects/spring-boot
6. **React Docs:** https://react.dev
7. **Expo Docs:** https://docs.expo.dev

**Still stuck?** Contact the development team!

---

**Happy Coding! 🎉**
