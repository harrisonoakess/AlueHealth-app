// app/(root)/(tabs)/editProfile.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
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
import { useRouter } from "expo-router";
import { ArrowLeft, Camera } from "lucide-react-native";
import { useProfile } from "../../../../lib/hooks/useProfile";

export default function EditProfile() {
  const router = useRouter();
  const { profile, loading, saving, error, updateProfile } = useProfile();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dueDate: "",
    dob: "",
  });
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const dueDateRef = useRef<TextInput>(null);
  const dobRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!profile) return;
    const parts = (profile.full_name ?? "").trim().split(/\s+/).filter(Boolean);
    const firstName = parts[0] ?? "";
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";

    setFormData((prev) => ({
      ...prev,
      firstName,
      lastName,
      dueDate: profile.due_date ?? "",
      dob: profile.date_of_birth ?? "",
    }));
  }, [profile]);

  const initials = useMemo(() => {
    const trimmed = formData.fullName.trim();
    if (!trimmed) return "👤";
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [formData.fullName]);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          if (active) {
            setProfileId(null);
          }
          return;
        }

        if (active) {
          setProfileId(user.id);
          setFormData((prev) => ({
            ...prev,
            email: user.email ?? prev.email,
            phone:
              (typeof user.user_metadata?.phone === "string" && user.user_metadata.phone) ||
              prev.phone,
          }));
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, date_of_birth, due_date, created_at")
          .eq("id", user.id)
          .maybeSingle<ProfileRecord>();

        if (error) throw error;
        if (!active) return;

        if (data) {
          setFormData({
            fullName: data.full_name ?? "",
            email: user.email ?? "",
            phone:
              (typeof user.user_metadata?.phone === "string" && user.user_metadata.phone) || "",
            dueDate: data.due_date ?? "",
            dateOfBirth: data.date_of_birth ?? "",
          });
        }
      } catch (error) {
        console.error("Failed to load profile", error);
        if (active) {
          Alert.alert("Error", "Unable to load your profile right now. Please try again later.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const validateDate = (value: string) => {
    if (!value) return true;
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  };

  const onSave = async () => {
    if (!formData.firstName && !formData.lastName) {
      Alert.alert("Missing name", "Please provide at least a first or last name.");
      return;
    }

    if (!validateDate(formData.dob)) {
      Alert.alert("Invalid DOB", "Use the YYYY-MM-DD format for your birth date.");
      return;
    }

    if (!validateDate(formData.dueDate)) {
      Alert.alert("Invalid due date", "Use the YYYY-MM-DD format for your due date.");
      return;
    }

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    try {
      await updateProfile({
        full_name: fullName || null,
        date_of_birth: formData.dob || null,
        due_date: formData.dueDate || null,
      });

      Alert.alert("Profile updated", "Your profile has been successfully updated.", [
        { text: "OK", onPress: () => router.replace("/(root)/(tabs)/profile") },
      ]);
    } catch (err: any) {
      Alert.alert("Update failed", err?.message ?? "Unable to save your changes right now.");
    }
  };

  const openAvatarPicker = () => {
    // TODO: integrate expo-image-picker if desired
    Alert.alert("Change Photo", "Image picker coming soon.");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#7B53A6" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.replace("/(root)/(tabs)/profile")}
              style={styles.iconBtn}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={20} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
          </View>

          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <View style={styles.avatarOuter}>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={openAvatarPicker}
              style={styles.cameraFab}
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
            >
              <Camera size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* First Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={formData.fullName}
                onChangeText={(t) => setFormData((s) => ({ ...s, fullName: t }))}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                accessibilityLabel="Full Name"
              />
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                ref={emailRef}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                value={formData.email}
                onChangeText={(t) => setFormData((s) => ({ ...s, email: t }))}
                editable={!loading && !saving}
                returnKeyType="next"
                onSubmitEditing={() => phoneRef.current?.focus()}
                accessibilityLabel="Email"
              />
            </View>

            {/* Phone */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                ref={phoneRef}
                style={styles.input}
                keyboardType="phone-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
                value={formData.phone}
                onChangeText={(t) => setFormData((s) => ({ ...s, phone: t }))}
                editable={!saving}
                returnKeyType="next"
                onSubmitEditing={() => dobRef.current?.focus()}
                accessibilityLabel="Phone Number"
              />
            </View>

            {/* Date of Birth */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <TextInput
                ref={dobRef}
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={formData.dob}
                onChangeText={(t) => setFormData((s) => ({ ...s, dob: t }))}
                returnKeyType="next"
                onSubmitEditing={() => dueDateRef.current?.focus()}
                accessibilityLabel="Date of Birth"
              />
            </View>

            {/* Due Date / Birth Date */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Due Date / Birth Date</Text>
              <TextInput
                ref={dueDateRef}
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={formData.dueDate}
                onChangeText={(t) => setFormData((s) => ({ ...s, dueDate: t }))}
                editable={!saving}
                returnKeyType="done"
                accessibilityLabel="Due or Birth Date"
              />
              {/* For a native date picker later:
                 - install @react-native-community/datetimepicker
                 - show picker in a modal and update formData.dueDate */}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={onSave}
            disabled={saving}
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            accessibilityRole="button"
            accessibilityLabel="Save Changes"
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveText}>Save Changes</Text>
            )}
          </TouchableOpacity>
          {!!error && <Text style={styles.errorText}>{error}</Text>}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: "#F4EAF8" },
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },

  // Header
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111827" },

  // Avatar
  avatarWrap: { alignItems: "center", marginBottom: 20 },
  avatarOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 4,
    borderColor: "#7B53A6",
  },
  avatarInner: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9D8F0",
  },
  avatarText: { fontSize: 28, fontWeight: "800", color: "#9C72C2" },
  cameraFab: {
    position: "absolute",
    right: (108 - 96) / 2,
    bottom: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7B53A6",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  fieldGroup: { marginTop: 12 },
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

  // Save
  saveBtn: {
    marginTop: 16,
    width: "100%",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7B53A6",
    shadowColor: "#7B53A6",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  saveBtnDisabled: { opacity: 0.7 },
  saveText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  errorText: { marginTop: 12, textAlign: "center", color: "#B91C1C" },
});
