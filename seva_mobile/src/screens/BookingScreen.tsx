import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import auth from "@react-native-firebase/auth";
import { useTranslation } from "react-i18next";
import { api } from "../services/backend";
import { useAppConfig } from "../context/ConfigContext";
import { useLegal } from "../context/LegalContext";
import DisabledModule from "../components/DisabledModule";
import LegalModal from "../components/LegalModal";
import { THEME } from "../theme/Theme";
import { Card, TempleDivider } from "../components/Card";
import { Button } from "../components/Button";

type RoomBookingReq = {
  name: string;
  mobile: string;
  email?: string;
  peopleCount: number;
  checkInDate: string;
  notes?: string;
  consentToStore: boolean;
};

export default function BookingScreen() {
  const { t } = useTranslation();
  const { config } = useAppConfig();
  const { legal } = useLegal();
  const user = auth().currentUser;

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState(user?.phoneNumber || "");
  const [email, setEmail] = useState("");
  const [peopleCount, setPeopleCount] = useState("1");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [consent, setConsent] = useState(false);
  const [showConsentInfo, setShowConsentInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (config && !config.enableRoomBooking)
    return <DisabledModule name={t('screens.booking')} />;

  const canSubmit = useMemo(() => {
    if (!name.trim()) return false;
    if (!/^\+?\d{10,15}$/.test(mobile.replace(/\s/g, ""))) return false;
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) return false;
    const pc = Number(peopleCount);
    if (!Number.isFinite(pc) || pc <= 0 || pc > 20) return false;
    return true;
  }, [name, mobile, email, peopleCount]);

  const submit = async () => {
    if (!canSubmit) return Alert.alert(t('booking.invalidData'), t('booking.fillValidDetails'));

    setLoading(true);
    try {
      const payload: RoomBookingReq = {
        name: consent ? name.trim() : "(no consent)",
        mobile: mobile.trim(),
        email: consent ? email.trim() || undefined : undefined,
        peopleCount: Number(peopleCount),
        checkInDate: date.toISOString().slice(0, 10),
        notes: consent ? notes.trim() || undefined : "(no consent)",
        consentToStore: consent,
      };

      const res = await api<{ bookingId: string; status: string }>(
        "/api/room-bookings",
        "POST",
        payload,
      );

      Alert.alert(
        t('booking.submitted'),
        `${t('booking.bookingId')}: ${res.bookingId}\n${t('booking.bookingStatus')}: ${res.status}`,
      );

      setName("");
      setEmail("");
      setNotes("");
      setPeopleCount("1");
    } catch (e: any) {
      console.log("Room booking error:", e?.message || e);
      Alert.alert(t('errors.error'), e?.message || "Failed to submit booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: THEME.colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
          {/* Header */}
          <Card style={{
            borderTopWidth: 6,
            borderTopColor: THEME.colors.sacred.turmeric,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: THEME.colors.overlay,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
                <Text style={{ fontSize: 24 }}>🏨</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 22,
                  fontWeight: '800',
                  color: THEME.colors.text.primary,
                }}>
                  {t('booking.title')}
                </Text>
              </View>
            </View>
            <Text style={{
              color: THEME.colors.text.secondary,
              lineHeight: 20,
            }}>
              {t('booking.description')}
            </Text>
          </Card>

          <TempleDivider ornamental style={{ marginVertical: 16 }} />

          {/* Guest Details */}
          <Card>
            <Text style={{
              fontSize: 18,
              fontWeight: '800',
              color: THEME.colors.text.primary,
              marginBottom: 16,
            }}>
              {t('booking.guestDetails')}
            </Text>
            <Field
              label={`${t('profile.fullName')} *`}
              value={name}
              onChange={setName}
            />
            <Field
              label={`${t('sevas.mobile')} *`}
              value={mobile}
              onChange={setMobile}
              keyboardType="phone-pad"
            />
            <Field
              label={`${t('profile.email')} ${t('booking.optional')}`}
              value={email}
              onChange={setEmail}
              keyboardType="email-address"
            />
          </Card>

          {/* Booking Details */}
          <Card style={{ marginTop: 12 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '800',
              color: THEME.colors.text.primary,
              marginBottom: 16,
            }}>
              {t('booking.bookingDetails')}
            </Text>
            
            <Field
              label={`${t('booking.numberOfPeople')} * ${t('booking.peopleRange')}`}
              value={peopleCount}
              onChange={setPeopleCount}
              keyboardType="number-pad"
            />

            <Text style={{
              fontWeight: '800',
              marginTop: 12,
              marginBottom: 8,
              color: THEME.colors.text.primary,
            }}>
              {t('booking.checkInDate')} *
            </Text>
            <Pressable
              onPress={() => setShowPicker(true)}
              style={{
                borderWidth: 2,
                borderColor: THEME.colors.border.medium,
                borderRadius: THEME.borderRadius.md,
                padding: 12,
                backgroundColor: THEME.colors.surface,
              }}
            >
              <Text style={{
                fontWeight: '700',
                color: THEME.colors.text.primary,
              }}>
                📅  {date.toDateString()}
              </Text>
            </Pressable>

            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowPicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}

            <Text style={{
              fontWeight: '800',
              marginTop: 12,
              marginBottom: 8,
              color: THEME.colors.text.primary,
            }}>
              {t('booking.notes')} {t('booking.optional')}
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder={t('booking.notesPlaceholder')}
              placeholderTextColor={THEME.colors.text.tertiary}
              multiline
              style={{
                borderWidth: 2,
                borderColor: THEME.colors.border.medium,
                borderRadius: THEME.borderRadius.md,
                padding: 12,
                minHeight: 90,
                backgroundColor: THEME.colors.surface,
                textAlignVertical: "top",
                color: THEME.colors.text.primary,
              }}
            />
          </Card>

          {/* Consent */}
          <Card style={{ marginTop: 12 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '800',
              color: THEME.colors.text.primary,
              marginBottom: 12,
            }}>
              {t('booking.consent')}
            </Text>
            
            <Pressable
              onPress={() => setConsent((v) => !v)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <View style={{
                width: 24,
                height: 24,
                borderWidth: 2,
                borderColor: THEME.colors.primary,
                backgroundColor: consent 
                  ? THEME.colors.primary 
                  : "transparent",
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {consent && (
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '900' }}>✓</Text>
                )}
              </View>
              <Text style={{
                fontWeight: '700',
                flex: 1,
                color: THEME.colors.text.primary,
              }}>
                {legal?.consentText || t('booking.allowDataStorage')}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setShowConsentInfo(true)}
              style={{ marginBottom: 8 }}
            >
              <Text style={{
                color: THEME.colors.primary,
                fontWeight: '600',
              }}>
                ℹ️  {t('consent.dataConsentInfo')}
              </Text>
            </Pressable>

            <Text style={{
              color: THEME.colors.text.secondary,
              fontSize: 13,
            }}>
              {t('booking.minimalStorage')}
            </Text>
          </Card>

          {/* Submit Button */}
          <Button
            onPress={submit}
            title={t('booking.submitRequest')}
            disabled={!canSubmit || loading}
            loading={loading}
            style={{ marginTop: 16 }}
          />
        </Animated.View>
      </ScrollView>

      <LegalModal
        visible={showConsentInfo}
        title={t('consent.dataConsentInfo')}
        body={legal?.consentText || "Consent information not available."}
        onClose={() => setShowConsentInfo(false)}
      />
    </>
  );
}

const Field = ({
  label,
  value,
  onChange,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboardType?: any;
}) => (
  <View style={{ marginTop: 12 }}>
    <Text style={{
      fontWeight: '800',
      marginBottom: 8,
      color: THEME.colors.text.primary,
    }}>
      {label}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      keyboardType={keyboardType}
      placeholderTextColor={THEME.colors.text.tertiary}
      style={{
        borderWidth: 2,
        borderColor: THEME.colors.border.medium,
        borderRadius: THEME.borderRadius.md,
        padding: 12,
        backgroundColor: THEME.colors.surface,
        color: THEME.colors.text.primary,
      }}
    />
  </View>
);