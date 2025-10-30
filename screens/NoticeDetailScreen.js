import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

/* 공통 아이콘 */
import { BellIcon } from '../components/SvgIcons';

// 샘플 상세 데이터 (실제로는 백엔드 API에서 받아옴)
const noticeDetailData = {
  1: {
    id: 1,
    date: '25.07.18',
    company: '인크루트',
    title: '개인정보 처리 방침 개정 안내',
    icon: '인',
    iconColor: '#FF9800',
    content: `안녕하세요, 인크루트입니다.

항상 인크루트를 이용해 주시는 회원 여러분께 감사드리며, 개인정보 처리 방침이 개정되어 안내드립니다.

1. 개정항목
┌─────────────────┬─────────────────────────────┐
│ 목차            │ 개정내용                    │
├─────────────────┼─────────────────────────────┤
│ 개인정보 수집   │ 개인정보 수집 및 이용 현황  │
│ 및 이용 현황    │ 상세 내용 추가              │
├─────────────────┼─────────────────────────────┤
│ 개인정보 제3자  │ 제3자 제공에 관한 사항      │
│ 제공에 관한 사항│ 상세 내용 추가              │
└─────────────────┴─────────────────────────────┘

2. 시행일
• 사전 공지일: 2025년 8월 20일
• 개정 시행일: 2025년 8월 27일

3. 이의 제기 및 관련 문의
• 개정된 개인정보 처리 방침에 동의하지 않으시는 경우, 회원 탈퇴를 요청하실 수 있습니다.
• 시행일까지 별도의 거부 의사표시를 하지 않으시면 개정된 방침에 동의한 것으로 간주됩니다.
• 기타 문의사항이 있으시면 고객센터(1588-6577)로 연락해 주시기 바랍니다.

앞으로도 더 나은 서비스 제공을 위해 항상 최선을 다하겠습니다.
감사합니다.`
  },
  2: {
    id: 2,
    date: '25.05.01',
    company: '알바몬',
    title: '개인정보 유출 관련 안내 및 사과',
    icon: 'ㅇ',
    iconColor: '#FF9800',
    content: `먼저 알바몬을 믿고 이용해주시는 모든 회원 여러분께 진심으로 사과드립니다.

최근 개인정보 유출 사고가 발생하여 회원 여러분께 불편을 끼쳐드린 점 깊이 사과드립니다.

1. 사고 개요
• 발생일시: 2025년 4월 28일
• 유출 규모: 약 1만명의 회원 정보
• 유출 내용: 이름, 연락처, 이메일 주소

2. 대응 조치
• 즉시 시스템 점검 및 보안 강화
• 개인정보보호위원회 신고
• 피해 회원 대상 개별 안내

3. 추가 보안 조치
• 2단계 인증 의무화
• 정기적 보안 점검 실시
• 개인정보 암호화 강화

회원 여러분의 소중한 개인정보를 보호하기 위해 더욱 노력하겠습니다.`
  },
  3: {
    id: 3,
    date: '25.05.09',
    company: 'SKT 텔레콤',
    title: '유심 관련 개인정보 유출 가능성 통지',
    icon: 'T',
    iconColor: '#2196F3',
    content: `※이 문자는 개인정보보호위원회의 심의/의결(5월 2일)에 따른 개인정보 유출 가능성 통지입니다.

안녕하세요, SKT입니다.

최근 유심 관련 개인정보 유출 가능성이 발견되어 회원 여러분께 안내드립니다.

1. 유출 가능성 개요
• 대상: 일부 유심 사용 고객
• 유출 가능 정보: 통화 기록, 위치 정보
• 발견일: 2025년 5월 2일

2. 예방 조치
• 유심 교체 서비스 제공
• 개인정보 보호 강화
• 정기적 보안 점검

3. 문의사항
• 고객센터: 100번
• 홈페이지: www.skt.co.kr
• 24시간 상담 가능

고객 여러분의 개인정보 보호를 위해 최선을 다하겠습니다.`
  }
};

export default function NoticeDetailScreen({ navigation, route }) {
  const { noticeId } = route.params;
  const notice = noticeDetailData[noticeId];

  if (!notice) {
    return (
      <LinearGradient
        style={styles.bg}
        colors={['#FEFEFE', '#E1E9E4']}
        locations={[0, 0.4]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor="transparent" />
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>공지사항을 찾을 수 없습니다.</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      style={styles.bg}
      colors={['#FEFEFE', '#E1E9E4']}
      locations={[0, 0.4]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>공지사항</Text>
          <TouchableOpacity style={styles.notificationIcon}>
            <BellIcon width={24} height={24} />
          </TouchableOpacity>
        </View>


        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            {/* Notice Header */}
            <View style={styles.noticeHeader}>
              <View style={[styles.iconContainer, { backgroundColor: notice.iconColor }]}> 
                {(notice.company.includes('인크루트')) ? (
                  <Image source={require('../assets/icons/organizations/incruit.png')} style={{ width: 36, height: 36, borderRadius: 8 }} resizeMode="contain" />
                ) : (notice.company.includes('알바몬')) ? (
                  <Image source={require('../assets/icons/organizations/albamon.png')} style={{ width: 36, height: 36, borderRadius: 8 }} resizeMode="contain" />
                ) : (notice.company.includes('SKT')) ? (
                  <Image source={require('../assets/icons/organizations/skt.png')} style={{ width: 36, height: 36, borderRadius: 8 }} resizeMode="contain" />
                ) : (
                  <Text style={styles.iconText}>{notice.icon}</Text>
                )}
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.companyName}>{notice.company}</Text>
                <Text style={styles.noticeTitle}>{notice.title}</Text>
                <Text style={styles.noticeDate}>{notice.date}</Text>
              </View>
            </View>

            {/* Notice Content */}
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{notice.content}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B1215',
  },
  notificationIcon: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00752F',
    marginBottom: 4,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B1215',
    marginBottom: 8,
    lineHeight: 24,
  },
  noticeDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  contentBox: {
    backgroundColor: '#F5F7F6',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  contentText: {
    fontSize: 15,
    color: '#0B1215',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
