// API 기본 설정
// 팀원이 제공한 실제 API 주소로 변경하세요
const BASE_URL = 'http://172.19.16.243:8080/api/v1'; // 실제 백엔드 서버 주소
// const BASE_URL = 'http://localhost:8080/api'; // 로컬 개발 환경

// 기본 헤더 설정
const getDefaultHeaders = () => ({
  'Content-Type': 'application/json',
  'X-UserId': '1', // 임시 사용자 ID - 실제로는 로그인한 사용자 ID 사용
  // 'Authorization': 'Bearer your-token-here', // JWT 토큰이 필요한 경우
});

// 공지사항 API
export const noticeAPI = {
  // 공지사항 목록 조회
  getNotices: async () => {
    try {
      const response = await fetch(`${BASE_URL}/notices`, {
        method: 'GET',
        headers: getDefaultHeaders(),
      });
      if (!response.ok) {
        throw new Error('공지사항을 불러오는데 실패했습니다.');
      }
      const result = await response.json();
      
      // 팀원 API 응답 형식에 맞게 데이터 변환
      // 예시: result.data를 사용하거나 result 자체를 사용
      const notices = result.data || result;
      
      // React Native에서 사용할 형식으로 변환
      return notices.map(notice => ({
        id: notice.id,
        date: formatDate(notice.createdAt), // 날짜 형식 변환
        company: notice.companyName,
        title: notice.title,
        description: notice.content?.substring(0, 50) + '...', // 미리보기
        icon: getCompanyIcon(notice.companyName), // 회사별 아이콘
        iconColor: getCompanyColor(notice.companyName) // 회사별 색상
      }));
    } catch (error) {
      console.error('공지사항 조회 오류:', error);
      throw error;
    }
  },

  // 공지사항 상세 조회
  getNoticeDetail: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/notices/${id}`, {
        method: 'GET',
        headers: getDefaultHeaders(),
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
  // 기관별 동의 변경 내역 조회
  getChangeHistory: async (orgName) => {
    try {
      const response = await fetch(`${BASE_URL}/orgs/${orgName}/change-history`, {
        method: 'GET',
        headers: getDefaultHeaders(),
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
      const response = await fetch(`${BASE_URL}/orgs/${orgName}/consents`, {
        method: 'GET',
        headers: getDefaultHeaders(),
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
