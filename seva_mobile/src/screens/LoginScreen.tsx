import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useLegal } from "../context/LegalContext";
import LegalModal from "../components/LegalModal";
import { sendOtp, confirmOtp } from "../services/phoneAuth";
import { OTP_MODE } from "../config/appMode";
import { THEME } from "../theme/Theme";
import { Button } from "../components/Button";
import { Card, TempleDivider } from "../components/Card";

const TEST_NUMBERS = ["+919999999999", "+918888888888"];

export default function LoginScreen() {
  const { t } = useTranslation();
  const { content } = useLegal();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [loading, setLoading] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [confirm, setConfirm] = useState<any>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoAnim, {
          toValue: 1.15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const isValidPhone = (p: string) => /^\+91\d{10}$/.test(p);

  const requestOtp = async () => {
    const normalized = phone.trim();

    if (!acceptedPrivacy || !acceptedTerms) {
      Alert.alert(
        t("login.title"),
        "Please accept Privacy Policy and Terms & Conditions before login.",
      );
      return;
    }

    if (!isValidPhone(normalized)) {
      Alert.alert(
        "Invalid phone",
        `Enter phone in format ${t("login.phoneFormat")}`,
      );
      return;
    }
    setLoading(true);
    try {
      const confirmation = await sendOtp(normalized);
      setConfirm(confirmation);
      setStep("OTP");
      Alert.alert("OTP Sent", "Check your SMS for the OTP.");
    } catch (e: any) {
      console.log("OTP error:", e?.message || e);
      if (OTP_MODE === "demo" && e?.message?.includes("Demo mode")) {
        Alert.alert("Demo Mode", e.message);
      } else {
        Alert.alert("OTP Failed", e?.message || "Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!confirm) {
      Alert.alert(t("errors.error"), "Verification not started.");
      return;
    }
    if (!/^\d{6}$/.test(otp.trim())) {
      Alert.alert("Invalid OTP", "Enter 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      await confirmOtp(confirm, otp.trim());
      if (OTP_MODE === "demo") {
        console.log("Demo mode: Login successful");
      }
    } catch (e: any) {
      console.log("Verify error:", e?.message || e);
      Alert.alert("OTP Invalid", e?.message || t("errors.tryAgain"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: THEME.colors.background,
          position: "relative",
        }}
      >
        {/* Decorative background pattern */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 200,
            backgroundColor: THEME.colors.primary,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            opacity: 0.1,
          }}
        />

        <Animated.View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingVertical: 16,
            justifyContent: "center",
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Demo Mode Indicator */}
          {OTP_MODE === "demo" && (
            <Card
              style={{
                marginBottom: 12,
                backgroundColor: "#FEF3C7",
                paddingVertical: 8,
                paddingHorizontal: 12,
              }}
              withBorder={false}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#92400E",
                  textAlign: "center",
                }}
              >
                🧪 Demo Mode
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: "#B45309",
                  marginTop: 2,
                  textAlign: "center",
                }}
              >
                Use test numbers.
              </Text>
            </Card>
          )}

          {/* Temple Logo & Header */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Animated.View
              style={{
                width: 70,
                height: 70,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
                transform: [{ scale: logoAnim }],
              }}
            >
              <Text
                style={{ fontSize: 36, color: THEME.colors.sacred.saffron }}
              >
                <Image
                  source={require("../../assets/logo.png")}
                  style={{
                    width: "100%",
                    height: 180,
                  }}
                  resizeMode="contain"
                />
              </Text>
            </Animated.View>

            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: THEME.colors.text.primary,
                textAlign: "center",
                marginBottom: 4,
              }}
            >
              Welcome to
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: THEME.colors.primary,
                textAlign: "center",
              }}
            >
              Sri Sode Vadiraja Matha
            </Text>

            <TempleDivider ornamental style={{ marginTop: 12, width: "60%" }} />
          </View>

          {step === "PHONE" ? (
            <Card>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: THEME.colors.text.primary,
                  marginBottom: 6,
                }}
              >
                {t("login.title")}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: THEME.colors.text.secondary,
                  marginBottom: 12,
                }}
              >
                {t("login.enterPhone")}{" "}
                <Text style={{ fontWeight: "700" }}>
                  {t("login.phoneFormat")}
                </Text>
              </Text>

              {OTP_MODE === "demo" && (
                <View
                  style={{
                    backgroundColor: "#DBEAFE",
                    borderRadius: 8,
                    padding: 8,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#1E40AF",
                      fontWeight: "600",
                    }}
                  >
                    Test Numbers:
                  </Text>
                  {TEST_NUMBERS.map((num) => (
                    <Pressable
                      key={num}
                      onPress={() => setPhone(num)}
                      style={{ marginTop: 3 }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          color: "#2563EB",
                          textDecorationLine: "underline",
                        }}
                      >
                        {num}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}

              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder={t("login.phoneFormat")}
                keyboardType="phone-pad"
                autoCapitalize="none"
                placeholderTextColor={THEME.colors.text.tertiary}
                style={{
                  borderWidth: 2,
                  borderColor: THEME.colors.border.medium,
                  borderRadius: THEME.borderRadius.md,
                  padding: 10,
                  fontSize: 15,
                  backgroundColor: THEME.colors.surface,
                  marginBottom: 12,
                }}
              />

              <View style={{ marginBottom: 12, gap: 8 }}>
                <Pressable onPress={() => setShowPrivacy(true)}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: THEME.colors.primary,
                      fontWeight: "600",
                    }}
                  >
                    {t("login.readPrivacy")}
                  </Text>
                </Pressable>

                <Pressable onPress={() => setShowTerms(true)}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: THEME.colors.primary,
                      fontWeight: "600",
                    }}
                  >
                    {t("login.readTerms")}
                  </Text>
                </Pressable>

                <CheckBox
                  checked={acceptedPrivacy}
                  onToggle={() => setAcceptedPrivacy((v) => !v)}
                  label={t("login.acceptPrivacy")}
                />

                <CheckBox
                  checked={acceptedTerms}
                  onToggle={() => setAcceptedTerms((v) => !v)}
                  label={t("login.acceptTerms")}
                />
              </View>

              <Button
                onPress={requestOtp}
                title={t("login.sendOtp")}
                loading={loading}
                disabled={loading}
              />
            </Card>
          ) : (
            <Card>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: THEME.colors.text.primary,
                  marginBottom: 6,
                }}
              >
                Verify OTP
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: THEME.colors.text.secondary,
                  marginBottom: 12,
                }}
              >
                {t("login.enterOtp")}{" "}
                <Text style={{ fontWeight: "700" }}>{phone}</Text>
              </Text>

              {OTP_MODE === "demo" && (
                <View
                  style={{
                    backgroundColor: "#DBEAFE",
                    borderRadius: 8,
                    padding: 8,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#1E40AF",
                      fontWeight: "600",
                    }}
                  >
                    Demo OTP: <Text style={{ fontWeight: "800" }}>123456</Text>
                  </Text>
                </View>
              )}

              <TextInput
                value={otp}
                onChangeText={setOtp}
                placeholder="6-digit OTP"
                keyboardType="number-pad"
                maxLength={6}
                placeholderTextColor={THEME.colors.text.tertiary}
                style={{
                  borderWidth: 2,
                  borderColor: THEME.colors.border.medium,
                  borderRadius: THEME.borderRadius.md,
                  padding: 10,
                  fontSize: 18,
                  letterSpacing: 6,
                  textAlign: "center",
                  backgroundColor: THEME.colors.surface,
                  marginBottom: 12,
                  fontWeight: "700",
                }}
              />

              <Button
                onPress={verifyOtp}
                title={t("login.verifyOtp")}
                loading={loading}
                disabled={loading}
              />

              <Pressable
                onPress={() => setStep("PHONE")}
                style={{ marginTop: 12, alignItems: "center" }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    color: THEME.colors.primary,
                    fontWeight: "600",
                  }}
                >
                  {t("login.changeNumber")}
                </Text>
              </Pressable>
            </Card>
          )}
        </Animated.View>

        <LegalModal
          visible={showPrivacy}
          title={t("consent.privacyPolicy")}
          body={content?.privacyPolicy || "Privacy Policy not available."}
          onClose={() => setShowPrivacy(false)}
        />

        <LegalModal
          visible={showTerms}
          title={t("consent.termsConditions")}
          body={content?.termsAndConditions || "Terms & Conditions not available."}
          onClose={() => setShowTerms(false)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const CheckBox = ({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) => (
  <Pressable
    onPress={onToggle}
    style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
  >
    <View
      style={{
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: THEME.colors.primary,
        backgroundColor: checked ? THEME.colors.primary : "transparent",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {checked && <Ionicons name="checkmark" size={14} color="white" />}
    </View>
    <Text style={{ flex: 1, fontSize: 13, color: THEME.colors.text.primary }}>
      {label}
    </Text>
  </Pressable>
);