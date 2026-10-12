import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { WebView } from "react-native-webview";
import { COLORS, FONTS, SPACING } from "../utils/theme";

export default function WebViewContainer({ url }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loadTimeout, setLoadTimeout] = useState(false);

  useEffect(() => {
    // Set a 15-second timeout for loading
    const timer = setTimeout(() => {
      if (loading && !error) {
        setLoadTimeout(true);
        setError("Book reader is taking too long to load. Please try again.");
        setLoading(false);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [loading, error]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setLoadTimeout(false);
    setReloadKey((key) => key + 1);
  };

  return (
    <View style={styles.container}>
      <WebView
        key={reloadKey}
        source={{ uri: url }}
        style={styles.webview}
        onLoadStart={() => {
          setLoading(true);
          setError(null);
          setLoadTimeout(false);
        }}
        onLoadEnd={() => setLoading(false)}
        onError={(event) => {
          setLoading(false);
          setError(
            event.nativeEvent.description || "Could not load this page.",
          );
        }}
        onHttpError={(event) => {
          setLoading(false);
          setError(
            `The page returned an error (${event.nativeEvent.statusCode}).`,
          );
        }}
        startInLoadingState={false}
        javaScriptEnabled
        domStorageEnabled
        allowsBackForwardNavigationGestures
        scalesPageToFit
        nestedScrollEnabled
        mixedContentMode="always"
        cacheEnabled
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
      />
      {loading && !error && !loadTimeout && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.message}>Opening the book…</Text>
          <Text style={styles.subMessage}>This may take a moment</Text>
        </View>
      )}
      {error && (
        <View style={styles.overlay}>
          <Text style={styles.errorTitle}>Couldn&apos;t load the reader</Text>
          <Text style={styles.message}>{error}</Text>
          <Pressable
            accessibilityRole="button"
            style={styles.retryButton}
            onPress={handleRetry}
          >
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  errorTitle: {
    ...FONTS.subtitle,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  message: {
    ...FONTS.small,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: SPACING.sm,
  },
  subMessage: {
    ...FONTS.small,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: SPACING.xs,
    fontSize: 12,
  },
  retryButton: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
  },
  retryText: { ...FONTS.small, color: COLORS.surface, fontWeight: "600" },
});
