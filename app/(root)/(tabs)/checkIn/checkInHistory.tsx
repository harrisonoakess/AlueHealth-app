// app/(root)/(tabs)/checkIn/checkInHistory.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Calendar, Download } from "lucide-react-native";
import * as FileSystem from "expo-file-system";

/** ---- Shim for older/newer Expo typings that hide these constants ---- */
const getBaseDir = (): string => {
  const fsAny = FileSystem as any;
  // Prefer cacheDirectory; fall back to documentDirectory
  return (
    (fsAny?.cacheDirectory as string | undefined) ||
    (fsAny?.documentDirectory as string | undefined) ||
    "" // final fallback; Share on iOS accepts file:// or base64 (not used here)
  );
};

export default function CheckInHistory() {
  const router = useRouter();

  // Mock data for check-ins
  const checkIns = [
    {
      date: "2025-10-23",
      sleep: ":blush:",
      energy: 7,
      mood: "Happy",
      pain: 3,
      symptoms: ["Cramping"],
      feeding: "Breastfeeding",
      water: 8,
      notes: "Feeling much better today. Baby slept longer!",
    },
    {
      date: "2025-10-22",
      sleep: ":sleeping:",
      energy: 4,
      mood: "Tired",
      pain: 5,
      symptoms: ["Bleeding", "Fatigue"],
      feeding: "Combination",
      water: 6,
      notes: "Rough night. Need more rest.",
    },
    {
      date: "2025-10-21",
      sleep: ":blush:",
      energy: 6,
      mood: "Content",
      pain: 4,
      symptoms: ["Cramping"],
      feeding: "Breastfeeding",
      water: 9,
      notes: "Good day overall. Started walking again.",
    },
    {
      date: "2025-10-20",
      sleep: ":tired_face:",
      energy: 3,
      mood: "Overwhelmed",
      pain: 6,
      symptoms: ["Bleeding", "Cramping", "Soreness"],
      feeding: "Breastfeeding",
      water: 5,
      notes: "Very challenging day. Needed extra support.",
    },
  ];

  const emojiFromShortcode = (code: string) => {
    switch (code) {
      case ":blush:":
        return "😊";
      case ":sleeping:":
        return "😴";
      case ":tired_face:":
        return "😫";
      default:
        return "😌";
    }
  };

  const handleExport = async () => {
    try {
      const headers = [
        "Date",
        "Sleep",
        "Energy",
        "Mood",
        "Pain",
        "Symptoms",
        "Feeding",
        "Water",
        "Notes",
      ];

      const rows = checkIns.map((c) => [
        new Date(c.date).toLocaleDateString(),
        emojiFromShortcode(c.sleep),
        String(c.energy),
        c.mood,
        String(c.pain),
        c.symptoms.join("; "),
        c.feeding,
        `${c.water} glasses`,
        (c.notes || "").replace(/"/g, '""'), // escape quotes
      ]);

      const csv =
        headers.join(",") +
        "\n" +
        rows.map((r) => r.map((cell) => `"${cell}"`).join(",")).join("\n");

      const filename = `check-in-history-${new Date()
        .toISOString()
        .split("T")[0]}.csv`;

      const baseDir = getBaseDir();
      if (!baseDir) {
        Alert.alert(
          "Export unsupported",
          "No writable directory available on this device."
        );
        return;
      }

      const uri = `${baseDir}${filename}`;

      // Use a simple string literal to avoid enum typing differences across SDKs
      await FileSystem.writeAsStringAsync(uri, csv, {
        encoding: "utf8" as any,
      });

      if (Platform.OS === "ios") {
        await Share.share({ url: uri, message: "Check-In History CSV" });
      } else {
        // Android prefers a content:// URI
        const contentUri = await (FileSystem as any).getContentUriAsync?.(uri);
        await Share.share({
          url: contentUri || uri,
          message: "Check-In History CSV",
        });
      }
    } catch (e: any) {
      Alert.alert("Export failed", e?.message ?? "Could not export CSV.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => router.replace("/(root)/(tabs)/checkIn")}
              style={styles.iconBtn}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={20} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Check-In History</Text>
          </View>

          <TouchableOpacity
            onPress={handleExport}
            style={styles.exportBtn}
            accessibilityRole="button"
            accessibilityLabel="Export check-in history"
          >
            <Download size={16} color="#111827" />
            <Text style={styles.exportText}>Export</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          View your check-ins to share with your healthcare provider.
        </Text>

        {/* Cards */}
        <View style={{ gap: 12 }}>
          {checkIns.map((c) => (
            <View key={c.date} style={styles.card}>
              <View style={styles.dateRow}>
                <Calendar size={16} color="#9C72C2" />
                <Text style={styles.dateText}>
                  {new Date(c.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>

              {/* Grid-ish section */}
              <View style={styles.gridWrap}>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Sleep Quality</Text>
                  <Text style={styles.sleepEmoji}>
                    {emojiFromShortcode(c.sleep)}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Energy Level</Text>
                  <Text style={styles.valueStrong}>{c.energy}/10</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Mood</Text>
                  <Badge variant="secondary" text={c.mood} />
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Pain Level</Text>
                  <Text style={styles.valueStrong}>{c.pain}/10</Text>
                </View>
              </View>

              <View style={{ gap: 10 }}>
                <View>
                  <Text style={styles.label}>Symptoms</Text>
                  <View style={styles.badgeRow}>
                    {c.symptoms.map((s) => (
                      <Badge key={s} variant="outline" text={s} />
                    ))}
                  </View>
                </View>

                <View style={styles.gridPair}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Feeding</Text>
                    <Text style={styles.value}>{c.feeding}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Water Intake</Text>
                    <Text style={styles.value}>{c.water} glasses</Text>
                  </View>
                </View>

                {!!c.notes && (
                  <View>
                    <Text style={styles.label}>Notes</Text>
                    <Text style={styles.noteBox}>{c.notes}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ------- Tiny Badge component to mimic web variants ------- */
function Badge({
  variant,
  text,
}: {
  variant: "outline" | "secondary";
  text: string;
}) {
  const base = {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignSelf: "flex-start" as const,
  };
  if (variant === "secondary") {
    return (
      <View style={[base, { backgroundColor: "rgba(124,83,166,0.12)" }]}>
        <Text style={{ color: "#7B53A6", fontWeight: "700", fontSize: 12 }}>
          {text}
        </Text>
      </View>
    );
  }
  return (
    <View
      style={[
        base,
        {
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderColor: "#E5E7EB",
        },
      ]}
    >
      <Text style={{ color: "#111827", fontWeight: "600", fontSize: 12 }}>
        {text}
      </Text>
    </View>
  );
}

/* ------- Styles ------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4EAF8" }, // primary.50
  container: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 28 },

  // Header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#111827", marginLeft: 6 },

  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
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
  exportText: { fontSize: 13, color: "#111827", fontWeight: "700" },

  subtitle: { color: "#6B7280", marginBottom: 12, fontSize: 13 },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    marginBottom: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 2 },
    }),
  },

  dateRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  dateText: { fontSize: 15, fontWeight: "700", color: "#111827" },

  gridWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 16,
    rowGap: 10,
    marginBottom: 10,
  },
  gridItem: { width: "48%" },

  label: { fontSize: 12, color: "#6B7280", marginBottom: 4 },
  valueStrong: { fontSize: 14, fontWeight: "700", color: "#111827" },
  value: { fontSize: 14, color: "#111827", fontWeight: "600" },
  sleepEmoji: { fontSize: 22 },

  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  gridPair: { flexDirection: "row", gap: 16 },

  noteBox: {
    fontSize: 13,
    color: "#111827",
    backgroundColor: "#F3F4F6",
    padding: 10,
    borderRadius: 8,
  },
});
