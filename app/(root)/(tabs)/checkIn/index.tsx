import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { supabase } from "../../../../lib/supabase";

// Helpers
const localYmd = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default function CheckIn() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // --- State (RN-friendly) ---
  const [sleep, setSleep] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number>(5);
  const [mood, setMood] = useState<string | null>(null);
  const [pain, setPain] = useState<number>(0);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [feeding, setFeeding] = useState<string | null>(null);
  const [waterIntake, setWaterIntake] = useState<number>(4);
  const [notes, setNotes] = useState<string>("");

  // --- Options ---
  const sleepEmojis = ["😴", "🥱", "😌", "🙂", "😁"];
  const moodOptions = ["Calm", "Overwhelmed", "Happy", "Tired", "Anxious", "Grateful"];
  const symptomOptions = ["Cramping", "Bleeding", "Soreness", "Headache", "Night Sweats"];
  const feedingOptions = ["Breastfeeding", "Formula", "Both", "Not applicable"];

  const toggleSymptom = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  // ---- Save to Supabase (single-table MVP) ----
  const handleSave = async () => {
    if (saving) return;

    try {
      setSaving(true);

      const { data: auth } = await supabase.auth.getUser();
      const user_id = auth?.user?.id;
      if (!user_id) {
        Alert.alert("Not signed in", "Please sign in to save your check-in.");
        return;
      }

      // Optional client guards (DB has checks too):
      if (energy < 0 || energy > 10) throw new Error("Energy out of range (0–10)");
      if (pain < 0 || pain > 10) throw new Error("Pain out of range (0–10)");

      const payload = {
        user_id,
        checkin_date: localYmd(), // one-per-day key in user's local tz
        client_tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        sleep_index: sleep, // 0..4 or null
        energy,
        mood, // string or null
        pain,
        symptoms, // text[]
        feeding, // string or null
        water_glasses: waterIntake,
        notes: notes?.trim() || null,
      };

      const { error } = await supabase
        .from("check_ins")
        .upsert([payload], { onConflict: "user_id,checkin_date" });

      if (error) throw error;

      Alert.alert("Nice job 💕", "Your day is logged.");
      router.push("/(root)/(tabs)/checkIn/checkInHistory");
    } catch (e: any) {
      Alert.alert("Save failed", e?.message ?? "Please try again.");
    } finally {
      setSaving(false);
    }
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
        {/* Header + Top-right button */}
        <View style={[styles.headerRow, { marginBottom: 24 }]}>
          <View>
            <Text style={styles.title}>Let's check in 💗</Text>
            <Text style={styles.subtitle}>Answer a few quick questions.</Text>
          </View>

          <Pressable
            onPress={goHistory}
            style={({ pressed }) => [styles.historyBtn, { opacity: pressed ? 0.85 : 1 }]}
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
              minimumTrackTintColor="#7B53A6"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor={Platform.OS === "android" ? "#7B53A6" : undefined}
            />
            <View style={styles.scaleRow}>
              <Text style={styles.muted}>0</Text>
              <Text style={styles.accentValue}>{energy}</Text>
              <Text style={styles.muted}>10</Text>
            </View>
          </View>
        </Card>

        {/* Mood */}
        <Card tone="primary">
          <Text style={styles.sectionTitle}>Mood right now?</Text>
          <View style={styles.wrapRow}>
            {moodOptions.map((opt) => {
              const active = mood === opt;
              return (
                <Pressable
                  key={opt}
                  onPress={() => setMood(opt)}
                  style={({ pressed }) => [
                    styles.pill,
                    active ? styles.pillActive : styles.pillIdle,
                    { opacity: pressed ? 0.85 : 1 },
                  ]}
                >
                  <Text style={active ? styles.pillActiveText : styles.pillText}>{opt}</Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* Symptoms (multi-select) */}
        <Card tone="primary">
          <Text style={styles.sectionTitle}>Any physical symptoms?</Text>
          <View style={styles.wrapRow}>
            {symptomOptions.map((sym) => {
              const active = symptoms.includes(sym);
              return (
                <Pressable
                  key={sym}
                  onPress={() => toggleSymptom(sym)}
                  style={({ pressed }) => [
                    styles.pill,
                    active ? styles.pillActive : styles.pillIdle,
                    { opacity: pressed ? 0.85 : 1 },
                  ]}
                >
                  <Text style={active ? styles.pillActiveText : styles.pillText}>{sym}</Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* Pain */}
        <Card tone="primary">
          <Text style={styles.sectionTitle}>Pain level today?</Text>
          <View>
            <Slider
              value={pain}
              onValueChange={(v) => setPain(Math.round(v))}
              minimumValue={0}
              maximumValue={10}
              step={1}
              style={{ width: "100%", height: 40 }}
              minimumTrackTintColor="#7B53A6"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor={Platform.OS === "android" ? "#7B53A6" : undefined}
            />
            <View style={styles.scaleRow}>
              <Text style={styles.muted}>No pain</Text>
              <Text style={styles.accentValue}>{pain}</Text>
              <Text style={styles.muted}>Severe</Text>
            </View>
          </View>
        </Card>

        {/* Feeding */}
        <Card tone="primary">
          <Text style={styles.sectionTitle}>Feeding method today?</Text>
          <View style={styles.wrapRow}>
            {feedingOptions.map((opt) => {
              const active = feeding === opt;
              return (
                <Pressable
                  key={opt}
                  onPress={() => setFeeding(opt)}
                  style={({ pressed }) => [
                    styles.pill,
                    active ? styles.pillActive : styles.pillIdle,
                    { opacity: pressed ? 0.85 : 1 },
                  ]}
                >
                  <Text style={active ? styles.pillActiveText : styles.pillText}>{opt}</Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* Water intake */}
        <Card tone="primary">
          <Text style={styles.sectionTitle}>Water intake (glasses)</Text>
          <View>
            <Slider
              value={waterIntake}
              onValueChange={(v) => setWaterIntake(Math.round(v))}
              minimumValue={0}
              maximumValue={12}
              step={1}
              style={{ width: "100%", height: 40 }}
              minimumTrackTintColor="#7B53A6"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor={Platform.OS === "android" ? "#7B53A6" : undefined}
            />
            <View style={styles.scaleRow}>
              <Text style={styles.muted}>0</Text>
              <Text style={styles.accentValue}>{waterIntake} glasses</Text>
              <Text style={styles.muted}>12</Text>
            </View>
          </View>
        </Card>

        {/* Notes */}
        <Card tone="primary" style={{ marginBottom: 8 }}>
          <Text style={styles.sectionTitle}>Any additional notes?</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="How are you feeling today? Any concerns or wins to share..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.notesInput}
          />
        </Card>

        {/* Save */}
        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={({ pressed }) => [
            styles.saveBtn,
            pressed && !saving && styles.saveBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Save check-in"
        >
          <View style={styles.savePill}>
            <Text style={styles.saveText}>
              {saving ? "Saving..." : "Save Check-In"}
            </Text>
          </View>
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
  const background = tone === "primary" ? "rgba(123,83,166,0.10)" : "#fff"; // matches your brand purple
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
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
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
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 2 },
    }),
  },

  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 12 },
  muted: { color: "#6B7280", fontSize: 14 },

  rowSpread: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  emojiBtn: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiIdle: { backgroundColor: "#ffffff" },
  emojiActive: { backgroundColor: "#7B53A622" },

  scaleRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accentValue: { fontSize: 18, fontWeight: "700", color: "#7B53A6" },

  wrapRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1 },
  pillIdle: { backgroundColor: "#fff", borderColor: "#E5E7EB" },
  pillActive: { backgroundColor: "#7B53A6", borderColor: "#7B53A6" },
  pillText: { color: "#111827", fontWeight: "500" },
  pillActiveText: { color: "#fff", fontWeight: "600" },

  notesInput: {
    minHeight: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    padding: 12,
    fontSize: 14,
  },

  // --- SAVE BUTTON ---
  saveBtn: {
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnPressed: {
    opacity: 0.85,
  },
  // This is the actual purple "chip" behind the text
  savePill: {
    backgroundColor: "#7B53A6", // << CLEAR COLOR BEHIND "SAVE CHECK-IN"
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 999,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
