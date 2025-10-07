import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  meal: {
    id: string;
    name: string;
    imageUri: string;
    calories: number;
  } | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function MealModal({ visible, meal, onConfirm, onCancel }: Props) {
  if (!meal) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Image source={{ uri: meal.imageUri }} style={styles.image} />
          <Text style={styles.title}>{meal.name}</Text>
          <Text style={styles.details}>{meal.calories} kcal</Text>

          <TouchableOpacity style={[styles.button, styles.primary]} onPress={onConfirm}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.buttonText}>Track Calories & Store Meal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.secondary]} onPress={onCancel}>
            <Ionicons name="close-circle" size={20} color="#3b82f6" />
            <Text style={[styles.buttonText, { color: "#3b82f6" }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  image: { width: 120, height: 120, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  details: { fontSize: 14, color: "#6b7280", marginBottom: 20 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  primary: { backgroundColor: "#3b82f6" },
  secondary: { backgroundColor: "#f3f4f6", borderWidth: 1, borderColor: "#d1d5db" },
  buttonText: { fontSize: 14, fontWeight: "600", color: "#fff" },
});
