// app/(auth)/sign-up.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity, // <-- use a visible, full-width button style
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { supabase } from "../../lib/supabase"; // keep this path consistent with your sign-in file

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const validateForm = () => {
    if (!email || !password || !confirm) {
      setErrorMessage("Email, password, and confirmation are required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email");
      return false;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirm) {
      setErrorMessage("Passwords do not match");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    try {
      setSubmitting(true);
      setInfoMessage("");

      const { error } = await supabase.auth.signUp({
        email,
        password,
        // options: { emailRedirectTo: "aluehealth://auth-callback" },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      // If confirmation is required, no session yet:
      const { data: sessionRes } = await supabase.auth.getSession();
      if (sessionRes?.session) {
        router.replace("/(auth)/(onboarding)/enter_info");
      } else {
        setInfoMessage(
          "Check your email to confirm your account. Once verified, return and sign in."
        );
      }
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
            <Text style={styles.title} accessibilityRole="header">
              Create Account
            </Text>
            <Text style={styles.subtitle}>Join Alue to track your nutrition</Text>

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
                textContentType="newPassword"
                autoCapitalize="none"
                autoComplete="password-new"
                value={password}
                onChangeText={setPassword}
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
                accessibilityLabel="Password"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                ref={confirmRef}
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                textContentType="password"
                autoCapitalize="none"
                autoComplete="password-new"
                value={confirm}
                onChangeText={setConfirm}
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
                accessibilityLabel="Confirm Password"
              />
            </View>

            {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
            {!!infoMessage && <Text style={styles.info}>{infoMessage}</Text>}

            {/* BIG, CLEAR, FULL-WIDTH CREATE ACCOUNT BUTTON */}
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={!email || !password || !confirm || submitting}
              style={[
                styles.createButton,
                (!email || !password || !confirm || submitting) && styles.createButtonDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Create Account"
              testID="create-account-button"
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.createButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.muted}>Already have an account? </Text>
              <Link
                href="/(auth)/sign-in"
                style={styles.link}
                accessibilityRole="link"
                accessibilityLabel="Go to Sign In"
              >
                Sign In
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
  info: { marginTop: 10, textAlign: "center", color: "#047857", fontSize: 14 }, // green-700

  // Primary Create Account button — full width, high contrast
  createButton: {
    marginTop: 20,
    width: "100%",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7B53A6", // primary.500
    shadowColor: "#7B53A6",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  createButtonDisabled: { opacity: 0.7 },
  createButtonText: { fontWeight: "800", fontSize: 17, color: "#FFFFFF" },

  footerRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  muted: { color: "#6B7280", fontSize: 14 },
  link: { fontSize: 14, fontWeight: "600", textDecorationLine: "underline", color: "#9C72C2" },
});
