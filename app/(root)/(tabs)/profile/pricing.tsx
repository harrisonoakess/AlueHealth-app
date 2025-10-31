// app/(root)/(tabs)/pricing.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check, X } from "lucide-react-native";

export default function Pricing() {
  const freeFeatures = [
    { name: "Basic daily check-ins", included: true },
    { name: "Simple mood tracking", included: true },
    { name: "Library access", included: true },
    { name: "Standard support", included: true },
    { name: "Export health reports", included: false },
    { name: "Custom reminders", included: false },
  ];

  const premiumFeatures = [
    { name: "Unlimited daily check-ins", included: true },
    { name: "Advanced mood tracking", included: true },
    { name: "Personalized meal plans", included: true },
    { name: "Priority support", included: true },
    { name: "Export health reports", included: true },
    { name: "Custom reminders", included: true },
  ];

  const onSubscribe = () => {
    // TODO: integrate in-app purchase / backend
    // e.g., router.push("/(root)/subscribe") or open purchase flow
    console.log("Subscribe tapped");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.h1}>Choose Your Plan</Text>
          <Text style={styles.muted}>Get the most out of your postpartum recovery journey</Text>
        </View>

        {/* Cards */}
        <View style={styles.grid}>
          {/* Free Plan */}
          <View style={styles.card}>
            <View style={styles.planHeader}>
              <Text style={styles.h2}>Free Plan</Text>
              <Text style={styles.price}>$0</Text>
              <Text style={styles.muted}>forever</Text>
            </View>

            <View style={{ gap: 10, marginBottom: 16 }}>
              {freeFeatures.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  {f.included ? (
                    <Check size={18} color="#9C72C2" />
                  ) : (
                    <X size={18} color="#6B7280" />
                  )}
                  <Text style={[styles.featureText, !f.included && styles.featureMuted]}>
                    {f.name}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity disabled style={[styles.button, styles.buttonOutline, styles.buttonDisabled]}>
              <Text style={[styles.buttonOutlineText, styles.buttonDisabledText]}>Current Plan</Text>
            </TouchableOpacity>
          </View>

          {/* Premium Plan */}
          <View style={[styles.card, styles.cardEmphasis]}>
            <View style={styles.planHeader}>
              <Text style={styles.h2}>Premium Plan</Text>
              <Text style={[styles.price, styles.priceAccent]}>$9.99</Text>
              <Text style={styles.muted}>per month</Text>
            </View>

            <View style={{ gap: 10, marginBottom: 16 }}>
              {premiumFeatures.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <Check size={18} color="#9C72C2" />
                  <Text style={styles.featureText}>{f.name}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity onPress={onSubscribe} style={[styles.button, styles.buttonPrimary]}>
              <Text style={styles.buttonPrimaryText}>Subscribe Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.muted, styles.footerNote]}>
          Cancel anytime. No questions asked.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Layout
  safe: { flex: 1, backgroundColor: "#F4EAF8" }, // primary.50
  container: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 28 },
  header: { alignItems: "center", marginBottom: 16 },

  // Typography
  h1: { fontSize: 24, fontWeight: "800", color: "#111827", textAlign: "center", marginBottom: 6 },
  h2: { fontSize: 18, fontWeight: "800", color: "#111827", textAlign: "center", marginBottom: 4 },
  price: { fontSize: 28, fontWeight: "800", color: "#111827", textAlign: "center", marginBottom: 2 },
  priceAccent: { color: "#7B53A6" }, // primary.500
  muted: { fontSize: 13, color: "#6B7280", textAlign: "center" },
  footerNote: { marginTop: 10 },

  // Grid
  grid: { gap: 16 },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardEmphasis: {
    borderColor: "#7B53A6", // subtle emphasis
    shadowOpacity: 0.1,
  },
  planHeader: { alignItems: "center", marginBottom: 12 },

  // Features
  featureRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  featureText: { fontSize: 14, color: "#111827" },
  featureMuted: { color: "#6B7280" },

  // Buttons
  button: {
    width: "100%",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: "#7B53A6",
    shadowColor: "#7B53A6",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonPrimaryText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },

  buttonOutline: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
  },
  buttonOutlineText: { color: "#111827", fontSize: 16, fontWeight: "700" },

  buttonDisabled: { opacity: 0.6 },
  buttonDisabledText: { color: "#6B7280" },
});
