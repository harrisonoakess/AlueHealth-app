import { Platform } from "react-native";
import { BACKEND_URL } from "../config";

export type MealMacros = {
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export type MealItem = {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  macros: MealMacros;
  confidence: number;
};

export type MealAnalysisResponse = {
  meal_id: string;
  timestamp_iso: string;
  items: MealItem[];
  calories_total: number;
  suggestion: string;
  assumptions: string[];
  source_image_id?: string | null;
  model_version?: string | null;
};

type AnalyzeMealOptions = {
  note?: string;
  accountId?: string;
};

export async function analyzeMealImage(
  imageUri: string,
  { note = "", accountId = "" }: AnalyzeMealOptions = {},
): Promise<MealAnalysisResponse> {
  const formData = new FormData();

  formData.append("note", note);
  formData.append("account_id", accountId);

  const filename = imageUri.split("/").pop() ?? `meal-${Date.now()}.jpg`;
  const fileExtension = filename.split(".").pop()?.toLowerCase();
  const mimeType = getMimeType(fileExtension);

  formData.append("image", {
    uri: prepareUri(imageUri),
    type: mimeType,
    name: filename,
  } as any);

  const response = await fetch(`${BACKEND_URL}/analyze-meal`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const message = await safeParseError(response);
    throw new Error(message ?? `analysis failed with status ${response.status}`);
  }

  return (await response.json()) as MealAnalysisResponse;
}

function getMimeType(extension?: string): string {
  switch (extension) {
    case "png":
      return "image/png";
    case "heic":
      return "image/heic";
    case "webp":
      return "image/webp";
    default:
      return "image/jpeg";
  }
}

function prepareUri(uri: string): string {
  if (Platform.OS === "android") {
    if (uri.startsWith("content://") || uri.startsWith("file://")) {
      return uri;
    }
    return `file://${uri}`;
  }

  return uri;
}

async function safeParseError(response: Response): Promise<string | null> {
  try {
    const data = await response.json();
    if (typeof data?.detail === "string") {
      return data.detail;
    }
    if (typeof data?.message === "string") {
      return data.message;
    }
  } catch {
    // fallback to text below
  }

  try {
    return await response.text();
  } catch {
    return null;
  }
}
