// 기관별 아이콘 매핑 (react-native-svg 직접 구현 방식)
import React from 'react';
import { Image } from 'react-native';
import Svg, { Path, Circle, Rect, G, Defs, Pattern, Image as SvgImage } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

// 주요 기관 아이콘들 (PNG 이미지 사용)
const TossIcon = ({ width = 24, height = 24 }) => (
  <Image 
    source={require('../assets/icons/organizations/toss.png')} 
    style={{ width, height }} 
    resizeMode="contain"
  />
);

const WooriIcon = ({ width = 24, height = 24 }) => (
  <Image 
    source={require('../assets/icons/organizations/woori.png')} 
    style={{ width, height }} 
    resizeMode="contain"
  />
);

const ShinhanIcon = ({ width = 24, height = 24 }) => (
  <Image 
    source={require('../assets/icons/organizations/shinhan.png')} 
    style={{ width, height }} 
    resizeMode="contain"
  />
);

const HanaIcon = ({ width = 24, height = 24 }) => (
  <Image 
    source={require('../assets/icons/organizations/hana.png')} 
    style={{ width, height }} 
    resizeMode="contain"
  />
);

// 카테고리별 아이콘 매핑 (실제 SVG 디자인을 react-native-svg로 구현)
const FinanceCategoryIcon = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 37 28" fill="none">
    <Path d="M26.4976 1.80648L2.83023 13.1428C2.14356 13.4717 1.8601 14.2816 2.19708 14.9518L6.4107 23.3316C6.74768 24.0018 7.57751 24.2784 8.26418 23.9495L31.9315 12.6133C32.6182 12.2844 32.9017 11.4744 32.5647 10.8043L28.3511 2.42443C28.0141 1.75424 27.1842 1.47758 26.4976 1.80648Z" fill="#F5F7F6" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M33.9973 8.55469H7.30001C6.53511 8.55469 5.91504 9.15988 5.91504 9.90642V25.3721C5.91504 26.1186 6.53511 26.7238 7.30001 26.7238H33.9973C34.7622 26.7238 35.3822 26.1186 35.3822 25.3721V9.90642C35.3822 9.15988 34.7622 8.55469 33.9973 8.55469Z" fill="#F5F7F6" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M6.08691 11.9326H35.3202" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M5.94727 15.1738H35.321" stroke="#00752F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16.6572 19.375H32.5605" stroke="#00752F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16.6572 22.4629H32.5605" stroke="#00752F" strokeWidth="1.5" strokeDasharray="4 4"/>
    <Path d="M12.9376 18.584H10.04C9.50178 18.584 9.06543 19.0099 9.06543 19.5352V22.3632C9.06543 22.8886 9.50178 23.3144 10.04 23.3144H12.9376C13.4759 23.3144 13.9122 22.8886 13.9122 22.3632V19.5352C13.9122 19.0099 13.4759 18.584 12.9376 18.584Z" fill="#00752F"/>
  </Svg>
);

const EduCategoryIcon = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 34 34" fill="none">
    <Path d="M16.9997 11.3313C16.9997 11.3313 7.77601 3.53251 1.02734 5.53198V25.8301C1.02734 25.8301 11.3264 25.7786 17.0003 30.0282C22.6743 25.7786 32.9733 25.8301 32.9733 25.8301V5.53198C26.2246 3.53251 17.0003 11.3313 17.0003 11.3313H16.9997Z" fill="#F5F7F6" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16.9244 7.5319C16.9244 7.5319 10.1757 2.28253 4.87598 4.53209V22.7792C4.87598 22.7792 12.5746 22.5795 16.9244 26.7284C21.2736 22.5789 28.9728 22.7792 28.9728 22.7792V4.53209C23.6736 2.28253 16.9244 7.5319 16.9244 7.5319Z" fill="#F5F7F6" stroke="#00752F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M14.8966 11.0639C14.8966 11.0639 11.7541 8.16722 7.1416 8.46708Z" fill="#F5F7F6"/>
    <Path d="M14.8966 11.0639C14.8966 11.0639 11.7541 8.16722 7.1416 8.46708" stroke="#00752F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M18.7578 11.0639C18.7578 11.0639 21.9004 8.16722 26.5128 8.46708Z" fill="#F5F7F6"/>
    <Path d="M18.7578 11.0639C18.7578 11.0639 21.9004 8.16722 26.5128 8.46708" stroke="#00752F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M18.7578 13.9428C18.7578 13.9428 21.9004 11.0461 26.5128 11.346Z" fill="#F5F7F6"/>
    <Path d="M18.7578 13.9428C18.7578 13.9428 21.9004 11.0461 26.5128 11.346" stroke="#00752F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M18.7578 16.8227C18.7578 16.8227 21.9004 13.926 26.5128 14.2259Z" fill="#F5F7F6"/>
    <Path d="M18.7578 16.8227C18.7578 16.8227 21.9004 13.926 26.5128 14.2259" stroke="#00752F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M18.7578 19.7006C18.7578 19.7006 21.9004 16.8039 26.5128 17.1038Z" fill="#F5F7F6"/>
    <Path d="M18.7578 19.7006C18.7578 19.7006 21.9004 16.8039 26.5128 17.1038" stroke="#00752F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M7.3877 11.3315C7.3877 11.3315 10.2466 11.154 12.1201 12.6868Z" fill="#F5F7F6"/>
    <Path d="M7.3877 11.3315C7.3877 11.3315 10.2466 11.154 12.1201 12.6868" stroke="#00752F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16.9248 7.53223V22.3909" stroke="#00752F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const MedicalCategoryIcon = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 33 33" fill="none">
    <Path d="M30.6802 14.3185C32.6494 8.01864 28.37 3.66699 24.5329 3.66699C18.3052 3.66699 17.1247 9.53438 17.088 9.72531C17.0514 9.5338 15.8709 3.66699 9.64319 3.66699C5.81716 3.66699 1.55166 7.99303 3.47836 14.2632" fill="#F5F7F6"/>
    <Path d="M30.6802 14.3185C32.6494 8.01864 28.37 3.66699 24.5329 3.66699C18.3052 3.66699 17.1247 9.53438 17.088 9.72531C17.0514 9.5338 15.8709 3.66699 9.64319 3.66699C5.81716 3.66699 1.55166 7.99303 3.47836 14.2632" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M5 19.8912C7.1019 23.1049 10.8092 26.6393 16.7854 30.2569V30.2581C16.7854 30.2581 16.786 30.2581 16.7866 30.2581C16.7866 30.2581 16.7872 30.2581 16.7878 30.2581V30.2569C22.8205 26.6049 26.5417 23.0379 28.6325 19.7998" fill="#F5F7F6"/>
    <Path d="M5 19.8912C7.1019 23.1049 10.8092 26.6393 16.7854 30.2569V30.2581C16.7854 30.2581 16.786 30.2581 16.7866 30.2581C16.7866 30.2581 16.7872 30.2581 16.7878 30.2581V30.2569C22.8205 26.6049 26.5417 23.0379 28.6325 19.7998" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M1.82715 16.8467H8.9012L10.4466 12.5667L12.8838 21.0674L15.7674 15.6575L17.1941 18.0353L20.0772 10.3076L22.6628 21.9888L24.6547 16.8467H31.9662" stroke="#00752F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Ionicons 아이콘 생성 함수
const createIconComponent = (iconName) => ({ width = 24, height = 24 }) => (
  <Ionicons name={iconName} size={width} color="#00752F" />
);

// SVG 컴포넌트를 직접 사용하는 함수
const createSvgIconComponent = (SvgComponent) => ({ width = 24, height = 24 }) => (
  <SvgComponent width={width} height={height} />
);

const orgIconMap = {
  // 금융 (직접 구현한 SVG 컴포넌트 사용)
  '토스': TossIcon,
  '우리은행': WooriIcon,
  '신한은행': ShinhanIcon,
  '하나은행': HanaIcon,
  
  // 의료 (간단한 아이콘으로 구현)
  '서울대병원': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/snuh.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  '삼성서울병원': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/smc.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  '세브란스병원': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/severance.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  '서울성모병원': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/catholic.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  
  // 행정
  '정부24': ({ width = 24, height = 24 }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="16" rx="2" fill="#00752F"/>
      <Path d="M8 8h8M8 12h8M8 16h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </Svg>
  ),
  '국세청 홈택스': ({ width = 24, height = 24 }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill="#00752F"/>
      <Path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <Path d="M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),
  '건강보험공단': ({ width = 24, height = 24 }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="8" width="16" height="8" rx="2" fill="#00752F"/>
      <Path d="M8 12h8M8 16h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <Circle cx="12" cy="6" r="2" fill="#00752F"/>
    </Svg>
  ),
  '내 곁에 국민연금': ({ width = 24, height = 24 }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill="#00752F"/>
      <Path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <Path d="M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <Circle cx="12" cy="12" r="2" fill="white"/>
    </Svg>
  ),
  
  // 쇼핑
  '쿠팡': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/coupang.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  '11번가': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/11st.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  'G마켓': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/gmarket.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  '옥션': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/auction.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  
  // 교통
  '카카오T': ({ width = 24, height = 24 }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill="#00752F"/>
      <Path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <Circle cx="12" cy="12" r="2" fill="white"/>
    </Svg>
  ),
  '우버': ({ width = 24, height = 24 }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="8" width="16" height="8" rx="2" fill="#00752F"/>
      <Path d="M8 12h8M8 16h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <Circle cx="8" cy="6" r="2" fill="#00752F"/>
      <Circle cx="16" cy="6" r="2" fill="#00752F"/>
    </Svg>
  ),
  '티머니': ({ width = 24, height = 24 }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="18" height="12" rx="2" fill="#00752F"/>
      <Path d="M8 10h8M8 14h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <Path d="M12 4v2" stroke="#00752F" strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),
  '한국철도공사': ({ width = 24, height = 24 }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="8" width="20" height="8" rx="2" fill="#00752F"/>
      <Path d="M6 12h12M6 16h8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <Circle cx="6" cy="6" r="2" fill="#00752F"/>
      <Circle cx="18" cy="6" r="2" fill="#00752F"/>
    </Svg>
  ),
  
  // SNS
  '카카오톡': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/kakaotalk.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  '네이버밴드': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/naverband.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  '인스타그램': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/instagram.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  '페이스북': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/facebook.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  
  // 여행
  '야놀자': ({ width = 24, height = 24 }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="18" height="12" rx="2" fill="#00752F"/>
      <Path d="M8 10h8M8 14h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <Path d="M12 4v2" stroke="#00752F" strokeWidth="2" strokeLinecap="round"/>
      <Circle cx="12" cy="18" r="2" fill="#00752F"/>
    </Svg>
  ),
  '여기어때': ({ width = 24, height = 24 }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill="#00752F"/>
      <Path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <Path d="M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <Circle cx="12" cy="12" r="2" fill="white"/>
    </Svg>
  ),
  '아고다': ({ width = 24, height = 24 }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="8" width="16" height="8" rx="2" fill="#00752F"/>
      <Path d="M8 12h8M8 16h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <Path d="M12 4v4" stroke="#00752F" strokeWidth="2" strokeLinecap="round"/>
      <Circle cx="12" cy="6" r="2" fill="#00752F"/>
    </Svg>
  ),
  '부킹닷컴': ({ width = 24, height = 24 }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="18" height="12" rx="2" fill="#00752F"/>
      <Path d="M8 10h8M8 14h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <Path d="M12 4v2" stroke="#00752F" strokeWidth="2" strokeLinecap="round"/>
      <Circle cx="12" cy="18" r="2" fill="#00752F"/>
    </Svg>
  ),
  
  // 교육/업무
  '구글클래스룸': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/classroom.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  '줌': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/zoom.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  '슬랙': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/slack.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  '노션': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/notion.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  
  // 취미
  '넷플릭스': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/netflix.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  '왓챠': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/watcha.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  '디즈니플러스': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/disney.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  '유튜브': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/youtube.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  
  // 기타
  '구글': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/google.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  '네이버': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/naver.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  '다음': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/daum.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
  'T멤버쉽': ({ width = 24, height = 24 }) => (
    <Image 
      source={require('../assets/icons/organizations/tmembership.png')} 
      style={{ width, height }} 
      resizeMode="contain"
    />
  ),
};

// 카테고리 아이콘들 export
export { FinanceCategoryIcon, EduCategoryIcon, MedicalCategoryIcon };

// 기관 아이콘 정보 가져오기
export const getOrgIconInfo = (orgName) => {
  const IconComponent = orgIconMap[orgName];

  if (IconComponent) {
    // 금융 기관들은 PNG 이미지를 사용
    const pngBanks = ['토스', '우리은행', '신한은행', '하나은행'];
    if (pngBanks.includes(orgName)) {
      const imageMap = {
        '토스': require('../assets/icons/organizations/toss.png'),
        '우리은행': require('../assets/icons/organizations/woori.png'),
        '신한은행': require('../assets/icons/organizations/shinhan.png'),
        '하나은행': require('../assets/icons/organizations/hana.png'),
      };
      
      return {
        logoType: 'image',
        imageSource: imageMap[orgName],
        logoText: orgName, // fallback
      };
    }
    
    // 의료 기관들은 PNG 이미지를 사용
    const pngHospitals = ['서울대병원', '삼성서울병원', '세브란스병원', '서울성모병원'];
    if (pngHospitals.includes(orgName)) {
      const imageMap = {
        '서울대병원': require('../assets/icons/organizations/snuh.png'),
        '삼성서울병원': require('../assets/icons/organizations/smc.png'),
        '세브란스병원': require('../assets/icons/organizations/severance.png'),
        '서울성모병원': require('../assets/icons/organizations/catholic.png'),
      };
      
      return {
        logoType: 'image',
        imageSource: imageMap[orgName],
        logoText: orgName, // fallback
      };
    }
    
    // 쇼핑 기관들은 PNG 이미지를 사용
    const pngShopping = ['쿠팡', '11번가', 'G마켓', '옥션'];
    if (pngShopping.includes(orgName)) {
      const imageMap = {
        '쿠팡': require('../assets/icons/organizations/coupang.png'),
        '11번가': require('../assets/icons/organizations/11st.png'),
        'G마켓': require('../assets/icons/organizations/gmarket.png'),
        '옥션': require('../assets/icons/organizations/auction.png'),
      };
      
      return {
        logoType: 'image',
        imageSource: imageMap[orgName],
        logoText: orgName, // fallback
      };
    }
    
    // SNS 기관들은 PNG 이미지를 사용
    const pngSns = ['카카오톡', '네이버밴드', '인스타그램', '페이스북'];
    if (pngSns.includes(orgName)) {
      const imageMap = {
        '카카오톡': require('../assets/icons/organizations/kakaotalk.png'),
        '네이버밴드': require('../assets/icons/organizations/naverband.png'),
        '인스타그램': require('../assets/icons/organizations/instagram.png'),
        '페이스북': require('../assets/icons/organizations/facebook.png'),
      };
      
      return {
        logoType: 'image',
        imageSource: imageMap[orgName],
        logoText: orgName, // fallback
      };
    }
    
    // 교통 기관들은 PNG 이미지를 사용
    const pngTransport = ['카카오T', '우버', '티머니', '한국철도공사'];
    if (pngTransport.includes(orgName)) {
      const imageMap = {
        '카카오T': require('../assets/icons/organizations/kakaoT.png'),
        '우버': require('../assets/icons/organizations/uber.png'),
        '티머니': require('../assets/icons/organizations/tmoney.png'),
        '한국철도공사': require('../assets/icons/organizations/korail.png'),
      };

      return {
        logoType: 'image',
        imageSource: imageMap[orgName],
        logoText: orgName, // fallback
      };
    }

    // 여행 기관들은 PNG 이미지를 사용
    const pngTravel = ['야놀자', '여기어때', '아고다', '부킹닷컴'];
    if (pngTravel.includes(orgName)) {
      const imageMap = {
        '야놀자': require('../assets/icons/organizations/yanolja.png'),
        '여기어때': require('../assets/icons/organizations/yeogi.png'),
        '아고다': require('../assets/icons/organizations/agoda.png'),
        '부킹닷컴': require('../assets/icons/organizations/booking.png'),
      };

      return {
        logoType: 'image',
        imageSource: imageMap[orgName],
        logoText: orgName, // fallback
      };
    }

    // 행정 기관들은 PNG 이미지를 사용
    const pngAdmin = ['정부24', '국세청 홈택스', '건강보험공단', '내 곁에 국민연금'];
    if (pngAdmin.includes(orgName)) {
      const imageMap = {
        '정부24': require('../assets/icons/organizations/gov24.png'),
        '국세청 홈택스': require('../assets/icons/organizations/hometax.png'),
        '건강보험공단': require('../assets/icons/organizations/nhis.png'),
        '내 곁에 국민연금': require('../assets/icons/organizations/nps.png'),
      };

      return {
        logoType: 'image',
        imageSource: imageMap[orgName],
        logoText: orgName, // fallback
      };
    }

    // 교육/업무 기관들은 PNG 이미지를 사용
    const pngEduWork = ['구글클래스룸', '줌', '슬랙', '노션'];
    if (pngEduWork.includes(orgName)) {
      const imageMap = {
        '구글클래스룸': require('../assets/icons/organizations/classroom.png'),
        '줌': require('../assets/icons/organizations/zoom.png'),
        '슬랙': require('../assets/icons/organizations/slack.png'),
        '노션': require('../assets/icons/organizations/notion.png'),
      };

      return {
        logoType: 'image',
        imageSource: imageMap[orgName],
        logoText: orgName, // fallback
      };
    }

    // 취미 기관들은 PNG 이미지를 사용
    const pngHobby = ['넷플릭스', '왓챠', '디즈니플러스', '유튜브'];
    if (pngHobby.includes(orgName)) {
      const imageMap = {
        '넷플릭스': require('../assets/icons/organizations/netflix.png'),
        '왓챠': require('../assets/icons/organizations/watcha.png'),
        '디즈니플러스': require('../assets/icons/organizations/disney.png'),
        '유튜브': require('../assets/icons/organizations/youtube.png'),
      };

      return {
        logoType: 'image',
        imageSource: imageMap[orgName],
        logoText: orgName, // fallback
      };
    }

    // 기타 기관들은 PNG 이미지를 사용
    const pngEtc = ['구글', '네이버', '다음', 'T멤버쉽'];
    if (pngEtc.includes(orgName)) {
      const imageMap = {
        '구글': require('../assets/icons/organizations/google.png'),
        '네이버': require('../assets/icons/organizations/naver.png'),
        '다음': require('../assets/icons/organizations/daum.png'),
        'T멤버쉽': require('../assets/icons/organizations/tmembership.png'),
      };

      return {
        logoType: 'image',
        imageSource: imageMap[orgName],
        logoText: orgName, // fallback
      };
    }

    return {
      logoType: 'svg',
      logoComponent: IconComponent,
      logoText: orgName, // fallback
    };
  }

  // 아이콘이 없는 경우 기본 텍스트 아이콘 반환
  return {
    logoType: 'text',
    logoText: orgName.substring(0, 2), // 앞 2글자
  };
};

// 모든 기관 아이콘 정보 가져오기 (기존 데이터와 병합용)
export const getAllOrgIconData = () => {
  const result = {};
  
  Object.keys(orgIconMap).forEach(orgName => {
    result[orgName] = getOrgIconInfo(orgName);
  });
  
  return result;
};
