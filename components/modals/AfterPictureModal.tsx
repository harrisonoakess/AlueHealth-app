import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MealAnalysisResponse } from "../../lib/mealAnalysis";

type Props = {
  visible: boolean;
  meal: {
    id: string;
    imageUri: string | null;
    analysis: MealAnalysisResponse;
  } | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function MealModal({ visible, meal, onConfirm, onCancel }: Props) {
  if (!meal || !visible) return null;

  const { analysis } = meal;
  const totalCalories = Math.round(analysis.calories_total);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* image (safe for string | null) */}
          {meal.imageUri ? (
            <Image source={{ uri: meal.imageUri }} style={styles.image} />
          ) : (
            <View
              style={[
                styles.image,
                { backgroundColor: "#f3f4f6", alignItems: "center", justifyContent: "center" },
              ]}
            >
              <Ionicons name="image-outline" size={36} color="#9ca3af" />
            </View>
          )}

          <Text style={styles.title}>Estimated Total</Text>
          <Text style={styles.totalCalories}>{totalCalories} kcal</Text>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Detected items</Text>
            {analysis.items.map((item, index) => (
              <View key={`${meal.id}-${index}`} style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDetails}>
                    {item.quantity} {item.unit} • {Math.round(item.calories)} kcal
                  </Text>
                  <Text style={styles.macrosText}>
                    P {Math.round(item.macros.protein_g)}g · C {Math.round(item.macros.carbs_g)}g · F{" "}
                    {Math.round(item.macros.fat_g)}g
                  </Text>
                </View>
                <View style={styles.confidencePill}>
                  <Text style={styles.confidenceText}>{Math.round(item.confidence * 100)}%</Text>
                </View>
              </View>
            ))}

            {analysis.suggestion ? (
              <View style={styles.infoBlock}>
                <Text style={styles.sectionTitle}>Suggestion</Text>
                <Text style={styles.infoText}>{analysis.suggestion}</Text>
              </View>
            ) : null}

            {analysis.assumptions?.length ? (
              <View style={styles.infoBlock}>
                <Text style={styles.sectionTitle}>Assumptions</Text>
                {analysis.assumptions.map((assumption) => (
                  <Text key={assumption} style={styles.infoText}>
                    • {assumption}
                  </Text>
                ))}
              </View>
            ) : null}
          </ScrollView>

          <TouchableOpacity style={[styles.button, styles.primary]} onPress={onConfirm}>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Track Calories & Store Meal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.secondary]} onPress={onCancel}>
            <Ionicons name="close-circle" size={20} color="#7B53A6" />
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Try Again</Text>
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
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    shadowColor: "#7B53A6",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: "center",
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 4, textAlign: "center", color: "#7B53A6" },
  totalCalories: { fontSize: 16, color: "#1F2937", marginBottom: 12, textAlign: "center" },
  scrollArea: { width: "100%", marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#111827" },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
  },
  itemName: { fontSize: 14, fontWeight: "600", color: "#111827" },
  itemDetails: { fontSize: 12, color: "#4b5563", marginTop: 2 },
  macrosText: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  confidencePill: {
    backgroundColor: "rgba(123, 83, 166, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 12,
  },
  confidenceText: { fontSize: 12, fontWeight: "600", color: "#7B53A6" },
  infoBlock: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F7F2FB",
  },
  infoText: { fontSize: 12, color: "#4b5563", lineHeight: 16 },
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
  primary: {
    backgroundColor: "#7B53A6",
    shadowColor: "#7B53A6",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  secondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  buttonText: { fontSize: 14, fontWeight: "700" },
  buttonTextPrimary: { color: "#FFFFFF" },
  buttonTextSecondary: { color: "#7B53A6" },
});
