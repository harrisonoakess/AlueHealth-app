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

export default function SelfCareArticle() {
  const router = useRouter();

  const quickSelfCare = [
    {
      time: "5 minutes",
      activities: [
        "Deep breathing exercises",
        "Quick shower with favorite soap",
        "Stretch major muscle groups",
        "Journal three things you're grateful for",
      ],
    },
    {
      time: "15 minutes",
      activities: [
        "Take a relaxing bath",
        "Do a face mask or skincare routine",
        "Call a friend for a quick chat",
        "Read a chapter of a book",
      ],
    },
    {
      time: "30 minutes",
      activities: [
        "Take a walk outside",
        "Watch your favorite show",
        "Practice yoga or gentle exercise",
        "Work on a hobby you enjoy",
      ],
    },
  ];

  const selfCareCategories = [
    {
      title: "Physical Self-Care",
      items: [
        "Prioritize sleep when baby sleeps",
        "Stay hydrated throughout the day",
        "Eat nourishing meals regularly",
        "Move your body gently",
      ],
      emoji: "💪",
    },
    {
      title: "Emotional Self-Care",
      items: [
        "Allow yourself to feel all emotions",
        "Practice self-compassion",
        "Set boundaries when needed",
        "Seek support from loved ones",
      ],
      emoji: "❤️",
    },
    {
      title: "Mental Self-Care",
      items: [
        "Limit social media if overwhelming",
        "Do activities that bring you joy",
        "Keep a journal for thoughts",
        "Practice mindfulness or meditation",
      ],
      emoji: "🧠",
    },
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
        <Text style={styles.title}>Self-Care for New Moms</Text>
        <Text style={styles.lede}>
          Taking care of yourself isn't selfish — it's essential. When you nourish yourself,
          you're better able to care for your baby. Here's how to prioritize your wellbeing.
        </Text>

        {/* Quote */}
        <Card tone="accent" style={{ marginBottom: 16 }}>
          <Text style={styles.italic}>
            “You can't pour from an empty cup. Taking care of yourself is taking care of your baby.”
          </Text>
        </Card>

        {/* Why Self-Care Matters */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>Why Self-Care Matters Postpartum</Text>
          <View style={{ gap: 10 }}>
            <IconBullet icon="⭐️" text="Reduces risk of postpartum depression and anxiety" />
            <IconBullet icon="💚" text="Improves physical recovery and energy levels" />
            <IconBullet icon="😊" text="Enhances mood and emotional resilience" />
            <IconBullet icon="👶" text="Helps you be more present and patient with baby" />
            <IconBullet icon="🔋" text="Prevents burnout and exhaustion" />
          </View>
        </Card>

        {/* Quick Self-Care by Time */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>Quick Self-Care by Time Available</Text>
          <View style={{ gap: 12 }}>
            {quickSelfCare.map((slot, i) => (
              <View key={i} style={styles.timelineItem}>
                <Text style={styles.timelineTitle}>{slot.time}</Text>
                <View style={{ gap: 6 }}>
                  {slot.activities.map((a, j) => (
                    <Bullet key={j} text={a} />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Types of Self-Care */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>Types of Self-Care</Text>
          <View style={{ gap: 20 }}>
            {selfCareCategories.map((cat, i) => (
              <View key={i}>
                <View style={styles.topicHeader}>
                  <Text style={styles.topicEmoji}>{cat.emoji}</Text>
                  <Text style={styles.topicTitle}>{cat.title}</Text>
                </View>
                <View style={{ marginLeft: 36, gap: 8 }}>
                  {cat.items.map((it, k) => (
                    <Bullet key={k} text={it} />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Overcoming Self-Care Barriers */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>Overcoming Self-Care Barriers</Text>
          <View style={{ gap: 12 }}>
            <InfoBox
              title={`"I don't have time"`}
              body="Self-care doesn't require hours. Even 5 minutes counts. Try combining activities (audiobook while feeding, stretching during tummy time)."
            />
            <InfoBox
              title={`"I feel guilty"`}
              body="Remember: taking care of yourself helps you take better care of your baby. You both deserve a healthy, happy parent."
            />
            <InfoBox
              title={`"I don't know what I need"`}
              body="Start by noticing what feels good. Listen to your body and emotions. Your needs will become clearer with practice."
            />
            <InfoBox
              title={`"No one can help"`}
              body='Be specific when asking for help. "Can you hold baby while I shower?" is easier for people to say yes to than "Can you help?"'
            />
          </View>
        </Card>

        {/* Building Your Self-Care Routine */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>Building Your Self-Care Routine</Text>
          <View style={{ gap: 10 }}>
            <Numbered n={1} text="Identify 3–5 activities that genuinely refresh you" />
            <Numbered n={2} text="Schedule them like appointments — they're just as important" />
            <Numbered n={3} text="Start small — even 5 minutes daily builds the habit" />
            <Numbered n={4} text="Adjust as needed — your needs will change as baby grows" />
            <Numbered n={5} text="Be flexible and kind to yourself on hard days" />
          </View>
        </Card>

        {/* When to Seek Additional Support */}
        <Card tone="danger" style={{ marginBottom: 16 }}>
          <Text style={styles.h2}>When to Seek Additional Support</Text>
          <Text style={[styles.muted, { marginBottom: 8 }]}>
            If self-care isn't enough and you're experiencing:
          </Text>
          <View style={{ gap: 8 }}>
            <Warn text="Persistent sadness, anxiety, or emptiness" />
            <Warn text="Difficulty bonding with baby" />
            <Warn text="Thoughts of harming yourself or baby" />
            <Warn text="Inability to care for yourself or baby" />
          </View>
          <Text style={[styles.muted, { marginTop: 10, fontWeight: "700" }]}>
            Reach out to your healthcare provider or call the Postpartum Support International
            helpline: 1-800-944-4773
          </Text>
        </Card>

        {/* Closing note */}
        <Card tone="primary">
          <Text style={[styles.center, styles.body]}>
            You are doing an incredible job. Taking time for yourself isn't taking time away
            from your baby — it's ensuring they have the best version of you. Be gentle with
            yourself, mama. 💝
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

function IconBullet({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.iconRow}>
      <Text style={styles.icon}>{icon}</Text>
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

function Numbered({ n, text }: { n: number; text: string }) {
  return (
    <View style={styles.numberedRow}>
      <Text style={styles.numberedIndex}>{n}.</Text>
      <Text style={styles.muted}>{text}</Text>
    </View>
  );
}

function Warn({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={[styles.bulletDot, { color: "#EF4444" }]}>•</Text>
      <Text style={styles.muted}>{text}</Text>
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

  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  bulletDot: { color: "#7B53A6", fontSize: 18, lineHeight: 20, width: 18, textAlign: "center" },

  iconRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  icon: { fontSize: 16, width: 20, textAlign: "center" },

  timelineItem: { borderLeftWidth: 4, borderLeftColor: "#7B53A6", paddingLeft: 12 },
  timelineTitle: { fontWeight: "700", color: "#111827", marginBottom: 6 },

  topicHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  topicEmoji: { fontSize: 22, width: 26, textAlign: "center" },
  topicTitle: { fontWeight: "700", color: "#111827", fontSize: 16 },

  infoBox: { backgroundColor: "rgba(0,0,0,0.04)", padding: 12, borderRadius: 12 },
  infoTitle: { fontWeight: "700", color: "#111827", marginBottom: 4 },

  numberedRow: { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  numberedIndex: { color: "#7B53A6", fontWeight: "700", width: 18, textAlign: "center" },

  muted: { color: "#6B7280", fontSize: 14, lineHeight: 20 },
});
