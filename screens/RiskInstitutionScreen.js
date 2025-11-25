import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getOrgIconInfo } from '../utils/orgIconLoader';

// 위험도 아이콘 매핑
const RISK_ICONS = {
  very: require('../assets/icons/risk/risk1.png'),      // 매우 위험
  high: require('../assets/icons/risk/risk2.png'),     // 위험
  medium: require('../assets/icons/risk/risk3.png'),   // 보통
  // low: require('../assets/icons/risk/risk4.png'),       // 안전 (파일 없음)
  // veryLow: require('../assets/icons/risk/risk5.png'),  // 매우 안전 (파일 없음)
};

// 위험도 순서대로 정렬된 기관 데이터 (매우 위험 -> 약간 위험)
const RISK_ORGS = [
  { 
    id: '1', 
    name: '카카오톡', 
    riskLevel: 'high', // 위험
    riskText: '위험',
    backgroundColor: '#FFE5CC', // 연한 주황
    riskIcon: RISK_ICONS.high,
  },
  { 
    id: '2', 
    name: '토스', 
    riskLevel: 'high', // 위험 (약간 위험)
    riskText: '약간 위험',
    backgroundColor: '#FFE5CC', // 연한 주황
    riskIcon: RISK_ICONS.high,
  },
  { 
    id: '3', 
    name: '넷플릭스', 
    riskLevel: 'medium', // 보통
    riskText: '보통',
    backgroundColor: '#FFF4CC', // 연한 노랑
    riskIcon: RISK_ICONS.medium,
  },
  { 
    id: '4', 
    name: '네이버', 
    riskLevel: 'medium', // 보통
    riskText: '보통',
    backgroundColor: '#FFF4CC', // 연한 노랑
    riskIcon: RISK_ICONS.medium,
  },
];

// 방패 아이콘 컴포넌트
const ShieldIcon = ({ riskIcon }) => (
  <Image 
    source={riskIcon} 
    style={styles.shieldIcon} 
    resizeMode="contain"
  />
);

// 가로 스크롤 카드 컴포넌트
function RiskCard({ org, isSelected, onPress }) {
  const iconInfo = getOrgIconInfo(org.name);
  
  return (
    <TouchableOpacity
      style={[
        styles.riskCard,
        { backgroundColor: org.backgroundColor },
        isSelected && styles.riskCardSelected
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.riskCardTop}>
        {iconInfo.logoType === 'image' ? (
          <Image 
            source={iconInfo.imageSource} 
            style={styles.orgLogo} 
            resizeMode="contain" 
          />
        ) : iconInfo.logoType === 'svg' ? (
          <View style={styles.orgLogo}>
            <iconInfo.logoComponent width={32} height={32} />
          </View>
        ) : (
          <View style={[styles.orgLogo, { backgroundColor: '#00752F' }]}>
            <Text style={styles.orgLogoText}>{iconInfo.logoText}</Text>
          </View>
        )}
        <Text style={styles.orgName} numberOfLines={1}>{org.name}</Text>
      </View>
      <View style={styles.riskCardBottom}>
        <ShieldIcon riskIcon={org.riskIcon} />
      </View>
    </TouchableOpacity>
  );
}

export default function RiskInstitutionScreen({ navigation }) {
  const [selectedOrg, setSelectedOrg] = useState(RISK_ORGS[0]); // 기본값: 카카오톡

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate?.('Home');
    }
  };

  return (
    <View style={styles.container}>
      {/* 상단 네비게이션 바 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>위험기관리스트</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="information-circle-outline" size={24} color="#00752F" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="notifications-outline" size={24} color="#00752F" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.mainScrollView}
        contentContainerStyle={styles.mainScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 가로 스크롤 카드들 */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.cardsScrollView}
          contentContainerStyle={styles.cardsContainer}
        >
          {RISK_ORGS.map((org) => (
            <RiskCard
              key={org.id}
              org={org}
              isSelected={selectedOrg.id === org.id}
              onPress={() => setSelectedOrg(org)}
            />
          ))}
        </ScrollView>

        {/* 메인 상세 카드 */}
        <View style={styles.detailCard}>
        <View style={styles.detailHeader}>
          {(() => {
            const iconInfo = getOrgIconInfo(selectedOrg.name);
            return iconInfo.logoType === 'image' ? (
              <Image 
                source={iconInfo.imageSource} 
                style={styles.detailLogo} 
                resizeMode="contain" 
              />
            ) : iconInfo.logoType === 'svg' ? (
              <View style={styles.detailLogo}>
                <iconInfo.logoComponent width={40} height={40} />
              </View>
            ) : (
              <View style={[styles.detailLogo, { backgroundColor: '#00752F' }]}>
                <Text style={styles.detailLogoText}>{iconInfo.logoText}</Text>
              </View>
            );
          })()}
          <Text style={styles.detailOrgName}>{selectedOrg.name}</Text>
        </View>
        
        <View style={styles.detailDivider} />
        
        <ScrollView 
          style={styles.detailContentScroll}
          contentContainerStyle={styles.detailContentContainer}
          showsVerticalScrollIndicator={true}
        >
          {selectedOrg.name === '토스' ? (
            <View style={styles.riskDetailContainer}>
              <View style={styles.riskScoreContainer}>
                <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                <Text style={styles.riskScoreValue}>32.0점</Text>
                <Text style={styles.riskScoreLevel}>(위험)</Text>
              </View>
              
              <View style={styles.riskFormulaContainer}>
                <Text style={styles.riskFormulaTitle}>산출식</Text>
                <Text style={styles.riskFormulaText}>
                  위험도 = 5 + (2 × 3 × 1.5 × 1.5) × 2 = 32.0
                </Text>
              </View>

              <View style={styles.riskFactorsContainer}>
                <Text style={styles.riskFactorsTitle}>5개 변수 분석</Text>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 데이터민감도(5):</Text>
                  <Text style={styles.riskFactorText}>금융 거래 정보, 신용 정보 = 고도로 민감한 고유식별정보</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 노출범위(2):</Text>
                  <Text style={styles.riskFactorText}>토스 그룹사·제휴사에 제한적 공유됩니다.</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 경과시간(3):</Text>
                  <Text style={styles.riskFactorText}>장기간 지속 수집됩니다.</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 목적명확성(1.5):</Text>
                  <Text style={styles.riskFactorText}>"금융서비스 안내" 등 일부 포괄적 표현입니다.</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• AI위험(1.5):</Text>
                  <Text style={styles.riskFactorText}>AI 신용평가, 맞춤형 금융상품 추천 활용됩니다.</Text>
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
                      <Text style={styles.withdrawalTableCellText}>신용정보 조회 및 활용</Text>
                    </View>
                    <View style={styles.withdrawalTableDivider} />
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>14점 감소</Text>
                    </View>
                  </View>
                  <View style={[styles.withdrawalTableRow, styles.withdrawalTableLastRow]}>
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>제휴사/그룹사 서비스 안내</Text>
                    </View>
                    <View style={styles.withdrawalTableDivider} />
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>3점 감소</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.maxEffectContainer}>
                <Text style={styles.maxEffectTitle}>최대 효과</Text>
                <Text style={styles.maxEffectText}>현재: 32.0점 (위험)</Text>
                <Text style={styles.maxEffectText}>
                  2개 모두 철회 시: 11점 <Text style={styles.maxEffectSafeText}>(안전)</Text>
                </Text>
                <Text style={styles.maxEffectHighlight}>21점 감소</Text>
              </View>
            </View>
          ) : selectedOrg.name === '네이버' ? (
            <View style={styles.riskDetailContainer}>
              <View style={styles.riskScoreContainerMedium}>
                <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                <Text style={styles.riskScoreValueMedium}>21.0점</Text>
                <Text style={styles.riskScoreLevelMedium}>(보통)</Text>
              </View>
              
              <View style={styles.riskFormulaContainer}>
                <Text style={styles.riskFormulaTitle}>산출식</Text>
                <Text style={styles.riskFormulaText}>
                  위험도 = 3 + (2 × 3 × 1.0 × 1.5) × 2 = 21.0
                </Text>
              </View>

              <View style={styles.riskFactorsContainer}>
                <Text style={styles.riskFactorsTitle}>5개 변수 분석</Text>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 데이터민감도(3):</Text>
                  <Text style={styles.riskFactorText}>검색 기록과 위치 정보는 보호받아야 할 개인정보 입니다.</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 노출범위(2):</Text>
                  <Text style={styles.riskFactorText}>네이버 계열사에 제한적 공유됩니다.</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 경과시간(3):</Text>
                  <Text style={styles.riskFactorText}>장기간 지속 수집됩니다.</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 목적명확성(1.0):</Text>
                  <Text style={styles.riskFactorText}>"검색 서비스", "지도 서비스" 목적이 명확합니다.</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• AI위험(1.5):</Text>
                  <Text style={styles.riskFactorText}>검색 알고리즘, 추천 시스템에 활용됩니다.</Text>
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
                  <View style={[styles.withdrawalTableRow, styles.withdrawalTableLastRow]}>
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>위치정보 이용약관 동의</Text>
                    </View>
                    <View style={styles.withdrawalTableDivider} />
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>12점 감소</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.maxEffectContainerVerySafe}>
                <Text style={styles.maxEffectTitle}>최대 효과</Text>
                <Text style={styles.maxEffectText}>현재: 21.0점 (보통)</Text>
                <Text style={styles.maxEffectText}>
                  철회 시: 3점 <Text style={styles.maxEffectVerySafeText}>(매우안전)</Text>
                </Text>
                <Text style={styles.maxEffectHighlightVerySafe}>18점 감소</Text>
              </View>
            </View>
          ) : selectedOrg.name === '넷플릭스' ? (
            <View style={styles.riskDetailContainer}>
              <View style={styles.riskScoreContainerMedium}>
                <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                <Text style={styles.riskScoreValueMedium}>21.0점</Text>
                <Text style={styles.riskScoreLevelMedium}>(보통)</Text>
              </View>
              
              <View style={styles.riskFormulaContainer}>
                <Text style={styles.riskFormulaTitle}>산출식</Text>
                <Text style={styles.riskFormulaText}>
                  위험도 = 3 + (2 × 3 × 1.0 × 1.5) × 2 = 21.0
            </Text>
          </View>

              <View style={styles.riskFactorsContainer}>
                <Text style={styles.riskFactorsTitle}>5개 변수 분석</Text>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 데이터민감도(3):</Text>
                  <Text style={styles.riskFactorText}>시청 기록은 보호받아야 할 개인정보입니다.</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 노출범위(2):</Text>
                  <Text style={styles.riskFactorText}>국외 이전되며, 제한적으로 공유됩니다.</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 경과시간(3):</Text>
                  <Text style={styles.riskFactorText}>장기간 시청 기록 보관됩니다.</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 목적명확성(1.0):</Text>
                  <Text style={styles.riskFactorText}>"콘텐츠 추천", "서비스 제공" 목적이 명확합니다.</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• AI위험(1.5):</Text>
                  <Text style={styles.riskFactorText}>콘텐츠 추천 알고리즘을 활용됩니다.</Text>
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
                      <Text style={styles.withdrawalTableCellText}>콘텐츠 취향 맞춤 정보 제공</Text>
                    </View>
                    <View style={styles.withdrawalTableDivider} />
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>9점 감소</Text>
                    </View>
                  </View>
                  <View style={[styles.withdrawalTableRow, styles.withdrawalTableLastRow]}>
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>마케팅 정보 수신</Text>
                    </View>
                    <View style={styles.withdrawalTableDivider} />
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>6점 감소</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.maxEffectContainerVerySafe}>
                <Text style={styles.maxEffectTitle}>최대 효과</Text>
                <Text style={styles.maxEffectText}>현재: 21.0점 (보통)</Text>
                <Text style={styles.maxEffectText}>
                  2개 모두 철회 시: 3점 <Text style={styles.maxEffectVerySafeText}>(매우안전)</Text>
                </Text>
                <Text style={styles.maxEffectHighlightVerySafe}>18점 감소</Text>
              </View>
            </View>
          ) : selectedOrg.name === '구글' ? (
            <View style={styles.riskDetailContainer}>
              <View style={styles.riskScoreContainerVery}>
                <Text style={styles.riskScoreLabel}>위험도 점수</Text>
                <Text style={styles.riskScoreValueVery}>43.5점</Text>
                <Text style={styles.riskScoreLevelVery}>(매우위험)</Text>
              </View>
              
              <View style={styles.riskFormulaContainer}>
                <Text style={styles.riskFormulaTitle}>산출식</Text>
                <Text style={styles.riskFormulaText}>
                  위험도 = 3 + (3 × 3 × 1.5 × 1.5) × 2 = 43.5
                </Text>
              </View>

              <View style={styles.riskFactorsContainer}>
                <Text style={styles.riskFactorsTitle}>5개 변수 분석</Text>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 데이터민감도(3):</Text>
                  <Text style={styles.riskFactorText}>검색 기록, 클릭 기록, 시청 기록 등 사용자의 관심사, 경제상황, 건강 상태가 드러나는 행동 데이터를 수집합니다.</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 노출범위(3):</Text>
                  <Text style={styles.riskFactorText}>수집된 데이터는 Google 검색, YouTube, Gmail 등 모든 구글 서비스에 통합되어, 수많은 제3자 광고주에게 공유될 수 있습니다.</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 경과시간(3):</Text>
                  <Text style={styles.riskFactorText}>구글 계정 활동 기록은 자동 삭제 설정을 하지 않으면 사용자가 계정을 보유하는 동안 장기간 저장됩니다.</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 목적명확성(1.5):</Text>
                  <Text style={styles.riskFactorText}>"서비스 개선", "맞춤 경험", "광고 최적화" 등으로 안내하지만, 해당 목적은 포괄적이라서 실제 어떤 방식과 범위로 활용되는지 사용자가 명확히 파악하기 어렵습니다.</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• AI위험(1.5):</Text>
                  <Text style={styles.riskFactorText}>AI 시스템은 행동 데이터를 자동으로 분류·프로파일링하여 사용자를 세분화하고, 각종 광고나 맞춤 서비스에 활용합니다.</Text>
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
                <Text style={styles.maxEffectTitle}>최대 효과</Text>
                <Text style={styles.maxEffectText}>현재: 43.5점 (매우위험)</Text>
                <Text style={styles.maxEffectText}>
                  3개 모두 철회 시: 3점 <Text style={styles.maxEffectVerySafeText}>(매우안전)</Text>
                </Text>
                <Text style={styles.maxEffectHighlightVerySafe}>40.5점 감소</Text>
              </View>
            </View>
          ) : selectedOrg.name === '카카오톡' ? (
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
                <Text style={styles.riskFactorsTitle}>5개 변수 분석</Text>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 데이터민감도(4):</Text>
                  <Text style={styles.riskFactorText}>메시지, 프로필, 연락처, 위치정보, 배송지정보, 행태정보 등 매우 풍부한 개인 데이터를 수집합니다.</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 노출범위(3):</Text>
                  <Text style={styles.riskFactorText}>카카오 계열사, 브랜드 파트너, 광고주 등 다양한 제3자에 광범위하게 공유됩니다.</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 경과시간(3):</Text>
                  <Text style={styles.riskFactorText}>위치정보, 행태정보 등이 장기간 보관됩니다.</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• 목적명확성(1.5):</Text>
                  <Text style={styles.riskFactorText}>마케팅, 광고 등 목적이 포괄적으로 표현됩니다.</Text>
                </View>
                <View style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>• AI위험(1.5):</Text>
                  <Text style={styles.riskFactorText}>맞춤형 광고를 위한 자동 분석 및 타겟팅이 이루어집니다.</Text>
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
                      <Text style={styles.withdrawalTableCellText}>프로필정보 추가 수집 동의</Text>
                    </View>
                    <View style={styles.withdrawalTableDivider} />
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>2점 감소</Text>
                    </View>
                  </View>
                  <View style={styles.withdrawalTableRow}>
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>이벤트 및 마케팅 활용 동의</Text>
                    </View>
                    <View style={styles.withdrawalTableDivider} />
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>2점 감소</Text>
                    </View>
                  </View>
                  <View style={styles.withdrawalTableRow}>
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>위치정보 수집 및 이용 동의</Text>
                    </View>
                    <View style={styles.withdrawalTableDivider} />
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>4점 감소</Text>
                    </View>
                  </View>
                  <View style={styles.withdrawalTableRow}>
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>배송지정보 수집 동의</Text>
                    </View>
                    <View style={styles.withdrawalTableDivider} />
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>2점 감소</Text>
                    </View>
                  </View>
                  <View style={styles.withdrawalTableRow}>
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>카카오톡 브랜드픽 채널 추가 및 소식 수신</Text>
                    </View>
                    <View style={styles.withdrawalTableDivider} />
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>2점 감소</Text>
                    </View>
                  </View>
                  <View style={styles.withdrawalTableRow}>
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>카카오알림 채널 추가 및 광고메시지 수신</Text>
                    </View>
                    <View style={styles.withdrawalTableDivider} />
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>2점 감소</Text>
                    </View>
                  </View>
                  <View style={styles.withdrawalTableRow}>
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>맞춤형 광고를 위한 행태정보 수집 및 이용</Text>
                    </View>
                    <View style={styles.withdrawalTableDivider} />
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>5점 감소</Text>
                    </View>
                  </View>
                  <View style={[styles.withdrawalTableRow, styles.withdrawalTableLastRow]}>
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>맞춤형 광고를 위한 행태정보 제3자 제공</Text>
                    </View>
                    <View style={styles.withdrawalTableDivider} />
                    <View style={styles.withdrawalTableCellContainer}>
                      <Text style={styles.withdrawalTableCellText}>3점 감소</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.maxEffectContainer}>
                <Text style={styles.maxEffectTitle}>최대 효과</Text>
                <Text style={styles.maxEffectText}>현재: 31.5점 (위험)</Text>
                <Text style={styles.maxEffectText}>
                  8개 모두 철회 시: 3점 <Text style={styles.maxEffectSafeText}>(매우안전)</Text>
                </Text>
                <Text style={styles.maxEffectHighlight}>28.5점 감소</Text>
              </View>
            </View>
          ) : selectedOrg.riskLevel === 'very' ? (
            <Text style={styles.riskTextVery}>매우 위험</Text>
          ) : selectedOrg.riskLevel === 'medium' ? (
            <Text style={styles.riskTextMedium}>보통</Text>
          ) : (
            <Text style={styles.riskTextSlight}>약간 위험</Text>
          )}
        </ScrollView>
        
        <TouchableOpacity 
          style={styles.learnMoreButton}
          onPress={() => {
            // 기관 상세 화면으로 이동하면서 위험도 탭을 바로 열기
            navigation.navigate('기관', {
              screen: 'OrgDetail',
              params: { 
                orgName: selectedOrg.name,
                initialTab: 'risk'
              }
            });
          }}
        >
          <Text style={styles.learnMoreText}>더 알아보기</Text>
          <Ionicons name="chevron-forward" size={16} color="#00752F" />
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F6',
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B1215',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    padding: 4,
  },
  mainScrollView: {
    flex: 1,
  },
  mainScrollContent: {
    paddingBottom: 20,
  },
  cardsScrollView: {
    marginTop: 16,
    marginBottom: 16,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  riskCard: {
    width: 100,
    height: 160,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
    overflow: 'visible',
  },
  riskCardSelected: {
    borderWidth: 2,
    borderColor: '#00752F',
  },
  riskCardTop: {
    alignItems: 'flex-start',
  },
  orgLogo: {
    width: 32,
    height: 32,
    marginBottom: 8,
  },
  orgLogoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
  },
  orgName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B1215',
  },
  riskCardBottom: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  shieldIcon: {
    width: 45,
    height: 45,
  },
  detailCard: {
    marginHorizontal: 20,
    marginTop: 0,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00752F',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLogo: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  detailLogoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40,
  },
  detailOrgName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0B1215',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 24,
  },
  detailContentScroll: {
    marginBottom: 16,
  },
  detailContentContainer: {
    paddingBottom: 8,
  },
  detailContent: {
    minHeight: 200,
    marginBottom: 24,
  },
  riskTextVery: {
    fontSize: 20,
    fontWeight: '700',
    color: '#DC2626',
  },
  riskTextSlight: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F97316',
  },
  riskTextMedium: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EAB308',
  },
  // 토스 위험도 상세 정보 스타일
  riskDetailContainer: {
    gap: 20,
  },
  riskScoreContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F97316',
  },
  riskScoreLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  riskScoreValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F97316',
    marginBottom: 4,
  },
  riskScoreLevel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F97316',
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
  maxEffectHighlight: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10B981',
    marginTop: 8,
  },
  maxEffectSafeText: {
    color: '#10B981',
    fontWeight: '700',
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
  maxEffectHighlightVerySafe: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3B82F6',
    marginTop: 8,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    paddingVertical: 8,
  },
  learnMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00752F',
    marginRight: 4,
  },
});
