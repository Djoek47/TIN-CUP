module.exports = {
  dependencies: {
    // Pulled transitively by wallet stacks we do not ship in v1 store builds.
    "@aws-amplify/rtn-push-notification": { platforms: { ios: null, android: null } },
    "amazon-cognito-identity-js": { platforms: { ios: null, android: null } },
    "@coinbase/wallet-mobile-sdk": { platforms: { ios: null, android: null } },
    "react-native-mmkv": { platforms: { ios: null, android: null } },
  },
}
