// components/NoticeItem.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NoticeItem({
  date,
  logo,          // 이모지 or 이미지 대신 Text로 표시 중
  company,
  description,
  showDivider = true, // 마지막 항목이면 false로 넘기면 밑줄 안나옴(옵션)
}) {
  return (
    <View
      style={[
        styles.container,
        { borderBottomWidth: showDivider ? 1 : 0 },
      ]}
    >
      {/* 좌측 로고 */}
      <View style={styles.logoWrap}>
        <Text style={styles.logo}>{logo}</Text>
      </View>

      {/* 우측 텍스트 영역 */}
      <View style={{ flex: 1 }}>
        <View style={styles.titleRow}>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.company}>{company}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomColor: '#E1E9E4',   // 구분선 색상
  },

  // 로고(이모지/아이콘)
  logoWrap: {
    width: 34,
    alignItems: 'center',
    marginRight: 12,
  },
  logo: {
    fontSize: 22,
  },

  // 첫 줄: 날짜 + 회사명
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  date: {
    width: 72,              
    fontSize: 14,
    color: '#0B1215',
    marginRight: 8,
  },
  company: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00752F',
  },

  // 둘째 줄: 설명
  description: {
    fontSize: 13,
    color: '#0B1215',
    marginTop: 2,
  },
});
