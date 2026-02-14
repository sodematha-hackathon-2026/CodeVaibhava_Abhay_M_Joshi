// src/context/LegalContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchLegal, LegalPayload } from '../services/legalApi';

interface LegalContent {
  privacyPolicy: string;
  termsAndConditions: string;
  sevaConsent: string;
  devoteeConsent: string;
}

interface LegalContextType {
  content: LegalContent;
  loading: boolean;
  showPrivacyPolicy: () => void;
  showTermsAndConditions: () => void;
  showSevaConsent: () => void;
  showDevoteeConsent: () => void;
  modalVisible: boolean;
  modalTitle: string;
  modalBody: string;
  closeModal: () => void;
}

const LegalContext = createContext<LegalContextType | undefined>(undefined);

export const LegalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<LegalContent>({
    privacyPolicy: getDefaultPrivacyPolicy(),
    termsAndConditions: getDefaultTermsAndConditions(),
    sevaConsent: getDefaultSevaConsent(),
    devoteeConsent: getDefaultDevoteeConsent(),
  });
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  useEffect(() => {
    loadLegalContent();
  }, []);

  const loadLegalContent = async () => {
    try {
      const data = await fetchLegal();
      setContent({
        privacyPolicy: data.privacyPolicy || getDefaultPrivacyPolicy(),
        termsAndConditions: data.termsAndConditions || getDefaultTermsAndConditions(),
        sevaConsent: data.sevaConsent || getDefaultSevaConsent(),
        devoteeConsent: data.devoteeConsent || getDefaultDevoteeConsent(),
      });
    } catch (error) {
      console.log('Failed to load legal content, using defaults:', error);
      // Already initialized with defaults, so just leave them
    } finally {
      setLoading(false);
    }
  };

  const showPrivacyPolicy = () => {
    setModalTitle('Privacy Policy');
    setModalBody(content.privacyPolicy);
    setModalVisible(true);
  };

  const showTermsAndConditions = () => {
    setModalTitle('Terms and Conditions');
    setModalBody(content.termsAndConditions);
    setModalVisible(true);
  };

  const showSevaConsent = () => {
    setModalTitle('Seva Booking - Data Consent');
    setModalBody(content.sevaConsent);
    setModalVisible(true);
  };

  const showDevoteeConsent = () => {
    setModalTitle('Devotee Registration - Data Consent');
    setModalBody(content.devoteeConsent);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <LegalContext.Provider
      value={{
        content,
        loading,
        showPrivacyPolicy,
        showTermsAndConditions,
        showSevaConsent,
        showDevoteeConsent,
        modalVisible,
        modalTitle,
        modalBody,
        closeModal,
      }}
    >
      {children}
    </LegalContext.Provider>
  );
};

export const useLegal = () => {
  const context = useContext(LegalContext);
  if (!context) {
    throw new Error('useLegal must be used within LegalProvider');
  }
  return context;
};

// DEFAULT CONTENT FUNCTIONS

function getDefaultPrivacyPolicy(): string {
  return `SODE SRI VADIRAJA MATHA MOBILE APP
PRIVACY POLICY

Last Updated: February 2026

1. INTRODUCTION
Sode Sri Vadiraja Matha ("we," "our," or "temple") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.

2. INFORMATION WE COLLECT

2.1 Personal Information:
   • Name
   • Phone number
   • Email address
   • Physical address (for seva bookings and room reservations)
   
2.2 Technical Information:
   • Device information (model, OS version)
   • IP address
   • App usage data
   • Push notification tokens
   
2.3 Payment Information:
   • Payment details processed through Razorpay
   • We do NOT store your credit card or bank details
   • Transaction records for accounting purposes

3. HOW WE USE YOUR INFORMATION
   • Create and manage your account
   • Process seva bookings and payments
   • Send booking confirmations and updates
   • Send push notifications about events and updates
   • Improve app functionality
   • Respond to your inquiries
   • Comply with legal obligations

4. AUTHENTICATION
We use Firebase Authentication for secure login via phone number (OTP). Your authentication data is handled by Google Firebase according to their privacy policy.

5. DATA STORAGE AND SECURITY
   • Data stored on secure cloud servers
   • Encrypted transmission (HTTPS)
   • Access restricted to authorized personnel
   • Regular security audits
   • Firebase and Razorpay security standards

6. DATA SHARING
We DO NOT sell your personal information.

We may share data with:
   • Temple administration (for seva fulfillment)
   • Payment processors (Razorpay - for transactions)
   • Cloud service providers (Firebase, hosting)
   • Legal authorities (when required by law)

7. YOUR RIGHTS
   • Access your personal data
   • Update your information
   • Delete your account and data
   • Opt-out of marketing communications
   • Disable push notifications
   • Withdraw consent

8. PUSH NOTIFICATIONS
   • You can enable/disable notifications anytime
   • Event reminders and updates
   • Seva confirmations
   • Managed through app settings

9. CHILDREN'S PRIVACY
Our app is not intended for children under 13. We do not knowingly collect data from children.

10. DATA RETENTION
   • Active accounts: Data retained while account is active
   • Deleted accounts: Data removed within 30 days
   • Legal requirements: Some data retained for accounting/legal purposes

11. THIRD-PARTY SERVICES
   • Firebase (Google) - Authentication and database
   • Razorpay - Payment processing
   • These services have their own privacy policies

12. CHANGES TO PRIVACY POLICY
We may update this policy. Changes will be posted in the app with updated date.

13. CONTACT US
For privacy concerns or data requests:
Email: privacy@sodematha.org
Phone: [Temple Phone Number]

14. CONSENT
By using this app, you consent to this Privacy Policy.`;
}

function getDefaultTermsAndConditions(): string {
  return `SODE SRI VADIRAJA MATHA MOBILE APP
TERMS AND CONDITIONS

Last Updated: February 2026

1. ACCEPTANCE OF TERMS
By downloading, installing, or using this app, you agree to these Terms and Conditions. If you do not agree, do not use the app.

2. ELIGIBILITY
   • You must be 18 years or older to make bookings/payments
   • Minors can use with parental/guardian consent
   • You must provide accurate information

3. USER ACCOUNT
   • You are responsible for maintaining account security
   • One account per phone number
   • Do not share your login credentials
   • Report unauthorized access immediately
   • We reserve the right to suspend/terminate accounts

4. ACCEPTABLE USE
You agree NOT to:
   • Provide false or misleading information
   • Use the app for unlawful purposes
   • Attempt to hack or disrupt the app
   • Send spam or malicious content
   • Impersonate others
   • Violate any laws or regulations

5. SEVA BOOKINGS
   • All seva bookings are subject to temple availability
   • Prices may change without notice
   • Bookings are final once payment is confirmed
   • Cancellation policy as per temple rules
   • Temple reserves right to refuse/cancel bookings

6. PAYMENTS
   • Processed through Razorpay payment gateway
   • You are responsible for payment accuracy
   • Refunds subject to temple policy
   • Transaction fees may apply

7. ROOM BOOKINGS
   • Subject to availability
   • Temple will contact you for confirmation
   • Follow temple rules during stay

8. CONTENT
   • All app content is property of Sode Sri Vadiraja Matha
   • Do not copy, distribute, or reproduce without permission

9. NOTIFICATIONS
   • By enabling notifications, you consent to receive updates
   • You can disable anytime in settings

10. PRIVACY
Your privacy is governed by our Privacy Policy.

11. DISCLAIMERS
   • App provided "as is" without warranties
   • We do not guarantee uninterrupted service
   • Use at your own risk

12. LIMITATION OF LIABILITY
   • Temple not liable for indirect damages
   • Maximum liability limited to amount paid

13. MODIFICATIONS
   • We may update these terms anytime
   • Continued use means acceptance of changes

14. GOVERNING LAW
These terms are governed by the laws of India.

15. CONTACT
Questions about terms:
Email: support@sodematha.org

By using this app, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.`;
}

function getDefaultSevaConsent(): string {
  return `DATA CONSENT FOR SEVA BOOKING

By providing your information and proceeding with this seva booking, you consent to:

1. INFORMATION COLLECTED:
   • Name, phone number, email address, and address
   • Seva details and payment information
   • Date and time of booking

2. HOW WE USE YOUR INFORMATION:
   • Process and fulfill your seva booking
   • Send booking confirmation and updates
   • Communicate about the seva and temple events
   • Maintain records for temple administration
   • Process payments securely

3. DATA STORAGE:
   • Your information is stored securely on our servers
   • We retain your data for administrative and legal purposes
   • Your payment details are processed through secure payment gateway (Razorpay)

4. YOUR RIGHTS:
   • You can request access to your data
   • You can request deletion of your data (subject to legal requirements)
   • You can opt-out of marketing communications

5. DATA SHARING:
   • We do NOT sell your personal information
   • We may share with temple administration for seva fulfillment
   • We may share with payment processors for transaction processing

For complete details, please read our Privacy Policy.

By checking the consent box, you confirm that you have read and agree to our data practices.`;
}

function getDefaultDevoteeConsent(): string {
  return `DEVOTEE REGISTRATION DATA CONSENT

By registering as a devotee, you consent to:

1. INFORMATION COLLECTED:
   • Name, phone number, and email address
   • Profile information you choose to provide
   • App usage and interaction data
   • Device information and notification tokens

2. HOW WE USE YOUR INFORMATION:
   • Create and manage your devotee account
   • Provide personalized temple services
   • Send notifications about events, sevas, and updates
   • Improve app functionality and user experience
   • Communicate important temple announcements

3. NOTIFICATIONS:
   • You can enable/disable push notifications anytime
   • Event reminders and temple updates
   • Seva booking confirmations

4. DATA SECURITY:
   • Your data is encrypted and stored securely
   • We use industry-standard security measures
   • Authentication via Firebase

5. YOUR CONTROL:
   • Update your profile anytime
   • Manage notification preferences
   • Request data deletion through app settings
   • Withdraw consent by deleting your account

6. DATA RETENTION:
   • We retain your data as long as your account is active
   • You can delete your account and data anytime

We respect your privacy and will never sell your personal information.

For complete details, read our Privacy Policy.`;
}