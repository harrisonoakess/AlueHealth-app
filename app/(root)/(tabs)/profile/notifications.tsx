import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
  Switch as RNSwitch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

export default function Notifications() {
  const router = useRouter();

  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    mealSuggestions: true,
    checkInPrompts: true,
    moodTracking: false,
    weeklyProgress: true,
    healthTips: true,
    pushNotifications: true,
    emailUpdates: false,
  });

  type Key = keyof typeof notifications;

  const handleToggle = (key: Key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationItems: { key: Key; label: string; description: string }[] = [
    { key: "dailyReminders", label: "Daily Reminders", description: "Get reminders for your daily wellness routines" },
    { key: "mealSuggestions", label: "Meal Suggestions", description: "Receive personalized meal recommendations" },
    { key: "checkInPrompts", label: "Check-In Prompts", description: "Daily prompts to track how you're feeling" },
    { key: "moodTracking", label: "Mood Tracking", description: "Reminders to log your mood throughout the day" },
    { key: "weeklyProgress", label: "Weekly Progress", description: "Summary of your week's wellness journey" },
    { key: "healthTips", label: "Health Tips", description: "Expert tips for postpartum recovery" },
    { key: "pushNotifications", label: "Push Notifications", description: "Enable all push notifications" },
    { key: "emailUpdates", label: "Email Updates", description: "Receive updates via email" },
  ];

  const goBackToProfile = () => {
    // Option A: go back one screen
    router.back();
    // Option B: jump to profile tab instead:
    // router.push("/(root)/(tabs)/profile");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FB" }}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={goBackToProfile}
            hitSlop={10}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, paddingRight: 8 }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            testID="back-button"
          >
            <ArrowLeft size={22} color="#111827" />
          </Pressable>
          <Text style={styles.title}>Notifications</Text>
          {/* spacer to balance the ArrowLeft tap area */}
          <View style={{ width: 30 }} />
        </View>

        {/* List */}
        <View style={{ gap: 12, marginTop: 12 }}>
          {notificationItems.map((item) => (
            <Card key={item.key}>
              <View style={styles.itemRow}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Pressable onPress={() => handleToggle(item.key)} accessibilityRole="button">
                    <Text style={styles.itemLabel}>{item.label}</Text>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                  </Pressable>
                </View>
                <RNSwitch
                  value={notifications[item.key]}
                  onValueChange={() => handleToggle(item.key)}
                  thumbColor={Platform.OS === "android" ? "#fff" : undefined}
                  trackColor={{ false: "#E5E7EB", true: "#7B53A6" }}
                />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/** ---- Small building blocks ---- */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      {children}
    </View>
  );
}

/** ---- Styles ---- */
const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 2 },
    }),
  },

  itemRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  itemLabel: { fontSize: 16, fontWeight: "600", color: "#111827" },
  itemDescription: { marginTop: 4, fontSize: 13, color: "#6B7280" },
});
