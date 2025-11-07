import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, BookOpen } from "lucide-react-native";
import { Link, type Href } from "expo-router";

type Article = {
  title: string;
  preview: string;
  image: string;   // emoji
  category: string;
  to: Href;        // route path
};

const CATEGORIES = ["All", "Nutrition", "Mind", "Body", "Milk & Hormones", "Rest"] as const;

const ALL_ARTICLES: Article[] = [
  // {
  //   title: "Iron-Rich Foods for Recovery",
  //   preview: "Essential nutrients to support your postpartum healing and energy levels.",
  //   image: "🥗",
  //   category: "Nutrition",
  //   to: "/(root)/(tabs)/library/ironRichFoods",
  // },
  {
    title: "Healing Foods & Recipes",
    preview: "Nourishing meals and simple recipes that support your postpartum recovery.",
    image: "🥘",
    category: "Nutrition",
    to: "/(root)/(tabs)/library/healingFoods",
  },
  {
    title: "Breathing Through Anxiety",
    preview: "Simple techniques to calm your nervous system when feeling overwhelmed.",
    image: "🧘‍♀️",
    category: "Mind",
    to: "/(root)/(tabs)/library/breathing",
  },
  {
    title: "Managing Postpartum Mood",
    preview: "Understanding and navigating the emotional waves of early motherhood.",
    image: "🌸",
    category: "Mind",
    to: "/(root)/(tabs)/library/postpartumMood",
  },
  {
    title: "Gentle Core Recovery",
    preview: "Safe exercises to reconnect with your core after delivery.",
    image: "💪",
    category: "Body",
    to: "/(root)/(tabs)/library/coreRecovery",
  },
  {
    title: "Pelvic Floor Recovery",
    preview: "Gentle healing and strengthening for your pelvic floor after birth.",
    image: "🌺",
    category: "Body",
    to: "/(root)/(tabs)/library/pelvicFloor",
  },
  {
    title: "Understanding Milk Supply",
    preview: "What affects milk production and how to support healthy breastfeeding.",
    image: "🍼",
    category: "Milk & Hormones",
    to: "/(root)/(tabs)/library/milk",
  },
  {
    title: "Baby Feeding Schedule Guide",
    preview: "Age-based feeding frequency and hunger cues to keep baby nourished.",
    image: "🍼",
    category: "Feeding & Nutrition",
    to: "/(root)/(tabs)/library/babyFeeding",
  },
  {
    title: "Newborn Care Basics",
    preview: "Everyday care tips, soothing techniques, and what's normal for newborns.",
    image: "👶",
    category: "Newborn Basics",
    to: "/(root)/(tabs)/library/newbornCare",
  },
  {
    title: "Safe Postpartum Exercise",
    preview: "Safety guidelines, a phased timeline, and starter moves after birth.",
    image: "🏃‍♀️",
    category: "Exercise & Recovery",
    to: "/(root)/(tabs)/library/postpartumExercise",
  },
  {
    title: "Self-Care for New Moms",
    preview: "Quick self-care ideas, types of self-care, and overcoming barriers.",
    image: "💝",
    category: "Mental & Emotional Health",
    to: "/(root)/(tabs)/library/momSelfCare",
  },
  // {
  //   title: "Hormone Shifts Explained",
  //   preview: "Understanding the hormonal roller coaster after birth and how to support balance.",
  //   image: "⚡",
  //   category: "Milk & Hormones",
  //   to: "/(root)/(tabs)/library/hormoneShifts",
  // },
  {
    title: "Rest & Sleep for Recovery",
    preview: "Prioritizing rest and sleep strategies to support your postpartum healing.",
    image: "🌙",
    category: "Rest",
    to: "/(root)/(tabs)/library/restAndSleep",
  },
  {
    title: "Creating a Sleep Routine",
    preview: "Practical strategies to improve sleep quality during the postpartum period.",
    image: "💤",
    category: "Rest",
    to: "/(root)/(tabs)/library/sleepRoutine",
  },
];


export default function LibraryIndex() {
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_ARTICLES.filter((a) => {
      const categoryOK = activeCategory === "All" || a.category === activeCategory;
      const textOK = !q || a.title.toLowerCase().includes(q) || a.preview.toLowerCase().includes(q);
      return categoryOK && textOK;
    });
  }, [activeCategory, query]);

  // Header content rendered above the list items so the WHOLE screen scrolls
  const renderHeader = () => (
    <View className="p-6 pt-4">
      {/* Title */}
      <View className="flex-row items-center gap-2 mb-4">
        <BookOpen size={22} />
        <Text className="text-3xl font-JakartaExtraBold text-primary-600">Library</Text>
      </View>
      <Text className="text-lg font-Jakarta text-neutral-700 mb-4">
        Browse resources and articles
      </Text>

      {/* Search */}
      <View className="relative mb-6">
        <Pressable
          onPress={() => setQuery(input)}
          className="absolute left-3 top-3"
          hitSlop={10}
        >
          <Search size={18} color="#6b7280" />
        </Pressable>

        <TextInput
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => setQuery(input)} // iOS “Search” key
          returnKeyType="search"
          placeholder="Search articles..."
          className="pl-10 pr-4 h-12 bg-white border border-neutral-200 rounded-xl text-[16px]"
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Categories */}
      <FlatList
        data={CATEGORIES as unknown as string[]}
        keyExtractor={(c) => c}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
        className="mb-4"
        renderItem={({ item: category }) => {
          const active = activeCategory === category;
          return (
            <Pressable
              onPress={() => setActiveCategory(category as (typeof CATEGORIES)[number])}
              className={[
                "px-5 py-2 mr-2 rounded-full font-medium",
                active ? "bg-accent" : "bg-neutral-200",
              ].join(" ")}
            >
              <Text className={active ? "text-white font-semibold" : "text-neutral-800 font-medium"}>
                {category}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );

  const renderItem = ({ item: article }: { item: Article }) => (
    <View className="px-6">
      <Link href={article.to} asChild>
        <Pressable className="p-5 bg-white border-2 border-primary rounded-2xl active:opacity-80 mb-4">
          <View className="flex-row gap-4">
            <View className="w-20 h-20 rounded-xl items-center justify-center bg-primary/20">
              <Text className="text-4xl">{article.image}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-neutral-900 mb-1">
                {article.title}
              </Text>
              <Text className="text-sm text-neutral-600" numberOfLines={2}>
                {article.preview}
              </Text>
              <Text className="text-xs text-accent mt-2">Read more →</Text>
            </View>
          </View>
        </Pressable>
      </Link>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary-100">
      <FlatList
        data={filtered}
        keyExtractor={(a) => a.title}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={
          <View className="px-6 pb-8">
            <Text className="text-center text-sm italic text-neutral-500">
              Knowledge is part of healing 💗
            </Text>
          </View>
        }
        // Nice touches
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
