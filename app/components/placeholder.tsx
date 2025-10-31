// components/Placeholder.tsx
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

type Props = { title: string; subtitle?: string };

export default function Placeholder({ title, subtitle = "Page coming soon." }: Props) {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <TouchableOpacity onPress={() => router.back()} style={[styles.btn, styles.secondary]}>
          <Text style={styles.secondaryText}>Go Back</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/")} style={styles.btn}>
          <Text style={styles.btnText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4EAF8" },
  container: { flex: 1, padding: 24, alignItems: "center", justifyContent: "center", gap: 12 },
  title: { fontSize: 24, fontWeight: "800", color: "#111827", textAlign: "center" },
  subtitle: { fontSize: 16, color: "#6B7280", textAlign: "center" },
  btn: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7B53A6",
  },
  btnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  secondary: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "rgba(0,0,0,0.15)" },
  secondaryText: { color: "#111827", fontSize: 16, fontWeight: "700" },
});
