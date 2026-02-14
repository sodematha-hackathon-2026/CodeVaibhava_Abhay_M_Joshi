import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import LoginScreen from "../screens/LoginScreen";
import TabNavigator from "./TabNavigator";

export default function RootNavigator() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);
  
  return (
    <NavigationContainer>
      {user ? <TabNavigator /> : <LoginScreen />}
    </NavigationContainer>
  );
}