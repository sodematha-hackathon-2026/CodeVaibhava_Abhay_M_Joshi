import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import BookingScreen from "../screens/BookingScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SevaStack from "./SevaStack";
import EventCalendarScreen from "../screens/EventCalendarScreen";
import MoreStack from "./MoreStack";
import { useAppConfig } from "../context/ConfigContext";

const Tab = createBottomTabNavigator();

function TempleTabButton({ children, onPress, accessibilityState }: any) {
  const focused = accessibilityState?.selected;

  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 8,
        paddingBottom: Platform.OS === "ios" ? 18 : 10,
      }}
    >
      {children}
      {focused && (
        <View
          style={{
            marginTop: 6,
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: "#C8A24A",           }}
        />
      )}
    </Pressable>
  );
}

function RaisedSevaButton({ children, onPress, accessibilityState }: any) {
  const focused = accessibilityState?.selected;

  return (
    <Pressable
      onPress={onPress}
      style={{
        top: -18,
        alignItems: "center",
        justifyContent: "center",
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: focused ? "#C8A24A" : "#E7D3A0",         borderWidth: 2,
        borderColor: "#B38B2E",
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 10,
      }}
    >
      {children}
    </Pressable>
  );
}

export default function TabNavigator() {
  const { config } = useAppConfig();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,

        tabBarActiveTintColor: "#C8A24A",
        tabBarInactiveTintColor: "#6B7280",

        tabBarStyle: {
          height: Platform.OS === "ios" ? 86 : 72,
          backgroundColor: "#FFF8E6",           borderTopWidth: 1,
          borderTopColor: "#E7D3A0",
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          position: "absolute",
          overflow: "visible",
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -2 },
          elevation: 12,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "800",
          marginTop: -2,
        },

        tabBarIcon: ({ color, size, focused }) => {
          let iconName: any = "ellipse";

          if (route.name === "Home")
            iconName = focused ? "home" : "home-outline";
          if (route.name === "Booking")
            iconName = focused ? "calendar" : "calendar-outline";
          if (route.name === "Profile")
            iconName = focused ? "person" : "person-outline";
          if (route.name === "Events")
            iconName = focused ? "calendar" : "calendar-outline";

                    if (route.name === "Sevas")
            iconName = focused ? "flower" : "flower-outline";

          if(route.name == "More")
            iconName = focused ? "ellipsis-horizontal" : "ellipsis-horizontal-outline"

          return (
            <Ionicons
              name={iconName}
              size={route.name === "Sevas" ? 26 : 22}
              color={color}
            />
          );
        },

                tabBarButton: (props) => {
          if (route.name === "Sevas") return <RaisedSevaButton {...props} />;
          return <TempleTabButton {...props} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />

      {config?.enableEvents ? (
        <Tab.Screen
          name="Events"
          component={EventCalendarScreen}
          options={{ title: "Events" }}
        />
      ) : null}

      {config?.enableSeva ? (
        <Tab.Screen
          name="Sevas"
          component={SevaStack}
          options={{ headerShown: true }}
        />
      ) : null}

      <Tab.Screen name="Profile" component={ProfileScreen} />

      <Tab.Screen
        name="More"
        component={MoreStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
