// meals.tsx
import React, { useCallback, useEffect, useState } from "react";
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
import { supabase } from "../../../lib/supabase"

import MealModal from "../../../components/modals/AfterPictureModal";
import {
  analyzeMealImage,
  MealAnalysisResponse,
} from "../../../lib/mealAnalysis";

type LoggedMeal = {
  id: string;
  imageUri: string | null;
  capturedAt: Date;
  analysis: MealAnalysisResponse;
};

type MealItemRow = {
  name: string | null;
  quantity: number | null;
  unit: string | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  confidence: number | null;
};

type MealRow = {
  id: string;
  occurred_at: string;
  calories_total: number | null;
  note: string | null;
  image_path: string | null;
  image_mime: string | null;
  meal_items: MealItemRow[] | null;
};

const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour
const mealPlaceholder = require("../../../assets/images/icon.png");

// === B) Helper: upload the image to your private bucket ===
// Saves to meal-images/<account_id>/<meal_id>.<ext> and returns the path + mime.
async function uploadMealImage(
  accountId: string,
  mealId: string,
  imageUri: string
): Promise<{ path: string; mime: string }> {
  // Expo/React Native: read file contents into an ArrayBuffer
  const res = await fetch(imageUri);
  const arrayBuffer = await res.arrayBuffer();
  const headerMime = res.headers.get("Content-Type") ?? "";
  const mime = headerMime || (await detectMimeFromUri(imageUri)) || "image/jpeg";
  const ext = mime.includes("png") ? "png" : "jpg";
  const path = `${accountId}/${mealId}.${ext}`;

  const { error } = await supabase
    .storage
    .from("meal-images") // must match your bucket id
    .upload(path, arrayBuffer, { contentType: mime, upsert: true, duplex: "half" });

  if (error) {
    console.error("Supabase storage upload failed", error);
    throw new Error(error.message ?? "Storage upload failed");
  }
  return { path, mime };
}

async function detectMimeFromUri(uri: string): Promise<string | null> {
  const extension = uri.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "heic":
    case "heif":
      return "image/heic";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    default:
      return null;
  }
}

// === C) Helper: insert into meals + meal_items ===
async function saveMealToDb(
  accountId: string,
  analysis: MealAnalysisResponse,
  imagePath: string,
  imageMime: string
): Promise<string> {
  // parent row (meals)
  const occurred_at = analysis.timestamp_iso ?? new Date().toISOString();
  const calories_total = Math.round(analysis.calories_total);

  const { data: mealRow, error: mealErr } = await supabase
    .from("meals")
    .insert({
      account_id: accountId,
      occurred_at,
      calories_total,
      note: analysis.suggestion ?? null, // optional: stash model suggestion
      image_path: imagePath,
      image_mime: imageMime,
    })
    .select("id")
    .single();

  if (mealErr) throw mealErr;
  const mealId = mealRow.id as string;

  // child rows (meal_items)
  const itemsPayload = analysis.items.map((it) => ({
    meal_id: mealId,
    name: it.name,
    // your modal uses top-level `quantity` and `unit`
    quantity: it.quantity ?? 1,
    unit: it.unit ?? "unit",
    calories: it.calories != null ? Math.round(it.calories) : null,
    protein_g: it.macros?.protein_g ?? null,
    carbs_g: it.macros?.carbs_g ?? null,
    fat_g: it.macros?.fat_g ?? null,
    confidence: it.confidence ?? null, // keep 0..1 as stored value
  }));

  if (itemsPayload.length) {
    const { error: itemsErr } = await supabase.from("meal_items").insert(itemsPayload);
    if (itemsErr) throw itemsErr;
  }

  return mealId;
}



export default function MealsTab() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [meals, setMeals] = useState<LoggedMeal[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingMeal, setPendingMeal] = useState<LoggedMeal | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingMeals, setIsLoadingMeals] = useState(true);

  const loadExistingMeals = useCallback(async () => {
    try {
      setIsLoadingMeals(true);

      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!userRes.user) {
        setMeals([]);
        return;
      }

      const accountId = userRes.user.id;

      const { data, error } = await supabase
        .from("meals")
        .select(
          `
          id,
          occurred_at,
          calories_total,
          note,
          image_path,
          image_mime,
          meal_items (
            name,
            quantity,
            unit,
            calories,
            protein_g,
            carbs_g,
            fat_g,
            confidence
          )
        `,
        )
        .eq("account_id", accountId)
        .order("occurred_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      const rows: MealRow[] = data ?? [];

      const mapped = await Promise.all(
        rows.map(async (meal): Promise<LoggedMeal> => {
          let imageUri: string | null = null;
          if (meal.image_path) {
            const { data: signed, error: signedErr } = await supabase.storage
              .from("meal-images")
              .createSignedUrl(meal.image_path, SIGNED_URL_TTL_SECONDS);
            if (!signedErr && signed?.signedUrl) {
              imageUri = signed.signedUrl;
            }
          }

          const items = (meal.meal_items ?? []).map((item): MealAnalysisResponse["items"][number] => ({
            name: item.name ?? "Item",
            quantity: item.quantity ?? 1,
            unit: item.unit ?? "unit",
            calories: item.calories ?? 0,
            macros: {
              protein_g: item.protein_g ?? 0,
              carbs_g: item.carbs_g ?? 0,
              fat_g: item.fat_g ?? 0,
            },
            confidence: item.confidence ?? 0,
          }));

          return {
            id: meal.id,
            imageUri,
            capturedAt: new Date(meal.occurred_at),
            analysis: {
              meal_id: meal.id,
              timestamp_iso: meal.occurred_at,
              items,
              calories_total: meal.calories_total ?? 0,
              suggestion: meal.note ?? "",
              assumptions: [],
              source_image_id: meal.image_path ?? null,
              model_version: null,
            },
          };
        }),
      );

      setMeals(mapped);
    } catch (error) {
      console.error("Failed to load meals", error);
      Alert.alert("Error", "Failed to load previous meals. Please try again.");
    } finally {
      setIsLoadingMeals(false);
    }
  }, []);

  useEffect(() => {
    void loadExistingMeals();
  }, [loadExistingMeals]);

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

  const confirmMeal = async () => {
  if (!pendingMeal) return;

  try {
    setIsSaving(true);

    // who’s the user? (needed for RLS and storage path)
    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes.user) throw new Error("Not signed in");
    const accountId = userRes.user.id;

    // stable id for the file name
    const mealIdForFile = pendingMeal.analysis.meal_id ?? pendingMeal.id;

    // 1) upload image to private bucket
    if (!pendingMeal.imageUri) {
      throw new Error("Meal image is missing");
    }

    const { path, mime } = await uploadMealImage(
      accountId,
      mealIdForFile,
      pendingMeal.imageUri
    );

    // 2) insert parent + children
    await saveMealToDb(accountId, pendingMeal.analysis, path, mime);

    // 3) refresh list & close
    await loadExistingMeals();
    setPendingMeal(null);
    setShowModal(false);
  } catch (e) {
    console.error(e);
    Alert.alert("Save failed", e instanceof Error ? e.message : "Could not save meal");
  } finally {
    setIsSaving(false);
  }
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
          {isLoadingMeals ? (
            <View style={styles.loadingMeals}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.infoText}>Loading your recent meals...</Text>
            </View>
          ) : meals.length === 0 ? (
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
                  <Image
                    source={meal.imageUri ? { uri: meal.imageUri } : mealPlaceholder}
                    style={styles.mealImage}
                  />
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
  loadingMeals: { alignItems: "center", paddingVertical: 40 },
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
