import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

/* 공통 아이콘 */
import { BellIcon } from '../components/SvgIcons';

const consentChanges = [
  {
    id: 1,
    date: '25.08.19',
    serviceName: '네이버카페',
    description: '이용약관 변경 내역',
    icon: '☕',
    iconColor: '#4CAF50'
  },
  {
    id: 2,
    date: '25.08.18',
    serviceName: 'APPLE',
    description: 'Apple 미디어 서비스 이용 약관 변경',
    icon: '🍎',
    iconColor: '#000000'
  },
  {
    id: 3,
    date: '25.08.17',
    serviceName: '알바몬',
    description: '유심 관련 개인정보 유출 가능성 통지',
    icon: '📄',
    iconColor: '#2196F3'
  }
];

function ConsentChangeItem({ item }) {
  return (
    <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: item.iconColor }]}>
          <Text style={styles.iconText}>{item.icon}</Text>
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.dateText}>{item.date}</Text>
          <Text style={styles.serviceName}>{item.serviceName}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
      <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

export default function RecentChangeScreen({ navigation }) {
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
          <Text style={styles.headerTitle}>최근 동의 변경 내역</Text>
          <TouchableOpacity style={styles.notificationIcon}>
            <BellIcon width={24} height={24} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.listContainer}>
              {consentChanges.map((item) => (
                <ConsentChangeItem key={item.id} item={item} />
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
    paddingVertical: 16,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    backgroundColor: '#F5F7F6',
    borderRadius: 16,
    paddingVertical: 8,
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 20,
  },
  itemContent: {
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00752F',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#0B1215',
    lineHeight: 20,
  },
});
