import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../services/api";
import { COLORS, FONTS, SPACING } from "../utils/theme";

const SEARCH_RESULT_LIMIT = 30;
const VISIBLE_RESULT_STEP = 12;

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [visibleCount, setVisibleCount] = useState(VISIBLE_RESULT_STEP);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);

  // Reset state when query is too short
  if (query.trim().length < 2 && (results.length > 0 || error || loading)) {
    setResults([]);
    setResultCount(0);
    setError(null);
    setLoading(false);
  }

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 2) {
      return undefined;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        const data = await api.search(
          normalizedQuery,
          SEARCH_RESULT_LIMIT,
          controller.signal,
        );
        if (!controller.signal.aborted) {
          setResults(data.results);
          setResultCount(data.count);
          setVisibleCount(VISIBLE_RESULT_STEP);
          setError(null);
          setLoading(false);
        }
      } catch (e) {
        if (!controller.signal.aborted) {
          setError(
            e instanceof Error ? e.message : "Search failed. Please try again.",
          );
          setResults([]);
          setResultCount(0);
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, retry]);

  const handleBookPress = (book) => {
    router.push({
      pathname: "/detail/[id]",
      params: { id: book.id, book: JSON.stringify(book) },
    });
  };

  const handleNidaSamiPress = () => {
    router.push({
      pathname: "/explore-web",
      params: { url: "https://www.google.com" },
    });
  };

  const renderItem = ({ item }) => {
    const coverUrl = api.getCoverUrl(item.coverId, "S");
    return (
      <TouchableOpacity
        accessibilityRole="button"
        style={styles.item}
        onPress={() => handleBookPress(item)}
      >
        {coverUrl ? (
          <Image
            source={{ uri: coverUrl }}
            style={styles.cover}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.cover, styles.placeholder]}>
            <Text style={styles.placeholderText}>
              {item.title?.trim()?.[0]?.toUpperCase() || "?"}
            </Text>
          </View>
        )}
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.itemAuthor} numberOfLines={1}>
            {item.authors?.[0] || "Unknown author"}
            {item.year ? ` · ${item.year}` : ""}
          </Text>
          <Text style={styles.subject} numberOfLines={1}>
            {item.subjects?.[0] || "Catalogue"}
          </Text>
        </View>
        <Text style={[styles.badge, !item.hasScan && styles.noScan]}>
          {item.hasScan ? "READ" : "NO SCAN"}
        </Text>
      </TouchableOpacity>
    );
  };

  const visibleResults = results.slice(0, visibleCount);
  const normalizedQuery = query.trim();

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>SEARCH THE ENTIRE CATALOGUE</Text>
        <Text style={styles.heading}>Search the stacks.</Text>
      </View>
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon} accessible={false}>
          ⌕
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Try “Dracula”, “Austen”, or “Odyssey”…"
          placeholderTextColor={COLORS.textLight}
          value={query}
          onChangeText={setQuery}
          autoFocus
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Search books and authors"
        />
      </View>

      <View style={styles.resultsArea}>
        {normalizedQuery.length < 2 ? (
          <Text style={styles.hint}>
            Type at least 2 characters to search Open Library.
          </Text>
        ) : query === "nidasami" || query === "Nidasami" ? (
          <View style={styles.nidasamiContainer}>
            <Text style={styles.nidasamiText}>
              Looking for something special?
            </Text>
            <Pressable
              accessibilityRole="button"
              style={styles.nidasamiButton}
              onPress={handleNidaSamiPress}
            >
              <Text style={styles.nidasamiButtonText}>🌐</Text>
            </Pressable>
          </View>
        ) : loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.hint}>Searching for “{normalizedQuery}”…</Text>
          </View>
        ) : error ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Search unavailable</Text>
            <Text style={styles.emptyText}>{error}</Text>
            <Pressable
              accessibilityRole="button"
              style={styles.retryButton}
              onPress={() => setRetry((attempt) => attempt + 1)}
            >
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              Nothing under “{normalizedQuery}”.
            </Text>
            <Text style={styles.emptyText}>
              Try an author’s surname or a shorter title.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.hint}>
              {resultCount.toLocaleString()} matches · showing{" "}
              {visibleResults.length} of {results.length} fetched
            </Text>
            <FlatList
              data={visibleResults}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              ListFooterComponent={
                visibleCount < results.length ? (
                  <Pressable
                    accessibilityRole="button"
                    style={styles.moreButton}
                    onPress={() =>
                      setVisibleCount((count) => count + VISIBLE_RESULT_STEP)
                    }
                  >
                    <Text style={styles.moreButtonText}>Show more results</Text>
                  </Pressable>
                ) : null
              }
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  intro: { paddingHorizontal: SPACING.md, paddingTop: SPACING.lg },
  kicker: {
    ...FONTS.small,
    color: COLORS.accent,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  heading: {
    fontSize: 30,
    fontWeight: "600",
    fontStyle: "italic",
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.accent,
  },
  searchIcon: {
    color: COLORS.accent,
    fontSize: 26,
    paddingHorizontal: SPACING.xs,
  },
  input: {
    ...FONTS.regular,
    flex: 1,
    minHeight: 52,
    color: COLORS.text,
    paddingHorizontal: SPACING.sm,
  },
  resultsArea: { flex: 1, paddingTop: SPACING.sm },
  hint: {
    ...FONTS.small,
    color: COLORS.textLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  loading: { alignItems: "center", padding: SPACING.xl, gap: SPACING.md },
  list: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },
  item: {
    minHeight: 104,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
  },
  cover: { width: 52, height: 72, borderRadius: 4 },
  placeholder: {
    backgroundColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textLight,
  },
  itemInfo: { flex: 1 },
  itemTitle: {
    ...FONTS.regular,
    fontWeight: "600",
    color: COLORS.text,
  },
  itemAuthor: { ...FONTS.small, fontSize: 12, color: COLORS.textLight },
  subject: {
    ...FONTS.small,
    fontSize: 11,
    color: COLORS.accent,
    marginTop: 2,
  },
  badge: {
    ...FONTS.small,
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.accent,
  },
  noScan: { color: COLORS.textLight },
  empty: {
    margin: SPACING.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyTitle: {
    ...FONTS.subtitle,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emptyText: { ...FONTS.small, color: COLORS.textLight },
  retryButton: { alignSelf: "flex-start", paddingTop: SPACING.md },
  retryText: { ...FONTS.small, color: COLORS.accent, fontWeight: "600" },
  moreButton: {
    alignSelf: "center",
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 8,
  },
  moreButtonText: { ...FONTS.small, color: COLORS.accent, fontWeight: "600" },
  nidasamiContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  nidasamiTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  nidasamiText: {
    ...FONTS.regular,
    color: COLORS.textLight,
    textAlign: "center",
  },
  nidasamiButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.lg,
  },
  nidasamiButtonText: {
    fontSize: 40,
  },
});
