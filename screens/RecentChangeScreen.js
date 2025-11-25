import React, { useEffect, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

/* 공통 아이콘 */
import { BellIcon } from '../components/SvgIcons';
import { getOrgIconInfo } from '../utils/orgIconLoader';

const GLOBAL_CHANGE_HISTORY_KEY = 'globalConsentChangeHistory';
const getUserScopedHistoryKey = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    return `${GLOBAL_CHANGE_HISTORY_KEY}:${userId || 'guest'}`;
  } catch (error) {
    console.log('사용자 ID 조회 실패:', error);
    return `${GLOBAL_CHANGE_HISTORY_KEY}:guest`;
  }
};

const iconPalette = ['#4CAF50', '#00752F', '#1E88E5', '#F97316', '#8B5CF6'];

const getFallbackIcon = (orgName) => {
  const letter = orgName?.[0]?.toUpperCase() || '동';
  const color = iconPalette[Math.abs(letter.charCodeAt(0)) % iconPalette.length];
  return { letter, color };
};

function ConsentChangeItem({ item }) {
  const iconInfo = getOrgIconInfo(item?.orgName);
  const fallbackIcon = getFallbackIcon(item?.orgName);

  const renderIcon = () => {
    if (iconInfo?.logoType === 'image') {
      return (
        <Image 
          source={iconInfo.imageSource} 
          style={styles.iconImage} 
          resizeMode="contain" 
        />
      );
    }

    if (iconInfo?.logoType === 'svg') {
      const IconComponent = iconInfo.logoComponent;
      return (
        <View style={styles.iconSvgWrapper}>
          <IconComponent width={24} height={24} />
        </View>
      );
    }

    return (
      <View 
        style={[
          styles.iconCircle, 
          { backgroundColor: fallbackIcon.color }
        ]}
      >
        <Text style={styles.iconText}>{fallbackIcon.letter}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
      <View style={styles.itemLeft}>
        <View style={styles.iconContainer}>
          {renderIcon()}
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.dateText}>{item.displayDate || '-'}</Text>
          <Text style={styles.serviceName}>{item.orgName || '알 수 없음'}</Text>
          <Text style={styles.description}>{item.description || ''}</Text>
        </View>
      </View>
      <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

export default function RecentChangeScreen({ navigation }) {
  const [consentChanges, setConsentChanges] = useState([]);
  const isFocused = useIsFocused();

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate?.('Home');
    }
  };

  const loadConsentChanges = async () => {
    try {
      const historyKey = await getUserScopedHistoryKey();
      const stored = await AsyncStorage.getItem(historyKey);
      const parsed = stored ? JSON.parse(stored) : [];
      setConsentChanges(parsed);
    } catch (error) {
      console.log('최근 동의 변경 내역 로드 실패:', error);
      setConsentChanges([]);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadConsentChanges();
    }
  }, [isFocused]);

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
            onPress={handleBack}
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
          {consentChanges.length > 0 ? (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.listContainer}>
              {consentChanges.map((item) => (
                <ConsentChangeItem key={item.id} item={item} />
              ))}
            </View>
          </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>아직 변경된 동의 내역이 없습니다.</Text>
              <Text style={styles.emptySubtitle}>기관 상세 화면에서 동의를 변경하면 이곳에 기록됩니다.</Text>
            </View>
          )}
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
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSvgWrapper: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 32,
    height: 32,
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
  emptyContainer: {
    backgroundColor: '#F5F7F6',
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B1215',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
