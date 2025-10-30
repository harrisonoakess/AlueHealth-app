import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

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

export default function SleepRoutineArticle() {
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
          <Text style={{ fontSize: 42 }}>💤</Text>
        </View>

        {/* Title & subtitle */}
        <Text className="text-3xl font-extrabold text-neutral-900 text-center mb-2">
          Creating a Sleep Routine
        </Text>
        <Text className="text-neutral-500 text-center mb-6">
          Practical strategies to improve sleep quality during the postpartum period
        </Text>

        {/* Why Sleep Matters */}
        <Card title="Why Sleep Matters Now More Than Ever">
          <Text className="text-neutral-700 mb-3">
            Sleep deprivation is one of the hardest aspects of early motherhood. It affects your
            mood, energy, healing, milk supply, immune function, and ability to cope with stress.
            While you can’t control when your baby wakes, you can optimize the sleep you do get.
          </Text>
          <Text className="text-neutral-700">
            The goal isn’t perfect sleep—that’s not realistic. The goal is maximizing rest and
            creating conditions that help you fall asleep quickly and stay asleep when baby allows it.
          </Text>
        </Card>

        {/* Sleep Basics */}
        <Card title="Sleep Basics: Set Yourself Up for Success">
          <View className="space-y-4">
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">🌡️ Optimize Your Sleep Environment</Text>
              <View className="ml-3">
                <Text className="text-neutral-600 text-sm">• Keep bedroom cool (65–68°F is ideal)</Text>
                <Text className="text-neutral-600 text-sm">• Make room as dark as possible (blackout curtains)</Text>
                <Text className="text-neutral-600 text-sm">• Use white noise to mask sudden sounds</Text>
                <Text className="text-neutral-600 text-sm">• Comfortable, supportive mattress and pillows</Text>
              </View>
            </View>

            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">📱 Manage Light Exposure</Text>
              <View className="ml-3">
                <Text className="text-neutral-600 text-sm">• Get bright light in the morning (sets circadian rhythm)</Text>
                <Text className="text-neutral-600 text-sm">• Dim lights 1–2 hours before bed</Text>
                <Text className="text-neutral-600 text-sm">• Use red nightlight for nighttime feeds</Text>
                <Text className="text-neutral-600 text-sm">• Avoid phone/screen time before sleep when possible</Text>
              </View>
            </View>

            <View>
              <Text className="font-semibold text-neutral-900 mb-1">🛏️ Create a Bedtime Routine</Text>
              <Text className="text-neutral-600 text-sm">
                Even a simple 10-minute routine signals your body it’s time to sleep. Consistency is
                more important than duration.
              </Text>
            </View>
          </View>
        </Card>

        {/* Sample Evening Routine */}
        <Card title="Sample Evening Routine (15 Minutes)">
          <View className="space-y-3">
            <Text className="text-neutral-600 text-sm"><Text className="font-semibold">8:00 PM:</Text> Dim lights, set Do Not Disturb</Text>
            <Text className="text-neutral-600 text-sm"><Text className="font-semibold">8:05 PM:</Text> Warm shower/face wash, brush teeth</Text>
            <Text className="text-neutral-600 text-sm"><Text className="font-semibold">8:10 PM:</Text> Change into comfortable sleepwear</Text>
            <Text className="text-neutral-600 text-sm"><Text className="font-semibold">8:12 PM:</Text> 3 minutes of deep breathing or gentle stretching</Text>
            <Text className="text-neutral-600 text-sm"><Text className="font-semibold">8:15 PM:</Text> In bed, read a few pages or listen to calm music</Text>
            <Text className="text-neutral-600 text-sm mt-4 pt-4" style={{ borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.08)" }}>
              <Text className="font-semibold">Note:</Text> Adjust timing to your baby’s schedule. The routine matters
              more than the clock time. Even 5 minutes helps.
            </Text>
          </View>
        </Card>

        {/* Daytime Habits */}
        <Card title="Daytime Habits That Help Nighttime Sleep">
          <View className="space-y-4">
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">☀️ Morning Sunlight</Text>
              <Text className="text-neutral-600 text-sm">
                Get 10–15 minutes of natural light within 1 hour of waking. This sets your internal
                clock and improves nighttime sleep quality.
              </Text>
            </View>
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">🚶‍♀️ Gentle Movement</Text>
              <Text className="text-neutral-600 text-sm">
                A 10–20 minute walk helps regulate sleep hormones. Avoid intense exercise close to bedtime.
              </Text>
            </View>
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">☕ Caffeine Cutoff</Text>
              <Text className="text-neutral-600 text-sm">
                No caffeine after 2 PM. It stays in your system for 6+ hours and disrupts deep sleep.
              </Text>
            </View>
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">🥗 Regular Meals</Text>
              <Text className="text-neutral-600 text-sm">
                Don’t go to bed too hungry or too full. A light protein + complex carb snack 1–2 hours before bed helps.
              </Text>
            </View>
            <View>
              <Text className="font-semibold text-neutral-900 mb-1">💧 Hydration Timing</Text>
              <Text className="text-neutral-600 text-sm">
                Stay hydrated during the day but taper fluids 1–2 hours before bed to reduce nighttime bathroom trips.
              </Text>
            </View>
          </View>
        </Card>

        {/* Strategies for Broken Sleep */}
        <Card title="Strategies for Broken Sleep">
          <View className="space-y-4">
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">“Sleep When Baby Sleeps”</Text>
              <Text className="text-neutral-600 text-sm mb-1">
                You’ve heard it a million times, but it’s true. At least once a day, nap when baby naps. Let chores wait.
              </Text>
              <Text className="text-neutral-600 text-sm">
                <Text className="font-semibold">Quick tip:</Text> If you can’t fall asleep, rest with eyes closed in a dark, quiet room. Rest counts.
              </Text>
            </View>
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">Split Night Duties</Text>
              <Text className="text-neutral-600 text-sm">
                If possible, take shifts with a partner (e.g., 9 PM–1 AM and 1 AM–6 AM). Uninterrupted 4–5 hour chunks restore you.
              </Text>
            </View>
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">The “Dream Feed”</Text>
              <Text className="text-neutral-600 text-sm">
                Feed baby right before you go to bed (even if they’re sleeping). This may give you a longer stretch early in the night.
              </Text>
            </View>
            <View>
              <Text className="font-semibold text-neutral-900 mb-1">Fall Back Asleep Faster</Text>
              <Text className="text-neutral-600 text-sm">
                After night feeds, use dim red light only. Avoid your phone. Try 4-7-8 breathing: inhale 4, hold 7, exhale 8.
              </Text>
            </View>
          </View>
        </Card>

        {/* Quick Relaxation Techniques */}
        <Card title="Quick Relaxation Techniques">
          <View className="space-y-4">
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">4-7-8 Breathing</Text>
              <Text className="text-neutral-600 text-sm">
                Inhale through nose 4 counts. Hold 7. Exhale slowly through mouth 8. Repeat 4 times to calm your nervous system.
              </Text>
            </View>
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">Progressive Muscle Relaxation</Text>
              <Text className="text-neutral-600 text-sm">
                Starting with toes, tense for 5 seconds, then release; move up the body. Helps release physical tension.
              </Text>
            </View>
            <View>
              <Text className="font-semibold text-neutral-900 mb-1">Body Scan Meditation</Text>
              <Text className="text-neutral-600 text-sm">
                Lie down, close eyes, mentally scan from head to toes, noticing sensations without judgment (5–10 minutes).
              </Text>
            </View>
          </View>
        </Card>

        {/* When Sleep Problems Need Help */}
        <Card title="When Sleep Problems Need Help">
          <Text className="text-neutral-700 mb-3">Contact your healthcare provider if you experience:</Text>
          <View className="ml-3 mb-3">
            <Text className="text-neutral-700">• Inability to fall asleep even when exhausted</Text>
            <Text className="text-neutral-700">• Extreme anxiety about sleep or baby</Text>
            <Text className="text-neutral-700">• Insomnia lasting more than a few weeks</Text>
            <Text className="text-neutral-700">• Feeling like you never reach deep sleep</Text>
            <Text className="text-neutral-700">• Physical symptoms (heart racing, severe fatigue)</Text>
          </View>
          <Text className="text-sm text-neutral-600">
            Sleep deprivation is serious. Don’t hesitate to ask for help from medical professionals, family, or friends.
            A postpartum doula or night nurse can also provide relief.
          </Text>
        </Card>

        {/* What NOT to Do */}
        <Card title="What NOT to Do">
          <View className="ml-1">
            <Text className="text-neutral-700 mb-1">• Don’t rely on alcohol to fall asleep (it disrupts sleep quality)</Text>
            <Text className="text-neutral-700 mb-1">• Don’t take sleep meds without consulting a doctor</Text>
            <Text className="text-neutral-700 mb-1">• Don’t push through extreme exhaustion—ask for help</Text>
            <Text className="text-neutral-700 mb-1">• Don’t compare your sleep to others (every baby is different)</Text>
            <Text className="text-neutral-700">• Don’t feel guilty about prioritizing rest</Text>
          </View>
        </Card>

        {/* Banner */}
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
          <Text className="text-sm font-medium text-neutral-900 mb-2">💗 You Will Sleep Again</Text>
          <Text className="text-sm text-neutral-600">
            This phase of sleep deprivation is temporary, even though it feels endless. Most babies
            sleep through the night by 6–12 months. Be gentle with yourself and do what you can to
            maximize the sleep you get—you’re doing an incredible job.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
