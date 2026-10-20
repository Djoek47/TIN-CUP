const path = require("path")
const { getDefaultConfig } = require("expo/metro-config")

const config = getDefaultConfig(__dirname)

// Stub Coinbase mobile wallet protocol so Expo Go can bundle thirdweb without MWP.
// Stub Stripe RN on web — PaymentSheet is native-only (iOS/Android).
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "@mobile-wallet-protocol/client") {
    return {
      type: "empty",
    }
  }
  if (platform === "web" && moduleName === "@stripe/stripe-react-native") {
    return {
      filePath: path.resolve(__dirname, "shims/stripe-react-native.web.js"),
      type: "sourceFile",
    }
  }
  if (
    platform === "web" &&
    (moduleName === "@livekit/react-native" ||
      moduleName === "@livekit/react-native-webrtc" ||
      moduleName.startsWith("@livekit/react-native/"))
  ) {
    return { type: "empty" }
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
