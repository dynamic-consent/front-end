// components/NoticeItem.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function NoticeItem({
  date,
  logo,          // 이모지 or 이미지 소스
  company,
  description,
  showDivider = true, // 마지막 항목이면 false로 넘기면 밑줄 안나옴(옵션)
  onPress,       // 클릭 이벤트 핸들러
}) {
  // logo가 이미지 소스인지 확인 (require()로 전달된 경우)
  // require()는 숫자(리소스 ID) 또는 객체를 반환할 수 있음
  const isImageSource = logo && (typeof logo === 'number' || (typeof logo === 'object' && logo.uri !== undefined));

  const content = (
    <View
      style={[
        styles.container,
        { borderBottomWidth: showDivider ? 1 : 0 },
      ]}
    >
      {/* 좌측 로고 */}
      <View style={styles.logoWrap}>
        {isImageSource ? (
          <Image source={logo} style={styles.logoImage} resizeMode="contain" />
        ) : (
          <Text style={styles.logo}>{logo}</Text>
        )}
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

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
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
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logo: {
    fontSize: 22,
  },
  logoImage: {
    width: 34,
    height: 34,
    borderRadius: 6,
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
