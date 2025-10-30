import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

/* 공통 아이콘 */
import { BellIcon } from '../components/SvgIcons';

/* API */
import { userAPI } from '../services/api';

export default function MyScreen() {
  const [profile, setProfile] = useState(null);
  const [activity, setActivity] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // 프로필 데이터만 가져오기 (환경설정 API는 500 오류로 제외)
      const profileData = await userAPI.getProfile();
      setProfile(profileData);
      
      // 환경설정은 Mock 데이터 사용
      setSettings({
        notifications: {
          consentExpiry: true,
          pushNotification: true,
          smsEmail: false
        },
        security: {
          passwordChange: true,
          loginHistory: true,
          authMethod: true
        }
      });
      
      // 활동 정보는 프로필에서 가져오거나 별도 처리
      setActivity({
        lastAccess: '25.08.16',
        lastAccessTime: '14:42:44',
        appVersion: '1.2.1',
        isLatestVersion: true
      });
    } catch (error) {
      console.error('사용자 데이터 로드 오류:', error);
      
      // 오류 발생 시 기본값 설정
      setProfile({
        name: '홍길동',
        birthDate: '2000.05.30',
        englishName: 'HONG GIL DONG',
        phone: '010-1234-5678',
        email: 'gildong@mail.com'
      });
      setSettings({
        notifications: {
          consentExpiry: true,
          pushNotification: true,
          smsEmail: false
        },
        security: {
          passwordChange: true,
          loginHistory: true,
          authMethod: true
        }
      });
      setActivity({
        lastAccess: '25.08.16',
        lastAccessTime: '14:42:44',
        appVersion: '1.2.1',
        isLatestVersion: true
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        style={styles.bg}
        colors={['#FEFEFE', '#E1E9E4']}
        locations={[0, 0.4]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor="transparent" />
          <View style={styles.header}>
            <Text style={styles.headerTitle}>마이페이지</Text>
            <TouchableOpacity style={styles.notificationIcon}>
              <BellIcon width={24} height={24} />
            </TouchableOpacity>
          </View>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>로딩 중...</Text>
          </View>
        </View>
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
      <View style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>마이페이지</Text>
          <TouchableOpacity style={styles.notificationIcon}>
            <BellIcon width={24} height={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Activity Section */}
        <View style={styles.activitySection}>
          <View style={styles.activityItem}>
            <Text style={styles.activityLabel}>마지막 접속</Text>
            <Text style={styles.activityValue}>{activity?.lastAccess || '25.08.16'}</Text>
            <Text style={styles.activityTime}>{activity?.lastAccessTime || '14:42:44'}</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityLabel}>앱 버전</Text>
            <Text style={styles.activityValue}>{activity?.appVersion || '1.2.1'}</Text>
            <Text style={styles.latestVersion}>{activity?.isLatestVersion ? '최신버전' : '업데이트 필요'}</Text>
          </View>
        </View>

        {/* Basic Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기본 정보</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>이름</Text>
              <Text style={styles.infoValue}>{profile?.displayName || '홍길동'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>생년월일</Text>
              <Text style={styles.infoValue}>{profile?.birthDate || '2000.05.30'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>영문 이름</Text>
              <Text style={styles.infoValue}>{profile?.englishName || 'HONG GIL DONG'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>휴대폰 번호</Text>
              <Text style={styles.infoValue}>{profile?.phoneNumber || '010-1234-5678'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>이메일</Text>
              <Text style={styles.infoValue}>{profile?.email || 'gildong@mail.com'}</Text>
            </View>
          </View>
        </View>

        {/* Security Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>보안 설정</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>비밀번호 변경</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>최근 로그인 기록 확인</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>인증 수단 관리</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 설정</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>동의 만료 / 갱신 여부</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>푸시 알림</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>문자 / 이메일</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Permissions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>앱 권한</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>앱 권한</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>이용약관</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>개인정보처리방침</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Links */}
        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={styles.footerLink}>로그아웃</Text>
          </TouchableOpacity>
          <Text style={styles.footerDivider}>|</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>회원탈퇴</Text>
          </TouchableOpacity>
    </View>
        </ScrollView>
      </View>
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
    paddingTop: Platform.OS === 'ios' ? 44 : 0, // iOS 상태바 높이
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
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

  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  activitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  activityItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  activityLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  activityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B1215',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  latestVersion: {
    fontSize: 12,
    color: '#00752F',
    fontWeight: '500',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B1215',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#F5F7F6',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 5,
  },
  infoValue: {
    fontSize: 14,
    color: '#0B1215',
    fontWeight: '500',
    flex: 2,
    textAlign: 'left',
  },
  menuCard: {
    backgroundColor: '#F5F7F6',
    borderRadius: 12,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  menuText: {
    fontSize: 14,
    color: '#0B1215',
  },
  arrow: {
    fontSize: 18,
    color: '#999',
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginLeft: 20,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerLink: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
  footerDivider: {
    fontSize: 14,
    color: '#999',
    marginHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});
