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
    date: '25.11.12',
    company: '카카오톡',
    title: '[개인정보 공지] 카카오톡 친구위치 기능 업데이트 - 무제한 위치공유 확대에 따른 주의사항',
    icon: '톡',
    iconColor: '#FEE500',
    content: `안녕하세요, 동의 ON입니다.

카카오는 2025년 11월 12일 카카오톡과 카카오맵에서 친구위치 기능을 개편했습니다. 이용자분들의 개인정보 보호와 안전한 서비스 이용을 위해 주요 변경사항과 함께 위치공유 기능 사용법 및 설정 방법을 안내드립니다.

## 주요 변경사항

- 기존: 친구와의 위치공유 시간이 최대 6시간으로 제한
- 변경: 시간 제한 없이 무제한 실시간 위치공유 가능 (상호 동의 시)
- 친구위치 기능은 카카오톡과 카카오맵에서 연동되어 실시간 위치 확인이 가능하며, 최대 10개 그룹까지 참여할 수 있습니다.

## 위치공유 기능 사용법

- 카카오톡 채팅방의 '+' 버튼 메뉴 또는 카카오맵 앱에서 '친구위치' 기능을 실행할 수 있습니다.
- 처음 이용 시 위치정보 제공에 대한 동의 절차를 거치며, 카카오맵 로그인과 위치 권한(항상 허용, 정확한 위치) 설정이 필요합니다.
- 위치공유 그룹 이름을 정하고 초대 메시지를 보내 친구가 수락하면 위치공유가 시작됩니다.
- 위치공유는 모르는 사람에게 초대 메시지를 보낼 수 없으며, 오픈채팅방 및 100명 이상 단체방에서는 사용할 수 없습니다.
- 만 14세 미만 이용자는 부모 동의가 필요합니다.

## 위치공유 기능 끄기 및 숨기기 방법

- 잠깐 숨기기: 카카오맵 앱에서 '내 위치 숨기기' 기능을 활성화하면 설정된 시간 동안 위치가 지도에 표시되지 않습니다. 필요 시 바로 숨기거나 최대 1시간까지 설정 가능합니다.
- 그룹 나가기(종료하기): 더 이상 위치공유를 원치 않을 경우, 카카오맵 '더보기' 메뉴에서 '그룹 나가기'를 선택하면 해당 위치공유 그룹에서 즉시 제외됩니다. '모든 친구위치 그룹 나가기'로 모든 위치공유 그룹에서 나갈 수도 있습니다.
- 카카오톡 전체 위치정보 동의 철회 시 카카오맵 로그인이 제한되며, 기존 그룹은 유지되니 잠시 사용 안 할 땐 숨기기를 활용하는 것이 효과적입니다.

## 개인정보 보호 주의사항

- 본 기능은 상호 동의 기반으로 운영되며 사용자의 명시적 동의 없이는 위치정보가 공유되지 않습니다.
- 원치 않는 위치공유 요청은 거절하거나 무시할 수 있습니다.
- 위치공유에 동의하면 실시간으로 현재 위치가 상대방에게 노출됩니다.
- 업무, 가족, 연인 관계에서 과도한 위치공유 강요를 받지 않도록 주의 바랍니다.
- 미성년자(만 14세 미만)는 부모 동의가 반드시 필요합니다.`
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
                {(notice.company.includes('카카오톡')) ? (
                  <Image source={require('../assets/icons/organizations/kakaotalk.png')} style={{ width: 36, height: 36, borderRadius: 8 }} resizeMode="contain" />
                ) : (notice.company.includes('인크루트')) ? (
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
              {notice.id === 1 && notice.company === '카카오톡' && (
                <TouchableOpacity
                  style={styles.withdrawalButton}
                  onPress={() => {
                    navigation.navigate('기관', {
                      screen: 'OrgDetail',
                      params: { 
                        orgName: '카카오톡',
                        initialTab: 'consent'
                      }
                    });
                  }}
                >
                  <Text style={styles.withdrawalButtonText}>→ 동의 철회 바로가기</Text>
                </TouchableOpacity>
              )}
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
  withdrawalButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#00752F',
    borderRadius: 8,
    alignItems: 'center',
  },
  withdrawalButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
