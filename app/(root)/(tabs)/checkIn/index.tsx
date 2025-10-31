// app/(root)/(tabs)/checkIn/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider"; // ➜ expo install @react-native-community/slider
import { useRouter } from "expo-router";

export default function CheckIn() {
  const router = useRouter();

  const [sleep, setSleep] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number>(5);
  const [mood, setMood] = useState<string | null>(null);

  const sleepEmojis = ["😴", "🥱", "😌", "🙂", "😁"];
  const moodOptions = ["Calm", "Overwhelmed", "Happy", "Tired"];

  const handleSave = () => {
    Alert.alert("Nice job 💕", "Your day is logged.");
  };

  const goHistory = () => {
    router.push("/(root)/(tabs)/checkIn/checkInHistory");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FB" }}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.headerRow, { marginBottom: 24 }]}>
          <View>
            <Text style={styles.title}>Let's check in 💗</Text>
            <Text style={styles.subtitle}>Answer a few quick questions.</Text>
          </View>

          {/* View History button */}
          <Pressable
            onPress={goHistory}
            style={({ pressed }) => [
              styles.historyBtn,
              { opacity: pressed ? 0.85 : 1 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="View check-in history"
            testID="view-history-button"
          >
            <Text style={styles.historyText}>View History</Text>
          </Pressable>
        </View>

        {/* Sleep */}
        <Card tone="primary">
          <Text style={styles.sectionTitle}>How did you sleep?</Text>
          <View style={styles.rowSpread}>
            {sleepEmojis.map((emoji, i) => {
              const active = sleep === i;
              return (
                <Pressable
                  key={i}
                  onPress={() => setSleep(i)}
                  style={({ pressed }) => [
                    styles.emojiBtn,
                    active ? styles.emojiActive : styles.emojiIdle,
                    { transform: [{ scale: pressed || active ? 1.06 : 1 }] },
                  ]}
                >
                  <Text style={{ fontSize: 28 }}>{emoji}</Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* Energy */}
        <Card tone="primary">
          <Text style={styles.sectionTitle}>Energy level today?</Text>
          <View>
            <Slider
              value={energy}
              onValueChange={(v) => setEnergy(Math.round(v))}
              minimumValue={0}
              maximumValue={10}
              step={1}
              style={{ width: "100%", height: 40 }}
              minimumTrackTintColor="#6C63FF"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor={Platform.OS === "android" ? "#6C63FF" : undefined}
            />
            <View style={styles.energyRow}>
              <Text style={styles.muted}>0</Text>
              <Text style={styles.energyValue}>{energy}</Text>
              <Text style={styles.muted}>10</Text>
            </View>
          </View>
        </Card>

        {/* Mood */}
        <Card tone="primary" style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>Mood right now?</Text>
          <View style={styles.moodWrap}>
            {moodOptions.map((opt) => {
              const active = mood === opt;
              return (
                <Pressable
                  key={opt}
                  onPress={() => setMood(opt)}
                  style={({ pressed }) => [
                    styles.pill,
                    active ? styles.pillActive : styles.pillIdle,
                    { opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <Text style={active ? styles.pillActiveText : styles.pillText}>
                    {opt}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* Save */}
        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [styles.saveBtn, { opacity: pressed ? 0.85 : 1 }]}
          accessibilityRole="button"
          accessibilityLabel="Save check-in"
        >
          <Text style={styles.saveText}>Save Check-In</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

/** ---- Small building blocks ---- */
function Card({
  children,
  style,
  tone = "default",
}: {
  children: React.ReactNode;
  style?: object;
  tone?: "default" | "primary";
}) {
  const background = tone === "primary" ? "rgba(108,99,255,0.12)" : "#fff";
  const border = tone === "primary" ? "transparent" : "rgba(0,0,0,0.08)";
  return (
    <View style={[styles.card, { backgroundColor: background, borderColor: border }, style]}>
      {children}
    </View>
  );
}

/** ---- Styles ---- */
const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  title: { fontSize: 28, fontWeight: "700", color: "#111827", marginBottom: 6 },
  subtitle: { fontSize: 16, color: "#6B7280" },

  historyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 1 },
    }),
  },
  historyText: { color: "#7B53A6", fontWeight: "700", fontSize: 13 },

  card: {
    borderWidth: 2,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 2 },
    }),
  },

  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 12 },
  muted: { color: "#6B7280", fontSize: 14 },

  rowSpread: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  emojiBtn: {
    width: 56, height: 56, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },
  emojiIdle: { backgroundColor: "#ffffff" },
  emojiActive: { backgroundColor: "#6C63FF22" },

  energyRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  energyValue: { fontSize: 18, fontWeight: "700", color: "#6C63FF" },

  moodWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1 },
  pillIdle: { backgroundColor: "#fff", borderColor: "#E5E7EB" },
  pillActive: { backgroundColor: "#6C63FF", borderColor: "#6C63FF" },
  pillText: { color: "#111827", fontWeight: "500" },
  pillActiveText: { color: "#fff", fontWeight: "600" },

  saveBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6C63FF",
  },
  saveText: { color: "#fff", fontSize: 17, fontWeight: "600" },
});
