import React, { useState, useEffect } from 'react';
import TabNavigator from './navigation/TabNavigator';
import LoginScreen from './screens/LoginScreen';
import { homeAPI, orgAPI, noticeAPI, userAPI } from './services/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const testAllAPIs = async () => {
      console.log('백엔드 API 기능 테스트 시작...');
      
      // 1. 홈 요약 정보
      try {
        const homeSummary = await homeAPI.getSummary();
        console.log('홈 요약 정보:', homeSummary);
      } catch (error) {
        console.error('홈 요약 실패:', error.message);
      }

      // 2. 홈 타임라인
      try {
        const timeline = await homeAPI.getTimeline();
        console.log('홈 타임라인:', timeline);
      } catch (error) {
        console.error('타임라인 실패:', error.message);
      }

      // 3. 기관 목록
      try {
        const orgs = await orgAPI.getOrgs();
        console.log('기관 목록:', orgs);
      } catch (error) {
        console.error('기관 목록 실패:', error.message);
      }

      // 4. 공지사항 미리보기 (직접 호출로 테스트)
      try {
        const response = await fetch('http://192.168.0.9:8080/api/v1/notices?page=0&size=3&sort=createdAt,desc', {
          headers: { 'Content-Type': 'application/json', 'X-UserId': 'user1' }
        });
        if (response.ok) {
          const notices = await response.json();
          console.log('공지사항 미리보기:', notices);
        } else {
          console.log('공지사항 실패:', response.status);
        }
      } catch (error) {
        console.error('공지사항 오류:', error.message);
      }

      // 5. 사용자 프로필
      try {
        const profile = await userAPI.getProfile();
        console.log('사용자 프로필:', profile);
      } catch (error) {
        console.error('사용자 프로필 실패:', error.message);
      }

      // 6. 사용자 환경설정 (500 오류로 임시 비활성화)
      // try {
      //   const preferences = await userAPI.getPreferences();
      //   console.log('⚙️ 사용자 환경설정:', preferences);
      // } catch (error) {
      //   console.error('❌ 사용자 환경설정 실패:', error.message);
      // }

      // 7. 동의서 목록 테스트 (직접 호출)
      try {
        const response = await fetch('http://192.168.0.9:8080/api/v1/consents?page=0&size=10', {
          headers: { 'Content-Type': 'application/json', 'X-UserId': 'user1' }
        });
        if (response.ok) {
          const consents = await response.json();
          console.log('동의서 목록:', consents);
        } else {
          console.log('동의서 목록 실패:', response.status);
        }
      } catch (error) {
        console.error('동의서 목록 오류:', error.message);
      }

      // 8. 동의서 이벤트 목록 테스트
      try {
        const response = await fetch('http://192.168.0.9:8080/api/v1/consents/events?page=0&size=10', {
          headers: { 'Content-Type': 'application/json', 'X-UserId': 'user1' }
        });
        if (response.ok) {
          const events = await response.json();
          console.log('동의서 이벤트:', events);
        } else {
          console.log('동의서 이벤트 실패:', response.status);
        }
      } catch (error) {
        console.error('동의서 이벤트 오류:', error.message);
      }

      // 9. 기관 상세 정보 테스트
      try {
        const response = await fetch('http://192.168.0.9:8080/api/v1/orgs/BANK001', {
          headers: { 'Content-Type': 'application/json', 'X-UserId': 'user1' }
        });
        if (response.ok) {
          const orgDetail = await response.json();
          console.log('기관 상세 정보:', orgDetail);
        } else {
          console.log('기관 상세 실패:', response.status);
        }
      } catch (error) {
        console.error('기관 상세 오류:', error.message);
      }

      // 10. 기관별 동의서 테스트
      try {
        const response = await fetch('http://192.168.0.9:8080/api/v1/orgs/BANK001/consents', {
          headers: { 'Content-Type': 'application/json', 'X-UserId': 'user1' }
        });
        if (response.ok) {
          const orgConsents = await response.json();
          console.log('기관별 동의서:', orgConsents);
        } else {
          console.log('기관별 동의서 실패:', response.status);
        }
      } catch (error) {
        console.error('기관별 동의서 오류:', error.message);
      }

      console.log('✅ 모든 API 테스트 완료!');
    };
    
    testAllAPIs();
  }, []);

  // 로그인 화면을 위한 navigation prop 생성
  const navigation = {
    replace: (screen) => {
      if (screen === 'MainTabs') {
        setIsLoggedIn(true);
      }
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen navigation={navigation} />;
  }

  return <TabNavigator />;
}
