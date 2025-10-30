import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

/** :shortcode: → emoji */
const EMOJI: Record<string, string> = {
  ":hibiscus:": "🌺",
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

export default function PelvicFloorArticle() {
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
          <Text style={{ fontSize: 42 }}>{e(":hibiscus:")}</Text>
        </View>

        {/* Title & subtitle */}
        <Text className="text-3xl font-extrabold text-neutral-900 text-center mb-2">
          Pelvic Floor Recovery
        </Text>
        <Text className="text-neutral-500 text-center mb-6">
          Gentle healing and strengthening for your pelvic floor after birth
        </Text>

        {/* Understanding Your Pelvic Floor */}
        <Card title="Understanding Your Pelvic Floor">
          <Text className="text-neutral-700 mb-3">
            Your pelvic floor is a group of muscles that support your bladder, uterus, and bowel.
            During pregnancy and childbirth, these muscles undergo significant stretching and strain.
            Whether you delivered vaginally or by cesarean, your pelvic floor was affected.
          </Text>
          <Text className="text-neutral-700">
            Recovery takes time and patience. Most women need 3–6 months for initial healing, but
            strengthening is an ongoing process. The good news? With proper care, your pelvic floor
            can recover and become strong again.
          </Text>
        </Card>

        {/* Common Pelvic Floor Issues */}
        <Card title="Common Pelvic Floor Issues">
          <View className="space-y-4">
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">Urinary Incontinence</Text>
              <Text className="text-neutral-600 text-sm">
                Leaking when coughing, sneezing, laughing, or exercising is common but not
                something you have to live with—it’s a sign your pelvic floor needs support.
              </Text>
            </View>
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">Pelvic Organ Prolapse</Text>
              <Text className="text-neutral-600 text-sm">
                A feeling of heaviness or bulging in the vaginal area. If you suspect this, see a
                pelvic floor physical therapist for assessment and treatment.
              </Text>
            </View>
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">Pelvic Pain</Text>
              <Text className="text-neutral-600 text-sm">
                Pain during sex, bowel movements, or daily activities may indicate pelvic floor
                tension or trauma that needs professional attention.
              </Text>
            </View>
            <View>
              <Text className="font-semibold text-neutral-900 mb-1">Diastasis Recti</Text>
              <Text className="text-neutral-600 text-sm">
                Separation of abdominal muscles is closely related to pelvic floor function. They
                work together and should be addressed together.
              </Text>
            </View>
          </View>
        </Card>

        {/* Recovery Timeline */}
        <Card title="Recovery Timeline">
          <View className="space-y-4">
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">Weeks 0–6: Initial Healing</Text>
              <View className="ml-3">
                <Text className="text-neutral-600">• Focus on rest and gentle breathing</Text>
                <Text className="text-neutral-600">• Pelvic floor awareness (gentle Kegels only if no pain)</Text>
                <Text className="text-neutral-600">• Avoid heavy lifting and high-impact activities</Text>
                <Text className="text-neutral-600">• Get clearance at your 6-week checkup</Text>
              </View>
            </View>
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">Weeks 6–12: Gentle Rebuilding</Text>
              <View className="ml-3">
                <Text className="text-neutral-600">• Start gentle pelvic floor exercises</Text>
                <Text className="text-neutral-600">• Walk 15–20 minutes daily</Text>
                <Text className="text-neutral-600">• Begin basic core engagement</Text>
                <Text className="text-neutral-600">• Consider a pelvic floor PT if issues persist</Text>
              </View>
            </View>
            <View>
              <Text className="font-semibold text-neutral-900 mb-1">3–6 Months: Progressive Strengthening</Text>
              <View className="ml-3">
                <Text className="text-neutral-600">• Gradually increase exercise intensity</Text>
                <Text className="text-neutral-600">• Continue pelvic floor work daily</Text>
                <Text className="text-neutral-600">• Coordinate breath, core, and pelvic floor</Text>
                <Text className="text-neutral-600">• Return to high-impact activities only when ready</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Safe Pelvic Floor Exercises */}
        <Card title="Safe Pelvic Floor Exercises">
          <View className="space-y-4">
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">1. Diaphragmatic Breathing</Text>
              <Text className="text-neutral-600 text-sm">
                Lie on your back with knees bent. One hand on chest, one on belly. Inhale through
                nose letting belly rise; exhale through mouth, feeling pelvic floor naturally lift.
                Do 5–10 breaths, 3× daily.
              </Text>
            </View>
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">2. Pelvic Floor Lifts (Kegels)</Text>
              <Text className="text-neutral-600 text-sm">
                Imagine stopping urine flow. Lift gently, hold 3–5s, then fully relax 5–10s.
                Start with 10 reps, 2× daily. Quality over quantity—relaxation matters.
              </Text>
            </View>
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">3. Bridge Pose</Text>
              <Text className="text-neutral-600 text-sm">
                Lie on back, knees bent, feet hip-width. Exhale and lift hips, engaging pelvic
                floor and glutes. Hold 5s, lower slowly. 10 reps, once daily.
              </Text>
            </View>
            <View>
              <Text className="font-semibold text-neutral-900 mb-1">4. Heel Slides</Text>
              <Text className="text-neutral-600 text-sm">
                Lie on back, knees bent. Slide one heel away while engaging core and pelvic floor.
                Return to start; alternate legs. 10 reps each side.
              </Text>
            </View>
          </View>
        </Card>

        {/* When to See a Specialist */}
        <Card title="When to See a Specialist">
          <Text className="text-neutral-700 mb-3">Consider a pelvic floor PT if you experience:</Text>
          <View className="ml-3 mb-3">
            <Text className="text-neutral-700">• Any urinary or fecal incontinence</Text>
            <Text className="text-neutral-700">• Pelvic pain or pressure</Text>
            <Text className="text-neutral-700">• Painful intercourse</Text>
            <Text className="text-neutral-700">• Bulging/heaviness sensation</Text>
            <Text className="text-neutral-700">• Trouble starting pelvic floor exercises</Text>
            <Text className="text-neutral-700">• Diastasis recti wider than 2 fingers</Text>
          </View>
          <Text className="text-sm text-neutral-600">
            <Text className="font-semibold">Important:</Text> Most postpartum women benefit from at
            least one pelvic floor PT visit—even without symptoms. It’s preventive care.
          </Text>
        </Card>

        {/* Daily Habits */}
        <Card title="Daily Habits for Pelvic Health">
          <View className="ml-1">
            <Text className="text-neutral-700 mb-1">• <Text className="font-semibold">Posture:</Text> Sit/stand tall to reduce pressure</Text>
            <Text className="text-neutral-700 mb-1">• <Text className="font-semibold">Lifting:</Text> Exhale & engage core when lifting (baby included)</Text>
            <Text className="text-neutral-700 mb-1">• <Text className="font-semibold">Bathroom:</Text> Don’t hold urine; avoid straining</Text>
            <Text className="text-neutral-700 mb-1">• <Text className="font-semibold">Hydration:</Text> Drink water to prevent constipation</Text>
            <Text className="text-neutral-700 mb-1">• <Text className="font-semibold">Fiber:</Text> Eat enough fiber for regularity</Text>
            <Text className="text-neutral-700">• <Text className="font-semibold">Avoid:</Text> High-impact work until strong</Text>
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
          <Text className="text-sm font-medium text-neutral-900 mb-2">
            {e(":heartpulse:")} Be Patient With Yourself
          </Text>
          <Text className="text-sm text-neutral-600">
            Pelvic floor recovery is gradual. Some days feel better than others. Consistency matters
            more than intensity. Your body carried and delivered a baby—give it time and care to heal.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
