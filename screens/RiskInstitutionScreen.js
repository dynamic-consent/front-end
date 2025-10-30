import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const MOCK = [
  { id: '1', name: '지그재그', risk: '중간', changedAt: '25.07.18' },
  { id: '2', name: 'APPLE', risk: '중간', changedAt: '25.06.05' },
  // TODO: 백엔드 연동 시 실제 데이터로 교체
];

export default function RiskInstitutionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>위험 감지 기관</Text>
      <FlatList
        data={MOCK}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 8 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.org}>{item.name}</Text>
            <Text style={styles.meta}>
              위험도: {item.risk} · 변경일: {item.changedAt}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F7F6' },
  title: { fontSize: 18, fontWeight: '700', color: '#0B1215' },
  card: {
    backgroundColor: '#F5F7F6',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  org: { fontSize: 15, fontWeight: '700', color: '#00752F', marginBottom: 4 },
  meta: { fontSize: 13, color: '#6b7280' },
});
