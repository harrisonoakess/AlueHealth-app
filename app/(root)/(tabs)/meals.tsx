// app/(root)/(tabs)/meals.tsx
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
import { supabase } from "../../../lib/supabase";
import ViewMealModal from "../../../components/modals/ViewMealModal";
import MealModal from "../../../components/modals/AfterPictureModal";
import MealNoteModal from "../../../components/modals/MealNoteModal";
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
async function uploadMealImage(
  accountId: string,
  mealId: string,
  imageUri: string
): Promise<{ path: string; mime: string }> {
  const res = await fetch(imageUri);
  const arrayBuffer = await res.arrayBuffer();
  const headerMime = res.headers.get("Content-Type") ?? "";
  const mime = headerMime || (await detectMimeFromUri(imageUri)) || "image/jpeg";
  const ext = mime.includes("png") ? "png" : "jpg";
  const path = `${accountId}/${mealId}.${ext}`;

  const { error } = await supabase.storage
    .from("meal-images")
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
  const occurred_at = analysis.timestamp_iso ?? new Date().toISOString();
  const calories_total = Math.round(analysis.calories_total);

  const { data: mealRow, error: mealErr } = await supabase
    .from("meals")
    .insert({
      account_id: accountId,
      occurred_at,
      calories_total,
      note: analysis.suggestion ?? null,
      image_path: imagePath,
      image_mime: imageMime,
    })
    .select("id")
    .single();

  if (mealErr) throw mealErr;
  const mealId = mealRow.id as string;

  const itemsPayload = analysis.items.map((it) => ({
    meal_id: mealId,
    name: it.name,
    quantity: it.quantity ?? 1,
    unit: it.unit ?? "unit",
    calories: it.calories != null ? Math.round(it.calories) : null,
    protein_g: it.macros?.protein_g ?? null,
    carbs_g: it.macros?.carbs_g ?? null,
    fat_g: it.macros?.fat_g ?? null,
    confidence: it.confidence ?? null,
  }));

  if (itemsPayload.length) {
    const { error: itemsErr } = await supabase.from("meal_items").insert(itemsPayload);
    if (itemsErr) throw itemsErr;
  }

  return mealId;
}

export default function MealsTab() {
  const [selectedMeal, setSelectedMeal] = useState<LoggedMeal | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [meals, setMeals] = useState<LoggedMeal[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingMeal, setPendingMeal] = useState<LoggedMeal | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingMeals, setIsLoadingMeals] = useState(true);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

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
        `
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

          const items = (meal.meal_items ?? []).map(
            (item): MealAnalysisResponse["items"][number] => ({
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
            })
          );

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
        })
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

  // Permissions
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

  // Image flows
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

  const processImage = (imageUri: string) => {
    setNoteText("");
    setPendingImageUri(imageUri);
    setNoteModalVisible(true);
    setShowModal(false);
    setPendingMeal(null);
  };

  const handleNoteCancel = () => {
    setNoteModalVisible(false);
    setPendingImageUri(null);
    setNoteText("");
  };

  const handleNoteConfirm = async () => {
    if (!pendingImageUri) return;
    setNoteModalVisible(false);
    setIsAnalyzing(true);

    try {
      const trimmedNote = noteText.trim();
      let accountId = "";
      try {
        const { data: userRes, error: userErr } = await supabase.auth.getUser();
        if (!userErr && userRes.user) {
          accountId = userRes.user.id;
        }
      } catch (authError) {
        console.warn("Could not fetch user for meal analysis", authError);
      }

      const analysis = await analyzeMealImage(pendingImageUri, {
        note: trimmedNote,
        accountId,
      });

      const newMeal: LoggedMeal = {
        id: analysis.meal_id ?? Date.now().toString(),
        imageUri: pendingImageUri,
        capturedAt: new Date(),
        analysis,
      };

      setPendingMeal(newMeal);
      setPendingImageUri(null);
      setShowModal(true);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Failed to analyze the image. Please try again.";
      Alert.alert("Analysis failed", message);
      setPendingImageUri(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const normaliseTimestamp = (value: string | null | undefined): string => {
    if (!value) return new Date().toISOString();
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return new Date().toISOString();
    }
    return parsed.toISOString();
  };

  const confirmMeal = async () => {
    if (!pendingMeal) return;
    try {
      setIsSaving(true);
      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userRes.user) throw new Error("Not signed in");
      const accountId = userRes.user.id;
      const mealIdForFile = pendingMeal.analysis.meal_id ?? pendingMeal.id;

      if (!pendingMeal.imageUri) throw new Error("Meal image is missing");
      const { path, mime } = await uploadMealImage(accountId, mealIdForFile, pendingMeal.imageUri);

      await saveMealToDb(
        accountId,
        {
          ...pendingMeal.analysis,
          timestamp_iso: normaliseTimestamp(pendingMeal.analysis.timestamp_iso),
        },
        path,
        mime,
      );
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

  // UI
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Today’s Meals</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* Add New Meal */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Add New Meal</Text>

          {isAnalyzing ? (
            <View style={styles.analyzing}>
              <ActivityIndicator size="large" color="#7B53A6" />
              <Text style={styles.analyzingText}>Analyzing your meal...</Text>
              <Text style={styles.infoText}>This may take a few seconds</Text>
            </View>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleTakePhoto}>
                <Ionicons name="camera" size={22} color="#FFFFFF" />
                <Text style={styles.buttonTextPrimary}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleSelectPhoto}>
                <Ionicons name="images" size={22} color="#7B53A6" />
                <Text style={styles.buttonTextSecondary}>Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Meals List */}
        <View style={styles.section}>
          {isLoadingMeals ? (
            <View style={styles.loadingMeals}>
              <ActivityIndicator size="large" color="#7B53A6" />
              <Text style={styles.infoText}>Loading your recent meals...</Text>
            </View>
          ) : meals.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No meals logged today</Text>
              <Text style={styles.infoText}>Take a photo of your food to get started!</Text>
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
                { protein: 0, carbs: 0, fat: 0 }
              );

              return (
                <TouchableOpacity
                  key={meal.id}
                  style={styles.mealCard}
                  activeOpacity={0.85}
                  onPress={() => setSelectedMeal(meal)}
                  accessibilityRole="button"
                  accessibilityLabel={`View details for meal logged at ${meal.capturedAt.toLocaleTimeString()}`}
                >
                  <Image
                    source={meal.imageUri ? { uri: meal.imageUri } : mealPlaceholder}
                    style={styles.mealImage}
                  />
                  <View style={styles.mealInfo}>
                    <Text numberOfLines={1} style={styles.mealName}>
                      {itemSummary || "Meal"}
                    </Text>
                    <Text style={styles.mealDetails}>
                      {totalCalories} kcal • {meal.capturedAt.toLocaleTimeString()}
                    </Text>
                    <Text style={styles.macroLine}>
                      P {Math.round(macros.protein)}g · C {Math.round(macros.carbs)}g · F{" "}
                      {Math.round(macros.fat)}g
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      <MealNoteModal
        visible={noteModalVisible}
        imageUri={pendingImageUri}
        note={noteText}
        onChangeNote={setNoteText}
        onConfirm={handleNoteConfirm}
        onCancel={handleNoteCancel}
      />
      <MealModal visible={showModal} meal={pendingMeal} onConfirm={confirmMeal} onCancel={cancelMeal} />
      <ViewMealModal visible={!!selectedMeal} meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Page
  safe: { flex: 1, backgroundColor: "#F4EAF8" }, // primary.50
  scrollContent: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 28 },

  // Header
  header: { marginBottom: 20, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "800", color: "#111827" },
  date: { fontSize: 13, color: "#6B7280", marginTop: 4 },

  // Sections
  section: { marginBottom: 28 },
  subtitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 12 },

  // Buttons
  buttonRow: { flexDirection: "row", gap: 12 },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryButton: {
    backgroundColor: "#7B53A6", // primary.500
    shadowColor: "#7B53A6",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  buttonTextPrimary: { fontSize: 14, fontWeight: "700", color: "#FFFFFF" },
  buttonTextSecondary: { fontSize: 14, fontWeight: "700", color: "#7B53A6" },

  // States
  analyzing: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  analyzingText: { fontSize: 16, fontWeight: "700", marginTop: 12, color: "#111827" },
  infoText: { fontSize: 12, textAlign: "center", color: "#6B7280", marginTop: 4 },

  loadingMeals: { alignItems: "center", paddingVertical: 36 },

  emptyState: {
    alignItems: "center",
    paddingVertical: 36,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
  },
  emptyText: { fontSize: 16, fontWeight: "700", marginTop: 12, color: "#111827" },

  // Meal card
  mealCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  mealImage: { width: 64, height: 64, borderRadius: 12, marginRight: 12 },
  mealInfo: { flex: 1 },
  mealName: { fontSize: 16, fontWeight: "700", color: "#111827" },
  mealDetails: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  macroLine: { fontSize: 12, color: "#4B5563", marginTop: 4 },
});
