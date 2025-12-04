import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

/* 공통 아이콘 */
import { BellIcon } from '../components/SvgIcons';

/* API 서비스 */
import { noticeAPI, handleAPIError } from '../services/api';

// 헬퍼 함수들
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `25.${month}.${day}`;
};

const getCompanyIcon = (category) => {
  const iconMap = {
    'URGENT': '⚠️',
    'UPDATE': '🔄',
    'GENERAL': '📢',
    'SECURITY': '🔒',
    'MAINTENANCE': '🔧'
  };
  return iconMap[category] || '📢';
};

const getCompanyColor = (category) => {
  const colorMap = {
    'URGENT': '#F44336',
    'UPDATE': '#2196F3',
    'GENERAL': '#4CAF50',
    'SECURITY': '#FF9800',
    'MAINTENANCE': '#9C27B0'
  };
  return colorMap[category] || '#6B7280';
};

const notices = [
  {
    id: 1,
    date: '25.11.12',
    company: '카카오톡',
    title: '[개인정보 공지] 카카오톡 친구위치 기능 업데이트 - 무제한 위치공유 확대에 따른 주의사항',
    description: '안녕하세요, 동의 ON입니다. 카카오는 2025년 11월 12일 카카오톡과 카카오맵에서 친구위치 기능을 개편했습니다...',
    icon: '톡',
    iconColor: '#FEE500'
  },
  {
    id: 2,
    date: '25.05.01',
    company: '알바몬',
    title: '개인정보 유출 관련 안내 및 사과',
    description: '먼저 알바몬을 믿고 이용해주시는 모든 회원 여러분께 진심...',
    icon: 'ㅇ',
    iconColor: '#FF9800'
  },
  {
    id: 3,
    date: '25.05.09',
    company: '알바몬',
    title: '유심 관련 개인정보 유출 가능성 통지',
    description: '※이 문자는 개인정보보호위원회의 심의/의결(5월 2일)에 따른...',
    icon: 'T',
    iconColor: '#2196F3'
  }
];

function NoticeItem({ item, onPress, isLast }) {
  const getCompanyImage = (company) => {
    if (company.includes('카카오톡')) {
      return require('../assets/icons/organizations/kakaotalk.png');
    }
    if (company.includes('인크루트')) {
      return require('../assets/icons/organizations/incruit.png');
    }
    if (company.includes('알바몬')) {
      return require('../assets/icons/organizations/albamon.png');
    }
    if (company.includes('SKT')) {
      return require('../assets/icons/organizations/skt.png');
    }
    return null;
  };

  const iconImage = getCompanyImage(item.company);

  return (
    <TouchableOpacity 
      style={[styles.noticeItem, isLast && styles.lastItem]} 
      activeOpacity={0.7} 
      onPress={() => onPress(item)}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: item.iconColor || '#FF9800' }]}>    
          {iconImage ? (
            <Image source={iconImage} style={{ width: 48, height: 48, borderRadius: 6 }} resizeMode="contain" />
          ) : (
            <Text style={styles.iconText}>{item.icon || '인'}</Text>
          )}
        </View>
        <View style={styles.itemContent}>
          <View style={styles.dateCompanyRow}>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={styles.companyName}>{item.company}</Text>
          </View>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.descriptionText} numberOfLines={2}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function NoticeScreen({ navigation }) {
  const [sortBy, setSortBy] = useState('최신순');
  
  // 기본 데이터를 바로 사용
  const defaultNotices = [
    {
      id: 1,
      date: '25.11.12',
      company: '카카오톡',
      title: '[개인정보 공지] 카카오톡 친구위치 기능 업데이트 - 무제한 위치공유 확대에 따른 주의사항',
      description: '안녕하세요, 동의 ON입니다. 카카오는 2025년 11월 12일 카카오톡과 카카오맵에서 친구위치 기능을 개편했습니다...',
      icon: '톡',
      iconColor: '#FEE500'
    },
    {
      id: 2,
      date: '25.05.01',
      company: '알바몬',
      title: '개인정보 유출 관련 안내 및 사과',
      description: '먼저 알바몬을 믿고 이용해주시는 모든 회원 여러분께 진심...',
      icon: 'ㅇ',
      iconColor: '#FF9800'
    },
    {
      id: 3,
      date: '25.05.09',
      company: 'SKT 텔레콤',
      title: '유심 관련 개인정보 유출 가능성 통지',
      description: '※이 문자는 개인정보보호위원회의 심의/의결(5월 2일)에 따른...',
      icon: 'T',
      iconColor: '#2196F3'
    }
  ];
  
  const [notices, setNotices] = useState(defaultNotices);
  const [loading, setLoading] = useState(false);

  const handleNoticePress = (item) => {
    navigation.navigate('NoticeDetail', { noticeId: item.id });
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

        {/* Sort Options */}
        <View style={styles.sortContainer}>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortText}>{sortBy}</Text>
            <Ionicons name="chevron-down" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.listContainer}>
              {notices.map((item, index) => (
                <NoticeItem 
                  key={item.id} 
                  item={item} 
                  onPress={handleNoticePress}
                  isLast={index === notices.length - 1}
                />
              ))}
            </View>
          </ScrollView>
        </View>
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
  sortContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  sortText: {
    fontSize: 14,
    color: '#0B1215',
    marginRight: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    backgroundColor: '#F5F7F6',
    borderRadius: 12,
    paddingVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noticeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  itemContent: {
    flex: 1,
  },
  dateCompanyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00752F',
  },
  companyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00752F',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0B1215',
    marginBottom: 4,
    lineHeight: 22,
  },
  descriptionText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
});
