// screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import NoticeItem from '../components/NoticeItem';
import { BellIcon } from '../components/SvgIcons';
import Svg, { Path } from 'react-native-svg';
import { homeAPI, userAPI } from '../services/api';

// 카테고리 아이콘들 (원본 SVG 내용을 react-native-svg로 구현)
const FinanceIcon = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 37 28" fill="none">
    <Path d="M26.4976 1.80648L2.83023 13.1428C2.14356 13.4717 1.86010 14.2816 2.19708 14.9518L6.41070 23.3316C6.74768 24.0018 7.57751 24.2784 8.26418 23.9495L31.9315 12.6133C32.6182 12.2844 32.9017 11.4744 32.5647 10.8043L28.3511 2.42443C28.0141 1.75424 27.1842 1.47758 26.4976 1.80648Z" fill="#F5F7F6" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M33.9973 8.55469H7.30001C6.53511 8.55469 5.91504 9.15988 5.91504 9.90642V25.3721C5.91504 26.1186 6.53511 26.7238 7.30001 26.7238H33.9973C34.7622 26.7238 35.3822 26.1186 35.3822 25.3721V9.90642C35.3822 9.15988 34.7622 8.55469 33.9973 8.55469Z" fill="#F5F7F6" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M6.08691 11.9326H35.3202" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M5.94727 15.1738H35.321" stroke="#00752F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16.6572 19.375H32.5605" stroke="#00752F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16.6572 22.4629H32.5605" stroke="#00752F" strokeWidth="1.5" strokeDasharray="4 4"/>
    <Path d="M12.9376 18.584H10.04C9.50178 18.584 9.06543 19.0099 9.06543 19.5352V22.3632C9.06543 22.8886 9.50178 23.3144 10.04 23.3144H12.9376C13.4759 23.3144 13.9122 22.8886 13.9122 22.3632V19.5352C13.9122 19.0099 13.4759 18.584 12.9376 18.584Z" fill="#00752F"/>
  </Svg>
);

const EduIcon = ({ width = 24, height = 24 }) => (
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

const MedicalIcon = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 33 33" fill="none">
    <Path d="M30.6802 14.3185C32.6494 8.01864 28.37 3.66699 24.5329 3.66699C18.3052 3.66699 17.1247 9.53438 17.088 9.72531C17.0514 9.5338 15.8709 3.66699 9.64319 3.66699C5.81716 3.66699 1.55166 7.99303 3.47836 14.2632" fill="#F5F7F6"/>
    <Path d="M30.6802 14.3185C32.6494 8.01864 28.37 3.66699 24.5329 3.66699C18.3052 3.66699 17.1247 9.53438 17.088 9.72531C17.0514 9.5338 15.8709 3.66699 9.64319 3.66699C5.81716 3.66699 1.55166 7.99303 3.47836 14.2632" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M5 19.8912C7.1019 23.1049 10.8092 26.6393 16.7854 30.2569V30.2581C16.7854 30.2581 16.786 30.2581 16.7866 30.2581C16.7866 30.2581 16.7872 30.2581 16.7878 30.2581V30.2569C22.8205 26.6049 26.5417 23.0379 28.6325 19.7998" fill="#F5F7F6"/>
    <Path d="M5 19.8912C7.1019 23.1049 10.8092 26.6393 16.7854 30.2569V30.2581C16.7854 30.2581 16.786 30.2581 16.7866 30.2581C16.7866 30.2581 16.7872 30.2581 16.7878 30.2581V30.2569C22.8205 26.6049 26.5417 23.0379 28.6325 19.7998" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M1.82715 16.8467H8.9012L10.4466 12.5667L12.8838 21.0674L15.7674 15.6575L17.1941 18.0353L20.0772 10.3076L22.6628 21.9888L24.6547 16.8467H31.9662" stroke="#00752F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const GovernmentIcon = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 35 33" fill="none">
    <Path d="M30.7201 13.6328H4.19434V28.2477H30.7201V13.6328Z" fill="#F5F7F6"/>
    <Path d="M9.13965 13.015C9.13965 8.53238 12.7962 4.89844 17.3067 4.89844C21.8171 4.89844 25.4737 8.53238 25.4737 13.015" fill="#F5F7F6"/>
    <Path d="M9.13965 13.015C9.13965 8.53238 12.7962 4.89844 17.3067 4.89844C21.8171 4.89844 25.4737 8.53238 25.4737 13.015" stroke="#00752F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"/>
    <Path d="M1.77051 13.4941H33.2291" stroke="#00752F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"/>
    <Path d="M1.77051 28.3398H33.2291" stroke="#00752F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"/>
    <Path d="M4.15137 13.6328V28.2477" stroke="#00752F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"/>
    <Path d="M9.5498 13.6328V28.2477" stroke="#00752F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"/>
    <Path d="M25.2803 13.6328V28.2477" stroke="#00752F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"/>
    <Path d="M30.6777 13.6328V28.2477" stroke="#00752F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"/>
    <Path d="M14.5953 28.1781C14.5953 23.6955 14.1531 20.0615 17.5157 20.0615C20.614 20.0615 20.0869 23.6955 20.0869 28.1781" stroke="#00752F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"/>
  </Svg>
);

const HobbyIcon = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 35 35" fill="none">
    <Path d="M32.6793 16.6263C31.4816 9.47044 28.1083 8.22461 25.5704 8.22461C23.0324 8.22461 21.3458 9.61182 21.3458 9.61182H14.2289C14.2289 9.61182 12.5422 8.22461 10.0043 8.22461C7.46629 8.22461 4.09365 9.46983 2.89536 16.6263C1.69768 23.7821 3.05278 28.1011 5.63829 28.1011C8.22379 28.1011 13.4337 22.2689 13.4337 22.2689L17.7879 22.1831L22.1422 22.2689C22.1422 22.2689 27.3521 28.1011 29.9376 28.1011C32.5231 28.1011 33.8782 23.7821 32.6805 16.6263H32.6793Z" fill="#F5F7F6" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M26.2037 14.9553C27.1533 14.9553 27.9231 14.1855 27.9231 13.2359C27.9231 12.2864 27.1533 11.5166 26.2037 11.5166C25.2542 11.5166 24.4844 12.2864 24.4844 13.2359C24.4844 14.1855 25.2542 14.9553 26.2037 14.9553Z" fill="#00752F"/>
    <Path d="M26.2037 20.3801C27.1533 20.3801 27.9231 19.6103 27.9231 18.6608C27.9231 17.7112 27.1533 16.9414 26.2037 16.9414C25.2542 16.9414 24.4844 17.7112 24.4844 18.6608C24.4844 19.6103 25.2542 20.3801 26.2037 20.3801Z" fill="#00752F"/>
    <Path d="M23.4615 17.7453C24.4111 17.7453 25.1809 16.9756 25.1809 16.026C25.1809 15.0764 24.4111 14.3066 23.4615 14.3066C22.512 14.3066 21.7422 15.0764 21.7422 16.026C21.7422 16.9756 22.512 17.7453 23.4615 17.7453Z" fill="#00752F"/>
    <Path d="M28.9469 17.7453C29.8965 17.7453 30.6662 16.9756 30.6662 16.026C30.6662 15.0764 29.8965 14.3066 28.9469 14.3066C27.9973 14.3066 27.2275 15.0764 27.2275 16.026C27.2275 16.9756 27.9973 17.7453 28.9469 17.7453Z" fill="#00752F"/>
    <Path d="M9.12248 11.7148H9.12186C8.31243 11.7148 7.65625 12.371 7.65625 13.1805V18.8725C7.65625 19.682 8.31243 20.3381 9.12186 20.3381H9.12248C9.93192 20.3381 10.5881 19.682 10.5881 18.8725V13.1805C10.5881 12.371 9.93192 11.7148 9.12248 11.7148Z" fill="#00752F"/>
    <Path d="M13.4336 16.0258V16.0252C13.4336 15.2157 12.7774 14.5596 11.968 14.5596H6.27592C5.46648 14.5596 4.81031 15.2157 4.81031 16.0252V16.0258C4.81031 16.8352 5.46648 17.4914 6.27592 17.4914H11.968C12.7774 17.4914 13.4336 16.8352 13.4336 16.0258Z" fill="#00752F"/>
  </Svg>
);

const ShoppingIcon = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 33 33" fill="none">
    <Path d="M26.5795 21.4367L10.826 21.7639L7.97266 10.1123H29.4626L26.5795 21.4367Z" fill="#F5F7F6"/>
    <Path d="M2.26562 5.80176H6.75348L11.7175 25.0629" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M7.97266 10.1123H29.3735L26.8176 21.3477H10.7667" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M15.1357 10.1709L15.8791 21.1979" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M22.3587 10.29L21.5264 21.1686" stroke="#00752F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"/>
    <Path d="M9.33984 15.7295H27.828" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M11.5391 25.1221H25.4497" stroke="#00752F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"/>
    <Path d="M12.2078 29.9673C13.5458 29.9673 14.6304 28.8827 14.6304 27.5447C14.6304 26.2067 13.5458 25.1221 12.2078 25.1221C10.8698 25.1221 9.78516 26.2067 9.78516 27.5447C9.78516 28.8827 10.8698 29.9673 12.2078 29.9673Z" fill="#F5F7F6" stroke="#00752F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"/>
    <Path d="M25.3455 29.9673C26.6835 29.9673 27.7681 28.8827 27.7681 27.5447C27.7681 26.2067 26.6835 25.1221 25.3455 25.1221C24.0075 25.1221 22.9229 26.2067 22.9229 27.5447C22.9229 28.8827 24.0075 29.9673 25.3455 29.9673Z" fill="#F5F7F6" stroke="#00752F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"/>
  </Svg>
);

const SnsIcon = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 33 33" fill="none">
    <Path d="M31.6887 16.4999C31.6887 18.6315 31.1444 20.6484 30.1735 22.4453L31.1968 29.2539L24.6699 27.999C22.3107 29.3529 19.5074 30.1381 16.5004 30.1381C8.11199 30.1381 1.31152 24.0321 1.31152 16.4999C1.31152 8.96777 8.11141 2.8623 16.4998 2.8623C24.8882 2.8623 31.6887 8.96835 31.6887 16.5005V16.4999Z" fill="#F5F7F6" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M8.60986 18.6963C9.82311 18.6963 10.8066 17.7128 10.8066 16.4995C10.8066 15.2863 9.82311 14.3027 8.60986 14.3027C7.39662 14.3027 6.41309 15.2863 6.41309 16.4995C6.41309 17.7128 7.39662 18.6963 8.60986 18.6963Z" fill="#00752F"/>
    <Path d="M16.5249 18.6963C17.7382 18.6963 18.7217 17.7128 18.7217 16.4995C18.7217 15.2863 17.7382 14.3027 16.5249 14.3027C15.3117 14.3027 14.3281 15.2863 14.3281 16.4995C14.3281 17.7128 15.3117 18.6963 16.5249 18.6963Z" fill="#00752F"/>
    <Path d="M24.4409 18.6963C25.6542 18.6963 26.6377 17.7128 26.6377 16.4995C26.6377 15.2863 25.6542 14.3027 24.4409 14.3027C23.2277 14.3027 22.2441 15.2863 22.2441 16.4995C22.2441 17.7128 23.2277 18.6963 24.4409 18.6963Z" fill="#00752F"/>
  </Svg>
);

const TransitIcon = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 33 35" fill="none">
    <Path d="M24.4192 27.2593H8.58015C6.37115 27.2593 4.58008 25.5209 4.58008 23.3761V5.61239C4.58008 4.51947 5.28614 3.54252 6.3467 3.17529C10.9044 1.59741 21.2492 1.64251 26.5857 3.35041C27.68 3.70066 28.4198 4.69167 28.4198 5.80977V23.3761C28.4198 25.5204 26.6288 27.2593 24.4198 27.2593H24.4192Z" fill="#F5F7F6" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M4.58008 7.17383H28.4198" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16.5 7.17383V16.8613" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M4.58008 17.3232H28.1381" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M23.5531 24.7036C24.975 24.7036 26.1276 23.5437 26.1276 22.113C26.1276 20.6823 24.975 19.5225 23.5531 19.5225C22.1312 19.5225 20.9785 20.6823 20.9785 22.113C20.9785 23.5437 22.1312 24.7036 23.5531 24.7036Z" fill="#00752F"/>
    <Path d="M9.58822 24.7036C11.0101 24.7036 12.1628 23.5437 12.1628 22.113C12.1628 20.6823 11.0101 19.5225 9.58822 19.5225C8.16634 19.5225 7.01367 20.6823 7.01367 22.113C7.01367 23.5437 8.16634 24.7036 9.58822 24.7036Z" fill="#00752F"/>
    <Path d="M12.3387 27.5781L8.21289 32.9718" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M20.6611 27.5068L24.8224 32.9714" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M10.002 30.8086H22.7414" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const TravelIcon = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 33 32" fill="none">
    <Path d="M21.53 6.43129C21.53 6.43129 26.9407 -0.193556 29.811 2.67049C32.613 5.46662 26.2078 11.1113 26.2078 11.1113L25.4583 27.6828L23.2816 29.5394L19.6543 17.6265L11.1906 24.331L11.0181 27.1732L7.96033 30.5195L7.63258 24.8813L1.89844 24.5198L5.24855 21.4435L8.09197 21.2349L14.9346 12.9813L3.0112 9.37554L4.77894 7.23927L21.5306 6.43129H21.53Z" fill="#F5F7F6" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const EtcIcon = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 31 33" fill="none">
    <Path d="M19.4865 10.0289L10.0087 19.6007C8.95172 20.6682 8.95172 22.3994 10.0087 23.4669C11.0657 24.5344 12.7799 24.5344 13.8369 23.4669L26.8519 10.0924C28.7121 8.21371 28.7121 5.1676 26.8519 3.2889C24.9917 1.41021 21.9755 1.41021 20.1153 3.2889L4.63633 18.816C1.86732 21.6125 1.86732 26.1474 4.63633 28.9439C7.40535 31.7405 11.8957 31.7405 14.6647 28.9439L26.4697 17.0218" fill="#F5F7F6"/>
    <Path d="M19.4865 10.0289L10.0087 19.6007C8.95172 20.6682 8.95172 22.3994 10.0087 23.4669C11.0657 24.5344 12.7799 24.5344 13.8369 23.4669L26.8519 10.0924C28.7121 8.21371 28.7121 5.1676 26.8519 3.2889C24.9917 1.41021 21.9755 1.41021 20.1153 3.2889L4.63633 18.816C1.86732 21.6125 1.86732 26.1474 4.63633 28.9439C7.40535 31.7405 11.8957 31.7405 14.6647 28.9439L26.4697 17.0218" stroke="#00752F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

/* 재사용 컴포넌트 */
function CategoryItem({ label, IconComponent, onPress }) {
  return (
    <TouchableOpacity style={styles.categoryItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.categoryIcon}>
        <IconComponent width={24} height={24} />
      </View>
      <Text style={styles.categoryLabel}>{label}</Text>
    </TouchableOpacity>
  );
}
function ConsentCard({ date, company, description }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardDate}>{date}</Text>
      <Text style={styles.cardCompany}>{company}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const [expanded, setExpanded] = useState(false);
  const [isCheckPressed, setIsCheckPressed] = useState(false);
  const [isFoldPressed, setIsFoldPressed] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [homeSummary, setHomeSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleCategoryPress = (category) => {
    // 기관 탭으로 이동하면서 선택된 카테고리 전달
    console.log('HomeScreen: 카테고리 클릭됨:', category);
    navigation.navigate('기관', { 
      screen: 'OrgMain',
      params: { selectedCategory: category }
    });
  };

  // Android 레이아웃 애니메이션 활성화
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  // 백엔드 데이터 로드
  useEffect(() => {
    loadBackendData();
  }, []);

  const loadBackendData = async () => {
    try {
      setLoading(true);
      
      // 사용자 프로필과 홈 요약 정보를 병렬로 로드
      const [profileData, summaryData] = await Promise.all([
        userAPI.getProfile(),
        homeAPI.getSummary()
      ]);
      
      setUserProfile(profileData);
      setHomeSummary(summaryData);
      
      console.log('홈 화면 데이터 로드 완료:', { profileData, summaryData });
    } catch (error) {
      console.error('홈 화면 데이터 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  return (
    <LinearGradient
      style={styles.bg}
      colors={['#FEFEFE', '#E1E9E4']}
      locations={[0, 0.4]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.safeArea}>
        <ScrollView style={styles.container}>

          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.username}>
              {loading ? '로딩 중...' : (userProfile?.displayName || '홍길동') + '님'}
            </Text>
          <TouchableOpacity style={styles.notificationIcon}>
            <BellIcon width={24} height={24} />
          </TouchableOpacity>
          </View>

          {/* 위험도 카드 */}
          <View style={styles.warningCard}>
            <View style={styles.riskRow}>
              <View style={styles.riskTexts}>
                <Text style={styles.riskLine1}>
                  <Text style={styles.riskEmphRed}>
                    {loading ? '로딩 중...' : (homeSummary?.totalConsents || 0) + '개 기관'}
                  </Text> 에서 동의서가 관리되고 있어요
                </Text>
                <Text style={styles.riskLine2}>
                  활성 동의서: <Text style={styles.riskEmphAmber}>
                    {loading ? '로딩 중...' : (homeSummary?.activeConsents || 0) + '개'}
                  </Text>
                </Text>
              </View>
              <View style={styles.riskBadge}>
                <Ionicons name="lock-closed" size={24} color="#fff" />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.outlineButton,
                { backgroundColor: isCheckPressed ? '#00752F' : '#F5F7F6', borderColor: '#00752F' },
              ]}
              onPressIn={() => setIsCheckPressed(true)}
              onPressOut={() => setIsCheckPressed(false)}
              onPress={() => navigation.navigate('RiskInstitution')}
              activeOpacity={0.9}
            >
              <Text style={[styles.outlineButtonText, { color: isCheckPressed ? '#FFFFFF' : '#14532D' }]}>
                해당 기관 확인하기 {'\u203A'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 카테고리 패널 */}
          <View style={styles.categoryPanel}>
            <View style={styles.categoryGrid}>
              {/* 1줄(항상 보임) */}
              <CategoryItem label="금융" IconComponent={FinanceIcon} onPress={() => handleCategoryPress('금융')} />
              <CategoryItem label="SNS" IconComponent={SnsIcon} onPress={() => handleCategoryPress('SNS')} />
              <CategoryItem label="쇼핑" IconComponent={ShoppingIcon} onPress={() => handleCategoryPress('쇼핑')} />
              <CategoryItem label="교통" IconComponent={TransitIcon} onPress={() => handleCategoryPress('교통')} />
              

              {/* 펼쳤을 때만 보임 */}
              {expanded && (
                <>
                  <CategoryItem label="여행" IconComponent={TravelIcon} onPress={() => handleCategoryPress('여행')} />
                  <CategoryItem label="교육/업무" IconComponent={EduIcon} onPress={() => handleCategoryPress('교육/업무')} />
                  <CategoryItem label="취미" IconComponent={HobbyIcon} onPress={() => handleCategoryPress('취미')} />
                  <CategoryItem label="의료" IconComponent={MedicalIcon} onPress={() => handleCategoryPress('의료')} />
                  <CategoryItem label="행정" IconComponent={GovernmentIcon} onPress={() => handleCategoryPress('행정')} />
                  <CategoryItem label="기타" IconComponent={EtcIcon} onPress={() => handleCategoryPress('기타')} />
                </>
              )}
            </View>

            <View style={styles.foldDivider} />
            <TouchableOpacity
              style={[
                styles.foldRow,
                { backgroundColor: isFoldPressed ? '#00752F' : '#F5F7F6', borderRadius: 8 },
              ]}
              onPress={toggleExpanded}
              onPressIn={() => setIsFoldPressed(true)}
              onPressOut={() => setIsFoldPressed(false)}
              activeOpacity={0.8}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.foldText, { color: isFoldPressed ? '#FFFFFF' : '#6B7280' }]}>
                {expanded ? '접기' : '펼치기'}
              </Text>
              <Ionicons
                name="chevron-down"
                size={14}
                color={isFoldPressed ? '#FFFFFF' : '#6B7280'}
                style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
              />
            </TouchableOpacity>
          </View>

          {/* 최근 동의 변경 내역 */}
          <View style={styles.recentChangeHeader}>
            <Text style={styles.sectionTitle}>최근 동의 변경 내역</Text>
            <TouchableOpacity onPress={() => navigation.navigate('RecentChanges')}>
              <View style={styles.moreRow}>
                <Text style={styles.moreText}>더보기</Text>
                <Ionicons name="chevron-forward" size={14} color="#6b7280" />
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: 20, marginBottom: 20 }}>
            <ConsentCard date="25.07.18" company="지그재그" description="약관 변경 동의" />
            <ConsentCard date="25.06.05" company="APPLE" description="Apple 미디어 서비스 이용 약관 변경" />
          </ScrollView>

          {/* 공지사항 */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>공지사항</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Notices')}>
              <View style={styles.moreRow}>
                <Text style={styles.moreText}>더보기</Text>
                <Ionicons name="chevron-forward" size={14} color="#6b7280" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.noticeList}>
            <NoticeItem date="25.07.18" logo="🟠" company="인크루트" description="개인정보 처리 방침 개정 안내" />
            <NoticeItem date="25.05.01" logo="🟧" company="알바몬" description="개인정보 유출 관련 안내 및 사과" />
            <NoticeItem date="25.05.09" logo="🟦" company="SKT 텔레콤" description="유심 관련 개인정보 유출 가능성 통지" />
          </View>

        </ScrollView>
      </View>
    </LinearGradient>
  );
}

/* Styles */
const styles = StyleSheet.create({
  /* 배경/컨테이너 */
  bg: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: Platform.OS === 'ios' ? 44 : 0, // iOS 상태바 높이
  },
  container: {
    backgroundColor: 'transparent',
  },

  /* 헤더 */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00752F',
  },
  notificationIcon: {
    padding: 8,
  },

  /* 위험도 카드 */
  warningCard: {
    backgroundColor: '#f3f7f5',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  riskTexts: {
    flex: 1,
    paddingRight: 12,
  },
  riskLine1: {
    fontSize: 13,
    color: '#0B1215',
    marginBottom: 4,
  },
  riskLine2: {
    fontSize: 13,
    color: '#0B1215',
  },
  riskEmphRed: {
    color: '#e11d48',
    fontWeight: '800',
  },
  riskEmphAmber: {
    color: '#eab308',
    fontWeight: '800',
  },
  riskBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#00752F',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F5F7F6',
  },
  outlineButtonText: {
    color: '#00752F',
    fontWeight: '700',
  },

  /* 카테고리 패널 */
  categoryPanel: {
    backgroundColor: '#F5F7F6',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  categoryItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryLabel: {
    marginTop: 7, //아이콘, 글씨 간격 조절
    fontSize: 13,
    color: '#00752F',
    fontWeight: '600',
  },

  /* 펼치기 */
  foldDivider: {
    height: 1,
    backgroundColor: '#E1E9E4',
    marginTop: 4,
  },
  foldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 6,          
    paddingVertical: 8,
    marginTop: 6,
    borderRadius: 8,
  },
  foldText: {
    fontSize: 12,
    color: '#6b7280',
  },

  /* 섹션 헤더들 */
  recentChangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B1215',
  },
  moreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreText: {
    color: '#6b7280',
    fontSize: 13,
  },

  /* 최근 동의 변경 내역 카드 */
  card: {
    backgroundColor: '#F5F7F6',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 180,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    // 둥근 그림자를 위한 설정
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
  cardShadow: {
    // 그림자 스타일을 card로 이동
    backgroundColor: '#F5F7F6',
   },
  
  cardDate: {
    fontSize: 12,
    color: '#0B1215',
    marginBottom: 4,
  },
  cardCompany: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    color: '#00752F',
  },
  cardDescription: {
    fontSize: 13,
    color: '#0B1215',
  },

  /* 공지 목록 */
  noticeList: {
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#F5F7F6',
    borderRadius: 12,
    padding: 12,
  },
});
