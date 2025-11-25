import React, { useMemo, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

/* 기관 아이콘 로더 */
import { getOrgIconInfo } from '../utils/orgIconLoader';

/** 좌측 카테고리 목록 */
const CATEGORIES = [
  '금융', 'SNS', '쇼핑', '교통','의료', '행정', '여행', '교육/업무', '취미', '기타',
];

/** 샘플 기관 데이터 */
const ORGS = [
  // 금융
  { id: 'k0', name: '토스', category: '금융' },
  { id: 'k1', name: '우리은행', category: '금융' },
  { id: 'k2', name: '신한은행', category: '금융' },
  { id: 'k3', name: '하나은행', category: '금융' },

  // SNS
  { id: 'n1', name: '카카오톡', category: 'SNS' },
  { id: 'n2', name: '네이버밴드', category: 'SNS' },
  { id: 'n3', name: '인스타그램', category: 'SNS' },
  { id: 'n4', name: '페이스북', category: 'SNS' },

  // 쇼핑
  { id: 's1', name: '쿠팡', category: '쇼핑' },
  { id: 's2', name: '11번가', category: '쇼핑' },
  { id: 's3', name: 'G마켓', category: '쇼핑' },
  { id: 's4', name: '옥션', category: '쇼핑' },
  
  // 교통
  { id: 't1', name: '카카오T', category: '교통' },
  { id: 't2', name: '우버', category: '교통' },
  { id: 't3', name: '티머니', category: '교통' },
  { id: 't4', name: '한국철도공사', category: '교통' },
  
  // 의료
  { id: 'm1', name: '서울대병원', category: '의료' },
  { id: 'm2', name: '삼성서울병원', category: '의료' },
  { id: 'm3', name: '세브란스병원', category: '의료' },
  { id: 'm4', name: '서울성모병원', category: '의료' },
  
  // 행정
  { id: 'g1', name: '정부24', category: '행정' },
  { id: 'g2', name: '국세청 홈택스', category: '행정' },
  { id: 'g3', name: '건강보험공단', category: '행정' },
  { id: 'g4', name: '내 곁에 국민연금', category: '행정' },
  

  
  // 여행
  { id: 'v1', name: '야놀자', category: '여행' },
  { id: 'v2', name: '여기어때', category: '여행' },
  { id: 'v3', name: '아고다', category: '여행' },
  { id: 'v4', name: '부킹닷컴', category: '여행' },
  
  // 교육/업무
  { id: 'e1', name: '구글클래스룸', category: '교육/업무' },
  { id: 'e2', name: '줌', category: '교육/업무' },
  { id: 'e3', name: '슬랙', category: '교육/업무' },
  { id: 'e4', name: '노션', category: '교육/업무' },
  
  // 취미
  { id: 'h1', name: '넷플릭스', category: '취미' },
  { id: 'h2', name: '왓챠', category: '취미' },
  { id: 'h3', name: '디즈니플러스', category: '취미' },
  { id: 'h4', name: '유튜브', category: '취미' },
  
  // 기타
  { id: 'o1', name: '구글', category: '기타' },
  { id: 'o2', name: '네이버', category: '기타' },
  { id: 'o3', name: '다음', category: '기타' },
  { id: 'o4', name: 'T멤버쉽', category: '기타' },
];

// 기관별 아이콘 데이터
const orgIconData = {
  '토스': {
    logoText: '토스',
    logoStyle: { borderRadius: 8 }
  },
  '우리은행': {
    logoText: '우리',
    logoStyle: { backgroundColor: '#1E88E5', borderRadius: 20 }
  },
  '신한은행': {
    logoText: '신한',
    logoStyle: { backgroundColor: '#1E88E5', borderRadius: 4 }
  },
  '하나은행': {
    logoText: '하나',
    logoStyle: { backgroundColor: '#4CAF50', borderRadius: 4 }
  },
  '서울대병원': {
    logoText: '서울',
    logoStyle: { backgroundColor: '#E91E63', borderRadius: 8 }
  },
  '삼성서울병원': {
    logoText: '삼성',
    logoStyle: { backgroundColor: '#9C27B0', borderRadius: 8 }
  },
  '세브란스병원': {
    logoText: '세브',
    logoStyle: { backgroundColor: '#673AB7', borderRadius: 8 }
  },
  '서울성모병원': {
    logoText: '성심',
    logoStyle: { backgroundColor: '#3F51B5', borderRadius: 8 }
  },
  '정부24': {
    logoText: '정부',
    logoStyle: { backgroundColor: '#2196F3', borderRadius: 8 }
  },
  '국세청 홈택스': {
    logoText: '국세',
    logoStyle: { backgroundColor: '#00BCD4', borderRadius: 8 }
  },
  '건강보험공단': {
    logoText: '건보',
    logoStyle: { backgroundColor: '#009688', borderRadius: 8 }
  },
  '내 곁에 국민연금': {
    logoText: '국민',
    logoStyle: { backgroundColor: '#4CAF50', borderRadius: 8 }
  },
  '쿠팡': {
    logoText: '쿠팡',
    logoStyle: { backgroundColor: '#FF6B35', borderRadius: 8 }
  },
  '11번가': {
    logoText: '11',
    logoStyle: { backgroundColor: '#FF6B35', borderRadius: 8 }
  },
  'G마켓': {
    logoText: 'G',
    logoStyle: { backgroundColor: '#FF6B35', borderRadius: 8 }
  },
  '옥션': {
    logoText: '옥션',
    logoStyle: { backgroundColor: '#FFEB3B', borderRadius: 8 }
  },
  '카카오T': {
    logoText: '카카오T',
    logoStyle: { backgroundColor: '#FEE500', borderRadius: 8 }
  },
  '우버': {
    logoText: 'U',
    logoStyle: { backgroundColor: '#000000', borderRadius: 8 }
  },
  '티머니': {
    logoText: 'T',
    logoStyle: { backgroundColor: '#607D8B', borderRadius: 8 }
  },
  '한국철도공사': {
    logoText: 'KORAIL',
    logoStyle: { backgroundColor: '#795548', borderRadius: 8 }
  },
  '카카오톡': {
    logoText: '톡',
    logoStyle: { backgroundColor: '#FEE500', borderRadius: 8 }
  },
  '네이버밴드': {
    logoText: '밴드',
    logoStyle: { backgroundColor: '#4CAF50', borderRadius: 8 }
  },
  '인스타그램': {
    logoText: 'IG',
    logoStyle: { backgroundColor: '#E91E63', borderRadius: 8 }
  },
  '페이스북': {
    logoText: 'FB',
    logoStyle: { backgroundColor: '#2196F3', borderRadius: 8 }
  },
  '야놀자': {
    logoText: '야놀',
    logoStyle: { backgroundColor: '#FF5722', borderRadius: 8 }
  },
  '여기어때': {
    logoText: '여기',
    logoStyle: { backgroundColor: '#FF9800', borderRadius: 8 }
  },
  '아고다': {
    logoText: 'A',
    logoStyle: { backgroundColor: '#FFC107', borderRadius: 8 }
  },
  '부킹닷컴': {
    logoText: 'B',
    logoStyle: { backgroundColor: '#FFEB3B', borderRadius: 8 }
  },
  '구글클래스룸': {
    logoText: 'G',
    logoStyle: { backgroundColor: '#4285F4', borderRadius: 8 }
  },
  '줌': {
    logoText: 'Z',
    logoStyle: { backgroundColor: '#2D8CFF', borderRadius: 8 }
  },
  '슬랙': {
    logoText: 'S',
    logoStyle: { backgroundColor: '#4A154B', borderRadius: 8 }
  },
  '노션': {
    logoText: 'N',
    logoStyle: { backgroundColor: '#000000', borderRadius: 8 }
  },
  '넷플릭스': {
    logoText: 'N',
    logoStyle: { backgroundColor: '#E50914', borderRadius: 8 }
  },
  '왓챠': {
    logoText: 'W',
    logoStyle: { backgroundColor: '#FF6B35', borderRadius: 8 }
  },
  '디즈니플러스': {
    logoText: 'D',
    logoStyle: { backgroundColor: '#113CCF', borderRadius: 8 }
  },
  '유튜브': {
    logoText: 'Y',
    logoStyle: { backgroundColor: '#FF0000', borderRadius: 8 }
  },
  '구글': {
    logoText: 'G',
    logoStyle: { backgroundColor: '#4285F4', borderRadius: 8 }
  },
  '네이버': {
    logoText: 'N',
    logoStyle: { backgroundColor: '#03C75A', borderRadius: 8 }
  },
  '다음': {
    logoText: 'D',
    logoStyle: { backgroundColor: '#FF6B35', borderRadius: 8 }
  },
  'T멤버쉽': {
    logoText: 'T',
    logoStyle: { backgroundColor: '#00BCF2', borderRadius: 8 }
  }
};

/** 기관 카드 셀 */
function OrgCell({ name, onPress }) {
  const iconInfo = getOrgIconInfo(name);
  const orgInfo = orgIconData[name] || {
    logoText: '?',
    logoStyle: { backgroundColor: '#2FA36B', borderRadius: 10 }
  };

  return (
    <TouchableOpacity style={styles.cell} activeOpacity={0.85} onPress={onPress}>
      <View style={[styles.logoBox, iconInfo.logoType === 'svg' || iconInfo.logoType === 'image' ? {} : orgInfo.logoStyle]}>
        {iconInfo.logoType === 'svg' ? (
          <iconInfo.logoComponent width={40} height={40} />
        ) : iconInfo.logoType === 'image' ? (
          <Image source={iconInfo.imageSource} style={{ width: 40, height: 40 }} resizeMode="contain" />
        ) : (
          <Text style={styles.logoText}>{iconInfo.logoText}</Text>
        )}
      </View>
      <Text numberOfLines={1} style={styles.cellLabel}>{name}</Text>
    </TouchableOpacity>
  );
}

const LAST_CATEGORY_KEY = 'OrgScreen:lastCategory';

export default function OrgScreen({ route, navigation }) {
  const [selected, setSelected] = useState('금융');
  const data = useMemo(() => ORGS.filter(o => o.category === selected), [selected]);

  // 저장된 마지막 카테고리 불러오기
  useEffect(() => {
    let isMounted = true;
    const loadLastCategory = async () => {
      try {
        const saved = await AsyncStorage.getItem(LAST_CATEGORY_KEY);
        if (saved && CATEGORIES.includes(saved) && isMounted) {
          setSelected(saved);
        }
      } catch (error) {
        console.log('기관 카테고리 로드 실패:', error);
      }
    };

    loadLastCategory();

    return () => {
      isMounted = false;
    };
  }, []);

  // 카테고리 변경 시 저장
  useEffect(() => {
    AsyncStorage.setItem(LAST_CATEGORY_KEY, selected).catch((error) => {
      console.log('기관 카테고리 저장 실패:', error);
    });
  }, [selected]);

  // 컴포넌트가 포커스를 받을 때마다 route params 확인
  useFocusEffect(
    React.useCallback(() => {
      if (route?.params?.selectedCategory && CATEGORIES.includes(route.params.selectedCategory)) {
        setSelected(route.params.selectedCategory);
      }
    }, [route?.params?.selectedCategory])
  );

  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={['#FFFFFF', '#E1E9E4']}  // 홈과 동일한 그라데이션
      locations={[0, 0.4]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.safeArea}>

        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>기관</Text>
          <View style={styles.notificationIcon} />
        </View>

        {/* ✅ 상단 고정 검색창 */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="기관명 검색"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>

        {/* 메인 콘텐츠 */}
        <View style={styles.container}>
          {/* 왼쪽 카테고리 */}
          <View style={styles.sidebar}>
            <ScrollView contentContainerStyle={{ paddingVertical: 8 }}>
              {CATEGORIES.map(cat => {
                const active = cat === selected;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.sideItem, active && styles.sideItemActive]}
                    onPress={() => setSelected(cat)}
                    activeOpacity={0.9}
                  >
                    {active && <View style={styles.sideIndicator} />}
                    <Text style={[styles.sideText, active && styles.sideTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* 오른쪽 기관 그리드 */}
          <View style={styles.content}>
            <FlatList
              data={data}
              keyExtractor={item => item.id}
              numColumns={4}
              columnWrapperStyle={{ justifyContent: 'flex-start' }}
              contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 0 }}
              renderItem={({ item }) => (
                <OrgCell 
                  name={item.name} 
                  onPress={() => {
                    navigation.navigate('OrgDetail', { orgName: item.name, selectedCategory: selected });
                  }} 
                />
              )}
              ListEmptyComponent={
                <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                  <Text style={{ color: '#7B8E82' }}>해당 카테고리의 기관이 없어요</Text>
                </View>
              }
            />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

/* ───────── Styles ───────── */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'visible', // 그림자 잘림 방지
    paddingTop: Platform.OS === 'ios' ? 44 : 0, // iOS 상태바 높이
  },

  /* 헤더 */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00752F',
  },
  notificationIcon: {
    padding: 8,
  },

  /* 검색창 */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 44,
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 8,
    paddingHorizontal: 12,

    // 통일된 그림자 설정
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0B1215',
    marginLeft: 8,
  },

  /* 전체 컨테이너 (사이드바 + 콘텐츠) */
  container: { flex: 1, flexDirection: 'row' },

  /* 사이드바 */
  sidebar: {
    width: 80,
    backgroundColor: '#EAEFED',
  },
  sideItem: {
    height: 48,
    paddingLeft: 12,
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#EAEFED',
  },
  sideItemActive: { backgroundColor: '#F5F7F6' },
  sideIndicator: {
    position: 'absolute',
    left: 0,
    top: 12,
    bottom: 12,
    width: 3,
    borderRadius: 2,
    backgroundColor: '#00752F',
  },
  sideText: { color: '#0B1215', fontSize: 15, fontWeight: '500' },
  sideTextActive: { color: '#00752F', fontWeight: '700' },

  /* 콘텐츠 */
  content: { flex: 1, backgroundColor: '#F5F7F6' },

  /* 기관 셀 */
  cell: {
    width: '25%', // 4열
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cellLabel: {
    marginTop: 8,
    fontSize: 13,
    color: '#0B1215',
    maxWidth: 70,
    textAlign: 'center',
    fontWeight: '500',
  },
});
