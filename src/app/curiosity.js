import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import WebViewContainer from "../components/WebViewContainer";

export default function CuriosityScreen() {
  const { url } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <WebViewContainer url={url} />
      </SafeAreaView>
    </>
  );
}
