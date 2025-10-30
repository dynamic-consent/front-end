// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// SVG transformer 비활성화 (transformFile 오류 방지)
// 대신 react-native-svg를 직접 사용

module.exports = config;
