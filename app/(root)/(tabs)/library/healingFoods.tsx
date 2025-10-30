import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

/** :shortcode: → emoji */
const EMOJI: Record<string, string> = {
  ":shallow_pan_of_food:": "🥘",
  ":egg:": "🥚",
  ":leafy_green:": "🥬",
  ":avocado:": "🥑",
  ":blueberries:": "🫐",
  ":glass_of_milk:": "🥣",
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
      borderColor: "rgba(124,58,237,0.12)", // subtle primary tint
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    }}
  >
    {title ? (
      <Text className="text-xl font-semibold text-neutral-900 mb-3">{title}</Text>
    ) : null}
    {children}
  </View>
);

export default function HealingFoodsArticle() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "rgba(124,58,237,0.07)" }}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 12, maxWidth: 880, alignSelf: "center" }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <Pressable
          onPress={() => router.push("/(root)/(tabs)/library")}
          className="flex-row items-center mb-6"
        >
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
          <Text style={{ fontSize: 42 }}>{e(":shallow_pan_of_food:")}</Text>
        </View>

        {/* Title & subtitle */}
        <Text className="text-3xl font-extrabold text-neutral-900 text-center mb-2">
          Healing Foods & Recipes
        </Text>
        <Text className="text-neutral-500 text-center mb-6">
          Nourishing meals that support your postpartum recovery
        </Text>

        {/* Why Nutrition Matters Now */}
        <Card title="Why Nutrition Matters Now">
          <Text className="text-neutral-700 mb-3">
            Your body has just performed the incredible feat of pregnancy and childbirth. Now it
            needs extra support to heal tissues, restore energy, balance hormones, and—if you’re
            breastfeeding—produce milk. The right foods can make a significant difference in how you
            feel.
          </Text>
          <Text className="text-neutral-700">
            Focus on nutrient-dense foods that are easy to digest and prepare. This isn’t about
            perfection—it's about giving yourself the best possible support.
          </Text>
        </Card>

        {/* Key Healing Foods */}
        <Card title="Key Healing Foods">
          <View className="space-y-4">
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">
                {e(":egg:")} Protein-Rich Foods
              </Text>
              <Text className="text-neutral-600 text-sm">
                Eggs, chicken, fish, lentils, and beans help repair tissues and maintain energy.
                Aim for protein at every meal.
              </Text>
            </View>

            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">
                {e(":leafy_green:")} Leafy Greens
              </Text>
              <Text className="text-neutral-600 text-sm">
                Spinach, kale, and Swiss chard provide iron, folate, and calcium—essential for
                recovery and milk production.
              </Text>
            </View>

            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">
                {e(":avocado:")} Healthy Fats
              </Text>
              <Text className="text-neutral-600 text-sm">
                Avocado, nuts, seeds, and olive oil support hormone production and brain health.
                Essential for both you and baby if breastfeeding.
              </Text>
            </View>

            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">
                {e(":blueberries:")} Antioxidant-Rich Foods
              </Text>
              <Text className="text-neutral-600 text-sm">
                Berries, dark chocolate, and colorful vegetables reduce inflammation and support
                immune function.
              </Text>
            </View>

            <View>
              <Text className="font-semibold text-neutral-900 mb-1">
                {e(":glass_of_milk:")} Bone Broth & Soups
              </Text>
              <Text className="text-neutral-600 text-sm">
                Rich in collagen and minerals, and easy to digest—a traditional healing food for
                postpartum recovery.
              </Text>
            </View>
          </View>
        </Card>

        {/* Simple Healing Recipes */}
        <Card title="Simple Healing Recipes">
          <View className="space-y-5">
            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">
                Golden Milk Latte (Anti-Inflammatory)
              </Text>
              <Text className="text-neutral-600 text-sm">
                Warm 1 cup milk (dairy or non-dairy) with 1 tsp turmeric, pinch of black pepper,
                1/2 tsp cinnamon, 1 tsp honey. Soothing and healing.
              </Text>
            </View>

            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">Recovery Bowl</Text>
              <Text className="text-neutral-600 text-sm">
                Base: quinoa or brown rice. Top with grilled salmon or chickpeas, roasted sweet
                potato, avocado, spinach, and tahini dressing. Complete nutrition in one bowl.
              </Text>
            </View>

            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-1">Energy Bites (No-Bake)</Text>
              <Text className="text-neutral-600 text-sm">
                Mix 1 cup oats, 1/2 cup nut butter, 1/4 cup honey, 1/4 cup ground flaxseed, 1/4 cup
                chocolate chips. Roll into balls for quick energy.
              </Text>
            </View>

            <View>
              <Text className="font-semibold text-neutral-900 mb-1">Nourishing Soup</Text>
              <Text className="text-neutral-600 text-sm">
                Simmer bone broth with ginger, garlic, vegetables, and cooked chicken. Add miso
                paste at the end. Freeze portions for easy meals.
              </Text>
            </View>
          </View>
        </Card>

        {/* Practical Tips */}
        <Card title="Practical Tips">
          <Text className="text-neutral-700 mb-1">• Prep freezer meals or accept meal trains</Text>
          <Text className="text-neutral-700 mb-1">
            • Keep snacks visible: nuts, fruit, cheese, crackers
          </Text>
          <Text className="text-neutral-700 mb-1">
            • Hydrate—aim for a glass of water every time you feed baby
          </Text>
          <Text className="text-neutral-700 mb-1">• Don’t skip meals—your body needs fuel</Text>
          <Text className="text-neutral-700 mb-1">
            • Consider a quality prenatal/multivitamin for gaps
          </Text>
          <Text className="text-neutral-700">• Eat when you’re hungry; recovery is hard work</Text>
        </Card>

        {/* Reminder banner */}
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
            {e(":heartpulse:")} Remember
          </Text>
          <Text className="text-sm text-neutral-600">
            Perfect nutrition isn’t the goal—adequate nutrition is. Some days you’ll eat
            beautifully; other days you’ll survive on snacks. Both are okay. Be gentle with
            yourself and focus on progress, not perfection.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
