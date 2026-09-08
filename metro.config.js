const { getDefaultConfig } = require("expo/metro-config")

const config = getDefaultConfig(__dirname)

// Stub Coinbase mobile wallet protocol so Expo Go can bundle thirdweb without MWP.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "@mobile-wallet-protocol/client") {
    return {
      type: "empty",
    }
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
