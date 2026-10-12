import { Stack } from "expo-router";
import { COLORS } from "../utils/theme";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: "600" },
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="detail/[id]" options={{ title: "Book Details" }} />
      <Stack.Screen name="search" options={{ title: "Search" }} />
      <Stack.Screen name="read/[iaId]" options={{ title: "Reader" }} />
      <Stack.Screen name="curiosity" options={{ title: "Learn More" }} />
      <Stack.Screen name="explore-web" options={{ headerShown: false }} />
    </Stack>
  );
}
