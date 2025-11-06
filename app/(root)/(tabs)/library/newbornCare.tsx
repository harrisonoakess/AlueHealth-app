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

export default function NewbornCareArticle() {
  const router = useRouter();

  const careTopics = [
    {
      title: "Diaper Changes",
      tips: [
        "Change every 2–3 hours or when soiled",
        "Clean front to back, especially for girls",
        "Use barrier cream to prevent diaper rash",
        "Expect 6+ wet diapers per day after first week",
      ],
      emoji: "🍼",
    },
    {
      title: "Bathing",
      tips: [
        "Sponge baths until umbilical cord falls off (1–2 weeks)",
        "Bath 2–3 times per week is enough for newborns",
        "Water should be warm, not hot (test with elbow)",
        "Never leave baby unattended in water",
      ],
      emoji: "🛁",
    },
    {
      title: "Umbilical Cord Care",
      tips: [
        "Keep cord stump clean and dry",
        "Fold diaper down to expose to air",
        "No need for alcohol unless doctor recommends",
        "Should fall off in 1–3 weeks",
      ],
      emoji: "🩹",
    },
    {
      title: "Nail Care",
      tips: [
        "Trim nails when baby is sleeping or very calm",
        "Use baby nail clippers or file",
        "Trim straight across to prevent ingrown nails",
        "May need trimming weekly in first months",
      ],
      emoji: "✂️",
    },
  ];

  const comfortingTechniques = [
    "Swaddling: wrap snugly in a blanket with arms secure",
    "Shushing: make 'shhh' sound to mimic womb",
    "Swinging: gentle rocking or swaying motion",
    "Sucking: offer pacifier or allow baby to suck on finger",
    "Side/stomach holding: hold baby on their side (but always sleep on back)",
  ];

  const goBack = () => {
    // If this screen was opened from Library:
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
        <Text style={styles.title}>Newborn Care Basics</Text>
        <Text style={styles.lede}>
          Caring for a newborn can feel overwhelming. Here are the essential basics to help you
          feel more confident in those early days.
        </Text>

        {/* Quote */}
        <Card tone="accent" style={{ marginBottom: 16 }}>
          <Text style={styles.italic}>
            “You don't have to be perfect. You just have to be present, attentive, and willing
            to learn. Your baby doesn't need perfection — they need you.”
          </Text>
        </Card>

        {/* Daily Care Essentials */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>Daily Care Essentials</Text>
          <View style={{ gap: 24 }}>
            {careTopics.map((topic, i) => (
              <View key={i}>
                <View style={styles.topicHeader}>
                  <Text style={styles.topicEmoji}>{topic.emoji}</Text>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                </View>
                <View style={{ marginLeft: 36, gap: 8 }}>
                  {topic.tips.map((tip, j) => (
                    <Bullet key={j} text={tip} />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Soothing a Crying Baby */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>Soothing a Crying Baby</Text>
          <Text style={[styles.muted, { marginBottom: 12 }]}>
            The “5 S’s” technique can help calm a fussy baby:
          </Text>
          <View style={{ gap: 8 }}>
            {comfortingTechniques.map((t, i) => (
              <Bullet key={i} text={t} />
            ))}
          </View>
          <Text style={[styles.muted, { marginTop: 12, fontStyle: "italic" }]}>
            Note: If baby continues crying inconsolably for extended periods, contact your pediatrician
            to rule out any medical issues.
          </Text>
        </Card>

        {/* Handling & Holding */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>Handling and Holding Your Baby</Text>
          <View style={{ gap: 10 }}>
            <TipRow icon="👶" text="Always support baby's head and neck until they can hold it up on their own" />
            <TipRow icon="🙏" text="Wash hands before handling baby to prevent infection" />
            <TipRow icon="💪" text="Be confident but gentle — babies are resilient but need secure support" />
            <TipRow icon="❤️" text="Skin-to-skin contact promotes bonding and helps regulate baby's temperature" />
          </View>
        </Card>

        {/* What's Normal */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>What's Normal for Newborns</Text>
          <View style={{ gap: 10 }}>
            <InfoBox
              title="Appearance"
              body="Cone-shaped head, swollen eyes, white spots on nose (milia), and peeling skin are all normal and temporary."
            />
            <InfoBox
              title="Bowel Movements"
              body="Color and consistency vary. Breastfed babies: yellow, seedy. Formula-fed: tan, firmer. Several per day or once every few days can both be normal."
            />
            <InfoBox
              title="Breathing"
              body="Newborns breathe irregularly and may sneeze often (this is how they clear their nose)."
            />
            <InfoBox
              title="Sounds"
              body="Grunting, squeaking, and sighing are normal. Babies are noisy sleepers!"
            />
          </View>
        </Card>

        {/* When to Call the Doctor */}
        <Card tone="danger" style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>When to Call the Doctor</Text>
          <View style={{ gap: 8 }}>
            <Warn text="Fever over 100.4°F (38°C) in babies under 3 months" />
            <Warn text="Difficulty breathing or turning blue" />
            <Warn text="Not feeding well or refusing several feedings" />
            <Warn text="Less than 6 wet diapers in 24 hours after first week" />
            <Warn text="Unusually lethargic or difficult to wake" />
          </View>
        </Card>

        {/* Closing note */}
        <Card tone="primary">
          <Text style={[styles.center, styles.body]}>
            You're doing better than you think you are. Every parent learns as they go, and your
            baby is lucky to have someone who cares enough to learn. Trust yourself! ✨
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

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
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

function TipRow({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.tipRow}>
      <Text style={styles.tipIcon}>{icon}</Text>
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
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 2 },
    }),
  },

  topicHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  topicEmoji: { fontSize: 22, width: 26, textAlign: "center" },
  topicTitle: { fontWeight: "700", color: "#111827", fontSize: 16 },

  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  bulletDot: { color: "#7B53A6", fontSize: 18, lineHeight: 20 },

  tipRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  tipIcon: { fontSize: 16, width: 20, textAlign: "center" },

  infoBox: { backgroundColor: "rgba(0,0,0,0.04)", padding: 12, borderRadius: 12 },
  infoTitle: { fontWeight: "700", color: "#111827", marginBottom: 2 },

  muted: { color: "#6B7280", fontSize: 14, lineHeight: 20 },
});
