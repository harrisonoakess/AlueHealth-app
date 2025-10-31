// app/(auth)/sign-in.tsx
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const passwordRef = useRef<TextInput>(null);

  const validate = () => {
    if (!email || !password) {
      setErrorMessage("Email and password are required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const afterLogin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("onboarding_complete")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (!profile || !profile.onboarding_complete) {
      router.replace("/(auth)/(onboarding)/enter_info");
    } else {
      router.replace("/(root)/(tabs)/checkIn");
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setSubmitting(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMessage(error.message);
        return;
      }
      await afterLogin();
    } catch (err: any) {
      setErrorMessage(err?.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoSignIn = async () => {
    setErrorMessage("");
    try {
      setSubmitting(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: "xorej44434@camjoint.com",
        password: "password",
      });
      if (error) {
        setErrorMessage(error.message);
        return;
      }
      await afterLogin();
    } catch (err: any) {
      setErrorMessage(err?.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title} accessibilityRole="header">Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your wellness journey</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                accessibilityLabel="Email"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                ref={passwordRef}
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                textContentType="password"
                autoCapitalize="none"
                autoComplete="password"
                value={password}
                onChangeText={setPassword}
                returnKeyType="go"               // Keyboard "Go" logs in too
                onSubmitEditing={handleSubmit}
                accessibilityLabel="Password"
              />
            </View>

            {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

            {/* ---------- CLEAR, FULL-WIDTH LOGIN BUTTON ---------- */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitting}
              style={[styles.loginButton, submitting && styles.loginButtonDisabled]}
              accessibilityRole="button"
              accessibilityLabel="Login"
              testID="login-button"
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Demo Account */}
            <TouchableOpacity
              onPress={handleDemoSignIn}
              disabled={submitting}
              style={[styles.demoButton, submitting && styles.demoButtonDisabled]}
              accessibilityRole="button"
              accessibilityLabel="Use Demo Account"
              testID="demo-login-button"
            >
              {submitting ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.demoText}>Use Demo Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.muted}>Don't have an account? </Text>
              <Link href="/(auth)/sign-up" style={styles.link} accessibilityRole="link">
                Sign up
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: "#F4EAF8" }, // primary.50
  container: {
    flexGrow: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  title: { fontSize: 22, fontWeight: "800", textAlign: "center", color: "#111827" },
  subtitle: { marginTop: 6, textAlign: "center", color: "#6B7280" },
  fieldGroup: { marginTop: 16 },
  label: { marginBottom: 6, fontSize: 14, fontWeight: "600", color: "#374151" },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 10 }),
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  error: { marginTop: 10, textAlign: "center", color: "#EF4444", fontSize: 14 },

  // Primary Login button (full width, purple background)
  loginButton: {
    marginTop: 20,
    width: "100%",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7B53A6",
    shadowColor: "#7B53A6",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  loginButtonDisabled: { opacity: 0.7 },
  loginText: { fontWeight: "800", fontSize: 17, color: "#FFFFFF" },

  // Demo button (outline style)
  demoButton: {
    marginTop: 12,
    width: "100%",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
    backgroundColor: "#FFFFFF",
  },
  demoButtonDisabled: { opacity: 0.6 },
  demoText: { fontWeight: "700", fontSize: 16, color: "#111827" },

  footerRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  muted: { color: "#6B7280", fontSize: 14 },
  link: { fontSize: 14, fontWeight: "600", textDecorationLine: "underline", color: "#9C72C2" },
});
