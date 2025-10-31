// app/(root)/(tabs)/logout.tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import { supabase } from "../../../../lib/supabase";

export default function Logout() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setError(null);
    setSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
        return;
      }
      router.replace("/(auth)/sign-in");
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong.");
    } finally {
      setSigningOut(false);
    }
  };

  useEffect(() => {
    handleSignOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.card}>
          <LogOut size={28} color="#7B53A6" />
          <Text style={styles.title}>Logging Out</Text>
          <Text style={styles.subtitle}>
            We’re signing you out of AlueHealth.
          </Text>

          {signingOut && <ActivityIndicator style={{ marginTop: 12 }} />}

          {error && (
            <>
              <Text style={styles.error}>{error}</Text>
              <TouchableOpacity
                onPress={handleSignOut}
                style={[styles.button, styles.primary]}
                accessibilityRole="button"
              >
                <Text style={styles.primaryText}>Try Again</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            onPress={() => router.replace("/(auth)/sign-in")}
            style={[styles.button, styles.secondary]}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryText}>Go to Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/(root)/(tabs)/checkIn")}
            style={[styles.linkBtn]}
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>Cancel and go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4EAF8" },
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  title: { marginTop: 10, fontSize: 20, fontWeight: "800", color: "#111827" },
  subtitle: { marginTop: 6, fontSize: 14, color: "#6B7280", textAlign: "center" },
  error: { marginTop: 12, color: "#EF4444", textAlign: "center" },

  button: {
    width: "100%",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  primary: { backgroundColor: "#7B53A6" },
  primaryText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },

  secondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
  },
  secondaryText: { color: "#111827", fontSize: 16, fontWeight: "700" },

  linkBtn: { marginTop: 8, paddingVertical: 8 },
  linkText: { color: "#9C72C2", fontWeight: "600", textDecorationLine: "underline" },
});
