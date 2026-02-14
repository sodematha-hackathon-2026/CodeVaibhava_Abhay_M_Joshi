import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import auth from "@react-native-firebase/auth";
import { useTranslation } from "react-i18next";
import { upsertUserProfile, UserProfile } from "../services/profileService";
import { useLegal } from "../context/LegalContext";
import LegalModal from "./LegalModal";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingData: UserProfile | null;
};

export default function DevoteeRegistrationModal({
  visible,
  onClose,
  onSuccess,
  existingData,
}: Props) {
  const { t } = useTranslation();
  const { legal } = useLegal();
  const user = auth().currentUser;
  const insets = useSafeAreaInsets();

  const [saving, setSaving] = useState(false);
  const [showConsentInfo, setShowConsentInfo] = useState(false);

  const [consentToStore, setConsentToStore] = useState(false);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [wantsUpdates, setWantsUpdates] = useState(false);
  const [wantsToVolunteer, setWantsToVolunteer] = useState(false);

  useEffect(() => {
    if (!visible) return;

    if (existingData?.consentToStore) {
      setConsentToStore(true);
      setAddressLine1(existingData.addressLine1 || "");
      setAddressLine2(existingData.addressLine2 || "");
      setCity(existingData.city || "");
      setState(existingData.state || "");
      setPincode(existingData.pincode || "");
      setWantsUpdates(existingData.wantsUpdates || false);
      setWantsToVolunteer(existingData.wantsToVolunteer || false);
    } else {
      setConsentToStore(false);
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setState("");
      setPincode("");
      setWantsUpdates(false);
      setWantsToVolunteer(false);
    }
  }, [visible, existingData]);

  const save = async () => {
    if (!user) return;

    if (!consentToStore) {
      Alert.alert(t('devoteeRegistration.consentRequired'), t('devoteeRegistration.provideConsent'));
      return;
    }

    if (!addressLine1.trim() || !city.trim() || !state.trim()) {
      Alert.alert(t('devoteeRegistration.requiredFields'), t('devoteeRegistration.fillRequired'));
      return;
    }

    if (pincode.trim() && !/^\d{6}$/.test(pincode.trim())) {
      Alert.alert(t('devoteeRegistration.invalidPincode'), t('devoteeRegistration.validPincode'));
      return;
    }

    setSaving(true);
    try {
      const payload: UserProfile = {
        uid: user.uid,
        phone: user.phoneNumber || "",
        fullName: existingData?.fullName || "",
        email: existingData?.email || "",
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        consentToStore: true,
        wantsUpdates,
        wantsToVolunteer,
      };

      await upsertUserProfile(payload);

      Alert.alert(
        t('devoteeRegistration.success'),
        existingData?.consentToStore
          ? t('devoteeRegistration.registrationUpdated')
          : t('devoteeRegistration.welcome')
      );

      onSuccess();
    } catch (e: any) {
      console.log("Devotee registration error:", e?.message || e);
      Alert.alert(t('devoteeRegistration.error'), e?.message || t('devoteeRegistration.failedToSave'));
    } finally {
      setSaving(false);
    }
  };

  const removeRegistration = async () => {
    if (!user) return;

    Alert.alert(
      t('devoteeRegistration.removeConfirm'),
      t('devoteeRegistration.removeMessage'),
      [
        { text: t('common.cancel'), style: "cancel" },
        {
          text: t('common.yes'),
          style: "destructive",
          onPress: async () => {
            setSaving(true);
            try {
              const payload: UserProfile = {
                uid: user.uid,
                phone: user.phoneNumber || "",
                fullName: existingData?.fullName || "",
                email: existingData?.email || "",
                addressLine1: undefined,
                addressLine2: undefined,
                city: undefined,
                state: undefined,
                pincode: undefined,
                consentToStore: false,
                wantsUpdates: false,
                wantsToVolunteer: false,
              };

              await upsertUserProfile(payload);
              Alert.alert(t('devoteeRegistration.removed'), t('devoteeRegistration.removedSuccess'));
              onSuccess();
            } catch (e: any) {
              console.log("Remove registration error:", e?.message || e);
              Alert.alert(t('devoteeRegistration.error'), e?.message || "Failed to remove registration");
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <Modal 
        visible={visible} 
        animationType="slide" 
        presentationStyle="fullScreen"
        onRequestClose={onClose}
      >
        <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
          <StatusBar style="dark" />
          
          {/* Header with Safe Area */}
          <View style={{ 
            paddingTop: Platform.OS === 'ios' ? insets.top : RNStatusBar.currentHeight || 0,
            backgroundColor: "white"
          }}>
            <View
              style={{
                padding: 16,
                backgroundColor: "white",
                borderBottomWidth: 1,
                borderColor: "#E5E7EB",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "900" }}>
                {existingData?.consentToStore
                  ? t('devoteeRegistration.editTitle')
                  : t('devoteeRegistration.title')}
              </Text>
              <Pressable onPress={onClose}>
                <Ionicons name="close" size={24} color="#111827" />
              </Pressable>
            </View>
          </View>

          <ScrollView 
            contentContainerStyle={{ 
              padding: 16, 
              paddingBottom: Math.max(insets.bottom, 16) + 100 
            }}
          >
            {/* Data Consent */}
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 16,
                padding: 14,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                marginBottom: 14,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "900" }}>
                {t('devoteeRegistration.dataConsent')}
              </Text>

              <Pressable
                onPress={() => setConsentToStore((v) => !v)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 12,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderWidth: 2,
                    borderColor: "#111827",
                    backgroundColor: consentToStore ? "#111827" : "white",
                    borderRadius: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {consentToStore && (
                    <Ionicons name="checkmark" size={18} color="white" />
                  )}
                </View>
                <Text style={{ fontWeight: "700", flex: 1 }}>
                  {legal?.consentText || t('devoteeRegistration.consentText')}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setShowConsentInfo(true)}
                style={{ marginTop: 8 }}
              >
                <Text style={{ color: "#2563EB", fontWeight: "600" }}>
                  {t('consent.dataConsentInfo')}
                </Text>
              </Pressable>

              <Text style={{ marginTop: 8, color: "#6B7280", fontSize: 13 }}>
                {t('devoteeRegistration.requiredText')}
              </Text>
            </View>

            {/* Address Details */}
            {consentToStore && (
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 16,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  marginBottom: 14,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "900" }}>
                  {t('devoteeRegistration.addressDetails')}
                </Text>
                <Text style={{ marginTop: 6, color: "#6B7280" }}>
                  {t('devoteeRegistration.helpStayConnected')}
                </Text>

                <Field
                  label={`${t('devoteeRegistration.addressLine1')} *`}
                  value={addressLine1}
                  onChange={setAddressLine1}
                />
                <Field
                  label={t('devoteeRegistration.addressLine2')}
                  value={addressLine2}
                  onChange={setAddressLine2}
                />
                <Field
                  label={`${t('devoteeRegistration.city')} *`}
                  value={city}
                  onChange={setCity}
                />
                <Field
                  label={`${t('devoteeRegistration.state')} *`}
                  value={state}
                  onChange={setState}
                />
                <Field
                  label={t('devoteeRegistration.pincode')}
                  value={pincode}
                  onChange={setPincode}
                  keyboardType="number-pad"
                />
              </View>
            )}

            {/* Communication Preferences */}
            {consentToStore && (
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 16,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  marginBottom: 14,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "900" }}>
                  {t('devoteeRegistration.communicationPreferences')}
                </Text>
                <Text style={{ marginTop: 6, color: "#6B7280" }}>
                  {t('devoteeRegistration.chooseConnection')}
                </Text>

                <Pressable
                  onPress={() => setWantsUpdates((v) => !v)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 12,
                    padding: 12,
                    backgroundColor: "#F9FAFB",
                    borderRadius: 12,
                  }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderWidth: 2,
                      borderColor: "#111827",
                      backgroundColor: wantsUpdates ? "#111827" : "white",
                      borderRadius: 4,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {wantsUpdates && (
                      <Ionicons name="checkmark" size={18} color="white" />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "700" }}>
                      {t('devoteeRegistration.receiveUpdates')}
                    </Text>
                    <Text style={{ marginTop: 4, color: "#6B7280", fontSize: 13 }}>
                      {t('devoteeRegistration.receiveUpdatesDesc')}
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => setWantsToVolunteer((v) => !v)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 10,
                    padding: 12,
                    backgroundColor: "#F9FAFB",
                    borderRadius: 12,
                  }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderWidth: 2,
                      borderColor: "#111827",
                      backgroundColor: wantsToVolunteer ? "#111827" : "white",
                      borderRadius: 4,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {wantsToVolunteer && (
                      <Ionicons name="checkmark" size={18} color="white" />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "700" }}>
                      {t('devoteeRegistration.interestedVolunteering')}
                    </Text>
                    <Text style={{ marginTop: 4, color: "#6B7280", fontSize: 13 }}>
                      {t('devoteeRegistration.interestedVolunteeringDesc')}
                    </Text>
                  </View>
                </Pressable>

                <Text style={{ marginTop: 12, color: "#6B7280", fontSize: 13 }}>
                  {t('devoteeRegistration.changeAnytime')}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <Pressable
              onPress={save}
              disabled={saving}
              style={{
                backgroundColor: "#111827",
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
                  {existingData?.consentToStore
                    ? t('devoteeRegistration.updateRegistration')
                    : t('devoteeRegistration.completeRegistration')}
                </Text>
              )}
            </Pressable>

            {existingData?.consentToStore && (
              <Pressable
                onPress={removeRegistration}
                disabled={saving}
                style={{
                  marginTop: 12,
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#DC2626",
                  backgroundColor: "white",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                <Text style={{ fontWeight: "700", color: "#DC2626", fontSize: 16 }}>
                  {t('devoteeRegistration.removeRegistration')}
                </Text>
              </Pressable>
            )}
          </ScrollView>
        </View>
      </Modal>

      <LegalModal
        visible={showConsentInfo}
        title={t('consent.dataConsentInfo')}
        body={legal?.consentText || "Consent information not available."}
        onClose={() => setShowConsentInfo(false)}
      />
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboardType?: any;
}) {
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={{ fontWeight: "700", marginBottom: 6, color: "#374151" }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        placeholderTextColor="#9CA3AF"
        style={{
          borderWidth: 1,
          borderColor: "#D1D5DB",
          borderRadius: 10,
          padding: 12,
          backgroundColor: "white",
          fontSize: 16,
        }}
      />
    </View>
  );
}