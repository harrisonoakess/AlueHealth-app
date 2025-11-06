import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

export default function PostpartumExerciseArticle() {
  const router = useRouter();

  const safetyGuidelines = [
    {
      title: "Get Clearance First",
      description:
        "Wait for your doctor's approval before starting exercise (usually 6 weeks postpartum, longer for C-section).",
      emoji: "✅",
    },
    {
      title: "Listen to Your Body",
      description:
        "Stop if you experience pain, heavy bleeding, or feel unwell. Rest is productive too.",
      emoji: "👂",
    },
    {
      title: "Start Slow",
      description:
        "Begin with gentle movements and gradually increase intensity over weeks and months.",
      emoji: "🐌",
    },
    {
      title: "Support Your Core",
      description:
        "Check for diastasis recti. Focus on deep core activation before progressing.",
      emoji: "💪",
    },
  ];

  const exerciseTimeline = [
    { phase: "Week 1–2", activities: "Deep breathing, pelvic floor exercises, gentle walking" },
    { phase: "Week 3–6", activities: "Continue above, add gentle stretching and posture work" },
    { phase: "Week 6–12", activities: "After clearance: low-impact cardio, modified strength training" },
    { phase: "Month 3+", activities: "Gradually progress intensity, duration, and complexity" },
  ];

  const goBack = () => {
    // router.back();
    router.push("/(root)/(tabs)/library");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FB" }}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <Pressable
          onPress={goBack}
          style={({ pressed }) => [styles.backRow, { opacity: pressed ? 0.7 : 1 }]}
          accessibilityRole="button"
          accessibilityLabel="Back to Library"
          hitSlop={8}
        >
          <ArrowLeft size={20} color="#6B7280" />
          <Text style={styles.backText}>Back to Library</Text>
        </Pressable>

        {/* Title & intro */}
        <Text style={styles.title}>Safe Postpartum Exercise</Text>
        <Text style={styles.lede}>
          Exercise can support your postpartum recovery, but safety comes first. Here's how to
          return to movement in a way that supports your healing body.
        </Text>

        {/* Quote */}
        <Card tone="accent" style={{ marginBottom: 16 }}>
          <Text style={styles.italic}>
            “Your body just performed a miracle. Give it time, patience, and proper progression
            as you rebuild your strength.”
          </Text>
        </Card>

        {/* Safety Guidelines */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>Essential Safety Guidelines</Text>
          <View style={{ gap: 12 }}>
            {safetyGuidelines.map((item, idx) => (
              <View key={idx} style={styles.guidelineRow}>
                <Text style={styles.guidelineEmoji}>{item.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.guidelineTitle}>{item.title}</Text>
                  <Text style={styles.muted}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Exercise Timeline */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>Exercise Timeline</Text>
          <View style={{ gap: 12 }}>
            {exerciseTimeline.map((item, idx) => (
              <View key={idx} style={styles.timelineItem}>
                <Text style={styles.timelineTitle}>{item.phase}</Text>
                <Text style={styles.muted}>{item.activities}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Exercises to Avoid Initially */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>Exercises to Avoid Initially</Text>
          <View style={{ gap: 10 }}>
            <WarnX text="High-impact activities (running, jumping) until cleared and core is healed" />
            <WarnX text="Crunches, sit-ups, or exercises that dome the abdomen" />
            <WarnX text="Heavy lifting (anything heavier than your baby) for first 6 weeks" />
            <WarnX text="Exercises that strain or pressure pelvic floor" />
          </View>
        </Card>

        {/* Recommended Starting Exercises */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>Recommended Starting Exercises</Text>
          <View style={{ gap: 12 }}>
            <InfoBox
              title="Diaphragmatic Breathing"
              body="Lie down, hand on belly. Breathe deeply, feeling belly rise and fall. 5–10 minutes daily."
            />
            <InfoBox
              title="Pelvic Tilts"
              body="Lie on back, knees bent. Gently tilt pelvis, pressing lower back into floor. Hold 5 seconds."
            />
            <InfoBox
              title="Gentle Walking"
              body="Start with 10–15 minutes. Increase gradually. Focus on posture and breathing."
            />
            <InfoBox
              title="Wall Push-Ups"
              body="Stand arm's length from wall. Lean in and push back. Start with 5–10 reps."
            />
          </View>
        </Card>

        {/* Warning Signs */}
        <Card tone="danger" style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>Warning Signs to Stop Exercise</Text>
          <View style={{ gap: 8 }}>
            <Warn text="Increased bleeding or bright red blood" />
            <Warn text="Pain in abdomen, pelvis, or incision site" />
            <Warn text="Feeling of heaviness or pressure in pelvic floor" />
            <Warn text="Leaking urine or feeling unable to control bladder" />
            <Warn text="Dizziness, nausea, or extreme fatigue" />
          </View>
        </Card>

        {/* Closing note */}
        <Card tone="primary">
          <Text style={[styles.center, styles.body]}>
            Remember: Recovery is not linear. Some days you'll feel strong, other days you'll need
            more rest. Both are okay. Progress over perfection. 💪
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

/** Small building blocks */
function Card({
  children,
  style,
  tone = "default",
}: {
  children: React.ReactNode;
  style?: object;
  tone?: "default" | "accent" | "danger" | "primary";
}) {
  const background =
    tone === "accent"
      ? "rgba(123,83,166,0.10)"
      : tone === "danger"
      ? "rgba(239,68,68,0.10)"
      : tone === "primary"
      ? "rgba(123,83,166,0.10)"
      : "#FFFFFF";

  const borderColor =
    tone === "accent"
      ? "rgba(123,83,166,0.50)"
      : tone === "danger"
      ? "rgba(239,68,68,0.20)"
      : tone === "primary"
      ? "rgba(123,83,166,0.20)"
      : "rgba(0,0,0,0.06)";

  return (
    <View style={[styles.card, { backgroundColor: background, borderColor }, style]}>
      {children}
    </View>
  );
}

function WarnX({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={[styles.bulletX, { color: "#EF4444" }]}>✗</Text>
      <Text style={styles.muted}>{text}</Text>
    </View>
  );
}

function Warn({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={[styles.bulletDot, { color: "#EF4444" }]}>⚠️</Text>
      <Text style={styles.muted}>{text}</Text>
    </View>
  );
}

function InfoBox({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.muted}>{body}</Text>
    </View>
  );
}

/** Styles */
const styles = StyleSheet.create({
  backRow: { flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 8 },
  backText: { color: "#6B7280", fontSize: 14 },

  title: { fontSize: 28, fontWeight: "800", color: "#111827", marginBottom: 8 },
  lede: { fontSize: 15, color: "#6B7280", lineHeight: 22, marginBottom: 16 },

  h2: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 10 },
  body: { fontSize: 15, color: "#111827" },
  italic: { fontStyle: "italic", color: "#111827" },
  center: { textAlign: "center" },

  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 2 },
    }),
  },

  guidelineRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  guidelineEmoji: { fontSize: 24, width: 28, textAlign: "center" },
  guidelineTitle: { fontWeight: "700", color: "#111827", marginBottom: 2 },

  timelineItem: { borderLeftWidth: 4, borderLeftColor: "#7B53A6", paddingLeft: 12 },
  timelineTitle: { fontWeight: "700", color: "#111827", marginBottom: 2 },

  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  bulletX: { fontSize: 18, lineHeight: 20, width: 18, textAlign: "center" },
  bulletDot: { fontSize: 18, lineHeight: 20, width: 18, textAlign: "center" },

  infoBox: { backgroundColor: "rgba(0,0,0,0.04)", padding: 12, borderRadius: 12 },
  infoTitle: { fontWeight: "700", color: "#111827", marginBottom: 2 },

  muted: { color: "#6B7280", fontSize: 14, lineHeight: 20 },
});
