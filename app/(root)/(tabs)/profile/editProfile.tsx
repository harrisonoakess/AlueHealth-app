// app/(root)/(tabs)/editProfile.tsx
import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
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

export default function EditProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "Emma",
    lastName: "Johnson",
    email: "emma.johnson@email.com",
    phone: "+1 (555) 123-4567",
    dueDate: "2025-06-15", // YYYY-MM-DD
  });

  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const dueDateRef = useRef<TextInput>(null);

  const initials = useMemo(() => {
    const a = formData.firstName?.[0] ?? "";
    const b = formData.lastName?.[0] ?? "";
    return `${a}${b}`.toUpperCase() || "👤";
  }, [formData.firstName, formData.lastName]);

  const onSave = () => {
    // TODO: persist to backend here
    Alert.alert("Profile updated", "Your profile has been successfully updated.", [
      { text: "OK", onPress: () => router.replace("/(root)/(tabs)/profile") },
    ]);
  };

  const openAvatarPicker = () => {
    // TODO: integrate expo-image-picker if desired
    Alert.alert("Change Photo", "Image picker coming soon.");
  };

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
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(t) => setFormData((s) => ({ ...s, firstName: t }))}
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
                accessibilityLabel="First Name"
              />
            </View>

            {/* Last Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                ref={lastNameRef}
                style={styles.input}
                value={formData.lastName}
                onChangeText={(t) => setFormData((s) => ({ ...s, lastName: t }))}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                accessibilityLabel="Last Name"
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
                returnKeyType="next"
                onSubmitEditing={() => dueDateRef.current?.focus()}
                accessibilityLabel="Phone Number"
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
            style={styles.saveBtn}
            accessibilityRole="button"
            accessibilityLabel="Save Changes"
          >
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: "#F4EAF8" },
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
  saveText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
});
