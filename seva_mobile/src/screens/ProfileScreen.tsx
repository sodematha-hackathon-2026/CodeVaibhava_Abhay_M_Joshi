import React, { useEffect, useState, useRef } from "react";
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
import auth, { getAuth, signOut } from "@react-native-firebase/auth";
import { useTranslation } from "react-i18next";
import DevoteeRegistrationModal from "../components/DevoteeRegistrationModal";
import { getUserProfile, upsertUserProfile, UserProfile } from "../services/profileService";
import { useAppDispatch } from "../hooks/hook";
import { setLanguage } from "../store/slices/appSlice";
import { AppLanguage } from "../types/language";
import { THEME } from "../theme/Theme";
import { Card, TempleDivider } from "../components/Card";
import { Button } from "../components/Button";

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const user = auth().currentUser;
  const phone = user?.phoneNumber || "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDevoteeModal, setShowDevoteeModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isDevotee, setIsDevotee] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (!loading) {
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
    }
  }, [loading]);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const existing = await getUserProfile(user.uid);
      if (existing) {
        setFullName(existing.fullName || "");
        setEmail(existing.email || "");
        setIsDevotee(!!existing.consentToStore);
        setProfileData(existing);
      }
    } catch (e: any) {
      console.log("Profile load error:", e?.message || e);
    } finally {
      setLoading(false);
    }
  };

  const saveBasicProfile = async () => {
    if (!user) return;
    
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      Alert.alert(t('devoteeRegistration.requiredFields'), "Please enter your full name.");
      return;
    }

    if (trimmedEmail && !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      Alert.alert(t('sevas.invalidDetails'), "Please enter a valid email address.");
      return;
    }

    setSaving(true);
    try {
      const payload: UserProfile = {
        uid: user.uid,
        phone,
        fullName: trimmedName,
        email: trimmedEmail,
        addressLine1: profileData?.addressLine1,
        addressLine2: profileData?.addressLine2,
        city: profileData?.city,
        state: profileData?.state,
        pincode: profileData?.pincode,
        consentToStore: profileData?.consentToStore || false,
        wantsUpdates: profileData?.wantsUpdates || false,
        wantsToVolunteer: profileData?.wantsToVolunteer || false,
      };

      await upsertUserProfile(payload);
      Alert.alert(t('common.save'), "Profile updated successfully.");
      await loadProfile();
    } catch (e: any) {
      console.log("Save error:", e?.message || e);
      Alert.alert(t('errors.error'), e?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  const changeLanguage = (lang: AppLanguage) => {
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
  };

  if (!user) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: THEME.colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🙏</Text>
        <Text style={{
          fontSize: 16,
          color: THEME.colors.text.secondary,
          fontWeight: '600',
        }}>
          {t('login.pleaseLogin')}
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: THEME.colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text style={{
          marginTop: 12,
          color: THEME.colors.text.secondary,
          fontWeight: '600',
        }}>
          {t('profile.loadingProfile')}
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
          {/* Header Card */}
          <Card style={{
            borderTopWidth: 6,
            borderTopColor: THEME.colors.sacred.saffron,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <View style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: THEME.colors.overlay,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
                borderWidth: 3,
                borderColor: THEME.colors.sacred.gold,
              }}>
                <Text style={{ fontSize: 32 }}>🙏</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '800',
                  color: THEME.colors.text.primary,
                }}>
                  {t('profile.title')}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: THEME.colors.text.secondary,
                  marginTop: 2,
                }}>
                  Namaste, Devotee
                </Text>
              </View>
            </View>

            <View style={{ gap: 14 }}>
              <InfoRow
                icon="👤"
                label={t('profile.fullName')}
                value={profileData?.fullName || t('common.notProvided')}
                isEmpty={!profileData?.fullName}
              />
              
              <InfoRow
                icon="📱"
                label={t('profile.phoneNumber')}
                value={phone}
              />
              
              <InfoRow
                icon="📧"
                label={t('profile.email')}
                value={profileData?.email || t('common.notProvided')}
                isEmpty={!profileData?.email}
              />
              
              {isDevotee && profileData?.city && (
                <InfoRow
                  icon="📍"
                  label={t('profile.location')}
                  value={`${profileData.city}${profileData.state ? `, ${profileData.state}` : ''}`}
                />
              )}
              
              <View style={{
                marginTop: 8,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: THEME.colors.border.light,
                flexDirection: "row",
                alignItems: "center",
              }}>
                <Text style={{ fontSize: 22, marginRight: 12 }}>
                  {isDevotee ? "✅" : "⭕"}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 13,
                    color: THEME.colors.text.secondary,
                    marginBottom: 4,
                  }}>
                    {t('profile.status')}
                  </Text>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '800',
                    color: isDevotee 
                      ? THEME.colors.success 
                      : THEME.colors.warning,
                  }}>
                    {isDevotee ? t('profile.registeredDevotee') : t('profile.notRegistered')}
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          <TempleDivider ornamental style={{ marginVertical: 20 }} />

          {/* Language Selection */}
          <Card>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: THEME.colors.overlay,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
                <Text style={{ fontSize: 20 }}>🌐</Text>
              </View>
              <Text style={{
                fontSize: 18,
                fontWeight: '800',
                color: THEME.colors.text.primary,
              }}>
                {t('profile.language')} / {t('profile.languageKannada')}
              </Text>
            </View>
            
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Pressable
                onPress={() => changeLanguage('en')}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: THEME.borderRadius.md,
                  alignItems: "center",
                  backgroundColor: i18n.language === 'en' 
                    ? THEME.colors.primary 
                    : THEME.colors.surface,
                  borderWidth: 2,
                  borderColor: i18n.language === 'en' 
                    ? THEME.colors.sacred.gold 
                    : THEME.colors.border.medium,
                }}
              >
                <Text style={{
                  fontWeight: '700',
                  fontSize: 15,
                  color: i18n.language === 'en' 
                    ? THEME.colors.text.inverse 
                    : THEME.colors.text.primary,
                }}>
                  English
                </Text>
              </Pressable>

              <Pressable
                onPress={() => changeLanguage('kn')}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: THEME.borderRadius.md,
                  alignItems: "center",
                  backgroundColor: i18n.language === 'kn' 
                    ? THEME.colors.primary 
                    : THEME.colors.surface,
                  borderWidth: 2,
                  borderColor: i18n.language === 'kn' 
                    ? THEME.colors.sacred.gold 
                    : THEME.colors.border.medium,
                }}
              >
                <Text style={{
                  fontWeight: '700',
                  fontSize: 15,
                  color: i18n.language === 'kn' 
                    ? THEME.colors.text.inverse 
                    : THEME.colors.text.primary,
                }}>
                  ಕನ್ನಡ
                </Text>
              </Pressable>
            </View>
          </Card>

          {/* Basic Info Edit */}
          <Card style={{ marginTop: 16 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '800',
              color: THEME.colors.text.primary,
              marginBottom: 16,
            }}>
              {t('profile.editBasicInfo')}
            </Text>

            <Field
              label={`${t('profile.fullName')} *`}
              value={fullName}
              onChange={setFullName}
              placeholder="Enter your full name"
            />
            <Field
              label={t('profile.emailAddress')}
              value={email}
              onChange={setEmail}
              keyboardType="email-address"
              placeholder="your.email@example.com"
            />

            <Button
              onPress={saveBasicProfile}
              title={t('common.saveChanges')}
              loading={saving}
              disabled={saving}
              style={{ marginTop: 16 }}
            />
          </Card>

          {/* Devotee Registration */}
          <View style={{
            marginTop: 16,
            backgroundColor: isDevotee 
              ? '#ECFDF5' 
              : '#FEF3C7',
            borderRadius: THEME.borderRadius.lg,
            padding: 16,
            borderWidth: 3,
            borderColor: isDevotee 
              ? THEME.colors.success 
              : THEME.colors.warning,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: isDevotee 
                  ? THEME.colors.success 
                  : THEME.colors.warning,
                marginRight: 12,
              }} />
              <Text style={{
                fontSize: 18,
                fontWeight: '800',
                color: THEME.colors.text.primary,
              }}>
                {t('profile.devoteeRegistration')}
              </Text>
            </View>

            {isDevotee ? (
              <>
                <Text style={{
                  color: '#065F46',
                  fontSize: 15,
                  fontWeight: '600',
                  marginBottom: 8,
                }}>
                  ✓ {t('profile.youAreRegistered')}
                </Text>
                <Text style={{
                  color: '#047857',
                  fontSize: 13,
                  marginBottom: 12,
                }}>
                  {t('profile.youWillReceive')}
                </Text>

                {profileData && (
                  <View style={{
                    padding: 12,
                    backgroundColor: 'white',
                    borderRadius: THEME.borderRadius.md,
                    borderWidth: 1,
                    borderColor: '#D1FAE5',
                    marginBottom: 12,
                  }}>
                    <Text style={{
                      fontSize: 13,
                      fontWeight: '700',
                      color: '#065F46',
                      marginBottom: 8,
                    }}>
                      {t('profile.registrationDetails')}
                    </Text>
                    
                    {profileData.addressLine1 && (
                      <View style={{ marginTop: 6 }}>
                        <Text style={{
                          fontSize: 13,
                          color: '#047857',
                          fontWeight: '600',
                        }}>
                          📍 {t('profile.address')}:
                        </Text>
                        <Text style={{
                          fontSize: 13,
                          color: '#047857',
                          marginLeft: 20,
                          marginTop: 2,
                        }}>
                          {profileData.addressLine1}
                        </Text>
                        {profileData.addressLine2 && (
                          <Text style={{
                            fontSize: 13,
                            color: '#047857',
                            marginLeft: 20,
                          }}>
                            {profileData.addressLine2}
                          </Text>
                        )}
                        <Text style={{
                          fontSize: 13,
                          color: '#047857',
                          marginLeft: 20,
                        }}>
                          {profileData.city}, {profileData.state} - {profileData.pincode}
                        </Text>
                      </View>
                    )}
                    
                    <View style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: 8,
                    }}>
                      <View style={{
                        backgroundColor: profileData.wantsUpdates ? '#D1FAE5' : '#F3F4F6',
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: THEME.borderRadius.sm,
                      }}>
                        <Text style={{ fontSize: 12, color: '#047857' }}>
                          📧 {t('profile.updates')}: {profileData.wantsUpdates ? t('common.on') : t('common.off')}
                        </Text>
                      </View>
                      
                      <View style={{
                        backgroundColor: profileData.wantsToVolunteer ? '#D1FAE5' : '#F3F4F6',
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: THEME.borderRadius.sm,
                      }}>
                        <Text style={{ fontSize: 12, color: '#047857' }}>
                          🙏 {t('profile.volunteer')}: {profileData.wantsToVolunteer ? t('common.yes') : t('common.no')}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                <Button
                  onPress={() => setShowDevoteeModal(true)}
                  title={t('profile.editRegistration')}
                  variant="secondary"
                  style={{
                    backgroundColor: THEME.colors.success,
                    borderColor: '#065F46',
                  }}
                />
              </>
            ) : (
              <>
                <Text style={{
                  color: '#92400E',
                  fontSize: 15,
                  fontWeight: '600',
                  marginBottom: 8,
                }}>
                  {t('profile.notRegisteredYet')}
                </Text>
                <Text style={{
                  color: '#B45309',
                  fontSize: 13,
                  marginBottom: 12,
                }}>
                  {t('profile.registerDescription')}
                </Text>

                <Button
                  onPress={() => setShowDevoteeModal(true)}
                  title={t('profile.registerAsDevotee')}
                  icon={<Text style={{ fontSize: 20 }}>🙏</Text>}
                  style={{
                    backgroundColor: THEME.colors.warning,
                    borderColor: '#92400E',
                  }}
                />
              </>
            )}
          </View>

          {/* Logout */}
          <Pressable
            onPress={logout}
            style={{
              marginTop: 16,
              paddingVertical: 14,
              borderRadius: THEME.borderRadius.md,
              alignItems: "center",
              borderWidth: 2,
              borderColor: THEME.colors.error,
              backgroundColor: THEME.colors.surface,
            }}
          >
            <Text style={{
              fontWeight: '700',
              color: THEME.colors.error,
              fontSize: 16,
            }}>
              🚪 {t('common.logout')}
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>

      <DevoteeRegistrationModal
        visible={showDevoteeModal}
        onClose={() => setShowDevoteeModal(false)}
        onSuccess={() => {
          setShowDevoteeModal(false);
          loadProfile();
        }}
        existingData={profileData}
      />
    </>
  );
}

const InfoRow = ({
  icon,
  label,
  value,
  isEmpty = false,
}: {
  icon: string;
  label: string;
  value: string;
  isEmpty?: boolean;
}) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text style={{ fontSize: 20, marginRight: 12 }}>{icon}</Text>
    <View style={{ flex: 1 }}>
      <Text style={{
        fontSize: 12,
        color: THEME.colors.text.tertiary,
        marginBottom: 2,
      }}>
        {label}
      </Text>
      <Text style={{
        fontSize: 15,
        fontWeight: '700',
        color: isEmpty 
          ? THEME.colors.text.tertiary 
          : THEME.colors.text.primary,
        fontStyle: isEmpty ? 'italic' : 'normal',
      }}>
        {value}
      </Text>
    </View>
  </View>
);

const Field = ({
  label,
  value,
  onChange,
  keyboardType,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboardType?: any;
  placeholder?: string;
}) => (
  <View style={{ marginTop: 12 }}>
    <Text style={{
      fontWeight: '700',
      marginBottom: 8,
      color: THEME.colors.text.primary,
    }}>
      {label}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      keyboardType={keyboardType}
      placeholder={placeholder}
      placeholderTextColor={THEME.colors.text.tertiary}
      style={{
        borderWidth: 2,
        borderColor: THEME.colors.border.medium,
        borderRadius: THEME.borderRadius.md,
        padding: 12,
        backgroundColor: THEME.colors.surface,
        fontSize: 15,
        color: THEME.colors.text.primary,
      }}
    />
  </View>
);