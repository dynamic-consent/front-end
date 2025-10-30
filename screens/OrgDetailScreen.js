import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  Switch,
  Image
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

// 기관별 샘플 데이터 - 각 앱마다 다른 동의 세부사항
const orgData = {
  '토스': {
    logoText: '토스',
    logoStyle: { borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '광고성 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 2, title: '마케팅 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 3, title: '개인정보 수집/이용동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '금융거래약관', termsLink: '약관보기' }
    ],
    changeHistory: [
      {
        date: '8월 20일',
        items: [
          {
            id: 1,
            title: '위치기반 서비스 이용약관 동의',
            time: '10:22',
            status: 'approved', // 'approved' 또는 'rejected'
            type: 'location'
          },
          {
            id: 2,
            title: '광고성 정보 수집 동의',
            time: '09:14',
            status: 'rejected',
            type: 'advertising'
          }
        ]
      }
    ]
  },
  '우리은행': {
    logoText: '우리',
    logoStyle: { backgroundColor: '#1E88E5', borderRadius: 20 },
    optionalConsents: [
      { id: 1, title: '마케팅 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 2, title: '투자상품 안내 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '은행서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '금융거래약관', termsLink: '약관보기' },
      { id: 4, title: '전자금융거래약관', termsLink: '약관보기' }
    ]
  },
  '신한은행': {
    logoText: '신한',
    logoStyle: { backgroundColor: '#1E88E5', borderRadius: 4 },
    optionalConsents: [
      { id: 1, title: '마케팅 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 2, title: '신용정보 조회 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '은행서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '금융거래약관', termsLink: '약관보기' }
    ]
  },
  '하나은행': {
    logoText: '하나',
    logoStyle: { backgroundColor: '#4CAF50', borderRadius: 4 },
    optionalConsents: [
      { id: 1, title: '마케팅 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 2, title: '보험상품 안내 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '은행서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '금융거래약관', termsLink: '약관보기' }
    ]
  },
  '쿠팡': {
    logoText: '쿠팡',
    logoStyle: { backgroundColor: '#FF6B35', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '이벤트/혜택 알림', termsLink: '약관보기', enabled: false },
      { id: 2, title: '쿠팡플레이 추천 동의', termsLink: '약관보기', enabled: false },
      { id: 3, title: '개인화 추천 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '전자상거래약관', termsLink: '약관보기' }
    ]
  },
  '11번가': {
    logoText: '11',
    logoStyle: { backgroundColor: '#FF6B35', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '이벤트/혜택 알림', termsLink: '약관보기', enabled: false },
      { id: 2, title: '11번가페이 서비스 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '전자상거래약관', termsLink: '약관보기' }
    ]
  },
  'G마켓': {
    logoText: 'G',
    logoStyle: { backgroundColor: '#FF6B35', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '이벤트/혜택 알림', termsLink: '약관보기', enabled: false },
      { id: 2, title: 'G9 서비스 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '전자상거래약관', termsLink: '약관보기' }
    ]
  },
  '카카오택시': {
    logoText: '택시',
    logoStyle: { backgroundColor: '#FEE500', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '위치 정보 수집 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '카카오페이 결제 동의', termsLink: '약관보기', enabled: true },
      { id: 3, title: '운전자 평가 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '위치정보 이용약관', termsLink: '약관보기' }
    ]
  },
  '카카오톡': {
    logoText: '톡',
    logoStyle: { backgroundColor: '#FEE500', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '친구 추천 동의', termsLink: '약관보기', enabled: false },
      { id: 2, title: '연락처 동기화 동의', termsLink: '약관보기', enabled: false },
      { id: 3, title: '카카오스토리 연동 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '카카오계정 약관', termsLink: '약관보기' }
    ]
  },
  '넷플릭스': {
    logoText: 'N',
    logoStyle: { backgroundColor: '#E50914', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '추천 콘텐츠 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '시청 기록 공유 동의', termsLink: '약관보기', enabled: false },
      { id: 3, title: '마케팅 이메일 수신 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '구독 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '서울대병원': {
    logoText: '서울',
    logoStyle: { backgroundColor: '#E91E63', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '건강정보 수집 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '진료 예약 알림 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '의료서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '의료정보 보호약관', termsLink: '약관보기' }
    ]
  },
  '정부24': {
    logoText: '정부',
    logoStyle: { backgroundColor: '#2196F3', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '정책 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 2, title: '민원 처리 알림 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '정부24 서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '전자정부 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '아고다': {
    logoText: 'A',
    logoStyle: { backgroundColor: '#FFC107', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '여행 추천 알림 동의', termsLink: '약관보기', enabled: false },
      { id: 2, title: '특가 정보 수신 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '예약 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '야놀자': {
    logoText: '야놀',
    logoStyle: { backgroundColor: '#FF5722', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '여행 추천 알림 동의', termsLink: '약관보기', enabled: false },
      { id: 2, title: '특가 정보 수신 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '예약 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '여기어때': {
    logoText: '여기',
    logoStyle: { backgroundColor: '#FF9800', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '여행 추천 알림 동의', termsLink: '약관보기', enabled: false },
      { id: 2, title: '특가 정보 수신 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '예약 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '부킹닷컴': {
    logoText: 'B',
    logoStyle: { backgroundColor: '#FFEB3B', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '여행 추천 알림 동의', termsLink: '약관보기', enabled: false },
      { id: 2, title: '특가 정보 수신 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '예약 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '옥션': {
    logoText: '옥션',
    logoStyle: { backgroundColor: '#FFEB3B', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '이벤트/혜택 알림', termsLink: '약관보기', enabled: false },
      { id: 2, title: '옥션페이 서비스 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '전자상거래약관', termsLink: '약관보기' }
    ]
  },
  '우버': {
    logoText: 'U',
    logoStyle: { backgroundColor: '#000000', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '위치 정보 수집 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '운전자 평가 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '위치정보 이용약관', termsLink: '약관보기' }
    ]
  },
  '티머니': {
    logoText: 'T',
    logoStyle: { backgroundColor: '#607D8B', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '위치 정보 수집 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '교통 정보 알림 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '교통카드 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '한국철도공사': {
    logoText: 'KORAIL',
    logoStyle: { backgroundColor: '#795548', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '열차 운행 정보 알림', termsLink: '약관보기', enabled: true },
      { id: 2, title: '할인 정보 수신 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '철도 서비스 약관', termsLink: '약관보기' }
    ]
  },
  // 의료 기관들
  '삼성서울병원': {
    logoText: '삼성',
    logoStyle: { backgroundColor: '#9C27B0', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '건강정보 수집 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '진료 예약 알림 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '의료서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '의료정보 보호약관', termsLink: '약관보기' }
    ]
  },
  '세브란스병원': {
    logoText: '세브',
    logoStyle: { backgroundColor: '#673AB7', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '건강정보 수집 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '진료 예약 알림 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '의료서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '의료정보 보호약관', termsLink: '약관보기' }
    ]
  },
  '강남성심병원': {
    logoText: '성심',
    logoStyle: { backgroundColor: '#3F51B5', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '건강정보 수집 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '진료 예약 알림 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '의료서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '의료정보 보호약관', termsLink: '약관보기' }
    ]
  },
  // 행정 기관들
  '국세청': {
    logoText: '국세',
    logoStyle: { backgroundColor: '#00BCD4', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '세무 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 2, title: '민원 처리 알림 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '국세청 서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '전자정부 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '건강보험공단': {
    logoText: '건보',
    logoStyle: { backgroundColor: '#009688', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '보험 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 2, title: '민원 처리 알림 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '건강보험공단 서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '전자정부 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '국민연금공단': {
    logoText: '국민',
    logoStyle: { backgroundColor: '#4CAF50', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '연금 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 2, title: '민원 처리 알림 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '국민연금공단 서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '전자정부 서비스 약관', termsLink: '약관보기' }
    ]
  },
  // SNS 기관들
  '네이버밴드': {
    logoText: '밴드',
    logoStyle: { backgroundColor: '#4CAF50', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '친구 추천 동의', termsLink: '약관보기', enabled: false },
      { id: 2, title: '연락처 동기화 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '네이버계정 약관', termsLink: '약관보기' }
    ]
  },
  '인스타그램': {
    logoText: 'IG',
    logoStyle: { backgroundColor: '#E91E63', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '친구 추천 동의', termsLink: '약관보기', enabled: false },
      { id: 2, title: '연락처 동기화 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '메타계정 약관', termsLink: '약관보기' }
    ]
  },
  '페이스북': {
    logoText: 'FB',
    logoStyle: { backgroundColor: '#2196F3', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '친구 추천 동의', termsLink: '약관보기', enabled: false },
      { id: 2, title: '연락처 동기화 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '메타계정 약관', termsLink: '약관보기' }
    ]
  },
  // 교육/업무 기관들
  '구글클래스룸': {
    logoText: 'G',
    logoStyle: { backgroundColor: '#4285F4', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '학습 데이터 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '과제 알림 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '구글계정 약관', termsLink: '약관보기' }
    ]
  },
  '줌': {
    logoText: 'Z',
    logoStyle: { backgroundColor: '#2D8CFF', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '회의 녹화 동의', termsLink: '약관보기', enabled: false },
      { id: 2, title: '회의 알림 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '화상회의 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '슬랙': {
    logoText: 'S',
    logoStyle: { backgroundColor: '#4A154B', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '메시지 알림 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '상태 업데이트 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '업무 협업 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '노션': {
    logoText: 'N',
    logoStyle: { backgroundColor: '#000000', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '문서 공유 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '업데이트 알림 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '생산성 도구 서비스 약관', termsLink: '약관보기' }
    ]
  },
  // 취미 기관들
  '왓챠': {
    logoText: 'W',
    logoStyle: { backgroundColor: '#FF6B35', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '추천 콘텐츠 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '시청 기록 공유 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '구독 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '디즈니플러스': {
    logoText: 'D',
    logoStyle: { backgroundColor: '#113CCF', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '추천 콘텐츠 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '시청 기록 공유 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '구독 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '유튜브': {
    logoText: 'Y',
    logoStyle: { backgroundColor: '#FF0000', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '추천 콘텐츠 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '시청 기록 공유 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '구글계정 약관', termsLink: '약관보기' }
    ]
  },
  // 기타 기관들
  '구글': {
    logoText: 'G',
    logoStyle: { backgroundColor: '#4285F4', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '검색 기록 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '개인화 서비스 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '구글계정 약관', termsLink: '약관보기' }
    ]
  },
  '네이버': {
    logoText: 'N',
    logoStyle: { backgroundColor: '#03C75A', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '검색 기록 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '개인화 서비스 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '네이버계정 약관', termsLink: '약관보기' }
    ]
  },
  '다음': {
    logoText: 'D',
    logoStyle: { backgroundColor: '#FF6B35', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '검색 기록 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '개인화 서비스 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '카카오계정 약관', termsLink: '약관보기' }
    ]
  },
  'T멤버쉽': {
    logoText: 'T',
    logoStyle: { backgroundColor: '#00BCF2', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '서비스 개선 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '마케팅 정보 수신 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: 'T멤버쉽 약관', termsLink: '약관보기' }
    ]
  },
  
  // SNS 기관들
  '카카오톡': {
    logoText: '카카오톡',
    logoStyle: { backgroundColor: '#FEE500', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '친구 추천 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '광고성 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 3, title: '위치 정보 수집 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '카카오계정 약관', termsLink: '약관보기' }
    ],
    changeHistory: [
      {
        date: '8월 15일',
        items: [
          {
            id: 1,
            title: '친구 추천 서비스 동의',
            time: '14:30',
            status: 'approved',
            type: 'friend'
          }
        ]
      }
    ]
  },
  '네이버밴드': {
    logoText: '밴드',
    logoStyle: { backgroundColor: '#00C73C', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '그룹 추천 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '활동 알림 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '네이버계정 약관', termsLink: '약관보기' }
    ]
  },
  '인스타그램': {
    logoText: '인스타',
    logoStyle: { backgroundColor: '#E4405F', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '스토리 추천 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '광고성 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 3, title: '위치 정보 수집 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '페이스북계정 약관', termsLink: '약관보기' }
    ]
  },
  '페이스북': {
    logoText: '페이스북',
    logoStyle: { backgroundColor: '#1877F2', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '친구 추천 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '광고성 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 3, title: '위치 정보 수집 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '페이스북계정 약관', termsLink: '약관보기' }
    ]
  },
  
  // 여행 기관들
  '야놀자': {
    logoText: '야놀자',
    logoStyle: { backgroundColor: '#FF6B35', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '위치 기반 숙소 추천 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '마케팅 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 3, title: '리뷰 작성 알림 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '예약 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '여기어때': {
    logoText: '여기어때',
    logoStyle: { backgroundColor: '#00C73C', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '개인화 추천 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '광고성 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 3, title: '위치 정보 수집 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '예약 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '아고다': {
    logoText: '아고다',
    logoStyle: { backgroundColor: '#E53E3E', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '다국어 서비스 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '마케팅 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 3, title: '위치 정보 수집 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '국제 예약 약관', termsLink: '약관보기' }
    ]
  },
  '부킹닷컴': {
    logoText: '부킹',
    logoStyle: { backgroundColor: '#003580', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '다국어 서비스 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '마케팅 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 3, title: '위치 정보 수집 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '국제 예약 약관', termsLink: '약관보기' }
    ]
  },
  
  // 교육/업무 기관들
  '구글클래스룸': {
    logoText: '클래스룸',
    logoStyle: { backgroundColor: '#4285F4', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '학습 진도 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '알림 수신 동의', termsLink: '약관보기', enabled: true },
      { id: 3, title: '과제 제출 알림 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '구글계정 약관', termsLink: '약관보기' }
    ]
  },
  '줌': {
    logoText: '줌',
    logoStyle: { backgroundColor: '#2D8CFF', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '회의 녹화 동의', termsLink: '약관보기', enabled: false },
      { id: 2, title: '화면 공유 알림 동의', termsLink: '약관보기', enabled: true },
      { id: 3, title: '참석자 정보 수집 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '화상회의 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '슬랙': {
    logoText: '슬랙',
    logoStyle: { backgroundColor: '#4A154B', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '메시지 알림 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '상태 업데이트 동의', termsLink: '약관보기', enabled: true },
      { id: 3, title: '파일 공유 알림 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '팀 협업 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '노션': {
    logoText: '노션',
    logoStyle: { backgroundColor: '#000000', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '문서 공유 알림 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '협업 초대 알림 동의', termsLink: '약관보기', enabled: true },
      { id: 3, title: '버전 관리 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '워크스페이스 약관', termsLink: '약관보기' }
    ]
  },
  
  // 취미 기관들
  '넷플릭스': {
    logoText: '넷플릭스',
    logoStyle: { backgroundColor: '#E50914', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '시청 기록 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '개인화 추천 동의', termsLink: '약관보기', enabled: true },
      { id: 3, title: '시청 통계 공유 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '구독 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '왓챠': {
    logoText: '왓챠',
    logoStyle: { backgroundColor: '#FF6B35', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '시청 기록 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '개인화 추천 동의', termsLink: '약관보기', enabled: true },
      { id: 3, title: '리뷰 작성 알림 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '구독 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '디즈니플러스': {
    logoText: '디즈니+',
    logoStyle: { backgroundColor: '#113CCF', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '시청 기록 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '개인화 추천 동의', termsLink: '약관보기', enabled: true },
      { id: 3, title: '시청 통계 공유 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '구독 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '유튜브': {
    logoText: '유튜브',
    logoStyle: { backgroundColor: '#FF0000', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '시청 기록 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '개인화 추천 동의', termsLink: '약관보기', enabled: true },
      { id: 3, title: '광고성 정보 수신 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '구글계정 약관', termsLink: '약관보기' }
    ]
  },
  
  // 쇼핑 기관들
  '쿠팡': {
    logoText: '쿠팡',
    logoStyle: { backgroundColor: '#FF6B00', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '개인화 상품 추천 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '마케팅 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 3, title: '위치 기반 배송 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '구매/배송 약관', termsLink: '약관보기' }
    ]
  },
  '11번가': {
    logoText: '11번가',
    logoStyle: { backgroundColor: '#FF6600', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '개인화 상품 추천 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '마케팅 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 3, title: '위치 기반 배송 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '구매/배송 약관', termsLink: '약관보기' }
    ]
  },
  'G마켓': {
    logoText: 'G마켓',
    logoStyle: { backgroundColor: '#FF6600', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '개인화 상품 추천 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '마케팅 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 3, title: '위치 기반 배송 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '구매/배송 약관', termsLink: '약관보기' }
    ]
  },
  '옥션': {
    logoText: '옥션',
    logoStyle: { backgroundColor: '#FF6600', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '개인화 상품 추천 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '마케팅 정보 수신 동의', termsLink: '약관보기', enabled: false },
      { id: 3, title: '위치 기반 배송 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '구매/배송 약관', termsLink: '약관보기' }
    ]
  },
  
  // 교통 기관들
  '카카오T': {
    logoText: '카카오T',
    logoStyle: { backgroundColor: '#FEE500', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '위치 기반 서비스 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '이용 기록 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 3, title: '마케팅 정보 수신 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '카카오계정 약관', termsLink: '약관보기' }
    ]
  },
  '우버': {
    logoText: '우버',
    logoStyle: { backgroundColor: '#000000', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '위치 기반 서비스 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '이용 기록 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 3, title: '마케팅 정보 수신 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '국제 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '티머니': {
    logoText: '티머니',
    logoStyle: { backgroundColor: '#00A651', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '이용 기록 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '충전 알림 동의', termsLink: '약관보기', enabled: true },
      { id: 3, title: '마케팅 정보 수신 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '교통카드 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '한국철도공사': {
    logoText: '코레일',
    logoStyle: { backgroundColor: '#003876', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '이용 기록 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '예약 알림 동의', termsLink: '약관보기', enabled: true },
      { id: 3, title: '마케팅 정보 수신 동의', termsLink: '약관보기', enabled: false }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '철도 서비스 약관', termsLink: '약관보기' }
    ]
  },
  
  // 행정 기관들
  '정부24': {
    logoText: '정부24',
    logoStyle: { backgroundColor: '#004EA2', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '서비스 이용 기록 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '알림 수신 동의', termsLink: '약관보기', enabled: true },
      { id: 3, title: '개인화 서비스 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '정부 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '국세청': {
    logoText: '국세청',
    logoStyle: { backgroundColor: '#E31E24', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '세무 서비스 이용 기록 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '세무 알림 동의', termsLink: '약관보기', enabled: true },
      { id: 3, title: '개인화 서비스 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '세무 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '건강보험공단': {
    logoText: '건보공단',
    logoStyle: { backgroundColor: '#00A651', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '건강 서비스 이용 기록 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '건강 알림 동의', termsLink: '약관보기', enabled: true },
      { id: 3, title: '개인화 서비스 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '건강보험 서비스 약관', termsLink: '약관보기' }
    ]
  },
  '국민연금공단': {
    logoText: '국민연금',
    logoStyle: { backgroundColor: '#FF6B00', borderRadius: 8 },
    optionalConsents: [
      { id: 1, title: '연금 서비스 이용 기록 분석 동의', termsLink: '약관보기', enabled: true },
      { id: 2, title: '연금 알림 동의', termsLink: '약관보기', enabled: true },
      { id: 3, title: '개인화 서비스 동의', termsLink: '약관보기', enabled: true }
    ],
    requiredConsents: [
      { id: 1, title: '서비스 이용약관', termsLink: '약관보기' },
      { id: 2, title: '개인정보 수집/이용', termsLink: '약관보기' },
      { id: 3, title: '국민연금 서비스 약관', termsLink: '약관보기' }
    ]
  }
  // 다른 기관들도 여기에 추가 가능
};

// 동의 변경 내역 아이템 컴포넌트
function ChangeHistoryItem({ item }) {
  return (
    <TouchableOpacity style={styles.changeHistoryItem} activeOpacity={0.7}>
      <View style={styles.changeHistoryLeft}>
        <View style={[
          styles.statusIcon,
          { backgroundColor: item.status === 'approved' ? '#10B981' : '#EF4444' }
        ]}>
          <Ionicons 
            name={item.status === 'approved' ? 'checkmark' : 'close'} 
            size={16} 
            color="#FFFFFF" 
          />
        </View>
        <View style={styles.changeHistoryContent}>
          <Text style={styles.changeHistoryTitle}>{item.title}</Text>
          <Text style={styles.changeHistoryTime}>{item.time}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

function ConsentItem({ item, isRequired = false, orgName }) {
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
  };

  return (
    <View style={styles.consentItem}>
      <View style={styles.consentContent}>
        <Text style={styles.consentTitle}>{item.title}</Text>
        <TouchableOpacity>
          <Text style={styles.termsLink}>{item.termsLink}</Text>
        </TouchableOpacity>
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
  const [activeTab, setActiveTab] = useState('consent');
  const { orgName } = route.params || { orgName: '토스' };
  const orgInfo = orgData[orgName] || orgData['토스']; // 기본값으로 토스 사용
  const iconInfo = getOrgIconInfo(orgName);

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
          
          <TouchableOpacity style={styles.notificationIcon}>
            <BellIcon width={24} height={24} />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
            {tabs.map((tab) => (
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
                    <ConsentItem key={item.id} item={item} orgName={orgName} />
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
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>위험도 정보</Text>
            </View>
          )}

          {activeTab === 'thirdParty' && (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>제3자 제공 정보</Text>
            </View>
          )}

          {activeTab === 'changeHistory' && (
            <View style={styles.changeHistoryContainer}>
              {orgInfo.changeHistory && orgInfo.changeHistory.map((dateGroup, index) => (
                <View key={index} style={styles.changeHistoryGroup}>
                  <Text style={styles.changeHistoryDate}>{dateGroup.date}</Text>
                  <View style={styles.changeHistoryList}>
                    {dateGroup.items.map((item) => (
                      <ChangeHistoryItem key={item.id} item={item} />
                    ))}
                  </View>
                </View>
              ))}
              {(!orgInfo.changeHistory || orgInfo.changeHistory.length === 0) && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>동의 변경 내역이 없습니다.</Text>
                </View>
              )}
            </View>
          )}

          {activeTab === 'info' && (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>정보</Text>
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
    marginRight: 24,
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
  termsLink: {
    fontSize: 13,
    color: '#00752F',
    textDecorationLine: 'underline',
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
});
