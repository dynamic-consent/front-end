import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const notifications = [
  {
    id: '1',
    title: '카카오톡 위치정보 수집 및 이용 동의 해제',
    description: '카카오톡 위치정보 수집 및 이용 동의 해제 요청이 처리되었습니다.',
    date: '2025.11.25',
    company: '카카오톡',
  },
];

const getCompanyImage = (company) => {
  if (company?.includes('카카오톡')) {
    return require('../assets/icons/organizations/kakaotalk.png');
  }
  return null;
};

export default function NotificationScreen({ navigation }) {
  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate?.('Home');
    }
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

        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>알림</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.content}>
          {notifications.length > 0 ? (
            <ScrollView
              contentContainerStyle={styles.notificationList}
              showsVerticalScrollIndicator={false}
            >
              {notifications.map((item) => {
                const companyImage = getCompanyImage(item.company);
                return (
                  <View key={item.id} style={styles.notificationCard}>
                    <View style={styles.cardHeader}>
                      <View style={styles.leftSection}>
                        {companyImage ? (
                          <View style={styles.iconContainer}>
                            <Image source={companyImage} style={styles.companyIcon} />
                          </View>
                        ) : (
                          <View style={[styles.iconContainer, styles.iconCircle]}>
                            <Ionicons name="shield-checkmark" size={20} color="#00752F" />
                          </View>
                        )}
                        <View style={styles.headerText}>
                          <Text style={styles.companyName}>{item.company || '알림'}</Text>
                          <Text style={styles.notificationDate}>{item.date}</Text>
                        </View>
                      </View>
                      <View style={styles.statusBadge}>
                        <Ionicons name="checkmark-circle" size={16} color="#00752F" />
                      </View>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.cardBody}>
                      <Text style={styles.notificationTitle}>{item.title}</Text>
                      <Text style={styles.notificationDescription}>{item.description}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Ionicons name="notifications-outline" size={48} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyTitle}>새로운 알림이 없습니다.</Text>
              <Text style={styles.emptySubtitle}>동의 요청 또는 위험 알림이 도착하면 여기에 표시됩니다.</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B1215',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationList: {
    paddingBottom: 24,
    gap: 12,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#F5F7F6',
  },
  iconCircle: {
    backgroundColor: '#E6F4EA',
  },
  companyIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  headerText: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B1215',
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusBadge: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  cardBody: {
    padding: 16,
    paddingTop: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B1215',
    marginBottom: 8,
    lineHeight: 24,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F7F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1215',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});

