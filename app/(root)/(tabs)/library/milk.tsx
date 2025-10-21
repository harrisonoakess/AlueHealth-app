// app/(root)/(tabs)/library/milk.tsx
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
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft, Droplet, Heart } from "lucide-react-native";

export default function MilkSupplyArticle() {
  const router = useRouter();

  const supplyBoosters = [
    {
      category: "Hydration",
      items: [
        "Drink water every time you nurse (8–12 glasses daily)",
        "Herbal teas like fenugreek or fennel tea",
        "Coconut water for electrolytes",
      ],
    },
    {
      category: "Foods",
      items: [
        "Oatmeal — natural galactagogue",
        "Dark leafy greens (spinach, kale)",
        "Nuts and seeds (especially almonds)",
        "Salmon and fatty fish",
        "Sweet potatoes",
      ],
    },
    {
      category: "Rest & Care",
      items: [
        "Sleep when baby sleeps",
        "Skin-to-skin contact with baby",
        "Reduce stress through relaxation techniques",
        "Avoid harsh dieting in early months",
      ],
    },
  ];

  const nursingTips = [
    {
      title: "Nurse Frequently",
      description:
        "The more you nurse, the more milk you produce. Feed on demand, especially in the first weeks.",
      icon: "⏰",
    },
    {
      title: "Empty Both Breasts",
      description:
        "Let baby finish one breast before switching. This ensures they get the fatty hindmilk.",
      icon: "🤱",
    },
    {
      title: "Proper Latch",
      description:
        "A good latch is crucial. Baby should have a wide mouth with lips flanged outward.",
      icon: "👄",
    },
    {
      title: "Pump Between Feeds",
      description:
        "If needed, pump 30–60 minutes after nursing to signal your body to make more milk.",
      icon: "🍼",
    },
  ];

  const mythBusters = [
    {
      myth: "Small breasts mean less milk",
      truth:
        "Breast size has nothing to do with milk production. Glandular tissue, not fat, makes milk.",
    },
    {
      myth: "You need to drink milk to make milk",
      truth:
        "Your body makes milk from nutrients in your blood. Dairy is optional based on your diet preferences.",
    },
    {
      myth: "If baby feeds often, you do not have enough milk",
      truth:
        "Frequent feeding is normal, especially in the early weeks. It does not mean low supply.",
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <ButtonGhost onPress={() => router.back()} style={{ marginBottom: 16 }}>
          <ArrowLeft size={16} style={{ marginRight: 8 }} />
          <Text style={styles.buttonGhostText}>Back to Library</Text>
        </ButtonGhost>

        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <LinearGradient
            colors={["#6C63FF", "rgba(108,99,255,0.15)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <Text style={styles.heroEmoji}>🍼</Text>
          </LinearGradient>

          <Text style={styles.title}>Understanding Milk Supply</Text>
          <Text style={styles.subtitle}>
            What affects milk production and how to support healthy breastfeeding
          </Text>
        </View>

        {/* How milk supply works */}
        <Card tone="primary" style={{ marginBottom: 16 }}>
          <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>
            How Milk Supply Works
          </Text>
          <Text style={[styles.body, { marginBottom: 12 }]}>
            Your body makes milk based on supply and demand. The more your baby
            nurses (or you pump), the more milk your body produces. This process
            is controlled by hormones, particularly prolactin and oxytocin.
          </Text>

          <View style={styles.infoGroup}>
            <View style={styles.iconRow}>
              <Droplet size={22} style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Prolactin</Text>
                <Text style={styles.mutedSmall}>
                  Makes the milk — levels highest at night, which is why night
                  feeds are important
                </Text>
              </View>
            </View>

            <View style={styles.iconRow}>
              <Heart size={22} style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Oxytocin</Text>
                <Text style={styles.mutedSmall}>
                  Releases the milk (let-down reflex) — triggered by baby’s
                  sucking, cry, or even thoughts of baby
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Natural ways to support supply */}
        <Card tone="outline" style={{ marginBottom: 16 }}>
          <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>
            Natural Ways to Support Milk Supply
          </Text>

          {supplyBoosters.map((b, i) => (
            <View key={i} style={{ marginBottom: 14 }}>
              <View style={styles.dotTitleRow}>
                <View style={styles.dot} />
                <Text style={[styles.cardTitle, { marginBottom: 0 }]}>
                  {b.category}
                </Text>
              </View>

              <View style={styles.softBox}>
                {b.items.map((item, idx) => (
                  <View key={idx} style={styles.bulletRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.body}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </Card>

        {/* Essential nursing tips */}
        <Card tone="primary" style={{ marginBottom: 16 }}>
          <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>
            Essential Nursing Tips
          </Text>

          {nursingTips.map((tip, i) => (
            <View key={i} style={[styles.tipRow, { marginBottom: 12 }]}>
              <Text style={styles.tipEmoji}>{tip.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{tip.title}</Text>
                <Text style={styles.mutedSmall}>{tip.description}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Myths debunked */}
        <Card tone="outline" style={{ marginBottom: 16 }}>
          <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>
            Common Myths Debunked
          </Text>

          {mythBusters.map((m, i) => (
            <View key={i} style={styles.softBox}>
              <View style={styles.iconRow}>
                <Text style={styles.bad}>✗</Text>
                <Text style={[styles.body, styles.bold]}>{m.myth}</Text>
              </View>
              <View style={[styles.iconRow, { marginTop: 6 }]}>
                <Text style={styles.good}>✓</Text>
                <Text style={styles.mutedSmall}>{m.truth}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Signs of good supply */}
        <Card tone="primary" style={{ marginBottom: 16 }}>
          <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>
            Signs of Good Milk Supply
          </Text>
          <Text style={[styles.body, { marginBottom: 8 }]}>
            Your baby is getting enough milk if they:
          </Text>
          <View style={{ marginTop: 4 }}>
            {[
              "Have 6–8 wet diapers per day after the first week",
              "Are gaining weight steadily (check with pediatrician)",
              "Seem satisfied after most feedings",
              "Have good muscle tone and are alert when awake",
              "Make swallowing sounds while nursing",
            ].map((t, i) => (
              <View key={i} style={styles.iconRow}>
                <Text style={styles.good}>✓</Text>
                <Text style={styles.body}>{t}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* When to seek help */}
        <Card tone="outline" style={{ marginBottom: 20 }}>
          <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>
            When to Seek Help
          </Text>
          <Text style={[styles.body, { marginBottom: 8 }]}>
            Contact a lactation consultant or your healthcare provider if:
          </Text>

          {[
            "Baby is not gaining weight appropriately",
            "You experience severe pain during nursing",
            "Baby seems frustrated or unhappy at the breast",
            "You have fever, severe breast pain, or red streaks on breast (possible mastitis)",
            "Your milk supply suddenly decreases",
          ].map((t, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.body}>{t}</Text>
            </View>
          ))}

          <Text style={[styles.mutedSmall, styles.italic, styles.note]}>
            Remember: Fed is best. Whether you breastfeed, pump, supplement, or
            formula feed — you are doing what’s right for you and your baby.
          </Text>
        </Card>

        {/* Quote */}
        <LinearGradient
          colors={["#6C63FF", "rgba(108,99,255,0.15)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.quote}
        >
          <Text style={[styles.body, styles.italic, styles.center]}>
            “Your body knows how to nourish your baby. Trust the process and ask
            for help when you need it.” 💗
          </Text>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

/** ---------- Small building blocks ---------- */
const Card = ({
  children,
  style,
  tone = "default",
}: {
  children: React.ReactNode;
  style?: object;
  tone?: "default" | "primary" | "outline";
}) => {
  const background =
    tone === "primary"
      ? "rgba(108,99,255,0.12)"
      : tone === "outline"
      ? "#fff"
      : "#fff";
  const border =
    tone === "primary" ? "transparent" : "rgba(108,99,255,0.35)";
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: background, borderColor: border },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const ButtonGhost = ({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress: () => void;
  style?: object;
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    style={({ pressed }) => [
      styles.ghostBtn,
      { opacity: pressed ? 0.6 : 1 },
      style,
    ]}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {children}
    </View>
  </Pressable>
);

/** ---------- Styles ---------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F9FB" },
  container: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 28,
    maxWidth: 720,
    alignSelf: "center",
    width: "100%",
  },

  // Header
  hero: {
    height: 180,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroEmoji: { fontSize: 56 },

  // Typography
  title: { fontSize: 28, fontWeight: "700", color: "#111827", marginBottom: 6 },
  subtitle: { fontSize: 16, color: "#6B7280" },
  sectionTitle: { fontSize: 20, fontWeight: "600", color: "#111827" },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 4 },
  body: { fontSize: 16, lineHeight: 22, color: "#111827" },
  mutedSmall: { fontSize: 14, lineHeight: 20, color: "#6B7280" },
  bold: { fontWeight: "600" },
  italic: { fontStyle: "italic" },
  center: { textAlign: "center" },

  // Layout bits
  iconRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6 },
  tipRow: { flexDirection: "row", alignItems: "flex-start" },
  tipEmoji: { fontSize: 28, width: 36, textAlign: "center", marginTop: -2 },

  dotTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "rgba(108,99,255,1)", marginRight: 8 },

  softBox: {
    backgroundColor: "rgba(108,99,255,0.08)",
    borderRadius: 16,
    padding: 12,
  },

  // Bullets & signals
  bulletRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6 },
  bullet: { width: 18, textAlign: "center", lineHeight: 20, color: "#6B7280", fontSize: 16 },
  bad: { color: "#ef4444", fontWeight: "700", fontSize: 16, width: 18, textAlign: "center" },
  good: { color: "#6C63FF", fontWeight: "700", fontSize: 16, width: 18, textAlign: "center" },

  // Card & buttons
  card: {
    borderWidth: 2,
    borderRadius: 18,
    padding: 16,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 2 },
    }),
  },
  ghostBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  buttonGhostText: { fontSize: 15, color: "#111827" },

  quote: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },

  infoGroup: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
  },
  note: {
  backgroundColor: "rgba(108,99,255,0.12)",
  padding: 12,
  marginTop: 8,
},
});
