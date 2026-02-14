import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MoreScreen from "../screens/MoreScreen";
import GalleryAlbumsScreen from "../screens/GalleryAlbumsScreen";
import GalleryAlbumDetailScreen from "../screens/GalleryAlbumDetailScreen";
import EventCalendarScreen from "../screens/EventCalendarScreen";
import BookingScreen from "../screens/BookingScreen";
import QuizScreen from "../screens/QuizScreen";
import QuizResultScreen from "../screens/QuizResultScreen";
import QuizLeaderboardScreen from "../screens/QuizLeaderboardScreen";
import ArtefactsScreen from "../screens/ArtefactsScreen";
import HistoryScreen from "../screens/HistoryScreen";
import SectionsSearchScreen from "../screens/SectionsSearchScreen";

export type MoreStackParamList = {
  MoreHome: undefined;

  GalleryAlbums: undefined;
  GalleryAlbumDetail: { albumId: string };

  Booking: undefined;

  Quiz: undefined;
  QuizResult: {
    answers: { questionId: string; selected: "A" | "B" | "C" | "D" }[];
  };
  QuizLeaderboard: undefined;
  Artefacts: undefined;
  History: undefined;
  SectionsSearch: undefined;
};

const Stack = createNativeStackNavigator<MoreStackParamList>();

export default function MoreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MoreHome"
        component={MoreScreen}
        options={{ title: "More" }}
      />

      <Stack.Screen
        name="GalleryAlbums"
        component={GalleryAlbumsScreen}
        options={{ title: "Gallery" }}
      />
      <Stack.Screen
        name="GalleryAlbumDetail"
        component={GalleryAlbumDetailScreen}
        options={{ title: "Album" }}
      />

      <Stack.Screen name="Booking" component={BookingScreen} />

      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ title: "Youth Quiz" }}
      />
      <Stack.Screen
        name="QuizResult"
        component={QuizResultScreen}
        options={{ title: "Result" }}
      />
      <Stack.Screen
        name="QuizLeaderboard"
        component={QuizLeaderboardScreen}
        options={{ title: "Leaderboard" }}
      />
      <Stack.Screen
        name="Artefacts"
        component={ArtefactsScreen}
        options={{ title: "Artefacts" }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: "History & Parampara" }}
      />

      <Stack.Screen
        name="SectionsSearch"
        component={SectionsSearchScreen}
        options={{ title: "Search Sections" }}
      />
    </Stack.Navigator>
  );
}
