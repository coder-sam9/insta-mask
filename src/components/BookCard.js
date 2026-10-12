import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { api } from "../services/api";
import { COLORS, FONTS, SPACING } from "../utils/theme";

export default function BookCard({ book, onPress }) {
  const coverUrl = api.getCoverUrl(book.coverId, "M");

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.coverWrap}>
        {coverUrl ? (
          <Image
            source={{ uri: coverUrl }}
            style={styles.cover}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>{book.title[0]}</Text>
          </View>
        )}
        {book.hasScan && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>READ</Text>
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {book.title}
      </Text>
      <Text style={styles.author} numberOfLines={1}>
        {book.authors[0] || "Unknown"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { width: 140, marginRight: SPACING.md },
  coverWrap: {
    width: 140,
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  cover: { width: "100%", height: "100%" },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.accent,
  },
  placeholderText: { fontSize: 48, fontWeight: "bold", color: COLORS.surface },
  badge: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: { fontSize: 10, fontWeight: "bold", color: COLORS.surface },
  title: {
    ...FONTS.small,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  author: { ...FONTS.small, fontSize: 12, color: COLORS.textLight },
});
