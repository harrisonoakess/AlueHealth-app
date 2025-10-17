import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, AlertCircle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

type Exercise = {
  name: string;
  week: string;
  description: string;
  reps: string;
};

export default function CoreRecoveryArticle() {
  const router = useRouter();

  const exercises: Exercise[] = [
    {
      name: "Pelvic Floor Breathing",
      week: "Week 1–2",
      description:
        "Lie on your back with knees bent. As you inhale, relax your pelvic floor. As you exhale, gently lift your pelvic floor muscles (as if stopping urine flow). Hold for 3 seconds, then release.",
      reps: "10 breaths, 2–3 times daily",
    },
    {
      name: "Abdominal Activation",
      week: "Week 2–4",
      description:
        "Lie on your back, knees bent. Place hands on belly. Exhale and gently draw belly button toward spine without moving your back. Hold for 5 seconds.",
      reps: "10 reps, 2 times daily",
    },
    {
      name: "Heel Slides",
      week: "Week 3–6",
      description:
        "Lie on your back, knees bent. Engage your core gently. Slowly slide one heel away from you, keeping your back flat. Return to start. Alternate legs.",
      reps: "10 slides per leg",
    },
    {
      name: "Modified Bird Dog",
      week: "Week 6+",
      description:
        "On hands and knees, engage core. Extend one arm forward OR one leg back (not both). Hold 5 seconds, return. Progress to opposite arm and leg together.",
      reps: "8 reps per side",
    },
  ];

  const warnings = [
    "Stop if you feel pain or discomfort",
    "Never hold your breath during exercises",
    "Avoid exercises that cause your belly to dome or bulge",
    "Get clearance from your doctor before starting",
  ];

  return (
    <SafeAreaView className="flex-1 bg-primary-100">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}
      >
        {/* Back */}
        <Pressable
          onPress={() => router.push("/library")}
          className="flex-row items-center gap-2 mb-6"
        >
          <ArrowLeft size={20} color="#06b6d4" />
          <Text className="text-[#06b6d4] font-medium">Back to Library</Text>
        </Pressable>

        {/* Hero */}
        <View className="mb-6">
          <LinearGradient
            colors={["#a5b4fc", "#99f6e4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 24 }}
            pointerEvents="none"
          >
            <View className="w-full h-48 rounded-3xl items-center justify-center mb-6">
              <Text className="text-7xl">💪</Text>
            </View>
          </LinearGradient>

          <Text className="text-3xl font-bold text-neutral-900 mb-3">
            Gentle Core Recovery
          </Text>
          <Text className="text-neutral-500 text-lg">
            Safe exercises to reconnect with your core after delivery
          </Text>
        </View>

        {/* Card: Understanding */}
        <View className="p-6 rounded-2xl bg-[#eef2ff] border-0 mb-6">
          <Text className="text-xl font-semibold text-neutral-900 mb-4">
            Understanding Your Postpartum Core
          </Text>
          <Text className="text-neutral-900 leading-relaxed mb-4">
            During pregnancy, your abdominal muscles stretched to make room for your growing
            baby. After delivery, these muscles need time and gentle work to regain their
            strength and function. This is not about getting a flat stomach — it’s about
            rebuilding a strong, functional core that supports your daily activities.
          </Text>
          <Text className="text-neutral-900 leading-relaxed">
            Your core includes not just your abs, but also your pelvic floor, back muscles, and
            diaphragm. They all work together to support your body, especially as you lift and
            care for your baby.
          </Text>
        </View>

        {/* Card: Safety */}
        <View className="p-5 rounded-2xl bg-red-500/10 border-2 border-red-500/30 mb-6">
          <View className="flex-row gap-3 items-start">
            <AlertCircle size={24} color="#ef4444" />
            <View className="flex-1">
              <Text className="font-semibold text-neutral-900 mb-3">
                Important Safety Guidelines
              </Text>
              <View className="gap-2">
                {warnings.map((w, i) => (
                  <View key={i} className="flex-row gap-2">
                    <Text className="text-red-500 font-bold">•</Text>
                    <Text className="text-sm text-neutral-900 flex-1">{w}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Card: Exercises */}
        <View className="p-6 rounded-2xl bg-white border-2 border-[#818cf8] mb-6">
          <Text className="text-xl font-semibold text-neutral-900 mb-4">
            Progressive Core Exercises
          </Text>
          <Text className="text-sm text-neutral-500 mb-6">
            Start with Week 1–2 exercises and progress only when comfortable. Listen to your body.
          </Text>

          <View className="gap-4">
            {exercises.map((exercise, idx) => (
              <View key={idx} className="rounded-2xl p-5 bg-neutral-100">
                <View className="flex-row items-start justify-between mb-3">
                  <Text className="font-semibold text-neutral-900 text-lg flex-1 pr-3">
                    {exercise.name}
                  </Text>
                  <View className="px-3 py-1 rounded-full bg-[#06b6d4]">
                    <Text className="text-xs text-white font-medium">{exercise.week}</Text>
                  </View>
                </View>

                <Text className="text-sm text-neutral-900 leading-relaxed mb-3">
                  {exercise.description}
                </Text>
                <Text className="text-sm font-medium text-[#06b6d4]">
                  Recommended: {exercise.reps}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Card: Diastasis Recti */}
        <View className="p-6 rounded-2xl bg-[#eef2ff] border-0 mb-6">
          <Text className="text-xl font-semibold text-neutral-900 mb-4">
            Checking for Diastasis Recti
          </Text>
          <Text className="text-neutral-900 leading-relaxed mb-4">
            Diastasis recti is a separation of your abdominal muscles that commonly occurs during
            pregnancy. Here’s how to check (wait until 6 weeks postpartum):
          </Text>

          <View className="gap-3">
            {[
              "Lie on your back with knees bent, feet flat on floor",
              "Place fingers horizontally at your belly button",
              "Lift your head slightly and feel for a gap between muscles",
              "If gap is wider than 2 fingers, consult a pelvic floor physical therapist",
            ].map((step, i) => (
              <View key={i} className="flex-row gap-3">
                <View className="w-8 h-8 rounded-full bg-[#06b6d4] items-center justify-center">
                  <Text className="text-white font-semibold text-sm">{i + 1}</Text>
                </View>
                <Text className="text-sm text-neutral-900 pt-1 flex-1">{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Card: Daily Tips */}
        <View className="p-6 rounded-2xl bg-white border-2 border-[#818cf8] mb-6">
          <Text className="text-xl font-semibold text-neutral-900 mb-4">
            Daily Movement Tips
          </Text>
          <View className="gap-3">
            {[
              "Practice good posture while feeding and holding baby",
              "Roll to your side before sitting up from lying down",
              "Engage your core before lifting (including lifting baby)",
              "Take short walks as soon as your doctor approves",
              "Stay hydrated to support muscle recovery",
            ].map((tip, i) => (
              <View key={i} className="flex-row gap-3">
                <Text className="text-[#06b6d4] font-bold">✓</Text>
                <Text className="text-neutral-900 flex-1">{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer Quote */}
        <LinearGradient
          colors={["#a5b4fc", "#99f6e4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ borderRadius: 16 }}
          pointerEvents="none"
        >
          <View className="p-6 items-center justify-center">
            <Text className="text-lg font-medium text-neutral-900 italic text-center">
              “Slow and steady wins the race. Your body did something incredible — give it the
              patience it deserves.” 💗
            </Text>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}