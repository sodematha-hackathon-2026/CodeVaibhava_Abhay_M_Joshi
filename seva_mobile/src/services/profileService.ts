import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, serverTimestamp } from '@react-native-firebase/firestore';

export type UserProfile = {
  uid: string;
  phone: string;
  fullName?: string;
  email?: string;
  
    addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  
    consentToStore: boolean;
  wantsUpdates: boolean;
  wantsToVolunteer: boolean;
  
    createdAt?: any;
  updatedAt?: any;
};

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirestore();
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function upsertUserProfile(profile: UserProfile) {
  const db = getFirestore();
  const ref = doc(db, "users", profile.uid);

    if (!profile.consentToStore) {
    await setDoc(
      ref,
      {
        uid: profile.uid,
        phone: profile.phone,
        fullName: profile.fullName,
        email: profile.email,
        consentToStore: false,
        wantsUpdates: false,
        wantsToVolunteer: false,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return;
  }

    const existing = await getDoc(ref);
  if (!existing.exists()) {
    await setDoc(ref, { 
      ...profile, 
      createdAt: serverTimestamp(), 
      updatedAt: serverTimestamp() 
    });
  } else {
    await updateDoc(ref, { 
      ...profile, 
      updatedAt: serverTimestamp() 
    });
  }
}