import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { api } from "../services/api";
import { COLORS, FONTS, SPACING } from "../utils/theme";
import BookCard from "./BookCard";

export default function Shelf({ title, subtitle, shelfType, onBookPress }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const results =
          shelfType === "trending"
            ? await api.getTrending(24, controller.signal)
            : await api.getShelfBooks(shelfType, 24, controller.signal);
        const readable = results.filter((book) => book.hasScan);
        const withoutScans = results.filter((book) => !book.hasScan);
        setBooks([...readable, ...withoutScans].slice(0, 5));
      } catch (e) {
        if (!controller.signal.aborted) {
          setError(
            e instanceof Error ? e.message : "Could not load this shelf.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [retry, shelfType]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      ) : error ? (
        <View style={styles.message}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setRetry((attempt) => attempt + 1)}
          >
            <Text style={styles.retry}>Try again</Text>
          </Pressable>
        </View>
      ) : books.length ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onPress={() => onBookPress(book)}
            />
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.message}>No books are available for this shelf.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  title: {
    ...FONTS.subtitle,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  subtitle: {
    ...FONTS.small,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  row: { paddingHorizontal: SPACING.md },
  loading: { height: 200, justifyContent: "center", alignItems: "center" },
  message: {
    ...FONTS.small,
    color: COLORS.textLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  errorText: { ...FONTS.small, color: COLORS.textLight },
  retry: {
    ...FONTS.small,
    color: COLORS.accent,
    fontWeight: "600",
    marginTop: SPACING.xs,
  },
});
