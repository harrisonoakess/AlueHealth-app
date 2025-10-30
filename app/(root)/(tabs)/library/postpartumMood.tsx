import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

/** :shortcode: → emoji (supports a few variants) */
const EMOJI: Record<string, string> = {
  ":cherry_blossom:": "🌸",
  ":sunrise:": "🌅",
  ":woman-walking:": "🚶‍♀️",
  ":woman_walking:": "🚶‍♀️",
  ":speaking_head_in_silhouette:": "🗣️",
  ":sleeping:": "😴",
  ":green_salad:": "🥗",
  ":dart:": "🎯",
  ":heartpulse:": "💗",
};
const e = (s: string) => EMOJI[s] ?? s;

const Card: React.FC<React.PropsWithChildren<{ title?: string }>> = ({ title, children }) => (
  <View
    style={{
      backgroundColor: "white",
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: "rgba(124,58,237,0.12)",
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    }}
  >
    {title ? <Text className="text-xl font-semibold text-neutral-900 mb-3">{title}</Text> : null}
    {children}
  </View>
);

export default function PostpartumMoodArticle() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "rgba(124,58,237,0.07)" }}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 12, maxWidth: 880, alignSelf: "center" }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <Pressable onPress={() => router.push("/(root)/(tabs)/library")} className="flex-row items-center mb-6">
          <ArrowLeft size={20} color="#6b7280" />
          <Text className="ml-2 text-neutral-500">Back to Library</Text>
        </Pressable>

        {/* Emoji badge */}
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            marginBottom: 16,
            backgroundColor: "rgba(124,58,237,0.12)",
            borderWidth: 1,
            borderColor: "rgba(124,58,237,0.25)",
          }}
        >
          <Text style={{ fontSize: 42 }}>{e(":cherry_blossom:")}</Text>
        </View>

        {/* Title & subtitle */}
        <Text className="text-3xl font-extrabold text-neutral-900 text-center mb-2">
          Managing Postpartum Mood
        </Text>
        <Text className="text-neutral-500 text-center mb-6">
          Understanding and navigating the emotional waves of early motherhood
        </Text>

        {/* What's Normal? */}
        <Card title="What's Normal?">
          <Text className="text-neutral-700 mb-3">
            The postpartum period brings significant hormonal shifts, sleep deprivation, and life
            changes. It’s completely normal to experience mood swings, tearfulness, anxiety, and
            overwhelm in the first few weeks—often called the “baby blues.”
          </Text>
          <Text className="text-neutral-700">
            About 80% of new mothers experience baby blues, which typically peak around day 4–5 and
            improve within two weeks. If feelings intensify or persist beyond two weeks, it may be
            postpartum depression or anxiety and you should seek support.
          </Text>
        </Card>

        {/* Baby Blues vs PPD */}
        <Card title="Baby Blues vs. Postpartum Depression">
          <View className="space-y-4">
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">Baby Blues</Text>
              <View className="ml-3">
                <Text className="text-neutral-600">• Mild mood swings and tearfulness</Text>
                <Text className="text-neutral-600">• Feeling overwhelmed or anxious</Text>
                <Text className="text-neutral-600">• Trouble sleeping (even when baby sleeps)</Text>
                <Text className="text-neutral-600">• Peaks around day 4–5, improves by week 2</Text>
                <Text className="text-neutral-600">• You can still function and feel moments of joy</Text>
              </View>
            </View>
            <View>
              <Text className="font-semibold text-neutral-900 mb-1">Postpartum Depression/Anxiety</Text>
              <View className="ml-3">
                <Text className="text-neutral-600">• Persistent sadness, hopelessness, or emptiness</Text>
                <Text className="text-neutral-600">• Severe anxiety or panic attacks</Text>
                <Text className="text-neutral-600">• Difficulty bonding with baby</Text>
                <Text className="text-neutral-600">• Thoughts of harming yourself or baby</Text>
                <Text className="text-neutral-600">• Lasts longer than 2 weeks and may worsen</Text>
                <Text className="text-neutral-600">• Interferes with daily functioning</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Daily Mood Support Strategies */}
        <Card title="Daily Mood Support Strategies">
          <View className="space-y-4">
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">
                {e(":sunrise:")} Morning Light
              </Text>
              <Text className="text-neutral-600 text-sm">
                Get 10–15 minutes of natural sunlight early in the day. It helps regulate mood
                hormones and sleep cycles.
              </Text>
            </View>

            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">
                {e(":woman-walking:")} Gentle Movement
              </Text>
              <Text className="text-neutral-600 text-sm">
                Even a short walk can boost endorphins. Start with 5 minutes and gradually increase
                as you heal.
              </Text>
            </View>

            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">
                {e(":speaking_head_in_silhouette:")} Talk About It
              </Text>
              <Text className="text-neutral-600 text-sm">
                Share your feelings with trusted friends, family, or a therapist. Isolation makes
                everything harder.
              </Text>
            </View>

            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">
                {e(":sleeping:")} Prioritize Rest
              </Text>
              <Text className="text-neutral-600 text-sm">
                Sleep deprivation significantly impacts mood. Rest when baby rests, and accept help
                with night duties.
              </Text>
            </View>

            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">
                {e(":green_salad:")} Nourish Your Body
              </Text>
              <Text className="text-neutral-600 text-sm">
                Regular, balanced meals support stable blood sugar and mood. Don’t skip meals.
              </Text>
            </View>

            <View>
              <Text className="font-semibold text-neutral-900 mb-1">
                {e(":dart:")} Small Goals
              </Text>
              <Text className="text-neutral-600 text-sm">
                Set tiny, achievable goals. Getting dressed, taking a shower, or eating lunch counts
                as success.
              </Text>
            </View>
          </View>
        </Card>

        {/* When to Seek Help */}
        <Card title="When to Seek Help">
          <Text className="text-neutral-700 mb-3">Reach out to your healthcare provider if you experience:</Text>
          <View className="ml-3 mb-3">
            <Text className="text-neutral-700">• Symptoms lasting longer than 2 weeks</Text>
            <Text className="text-neutral-700">• Difficulty caring for yourself or baby</Text>
            <Text className="text-neutral-700">• Thoughts of harming yourself or baby</Text>
            <Text className="text-neutral-700">• Feeling disconnected from reality</Text>
            <Text className="text-neutral-700">• Inability to sleep even when exhausted</Text>
            <Text className="text-neutral-700">• Severe anxiety or panic attacks</Text>
            <Text className="text-neutral-700">• No interest in things you used to enjoy</Text>
          </View>

          <View style={{ backgroundColor: "rgba(239,68,68,0.10)", borderColor: "rgba(239,68,68,0.25)", borderWidth: 1, borderRadius: 12, padding: 12 }}>
            <Text className="text-sm font-semibold text-neutral-900 mb-1">Crisis Support</Text>
            <Text className="text-sm text-neutral-700">
              National Maternal Mental Health Hotline: 1-833-TLC-MAMA (1-833-852-6262) — 24/7, English & Spanish.
              If you’re in immediate danger, call 911 or your local emergency number.
            </Text>
          </View>
        </Card>

        {/* Treatment Options */}
        <Card title="Treatment Options">
          <Text className="text-neutral-700 mb-3">Postpartum depression and anxiety are highly treatable:</Text>
          <View className="ml-1">
            <Text className="text-neutral-700">• <Text className="font-semibold">Therapy:</Text> CBT is very effective</Text>
            <Text className="text-neutral-700">• <Text className="font-semibold">Medication:</Text> Safe options exist, including for breastfeeding</Text>
            <Text className="text-neutral-700">• <Text className="font-semibold">Support groups:</Text> Connect with other mothers</Text>
            <Text className="text-neutral-700">• <Text className="font-semibold">Lifestyle:</Text> Sleep, nutrition, movement, social connection</Text>
          </View>
        </Card>

        {/* Support banner */}
        <View
          style={{
            backgroundColor: "rgba(124,58,237,0.10)",
            borderColor: "rgba(124,58,237,0.35)",
            borderWidth: 1,
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <Text className="text-sm font-medium text-neutral-900 mb-2">
            {e(":heartpulse:")} You Are Not Alone
          </Text>
          <Text className="text-sm text-neutral-600">
            Postpartum mood challenges are common and not your fault. With support and treatment,
            you will feel better. Asking for help is a sign of strength.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
