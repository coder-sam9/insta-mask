import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebViewContainer from "../../components/WebViewContainer";
import { COLORS, FONTS, SPACING } from "../../utils/theme";

export default function ReadScreen() {
  const params = useLocalSearchParams();
  const rawIaId = Array.isArray(params.iaId) ? params.iaId[0] : params.iaId;
  const rawTitle = Array.isArray(params.title) ? params.title[0] : params.title;
  const iaId = typeof rawIaId === "string" ? rawIaId.trim() : "";
  const title = typeof rawTitle === "string" ? rawTitle : "Reader";
  // Use mobile-optimized embed URL with params for better loading
  const url = iaId
    ? `https://archive.org/embed/${encodeURIComponent(iaId)}?output=embed&useragent=mobile`
    : null;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen options={{ title }} />
      {url ? (
        <WebViewContainer url={url} />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No scan identifier provided</Text>
          <Text style={styles.emptyText}>
            Return to the book details and open a book with an available scan.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  emptyTitle: {
    ...FONTS.subtitle,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyText: { ...FONTS.small, color: COLORS.textLight, textAlign: "center" },
});
