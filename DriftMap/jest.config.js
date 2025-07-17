module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!(expo|expo-modules-core|react-native|@react-native|expo-location|react-native-google-nearby-messages|react-native-maps)/)'
  ]
};
