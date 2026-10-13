import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../services/api";
import { COLORS, FONTS, SPACING } from "../../utils/theme";

export default function DetailScreen() {
  const { id, book: bookJson } = useLocalSearchParams();
  const router = useRouter();
  const book = JSON.parse(bookJson);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getWorkDetails(id);
        setDetails(data);
      } catch (e) {
        console.error("Detail load failed:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const coverUrl = api.getCoverUrl(book.coverId, "L");
  const iaId = book.iaId || details?.ocaid;
  const canRead = Boolean(iaId);

  // const handleRead = () => {
  //   if (!iaId) return;
  //   router.push({
  //     pathname: "/read/[iaId]",
  //     params: { iaId, title: book.title },
  //   });
  // };

  const handleCuriosity = () => {
    const query = `${book.title} ${book.authors[0] || ""}`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    router.push({ pathname: "/curiosity", params: { url, title: book.title } });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {coverUrl && (
          <View style={styles.coverWrap}>
            <Image
              source={{ uri: coverUrl }}
              style={styles.cover}
              resizeMode="contain"
            />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>
            by {book.authors[0] || "Unknown"}
            {book.year && ` · ${book.year}`}
          </Text>

          {details?.description && (
            <View style={styles.descWrap}>
              <Text style={styles.descLabel}>Synopsis</Text>
              <Text style={styles.desc}>{details.description}</Text>
            </View>
          )}

          <View style={styles.buttons}>
            {/* {canRead ? (
              <TouchableOpacity style={styles.primaryBtn} onPress={handleRead}>
                <Text style={styles.primaryText}>Read Book</Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.primaryBtn, styles.disabled]}>
                <Text style={[styles.primaryText, styles.disabledText]}>
                  No Scan Available
                </Text>
              </View>
            )} */}

            {/* <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={handleCuriosity}
            >
              <Text style={styles.secondaryText}>Know More</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  coverWrap: { alignItems: "center", paddingVertical: SPACING.xl },
  cover: { width: 200, height: 300, borderRadius: 8 },
  info: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  author: {
    ...FONTS.regular,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  descWrap: { marginBottom: SPACING.xl },
  descLabel: {
    ...FONTS.small,
    fontWeight: "600",
    color: COLORS.accent,
    marginBottom: SPACING.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  desc: { ...FONTS.regular, color: COLORS.text, lineHeight: 28 },
  buttons: { gap: SPACING.md },
  primaryBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryText: { ...FONTS.regular, fontWeight: "600", color: COLORS.surface },
  disabled: { backgroundColor: COLORS.border },
  disabledText: { color: COLORS.textLight },
  secondaryBtn: {
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  secondaryText: { ...FONTS.regular, fontWeight: "600", color: COLORS.accent },
});
