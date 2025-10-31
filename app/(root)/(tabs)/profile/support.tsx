// app/(root)/(tabs)/support.tsx
import React, { useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, MessageCircle, Mail, Book, ExternalLink } from "lucide-react-native";

// Enable smooth accordion animation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Support() {
  const router = useRouter();

  const supportOptions = [
    {
      icon: MessageCircle,
      label: "Live Chat",
      description: "Chat with our support team",
      action: () => Alert.alert("Coming soon", "Live chat is on the roadmap."),
    },
    {
      icon: Mail,
      label: "Email Support",
      description: "support@aluehealth.com",
      action: () => Linking.openURL("mailto:support@aluehealth.com"),
    },
    {
      icon: Book,
      label: "Help Center",
      description: "Browse articles and guides",
      action: () => Alert.alert("Coming soon", "Help Center will open here."),
    },
  ];

  const faqs = [
    {
      q: "How do I track my daily meals?",
      a: "Go to Meals from the bottom tabs. Log meals, view nutrition, and get recommendations.",
    },
    {
      q: "Can I customize my check-in reminders?",
      a: "Yes. Profile → Notifications lets you set timing and frequency for reminders.",
    },
    {
      q: "Is my health data secure?",
      a: "Yes. We use industry-standard encryption. We never share without your consent.",
    },
    {
      q: "How do I update my profile information?",
      a: "Tap your profile, then Edit Profile to update personal info and preferences.",
    },
    {
      q: "What if I need emergency medical help?",
      a: "AlueHealth is not for emergencies. Call 911 or your local emergency number.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleItem = (i: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  const submitSupport = () => {
    // You could route to a form screen, or send an email:
    // router.push("/(root)/support-request");
    Linking.openURL("mailto:support@aluehealth.com?subject=Support%20Request");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.replace("/(root)/(tabs)/profile")}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={20} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Support</Text>
        </View>

        {/* Contact Us */}
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={{ gap: 12 }}>
          {supportOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <TouchableOpacity
                key={opt.label}
                onPress={opt.action}
                activeOpacity={0.8}
                style={styles.cardRow}
                accessibilityRole="button"
              >
                <View style={styles.iconCircle}>
                  <Icon size={20} color="#9C72C2" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{opt.label}</Text>
                  <Text style={styles.cardDesc}>{opt.description}</Text>
                </View>
                <ExternalLink size={18} color="#6B7280" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* FAQs (Accordion) */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Frequently Asked Questions</Text>
        <View style={styles.card}>
          {faqs.map((item, i) => {
            const open = openIndex === i;
            return (
              <View key={i} style={styles.faqItem}>
                <TouchableOpacity
                  onPress={() => toggleItem(i)}
                  activeOpacity={0.8}
                  style={styles.faqTrigger}
                  accessibilityRole="button"
                  accessibilityLabel={`Toggle ${item.q}`}
                >
                  <Text style={styles.faqQuestion}>{item.q}</Text>
                  <Text style={styles.faqChevron}>{open ? "−" : "+"}</Text>
                </TouchableOpacity>
                {open && <Text style={styles.faqAnswer}>{item.a}</Text>}
                {i < faqs.length - 1 && <View style={styles.divider} />}
              </View>
            );
          })}
        </View>

        {/* CTA Card */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Need More Help?</Text>
          <Text style={styles.ctaDesc}>
            Our support team is here to help you with any questions or concerns.
          </Text>
          <TouchableOpacity
            onPress={submitSupport}
            style={styles.ctaButton}
            accessibilityRole="button"
            accessibilityLabel="Submit a Support Request"
          >
            <Text style={styles.ctaButtonText}>Submit a Support Request</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4EAF8" }, // primary.50
  container: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },

  // Header
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: StyleSheet.hairlineWidth, borderColor: "#E5E7EB",
    marginRight: 8,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111827" },

  // Section title
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 12 },

  // Contact row card
  cardRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(124, 83, 166, 0.12)", // primary.500 @12%
  },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },
  cardDesc: { fontSize: 13, color: "#6B7280", marginTop: 2 },

  // FAQ
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth, borderColor: "#E5E7EB",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  faqItem: { paddingHorizontal: 12, paddingVertical: 6 },
  faqTrigger: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10, paddingHorizontal: 4,
  },
  faqQuestion: { fontSize: 14, fontWeight: "600", color: "#111827", flex: 1, paddingRight: 12 },
  faqChevron: { fontSize: 22, color: "#6B7280", paddingHorizontal: 6 },
  faqAnswer: { fontSize: 14, color: "#6B7280", paddingHorizontal: 4, paddingBottom: 10 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: "#E5E7EB" },

  // CTA
  ctaCard: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth, borderColor: "#E5E7EB",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  ctaTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 6 },
  ctaDesc: { fontSize: 14, color: "#6B7280", marginBottom: 12 },
  ctaButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7B53A6", // primary.500
    shadowColor: "#7B53A6", shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  ctaButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
