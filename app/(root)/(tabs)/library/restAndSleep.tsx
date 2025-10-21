// app/(library)/RestRecoveryArticle.tsx
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
import { ArrowLeft, Moon, Clock, Heart, Lightbulb } from "lucide-react-native";

const RestRecoveryArticle = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
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
            style={styles.emojiBadge}
          >
            <Text style={styles.emoji}>☾</Text>
          </LinearGradient>

          <Text style={styles.title}>Rest & Sleep for Recovery</Text>
          <Text style={styles.muted}>
            Prioritizing rest is essential for your postpartum healing. Here's
            how to get the sleep your body needs.
          </Text>
        </View>

        {/* Heart note */}
        <Card tone="accent" style={{ marginBottom: 24 }}>
          <View style={styles.rowStart}>
            <Heart size={18} style={{ marginRight: 10 }} />
            <Text style={styles.body}>
              <Text style={styles.bold}>Remember:</Text> Rest is not a
              luxury—it's a necessity for healing. Your body did something
              incredible, and it needs time to recover.
            </Text>
          </View>
        </Card>

        {/* Why rest matters */}
        <SectionHeader
          icon={<Moon size={22} />}
          title="Why Rest Matters Postpartum"
        />
        <View style={{ marginBottom: 24 }}>
          <Text style={styles.body}>
            Your body is recovering from pregnancy and birth, adjusting to
            hormonal changes, and working hard to produce milk if you're
            breastfeeding. Quality rest supports:
          </Text>
          <BulletList
            items={[
              "Physical healing and tissue repair",
              "Hormonal regulation and mood stability",
              "Immune system function",
              "Milk production and supply",
              "Mental clarity and emotional resilience",
            ]}
          />
        </View>

        {/* Sleep strategies */}
        <SectionHeader
          icon={<Clock size={22} />}
          title="Sleep Strategies That Work"
        />
        <View style={{ marginBottom: 24 }}>
          <Card>
            <CardTitle>1. Sleep When Baby Sleeps</CardTitle>
            <Text style={styles.mutedSmall}>
              This classic advice is crucial in the early weeks. Don't worry
              about chores—rest is your top priority. Even 20–30 minute naps can
              help you recover.
            </Text>
          </Card>

          <Card>
            <CardTitle>2. Create a Sleep-Friendly Environment</CardTitle>
            <BulletList
              small
              items={[
                "Keep your bedroom dark, quiet, and cool",
                "Use white noise to mask sudden sounds",
                "Have a bassinet or co-sleeper within reach",
                "Keep night feeding supplies ready and accessible",
              ]}
            />
          </Card>

          <Card>
            <CardTitle>3. Take Shifts with Your Partner</CardTitle>
            <Text style={[styles.mutedSmall, { marginBottom: 8 }]}>
              Divide nighttime duties so each person gets a longer stretch of
              uninterrupted sleep. For example:
            </Text>
            <BulletList
              small
              items={[
                "One person takes 9pm–2am, the other 2am–7am",
                "If bottle feeding, partner can handle some night feeds",
                "Use a pumped bottle so you can sleep longer stretches",
              ]}
            />
          </Card>

          <Card>
            <CardTitle>4. Limit Screen Time Before Sleep</CardTitle>
            <Text style={styles.mutedSmall}>
              Blue light from phones disrupts melatonin production. Try to avoid
              scrolling for at least 30 minutes before sleep. Use night mode if
              you need to check your phone during night wakings.
            </Text>
          </Card>

          <Card>
            <CardTitle>5. Accept Help</CardTitle>
            <Text style={styles.mutedSmall}>
              Let others handle cooking, cleaning, or holding baby while you
              rest. This isn't the time to be a superhero—it's the time to heal.
            </Text>
          </Card>
        </View>

        {/* Quick rest boosters */}
        <SectionHeader
          icon={<Lightbulb size={22} />}
          title="Quick Rest Boosters"
        />
        <View style={{ marginBottom: 24 }}>
          <Card tone="accent">
            <CardTitle>☀️ Morning Sunlight</CardTitle>
            <Text style={styles.mutedSmall}>
              Get 10–15 minutes of natural light in the morning to help regulate
              your circadian rhythm and improve nighttime sleep quality.
            </Text>
          </Card>

          <Card tone="accent">
            <CardTitle>🧘‍♀️ Restorative Rest</CardTitle>
            <Text style={styles.mutedSmall}>
              Can't sleep? Lie down with your eyes closed, practice deep
              breathing, or listen to calming music. Your body still benefits
              from this rest.
            </Text>
          </Card>

          <Card tone="accent">
            <CardTitle>🍵 Avoid Caffeine After 2pm</CardTitle>
            <Text style={styles.mutedSmall}>
              While that afternoon coffee is tempting, it can interfere with
              evening sleep. Try herbal tea or water with lemon instead.
            </Text>
          </Card>

          <Card tone="accent">
            <CardTitle>📱 Set Boundaries</CardTitle>
            <Text style={styles.mutedSmall}>
              Put your phone on “Do Not Disturb” during rest times. Non-urgent
              messages can wait—your recovery cannot.
            </Text>
          </Card>
        </View>

        {/* When to seek help */}
        <Card tone="primary" style={{ marginBottom: 24 }}>
          <Text style={[styles.cardTitle, { marginBottom: 8 }]}>
            When to Seek Help
          </Text>
          <Text style={[styles.mutedSmall, { marginBottom: 8 }]}>
            Contact your healthcare provider if you experience:
          </Text>
          <BulletList
            small
            items={[
              "Persistent insomnia even when baby is sleeping",
              "Extreme exhaustion that doesn't improve with rest",
              "Difficulty falling back asleep after night wakings",
              "Feelings of hopelessness or depression affecting sleep",
              "Racing thoughts or anxiety preventing rest",
            ]}
          />
        </Card>

        <View style={{ marginTop: 8, marginBottom: 40 }}>
          <Text style={[styles.muted, { fontStyle: "italic", textAlign: "center" }]}>
            Rest is productive. Rest is healing. Rest is brave. 💜
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RestRecoveryArticle;

/** ---------- Small building blocks ---------- */
const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <View style={{ marginBottom: 12, flexDirection: "row", alignItems: "center" }}>
    <View style={{ marginRight: 8 }}>{icon}</View>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const Card = ({
  children,
  style,
  tone = "default",
}: {
  children: React.ReactNode;
  style?: object;
  tone?: "default" | "accent" | "primary";
}) => {
  const background =
    tone === "accent" ? "rgba(108,99,255,0.08)" : tone === "primary" ? "rgba(108,99,255,0.12)" : "#fff";
  const border =
    tone === "accent" || tone === "primary" ? "rgba(108,99,255,0.35)" : "rgba(0,0,0,0.08)";
  return (
    <View style={[styles.card, { backgroundColor: background, borderColor: border }, style]}>
      {children}
    </View>
  );
};

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <Text style={[styles.cardTitle, { marginBottom: 6 }]}>{children}</Text>
);

const BulletList = ({ items, small = false }: { items: string[]; small?: boolean }) => (
  <View style={{ marginTop: 6 }}>
    {items.map((t, i) => (
      <View key={i} style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={small ? styles.mutedSmall : styles.body}>{t}</Text>
      </View>
    ))}
  </View>
);

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
    <View style={{ flexDirection: "row", alignItems: "center" }}>{children}</View>
  </Pressable>
);

/** ---------- Styles ---------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F9FB" },
  container: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
    maxWidth: 720,
    alignSelf: "center",
    width: "100%",
  },
  emojiBadge: {
    width: 80,
    height: 80,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emoji: { fontSize: 36 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
  },
  cardTitle: {
    fontSize: 16,        // or 18 if you want it larger
    fontWeight: "600",
    color: "#111827",    // matches your neutral-900-ish
  },
  body: { fontSize: 16, lineHeight: 22, color: "#111827" },
  bold: { fontWeight: "600" },
  muted: { fontSize: 15, lineHeight: 21, color: "#6B7280" },
  mutedSmall: { fontSize: 14, lineHeight: 20, color: "#6B7280" },
  rowStart: { flexDirection: "row", alignItems: "flex-start" },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 2 },
    }),
  },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6 },
  bullet: { width: 16, textAlign: "center", lineHeight: 20, color: "#6B7280", fontSize: 16 },
  ghostBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  buttonGhostText: { fontSize: 15, color: "#111827" },
});
