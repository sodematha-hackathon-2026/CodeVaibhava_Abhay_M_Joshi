import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';

export const auth = getAuth();
export const firestore = getFirestore();
export const app = getApp();