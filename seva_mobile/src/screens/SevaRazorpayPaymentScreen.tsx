import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
  Animated,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import RazorpayCheckout from "react-native-razorpay";
import { useTranslation } from "react-i18next";
import { api } from "../services/backend";
import { auth } from "../services/firebase";
import type { SevaStackParamList } from "../navigation/SevaStack";
import { THEME } from "../theme/Theme";
import { Card, TempleDivider } from "../components/Card";
import { Button } from "../components/Button";

type Props = NativeStackScreenProps<SevaStackParamList, "SevaPayment">;

type OrderForSevaRes = {
  keyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
};

export default function SevaRazorpayPaymentScreen({
  route,
  navigation,
}: Props) {
  const { t } = useTranslation();
  const { sevaOrderId, amountInPaise, sevaTitle } = route.params;

  const [busy, setBusy] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

        Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const payNow = async () => {
    setBusy(true);
    try {
      const order = await api<OrderForSevaRes>(
        "/api/payments/razorpay/order-for-seva",
        "POST",
        { sevaOrderId },
      );

      const user = auth.currentUser;
      const options: any = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Sri Sode Vadiraja Matha",
        description: `Seva: ${sevaTitle}`,
        order_id: order.razorpayOrderId,
        prefill: {
          email: user?.email || "",
          contact: user?.phoneNumber?.replace("+", "") || "",
        },
        theme: { color: THEME.colors.primary },
      };

      const data = await RazorpayCheckout.open(options);

      const verify = await api<{ verified: boolean }>(
        "/api/payments/razorpay/verify-seva",
        "POST",
        {
          sevaOrderId,
          razorpayPaymentId: data.razorpay_payment_id,
          razorpayOrderId: data.razorpay_order_id,
          razorpaySignature: data.razorpay_signature,
        },
      );

      if (!verify.verified) {
        Alert.alert("Verification failed", "Payment was not verified. Please try again.");
        return;
      }

      Alert.alert(
        t("devoteeRegistration.success"),
        "Payment successful! Seva booked.",
        [{ text: "OK", onPress: () => navigation.popToTop() }],
      );
    } catch (e: any) {
      const desc = e?.description || "";
      const isCancelled =
        desc.includes("cancelled") ||
        desc.includes("Payment cancelled") ||
        e?.code === 2;

      if (isCancelled) {
        Alert.alert("Cancelled", "Payment cancelled.");
        return;
      }

      try {
        const parsed = JSON.parse(desc);
        const rpErr = parsed?.error;
        Alert.alert("Payment failed", rpErr?.reason || rpErr?.description || "Payment failed");
      } catch {
        Alert.alert("Payment failed", desc || "Payment failed");
      }

      console.log("=== PAYMENT ERROR ===", e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: THEME.colors.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
    >
      <Animated.View style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}>
        {/* Payment Header */}
        <Card style={{
          borderTopWidth: 6,
          borderTopColor: THEME.colors.sacred.gold,
          alignItems: 'center',
          paddingVertical: 24,
        }}>
          <Animated.View style={{
            transform: [{ scale: pulseAnim }],
          }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: THEME.colors.overlay,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              borderWidth: 3,
              borderColor: THEME.colors.sacred.gold,
            }}>
              <Text style={{ fontSize: 40 }}>💳</Text>
            </View>
          </Animated.View>
          
          <Text style={{
            fontSize: 22,
            fontWeight: '800',
            color: THEME.colors.text.primary,
            marginBottom: 8,
          }}>
            {t("sevas.razorpayPayment")}
          </Text>
          
          <Text style={{
            color: THEME.colors.text.secondary,
            textAlign: 'center',
            fontSize: 14,
          }}>
            Secure payment via Razorpay
          </Text>
        </Card>

        <TempleDivider ornamental style={{ marginVertical: 20 }} />

        {/* Seva Details */}
        <Card>
          <Text style={{
            fontSize: 18,
            fontWeight: '800',
            color: THEME.colors.text.primary,
            marginBottom: 16,
          }}>
            Seva Details
          </Text>

          <View style={{ gap: 12 }}>
            <DetailRow
              icon="🙏"
              label="Seva"
              value={sevaTitle}
            />
            
            <DetailRow
              icon="💰"
              label="Amount"
              value={`₹ ${(amountInPaise / 100).toFixed(2)}`}
              highlight
            />
            
            <DetailRow
              icon="📄"
              label="Order ID"
              value={sevaOrderId}
            />
          </View>
        </Card>

        {/* Payment Info */}
        <Card style={{
          marginTop: 12,
          backgroundColor: '#FEF3C7',
          borderColor: THEME.colors.warning,
          borderWidth: 2,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
            <Text style={{ fontSize: 24 }}>ℹ️</Text>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontWeight: '700',
                color: '#92400E',
                marginBottom: 6,
              }}>
                Payment Information
              </Text>
              <Text style={{
                color: '#B45309',
                fontSize: 13,
                lineHeight: 18,
              }}>
                {t("sevas.testPayments")}
              </Text>
            </View>
          </View>
        </Card>

        {/* Payment Button */}
        <Button
          onPress={payNow}
          title={t("sevas.payNow")}
          disabled={busy}
          loading={busy}
          icon={<Text style={{ fontSize: 20 }}>💳</Text>}
          style={{ marginTop: 20 }}
        />

        {/* Security Badge */}
        <View style={{
          marginTop: 16,
          alignItems: 'center',
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: THEME.colors.surface,
            borderRadius: THEME.borderRadius.md,
            borderWidth: 1,
            borderColor: THEME.colors.border.light,
          }}>
            <Text style={{ fontSize: 20 }}>🔒</Text>
            <Text style={{
              fontSize: 13,
              color: THEME.colors.text.secondary,
              fontWeight: '600',
            }}>
              Secured by Razorpay
            </Text>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const DetailRow = ({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: string;
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: highlight 
      ? THEME.colors.overlay 
      : 'transparent',
    borderRadius: THEME.borderRadius.md,
    borderLeftWidth: highlight ? 3 : 0,
    borderLeftColor: THEME.colors.sacred.saffron,
  }}>
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
        fontSize: highlight ? 18 : 15,
        fontWeight: highlight ? '900' : '700',
        color: highlight 
          ? THEME.colors.primary 
          : THEME.colors.text.primary,
      }}>
        {value}
      </Text>
    </View>
  </View>
);