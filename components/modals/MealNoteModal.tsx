import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  imageUri: string | null;
  note: string;
  onChangeNote: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function MealNoteModal({
  visible,
  imageUri,
  note,
  onChangeNote,
  onConfirm,
  onCancel,
}: Props) {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Add Meal Details</Text>
          <Text style={styles.subtitle}>
            Optional: add a short note so the assistant understands this meal better.
          </Text>

          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <Ionicons name="image-outline" size={36} color="#9ca3af" />
            </View>
          )}

          <TextInput
            value={note}
            onChangeText={onChangeNote}
            placeholder="e.g. Homemade chicken salad with extra dressing"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.secondary]} onPress={onCancel}>
              <Ionicons name="close-circle" size={20} color="#7B53A6" />
              <Text style={[styles.buttonText, styles.secondaryText]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.primary]} onPress={onConfirm}>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={[styles.buttonText, styles.primaryText]}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    shadowColor: "#7B53A6",
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 6, textAlign: "center" },
  subtitle: { fontSize: 13, color: "#6b7280", textAlign: "center", marginBottom: 16 },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 16,
  },
  placeholder: {
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 12,
    textAlignVertical: "top",
    fontSize: 14,
    minHeight: 90,
    color: "#111827",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primary: {
    backgroundColor: "#7B53A6",
    shadowColor: "#7B53A6",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  secondary: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB" },
  buttonText: { fontSize: 14, fontWeight: "700" },
  primaryText: { color: "#FFFFFF" },
  secondaryText: { color: "#7B53A6" },
});
