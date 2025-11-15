import { ClerkProvider } from "@clerk/clerk-expo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./navigator/RootNavigator";

export default function App() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("Missing Clerk Publishable Key");
  }

  return (
    // for you to use clerk it need to be wrapped with clerkProvider
    <ClerkProvider publishableKey={publishableKey}>
      {/* prevent app from hiding under the notches */}
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
