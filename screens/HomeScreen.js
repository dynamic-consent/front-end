// screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import NoticeItem from '../components/NoticeItem';

/* SVG 카테고리 아이콘 */
import FinanceIcon from '../assets/icons/categories/finance.svg';
import MedicalIcon from '../assets/icons/categories/medical.svg';
import GovIcon from '../assets/icons/categories/government.svg';
import ShoppingIcon from '../assets/icons/categories/shopping.svg';
import TransitIcon from '../assets/icons/categories/transit.svg';
import SnsIcon from '../assets/icons/categories/sns.svg';
import TravelIcon from '../assets/icons/categories/travel.svg';
import EduIcon from '../assets/icons/categories/edu.svg';
import HobbyIcon from '../assets/icons/categories/hobby.svg';
import EtcIcon from '../assets/icons/categories/etc.svg';

/* 재사용 컴포넌트 */
function CategoryItem({ label, Icon }) {
  return (
    <View style={styles.categoryItem}>
      <Icon width={28} height={28} />
      <Text style={styles.categoryLabel}>{label}</Text>
    </View>
  );
}
function ConsentCard({ date, company, description }) {
  return (
    <View style={[styles.card, styles.cardShadow]}>
      <Text style={styles.cardDate}>{date}</Text>
      <Text style={styles.cardCompany}>{company}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const [expanded, setExpanded] = useState(false);
  const [isCheckPressed, setIsCheckPressed] = useState(false);
  const [isFoldPressed, setIsFoldPressed] = useState(false);

  // Android 레이아웃 애니메이션 활성화
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  return (
    <LinearGradient
      style={styles.bg}
      colors={['#FEFEFE', '#E1E9E4']}
      locations={[0, 0.4]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container}>

          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.username}>홍길동님</Text>
            <TouchableOpacity><Text>🔔</Text></TouchableOpacity>
          </View>

          {/* 위험도 카드 */}
          <View style={styles.warningCard}>
            <View style={styles.riskRow}>
              <View style={styles.riskTexts}>
                <Text style={styles.riskLine1}>
                  <Text style={styles.riskEmphRed}>4개 기관</Text> 에서 위험도가 감지되었어요
                </Text>
                <Text style={styles.riskLine2}>
                  현재 위험도 수치는 <Text style={styles.riskEmphAmber}>중간</Text>입니다
                </Text>
              </View>
              <View style={styles.riskBadge}>
                <Ionicons name="lock-closed" size={24} color="#fff" />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.outlineButton,
                { backgroundColor: isCheckPressed ? '#00752F' : '#F5F7F6', borderColor: '#00752F' },
              ]}
              onPressIn={() => setIsCheckPressed(true)}
              onPressOut={() => setIsCheckPressed(false)}
              onPress={() => navigation.navigate('RiskInstitution')}
              activeOpacity={0.9}
            >
              <Text style={[styles.outlineButtonText, { color: isCheckPressed ? '#FFFFFF' : '#14532D' }]}>
                해당 기관 확인하기 {'\u203A'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 카테고리 패널 */}
          <View style={styles.categoryPanel}>
            <View style={styles.categoryGrid}>
              {/* 1줄(항상 보임) */}
              <CategoryItem label="금융" Icon={FinanceIcon} />
              <CategoryItem label="의료" Icon={MedicalIcon} />
              <CategoryItem label="행정" Icon={GovIcon} />
              <CategoryItem label="쇼핑" Icon={ShoppingIcon} />

              {/* 펼쳤을 때만 보임 */}
              {expanded && (
                <>
                  <CategoryItem label="교통" Icon={TransitIcon} />
                  <CategoryItem label="SNS" Icon={SnsIcon} />
                  <CategoryItem label="여행" Icon={TravelIcon} />
                  <CategoryItem label="교육/업무" Icon={EduIcon} />
                  <CategoryItem label="취미" Icon={HobbyIcon} />
                  <CategoryItem label="기타" Icon={EtcIcon} />
                </>
              )}
            </View>

            <View style={styles.foldDivider} />
            <TouchableOpacity
              style={[
                styles.foldRow,
                { backgroundColor: isFoldPressed ? '#00752F' : '#F5F7F6', borderRadius: 8 },
              ]}
              onPress={toggleExpanded}
              onPressIn={() => setIsFoldPressed(true)}
              onPressOut={() => setIsFoldPressed(false)}
              activeOpacity={0.8}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.foldText, { color: isFoldPressed ? '#FFFFFF' : '#6B7280' }]}>
                {expanded ? '접기' : '펼치기'}
              </Text>
              <Ionicons
                name="chevron-down"
                size={14}
                color={isFoldPressed ? '#FFFFFF' : '#6B7280'}
                style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
              />
            </TouchableOpacity>
          </View>

          {/* 최근 동의 변경 내역 */}
          <View style={styles.recentChangeHeader}>
            <Text style={styles.sectionTitle}>최근 동의 변경 내역</Text>
            <TouchableOpacity onPress={() => navigation.navigate('RecentChanges')}>
              <View style={styles.moreRow}>
                <Text style={styles.moreText}>더보기</Text>
                <Ionicons name="chevron-forward" size={14} color="#6b7280" />
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
            <ConsentCard date="25.07.18" company="지그재그" description="약관 변경 동의" />
            <ConsentCard date="25.06.05" company="APPLE" description="Apple 미디어 서비스 이용 약관 변경" />
          </ScrollView>

          {/* 공지사항 */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>공지사항</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Notices')}>
              <View style={styles.moreRow}>
                <Text style={styles.moreText}>더보기</Text>
                <Ionicons name="chevron-forward" size={14} color="#6b7280" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.noticeList}>
            <NoticeItem date="25.07.18" logo="🟠" company="인크루트" description="개인정보 처리 방침 개정 안내" />
            <NoticeItem date="25.05.01" logo="🟧" company="알바몬" description="개인정보 유출 관련 안내 및 사과" />
            <NoticeItem date="25.05.09" logo="🟦" company="SKT 텔레콤" description="유심 관련 개인정보 유출 가능성 통지" />
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

/* Styles */
const styles = StyleSheet.create({
  /* 배경/컨테이너 */
  bg: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    padding: 16,
    backgroundColor: 'transparent',
  },

  /* 헤더 */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: '#14532d',
  },

  /* 위험도 카드 */
  warningCard: {
    backgroundColor: '#f3f7f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  riskTexts: {
    flex: 1,
    paddingRight: 12,
  },
  riskLine1: {
    fontSize: 13,
    color: '#1f2937',
    marginBottom: 4,
  },
  riskLine2: {
    fontSize: 13,
    color: '#1f2937',
  },
  riskEmphRed: {
    color: '#e11d48',
    fontWeight: '800',
  },
  riskEmphAmber: {
    color: '#eab308',
    fontWeight: '800',
  },
  riskBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#14532d',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F5F7F6',
  },
  outlineButtonText: {
    color: '#14532d',
    fontWeight: '700',
  },

  /* 카테고리 패널 */
  categoryPanel: {
    backgroundColor: '#F5F7F6',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  categoryItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryLabel: {
    marginTop: 7, //아이콘, 글씨 간격 조절
    fontSize: 13,
    color: '#14532d',
    fontWeight: '600',
  },

  /* 펼치기 */
  foldDivider: {
    height: 1,
    backgroundColor: '#E1E9E4',
    marginTop: 4,
  },
  foldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 6,          
    paddingVertical: 8,
    marginTop: 6,
    borderRadius: 8,
  },
  foldText: {
    fontSize: 12,
    color: '#6b7280',
  },

  /* 섹션 헤더들 */
  recentChangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0b3d2a',
  },
  moreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreText: {
    color: '#6b7280',
    fontSize: 13,
  },

  /* 최근 동의 변경 내역 카드 */
  card: {
    backgroundColor: '#F5F7F6 ',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 180,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardShadow: {
    //iOS
     shadowColor: '#000',
     shadowOpacity: 0.08,
     shadowRadius: 6,
     shadowOffset: { width: 0, height: 3 },
     // Android
     elevation: 2,
     backgroundColor: '#F5F7F6',
   },
  
  cardDate: {
    fontSize: 12,
    color: '#0B1215',
    marginBottom: 4,
  },
  cardCompany: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    color: '#00752F',
  },
  cardDescription: {
    fontSize: 13,
    color: '#0B1215',
  },

  /* 공지 목록 */
  noticeList: {
    gap: 12,
    marginBottom: 32,
    backgroundColor: '#F5F7F6',
    borderRadius: 12,
    padding: 12,
  },
});
