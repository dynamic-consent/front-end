import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar, 
  Switch, 
  Image, 
  Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
/* 기관 아이콘 로더 */
import { getOrgIconInfo } from '../utils/orgIconLoader';
import { BellIcon } from '../components/SvgIcons';

const tabs = [
  { id: 'consent', label: '동의 세부 사항' },
  { id: 'risk', label: '위험도' },
  { id: 'thirdParty', label: '제3자 제공' },
  { id: 'changeHistory', label: '동의 변경 내역' },
  
  { id: 'info', label: '정보' },
];

const HIGH_RISK_PRIMARY = '#FF7A00';
const HIGH_RISK_BORDER = '#FF8A1A';
const HIGH_RISK_BG = '#FFF4D7';

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

// 기관별 샘플 데이터 - 각 앱마다 다른 동의 세부사항
const orgData = {
  '토스': {
    logoText: '토스',
    logoStyle: { borderRadius: 8 },
    companyInfo: {
      serviceName: '토스 Toss',
      legalName: '(주)비바리퍼블리카',
      privacyCertification: 'ISMP-P, ISO 27001, ISO 27701, PCI DSS, SOC 2',
      privacyPolicyLink: 'https://toss.im/privacy-policy?id=41603',
    },
    optionalConsents: [
      { id: 1, title: '마케팅 정보 수신 동의', enabled: false },
      { id: 2, title: '제휴사/그룹사 서비스 안내', enabled: false },
      { id: 3, title: '신용정보 조회 및 활용 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집·이용 동의' },
      { id: 3, title: '고유식별정보 처리 동의' }
    ],
    changeHistory: []
  },
  '우리은행': {
    logoText: '우리',
    logoStyle: { backgroundColor: '#1E88E5', borderRadius: 20 },
    optionalConsents: [
      { id: 1, title: '마케팅 정보 수신 동의', enabled: false },
      { id: 2, title: '투자상품 안내 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '은행서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '금융거래약관' },
      { id: 4, title: '전자금융거래약관' }
    ]
  },
  '신한은행': {
    logoText: '신한',
    logoStyle: { backgroundColor: '#1E88E5', borderRadius: 4 },
    companyInfo: {
      serviceName: '신한은행 Shinhan Bank',
      legalName: '주식회사 신한은행',
      privacyCertification: 'ISO 27001, ISO 27701, PCI DSS',
      privacyPolicyLink: 'https://www.shinhan.com/hpe/index.jsp#050404040000',
    },
    optionalConsents: [
      { id: 1, title: '개인(신용)정보 수집·이용 동의(상품서비스 안내 등)', enabled: false },
      { id: 2, title: '개인(신용)정보 제3자 제공 동의', enabled: false },
      { id: 3, title: '바이오정보(지문/Face ID) 등록 및 이용 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '개인(신용)정보 수집·이용 동의' },
      { id: 2, title: '고유식별정보 처리 동의' },
      { id: 3, title: '통신사/나이스평가정보 등을 통한 본인 인증 동의' }
    ]
  },
  '하나은행': {
    logoText: '하나',
    logoStyle: { backgroundColor: '#4CAF50', borderRadius: 4 },
    optionalConsents: [
      { id: 1, title: '마케팅 정보 수신 동의', enabled: false },
      { id: 2, title: '보험상품 안내 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '은행서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '금융거래약관' }
    ]
  },
  '쿠팡': {
    logoText: '쿠팡',
    logoStyle: { backgroundColor: '#FF6B35', borderRadius: 8 },
    companyInfo: {
      serviceName: '쿠팡 Coupang',
      legalName: '쿠팡 주식회사',
      privacyCertification: 'ISMS-P, ISO 27001, PCI DSS',
      privacyPolicyLink: 'https://privacy.coupang.com/ko/center/coupang/',
    },
    optionalConsents: [
      { id: 1, title: '마케팅 정보 수신 동의', enabled: false },
      { id: 2, title: '개인정보의 국외 이전', enabled: false },
      { id: 3, title: '위치기반 서비스 이용 약관', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '전자금융거래 이용 약관' },
      { id: 2, title: '개인정보 수집 및 이용 동의' },
      { id: 3, title: '개인정보 제3자 제공 동의 (판매자)' }
    ]
  },
  '11번가': {
    logoText: '11',
    logoStyle: { backgroundColor: '#FF6B35', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '이벤트/혜택 알림', enabled: false },
      { id: 2, title: '11번가페이 서비스 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '전자상거래약관' }
    ]
  },
  'G마켓': {
    logoText: 'G',
    logoStyle: { backgroundColor: '#FF6B35', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '이벤트/혜택 알림', enabled: false },
      { id: 2, title: 'G9 서비스 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '전자상거래약관' }
    ]
  },
  '카카오택시': {
    logoText: '택시',
    logoStyle: { backgroundColor: '#FEE500', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '위치 정보 수집 동의', enabled: true },
      { id: 2, title: '카카오페이 결제 동의', enabled: true },
      { id: 3, title: '운전자 평가 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '위치정보 이용약관' }
    ]
  },
  '카카오톡': {
    logoText: '톡',
    logoStyle: { backgroundColor: '#FEE500', borderRadius: 8 },
    companyInfo: {
      serviceName: '카카오톡 Kakao Talk',
      legalName: '(주)카카오',
      privacyCertification: 'ISMP-P, ISO 27001, ISO 27701, ISO 27017, ISO 27018',
      privacyPolicyLink: 'https://www.kakao.com/policy/privacy',
    },
    optionalConsents: [
      { id: 1, title: '프로필정보 추가 수집 동의', enabled: false },
      { id: 2, title: '이벤트 및 마케팅 활용 동의', enabled: false },
      { id: 3, title: '위치정보 수집 및 이용 동의', enabled: false },
      { id: 4, title: '배송지정보 수집 동의', enabled: false },
      { id: 5, title: '카카오톡 브랜드픽 채널 추가 및 소식 수신', enabled: false },
      { id: 6, title: '카카오알림 채널 추가 및 광고메시지 수신', enabled: false },
      { id: 7, title: '맞춤형 광고를 위한 행태정보 수집 및 이용', enabled: false },
      { id: 8, title: '맞춤형 광고를 위한 행태정보 제3자 제공', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '카카오계정 이용약관' },
      { id: 2, title: '개인정보 수집·이용 동의' },
      { id: 3, title: '위치정보 이용약관 동의' }
    ]
  },
  '넷플릭스': {
    logoText: 'N',
    logoStyle: { backgroundColor: '#E50914', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '마케팅 정보 수신 동의', enabled: false },
      { id: 2, title: '콘텐츠 취향 맞춤 정보 제공', enabled: true },
      { id: 3, title: '테스트 참여 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '이용 약관 동의' },
      { id: 2, title: '개인정보 수집 및 이용 동의' },
      { id: 3, title: '국외 이전 동의' }
    ]
  },
  '서울대병원': {
    logoText: '서울',
    logoStyle: { backgroundColor: '#E91E63', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '건강정보 수집 동의', enabled: true },
      { id: 2, title: '진료 예약 알림 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '의료서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '의료정보 보호약관' }
    ]
  },
  '정부24': {
    logoText: '정부',
    logoStyle: { backgroundColor: '#2196F3', borderRadius: 8 },
    companyInfo: {
      serviceName: '정부24',
      legalName: '행정안전부',
      privacyCertification: 'ISMP-P',
      privacyPolicyLink: 'https://plus.gov.kr/portal/scrtycntr/prvc',
    },
    optionalConsents: [
      { id: 1, title: '정책/생활정보 알림 수신 동의', enabled: false },
      { id: 2, title: '부가 서비스 이용', enabled: false },
      { id: 3, title: '만족도 조사 참여', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '이용약관 및 개인정보 수집·이용 동의' },
      { id: 2, title: '고유식별정보 처리 동의' },
      { id: 3, title: '행정정보 공동이용 동의' }
    ]
  },
  '아고다': {
    logoText: 'A',
    logoStyle: { backgroundColor: '#FFC107', borderRadius: 8 },
    companyInfo: {
      serviceName: '아고다 Agoda',
      legalName: '아고다페이먼트코리아 유한회사',
      privacyCertification: 'PCI DSS, SOC 2',
      privacyPolicyLink: 'https://www.agoda.com/ko-kr/info/privacy.html?ds=bxqWoxci2eh%2B1PQl',
    },
    optionalConsents: [
      { id: 1, title: '아고다 특가 및 프로모션 수신 동의', enabled: false },
      { id: 2, title: '쿠키 수집 및 타겟팅 광고 동의', enabled: false },
      { id: 3, title: '제3자 마케팅 파트너 앞 정보 제공', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '이용 약관 및 개인정보 처리방침 동의' },
      { id: 2, title: '개인정보 제3자 제공 동의' },
      { id: 3, title: '결제 정보 수집 및 처리 동의' }
    ]
  },
  '야놀자': {
    logoText: '야놀',
    logoStyle: { backgroundColor: '#FF5722', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '여행 추천 알림 동의', enabled: false },
      { id: 2, title: '특가 정보 수신 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '예약 서비스 약관' }
    ]
  },
  '여기어때': {
    logoText: '여기',
    logoStyle: { backgroundColor: '#FF9800', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '여행 추천 알림 동의', enabled: false },
      { id: 2, title: '특가 정보 수신 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '예약 서비스 약관' }
    ]
  },
  '부킹닷컴': {
    logoText: 'B',
    logoStyle: { backgroundColor: '#FFEB3B', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '여행 추천 알림 동의', enabled: false },
      { id: 2, title: '특가 정보 수신 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '예약 서비스 약관' }
    ]
  },
  '옥션': {
    logoText: '옥션',
    logoStyle: { backgroundColor: '#FFEB3B', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '이벤트/혜택 알림', enabled: false },
      { id: 2, title: '옥션페이 서비스 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '전자상거래약관' }
    ]
  },
  '우버': {
    logoText: 'U',
    logoStyle: { backgroundColor: '#000000', borderRadius: 8 },
    companyInfo: {
      serviceName: '우버 Uber',
      legalName: '우버코리아 유한회사',
      privacyCertification: 'PCI DSS',
      privacyPolicyLink: 'https://www.uber.com/global/ko/privacy-notice-riders-order-recipients/?country=korea&id=k&lang=ko',
    },
    optionalConsents: [
      { id: 1, title: '위치 정보 항상 허용', enabled: true },
      { id: 2, title: '마케팅 알림(Push/Email) 수신 동의', enabled: false },
      { id: 3, title: '주소록 연동 및 친구 초대', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용 약관 및 개인정보 처리방침' },
      { id: 2, title: '위치 정보 수집 및 이용 동의' },
      { id: 3, title: '전자금융거래 약관 동의' }
    ]
  },
  '티머니': {
    logoText: 'T',
    logoStyle: { backgroundColor: '#607D8B', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '위치 정보 수집 동의', enabled: true },
      { id: 2, title: '교통 정보 알림 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '교통카드 서비스 약관' }
    ]
  },
  '한국철도공사': {
    logoText: 'KORAIL',
    logoStyle: { backgroundColor: '#795548', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '열차 운행 정보 알림', enabled: true },
      { id: 2, title: '할인 정보 수신 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '철도 서비스 약관' }
    ]
  },
  // 의료 기관들
  '삼성서울병원': {
    logoText: '삼성',
    logoStyle: { backgroundColor: '#9C27B0', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '건강정보 수집 동의', enabled: true },
      { id: 2, title: '진료 예약 알림 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '의료서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '의료정보 보호약관' }
    ]
  },
  '세브란스병원': {
    logoText: '세브',
    logoStyle: { backgroundColor: '#673AB7', borderRadius: 8 },
    companyInfo: {
      serviceName: '세브란스 병원 Severanace Hospital',
      legalName: '연세대학교 의과대학 강남세브란스병원',
      privacyCertification: 'ISMS-P, ISO 27001',
      privacyPolicyLink: 'https://member.severance.healthcare/member/policy/privacy.do',
    },
    optionalConsents: [
      { id: 1, title: '진료 정보 외 추가 서비스 안내', enabled: false },
      { id: 2, title: '지정 보호자에게 진료 정보(수술 경과 등) SMS 발송', enabled: false },
      { id: 3, title: '연구/통계 목적의 의학 연구 활용 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '진료/검사/입원 서비스를 위한 개인정보 수집·이용' },
      { id: 2, title: '고유식별정보(주민등록번호/외국인등록번호) 처리 동의' },
      { id: 3, title: '민감정보(건강정보) 처리 동의' }
    ]
  },
  '강남성심병원': {
    logoText: '성심',
    logoStyle: { backgroundColor: '#3F51B5', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '건강정보 수집 동의', enabled: true },
      { id: 2, title: '진료 예약 알림 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '의료서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '의료정보 보호약관' }
    ]
  },
  // 행정 기관들
  '국세청': {
    logoText: '국세',
    logoStyle: { backgroundColor: '#00BCD4', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '세무 정보 수신 동의', enabled: false },
      { id: 2, title: '민원 처리 알림 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '국세청 서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '전자정부 서비스 약관' }
    ]
  },
  '건강보험공단': {
    logoText: '건보',
    logoStyle: { backgroundColor: '#009688', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '보험 정보 수신 동의', enabled: false },
      { id: 2, title: '민원 처리 알림 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '건강보험공단 서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '전자정부 서비스 약관' }
    ]
  },
  '국민연금공단': {
    logoText: '국민',
    logoStyle: { backgroundColor: '#4CAF50', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '연금 정보 수신 동의', enabled: false },
      { id: 2, title: '민원 처리 알림 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '국민연금공단 서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '전자정부 서비스 약관' }
    ]
  },
  // SNS 기관들
  '네이버밴드': {
    logoText: '밴드',
    logoStyle: { backgroundColor: '#4CAF50', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '친구 추천 동의', enabled: false },
      { id: 2, title: '연락처 동기화 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '네이버계정 약관' }
    ]
  },
  '인스타그램': {
    logoText: 'IG',
    logoStyle: { backgroundColor: '#E91E63', borderRadius: 8 },
    companyInfo: {
      serviceName: '인스타그램 Instagram',
      legalName: '메타플랫폼스코리아 유한회사',
      privacyCertification: 'ISO 27001, PCI DSS, SOC 2',
      privacyPolicyLink: 'https://privacycenter.instagram.com/policy',
    },
    optionalConsents: [
      { id: 1, title: '연락처 동기화', enabled: false },
      { id: 2, title: '정밀 위치 정보 공유', enabled: false },
      { id: 3, title: '타 앱/웹사이트 활동 기반 광고 허용', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '이용 약관 동의' },
      { id: 2, title: '데이터 정책 동의' },
      { id: 3, title: '기기 정보 접근 권한' }
    ]
  },
  '페이스북': {
    logoText: 'FB',
    logoStyle: { backgroundColor: '#2196F3', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '친구 추천 동의', enabled: false },
      { id: 2, title: '연락처 동기화 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '메타계정 약관' }
    ]
  },
  // 교육/업무 기관들
  '구글클래스룸': {
    logoText: 'G',
    logoStyle: { backgroundColor: '#4285F4', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '학습 데이터 분석 동의', enabled: true },
      { id: 2, title: '과제 알림 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '구글계정 약관' }
    ]
  },
  '줌': {
    logoText: 'Z',
    logoStyle: { backgroundColor: '#2D8CFF', borderRadius: 8 },
    companyInfo: {
      serviceName: '줌 ZOOM',
      legalName: '줌비디오커뮤니케이션스코리아 (유)',
      privacyCertification: 'ISO 27001, SOC 2, CSAP',
      privacyPolicyLink: 'https://www.zoom.com/ko/trust/privacy/',
    },
    optionalConsents: [
      { id: 1, title: '마케팅 커뮤니케이션 수신', enabled: false },
      { id: 2, title: '클라우드 녹화 저장', enabled: false },
      { id: 3, title: '캘린더 통합', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 약관 및 개인정보 처리방침' },
      { id: 2, title: '진단 데이터 및 서비스 로그 수집' },
      { id: 3, title: '오디오/비디오 데이터 처리 동의' }
    ]
  },
  '슬랙': {
    logoText: 'S',
    logoStyle: { backgroundColor: '#4A154B', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '메시지 알림 동의', enabled: true },
      { id: 2, title: '상태 업데이트 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '업무 협업 서비스 약관' }
    ]
  },
  '노션': {
    logoText: 'N',
    logoStyle: { backgroundColor: '#000000', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '마케팅 이메일 수신 동의', enabled: false },
      { id: 2, title: '분석용 쿠키 허용', enabled: false },
      { id: 3, title: 'Google/Apple 계정 연동', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: 'Terms of Service' },
      { id: 2, title: 'Privacy Policy' },
      { id: 3, title: '필수 쿠키 사용' }
    ]
  },
  // 취미 기관들
  '왓챠': {
    logoText: 'W',
    logoStyle: { backgroundColor: '#FF6B35', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '추천 콘텐츠 분석 동의', enabled: true },
      { id: 2, title: '시청 기록 공유 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '구독 서비스 약관' }
    ]
  },
  '디즈니플러스': {
    logoText: 'D',
    logoStyle: { backgroundColor: '#113CCF', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '추천 콘텐츠 분석 동의', enabled: true },
      { id: 2, title: '시청 기록 공유 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '구독 서비스 약관' }
    ]
  },
  '유튜브': {
    logoText: 'Y',
    logoStyle: { backgroundColor: '#FF0000', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '시청 기록 저장', enabled: false },
      { id: 2, title: '검색 기록 저장', enabled: false },
      { id: 3, title: '채널 구독 및 알림 수신', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: 'YouTube 이용약관' },
      { id: 2, title: 'Google 개인정보 처리방침' }
    ]
  },
  // 기타 기관들
  '구글': {
    logoText: 'G',
    logoStyle: { backgroundColor: '#4285F4', borderRadius: 8 },
    companyInfo: {
      serviceName: '구글 Google',
      legalName: 'Google LLC 구글 유한책임회사',
      privacyCertification: 'ISMS-P, ISO 27001, ISO 27701, PCI DSS, SOC 2, CSAP',
      privacyPolicyLink: 'https://policies.google.com/privacy?hl=ko',
    },
    optionalConsents: [
      { id: 1, title: '웹 및 앱 활동 저장', enabled: true },
      { id: 2, title: 'YouTube 기록 저장', enabled: true },
      { id: 3, title: '광고 개인 최적화', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: 'Google 서비스 약관 동의' },
      { id: 2, title: '개인정보 수집 및 이용 동의' },
      { id: 3, title: '위치 정보 이용 약관 동의' }
    ]
  },
  '네이버': {
    logoText: 'N',
    logoStyle: { backgroundColor: '#03C75A', borderRadius: 8 },
    companyInfo: {
      serviceName: '네이버 Naver',
      legalName: '네이버 주식회사',
      privacyCertification: 'ISMP-P, ISO 27001, ISO 27701, ISO 27017, ISO 27018, SOC 2, SOC 3',
      privacyPolicyLink: 'https://policy.naver.com/policy/privacy.html',
    },
    optionalConsents: [
      { id: 1, title: '광고성 정보 수신 동의', enabled: false },
      { id: 2, title: '위치정보 이용약관 동의', enabled: false },
      { id: 3, title: '주소록/캘린더 연동', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '네이버 이용약관' },
      { id: 2, title: '개인정보 수집·이용 동의' },
      { id: 3, title: '본인확인기관을 통한 본인인증' }
    ]
  },
  '다음': {
    logoText: 'D',
    logoStyle: { backgroundColor: '#FF6B35', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '검색 기록 분석 동의', enabled: true },
      { id: 2, title: '개인화 서비스 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '카카오계정 약관' }
    ]
  },
  'T멤버쉽': {
    logoText: 'T',
    logoStyle: { backgroundColor: '#00BCF2', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '서비스 개선 분석 동의', enabled: true },
      { id: 2, title: '마케팅 정보 수신 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: 'T멤버쉽 약관' }
    ]
  },
  
  // SNS 기관들
  '카카오톡': {
    logoText: '카카오톡',
    logoStyle: { backgroundColor: '#FEE500', borderRadius: 8 },
    companyInfo: {
      serviceName: '카카오톡 Kakao Talk',
      legalName: '(주)카카오',
      privacyCertification: 'ISMP-P, ISO 27001, ISO 27701, ISO 27017, ISO 27018',
      privacyPolicyLink: 'https://www.kakao.com/policy/privacy',
    },
    optionalConsents: [
      { id: 1, title: '프로필정보 추가 수집 동의', enabled: false },
      { id: 2, title: '이벤트 및 마케팅 활용 동의', enabled: false },
      { id: 3, title: '위치정보 수집 및 이용 동의', enabled: false },
      { id: 4, title: '배송지정보 수집 동의', enabled: false },
      { id: 5, title: '카카오톡 브랜드픽 채널 추가 및 소식 수신', enabled: false },
      { id: 6, title: '카카오알림 채널 추가 및 광고메시지 수신', enabled: false },
      { id: 7, title: '맞춤형 광고를 위한 행태정보 수집 및 이용', enabled: false },
      { id: 8, title: '맞춤형 광고를 위한 행태정보 제3자 제공', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '카카오계정 이용약관' },
      { id: 2, title: '개인정보 수집·이용 동의' },
      { id: 3, title: '위치정보 이용약관 동의' }
    ],
    changeHistory: []
  },
  '네이버밴드': {
    logoText: '밴드',
    logoStyle: { backgroundColor: '#00C73C', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '그룹 추천 동의', enabled: true },
      { id: 2, title: '활동 알림 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '네이버계정 약관' }
    ]
  },
  '인스타그램': {
    logoText: '인스타',
    logoStyle: { backgroundColor: '#E4405F', borderRadius: 8 },
    companyInfo: {
      serviceName: '인스타그램 Instagram',
      legalName: '메타플랫폼스코리아 유한회사',
      privacyCertification: 'ISO 27001, PCI DSS, SOC 2',
      privacyPolicyLink: 'https://privacycenter.instagram.com/policy',
    },
    optionalConsents: [
      { id: 1, title: '연락처 동기화', enabled: false },
      { id: 2, title: '정밀 위치 정보 공유', enabled: false },
      { id: 3, title: '타 앱/웹사이트 활동 기반 광고 허용', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '이용 약관 동의' },
      { id: 2, title: '데이터 정책 동의' },
      { id: 3, title: '기기 정보 접근 권한' }
    ]
  },
  '페이스북': {
    logoText: '페이스북',
    logoStyle: { backgroundColor: '#1877F2', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '친구 추천 동의', enabled: true },
      { id: 2, title: '광고성 정보 수신 동의', enabled: false },
      { id: 3, title: '위치 정보 수집 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '페이스북계정 약관' }
    ]
  },
  
  // 여행 기관들
  '야놀자': {
    logoText: '야놀자',
    logoStyle: { backgroundColor: '#FF6B35', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '위치 기반 숙소 추천 동의', enabled: true },
      { id: 2, title: '마케팅 정보 수신 동의', enabled: false },
      { id: 3, title: '리뷰 작성 알림 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '예약 서비스 약관' }
    ]
  },
  '여기어때': {
    logoText: '여기어때',
    logoStyle: { backgroundColor: '#00C73C', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '개인화 추천 동의', enabled: true },
      { id: 2, title: '광고성 정보 수신 동의', enabled: false },
      { id: 3, title: '위치 정보 수집 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '예약 서비스 약관' }
    ]
  },
  '아고다': {
    logoText: '아고다',
    logoStyle: { backgroundColor: '#E53E3E', borderRadius: 8 },
    companyInfo: {
      serviceName: '아고다 Agoda',
      legalName: '아고다페이먼트코리아 유한회사',
      privacyCertification: 'PCI DSS, SOC 2',
      privacyPolicyLink: 'https://www.agoda.com/ko-kr/info/privacy.html?ds=bxqWoxci2eh%2B1PQl',
    },
    optionalConsents: [
      { id: 1, title: '아고다 특가 및 프로모션 수신 동의', enabled: false },
      { id: 2, title: '쿠키 수집 및 타겟팅 광고 동의', enabled: false },
      { id: 3, title: '제3자 마케팅 파트너 앞 정보 제공', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '이용 약관 및 개인정보 처리방침 동의' },
      { id: 2, title: '개인정보 제3자 제공 동의' },
      { id: 3, title: '결제 정보 수집 및 처리 동의' }
    ]
  },
  '부킹닷컴': {
    logoText: '부킹',
    logoStyle: { backgroundColor: '#003580', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '다국어 서비스 동의', enabled: true },
      { id: 2, title: '마케팅 정보 수신 동의', enabled: false },
      { id: 3, title: '위치 정보 수집 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '국제 예약 약관' }
    ]
  },
  
  // 교육/업무 기관들
  '구글클래스룸': {
    logoText: '클래스룸',
    logoStyle: { backgroundColor: '#4285F4', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '학습 진도 분석 동의', enabled: true },
      { id: 2, title: '알림 수신 동의', enabled: true },
      { id: 3, title: '과제 제출 알림 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '구글계정 약관' }
    ]
  },
  '줌': {
    logoText: '줌',
    logoStyle: { backgroundColor: '#2D8CFF', borderRadius: 8 },
    companyInfo: {
      serviceName: '줌 ZOOM',
      legalName: '줌비디오커뮤니케이션스코리아 (유)',
      privacyCertification: 'ISO 27001, SOC 2, CSAP',
      privacyPolicyLink: 'https://www.zoom.com/ko/trust/privacy/',
    },
    optionalConsents: [
      { id: 1, title: '마케팅 커뮤니케이션 수신', enabled: false },
      { id: 2, title: '클라우드 녹화 저장', enabled: false },
      { id: 3, title: '캘린더 통합', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 약관 및 개인정보 처리방침' },
      { id: 2, title: '진단 데이터 및 서비스 로그 수집' },
      { id: 3, title: '오디오/비디오 데이터 처리 동의' }
    ]
  },
  '슬랙': {
    logoText: '슬랙',
    logoStyle: { backgroundColor: '#4A154B', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '메시지 알림 동의', enabled: true },
      { id: 2, title: '상태 업데이트 동의', enabled: true },
      { id: 3, title: '파일 공유 알림 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '팀 협업 서비스 약관' }
    ]
  },
  '노션': {
    logoText: '노션',
    logoStyle: { backgroundColor: '#000000', borderRadius: 8 },
    companyInfo: {
      serviceName: '노션 Notion',
      legalName: 'Notion Labs, Inc.',
      privacyCertification: 'ISO 27001, SOC 2 (Type 2)',
      privacyPolicyLink: 'https://privacycenter.notion.so/policies',
    },
    optionalConsents: [
      { id: 1, title: '마케팅 이메일 수신 동의', enabled: false },
      { id: 2, title: '분석용 쿠키 허용', enabled: false },
      { id: 3, title: 'Google/Apple 계정 연동', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: 'Terms of Service' },
      { id: 2, title: 'Privacy Policy' },
      { id: 3, title: '필수 쿠키 사용' }
    ]
  },
  
  // 취미 기관들
  '넷플릭스': {
    logoText: '넷플릭스',
    logoStyle: { backgroundColor: '#E50914', borderRadius: 8 },
    companyInfo: {
      serviceName: '넷플릭스 Netflix',
      legalName: '넷플릭스서비시스코리아 유한회사',
      privacyCertification: 'ISMS-P, PCI DSS, SOC 2',
      privacyPolicyLink: 'https://help.netflix.com/ko/node/100628',
    },
    optionalConsents: [
      { id: 1, title: '마케팅 정보 수신 동의', enabled: false },
      { id: 2, title: '콘텐츠 취향 맞춤 정보 제공', enabled: true },
      { id: 3, title: '테스트 참여 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '이용 약관 동의' },
      { id: 2, title: '개인정보 수집 및 이용 동의' },
      { id: 3, title: '국외 이전 동의' }
    ]
  },
  '왓챠': {
    logoText: '왓챠',
    logoStyle: { backgroundColor: '#FF6B35', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '시청 기록 분석 동의', enabled: true },
      { id: 2, title: '개인화 추천 동의', enabled: true },
      { id: 3, title: '리뷰 작성 알림 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '구독 서비스 약관' }
    ]
  },
  '디즈니플러스': {
    logoText: '디즈니+',
    logoStyle: { backgroundColor: '#113CCF', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '시청 기록 분석 동의', enabled: true },
      { id: 2, title: '개인화 추천 동의', enabled: true },
      { id: 3, title: '시청 통계 공유 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '구독 서비스 약관' }
    ]
  },
  '유튜브': {
    logoText: '유튜브',
    logoStyle: { backgroundColor: '#FF0000', borderRadius: 8 },
    companyInfo: {
      serviceName: '유튜브 Youtube',
      legalName: 'Google LLC',
      privacyCertification: 'ISO 27001, ISO 27701, ISO 27017, ISO 27018, PCI DSS, SOC 2, SOC 3',
      privacyPolicyLink: 'https://policies.google.com/privacy?hl=ko',
    },
    optionalConsents: [
      { id: 1, title: '시청 기록 저장', enabled: false },
      { id: 2, title: '검색 기록 저장', enabled: false },
      { id: 3, title: '채널 구독 및 알림 수신', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: 'YouTube 이용약관' },
      { id: 2, title: 'Google 개인정보 처리방침' }
    ]
  },
  
  // 쇼핑 기관들
  '쿠팡': {
    logoText: '쿠팡',
    logoStyle: { backgroundColor: '#FF6B00', borderRadius: 8 },
    companyInfo: {
      serviceName: '쿠팡 Coupang',
      legalName: '쿠팡 주식회사',
      privacyCertification: 'ISMS-P, ISO 27001, PCI DSS',
      privacyPolicyLink: 'https://privacy.coupang.com/ko/center/coupang/',
    },
    optionalConsents: [
      { id: 1, title: '마케팅 정보 수신 동의', enabled: false },
      { id: 2, title: '개인정보의 국외 이전', enabled: false },
      { id: 3, title: '위치기반 서비스 이용 약관', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '전자금융거래 이용 약관' },
      { id: 2, title: '개인정보 수집 및 이용 동의' },
      { id: 3, title: '개인정보 제3자 제공 동의 (판매자)' }
    ]
  },
  '11번가': {
    logoText: '11번가',
    logoStyle: { backgroundColor: '#FF6600', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '개인화 상품 추천 동의', enabled: true },
      { id: 2, title: '마케팅 정보 수신 동의', enabled: false },
      { id: 3, title: '위치 기반 배송 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '구매/배송 약관' }
    ]
  },
  'G마켓': {
    logoText: 'G마켓',
    logoStyle: { backgroundColor: '#FF6600', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '개인화 상품 추천 동의', enabled: true },
      { id: 2, title: '마케팅 정보 수신 동의', enabled: false },
      { id: 3, title: '위치 기반 배송 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '구매/배송 약관' }
    ]
  },
  '옥션': {
    logoText: '옥션',
    logoStyle: { backgroundColor: '#FF6600', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '개인화 상품 추천 동의', enabled: true },
      { id: 2, title: '마케팅 정보 수신 동의', enabled: false },
      { id: 3, title: '위치 기반 배송 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '구매/배송 약관' }
    ]
  },
  
  // 교통 기관들
  '카카오T': {
    logoText: '카카오T',
    logoStyle: { backgroundColor: '#FEE500', borderRadius: 8 },
    companyInfo: {
      serviceName: '카카오 T Kakao T',
      legalName: '(주)카카오모빌리티',
      privacyCertification: 'ISMP-P, ISO 27001, ISO 27701',
      privacyPolicyLink: 'https://www.kakaomobility.com/privacy-policy',
    },
    optionalConsents: [
      { id: 1, title: '마케팅 및 프로모션 알림 수신 동의', enabled: false },
      { id: 2, title: '제휴사 정보 제공 동의', enabled: false },
      { id: 3, title: '위치 정보 항상 허용', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '카카오 T 서비스 이용약관' },
      { id: 2, title: '개인정보 수집·이용 동의' },
      { id: 3, title: '위치기반서비스 이용약관' }
    ]
  },
  '우버': {
    logoText: '우버',
    logoStyle: { backgroundColor: '#000000', borderRadius: 8 },
    companyInfo: {
      serviceName: '우버 Uber',
      legalName: '우버코리아 유한회사',
      privacyCertification: 'PCI DSS',
      privacyPolicyLink: 'https://www.uber.com/global/ko/privacy-notice-riders-order-recipients/?country=korea&id=k&lang=ko',
    },
    optionalConsents: [
      { id: 1, title: '위치 정보 항상 허용', enabled: true },
      { id: 2, title: '마케팅 알림(Push/Email) 수신 동의', enabled: false },
      { id: 3, title: '주소록 연동 및 친구 초대', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용 약관 및 개인정보 처리방침' },
      { id: 2, title: '위치 정보 수집 및 이용 동의' },
      { id: 3, title: '전자금융거래 약관 동의' }
    ]
  },
  '티머니': {
    logoText: '티머니',
    logoStyle: { backgroundColor: '#00A651', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '이용 기록 분석 동의', enabled: true },
      { id: 2, title: '충전 알림 동의', enabled: true },
      { id: 3, title: '마케팅 정보 수신 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '교통카드 서비스 약관' }
    ]
  },
  '한국철도공사': {
    logoText: '코레일',
    logoStyle: { backgroundColor: '#003876', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '이용 기록 분석 동의', enabled: true },
      { id: 2, title: '예약 알림 동의', enabled: true },
      { id: 3, title: '마케팅 정보 수신 동의', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '철도 서비스 약관' }
    ]
  },
  
  // 행정 기관들
  '정부24': {
    logoText: '정부24',
    logoStyle: { backgroundColor: '#004EA2', borderRadius: 8 },
    companyInfo: {
      serviceName: '정부24',
      legalName: '행정안전부',
      privacyCertification: 'ISMP-P',
      privacyPolicyLink: 'https://plus.gov.kr/portal/scrtycntr/prvc',
    },
    optionalConsents: [
      { id: 1, title: '정책/생활정보 알림 수신 동의', enabled: false },
      { id: 2, title: '부가 서비스 이용', enabled: false },
      { id: 3, title: '만족도 조사 참여', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '이용약관 및 개인정보 수집·이용 동의' },
      { id: 2, title: '고유식별정보 처리 동의' },
      { id: 3, title: '행정정보 공동이용 동의' }
    ]
  },
  '국세청': {
    logoText: '국세청',
    logoStyle: { backgroundColor: '#E31E24', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '세무 서비스 이용 기록 분석 동의', enabled: true },
      { id: 2, title: '세무 알림 동의', enabled: true },
      { id: 3, title: '개인화 서비스 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '세무 서비스 약관' }
    ]
  },
  '건강보험공단': {
    logoText: '건보공단',
    logoStyle: { backgroundColor: '#00A651', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '건강 서비스 이용 기록 분석 동의', enabled: true },
      { id: 2, title: '건강 알림 동의', enabled: true },
      { id: 3, title: '개인화 서비스 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '건강보험 서비스 약관' }
    ]
  },
  '국민연금공단': {
    logoText: '국민연금',
    logoStyle: { backgroundColor: '#FF6B00', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '연금 서비스 이용 기록 분석 동의', enabled: true },
      { id: 2, title: '연금 알림 동의', enabled: true },
      { id: 3, title: '개인화 서비스 동의', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관' },
      { id: 2, title: '개인정보 수집/이용' },
      { id: 3, title: '국민연금 서비스 약관' }
    ]
  }
  // 다른 기관들도 여기에 추가 가능
};

// 동의 변경 내역 아이템 컴포넌트
function ChangeHistoryItem({ item }) {
  const isPending = item.status === 'pending';
  return (
    <TouchableOpacity
      style={styles.changeHistoryItem}
      activeOpacity={isPending ? 1 : 0.7}
      disabled={isPending}
    >
      <View style={styles.changeHistoryLeft}>
        {isPending ? (
          <View style={styles.pendingIcon}>
            <ActivityIndicator size="small" color="#00752F" />
          </View>
        ) : (
          <View
            style={[
              styles.statusIcon,
              { backgroundColor: item.status === 'approved' ? '#10B981' : '#EF4444' },
            ]}
          >
            <Ionicons
              name={item.status === 'approved' ? 'checkmark' : 'close'}
              size={16}
              color="#FFFFFF"
            />
          </View>
        )}
        <View style={styles.changeHistoryContent}>
          <Text style={styles.changeHistoryTitle}>{item.title}</Text>
          <Text style={styles.changeHistoryTime}>
            {isPending ? '위치정보 업데이트 대기중...' : item.time}
          </Text>
        </View>
      </View>
      {!isPending && <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />}
    </TouchableOpacity>
  );
}

function ConsentItem({ item, isRequired = false, orgName, onToggle }) {
  const [isEnabled, setIsEnabled] = useState(item.enabled || false);

  // 저장된 상태 불러오기
  useEffect(() => {
    loadConsentState();
  }, []);

  const loadConsentState = async () => {
    try {
      const key = `${orgName}_${item.id}`;
      const savedState = await AsyncStorage.getItem(key);
      if (savedState !== null) {
        setIsEnabled(JSON.parse(savedState));
      }
    } catch (error) {
      console.log('상태 불러오기 실패:', error);
    }
  };

  const saveConsentState = async (value) => {
    try {
      const key = `${orgName}_${item.id}`;
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log('상태 저장 실패:', error);
    }
  };

  const handleToggle = (value) => {
    setIsEnabled(value);
    saveConsentState(value);
    if (onToggle) {
      onToggle(value, item);
    }
  };

  return (
    <View style={styles.consentItem}>
      <View style={styles.consentContent}>
        <Text style={styles.consentTitle}>{item.title}</Text>
      </View>
      {!isRequired && (
        <Switch
          trackColor={{ false: '#E5E7EB', true: '#00752F' }}
          thumbColor={isEnabled ? '#FFFFFF' : '#FFFFFF'}
          ios_backgroundColor="#E5E7EB"
          onValueChange={handleToggle}
          value={isEnabled}
        />
      )}
    </View>
  );
}

export default function OrgDetailScreen({ navigation, route }) {
  const { orgName, initialTab } = route.params || { orgName: '토스', initialTab: 'consent' };
  const [activeTab, setActiveTab] = useState(initialTab || 'consent');
  const orgInfo = orgData[orgName] || orgData['토스']; // 기본값으로 토스 사용
  const iconInfo = getOrgIconInfo(orgName);
  const [changeHistory, setChangeHistory] = useState([]);
  const [changeHistoryStorageKey, setChangeHistoryStorageKey] = useState('');
  
  // 행정 카테고리 기업 목록
  const governmentOrgs = ['정부24', '국세청', '건강보험공단', '국민연금공단'];
  const isGovernmentOrg = governmentOrgs.includes(orgName);
  
  // 행정 기관일 경우 제3자 제공 탭 제외
  const filteredTabs = isGovernmentOrg 
    ? tabs.filter(tab => tab.id !== 'thirdParty')
    : tabs;
  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate?.('OrgMain');
    }
  };
  
  // initialTab이 변경되면 activeTab 업데이트
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // 사용자별 changeHistory 키 설정
  useEffect(() => {
    const setupStorageKey = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const key = `changeHistory_${orgName}_${userId || 'guest'}`;
        setChangeHistoryStorageKey(key);
      } catch (error) {
        console.log('스토리지 키 설정 실패:', error);
        const key = `changeHistory_${orgName}_guest`;
        setChangeHistoryStorageKey(key);
      }
    };
    setupStorageKey();
  }, [orgName]);

  useEffect(() => {
    if (!changeHistoryStorageKey) return;
    
    let isMounted = true;
    const loadHistory = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem(changeHistoryStorageKey);
        if (savedHistory && isMounted) {
          setChangeHistory(JSON.parse(savedHistory));
        } else if (isMounted) {
          // 새 사용자는 항상 빈 배열로 시작
          setChangeHistory([]);
        }
      } catch (error) {
        console.log('동의 변경 내역 로드 실패:', error);
        if (isMounted) {
          // 에러 발생 시에도 빈 배열로 시작
          setChangeHistory([]);
        }
      }
    };

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [orgName, changeHistoryStorageKey]);

  const formatDateLabel = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  const formatTimeLabel = (date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDisplayDate = (date) => {
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const persistChangeHistory = async (history) => {
    try {
      if (!changeHistoryStorageKey) {
        // 키가 아직 설정되지 않았으면 사용자 ID를 다시 가져와서 설정
        const userId = await AsyncStorage.getItem('userId');
        const key = `changeHistory_${orgName}_${userId || 'guest'}`;
        await AsyncStorage.setItem(key, JSON.stringify(history));
      } else {
        await AsyncStorage.setItem(changeHistoryStorageKey, JSON.stringify(history));
      }
    } catch (error) {
      console.log('동의 변경 내역 저장 실패:', error);
    }
  };

  const addGlobalChangeHistoryEntry = async (entry) => {
    try {
      const historyKey = await getUserScopedHistoryKey();
      const saved = await AsyncStorage.getItem(historyKey);
      const history = saved ? JSON.parse(saved) : [];
      const updated = [entry, ...history].slice(0, 50);
      await AsyncStorage.setItem(historyKey, JSON.stringify(updated));
    } catch (error) {
      console.log('글로벌 동의 변경 내역 저장 실패:', error);
    }
  };

  const handleConsentToggle = async (value, consentItem) => {
    const now = new Date();
    const dateLabel = formatDateLabel(now);
    const timeLabel = formatTimeLabel(now);
    const displayDate = formatDisplayDate(now);
  const isKakaoLocationToggle =
    orgName === '카카오톡' &&
    !value &&
    consentItem.id === 3; // 카카오톡 위치정보 동의 항목 ID

    const newEntry = {
      id: `${Date.now()}-${consentItem.id}`,
    title: isKakaoLocationToggle
      ? '위치정보 수집 및 이용 동의 해제 요청 중'
        : `${consentItem.title} ${value ? '동의' : '해제'}`,
      time: isKakaoLocationToggle ? '처리 중...' : timeLabel,
      status: isKakaoLocationToggle ? 'pending' : value ? 'approved' : 'rejected',
      type: 'toggle',
      displayDate,
    };

    let updatedHistoryRef = [];
    setChangeHistory((prev) => {
      const prevHistory = Array.isArray(prev) ? [...prev] : [];
      const firstGroup = prevHistory[0];

      if (firstGroup && firstGroup.date === dateLabel) {
        const updatedGroup = {
          ...firstGroup,
          items: [newEntry, ...(firstGroup.items || [])],
        };
        updatedHistoryRef = [updatedGroup, ...prevHistory.slice(1)];
      } else {
        updatedHistoryRef = [
          {
            date: dateLabel,
            items: [newEntry],
          },
          ...prevHistory,
        ];
      }

      return updatedHistoryRef;
    });

    await persistChangeHistory(updatedHistoryRef);

    await addGlobalChangeHistoryEntry({
      id: newEntry.id,
      orgName,
      displayDate,
      description: newEntry.title,
      timestamp: now.toISOString(),
    });
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
            onPress={handleBack}
          >
            <Ionicons name="chevron-back" size={24} color="#0B1215" />
          </TouchableOpacity>
          
          <View style={styles.orgHeader}>
            <View style={[styles.orgLogo, iconInfo.logoType === 'image' ? {} : orgInfo.logoStyle]}>
              {iconInfo.logoType === 'image' ? (
                <Image source={iconInfo.imageSource} style={{ width: 36, height: 36 }} />
              ) : (
                <Text style={styles.orgText}>{iconInfo.logoText}</Text>
              )}
            </View>
            <Text style={styles.orgName}>{orgName}</Text>
          </View>
          
          <View style={{ width: 32 }} />
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
            {filteredTabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={styles.tabItem}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === tab.id && styles.tabTextActive
                ]}>
                  {tab.label}
                </Text>
                {activeTab === tab.id && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'consent' && (
            <View style={styles.consentContainer}>
              {/* 선택 동의 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>선택 동의</Text>
                <View style={styles.consentList}>
                  {orgInfo.optionalConsents.map((item) => (
                    <ConsentItem
                      key={item.id}
                      item={item}
                      orgName={orgName}
                      onToggle={(value, consent) => handleConsentToggle(value, consent)}
                    />
                  ))}
                </View>
              </View>

              {/* 필수 동의 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>필수 동의</Text>
                <View style={styles.consentList}>
                  {orgInfo.requiredConsents.map((item) => (
                    <ConsentItem key={item.id} item={item} isRequired={true} orgName={orgName} />
                  ))}
                </View>
              </View>
            </View>
          )}

          {activeTab === 'risk' && (
            <View style={styles.riskContainer}>
              {orgName === '토스' ? (
                <View style={styles.riskDetailContainer}>
                  <View style={styles.riskScoreContainer}>
                    <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                    <Text style={styles.riskScoreValue}>32.0점</Text>
                    <Text style={styles.riskScoreLevel}>(위험)</Text>
                  </View>
                  
                  <View style={styles.riskFormulaContainer}>
                    <Text style={styles.riskFormulaTitle}>산출식</Text>
                    <Text style={styles.riskFormulaText}>
                      위험도 = 데이터민감도(5) + (노출범위(2) × 경과시간(3) × 목적명확성(1.5) × AI위험(1.5)) × 2 = 32.0
                    </Text>
                  </View>

                  <View style={styles.riskFactorsContainer}>
                    <Text style={styles.riskFactorsTitle}>분석</Text>
                    
                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>1. 데이터민감도 (5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        금융 거래 기록과 신용 정보는 개인정보보호법 제22조(민감정보의 처리 제한)에서 정의한 "민감정보"입니다. 거래 기록은 사용자의 소비 패턴, 경제 상황, 신용도를 직접적으로 드러냅니다. 신용 정보는 개인의 금융 신뢰도를 나타내며, 향후 금융거래에 직접 영향을 미칩니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        유출 시 신원 도용, 금전 사기, 신용 악용 등 즉각적이고 직접적인 재정 손실을 초래합니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>2. 노출범위 (2)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        토스는 금융 정보를 토스 그룹사(증권, 보험, 캐피탈 등)와 제휴사에 제한적으로 공유합니다. 불특정 다수가 접근할 수 있는 상태(3점)는 아니지만, 그룹 내 여러 회사에 공유되는 것은 위험입니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제17조(제3자 제공 제한)는 "제3자 제공 시 동의"를 요구합니다. 제한적이지만 여러 제3자에 공유된다는 점입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>3. 경과시간 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        토스는 금융 거래 기록을 장기간 보관합니다. 은행 규제상 의무 보관 기간(보통 5년 이상)을 포함하여 여러 해 동안 기록이 유지됩니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제21조(보유기간의 제한)의 "불필요 시 파기" 원칙입니다. 금융거래 목적 달성 후 12개월 이상 보관은 높은 리스크입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>4. 목적명확성 (1.5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        토스는 개인정보 처리 목적을 "금융서비스 안내", "맞춤형 상품 추천" 등으로 표현합니다. AI 신용평가, 자동화 의사결정, 대출 심사 기준 등 구체적 목적이 명확하지 않습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제15조(이용목적의 명확화)의 "구체적 목적 고지" 요건 미달입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>5. AI위험 (1.5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        토스는 AI를 사용하여 사용자의 거래 기록을 분석하고 신용평가를 수행합니다. 이 AI 평가는 대출 한도, 금리, 대출 승인 여부를 자동으로 결정합니다. 사용자는 자신이 어떤 기준으로 평가되었는지 알 수 없습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제22조의2(자동화된 결정에 대한 권리)는 "자동화된 의사결정이 법적 또는 유사한 중대한 영향을 받는 경우, 정보주체는 그 의사결정에 대한 설명과 이의 제기 권리"를 명시합니다. 신용평가에 따른 금융거래 결정은 "중대한 영향"에 해당합니다.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.withdrawalEffectContainer}>
                    <Text style={styles.withdrawalEffectTitle}>동의한 선택항목과 위험도 변수의 관계</Text>
                    
                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 1: 제휴사/그룹사 서비스 안내</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>5</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>금융 정보는 고도로 민감한 고유식별정보</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>노출범위</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>2</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>금융 정보가 토스 그룹사에 제3자 제공됨</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 32.0점 (위험) → 제3자 제공 중단</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 29점대 (높음)</Text>
                        <Text style={styles.expectedEffectNote}>금융 정보의 기본 민감도(5)는 변하지 않으므로 효과가 제한적입니다.</Text>
                      </View>
                    </View>

                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 2: 신용정보 조회 및 활용</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>5</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>신용정보는 고도로 민감한 고유식별정보</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>AI위험</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>1.5</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>AI 신용평가, 자동 대출 한도 결정</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>목적명확성</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>1.5</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>목적이 포괄적으로만 표현됨</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 32.0점 (위험) → AI 자동화 의사결정 중단</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 18점대 (보통)</Text>
                        <Text style={styles.expectedEffectNote}>약 14점 감소 효과가 있습니다.</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.maxEffectContainer}>
                    <Text style={styles.maxEffectTitle}>2개 동의 모두 철회 시 최대 효과</Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>현재:</Text> 데이터민감도(5), 노출범위(2), 경과시간(3), 목적명확성(1.5), AI위험(1.5) → 32.0점 <Text style={styles.maxEffectHighText}>(위험)</Text></Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>모든 동의 철회 후:</Text> 데이터민감도(5), 노출범위(1), 경과시간(3), 목적명확성(1.0), AI위험(1.0) → 11점 <Text style={styles.maxEffectSafeText}>(안전)</Text></Text>
                    <Text style={styles.maxEffectHighlight}>총 21점 감소</Text>
                  </View>
                </View>
              ) : orgName === '네이버' ? (
                <View style={styles.riskDetailContainer}>
                  <View style={styles.riskScoreContainerMedium}>
                    <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                    <Text style={styles.riskScoreValueMedium}>21.0점</Text>
                    <Text style={styles.riskScoreLevelMedium}>(보통)</Text>
                  </View>
                  
                  <View style={styles.riskFormulaContainer}>
                    <Text style={styles.riskFormulaTitle}>산출식</Text>
                    <Text style={styles.riskFormulaText}>
                      위험도 = 데이터민감도(3) + (노출범위(2) × 경과시간(3) × 목적명확성(1.0) × AI위험(1.5)) × 2 = 21.0
                    </Text>
                  </View>

                  <View style={styles.riskFactorsContainer}>
                    <Text style={styles.riskFactorsTitle}>분석</Text>
                    
                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>1. 데이터민감도 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        네이버의 검색 기록과 위치 정보는 사용자의 관심사와 위치 패턴을 보여주는 행동 데이터입니다. 위치 정보는 특히 사용자가 언제 어디에 있었는지를 추론할 수 있으므로 프라이버시 침해 위험이 높습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        다만 주민등록번호나 금융정보처럼 직접적인 재산 피해를 초래하지는 않습니다. 간접적 피해(프라이버시 침해)의 수준이므로 3점입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>2. 노출범위 (2)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        네이버는 수집한 데이터를 네이버 계열사(Webtoon, Papago, V 등)에 제한적으로 공유합니다. 외부 불특정 다수에게 광범위하게 공개되지는 않습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제17조(제3자 제공 제한)에서 "제3자 제공"에 해당하지만, 제한된 범위입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>3. 경과시간 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        네이버는 검색 기록과 위치 정보를 장기간 보관합니다. 사용자가 수동으로 삭제하지 않으면 여러 해 동안 누적됩니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제21조(보유기간의 제한)입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>4. 목적명확성 (1.0)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        네이버는 검색 기록을 "검색 서비스 제공", 위치 정보를 "지도 서비스 제공"으로 명확하게 표현합니다. 목적이 명확하고 범위도 제한적입니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제15조(이용목적의 명확화) 충족입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>5. AI위험 (1.5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        네이버의 검색 알고리즘과 추천 시스템은 AI를 사용하여 사용자의 검색 패턴을 분석합니다. 이를 기반으로 다음 검색 추천, 광고 타겟팅 등을 자동으로 결정합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제22조의2(자동화된 결정에 대한 권리)의 규제 대상입니다.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.withdrawalEffectContainer}>
                    <Text style={styles.withdrawalEffectTitle}>동의한 선택항목과 위험도 변수의 관계</Text>
                    
                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 1: 위치정보 이용약관 동의</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>위치 정보는 사용자의 행동 패턴을 보여주는 데이터</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>경과시간</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>지속적 수집, 장기 보관됨</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>노출범위</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>2</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>위치 정보가 네이버 계열사에 제한적으로 공유됨</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 21.0점 (보통) → 위치 정보 수집·공유 중단</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 9점대 (안전)</Text>
                        <Text style={styles.expectedEffectNote}>약 12점 감소 효과가 있습니다.</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.maxEffectContainerVerySafe}>
                    <Text style={styles.maxEffectTitle}>동의 철회 시 최대 효과</Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>현재:</Text> 데이터민감도(3), 노출범위(2), 경과시간(3), 목적명확성(1.0), AI위험(1.5) → 21.0점 <Text style={styles.maxEffectMediumText}>(보통)</Text></Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>모든 동의 철회 후:</Text> 데이터민감도(1), 노출범위(1), 경과시간(1), 목적명확성(1.0), AI위험(1.0) → 3점 <Text style={styles.maxEffectVerySafeText}>(매우 안전)</Text></Text>
                    <Text style={styles.maxEffectHighlightVerySafe}>총 18점 감소</Text>
                  </View>
                </View>
              ) : orgName === '구글' ? (
                <View style={styles.riskDetailContainer}>
                  <View style={styles.riskScoreContainerVery}>
                    <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                    <Text style={styles.riskScoreValueVery}>43.5점</Text>
                    <Text style={styles.riskScoreLevelVery}>(매우 위험)</Text>
                  </View>
                  
                  <View style={styles.riskFormulaContainer}>
                    <Text style={styles.riskFormulaTitle}>산출식</Text>
                    <Text style={styles.riskFormulaText}>
                      위험도 = 데이터민감도(3) + (노출범위(3) × 경과시간(3) × 목적명확성(1.5) × AI위험(1.5)) × 2 = 43.5
                    </Text>
                  </View>

                  <View style={styles.riskFactorsContainer}>
                    <Text style={styles.riskFactorsTitle}>분석</Text>
                    
                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>1. 데이터민감도 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        구글은 검색 기록, 클릭 기록, 시청 기록 등 사용자의 관심사, 경제상황, 건강 상태가 드러나는 행동 데이터를 수집합니다. 검색 기록은 '우울증', '대출상담', '법률상담' 등 개인의 내밀한 상황을 보여줄 수 있습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        다만 주민등록번호나 금융 계좌정보(5점)처럼 직접적 신분 확인이나 재산 피해에 연결되지는 않으므로, 개인정보보호법 제22조(민감정보의 처리 제한)에서 규정한 민감정보보다 한 단계 낮게 평가합니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>2. 노출범위 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        수집된 데이터는 Google 검색, YouTube, Gmail 등 모든 구글 서비스에 통합되어, 수많은 제3자 광고주에게 공유될 수 있습니다. 개인정보보호법 제17조(제3자 제공 제한)는 데이터가 외부로 제공될 때 명확한 동의를 요구합니다. 구글의 데이터 활용 방식은 실제 제공 범위가 넓고 사용자가 통제하기 어려운 구조입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>3. 경과시간 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        구글 계정 활동 기록은 자동 삭제 설정을 하지 않으면 사용자가 계정을 보유하는 동안 장기간 저장됩니다. 개인정보보호법 제21조(보유기간의 제한 및 파기)는 불필요한 정보는 지체 없이 파기하도록 규정합니다. 장기 보관은 유출, 오용 위험이 높아집니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>4. 목적명확성 (1.5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        구글이 개인정보 처리 목적을 "서비스 개선", "맞춤 경험", "광고 최적화" 등으로 안내하지만, 해당 목적은 포괄적이라서 실제 어떤 방식과 범위로 활용되는지 사용자가 명확히 파악하기 어렵습니다. 개인정보보호법 제15조(이용목적의 명확화)는 개인정보 항목, 이용 목적을 구체적으로 고지하도록 규정합니다. 포괄적 설명은 목적 명확성 점수가 낮은 기준입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>5. AI위험 (1.5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        구글의 AI 시스템은 행동 데이터를 자동으로 분류·프로파일링하여 사용자를 세분화하고, 각종 광고나 맞춤 서비스에 활용합니다. 개인정보보호법 제22조의2(자동화된 결정에 대한 권리)는 자동화된 의사결정이 개인에게 영향을 줄 경우 정보주체의 권리를 보장해야 한다고 규정합니다. 자동화 프로파일링이 지속적으로 이용되는 경우입니다.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.withdrawalEffectContainer}>
                    <Text style={styles.withdrawalEffectTitle}>동의한 선택항목과 위험도 변수의 관계</Text>
                    
                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 1: 웹 및 앱 활동 저장</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>검색, 클릭, 위치 데이터는 개인의 성향·활동을 나타냅니다</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>경과시간</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>계정 개설 후 장기적으로 누적, 보관됩니다</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>노출범위</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>광고 네트워크 전체에 공유됩니다</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 43.5점 (매우 위험) → 경과시간·데이터 수집 감소</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 39점대 (여전히 매우 위험)</Text>
                        <Text style={styles.expectedEffectNote}>다른 항목과 함께 철회해야 효과가 뚜렷합니다.</Text>
                      </View>
                    </View>

                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 2: YouTube 기록 저장</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>시청 기록은 관심사·신념·건강을 직접 드러냅니다</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>경과시간</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>계정 유지 중 지속적으로 수집, 장기 보관됨</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 43.5점 (매우 위험) → 데이터 수집 감소</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 38점대 (여전히 매우 위험)</Text>
                      </View>
                    </View>

                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 3: 광고 개인 최적화</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>노출범위</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>프로필이 다수 광고주에게 공유됨</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>AI위험</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>1.5</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>AI가 자동 분석·타겟팅</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>목적명확성</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>1.5</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>광고 목적이 포괄적으로만 표현됨</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 43.5점 (매우 위험) → 노출범위·AI위험 감소</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 15점대 (보통)</Text>
                        <Text style={styles.expectedEffectNote}>특히 광고 관련 항목 철회 시 효과가 큽니다.</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.withdrawalEffectContainer}>
                    <Text style={styles.withdrawalEffectTitle}>동의한 선택항목 철회시 효과</Text>
                    <View style={styles.withdrawalTable}>
                      <View style={[styles.withdrawalTableRow, styles.withdrawalTableHeaderRow]}>
                        <View style={styles.withdrawalTableHeaderCell}>
                          <Text style={styles.withdrawalTableHeaderText}>선택항목</Text>
                        </View>
                        <View style={styles.withdrawalTableDivider} />
                        <View style={styles.withdrawalTableHeaderCell}>
                          <Text style={styles.withdrawalTableHeaderText}>감소량</Text>
                        </View>
                      </View>
                      <View style={styles.withdrawalTableRow}>
                        <View style={styles.withdrawalTableCellContainer}>
                          <Text style={styles.withdrawalTableCellText}>웹 및 앱 활동 저장</Text>
                        </View>
                        <View style={styles.withdrawalTableDivider} />
                        <View style={styles.withdrawalTableCellContainer}>
                          <Text style={styles.withdrawalTableCellText}>약 4.5점 감소</Text>
                        </View>
                      </View>
                      <View style={styles.withdrawalTableRow}>
                        <View style={styles.withdrawalTableCellContainer}>
                          <Text style={styles.withdrawalTableCellText}>YouTube 기록 저장</Text>
                        </View>
                        <View style={styles.withdrawalTableDivider} />
                        <View style={styles.withdrawalTableCellContainer}>
                          <Text style={styles.withdrawalTableCellText}>약 5.5점 감소</Text>
                        </View>
                      </View>
                      <View style={[styles.withdrawalTableRow, styles.withdrawalTableLastRow]}>
                        <View style={styles.withdrawalTableCellContainer}>
                          <Text style={styles.withdrawalTableCellText}>광고 개인 최적화</Text>
                        </View>
                        <View style={styles.withdrawalTableDivider} />
                        <View style={styles.withdrawalTableCellContainer}>
                          <Text style={styles.withdrawalTableCellText}>약 28.5점 감소</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.maxEffectContainerVerySafe}>
                    <Text style={styles.maxEffectTitle}>3개 동의 모두 철회 시 최대 효과</Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>현재:</Text> 데이터민감도(3), 노출범위(3), 경과시간(3), 목적명확성(1.5), AI위험(1.5) → 43.5점 <Text style={styles.maxEffectVeryText}>(매우 위험)</Text></Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>모든 동의 철회 후:</Text> 데이터민감도(1), 노출범위(1), 경과시간(1), 목적명확성(1.0), AI위험(1.0) → 3점 <Text style={styles.maxEffectVerySafeText}>(매우 안전)</Text></Text>
                    <Text style={styles.maxEffectHighlightVerySafe}>총 40.5점 감소</Text>
                  </View>
                </View>
              ) : orgName === '인스타그램' ? (
                <View style={styles.riskDetailContainer}>
                  <View style={styles.riskScoreContainerVery}>
                    <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                    <Text style={styles.riskScoreValueVery}>43.5점</Text>
                    <Text style={styles.riskScoreLevelVery}>(매우 위험)</Text>
                  </View>
                  
                  <View style={styles.riskFormulaContainer}>
                    <Text style={styles.riskFormulaTitle}>산출식</Text>
                    <Text style={styles.riskFormulaText}>
                      위험도 = 데이터민감도(3) + (노출범위(3) × 경과시간(3) × 목적명확성(1.5) × AI위험(1.5)) × 2 = 43.5
                    </Text>
                  </View>

                  <View style={styles.riskFactorsContainer}>
                    <Text style={styles.riskFactorsTitle}>분석</Text>
                    
                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>1. 데이터민감도 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        인스타그램은 소셜 활동, 연락처, 게시물 등 사용자의 관계망·관심사·라이프스타일을 보여주는 행동 데이터를 수집합니다. 게시물 자체는 공개된 정보지만, 메타데이터(언제, 어디서, 얼마나 자주, 무엇을 좋아했는가)와 함께 분석되면 사용자의 개인적 패턴과 성향을 추론할 수 있습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        다만 금융정보나 신원증명 정보처럼 직접적 재산 피해를 초래하지는 않습니다. 개인정보보호법 제22조(민감정보)의 한 단계 아래로, 프라이버시 침해와 차별의 위험이 있는 수준입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>2. 노출범위 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        Meta는 Facebook, Instagram, WhatsApp, Threads 등 자신의 플랫폼 전체에서 수집한 정보를 통합합니다. 또한 Meta 픽셀을 통해 인스타그램 외부의 웹사이트와 앱에서의 사용자 활동도 추적합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제17조는 "제3자에게 제공할 때 명확한 동의"를 요구합니다. 사용자는 이러한 크로스 플랫폼 추적을 거부하기 어렵습니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>3. 경과시간 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        인스타그램 계정이 유지되는 한 모든 활동 기록이 저장됩니다. 게시물, 좋아요, 팔로우, 직접 메시지 등이 계정 유지 기간 동안 계속 보관됩니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제21조(보유기간의 제한)의 "불필요 시 파기" 원칙에서 보면, 12개월 이상 미사용 정보는 더 이상 필요하지 않은 것입니다. 하지만 Meta는 마케팅 목적으로 무한정 보관합니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>4. 목적명확성 (1.5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        인스타그램은 개인정보 처리 목적을 "서비스 개선", "맞춤 경험", "광고 최적화" 등으로 표현합니다. 크로스 플랫폼 추적, 행동 예측, 구매 의향 분석 등의 구체적 목적을 명확히 하지 않습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제15조의 "구체적 목적 고지" 요건에 미달합니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>5. AI위험 (1.5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        Meta의 AI는 크로스 플랫폼 데이터를 통합하여 사용자 프로필을 자동으로 생성합니다. 이 프로필은 구매 의향, 정치적 성향, 건강 상태 등을 포함할 수 있습니다. 사용자는 자신이 어떻게 분류되었는지 알 수 없습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제22조의2(자동화된 결정에 대한 권리)의 규제 대상입니다.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.withdrawalEffectContainer}>
                    <Text style={styles.withdrawalEffectTitle}>동의한 선택항목과 위험도 변수의 관계</Text>
                    
                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 1: 연락처 동기화</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>연락처는 사용자의 관계망을 보여주는 행동 데이터</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>노출범위</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>연락처가 Meta 광고 네트워크에 공유됨</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>경과시간</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>장기 보관됨</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 43.5점 (매우 위험) → 데이터 수집 감소</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 38점대 (여전히 매우 위험)</Text>
                      </View>
                    </View>

                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 2: 타 앱/웹사이트 활동 기반 광고</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>노출범위</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>인스타그램 외 활동도 추적되어 공개적 프로필에 포함됨</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>AI위험</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>1.5</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>크로스 플랫폼 데이터를 AI로 자동 분석</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 43.5점 (매우 위험) → 추적 범위 축소, AI 분석 감소</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 28점대 (위험)</Text>
                        <Text style={styles.expectedEffectNote}>약 15점 감소 효과가 있습니다.</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.maxEffectContainerVerySafe}>
                    <Text style={styles.maxEffectTitle}>2개 동의 모두 철회 시 최대 효과</Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>현재:</Text> 데이터민감도(3), 노출범위(3), 경과시간(3), 목적명확성(1.5), AI위험(1.5) → 43.5점 <Text style={styles.maxEffectVeryText}>(매우 위험)</Text></Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>모든 동의 철회 후:</Text> 데이터민감도(1), 노출범위(1), 경과시간(1), 목적명확성(1.0), AI위험(1.0) → 3점 <Text style={styles.maxEffectVerySafeText}>(매우 안전)</Text></Text>
                    <Text style={styles.maxEffectHighlightVerySafe}>총 40.5점 감소</Text>
                  </View>
                </View>
              ) : orgName === '유튜브' ? (
                <View style={styles.riskDetailContainer}>
                  <View style={styles.riskScoreContainerVery}>
                    <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                    <Text style={styles.riskScoreValueVery}>43.5점</Text>
                    <Text style={styles.riskScoreLevelVery}>(매우 위험)</Text>
                  </View>
                  
                  <View style={styles.riskFormulaContainer}>
                    <Text style={styles.riskFormulaTitle}>산출식</Text>
                    <Text style={styles.riskFormulaText}>
                      위험도 = 데이터민감도(3) + (노출범위(3) × 경과시간(3) × 목적명확성(1.5) × AI위험(1.5)) × 2 = 43.5
                    </Text>
                  </View>

                  <View style={styles.riskFactorsContainer}>
                    <Text style={styles.riskFactorsTitle}>분석</Text>
                    
                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>1. 데이터민감도 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        YouTube 시청 기록은 사용자가 선택한 콘텐츠 제목 자체가 관심사를 나타냅니다. 구독 채널은 사용자가 정기적으로 소비하는 콘텐츠 유형(정치, 건강, 취미 등)을 보여줍니다. 검색 기록은 사용자의 의도와 니즈를 직접 드러냅니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        다만 직접적 신원 확인이나 재정 피해를 초래하지는 않습니다. 개인정보보호법 제22조(민감정보)보다 한 단계 낮은 프라이버시 침해 수준입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>2. 노출범위 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        Google 광고 네트워크는 Search, YouTube, Gmail, Maps 등을 포함합니다. YouTube 시청 데이터는 이 전체 네트워크의 광고 타겟팅에 사용되며, 불특정 다수의 광고주가 이 정보에 접근합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제17조(제3자 제공 제한)의 "제3자 제공 동의" 요건을 충족하지 못하는 구조입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>3. 경과시간 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        YouTube 계정이 유지되는 한 모든 시청 기록, 검색 기록이 저장됩니다. 사용자가 수동으로 삭제하지 않으면 10년, 20년 단위로 누적됩니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제21조(보유기간의 제한 및 파기)의 "불필요 시 파기" 원칙입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>4. 목적명확성 (1.5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        YouTube는 개인정보 처리 목적을 "동영상 추천", "광고 맞춤화" 등으로만 표현합니다. 구체적 목적 명시가 부족합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제15조(이용목적의 명확화) 기준입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>5. AI위험 (1.5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        YouTube의 추천 알고리즘은 시청 기록을 AI로 분석하여 사용자의 관심사를 자동으로 파악하고, 이를 기반으로 다음 추천 콘텐츠를 결정합니다. 이는 자동화된 의사결정에 해당합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제22조의2(자동화된 결정에 대한 권리)의 규제 대상입니다.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.withdrawalEffectContainer}>
                    <Text style={styles.withdrawalEffectTitle}>동의한 선택항목과 위험도 변수의 관계</Text>
                    
                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 1: 시청 기록 저장</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>시청 기록은 관심사·신념·건강을 보여주는 행동 데이터</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>경과시간</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>지속적 수집, 장기 보관됨</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>AI위험</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>1.5</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>시청 패턴을 AI로 자동 분석하여 프로필 생성</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 43.5점 (매우 위험) → 데이터 수집·분석 감소</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 25점대 (보통)</Text>
                        <Text style={styles.expectedEffectNote}>약 18점 감소 효과가 있습니다.</Text>
                      </View>
                    </View>

                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 2: 검색 기록 저장</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>검색 기록은 사용자의 의도와 니즈를 직접 드러냅니다</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>경과시간</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>지속적 수집, 장기 보관됨</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 43.5점 (매우 위험) → 데이터 수집 감소</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 38점대 (여전히 매우 위험)</Text>
                      </View>
                    </View>

                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 3: 채널 구독 및 알림 수신</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>구독 채널은 사용자의 성향과 신념을 보여주는 데이터</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>노출범위</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>구독 정보가 광고 프로필에 포함되어 공유됨</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 43.5점 (매우 위험) → 개인 정보 프로필 축소</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 32점대 (위험)</Text>
                        <Text style={styles.expectedEffectNote}>약 11점 감소 효과가 있습니다.</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.maxEffectContainerVerySafe}>
                    <Text style={styles.maxEffectTitle}>3개 동의 모두 철회 시 최대 효과</Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>현재:</Text> 데이터민감도(3), 노출범위(3), 경과시간(3), 목적명확성(1.5), AI위험(1.5) → 43.5점 <Text style={styles.maxEffectVeryText}>(매우 위험)</Text></Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>모든 동의 철회 후:</Text> 데이터민감도(1), 노출범위(1), 경과시간(1), 목적명확성(1.0), AI위험(1.0) → 3점 <Text style={styles.maxEffectVerySafeText}>(매우 안전)</Text></Text>
                    <Text style={styles.maxEffectHighlightVerySafe}>총 40.5점 감소</Text>
                  </View>
                </View>
              ) : orgName === '노션' ? (
                <View style={styles.riskDetailContainer}>
                  <View style={styles.riskScoreContainerMedium}>
                    <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                    <Text style={styles.riskScoreValueMedium}>21.0점</Text>
                    <Text style={styles.riskScoreLevelMedium}>(보통)</Text>
                  </View>
                  
                  <View style={styles.riskFormulaContainer}>
                    <Text style={styles.riskFormulaTitle}>산출식</Text>
                    <Text style={styles.riskFormulaText}>
                      위험도 = 데이터민감도(3) + (노출범위(2) × 경과시간(3) × 목적명확성(1.0) × AI위험(1.5)) × 2 = 21.0
                    </Text>
                  </View>

                  <View style={styles.riskFactorsContainer}>
                    <Text style={styles.riskFactorsTitle}>분석</Text>
                    
                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>1. 데이터민감도 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        노션에 저장되는 작업 문서와 노트는 사용자의 업무 내용, 프로젝트 세부사항, 개인 계획 등을 포함합니다. 이는 사용자의 직업, 개인적 관심사, 계획을 드러내는 정보입니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        다만 공식적인 신원 확인 정보나 금융정보는 아닙니다. 프라이버시 침해의 수준이므로 3점입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>2. 노출범위 (2)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        노션은 클라우드 저장으로 국외 서버에 데이터를 보관합니다. 또한 분석 목적으로 제3자 도구(Google Analytics 등)와 연계되기도 합니다. 하지만 기본적으로 사용자가 공유 설정을 하지 않으면 외부 불특정 다수에게 공개되지 않습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제17조(제3자 제공 제한)에 해당하지만, 제한된 범위입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>3. 경과시간 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        노션 계정이 유지되는 한 모든 문서가 저장됩니다. 사용자가 삭제하지 않으면 여러 해 동안 보관됩니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제21조(보유기간의 제한)입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>4. 목적명확성 (1.0)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        노션은 개인정보 처리 목적을 "문서 작성 및 협업", "서비스 제공" 등으로 명확하게 표현합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제15조(이용목적의 명확화) 충족입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>5. AI위험 (1.5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        노션의 AI 기능(텍스트 생성, 자동완성)은 사용자의 문서 내용을 분석하여 다음 내용을 자동으로 생성합니다. 이는 자동화된 의사결정의 일종입니다.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.withdrawalEffectContainer}>
                    <Text style={styles.withdrawalEffectTitle}>동의한 선택항목과 위험도 변수의 관계</Text>
                    
                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 1: 마케팅 이메일 수신</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>사용 패턴 데이터는 사용자의 활동 패턴을 보여주는 데이터</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>목적명확성</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>1.0</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>마케팅 목적 명확함</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 21.0점 (보통) → 마케팅 분석 중단</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 15점대 (보통)</Text>
                        <Text style={styles.expectedEffectNote}>약 6점 감소 효과입니다.</Text>
                      </View>
                    </View>

                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 2: 분석용 쿠키 허용</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>노출범위</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>2</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>쿠키가 제3자 분석 도구에 공유됨</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>경과시간</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>지속적 수집됨</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 21.0점 (보통) → 추적 데이터 감소</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 12점대 (낮음)</Text>
                        <Text style={styles.expectedEffectNote}>약 9점 감소 효과가 있습니다.</Text>
                      </View>
                    </View>

                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 3: Google/Apple 계정 연동</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>노출범위</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>2</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>노션 정보가 Google/Apple 생태계와 연계됨</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>연동으로 문서 정보 범위 확장됨</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 21.0점 (보통) → 데이터 연계 차단</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 15점대 (보통)</Text>
                        <Text style={styles.expectedEffectNote}>약 6점 감소 효과입니다.</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.maxEffectContainerVerySafe}>
                    <Text style={styles.maxEffectTitle}>3개 동의 모두 철회 시 최대 효과</Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>현재:</Text> 데이터민감도(3), 노출범위(2), 경과시간(3), 목적명확성(1.0), AI위험(1.5) → 21.0점 <Text style={styles.maxEffectMediumText}>(보통)</Text></Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>모든 동의 철회 후:</Text> 데이터민감도(1), 노출범위(1), 경과시간(1), 목적명확성(1.0), AI위험(1.0) → 3점 <Text style={styles.maxEffectVerySafeText}>(매우 안전)</Text></Text>
                    <Text style={styles.maxEffectHighlightVerySafe}>총 18점 감소</Text>
                  </View>
                </View>
              ) : orgName === '우버' ? (
                <View style={styles.riskDetailContainer}>
                  <View style={styles.riskScoreContainerMedium}>
                    <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                    <Text style={styles.riskScoreValueMedium}>21.0점</Text>
                    <Text style={styles.riskScoreLevelMedium}>(보통)</Text>
                  </View>
                  
                  <View style={styles.riskFormulaContainer}>
                    <Text style={styles.riskFormulaTitle}>산출식</Text>
                    <Text style={styles.riskFormulaText}>
                      위험도 = 데이터민감도(3) + (노출범위(2) × 경과시간(3) × 목적명확성(1.0) × AI위험(1.5)) × 2 = 21.0
                    </Text>
                  </View>

                  <View style={styles.riskFactorsContainer}>
                    <Text style={styles.riskFactorsTitle}>분석</Text>
                    
                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>1. 데이터민감도 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        우버가 수집하는 위치 정보와 이동 경로는 사용자가 언제 어디에 있었는지를 보여줍니다. 이는 사용자의 거주지, 직장, 방문 장소, 일과 패턴을 추론할 수 있는 정보입니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        다만 신원 확인 정보나 금융정보는 아닙니다. 프라이버시 침해의 수준이므로 3점입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>2. 노출범위 (2)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        우버는 위치 정보를 운전자에게만 공유합니다. 불특정 다수에게 광범위하게 공개되지는 않습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제17조(제3자 제공 제한)에 해당하지만, 운전자라는 제한된 대상입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>3. 경과시간 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        우버는 이용 기록과 위치 데이터를 장기간 보관합니다. 사용자가 삭제하지 않으면 여러 해 동안 누적됩니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제21조(보유기간의 제한)입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>4. 목적명확성 (1.0)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        우버는 위치 정보 처리 목적을 "차량 호출", "경로 안내", "운전자 매칭" 등으로 명확하게 표현합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제15조(이용목적의 명확화) 충족입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>5. AI위험 (1.5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        우버의 AI는 사용자의 위치와 목적지를 기반으로 자동으로 경로를 최적화합니다. 또한 수요와 공급에 따라 요금을 자동으로 결정합니다(동적 가격). 사용자는 이러한 의사결정 기준을 알 수 없습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제22조의2(자동화된 결정에 대한 권리)의 규제 대상입니다.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.withdrawalEffectContainer}>
                    <Text style={styles.withdrawalEffectTitle}>동의한 선택항목과 위험도 변수의 관계</Text>
                    
                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 1: 위치 정보 항상 허용</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>위치 정보는 사용자의 행동 패턴을 보여주는 데이터</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>경과시간</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>"항상 허용"은 지속적 수집, 장기 보관을 의미함</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>AI위험</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>1.5</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>위치 데이터를 AI로 분석하여 가격·배정 결정</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 21.0점 (보통) → 위치 수집 방식 변경, AI 분석 감소</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 9점대 (안전)</Text>
                        <Text style={styles.expectedEffectNote}>약 12점 감소 효과가 있습니다.</Text>
                        <Text style={styles.expectedEffectNote}>팁: 위치 권한을 "항상" → "앱 사용 중일 때만"으로 변경하면 더 효과적입니다.</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.maxEffectContainerVerySafe}>
                    <Text style={styles.maxEffectTitle}>동의 철회 시 최대 효과</Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>현재:</Text> 데이터민감도(3), 노출범위(2), 경과시간(3), 목적명확성(1.0), AI위험(1.5) → 21.0점 <Text style={styles.maxEffectMediumText}>(보통)</Text></Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>모든 동의 철회 후:</Text> 데이터민감도(1), 노출범위(1), 경과시간(1), 목적명확성(1.0), AI위험(1.0) → 3점 <Text style={styles.maxEffectVerySafeText}>(매우 안전)</Text></Text>
                    <Text style={styles.maxEffectHighlightVerySafe}>총 18점 감소</Text>
                  </View>
                </View>
              ) : orgName === '넷플릭스' ? (
                <View style={styles.riskDetailContainer}>
                  <View style={styles.riskScoreContainerMedium}>
                    <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                    <Text style={styles.riskScoreValueMedium}>21.0점</Text>
                    <Text style={styles.riskScoreLevelMedium}>(보통)</Text>
                  </View>
                  
                  <View style={styles.riskFormulaContainer}>
                    <Text style={styles.riskFormulaTitle}>산출식</Text>
                    <Text style={styles.riskFormulaText}>
                      위험도 = 데이터민감도(3) + (노출범위(2) × 경과시간(3) × 목적명확성(1.0) × AI위험(1.5)) × 2 = 21.0
                    </Text>
                  </View>

                  <View style={styles.riskFactorsContainer}>
                    <Text style={styles.riskFactorsTitle}>분석</Text>
                    
                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>1. 데이터민감도 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        넷플릭스의 시청 기록은 사용자가 선택한 콘텐츠를 보여줍니다. 이는 사용자의 취향, 관심사, 라이프스타일 선호도를 드러냅니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        다만 검색 기록(의도 표현)에 비해서는 선택지가 제한적입니다. 프라이버시 침해의 수준이므로 3점입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>2. 노출범위 (2)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        넷플릭스는 시청 데이터를 클라우드에 보관하고, 일부 분석 목적으로 제3자와 공유할 수 있습니다. 하지만 기본적으로 외부 불특정 다수에게 광범위하게 공개되지는 않습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제17조(제3자 제공 제한)에 해당하지만 제한된 범위입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>3. 경과시간 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        넷플릭스는 시청 기록을 계정 유지 기간 동안 보관합니다. 사용자가 삭제하지 않으면 여러 해 동안 누적됩니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제21조(보유기간의 제한)입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>4. 목적명확성 (1.0)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        넷플릭스는 개인정보 처리 목적을 "콘텐츠 추천", "서비스 제공", "사용 통계" 등으로 명확하게 표현합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제15조(이용목적의 명확화) 충족입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>5. AI위험 (1.5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        넷플릭스의 추천 알고리즘은 시청 기록을 AI로 분석하여 다음 추천 콘텐츠를 자동으로 결정합니다. 사용자는 추천 기준을 알 수 없습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제22조의2(자동화된 결정에 대한 권리)의 규제 대상입니다.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.withdrawalEffectContainer}>
                    <Text style={styles.withdrawalEffectTitle}>동의한 선택항목과 위험도 변수의 관계</Text>
                    
                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 1: 마케팅 정보 수신</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>시청 패턴은 사용자의 취향을 보여주는 행동 데이터</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>목적명확성</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>1.0</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>마케팅 목적 명확함</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 21.0점 (보통) → 마케팅 분석 중단</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 15점대 (보통)</Text>
                        <Text style={styles.expectedEffectNote}>약 6점 감소 효과가 있습니다.</Text>
                      </View>
                    </View>

                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 2: 콘텐츠 취향 맞춤 정보 제공</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>AI위험</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>1.5</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>시청 기록을 AI로 분석하여 맞춤 추천</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>노출범위</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>2</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>취향 정보가 제3자에 공유될 가능성</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 21.0점 (보통) → AI 분석 중단</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 12점대 (낮음)</Text>
                        <Text style={styles.expectedEffectNote}>약 9점 감소 효과가 있습니다.</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.maxEffectContainerVerySafe}>
                    <Text style={styles.maxEffectTitle}>2개 동의 모두 철회 시 최대 효과</Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>현재:</Text> 데이터민감도(3), 노출범위(2), 경과시간(3), 목적명확성(1.0), AI위험(1.5) → 21.0점 <Text style={styles.maxEffectMediumText}>(보통)</Text></Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>모든 동의 철회 후:</Text> 데이터민감도(1), 노출범위(1), 경과시간(1), 목적명확성(1.0), AI위험(1.0) → 3점 <Text style={styles.maxEffectVerySafeText}>(매우 안전)</Text></Text>
                    <Text style={styles.maxEffectHighlightVerySafe}>총 18점 감소</Text>
                  </View>
                </View>
              ) : orgName === '세브란스병원' ? (
                <View style={styles.riskDetailContainer}>
                  <View style={styles.riskScoreContainerMedium}>
                    <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                    <Text style={styles.riskScoreValueMedium}>17.0점</Text>
                    <Text style={styles.riskScoreLevelMedium}>(보통)</Text>
                  </View>
                  
                  <View style={styles.riskFormulaContainer}>
                    <Text style={styles.riskFormulaTitle}>산출식</Text>
                    <Text style={styles.riskFormulaText}>
                      위험도 = 데이터민감도(5) + (노출범위(2) × 경과시간(3) × 목적명확성(1.0) × AI위험(1.0)) × 2 = 17.0
                    </Text>
                  </View>

                  <View style={styles.riskFactorsContainer}>
                    <Text style={styles.riskFactorsTitle}>분석</Text>
                    
                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>1. 데이터민감도 (5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        건강정보와 진료 기록은 개인정보보호법 제22조(민감정보의 처리 제한)에서 정의한 "민감정보"입니다. 진료 기록에는 진단, 치료, 수술, 약물 정보 등이 포함되며, 이는 개인의 건강 상태를 직접적으로 드러냅니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        유출 시 건강 정보 오용(차별, 낙인 효과), 신원 도용 등 직접적인 피해를 초래할 수 있습니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>2. 노출범위 (2)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        세브란스 병원은 진료 정보를 지정 보호자, 연구기관 등 제한된 대상에게만 공유합니다. 불특정 다수에게 공개되지는 않습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제17조(제3자 제공 제한)에 해당하지만, 제한된 범위입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>3. 경과시간 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        의료 기록은 의료법에 따라 일정 기간(보통 5년 이상) 보관되어야 합니다. 의료 서비스 목적 달성 후에도 장기간 보관됩니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제21조(보유기간의 제한)의 "불필요 시 파기" 원칙과 관련 있습니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>4. 목적명확성 (1.0)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        세브란스 병원은 개인정보 처리 목적을 "진료", "치료", "진료 기록 관리", "의학 연구" 등으로 명확하게 표현합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제15조(이용목적의 명확화) 충족입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>5. AI위험 (1.0)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        세브란스 병원의 AI 활용은 진단 보조(의료 영상 분석), 환자 추적 관리 등 제한적 수준입니다. 자동화된 의사결정(진료 거부, 치료 결정 등)에는 AI를 사용하지 않습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제22조의2 규제 대상이 아닌 범위입니다.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.withdrawalEffectContainer}>
                    <Text style={styles.withdrawalEffectTitle}>동의한 선택항목과 위험도 변수의 관계</Text>
                    
                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 1: 추가 서비스 안내</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>5</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>진료 정보는 고도로 민감한 고유식별정보</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>목적명확성</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>1.0</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>안내 목적 명확함</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 17.0점 (보통) → 안내 서비스 중단</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 13점대 (낮음)</Text>
                      </View>
                    </View>

                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 2: 지정 보호자에게 진료 정보 SMS 발송</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>노출범위</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>2</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>진료 정보가 보호자에게 제3자 제공됨</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>5</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>진료 정보는 고도로 민감한 고유식별정보</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 17.0점 (보통) → 제3자 공유 중단</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 11점대 (안전)</Text>
                      </View>
                    </View>

                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 3: 의학 연구 활용</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>5</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>진료 정보는 고도로 민감한 고유식별정보</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>목적명확성</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>1.0</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>연구 목적 명확함</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 17.0점 (보통) → 연구 활용 중단</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 12점대 (낮음)</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.maxEffectContainerVerySafe}>
                    <Text style={styles.maxEffectTitle}>3개 동의 모두 철회 시 최대 효과</Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>현재:</Text> 데이터민감도(5), 노출범위(2), 경과시간(3), 목적명확성(1.0), AI위험(1.0) → 17.0점 <Text style={styles.maxEffectMediumText}>(보통)</Text></Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>모든 동의 철회 후:</Text> 데이터민감도(5), 노출범위(1), 경과시간(3), 목적명확성(1.0), AI위험(1.0) → 5점 <Text style={styles.maxEffectVerySafeText}>(매우 안전)</Text></Text>
                    <Text style={styles.maxEffectHighlightVerySafe}>총 12점 감소</Text>
                  </View>
                </View>
              ) : orgName === '카카오T' ? (
                <View style={styles.riskDetailContainer}>
                  <View style={styles.riskScoreContainerMedium}>
                    <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                    <Text style={styles.riskScoreValueMedium}>15.0점</Text>
                    <Text style={styles.riskScoreLevelMedium}>(보통)</Text>
                  </View>
                  
                  <View style={styles.riskFormulaContainer}>
                    <Text style={styles.riskFormulaTitle}>산출식</Text>
                    <Text style={styles.riskFormulaText}>
                      위험도 = 데이터민감도(3) + (노출범위(2) × 경과시간(2) × 목적명확성(1.0) × AI위험(1.5)) × 2 = 15.0
                    </Text>
                  </View>

                  <View style={styles.riskFactorsContainer}>
                    <Text style={styles.riskFactorsTitle}>분석</Text>
                    
                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>1. 데이터민감도 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        카카오 T가 수집하는 위치 정보와 이동 경로는 사용자의 거동 패턴을 보여주는 행동 데이터입니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        다만 신원 확인 정보나 금융정보는 아닙니다. 프라이버시 침해의 수준이므로 3점입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>2. 노출범위 (2)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        카카오 T는 위치 정보를 운전자에게만 공유합니다. 불특정 다수에게 광범위하게 공개되지는 않습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제17조(제3자 제공 제한)에 해당하지만 제한된 범위입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>3. 경과시간 (2)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        카카오 T는 이용 기록을 6~12개월 정도 보관합니다. 구글이나 우버보다는 보관 기간이 짧습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제21조(보유기간의 제한)에 해당하지만, 중기 보관이므로 2점입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>4. 목적명확성 (1.0)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        카카오 T는 개인정보 처리 목적을 "택시 호출", "경로 안내", "운전자 매칭" 등으로 명확하게 표현합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제15조(이용목적의 명확화) 충족입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>5. AI위험 (1.5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        카카오 T의 AI는 경로를 최적화하고 요금을 결정합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제22조의2(자동화된 결정에 대한 권리)의 규제 대상입니다.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.withdrawalEffectContainer}>
                    <Text style={styles.withdrawalEffectTitle}>동의한 선택항목</Text>
                    <View style={styles.expectedEffectBox}>
                      <Text style={styles.expectedEffectText}>동의한 선택항목: 없음 (모든 선택동의 거부)</Text>
                      <Text style={styles.expectedEffectNote}>현재 상태가 이미 최적화되어 있습니다. 추가 철회할 항목이 없습니다.</Text>
                    </View>
                  </View>

                  <View style={styles.maxEffectContainer}>
                    <Text style={styles.maxEffectTitle}>현재 상태 평가</Text>
                    <Text style={styles.maxEffectText}>카카오 T 현재 상태:</Text>
                    <Text style={styles.maxEffectText}>데이터민감도(3), 노출범위(2), 경과시간(2), 목적명확성(1.0), AI위험(1.5) → 15.0점 <Text style={styles.maxEffectMediumText}>(보통)</Text></Text>
                    <Text style={[styles.maxEffectText, { marginTop: 8 }]}>현재 설정 유지를 권장합니다.</Text>
                  </View>
                </View>
              ) : orgName === '쿠팡' ? (
                <View style={styles.riskDetailContainer}>
                  <View style={styles.riskScoreContainerMedium}>
                    <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                    <Text style={styles.riskScoreValueMedium}>15.0점</Text>
                    <Text style={styles.riskScoreLevelMedium}>(보통)</Text>
                  </View>
                  
                  <View style={styles.riskFormulaContainer}>
                    <Text style={styles.riskFormulaTitle}>산출식</Text>
                    <Text style={styles.riskFormulaText}>
                      위험도 = 데이터민감도(3) + (노출범위(2) × 경과시간(2) × 목적명확성(1.0) × AI위험(1.5)) × 2 = 15.0
                    </Text>
                  </View>

                  <View style={styles.riskFactorsContainer}>
                    <Text style={styles.riskFactorsTitle}>분석</Text>
                    
                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>1. 데이터민감도 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        쿠팡이 수집하는 구매 이력과 결제 정보는 사용자의 소비 패턴, 구매 선호도를 보여주는 행동 데이터입니다. 이는 사용자의 생활 수준, 관심사, 건강 상태까지 추론할 수 있습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        다만 주민등록번호나 신용카드 정보(5점)처럼 직접적인 신원 확인이나 즉각적인 재정 피해를 초래하지는 않습니다. 프라이버시 침해의 수준이므로 3점입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>2. 노출범위 (2)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        쿠팡은 구매 정보를 판매자와 배송 업체에 공유합니다. 또한 국외 서버에 저장합니다. 하지만 불특정 다수에게 광범위하게 공개되지는 않습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제17조(제3자 제공 제한)에 해당하지만 제한된 범위입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>3. 경과시간 (2)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        쿠팡은 구매 기록을 6~12개월 정도 보관합니다. 배송 추적, 반품, AS 등의 목적으로 중기간 보관됩니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제21조(보유기간의 제한)에 해당하지만, 중기 보관이므로 2점입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>4. 목적명확성 (1.0)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        쿠팡은 개인정보 처리 목적을 "상품 배송", "결제 처리", "배송 추적" 등으로 명확하게 표현합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제15조(이용목적의 명확화) 충족입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>5. AI위험 (1.5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        쿠팡의 AI는 구매 기록을 분석하여 추천 상품을 자동으로 결정합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제22조의2(자동화된 결정에 대한 권리)의 규제 대상입니다.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.withdrawalEffectContainer}>
                    <Text style={styles.withdrawalEffectTitle}>동의한 선택항목과 위험도 변수의 관계</Text>
                    
                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 1: 개인정보의 국외 이전</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>노출범위</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>2</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>구매·배송 정보가 국외 서버에 저장·처리됨</Text>
                          </View>
                        </View>
                        <View style={[styles.variableTableRow, styles.variableTableLastRow]}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>경과시간</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>2</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>중기 보관됨</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectTitle}>이 항목만 철회 시 기대 효과:</Text>
                        <Text style={styles.expectedEffectText}>현재 위험도: 15.0점 (보통) → 국외 이전 중단</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 9점대 (안전)</Text>
                        <Text style={styles.expectedEffectNote}>약 6점 감소 효과가 있습니다.</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.maxEffectContainerVerySafe}>
                    <Text style={styles.maxEffectTitle}>동의 철회 시 최대 효과</Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>현재:</Text> 데이터민감도(3), 노출범위(2), 경과시간(2), 목적명확성(1.0), AI위험(1.5) → 15.0점 <Text style={styles.maxEffectMediumText}>(보통)</Text></Text>
                    <Text style={styles.maxEffectText}><Text style={styles.maxEffectBoldText}>모든 동의 철회 후:</Text> 데이터민감도(1), 노출범위(1), 경과시간(1), 목적명확성(1.0), AI위험(1.0) → 3점 <Text style={styles.maxEffectVerySafeText}>(매우 안전)</Text></Text>
                    <Text style={styles.maxEffectHighlightVerySafe}>총 12점 감소</Text>
                  </View>
                </View>
              ) : orgName === '신한은행' ? (
                <View style={styles.riskDetailContainer}>
                  <View style={styles.riskScoreContainerSafe}>
                    <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                    <Text style={styles.riskScoreValueSafe}>11.0점</Text>
                    <Text style={styles.riskScoreLevelSafe}>(안전)</Text>
                  </View>
                  
                  <View style={styles.riskFormulaContainer}>
                    <Text style={styles.riskFormulaTitle}>산출식</Text>
                    <Text style={styles.riskFormulaText}>
                      위험도 = 데이터민감도(5) + (노출범위(1) × 경과시간(3) × 목적명확성(1.0) × AI위험(1.0)) × 2 = 11.0
                    </Text>
                  </View>

                  <View style={styles.riskFactorsContainer}>
                    <Text style={styles.riskFactorsTitle}>분석</Text>
                    
                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>1. 데이터민감도 (5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        신한은행이 수집하는 금융 정보, 생체정보(지문, Face ID)는 개인정보보호법 제22조(민감정보의 처리 제한)에서 정의한 "민감정보"입니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        유출 시 신원 도용, 금전 사기, 신용 악용 등 직접적이고 즉각적인 재정 손실을 초래할 수 있습니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>2. 노출범위 (1)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        신한은행은 금융 정보를 내부에서만 처리합니다. 외부에 공개되거나 제3자에게 공유되지 않습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제17조(제3자 제공 제한)의 "제3자 제공" 대상이 아닙니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>3. 경과시간 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        은행은 금융감독 규제에 따라 거래 기록을 일정 기간(보통 5년 이상) 의무적으로 보관합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제21조(보유기간의 제한)와 관련이 있습니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>4. 목적명확성 (1.0)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        신한은행은 개인정보 처리 목적을 "계좌 개설", "금융거래", "거래 기록 관리" 등으로 명확하게 표현합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제15조(이용목적의 명확화) 충족입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>5. AI위험 (1.0)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        신한은행의 AI 활용은 제한적입니다. 사기 탐지, 본인 확인 등 보안 목적에만 제한적으로 사용됩니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제22조의2 규제 대상이 아닌 범위입니다.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.maxEffectContainer}>
                    <Text style={styles.maxEffectTitle}>현재 상태 평가</Text>
                    <Text style={styles.maxEffectText}>신한은행 현재 상태:</Text>
                    <Text style={styles.maxEffectText}>데이터민감도(5), 노출범위(1), 경과시간(3), 목적명확성(1.0), AI위험(1.0) → 11.0점 <Text style={styles.maxEffectSafeText}>(안전)</Text></Text>
                    <Text style={[styles.maxEffectText, { marginTop: 8 }]}>민감한 정보이지만 내부만 처리되어 안전합니다. 현재 설정 유지를 권장합니다.</Text>
                  </View>
                </View>
              ) : orgName === '아고다' ? (
                <View style={styles.riskDetailContainer}>
                  <View style={styles.riskScoreContainerSafe}>
                    <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                    <Text style={styles.riskScoreValueSafe}>11.0점</Text>
                    <Text style={styles.riskScoreLevelSafe}>(안전)</Text>
                  </View>
                  
                  <View style={styles.riskFormulaContainer}>
                    <Text style={styles.riskFormulaTitle}>산출식</Text>
                    <Text style={styles.riskFormulaText}>
                      위험도 = 데이터민감도(3) + (노출범위(2) × 경과시간(2) × 목적명확성(1.0) × AI위험(1.0)) × 2 = 11.0
                    </Text>
                  </View>

                  <View style={styles.riskFactorsContainer}>
                    <Text style={styles.riskFactorsTitle}>분석</Text>
                    
                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>1. 데이터민감도 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        아고다가 수집하는 여행 이력과 결제 정보는 사용자의 여행 선호도, 취향, 경제 활동을 보여주는 행동 데이터입니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        다만 신원 확인 정보나 금융정보(신용카드 번호)는 아닙니다. 프라이버시 침해의 수준이므로 3점입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>2. 노출범위 (2)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        아고다는 예약 정보를 호텔, 항공사, 결제 처리업체 등 필요한 제3자에게만 공유합니다. 불특정 다수에게 광범위하게 공개되지는 않습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제17조(제3자 제공 제한)에 해당하지만 제한된 범위입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>3. 경과시간 (2)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        아고다는 예약 기록을 6~12개월 정도 보관합니다. 예약 관리, 고객 서비스, 분쟁 해결 목적입니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제21조(보유기간의 제한)에 해당하지만, 중기 보관이므로 2점입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>4. 목적명확성 (1.0)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        아고다는 개인정보 처리 목적을 "숙박 예약", "결제 처리", "고객 서비스" 등으로 명확하게 표현합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제15조(이용목적의 명확화) 충족입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>5. AI위험 (1.0)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        아고다의 AI 활용은 가격 추천, 숙박 추천 등 제한적 수준입니다. 자동화된 거래 거부 결정 등에는 사용하지 않습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제22조의2 규제 대상이 아닌 범위입니다.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.maxEffectContainer}>
                    <Text style={styles.maxEffectTitle}>현재 상태 평가</Text>
                    <Text style={styles.maxEffectText}>아고다 현재 상태:</Text>
                    <Text style={styles.maxEffectText}>데이터민감도(3), 노출범위(2), 경과시간(2), 목적명확성(1.0), AI위험(1.0) → 11.0점 <Text style={styles.maxEffectSafeText}>(안전)</Text></Text>
                    <Text style={[styles.maxEffectText, { marginTop: 8 }]}>현재 설정이 안전합니다. 현재 설정 유지를 권장합니다.</Text>
                  </View>
                </View>
              ) : orgName === '줌' ? (
                <View style={styles.riskDetailContainer}>
                  <View style={styles.riskScoreContainerSafe}>
                    <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                    <Text style={styles.riskScoreValueSafe}>11.0점</Text>
                    <Text style={styles.riskScoreLevelSafe}>(안전)</Text>
                  </View>
                  
                  <View style={styles.riskFormulaContainer}>
                    <Text style={styles.riskFormulaTitle}>산출식</Text>
                    <Text style={styles.riskFormulaText}>
                      위험도 = 데이터민감도(3) + (노출범위(2) × 경과시간(2) × 목적명확성(1.0) × AI위험(1.0)) × 2 = 11.0
                    </Text>
                  </View>

                  <View style={styles.riskFactorsContainer}>
                    <Text style={styles.riskFactorsTitle}>분석</Text>
                    
                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>1. 데이터민감도 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        줌이 수집하는 오디오/비디오 데이터는 회의 참가자의 모습, 음성, 배경을 기록합니다. 이는 참가자의 위치, 생활 환경, 개인적 특성을 드러낼 수 있습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        다만 신원 확인 정보나 금융정보는 아닙니다. 프라이버시 침해의 수준이므로 3점입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>2. 노출범위 (2)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        줌은 화상회의 데이터를 클라우드에 저장(국외 서버)하고, 제한적으로 공유합니다. 회의 참가자와 필요한 관리자만 접근할 수 있습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제17조(제3자 제공 제한)에 해당하지만 제한된 범위입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>3. 경과시간 (2)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        줌은 녹화본을 6~12개월 정도 보관합니다. 회의 재검토, 기록 보관 목적입니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제21조(보유기간의 제한)에 해당하지만, 중기 보관이므로 2점입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>4. 목적명확성 (1.0)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        줌은 개인정보 처리 목적을 "화상회의 제공", "녹화 저장", "회의 기록" 등으로 명확하게 표현합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제15조(이용목적의 명확화) 충족입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>5. AI위험 (1.0)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        줌의 AI 활용은 자막 생성, 음성 인식 등 제한적 수준입니다. 자동화된 의사결정에는 사용하지 않습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제22조의2 규제 대상이 아닌 범위입니다.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.maxEffectContainer}>
                    <Text style={styles.maxEffectTitle}>현재 상태 평가</Text>
                    <Text style={styles.maxEffectText}>줌 현재 상태:</Text>
                    <Text style={styles.maxEffectText}>데이터민감도(3), 노출범위(2), 경과시간(2), 목적명확성(1.0), AI위험(1.0) → 11.0점 <Text style={styles.maxEffectSafeText}>(안전)</Text></Text>
                    <Text style={[styles.maxEffectText, { marginTop: 8 }]}>현재 설정이 안전합니다. 현재 설정 유지를 권장합니다.</Text>
                  </View>
                </View>
              ) : orgName === '정부24' ? (
                <View style={styles.riskDetailContainer}>
                  <View style={styles.riskScoreContainerSafe}>
                    <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                    <Text style={styles.riskScoreValueSafe}>11.0점</Text>
                    <Text style={styles.riskScoreLevelSafe}>(안전)</Text>
                  </View>
                  
                  <View style={styles.riskFormulaContainer}>
                    <Text style={styles.riskFormulaTitle}>산출식</Text>
                    <Text style={styles.riskFormulaText}>
                      위험도 = 데이터민감도(5) + (노출범위(1) × 경과시간(3) × 목적명확성(1.0) × AI위험(1.0)) × 2 = 11.0
                    </Text>
                  </View>

                  <View style={styles.riskFactorsContainer}>
                    <Text style={styles.riskFactorsTitle}>분석</Text>
                    
                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>1. 데이터민감도 (5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        정부24가 수집하는 주민등록번호, 행정정보는 개인정보보호법 제22조(민감정보의 처리 제한)에서 정의한 "민감정보"입니다. 주민등록번호는 가장 강력한 식별 정보이며, 행정정보는 소득, 재산, 신분 등을 포함합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        유출 시 신원 도용, 신용 악용 등 직접적인 피해를 초래할 수 있습니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>2. 노출범위 (1)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        정부24는 개인정보를 정부 기관 내부에서만 처리합니다. 외부에 공개되거나 제3자에게 공유되지 않습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제17조(제3자 제공 제한)의 "제3자 제공" 대상이 아닙니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>3. 경과시간 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        정부 기관은 행정 기록을 법적 보존 기간에 따라 보관합니다. 보통 3년 이상 장기 보관됩니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제21조(보유기간의 제한)와 관련이 있습니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>4. 목적명확성 (1.0)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        정부24는 개인정보 처리 목적을 "행정 서비스 제공", "민원 처리", "정책 대상 선정" 등으로 명확하게 표현합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제15조(이용목적의 명확화) 충족입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>5. AI위험 (1.0)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        정부24는 AI를 사용하지 않습니다. 행정 처리는 법적 기준에 따른 인간의 판단으로 이루어집니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제22조의2 규제 대상이 아닙니다.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.maxEffectContainer}>
                    <Text style={styles.maxEffectTitle}>현재 상태 평가</Text>
                    <Text style={styles.maxEffectText}>정부24 현재 상태:</Text>
                    <Text style={styles.maxEffectText}>데이터민감도(5), 노출범위(1), 경과시간(3), 목적명확성(1.0), AI위험(1.0) → 11.0점 <Text style={styles.maxEffectSafeText}>(안전)</Text></Text>
                    <Text style={[styles.maxEffectText, { marginTop: 8 }]}>정부 기관이므로 투명성이 높고 외부 공유가 없습니다. 정보주체의 권리도 법정으로 충분히 보호됩니다.</Text>
                    <Text style={[styles.maxEffectText, { marginTop: 4 }]}>현재 설정 유지를 권장합니다.</Text>
                  </View>
                </View>
              ) : orgName === '카카오톡' ? (
                <View style={styles.riskDetailContainer}>
                  <View style={styles.riskScoreContainer}>
                    <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                    <Text style={styles.riskScoreValue}>31.5점</Text>
                    <Text style={styles.riskScoreLevel}>(위험)</Text>
                  </View>
                  
                  <View style={styles.riskFormulaContainer}>
                    <Text style={styles.riskFormulaTitle}>산출식</Text>
                    <Text style={styles.riskFormulaText}>
                      위험도 = 데이터민감도(4) + (노출범위(3) × 경과시간(3) × 목적명확성(1.5) × AI위험(1.5)) × 2 = 31.5
                    </Text>
                  </View>

                  <View style={styles.riskFactorsContainer}>
                    <Text style={styles.riskFactorsTitle}>분석</Text>
                    
                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>1. 데이터민감도 (4)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        카카오톡이 수집하는 메시지, 프로필, 연락처, 위치정보, 배송지정보, 행태정보는 사용자의 사회 관계, 의사소통 내용, 거주지, 이동 패턴, 온라인 행동을 모두 보여주는 매우 풍부한 행동 데이터입니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        특히 행태정보 수집 동의로 인해 카카오톡 내 모든 활동(메시지 내용, 채널 구독, 클릭 등)이 추적됩니다. 이는 주민등록번호나 금융정보(5점)보다는 낮지만, 기본 메시지와 프로필(3점)보다는 한 단계 높은 수준입니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제22조(민감정보)의 한 단계 아래로, 광범위한 프라이버시 침해 수준입니다. 그래서 4점으로 평가됩니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>2. 노출범위 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        프로필 정보 제3자 제공, 위치정보 수집, 행태정보 제3자 제공 등으로 정보가 카카오 계열사, 브랜드 파트너, 광고주 등 다양한 제3자에게 광범위하게 공유됩니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제17조(제3자 제공 제한)는 데이터가 외부로 제공될 때 명확한 동의를 요구합니다. 행태정보 제3자 제공 동의로 인해 불특정 다수의 광고주가 이 정보에 접근할 수 있습니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>3. 경과시간 (3)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        위치정보 수집 동의로 인해 위치 기록이 장기간 보관되며, 행태정보도 지속적으로 수집됩니다. 개인정보보호법 제21조(보유기간의 제한 및 파기)는 불필요한 정보는 지체 없이 파기하도록 규정합니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        행태정보의 장기 보관은 사용자의 온라인 활동 전체가 기록되는 것을 의미하므로 3점입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>4. 목적명확성 (1.5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        카카오톡은 개인정보 처리 목적을 "마케팅", "맞춤형 광고", "브랜드 채널 추가" 등으로 표현합니다. 이는 개인정보보호법 제15조(이용목적의 명확화)에서 요구하는 "구체적 목적"을 충분히 명시하지 않는 포괄적 표현입니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        "맞춤형 광고"는 실제로 어떤 방식과 범위로 활용되는지 사용자가 정확히 파악하기 어렵습니다. 그래서 1.5점입니다.
                      </Text>
                    </View>

                    <View style={styles.riskFactorSection}>
                      <Text style={styles.riskFactorSectionTitle}>5. AI위험 (1.5)</Text>
                      <Text style={styles.riskFactorSectionText}>
                        카카오톡은 수집된 행태정보를 AI로 자동 분석하여 사용자의 관심사를 파악하고, 맞춤형 광고를 자동으로 결정합니다. 사용자는 자신이 어떻게 분류되었는지, 왜 특정 광고가 노출되는지 알 수 없습니다.
                      </Text>
                      <Text style={styles.riskFactorSectionText}>
                        개인정보보호법 제22조의2(자동화된 결정에 대한 권리)는 자동화된 의사결정이 개인에게 영향을 줄 경우 정보주체의 권리를 보장해야 한다고 규정합니다. 맞춤형 광고 결정은 광고 노출, 상품 추천 등에 영향을 미칩니다.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.withdrawalEffectContainer}>
                    <Text style={styles.withdrawalEffectTitle}>동의한 선택항목과 위험도 변수의 관계</Text>
                    
                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 1: 프로필정보 추가 수집 동의</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>4</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>추가 프로필 정보는 더 많은 개인 특성을 드러냄</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectText}>현재 위험도: 31.5점 (위험) → 프로필 수집 축소</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 29.5점 (위험)</Text>
                        <Text style={styles.expectedEffectNote}>약 2점 감소</Text>
                      </View>
                    </View>

                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 2: 이벤트 및 마케팅 활용 동의</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>4</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>마케팅 활용으로 인한 사용 패턴 분석</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>목적명확성</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>1.5</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>마케팅 목적이 포괄적</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectText}>현재 위험도: 31.5점 (위험) → 마케팅 분석 중단</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 29.5점 (위험)</Text>
                        <Text style={styles.expectedEffectNote}>약 2점 감소</Text>
                      </View>
                    </View>

                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 3: 위치정보 수집 및 이용 동의</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>4</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>위치 정보는 사용자의 행동 패턴을 드러냄</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>경과시간</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>장기간 위치 기록 보관</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>노출범위</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>위치 정보가 제3자에 제공됨</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectText}>현재 위험도: 31.5점 (위험) → 위치 수집 중단</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 27.5점 (위험)</Text>
                        <Text style={styles.expectedEffectNote}>약 4점 감소</Text>
                      </View>
                    </View>

                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 4: 배송지정보 수집 동의</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>4</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>배송지는 사용자의 거주지 정보를 보여줌</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectText}>현재 위험도: 31.5점 (위험) → 배송지 수집 중단</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 29.5점 (위험)</Text>
                        <Text style={styles.expectedEffectNote}>약 2점 감소</Text>
                      </View>
                    </View>

                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 5: 카카오톡 브랜드픽 채널 추가 및 소식 수신</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>노출범위</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>브랜드 채널을 통해 다양한 파트너로부터 정보 수신</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>목적명확성</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>1.5</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>채널 추가, 소식 수신 목적이 포괄적</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectText}>현재 위험도: 31.5점 (위험) → 브랜드 채널 추가 중단</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 29.5점 (위험)</Text>
                        <Text style={styles.expectedEffectNote}>약 2점 감소</Text>
                      </View>
                    </View>

                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 6: 카카오알림 채널 추가 및 광고메시지 수신</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>노출범위</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>다양한 광고주로부터 광고메시지 수신</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>목적명확성</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>1.5</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>광고 수신 목적</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectText}>현재 위험도: 31.5점 (위험) → 광고알림 채널 추가 중단</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 29.5점 (위험)</Text>
                        <Text style={styles.expectedEffectNote}>약 2점 감소</Text>
                      </View>
                    </View>

                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 7: 맞춤형 광고를 위한 행태정보 수집 및 이용 동의</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>데이터민감도</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>4</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>행태정보는 사용자의 온라인 활동 전체를 기록</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>경과시간</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>행태정보 지속적 수집 및 장기 보관</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>AI위험</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>1.5</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>행태정보를 AI로 분석하여 광고 결정</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectText}>현재 위험도: 31.5점 (위험) → 행태정보 수집 및 AI 분석 중단</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 26.5점 (위험)</Text>
                        <Text style={styles.expectedEffectNote}>약 5점 감소</Text>
                      </View>
                    </View>

                    <View style={styles.consentItemSection}>
                      <Text style={styles.consentItemTitle}>선택항목 8: 맞춤형 광고를 위한 행태정보 제3자 제공 동의</Text>
                      <View style={styles.variableTable}>
                        <View style={[styles.variableTableRow, styles.variableTableHeaderRow]}>
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>영향 변수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>점수</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableHeaderCell}>
                            <Text style={styles.variableTableHeaderText}>설명</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>노출범위</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>3</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>행태정보가 불특정 다수 광고주에 제공됨</Text>
                          </View>
                        </View>
                        <View style={styles.variableTableRow}>
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>AI위험</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>1.5</Text>
                          </View>
                          <View style={styles.withdrawalTableDivider} />
                          <View style={styles.variableTableCellContainer}>
                            <Text style={styles.variableTableCellText}>광고주의 AI가 행태정보를 이용하여 타겟팅</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.expectedEffectBox}>
                        <Text style={styles.expectedEffectText}>현재 위험도: 31.5점 (위험) → 행태정보 제3자 제공 중단</Text>
                        <Text style={styles.expectedEffectText}>예상 위험도: 약 28.5점 (위험)</Text>
                        <Text style={styles.expectedEffectNote}>약 3점 감소</Text>
                      </View>
                    </View>

                  </View>

                  <View style={styles.maxEffectContainer}>
                    <Text style={styles.maxEffectTitle}>최대 효과 (모든 동의 철회 시)</Text>
                    <Text style={styles.maxEffectText}>현재: 데이터민감도(4), 노출범위(3), 경과시간(3), 목적명확성(1.5), AI위험(1.5) → 31.5점 <Text style={styles.maxEffectDangerText}>(위험)</Text></Text>
                    <Text style={styles.maxEffectText}>모든 동의 철회 후: 데이터민감도(1), 노출범위(1), 경과시간(1), 목적명확성(1.0), AI위험(1.0) → 3점 <Text style={styles.maxEffectSafeText}>(매우 안전)</Text></Text>
                    <Text style={[styles.maxEffectText, { marginTop: 8, fontWeight: '600' }]}>총 28.5점 감소</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.placeholderContainer}>
                  <Text style={styles.placeholderText}>위험도 정보</Text>
                </View>
              )}
            </View>
          )}

          {activeTab === 'thirdParty' && (
            <View style={styles.thirdPartyContainer}>
              {(() => {
                // 기업명에 따른 흐름도 이미지 매핑
                const flowImageMap = {
                  '구글': require('../assets/icons/flow/google.png'),
                  '넷플릭스': require('../assets/icons/flow/netflix.png'),
                  '신한은행': require('../assets/icons/flow/shinhan.png'),
                  '아고다': require('../assets/icons/flow/agoda.png'),
                  '인스타그램': require('../assets/icons/flow/instagram.png'),
                  '쿠팡': require('../assets/icons/flow/coupang.png'),
                  '우버': require('../assets/icons/flow/uber.png'),
                  '세브란스병원': require('../assets/icons/flow/severance.png'),
                  '줌': require('../assets/icons/flow/zoom.png'),
                  '노션': require('../assets/icons/flow/notion.png'),
                  '다음': require('../assets/icons/flow/daum.png'),
                  '유튜브': require('../assets/icons/flow/youtube.png'),
                  '카카오톡': require('../assets/icons/flow/kakaotalk.png'),
                  '카카오T': require('../assets/icons/flow/kakaoT.png'),
                  '토스': require('../assets/icons/flow/toss.png'),
                  '페이스북': require('../assets/icons/flow/facebook.png'),
                  '구글클래스룸': require('../assets/icons/flow/classroom.png'),
                  '네이버': require('../assets/icons/flow/naver.png'),
                  '네이버밴드': require('../assets/icons/flow/naverband.png'),
                };
                
                const flowImage = flowImageMap[orgName];
                
                if (flowImage) {
                  return (
                    <View style={styles.flowImageContainer}>
                      <Image 
                        source={flowImage} 
                        style={styles.flowImage}
                        resizeMode="contain"
                      />
                    </View>
                  );
                } else {
                  return (
                    <View style={styles.placeholderContainer}>
                      <Text style={styles.placeholderText}>제3자 제공 정보</Text>
                    </View>
                  );
                }
              })()}
            </View>
          )}

          {activeTab === 'changeHistory' && (
            <View style={styles.changeHistoryContainer}>
              {changeHistory && changeHistory.map((dateGroup, index) => (
                <View key={index} style={styles.changeHistoryGroup}>
                  <Text style={styles.changeHistoryDate}>{dateGroup.date}</Text>
                  <View style={styles.changeHistoryList}>
                    {dateGroup.items.map((item) => (
                      <ChangeHistoryItem key={item.id} item={item} />
                    ))}
                  </View>
                </View>
              ))}
              {(!changeHistory || changeHistory.length === 0) && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>동의 변경 내역이 없습니다.</Text>
                </View>
              )}
            </View>
          )}

          {activeTab === 'info' && (
            <View style={styles.infoContainer}>
              {/* 기업정보 */}
              <View style={styles.companyInfoSection}>
                <Text style={styles.infoSectionTitle}>기업정보</Text>
                <View style={styles.companyInfoBox}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>서비스명</Text>
                    <Text style={styles.infoValue}>
                      {orgInfo.companyInfo?.serviceName || orgName}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>법인명</Text>
                    <Text style={styles.infoValue}>
                      {orgInfo.companyInfo?.legalName || '-'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <View style={styles.infoLabelContainer}>
                      <Text style={styles.infoLabel}>개인정보보호</Text>
                      <Text style={styles.infoLabel}>인증항목</Text>
                    </View>
                    <Text style={styles.infoValue}>
                      {orgInfo.companyInfo?.privacyCertification || '-'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>개인정보 처리 방침</Text>
                    {orgInfo.companyInfo?.privacyPolicyLink ? (
                      <TouchableOpacity
                        onPress={() => {
                          Linking.openURL(orgInfo.companyInfo.privacyPolicyLink);
                        }}
                      >
                        <Text style={styles.infoLink}>바로가기</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.infoValue}>-</Text>
                    )}
                  </View>
                </View>
              </View>

              {/* 기업 뉴스 */}
              <View style={styles.newsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.infoSectionTitle}>기업 뉴스</Text>
                  <TouchableOpacity>
                    <Text style={styles.moreLink}>더보기 &gt;</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.newsPlaceholder}>
                  <View style={styles.newsItem}>
                    <View style={styles.newsPlaceholderLine} />
                  </View>
                  <View style={styles.newsDivider} />
                </View>
              </View>

              {/* 최근 보안 사고 이력 */}
              <View style={styles.securitySection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.infoSectionTitle}>최근 보안 사고 이력</Text>
                  <TouchableOpacity>
                    <Text style={styles.moreLink}>더보기 &gt;</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.newsPlaceholder}>
                  <View style={styles.newsItem}>
                    <View style={styles.newsPlaceholderLine} />
                  </View>
                  <View style={styles.newsDivider} />
                </View>
              </View>
            </View>
          )}
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
  orgHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2, //기관명과 아이콘 사이 간격
    flex: 1,
  },
  orgLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  orgText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  orgName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B1215',
  },
  notificationIcon: {
    padding: 8,
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabScrollContent: {
    paddingHorizontal: 20,
  },
  tabItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginRight: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#00752F',
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    height: 2,
    backgroundColor: '#00752F',
    borderRadius: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  consentContainer: {
    paddingVertical: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B1215',
    marginBottom: 16,
  },
  consentList: {
    backgroundColor: '#F5F7F6',
    borderRadius: 12,
    paddingVertical: 8,
  },
  consentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  consentContent: {
    flex: 1,
  },
  consentTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0B1215',
    marginBottom: 4,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6B7280',
  },
  
  // 동의 변경 내역 스타일
  changeHistoryContainer: {
    paddingVertical: 20,
  },
  changeHistoryGroup: {
    marginBottom: 24,
  },
  changeHistoryDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B1215',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  changeHistoryList: {
    gap: 8,
  },
  changeHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F7F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  changeHistoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pendingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#E0F2F1',
  },
  changeHistoryContent: {
    flex: 1,
  },
  changeHistoryTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0B1215',
    marginBottom: 4,
    lineHeight: 20,
  },
  changeHistoryTime: {
    fontSize: 13,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
  // 정보 탭 스타일
  infoContainer: {
    paddingVertical: 20,
  },
  companyInfoSection: {
    marginBottom: 32,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B1215',
    marginBottom: 12,
  },
  companyInfoBox: {
    backgroundColor: '#F5F7F6',
    borderRadius: 12,
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoLabelContainer: {
    flex: 1,
  },
  infoDivider: {
    width: 1,
    minHeight: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  infoValue: {
    fontSize: 14,
    color: '#0B1215',
    fontWeight: '400',
    flex: 2,
    textAlign: 'right',
  },
  infoLink: {
    fontSize: 14,
    color: '#00752F',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  newsSection: {
    marginBottom: 32,
  },
  securitySection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  moreLink: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  newsPlaceholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    minHeight: 120,
  },
  newsItem: {
    paddingVertical: 16,
    minHeight: 50,
  },
  newsPlaceholderLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 8,
  },
  newsDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 0,
  },
  // 제3자 제공 탭 스타일
  thirdPartyContainer: {
    paddingVertical: 20,
    flex: 1,
  },
  flowImageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  flowImage: {
    width: '100%',
    height: '100%',
    minHeight: 400,
  },
  // 위험도 탭 스타일
  riskContainer: {
    paddingVertical: 20,
  },
  riskDetailContainer: {
    gap: 20,
  },
  riskScoreContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: HIGH_RISK_BG,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: HIGH_RISK_BORDER,
  },
  riskScoreLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  riskScoreValue: {
    fontSize: 32,
    fontWeight: '800',
    color: HIGH_RISK_PRIMARY,
    marginBottom: 4,
  },
  riskScoreLevel: {
    fontSize: 16,
    fontWeight: '600',
    color: HIGH_RISK_PRIMARY,
  },
  riskScoreContainerMedium: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FEF9C3',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#EAB308',
  },
  riskScoreValueMedium: {
    fontSize: 32,
    fontWeight: '800',
    color: '#EAB308',
    marginBottom: 4,
  },
  riskScoreLevelMedium: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EAB308',
  },
  riskScoreContainerVery: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  riskScoreValueVery: {
    fontSize: 32,
    fontWeight: '800',
    color: '#DC2626',
    marginBottom: 4,
  },
  riskScoreLevelVery: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  riskScoreContainerSafe: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  riskScoreValueSafe: {
    fontSize: 32,
    fontWeight: '800',
    color: '#10B981',
    marginBottom: 4,
  },
  riskScoreLevelSafe: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  riskFormulaContainer: {
    padding: 16,
    backgroundColor: '#F5F7F6',
    borderRadius: 12,
  },
  riskFormulaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B1215',
    marginBottom: 8,
  },
  riskFormulaText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  riskFactorsContainer: {
    padding: 16,
    backgroundColor: '#F5F7F6',
    borderRadius: 12,
    gap: 12,
  },
  riskFactorsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B1215',
    marginBottom: 8,
  },
  riskFactorItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  riskFactorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B1215',
    minWidth: 140,
  },
  riskFactorText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  riskFactorSection: {
    marginBottom: 20,
  },
  riskFactorSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B1215',
    marginBottom: 8,
  },
  riskFactorSectionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  withdrawalEffectContainer: {
    padding: 16,
    backgroundColor: '#F5F7F6',
    borderRadius: 12,
  },
  withdrawalEffectTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B1215',
    marginBottom: 12,
  },
  withdrawalTable: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  withdrawalTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'stretch',
  },
  withdrawalTableHeaderRow: {
    backgroundColor: '#F9FAFB',
  },
  withdrawalTableLastRow: {
    borderBottomWidth: 0,
  },
  withdrawalTableHeaderCell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  withdrawalTableHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B1215',
  },
  withdrawalTableDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  withdrawalTableCellContainer: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  withdrawalTableCellText: {
    fontSize: 14,
    color: '#374151',
  },
  maxEffectContainer: {
    padding: 16,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  maxEffectTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B1215',
    marginBottom: 12,
  },
  maxEffectText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  maxEffectBoldText: {
    fontWeight: '700',
  },
  maxEffectHighlight: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10B981',
    marginTop: 8,
  },
  maxEffectContainerVerySafe: {
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  maxEffectVerySafeText: {
    color: '#3B82F6',
    fontWeight: '700',
  },
  maxEffectSafeText: {
    color: '#10B981',
    fontWeight: '700',
  },
  maxEffectVeryText: {
    color: '#DC2626',
    fontWeight: '700',
  },
  maxEffectHighText: {
    color: HIGH_RISK_PRIMARY,
    fontWeight: '700',
  },
  maxEffectDangerText: {
    color: '#DC2626',
    fontWeight: '700',
  },
  maxEffectMediumText: {
    color: '#EAB308',
    fontWeight: '700',
  },
  maxEffectHighlightVerySafe: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3B82F6',
    marginTop: 8,
  },
  consentItemSection: {
    marginBottom: 24,
  },
  consentItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B1215',
    marginBottom: 12,
  },
  variableTable: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  variableTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'stretch',
  },
  variableTableHeaderRow: {
    backgroundColor: '#F9FAFB',
  },
  variableTableLastRow: {
    borderBottomWidth: 0,
  },
  variableTableHeaderCell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  variableTableHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B1215',
  },
  variableTableCellContainer: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  variableTableCellText: {
    fontSize: 14,
    color: '#374151',
  },
  expectedEffectBox: {
    backgroundColor: '#F5F7F6',
    borderRadius: 8,
    padding: 12,
  },
  expectedEffectTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B1215',
    marginBottom: 8,
  },
  expectedEffectText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 4,
  },
  expectedEffectNote: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 4,
  },
});
