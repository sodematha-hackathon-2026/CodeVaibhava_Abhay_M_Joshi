import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Image,
  Animated,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { fetchEvents, EventItem } from "../services/eventsApi";
import {
  enablePush,
  disablePush,
  loadPushEnabled,
} from "../services/pushService";
import { useAppConfig } from "../context/ConfigContext";
import DisabledModule from "../components/DisabledModule";
import { THEME } from "../theme/Theme";
import { Card, TempleDivider } from "../components/Card";
import { Button } from "../components/Button";

const TYPES = ["ALL", "ARADHANA", "PARYAYA", "UTSAVA", "GENERAL"] as const;
const SCOPES = ["ALL", "LOCAL", "NATIONAL"] as const;

export default function EventCalendarScreen() {
  const { t } = useTranslation();
  const { config } = useAppConfig();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [type, setType] = useState<(typeof TYPES)[number]>("ALL");
  const [scope, setScope] = useState<(typeof SCOPES)[number]>("ALL");
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  if (config && !config.enableEvents)
    return <DisabledModule name={t("screens.events")} />;

  const load = async () => {
    setLoading(true);
    try {
      const from = new Date().toISOString().slice(0, 10);
      const to = new Date(Date.now() + 45 * 86400000)
        .toISOString()
        .slice(0, 10);
      const data = await fetchEvents({
        from,
        to,
        type: type === "ALL" ? undefined : type,
        scope: scope === "ALL" ? undefined : scope,
      });
      setEvents(data);
    } catch (e: any) {
      console.log("Events fetch error:", e?.message || e);
      Alert.alert(t("errors.error"), e?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPushEnabled()
      .then(setNotifEnabled)
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [type, scope]);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  const toggleNotifications = async () => {
    setNotifLoading(true);
    try {
      if (notifEnabled) {
        await disablePush();
        setNotifEnabled(false);
        Alert.alert(
          t("devoteeRegistration.success"),
          "Push notifications disabled",
        );
      } else {
        await enablePush();
        setNotifEnabled(true);
        Alert.alert(
          t("devoteeRegistration.success"),
          "Push notifications enabled",
        );
      }
    } catch (e: any) {
      console.log("Push toggle error:", e?.message || e);
      Alert.alert(
        t("errors.error"),
        e?.message || "Failed to update notifications",
      );
    } finally {
      setNotifLoading(false);
    }
  };

  const eventsByDate = useMemo(() => {
    const m: Record<string, EventItem[]> = {};
    for (const e of events) {
      (m[e.date] ||= []).push(e);
    }
    return m;
  }, [events]);

  const markedDates = useMemo(() => {
    const marked: any = {};
    Object.keys(eventsByDate).forEach((d) => {
      marked[d] = {
        marked: true,
        dotColor: THEME.colors.sacred.saffron,
      };
    });
    marked[selectedDate] = {
      ...(marked[selectedDate] || {}),
      selected: true,
      selectedColor: THEME.colors.primary,
    };
    return marked;
  }, [eventsByDate, selectedDate]);

  const dayEvents = eventsByDate[selectedDate] || [];

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: THEME.colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text
          style={{
            marginTop: 12,
            color: THEME.colors.text.secondary,
            fontWeight: "600",
          }}
        >
          {t("events.loadingEvents")}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: THEME.colors.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "800",
              color: THEME.colors.text.primary,
            }}
          >
            {t("events.title")}
          </Text>
          <View
            style={{
              width: 40,
              height: 3,
              backgroundColor: THEME.colors.sacred.saffron,
              marginTop: 4,
              borderRadius: 2,
            }}
          />
        </View>

        <Pressable
          onPress={() => setFilterOpen(!filterOpen)}
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: THEME.colors.surface,
            borderWidth: 2,
            borderColor: THEME.colors.border.light,
            justifyContent: "center",
            alignItems: "center",
            ...THEME.shadows.sm,
          }}
        >
          <Ionicons
            name={filterOpen ? "close" : "filter"}
            size={20}
            color={THEME.colors.primary}
          />
        </Pressable>
      </View>

      {/* Push Notifications Toggle */}
      <Card>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <Text style={{ fontSize: 20, marginRight: 8 }}>🔔</Text>
              <Text
                style={{
                  fontWeight: "800",
                  fontSize: 16,
                  color: THEME.colors.text.primary,
                }}
              >
                {t("events.notifications")}
              </Text>
            </View>
            <Text
              style={{
                color: THEME.colors.text.secondary,
                fontSize: 13,
              }}
            >
              {t("events.notifyDescription")}
            </Text>
          </View>

          <Pressable
            onPress={toggleNotifications}
            disabled={notifLoading}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: THEME.borderRadius.md,
              backgroundColor: notifEnabled
                ? THEME.colors.success
                : THEME.colors.error,
              opacity: notifLoading ? 0.6 : 1,
              ...THEME.shadows.sm,
            }}
          >
            <Text
              style={{
                color: THEME.colors.text.inverse,
                fontWeight: "800",
              }}
            >
              {notifLoading
                ? "..."
                : notifEnabled
                  ? t("events.enabled")
                  : t("events.disabled")}
            </Text>
          </Pressable>
        </View>
      </Card>

      {/* Collapsible Filters */}
      {filterOpen && (
        <Animated.View style={{ marginTop: 12, opacity: fadeAnim }}>
          <Card>
            <Text
              style={{
                fontWeight: "800",
                marginBottom: 12,
                fontSize: 16,
                color: THEME.colors.text.primary,
              }}
            >
              {t("common.filters")}
            </Text>

            <Text
              style={{
                fontWeight: "700",
                marginBottom: 8,
                color: THEME.colors.text.secondary,
              }}
            >
              {t("events.type")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 12,
              }}
            >
              {TYPES.map((t) => (
                <FilterChip
                  key={t}
                  label={t}
                  active={type === t}
                  onPress={() => setType(t)}
                />
              ))}
            </View>

            <Text
              style={{
                fontWeight: "700",
                marginBottom: 8,
                color: THEME.colors.text.secondary,
              }}
            >
              {t("events.scope")}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {SCOPES.map((s) => (
                <FilterChip
                  key={s}
                  label={s}
                  active={scope === s}
                  onPress={() => setScope(s)}
                />
              ))}
            </View>

            <Button
              onPress={load}
              title={t("common.refresh")}
              style={{ marginTop: 16 }}
            />
          </Card>
        </Animated.View>
      )}

      <TempleDivider ornamental style={{ marginVertical: 20 }} />

      {/* Calendar */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <Calendar
          markedDates={markedDates}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          theme={{
            backgroundColor: THEME.colors.surface,
            calendarBackground: THEME.colors.surface,
            textSectionTitleColor: THEME.colors.text.secondary,
            selectedDayBackgroundColor: THEME.colors.primary,
            selectedDayTextColor: THEME.colors.text.inverse,
            todayTextColor: THEME.colors.primary,
            dayTextColor: THEME.colors.text.primary,
            textDisabledColor: THEME.colors.text.tertiary,
            dotColor: THEME.colors.sacred.saffron,
            selectedDotColor: THEME.colors.text.inverse,
            arrowColor: THEME.colors.primary,
            monthTextColor: THEME.colors.text.primary,
            textDayFontWeight: "600",
            textMonthFontWeight: "800",
            textDayHeaderFontWeight: "700",
          }}
        />
      </Card>

      {/* Selected Day Events */}
      <View style={{ marginTop: 20 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "800",
            color: THEME.colors.text.primary,
            marginBottom: 12,
          }}
        >
          {t("events.eventsOn")} {selectedDate}
        </Text>

        {dayEvents.length === 0 ? (
          <Card>
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
              <Text style={{ fontSize: 48, marginBottom: 8 }}>📅</Text>
              <Text
                style={{
                  color: THEME.colors.text.secondary,
                  fontWeight: "600",
                }}
              >
                {t("events.noEvents")}
              </Text>
            </View>
          </Card>
        ) : (
          dayEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const FilterChip = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={{
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: THEME.borderRadius.full,
      borderWidth: 2,
      borderColor: active ? THEME.colors.primary : THEME.colors.border.medium,
      backgroundColor: active ? THEME.colors.primary : THEME.colors.surface,
    }}
  >
    <Text
      style={{
        fontWeight: "700",
        fontSize: 13,
        color: active ? THEME.colors.text.inverse : THEME.colors.text.primary,
      }}
    >
      {label}
    </Text>
  </Pressable>
);

const EventCard = ({ event, index }: { event: EventItem; index: number }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 100,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const hasDescription = event.description && event.description.trim() !== '';

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        marginBottom: 12,
      }}
    >
      <Card style={{ paddingBottom: hasDescription ? 16 : 8 }}>
        {event.imageUrl && (
          <Image
            source={{ uri: event.imageUrl }}
            style={{
              width: "100%",
              height: 160,
              borderRadius: THEME.borderRadius.md,
              marginBottom: 12,
            }}
            resizeMode="cover"
          />
        )}

        <Text
          style={{
            fontSize: 17,
            fontWeight: "800",
            color: THEME.colors.text.primary,
            marginBottom: 6,
          }}
        >
          {event.title}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: THEME.colors.text.secondary,
              marginRight: 8,
            }}
          >
            {event.weekday}
          </Text>
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: THEME.colors.text.tertiary,
              marginRight: 8,
            }}
          />
          <Text
            style={{
              fontSize: 13,
              color: THEME.colors.text.secondary,
            }}
          >
            {event.tithi}
          </Text>
        </View>

        {event.location && event.location.trim() !== '' && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Ionicons
              name="location-outline"
              size={16}
              color={THEME.colors.primary}
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                fontSize: 14,
                color: THEME.colors.text.primary,
                fontWeight: "600",
              }}
            >
              {event.location}
            </Text>
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            rowGap: 8,
            columnGap: 8,
          }}
        >
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: THEME.borderRadius.sm,
              backgroundColor: THEME.colors.overlay,
            }}
          >
            <Text
              style={{
                color: THEME.colors.primary,
                fontWeight: "700",
                fontSize: 12,
              }}
            >
              {event.type}
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: THEME.borderRadius.sm,
              backgroundColor: THEME.colors.overlay,
            }}
          >
            <Text
              style={{
                color: THEME.colors.primary,
                fontWeight: "700",
                fontSize: 12,
              }}
            >
              {event.scope}
            </Text>
          </View>
        </View>

        {hasDescription && (
          <Text
            style={{
              color: THEME.colors.text.secondary,
              lineHeight: 20,
              fontSize: 14,
              marginTop: 12,
            }}
          >
            {event.description}
          </Text>
        )}
      </Card>
    </Animated.View>
  );
};
