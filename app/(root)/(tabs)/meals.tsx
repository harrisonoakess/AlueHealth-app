import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import MealModal from "../../../components/modals/AfterPictureModal";
import {
  analyzeMealImage,
  MealAnalysisResponse,
} from "../../../lib/mealAnalysis";

type LoggedMeal = {
  id: string;
  imageUri: string;
  capturedAt: Date;
  analysis: MealAnalysisResponse;
};

export default function MealsTab() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [meals, setMeals] = useState<LoggedMeal[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingMeal, setPendingMeal] = useState<LoggedMeal | null>(null);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera access is required to take photos");
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Media library access is required to select photos");
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const handleSelectPhoto = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to select photo. Please try again.");
    }
  };

  const processImage = async (imageUri: string) => {
    setIsAnalyzing(true);
    setShowModal(false);
    setPendingMeal(null);

    try {
      const analysis = await analyzeMealImage(imageUri);
      const newMeal: LoggedMeal = {
        id: analysis.meal_id ?? Date.now().toString(),
        imageUri,
        capturedAt: new Date(),
        analysis,
      };

      setPendingMeal(newMeal);
      setShowModal(true);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Failed to analyze the image. Please try again.";
      Alert.alert("Analysis failed", message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const confirmMeal = () => {
    if (!pendingMeal) return;
    setMeals((prev) => [pendingMeal, ...prev]);
    setPendingMeal(null);
    setShowModal(false);
  };

  const cancelMeal = () => {
    setPendingMeal(null);
    setShowModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Today&apos;s Meals</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Add New Meal</Text>

          {isAnalyzing ? (
            <View style={styles.analyzing}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.analyzingText}>Analyzing your meal...</Text>
              <Text style={styles.infoText}>This may take a few seconds</Text>
            </View>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleTakePhoto}
              >
                <Ionicons name="camera" size={24} color="#fff" />
                <Text style={styles.buttonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleSelectPhoto}
              >
                <Ionicons name="images" size={24} color="#3b82f6" />
                <Text style={[styles.buttonText, { color: "#3b82f6" }]}>
                  Gallery
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          {meals.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>No meals logged today</Text>
              <Text style={styles.infoText}>
                Take a photo of your food to get started!
              </Text>
            </View>
          ) : (
            meals.map((meal) => {
              const itemSummary = meal.analysis.items.map((item) => item.name).join(", ");
              const totalCalories = Math.round(meal.analysis.calories_total);
              const macros = meal.analysis.items.reduce(
                (acc, item) => ({
                  protein: acc.protein + item.macros.protein_g,
                  carbs: acc.carbs + item.macros.carbs_g,
                  fat: acc.fat + item.macros.fat_g,
                }),
                { protein: 0, carbs: 0, fat: 0 },
              );

              return (
                <View key={meal.id} style={styles.mealCard}>
                  <Image source={{ uri: meal.imageUri }} style={styles.mealImage} />
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>
                      {itemSummary || "Meal"}
                    </Text>
                    <Text style={styles.mealDetails}>
                      {totalCalories} kcal • {meal.capturedAt.toLocaleTimeString()}
                    </Text>
                    <Text style={styles.macroLine}>
                      P {Math.round(macros.protein)}g · C {Math.round(macros.carbs)}g · F {Math.round(macros.fat)}g
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
      <MealModal
        visible={showModal}
        meal={pendingMeal}
        onConfirm={confirmMeal}
        onCancel={cancelMeal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20 },
  header: { marginBottom: 24, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", color: "#111" },
  date: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  section: { marginBottom: 32 },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  buttonRow: { flexDirection: "row", gap: 12 },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
  },
  primaryButton: { backgroundColor: "#3b82f6" },
  secondaryButton: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  buttonText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  analyzing: { alignItems: "center", paddingVertical: 20 },
  analyzingText: { fontSize: 16, fontWeight: "600", marginTop: 12 },
  infoText: { fontSize: 12, textAlign: "center", color: "#6b7280", marginTop: 4 },
  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyText: { fontSize: 16, fontWeight: "600", marginTop: 12 },
  mealCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  mealImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  mealInfo: { flex: 1 },
  mealName: { fontSize: 16, fontWeight: "600", color: "#111" },
  mealDetails: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  macroLine: { fontSize: 12, color: "#4b5563", marginTop: 4 },
});
