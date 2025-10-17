// app/components/modals/viewmealmodal.tsx
import React, { useMemo } from "react";
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

export type ViewMealModalProps = {
  visible: boolean;
  meal: {
    id: string;
    imageUri: string | null;
    capturedAt: Date;
    analysis: {
      meal_id: string;
      timestamp_iso: string;
      items: {
        name: string;
        quantity: number;
        unit: string;
        calories: number;
        macros: { protein_g: number; carbs_g: number; fat_g: number };
        confidence: number;
      }[];
      calories_total: number;
      suggestion?: string;
      assumptions?: string[];
      source_image_id?: string | null;
      model_version?: string | null;
    };
  } | null;
  onClose: () => void;
};

export default function ViewMealModal({ visible, meal, onClose }: ViewMealModalProps) {
  const totals = useMemo(() => {
    if (!meal) return { protein: 0, carbs: 0, fat: 0 };
    return meal.analysis.items.reduce(
      (acc, it) => ({
        protein: acc.protein + (it.macros?.protein_g ?? 0),
        carbs: acc.carbs + (it.macros?.carbs_g ?? 0),
        fat: acc.fat + (it.macros?.fat_g ?? 0),
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );
  }, [meal]);

  if (!meal) return null;

  const dt = new Date(meal.analysis.timestamp_iso || meal.capturedAt);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Meal details</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close meal details">
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {meal.imageUri ? (
              <Image source={{ uri: meal.imageUri }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.imagePlaceholder]}>
                <Ionicons name="image-outline" size={36} color="#9ca3af" />
              </View>
            )}

            <View style={styles.row}>
              <Text style={styles.kcal}>{Math.round(meal.analysis.calories_total)} kcal</Text>
              <Text style={styles.subtle}>
                {dt.toLocaleDateString()} • {dt.toLocaleTimeString()}
              </Text>
            </View>

            <View style={styles.pills}>
              <View style={styles.pill}>
                <Text style={styles.pillLabel}>Protein</Text>
                <Text style={styles.pillValue}>{Math.round(totals.protein)} g</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillLabel}>Carbs</Text>
                <Text style={styles.pillValue}>{Math.round(totals.carbs)} g</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillLabel}>Fat</Text>
                <Text style={styles.pillValue}>{Math.round(totals.fat)} g</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Items</Text>
            <View style={styles.card}>
              {meal.analysis.items.map((it, idx) => (
                <View key={`${it.name}-${idx}`} style={styles.itemRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{it.name}</Text>
                    <Text style={styles.itemSub}>
                      {it.quantity} {it.unit} • P {Math.round(it.macros?.protein_g ?? 0)}g · C{" "}
                      {Math.round(it.macros?.carbs_g ?? 0)}g · F {Math.round(it.macros?.fat_g ?? 0)}g
                    </Text>
                  </View>
                  <Text style={styles.itemKcal}>{Math.round(it.calories ?? 0)} kcal</Text>
                </View>
              ))}
            </View>

            {!!meal.analysis.suggestion && (
              <>
                <Text style={styles.sectionTitle}>Suggestion</Text>
                <View style={styles.card}>
                  <Text style={styles.bodyText}>{meal.analysis.suggestion}</Text>
                </View>
              </>
            )}

            {!!meal.analysis.assumptions?.length && (
              <>
                <Text style={styles.sectionTitle}>Assumptions</Text>
                <View style={styles.card}>
                  {meal.analysis.assumptions!.map((a, i) => (
                    <Text key={i} style={styles.bullet}>
                      • {a}
                    </Text>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
  sheet: {
    maxHeight: "88%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 16, fontWeight: "700", color: "#111827" },
  content: { padding: 16, gap: 12 },
  image: { width: "100%", height: 200, borderRadius: 12 },
  imagePlaceholder: { backgroundColor: "#f3f4f6", alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  kcal: { fontSize: 24, fontWeight: "800", color: "#111827" },
  subtle: { color: "#6b7280" },
  pills: { flexDirection: "row", gap: 8 },
  pill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  pillLabel: { fontSize: 12, color: "#6b7280" },
  pillValue: { fontSize: 16, fontWeight: "700", color: "#111827", marginTop: 2 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#111827", marginTop: 4 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    gap: 10,
  },
  itemRow: { flexDirection: "row", alignItems: "center" },
  itemName: { fontSize: 14, fontWeight: "600", color: "#111827" },
  itemSub: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  itemKcal: { fontSize: 14, fontWeight: "700", color: "#111827", marginLeft: 12 },
  bodyText: { fontSize: 13, color: "#111827", lineHeight: 18 },
  bullet: { fontSize: 13, color: "#111827", lineHeight: 18 },
});
