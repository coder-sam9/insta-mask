import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenCapture from "expo-screen-capture";
import { useEffect, useRef } from "react";
import { AppState, Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { COLORS } from "../utils/theme";

export default function ExploreWebScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialUrl = Array.isArray(params.url)
    ? params.url[0]
    : params.url || "https://www.google.com";

  const appState = useRef(AppState.currentState);

  // 1. Recents preview screen protection (blackout / blur)
  useEffect(() => {
    const setupProtection = async () => {
      try {
        await ScreenCapture.preventScreenCaptureAsync();
        if (Platform.OS === "ios") {
          await ScreenCapture.enableAppSwitcherProtectionAsync(0.9);
        }
      } catch (error) {
        console.warn("Protection error:", error);
      }
    };

    setupProtection();

    return () => {
      const cleanupProtection = async () => {
        try {
          await ScreenCapture.allowScreenCaptureAsync();
          if (Platform.OS === "ios") {
            await ScreenCapture.disableAppSwitcherProtectionAsync();
          }
        } catch (error) {
          console.warn("Cleanup error:", error);
        }
      };
      cleanupProtection();
    };
  }, []);

  // 2. Catch the resume event (when turning phone back on or reopening) and force home redirect
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // The millisecond the user wakes the phone or reopens the app, bounce home instantly
        router.replace("/");
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.webviewContainer}>
          <WebView
            source={{ uri: initialUrl }}
            style={styles.webview}
            javaScriptEnabled
            domStorageEnabled
            allowsBackForwardNavigationGestures
            scalesPageToFit
            nestedScrollEnabled
            mixedContentMode="always"
            cacheEnabled
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
