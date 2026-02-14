import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SevaStackParamList } from "../navigation/SevaStack";
import auth from "@react-native-firebase/auth";
import { useTranslation } from "react-i18next";
import { getUserProfile, upsertUserProfile } from "../services/profileService";
import { useLegal } from "../context/LegalContext";
import { api } from "../services/backend";
import LegalModal from "../components/LegalModal";
import { THEME } from "../theme/Theme";
import { Card, TempleDivider } from "../components/Card";
import { Button } from "../components/Button";

type Props = NativeStackScreenProps<SevaStackParamList, "SevaForm">;

type FormState = {
  fullName: string;
  mobile: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
};

export default function SevaFormScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { legal } = useLegal();
  const { seva } = route.params;
  const user = auth().currentUser;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [consentToStore, setConsentToStore] = useState(true);
  const [updateProfileAlso, setUpdateProfileAlso] = useState(false);
  const [showConsentInfo, setShowConsentInfo] = useState(false);
  const [initialProfile, setInitialProfile] = useState<FormState | null>(null);
  
  const [form, setForm] = useState<FormState>({
    fullName: "",
    mobile: user?.phoneNumber || "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });
  
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
  }, [loading]);

  useEffect(() => {
    (async () => {
      if (!user) return;

      setLoading(true);
      try {
        const p: any = await getUserProfile(user.uid);

        const filled: FormState = {
          fullName: p?.fullName || "",
          mobile: p?.phone || user.phoneNumber || "",
          email: p?.email || "",
          addressLine1: p?.addressLine1 || "",
          addressLine2: p?.addressLine2 || "",
          city: p?.city || "",
          state: p?.state || "",
          pincode: p?.pincode || "",
        };

        setForm(filled);
        setInitialProfile(filled);
        setConsentToStore(p?.consentToStore ?? true);
      } catch (e: any) {
        console.log("Seva form prefill error:", e?.message || e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const changesDetected = useMemo(() => {
    if (!initialProfile) return false;
    const keys: (keyof FormState)[] = [
      "fullName", "mobile", "email", "addressLine1",
      "addressLine2", "city", "state", "pincode",
    ];
    return keys.some(
      (k) => (initialProfile[k] || "").trim() !== (form[k] || "").trim(),
    );
  }, [initialProfile, form]);

  useEffect(() => {
    if (changesDetected) setUpdateProfileAlso(true);
  }, [changesDetected]);

  const valid = useMemo(() => {
    if (!form.mobile.trim()) return false;

    const normalizedPhone = form.mobile.replace(/\s/g, "");
    if (!/^\+?\d{10,15}$/.test(normalizedPhone)) return false;

    if (consentToStore) {
      if (!form.fullName.trim()) return false;
      if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim()))
        return false;
      if (form.pincode.trim() && !/^\d{6}$/.test(form.pincode.trim()))
        return false;
    }
    return true;
  }, [form, consentToStore]);

  const setField = (k: keyof FormState, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const submit = async () => {
    if (!user) return Alert.alert(t('sevas.loginRequired'));
    if (!valid) return Alert.alert(t('sevas.invalidDetails'), t('sevas.fillValid'));

    setSaving(true);
    try {
      const created = await api<{
        id: string;
        sevaTitle: string;
        amountInPaise: number;
        status: string;
      }>("/api/seva-orders", "POST", {
        sevaId: seva.id,
        consentToStore,
        fullName: form.fullName.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
      });

      if (consentToStore && updateProfileAlso) {
        await upsertUserProfile({
          uid: user.uid,
          phone: form.mobile.trim(),
          consentToStore: true,
          wantsUpdates: true,
          wantsToVolunteer: false,
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          addressLine1: form.addressLine1.trim(),
          addressLine2: form.addressLine2.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
        } as any);
      }

      navigation.replace("SevaPayment", {
        sevaOrderId: created.id,
        amountInPaise: created.amountInPaise,
        sevaTitle: created.sevaTitle,
      });
    } catch (e: any) {
      console.log("Seva submit error:", e?.message || e);
      Alert.alert(t('errors.error'), e?.message || "Failed to create seva order");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: THEME.colors.background,
        alignItems: "center",
        justifyContent: "center",
      }}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text style={{
          marginTop: 12,
          color: THEME.colors.text.secondary,
          fontWeight: '600',
        }}>
          {t('common.loading')}
        </Text>
      </View>
    );
  }

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
          {/* Seva Info Header */}
          <Card style={{
            borderTopWidth: 6,
            borderTopColor: THEME.colors.sacred.saffron,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
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
                <Text style={{ fontSize: 24 }}>🙏</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: '800',
                  color: THEME.colors.text.primary,
                }}>
                  {seva.title}
                </Text>
              </View>
            </View>
            
            {seva.description && (
              <Text style={{
                color: THEME.colors.text.secondary,
                lineHeight: 20,
                marginBottom: 12,
              }}>
                {seva.description}
              </Text>
            )}
            
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: THEME.colors.border.light,
            }}>
              <Text style={{
                fontSize: 14,
                color: THEME.colors.text.secondary,
                marginRight: 8,
              }}>
                Seva Amount:
              </Text>
              <View style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: THEME.borderRadius.md,
                backgroundColor: THEME.colors.overlay,
                borderLeftWidth: 3,
                borderLeftColor: THEME.colors.sacred.gold,
              }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '900',
                  color: THEME.colors.primary,
                }}>
                  ₹ {(seva.amountInPaise / 100).toFixed(2)}
                </Text>
              </View>
            </View>
          </Card>

          <TempleDivider ornamental style={{ marginVertical: 16 }} />

          {/* Consent Section */}
          <Card>
            <Text style={{
              fontSize: 18,
              fontWeight: '800',
              color: THEME.colors.text.primary,
              marginBottom: 12,
            }}>
              {t('sevas.consent')}
            </Text>
            
            <Toggle
              label={legal?.consentText || t('sevas.consentToStore')}
              value={consentToStore}
              onToggle={() => setConsentToStore((v) => !v)}
            />

            <Pressable
              onPress={() => setShowConsentInfo(true)}
              style={{ marginTop: 12 }}
            >
              <Text style={{
                color: THEME.colors.primary,
                fontWeight: '600',
              }}>
                ℹ️  {t('consent.dataConsentInfo')}
              </Text>
            </Pressable>

            <Text style={{
              marginTop: 12,
              color: THEME.colors.text.secondary,
              fontSize: 13,
              lineHeight: 18,
            }}>
              {t('sevas.consentDescription')}
            </Text>
          </Card>

          {/* Devotee Details */}
          <Card style={{ marginTop: 12 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '800',
              color: THEME.colors.text.primary,
              marginBottom: 16,
            }}>
              {t('sevas.devoteeDetails')}
            </Text>

            <Field
              label={`${t('sevas.mobile')} *`}
              value={form.mobile}
              onChange={(v) => setField("mobile", v)}
              keyboardType="phone-pad"
            />

            <Field
              label={consentToStore ? `${t('profile.fullName')} *` : t('profile.fullName')}
              value={form.fullName}
              onChange={(v) => setField("fullName", v)}
              editable={consentToStore}
            />

            <Field
              label={t('profile.email')}
              value={form.email}
              onChange={(v) => setField("email", v)}
              keyboardType="email-address"
              editable={consentToStore}
            />

            <Field
              label={t('devoteeRegistration.addressLine1')}
              value={form.addressLine1}
              onChange={(v) => setField("addressLine1", v)}
              editable={consentToStore}
            />

            <Field
              label={t('devoteeRegistration.addressLine2')}
              value={form.addressLine2}
              onChange={(v) => setField("addressLine2", v)}
              editable={consentToStore}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Field
                  label={t('devoteeRegistration.city')}
                  value={form.city}
                  onChange={(v) => setField("city", v)}
                  editable={consentToStore}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Field
                  label={t('devoteeRegistration.state')}
                  value={form.state}
                  onChange={(v) => setField("state", v)}
                  editable={consentToStore}
                />
              </View>
            </View>

            <Field
              label={t('devoteeRegistration.pincode')}
              value={form.pincode}
              onChange={(v) => setField("pincode", v)}
              keyboardType="number-pad"
              editable={consentToStore}
            />

            {!consentToStore && (
              <View style={{
                marginTop: 12,
                padding: 12,
                backgroundColor: THEME.colors.overlay,
                borderRadius: THEME.borderRadius.md,
                borderLeftWidth: 3,
                borderLeftColor: THEME.colors.warning,
              }}>
                <Text style={{
                  color: THEME.colors.text.secondary,
                  fontSize: 13,
                }}>
                  ⚠️  Enable consent to add full details.
                </Text>
              </View>
            )}
          </Card>

          {/* Profile Update Option */}
          {consentToStore && changesDetected && (
            <Card style={{
              marginTop: 12,
              backgroundColor: '#FEF3C7',
              borderColor: THEME.colors.warning,
              borderWidth: 2,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '800',
                color: THEME.colors.text.primary,
                marginBottom: 12,
              }}>
                {t('sevas.profileUpdate')}
              </Text>
              
              <Toggle
                label={t('sevas.updateProfile')}
                value={updateProfileAlso}
                onToggle={() => setUpdateProfileAlso((v) => !v)}
              />
              
              <Text style={{
                marginTop: 12,
                color: '#92400E',
                fontSize: 13,
              }}>
                ℹ️  {t('sevas.changesDetected')}
              </Text>
            </Card>
          )}

          {/* Submit Button */}
          <Button
            onPress={submit}
            title={t('sevas.proceedToPayment')}
            disabled={!valid || saving}
            loading={saving}
            icon={<Text style={{ fontSize: 20 }}>💳</Text>}
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
  editable = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboardType?: any;
  editable?: boolean;
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
      editable={editable}
      placeholderTextColor={THEME.colors.text.tertiary}
      style={{
        borderWidth: 2,
        borderColor: THEME.colors.border.medium,
        borderRadius: THEME.borderRadius.md,
        padding: 12,
        backgroundColor: editable 
          ? THEME.colors.surface 
          : THEME.colors.border.light,
        color: THEME.colors.text.primary,
        opacity: editable ? 1 : 0.6,
      }}
    />
  </View>
);

const Toggle = ({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) => (
  <Pressable
    onPress={onToggle}
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    }}
  >
    <View style={{
      width: 24,
      height: 24,
      borderWidth: 2,
      borderColor: THEME.colors.primary,
      backgroundColor: value 
        ? THEME.colors.primary 
        : "transparent",
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {value && (
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '900' }}>✓</Text>
      )}
    </View>
    <Text style={{
      fontWeight: '700',
      flex: 1,
      color: THEME.colors.text.primary,
      lineHeight: 20,
    }}>
      {label}
    </Text>
  </Pressable>
);