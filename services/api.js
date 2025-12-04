// API 기본 설정
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// React Native에서 localhost 접근 방법:
// - 같은 컴퓨터에서 실행: localhost 또는 10.0.2.2 (Android 에뮬레이터)
// - 네트워크 내 다른 기기: 192.168.0.9 (실제 기기에서 테스트 시)
// 
// 현재 설정: 같은 노트북에서 프론트엔드와 백엔드 실행 중
// 포트: 8080

// 실제 기기에서 테스트하려면 아래 USE_REAL_DEVICE를 true로 변경하고
// DEVICE_IP를 컴퓨터의 실제 IP 주소로 설정하세요
const USE_REAL_DEVICE = true; // 실제 기기 사용 시 true로 변경
const DEVICE_IP = '192.168.0.10'; // 실제 기기 테스트 시 사용할 IP 주소

const getBaseURL = () => {
  // 실제 기기에서 테스트하는 경우
  if (USE_REAL_DEVICE) {
    return `http://${DEVICE_IP}:8080/api/v1`;
  }
  
  // 같은 컴퓨터에서 실행 (에뮬레이터/시뮬레이터)
  if (Platform.OS === 'android') {
    // Android 에뮬레이터는 10.0.2.2를 사용해야 호스트 머신의 localhost에 접근 가능
    return 'http://10.0.2.2:8080/api/v1';
  } else {
    // iOS 시뮬레이터는 localhost 사용 가능
    return 'http://localhost:8080/api/v1';
  }
};

const BASE_URL = getBaseURL();

// 디버깅: BASE_URL 확인
console.log('🔧 API BASE_URL 설정:', BASE_URL);
console.log('🔧 USE_REAL_DEVICE:', USE_REAL_DEVICE);
console.log('🔧 DEVICE_IP:', DEVICE_IP);

// BASE_URL을 export하여 다른 파일에서도 사용 가능하도록 함
export { BASE_URL };

// 사용자 ID 가져오기 (AsyncStorage에서)
const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    return userId || '1'; // 기본값은 '1' (임시)
  } catch (error) {
    console.error('사용자 ID 가져오기 오류:', error);
    return '1';
  }
};

// 기본 헤더 설정 (비동기)
const getDefaultHeaders = async () => {
  const userId = await getUserId();
  return {
    'Content-Type': 'application/json',
    'X-UserId': userId,
    // 'Authorization': 'Bearer your-token-here', // JWT 토큰이 필요한 경우
  };
};

// 타임아웃 설정 (60초)
const FETCH_TIMEOUT = 60000;

// 서버 연결 테스트 함수 (선택적 사용)
const testServerConnection = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const testUrl = `${BASE_URL}/home/summary`;
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return { success: true, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 타임아웃이 있는 fetch 래퍼 (AbortController 사용)
const fetchWithTimeout = (url, options = {}, timeout = FETCH_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  return fetch(url, {
    ...options,
    signal: controller.signal
  }).then(response => {
    clearTimeout(timeoutId);
    return response;
  }).catch(error => {
    clearTimeout(timeoutId);
    
    // 더 자세한 에러 정보 제공
    let errorMessage = '서버 연결에 실패했습니다.';
    let diagnosticInfo = [];
    
    if (error.name === 'AbortError') {
      errorMessage = '서버 연결 시간이 초과되었습니다.';
      const deviceCheck = USE_REAL_DEVICE 
        ? '4. 실제 기기와 서버가 같은 Wi-Fi 네트워크에 연결되어 있는지 확인하세요'
        : '4. 에뮬레이터/시뮬레이터가 올바르게 설정되어 있는지 확인하세요';
      diagnosticInfo = [
        `서버 주소: ${BASE_URL}`,
        '확인사항:',
        '1. 백엔드 서버가 실행 중인지 확인하세요',
        '2. 서버 주소가 올바른지 확인하세요',
        '3. 방화벽에서 8080 포트가 허용되어 있는지 확인하세요',
        deviceCheck
      ];
    } else if (error.message && (error.message.includes('Network request failed') || error.message.includes('Failed to fetch'))) {
      errorMessage = '네트워크 연결에 실패했습니다.';
      const deviceCheck = USE_REAL_DEVICE 
        ? '4. 실제 기기와 서버가 같은 Wi-Fi 네트워크에 연결되어 있는지 확인하세요'
        : '4. 에뮬레이터/시뮬레이터가 올바르게 설정되어 있는지 확인하세요';
      diagnosticInfo = [
        `서버 주소: ${BASE_URL}`,
        '확인사항:',
        '1. 백엔드 서버가 실행 중인지 확인하세요',
        '2. 서버 주소가 올바른지 확인하세요',
        '3. 네트워크 연결을 확인하세요',
        deviceCheck,
        '5. Android의 경우 network_security_config.xml에 서버 IP가 추가되어 있는지 확인하세요'
      ];
    }
    
    // 개발 모드에서만 상세 정보 출력
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.error('❌ 네트워크 오류 상세:', {
        url,
        error: error.message,
        name: error.name,
        diagnosticInfo
      });
    }
    
    const fullErrorMessage = diagnosticInfo.length > 0 
      ? errorMessage + '\n\n' + diagnosticInfo.join('\n')
      : errorMessage;
    throw new Error(fullErrorMessage);
  });
};

// 인증 API
export const authAPI = {
  // 회원가입
  signup: async (userData) => {
    try {
      // 회원가입은 X-UserId 헤더가 필요 없음 (아직 로그인하지 않았으므로)
      const response = await fetchWithTimeout(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '회원가입에 실패했습니다.');
      }
      const result = await response.json();
      console.log('회원가입 응답:', result);
      
      // 회원가입 성공 시 사용자 ID 저장 (백엔드 응답에서 userId 가져오기)
      if (result.userId) {
        await AsyncStorage.setItem('userId', result.userId);
        console.log('✅ 사용자 ID 저장됨:', result.userId);
      } else {
        // userId가 없으면 회원가입 시 입력한 id 사용
        if (userData.id) {
          await AsyncStorage.setItem('userId', userData.id);
          console.log('✅ 사용자 ID 저장됨 (입력한 ID):', userData.id);
        }
      }
      
      return result;
    } catch (error) {
      console.error('회원가입 오류:', error);
      throw error;
    }
  },

  // 로그인 (아이디/비밀번호)
  login: async (id, password) => {
    try {
      console.log('🔐 로그인 시도:', { id, baseURL: BASE_URL });
      
      // 로그인은 X-UserId 헤더가 필요 없음 (아직 로그인하지 않았으므로)
      const response = await fetchWithTimeout(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, password })
      });
      
      console.log('📡 로그인 응답 상태:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('❌ 로그인 에러 응답:', errorData);
        throw new Error(errorData.message || '로그인에 실패했습니다.');
      }
      const result = await response.json();
      console.log('✅ 로그인 성공:', result);
      
      // 로그인 성공 시 사용자 ID 저장
      if (result.userId) {
        await AsyncStorage.setItem('userId', result.userId);
        console.log('✅ 사용자 ID 저장됨:', result.userId);
      }
      
      return result;
    } catch (error) {
      console.error('❌ 로그인 오류:', error);
      throw error;
    }
  }
};

// 공지사항 API
export const noticeAPI = {
  // 공지사항 목록 조회
  getNotices: async () => {
    try {
      const headers = await getDefaultHeaders();
      const response = await fetchWithTimeout(`${BASE_URL}/notices?page=0&size=20&sort=createdAt,desc`, {
        method: 'GET',
        headers,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '공지사항을 불러오는데 실패했습니다.');
      }
      const result = await response.json();
      
      // 백엔드는 Page 객체를 반환: { content: [...], totalElements, ... }
      // content 배열을 가져옴
      const notices = result.content || result.data || (Array.isArray(result) ? result : []);
      
      // 배열이 아닌 경우 빈 배열 반환
      if (!Array.isArray(notices)) {
        console.warn('공지사항 응답이 배열이 아닙니다:', result);
        return [];
      }
      
      // React Native에서 사용할 형식으로 변환
      return notices.map(notice => {
        // 회사명 매핑 (category를 회사명으로 변환)
        const companyName = notice.category || '기타';
        const iconColor = getCompanyColor(notice.category || '기타');
        
        return {
          id: notice.id,
          date: formatDate(notice.createdAt), // 날짜 형식 변환
          company: companyName,
          title: notice.title,
          description: notice.content?.substring(0, 50) + '...', // 미리보기
          icon: companyName.charAt(0) || '인',
          iconColor: iconColor
        };
      });
    } catch (error) {
      // 네트워크 오류는 조용히 처리하고 기본값 반환
      if (__DEV__) {
        console.log('공지사항 조회 실패 (기본값 사용):', error.message);
      }
      // 기본값 반환하여 앱이 크래시되지 않도록 함
      return [];
    }
  },

  // 공지사항 상세 조회
  getNoticeDetail: async (id) => {
    try {
      const headers = await getDefaultHeaders();
      const response = await fetchWithTimeout(`${BASE_URL}/notices/${id}`, {
        method: 'GET',
        headers,
      });
      if (!response.ok) {
        throw new Error('공지사항 상세를 불러오는데 실패했습니다.');
      }
      return await response.json();
    } catch (error) {
      console.error('공지사항 상세 조회 오류:', error);
      throw error;
    }
  }
};

// 기관 API
export const orgAPI = {
  // 기관 목록 조회
  getOrgs: async () => {
    try {
      const headers = await getDefaultHeaders();
      const response = await fetchWithTimeout(`${BASE_URL}/orgs`, {
        method: 'GET',
        headers,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '기관 목록을 불러오는데 실패했습니다.');
      }
      return await response.json();
    } catch (error) {
      // 네트워크 오류는 조용히 처리하고 기본값 반환
      if (__DEV__) {
        console.log('기관 목록 조회 실패 (기본값 사용):', error.message);
      }
      // 기본값 반환하여 앱이 크래시되지 않도록 함
      return [];
    }
  },

  // 기관 상세 정보 조회
  getOrgDetail: async (orgId) => {
    try {
      const headers = await getDefaultHeaders();
      const response = await fetchWithTimeout(`${BASE_URL}/orgs/${orgId}`, {
        method: 'GET',
        headers,
      });
      if (!response.ok) {
        throw new Error('기관 상세 정보를 불러오는데 실패했습니다.');
      }
      return await response.json();
    } catch (error) {
      console.error('기관 상세 정보 조회 오류:', error);
      throw error;
    }
  },

  // 기관별 동의 변경 내역 조회
  getChangeHistory: async (orgName) => {
    try {
      const headers = await getDefaultHeaders();
      const response = await fetchWithTimeout(`${BASE_URL}/orgs/${orgName}/change-history`, {
        method: 'GET',
        headers,
      });
      if (!response.ok) {
        throw new Error('동의 변경 내역을 불러오는데 실패했습니다.');
      }
      return await response.json();
    } catch (error) {
      console.error('동의 변경 내역 조회 오류:', error);
      throw error;
    }
  },

  // 기관별 동의 세부사항 조회
  getConsentDetails: async (orgName) => {
    try {
      const headers = await getDefaultHeaders();
      const response = await fetchWithTimeout(`${BASE_URL}/orgs/${orgName}/consents`, {
        method: 'GET',
        headers,
      });
      if (!response.ok) {
        throw new Error('동의 세부사항을 불러오는데 실패했습니다.');
      }
      return await response.json();
    } catch (error) {
      console.error('동의 세부사항 조회 오류:', error);
      throw error;
    }
  }
};

// 홈 API
export const homeAPI = {
  // 홈 요약 정보 조회
  getSummary: async () => {
    try {
      const headers = await getDefaultHeaders();
      const response = await fetchWithTimeout(`${BASE_URL}/home/summary`, {
        method: 'GET',
        headers,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '홈 요약 정보를 불러오는데 실패했습니다.');
      }
      return await response.json();
    } catch (error) {
      // 네트워크 오류는 조용히 처리하고 기본값 반환
      // 개발 중에만 로그 출력
      if (__DEV__) {
        console.log('홈 요약 정보 조회 실패 (기본값 사용):', error.message);
      }
      // 기본값 반환하여 앱이 크래시되지 않도록 함
      return { totalConsents: 0, activeConsents: 0, recentActivity: [] };
    }
  },

  // 홈 타임라인 조회
  getTimeline: async () => {
    try {
      const headers = await getDefaultHeaders();
      const response = await fetchWithTimeout(`${BASE_URL}/home/timeline`, {
        method: 'GET',
        headers,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '홈 타임라인을 불러오는데 실패했습니다.');
      }
      return await response.json();
    } catch (error) {
      // 네트워크 오류는 조용히 처리하고 기본값 반환
      if (__DEV__) {
        console.log('홈 타임라인 조회 실패 (기본값 사용):', error.message);
      }
      // 기본값 반환하여 앱이 크래시되지 않도록 함
      return [];
    }
  }
};

// 사용자 API
export const userAPI = {
  // 사용자 프로필 조회
  getProfile: async () => {
    try {
      const headers = await getDefaultHeaders();
      const response = await fetchWithTimeout(`${BASE_URL}/me`, {
        method: 'GET',
        headers,
      });
      if (!response.ok) {
        throw new Error('사용자 프로필을 불러오는데 실패했습니다.');
      }
      return await response.json();
    } catch (error) {
      console.error('사용자 프로필 조회 오류:', error);
      throw error;
    }
  },

  // 사용자 환경설정 조회
  getPreferences: async () => {
    try {
      const headers = await getDefaultHeaders();
      const response = await fetchWithTimeout(`${BASE_URL}/me/preferences`, {
        method: 'GET',
        headers,
      });
      if (!response.ok) {
        throw new Error('사용자 환경설정을 불러오는데 실패했습니다.');
      }
      return await response.json();
    } catch (error) {
      console.error('사용자 환경설정 조회 오류:', error);
      throw error;
    }
  }
};

// 동의서 API
export const consentAPI = {
  // 동의서 목록 조회
  getConsents: async (page = 0, size = 10) => {
    try {
      const headers = await getDefaultHeaders();
      const response = await fetchWithTimeout(`${BASE_URL}/consents?page=${page}&size=${size}`, {
        method: 'GET',
        headers,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '동의서 목록을 불러오는데 실패했습니다.');
      }
      return await response.json();
    } catch (error) {
      // 네트워크 오류는 조용히 처리하고 기본값 반환
      if (__DEV__) {
        console.log('동의서 목록 조회 실패 (기본값 사용):', error.message);
      }
      // 기본값 반환하여 앱이 크래시되지 않도록 함
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  },

  // 동의서 이벤트 목록 조회
  getConsentEvents: async (page = 0, size = 10) => {
    try {
      const headers = await getDefaultHeaders();
      const response = await fetchWithTimeout(`${BASE_URL}/consents/events?page=${page}&size=${size}`, {
        method: 'GET',
        headers,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '동의서 이벤트 목록을 불러오는데 실패했습니다.');
      }
      return await response.json();
    } catch (error) {
      // 네트워크 오류는 조용히 처리하고 기본값 반환
      if (__DEV__) {
        console.log('동의서 이벤트 목록 조회 실패 (기본값 사용):', error.message);
      }
      // 기본값 반환하여 앱이 크래시되지 않도록 함
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  }
};

// 헬퍼 함수들
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `25.${month}.${day}`;
};

const getCompanyIcon = (companyName) => {
  const iconMap = {
    '인크루트': '인',
    '알바몬': 'ㅇ',
    'SKT': 'T',
    '토스': '토',
    '우리은행': '우',
    '신한은행': '신',
    '하나은행': '하'
  };
  return iconMap[companyName] || companyName.charAt(0);
};

const getCompanyColor = (companyName) => {
  const colorMap = {
    '인크루트': '#FF9800',
    '알바몬': '#FF9800',
    'SKT': '#2196F3',
    '토스': '#00752F',
    '우리은행': '#1E88E5',
    '신한은행': '#E91E63',
    '하나은행': '#4CAF50'
  };
  return colorMap[companyName] || '#6B7280';
};

// 공통 에러 처리
export const handleAPIError = (error) => {
  console.error('API 오류:', error);
  // 여기에 토스트 메시지나 알림 표시 로직 추가
  return {
    success: false,
    message: error.message || '알 수 없는 오류가 발생했습니다.'
  };
};
