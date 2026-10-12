import { useRouter } from "expo-router";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Shelf from "../components/Shelf";
import { COLORS, FONTS, SPACING } from "../utils/theme";

type Book = {
  id: string;
  title: string;
  authors: string[];
  year?: number;
  coverId?: number;
  hasScan: boolean;
  iaId?: string | null;
};

const HOME_SHELVES = [
  {
    id: "trending",
    title: "Trending Today",
    subtitle: "The most-wanted books on Open Library right now.",
    shelfType: "trending",
  },
  {
    id: "fiction",
    title: "Classic Fiction",
    subtitle: "The canon — spine-broken, dog-eared and beloved.",
    shelfType: "fiction",
  },
  {
    id: "humor",
    title: "Comedy & Humour",
    subtitle: "Wit, farce and excellent nonsense.",
    shelfType: "humor",
  },
  {
    id: "scifi",
    title: "Science Fiction",
    subtitle: "Rocketships from long before rockets existed.",
    shelfType: "science_fiction",
  },
  {
    id: "adventure",
    title: "Adventure & Sea Tales",
    subtitle: "High seas, lost worlds and suspiciously thin maps.",
    shelfType: "adventure",
  },
  {
    id: "mystery",
    title: "Mystery & Crime",
    subtitle: "Drawing-room murders and fog-bound streets.",
    shelfType: "mystery",
  },
  {
    id: "fairy-tales",
    title: "Children’s Corner",
    subtitle: "Fairy tales, fables and talking rabbits.",
    shelfType: "fairy_tales",
  },
  {
    id: "poetry",
    title: "Verse & Poetry",
    subtitle: "Sonnets, epics and loose leaves.",
    shelfType: "poetry",
  },
  {
    id: "philosophy",
    title: "Non-Fiction · Ideas",
    subtitle: "Philosophy, essays and stubborn opinions.",
    shelfType: "philosophy",
  },
];

export default function HomeScreen() {
  const router = useRouter();

  const handleBookPress = (book: Book) => {
    router.push({
      pathname: "/detail/[id]",
      params: { id: book.id, book: JSON.stringify(book) },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={HOME_SHELVES}
        keyExtractor={(shelf) => shelf.id}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Bookish</Text>
                <Text style={styles.subtitle}>A public reading room</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Search books"
                style={styles.searchButton}
                onPress={() => router.push("/search")}
              >
                <Text style={styles.searchButtonText}>Search the stacks</Text>
              </Pressable>
            </View>
            <View style={styles.hero}>
              <Text style={styles.kicker}>OPEN LIBRARY × INTERNET ARCHIVE</Text>
              <Text style={styles.headline}>
                Millions of books, <Text style={styles.emphasis}>shelved</Text>
                {" — "}
                ready to be read.
              </Text>
              <Text style={styles.lede}>
                Browse the catalogue and open books with free scans right here.
                Look for the READ badge on a cover.
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <Shelf
            title={item.title}
            subtitle={item.subtitle}
            shelfType={item.shelfType}
            onBookPress={handleBookPress}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: SPACING.xl },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  title: { ...FONTS.title, fontWeight: "600", color: COLORS.text },
  subtitle: { ...FONTS.small, color: COLORS.textLight },
  hero: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  kicker: {
    ...FONTS.small,
    color: COLORS.accent,
    fontSize: 11,
    letterSpacing: 1.4,
    marginBottom: SPACING.sm,
  },
  headline: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "600",
    color: COLORS.text,
  },
  emphasis: { color: COLORS.accent, fontStyle: "italic" },
  lede: {
    ...FONTS.regular,
    color: COLORS.textLight,
    marginTop: SPACING.md,
  },
  searchButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  searchButtonText: {
    ...FONTS.small,
    fontWeight: "600",
    color: COLORS.surface,
  },
});
