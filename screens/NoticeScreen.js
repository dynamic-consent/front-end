import React from 'react';
import { View, Text } from 'react-native';

export default function NoticesScreen() {
  return (
    <View style={{ flex:1, padding:16 }}>
      <Text style={{ fontSize:18, fontWeight:'700' }}>공지사항</Text>
      {/* 추후 목록 연결 예정 */}
    </View>
  );
}
