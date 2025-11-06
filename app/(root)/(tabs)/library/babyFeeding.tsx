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

export default function BabyFeedingArticle() {
  const router = useRouter();

  const feedingGuidelines = [
    {
      age: "0–1 month",
      frequency: "8–12 times per day",
      notes: "Feed on demand, every 2–3 hours. Cluster feeding is normal.",
    },
    {
      age: "1–3 months",
      frequency: "7–9 times per day",
      notes: "Feeding patterns become more predictable. 3–4 hour stretches.",
    },
    {
      age: "3–6 months",
      frequency: "6–8 times per day",
      notes: "Longer stretches between feeds. Introduction to solids around 6 months.",
    },
    {
      age: "6–12 months",
      frequency: "4–6 times per day",
      notes: "Solid foods increase while milk feeds decrease gradually.",
    },
  ];

  const hungerCues = [
    { cue: "Early cues", signs: "Stirring, mouth opening, turning head" },
    { cue: "Active cues", signs: "Stretching, increased movement, hand to mouth" },
    { cue: "Late cues", signs: "Crying, agitated body movements, flushed color" },
  ];

  const goBack = () => {
    // If this screen was opened from Library, either:
    // router.back();
    router.push("/(root)/(tabs)/library");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FB" }}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
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
        <Text style={styles.title}>Baby Feeding Schedule Guide</Text>
        <Text style={styles.lede}>
          Understanding your baby's feeding needs helps ensure proper nutrition and growth.
          Remember, every baby is unique and these are general guidelines.
        </Text>

        {/* Quote card */}
        <Card tone="accent" style={{ marginBottom: 16 }}>
          <Text style={styles.italic}>
            “Fed is best” — Whether breastfeeding, formula feeding, or combination feeding,
            what matters most is that your baby is well-nourished and thriving.
          </Text>
        </Card>

        {/* Feeding guidelines */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>Feeding Guidelines by Age</Text>
          <View style={{ gap: 12 }}>
            {feedingGuidelines.map((item, idx) => (
              <View key={idx} style={styles.guidelineItem}>
                <Text style={styles.guidelineTitle}>
                  {item.age}: {item.frequency}
                </Text>
                <Text style={styles.muted}>{item.notes}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Hunger cues */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>Recognizing Hunger Cues</Text>
          <Text style={[styles.muted, { marginBottom: 12 }]}>
            Responding to early hunger cues helps prevent crying and makes feeding easier.
          </Text>
          <View style={{ gap: 10 }}>
            {hungerCues.map((item, idx) => (
              <View key={idx} style={styles.cueBox}>
                <Text style={styles.cueTitle}>{item.cue}</Text>
                <Text style={styles.muted}>{item.signs}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Breastfeeding tips */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>Breastfeeding Tips</Text>
          <View style={{ gap: 10 }}>
            <TipRow icon="🤱" text="Ensure proper latch to prevent nipple pain and ensure good milk transfer" />
            <TipRow icon="💧" text="Stay hydrated — drink water before and during each feeding" />
            <TipRow icon="🛋️" text="Find comfortable positions — try cradle, football, or side-lying holds" />
            <TipRow icon="⏰" text="Empty one breast before switching to help baby get hindmilk" />
          </View>
        </Card>

        {/* Formula tips */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>Formula Feeding Tips</Text>
          <View style={{ gap: 10 }}>
            <TipRow icon="🍼" text="Follow preparation instructions exactly — proper measurement is crucial" />
            <TipRow icon="🌡️" text="Test temperature on your wrist — it should be lukewarm" />
            <TipRow icon="🧼" text="Sterilize bottles and nipples, especially in the first few months" />
            <TipRow icon="👀" text="Hold baby semi-upright during feeding and pace the feeding" />
          </View>
        </Card>

        {/* When to call pediatrician */}
        <Card tone="danger" style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>When to Call Your Pediatrician</Text>
          <View style={{ gap: 8 }}>
            <Bullet text="Baby isn't producing enough wet diapers (less than 6/day after day 5)" />
            <Bullet text="Baby isn't gaining weight or is losing weight" />
            <Bullet text="Baby seems excessively sleepy and difficult to wake for feeds" />
            <Bullet text="You're concerned about milk supply or feeding difficulties" />
          </View>
        </Card>

        {/* Closing note */}
        <Card tone="primary">
          <Text style={[styles.center, styles.body]}>
            Trust your instincts and your baby's cues. Feeding times are also bonding times —{"\n"}
            enjoy these precious moments together. 💕
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
      ? "rgba(123,83,166,0.10)" // accent/20
      : tone === "danger"
      ? "rgba(239,68,68,0.10)" // destructive/10
      : tone === "primary"
      ? "rgba(123,83,166,0.10)" // primary/10
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
    <View
      style={[
        styles.card,
        { backgroundColor: background, borderColor },
        style,
      ]}
    >
      {children}
    </View>
  );
}

function TipRow({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.tipRow}>
      <Text style={styles.tipIcon}>{icon}</Text>
      <Text style={styles.muted}>{text}</Text>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.muted}>{text}</Text>
    </View>
  );
}

/** Styles */
const styles = StyleSheet.create({
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
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
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 2 },
    }),
  },

  guidelineItem: {
    borderLeftWidth: 4,
    borderLeftColor: "#7B53A6",
    paddingLeft: 12,
  },
  guidelineTitle: { fontWeight: "700", color: "#111827", marginBottom: 2 },

  cueBox: {
    backgroundColor: "rgba(0,0,0,0.04)",
    padding: 12,
    borderRadius: 12,
  },
  cueTitle: { fontWeight: "700", color: "#111827", marginBottom: 2 },

  muted: { color: "#6B7280", fontSize: 14, lineHeight: 20 },

  tipRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  tipIcon: { fontSize: 16, width: 20, textAlign: "center" },

  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  bulletDot: { color: "#EF4444", fontSize: 18, lineHeight: 20 },
});
