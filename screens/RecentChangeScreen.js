import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RecentChangeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>최근 동의 변경 내역</Text>
      {/* 여기에 리스트나 내용 추가 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 }
});
