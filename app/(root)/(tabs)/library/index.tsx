import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { Link } from "expo-router";
import { Search, BookOpen } from "lucide-react-native";
import { Link, type Href } from "expo-router";


// If you use custom fonts like font-Jakarta*, make sure they’re loaded in your root.

type Article = {
  title: string;
  preview: string;
  image: string;     // emoji
  category: string;
  to: Href;        // route path
};

const CATEGORIES = ["Nutrition", "Mind", "Body", "Milk & Hormones", "Rest"] as const;

const ALL_ARTICLES: Article[] = [
  {
    title: "Iron-Rich Foods for Recovery",
    preview: "Essential nutrients to support your postpartum healing and energy levels.",
    image: "🥗",
    category: "Nutrition",
    to: "/(root)/(tabs)/library/breathing", // stub route (create later)
  },
  {
    title: "Breathing Through Anxiety",
    preview: "Simple techniques to calm your nervous system when feeling overwhelmed.",
    image: "🧘‍♀️",
    category: "Mind",
    to: "/(root)/(tabs)/library/breathing",
  },
  {
    title: "Gentle Core Recovery",
    preview: "Safe exercises to reconnect with your core after delivery.",
    image: "💪",
    category: "Body",
    to: "/(root)/(tabs)/library/coreRecovery", // stub route (create later)
  },
  {
    title: "Understanding Milk Supply",
    preview: "What affects milk production and how to support healthy breastfeeding.",
    image: "🍼",
    category: "Milk & Hormones",
    to: "/(root)/(tabs)/library/breathing", // stub route (create later)
  },
];

export default function LibraryIndex() {
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("Nutrition");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_ARTICLES.filter(a =>
      (activeCategory ? a.category === activeCategory : true) &&
      (q ? a.title.toLowerCase().includes(q) || a.preview.toLowerCase().includes(q) : true)
    );
  }, [activeCategory, query]);

  return (
    <SafeAreaView className="flex-1 bg-primary-100">
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
          <View className="absolute left-3 top-3">
            <Search size={18} color="#6b7280" />
          </View>
          <TextInput
            value={query}
            onChangeText={setQuery}
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

        {/* Article list */}
        <View className="gap-4 mb-6">
          {filtered.map((article) => (
            <Link key={article.title} href={article.to} asChild>
              <Pressable className="p-5 bg-white border-2 border-primary rounded-2xl active:opacity-80">
                <View className="flex-row gap-4">
                  <View className="w-20 h-20 rounded-xl items-center justify-center bg-primary/20">
                    <Text className="text-4xl">{article.image}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-neutral-900 mb-1">
                      {article.title}
                    </Text>
                    <Text
                      className="text-sm text-neutral-600"
                      numberOfLines={2}
                    >
                      {article.preview}
                    </Text>
                    <Text className="text-xs text-accent mt-2">Read more →</Text>
                  </View>
                </View>
              </Pressable>
            </Link>
          ))}
        </View>

        <Text className="text-center text-sm italic text-neutral-500">
          Knowledge is part of healing 💗
        </Text>
      </View>
    </SafeAreaView>
  );
}
