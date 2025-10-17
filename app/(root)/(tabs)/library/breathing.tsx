import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Animated, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Play, Pause } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

type Phase = "inhale" | "hold" | "exhale";

export default function BreathingArticle() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathPhase, setBreathPhase] = useState<Phase>("inhale");
  const [countdown, setCountdown] = useState(4);

  const scale = useRef(new Animated.Value(1)).current;
  const animateTo = (s: number) =>
    Animated.timing(scale, { toValue: s, duration: 1000, useNativeDriver: true }).start();

  useEffect(() => {
    animateTo(breathPhase === "exhale" ? 1 : 1.5);
  }, [breathPhase]);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    if (countdown <= 0) {
      setBreathPhase((prev) => {
        const next: Phase = prev === "inhale" ? "hold" : prev === "hold" ? "exhale" : "inhale";
        setCountdown(next === "hold" ? 7 : 4);
        return next;
      });
    }
  }, [countdown, isPlaying]);

  const toggle = () => {
    setIsPlaying((s) => !s);
    if (!isPlaying) {
      setBreathPhase("inhale");
      setCountdown(4);
    }
  };

  const phaseText =
    breathPhase === "inhale" ? "Breathe In" : breathPhase === "hold" ? "Hold" : "Breathe Out";

  return (
    <SafeAreaView className="flex-1 bg-primary-100">
      {/* Make the page scrollable */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}
      >
        {/* Back action should now receive touches */}
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-2 mb-4">
          <ArrowLeft size={20} />
          <Text className="text-[#06b6d4] font-semibold">Back to Library</Text>
        </Pressable>

        {/* Decorative hero gradient – don't intercept touches */}
        <LinearGradient
          colors={["#a5b4fc", "#99f6e4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 24 }}
          pointerEvents="none"
        >
          <View className="h-40 items-center justify-center mb-4">
            <Text className="text-6xl">🧘‍♀️</Text>
          </View>
        </LinearGradient>

        <Text className="text-3xl font-JakartaExtraBold text-neutral-900 mb-1">
          Breathing Through Anxiety
        </Text>
        <Text className="text-neutral-600 text-base mb-4">
          Simple techniques to calm your nervous system when feeling overwhelmed
        </Text>

        <View className="p-4 rounded-2xl bg-[#a5b4fc33] mb-4">
          <Text className="text-lg font-semibold text-neutral-900 mb-2">Understanding Your Breath</Text>
          <Text className="text-neutral-900 leading-6">
            When anxiety strikes, your breathing often becomes shallow and rapid. By consciously controlling
            your breath, you can activate your body's natural relaxation response.
          </Text>
        </View>

        <View className="p-4 rounded-2xl bg-white border-2 border-[#818cf8] mb-4">
          <Text className="text-xl font-semibold text-neutral-900 text-center mb-1">
            Guided 4-7-8 Breathing
          </Text>
          <Text className="text-sm text-neutral-500 text-center mb-4">
            This technique helps reduce anxiety and promote relaxation
          </Text>

          <View className="items-center mb-4">
            <View className="w-40 h-40 items-center justify-center">
              <Animated.View
                className="w-32 h-32 rounded-full opacity-80"
                style={{ backgroundColor: "#99f6e4", transform: [{ scale }] }}
              />
              <View className="absolute items-center">
                <Text className="text-4xl font-extrabold text-[#06b6d4] mb-1">{countdown}</Text>
                <Text className="text-sm font-medium text-neutral-800">{phaseText}</Text>
              </View>
            </View>

            <Pressable
              onPress={toggle}
              className="flex-row items-center justify-center gap-2 mt-3 px-4 py-2 rounded-xl bg-[#06b6d4] w-40"
            >
              {isPlaying ? <Pause size={16} color="white" /> : <Play size={16} color="white" />}
              <Text className="text-white font-bold">{isPlaying ? "Pause" : "Start"}</Text>
            </Pressable>
          </View>

          <View className="bg-neutral-100 rounded-2xl p-3">
            <Step n={1} title="Inhale for 4 seconds" note="Breathe in slowly through your nose" />
            <Step n={2} title="Hold for 7 seconds" note="Keep the air in your lungs gently" />
            <Step n={3} title="Exhale for 4 seconds" note="Release slowly through your mouth" />
          </View>
        </View>

        <View className="p-4 rounded-2xl bg-[#a5b4fc33] mb-4">
          <Text className="text-lg font-semibold text-neutral-900 mb-2">When to Practice</Text>
          <Text className="text-neutral-900 mb-1">✨ In the morning to start your day calm</Text>
          <Text className="text-neutral-900 mb-1">✨ Before feeding sessions</Text>
          <Text className="text-neutral-900 mb-1">✨ When baby is sleeping and you have a moment</Text>
          <Text className="text-neutral-900 mb-1">✨ Before bed to improve sleep quality</Text>
          <Text className="text-neutral-900">✨ Anytime you feel tension building</Text>
        </View>

        {/* Footer gradient – also decorative */}
        <LinearGradient
          colors={["#a5b4fc", "#99f6e4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ borderRadius: 16 }}
          pointerEvents="none"
        >
          <View className="p-4 items-center justify-center">
            <Text className="text-lg font-medium text-neutral-900 italic text-center">
              “You're doing an amazing job. Take a breath. You've got this.” 💗
            </Text>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

function Step({ n, title, note }: { n: number; title: string; note: string }) {
  return (
    <View className="flex-row gap-3 mb-3 items-start">
      <View className="w-8 h-8 rounded-full bg-[#06b6d4] items-center justify-center">
        <Text className="text-white font-extrabold text-sm">{n}</Text>
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-neutral-900">{title}</Text>
        <Text className="text-sm text-neutral-500">{note}</Text>
      </View>
    </View>
  );
}
