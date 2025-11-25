 // components/SvgIcons.js
import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// 벨 아이콘
export const BellIcon = ({ width = 24, height = 24, color = "#7B8E82" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const HomeIcon = ({ width = 26, height = 26, color = "#7B8E82" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 22V12H15V22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// 홈 활성 아이콘
export const HomeActiveIcon = ({ width = 26, height = 26, color = "#00752F" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" fill={color}/>
    <Path d="M9 22V12H15V22" fill="white"/>
  </Svg>
);

// 기관 아이콘
export const OrgIcon = ({ width = 26, height = 26, color = "#7B8E82" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M3 21H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M5 21V7L13 2L21 7V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 9V13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 17V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M15 9V13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M15 17V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// 기관 활성 아이콘
export const OrgActiveIcon = ({ width = 26, height = 26, color = "#00752F" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M3 21H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M5 21V7L13 2L21 7V21" fill={color}/>
    <Path d="M9 9V13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 17V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M15 9V13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M15 17V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// 마이 아이콘
export const MyIcon = ({ width = 26, height = 26, color = "#7B8E82" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// 마이 활성 아이콘
export const MyActiveIcon = ({ width = 26, height = 26, color = "#00752F" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" fill={color}/>
    <Circle cx="12" cy="7" r="4" fill="white"/>
  </Svg>
);

// 금융 아이콘
export const FinanceIcon = ({ width = 24, height = 24, color = "#00752F" }) => (
  <Svg width={width} height={height} viewBox="0 0 37 28" fill="none">
    <Path d="M26.4976 1.80648L2.83023 13.1428C2.14356 13.4717 1.8601 14.2816 2.19708 14.9518L6.4107 23.3316C6.74768 24.0018 7.57751 24.2784 8.26418 23.9495L31.9315 12.6133C32.6182 12.2844 32.9017 11.4744 32.5647 10.8043L28.3511 2.42443C28.0141 1.75424 27.1842 1.47758 26.4976 1.80648Z" fill="#F5F7F6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M33.9973 8.55469H7.30001C6.53511 8.55469 5.91504 9.15988 5.91504 9.90642V25.3721C5.91504 26.1186 6.53511 26.7238 7.30001 26.7238H33.9973C34.7622 26.7238 35.3822 26.1186 35.3822 25.3721V9.90642C35.3822 9.15988 34.7622 8.55469 33.9973 8.55469Z" fill="#F5F7F6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M6.08691 11.9326H35.3202" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M5.94727 15.1738H35.321" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16.6572 19.375H32.5605" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16.6572 22.4629H32.5605" stroke={color} strokeWidth="1.5" strokeDasharray="4 4"/>
    <Path d="M12.9376 18.584H10.04C9.50178 18.584 9.06543 19.0099 9.06543 19.5352V22.3632C9.06543 22.8886 9.50178 23.3144 10.04 23.3144H12.9376C13.4759 23.3144 13.9122 22.8886 13.9122 22.3632V19.5352C13.9122 19.0099 13.4759 18.584 12.9376 18.584Z" fill={color}/>
  </Svg>
);
