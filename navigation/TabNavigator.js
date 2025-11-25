// navigation/TabNavigator.js
import React from 'react';
import { View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStack from './HomeStack';
import OrgStack from './OrgStack';
import MyScreen from '../screens/MyScreen';


const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="홈"
        screenOptions={({ route }) => ({
          headerShown: false,

          // ✅ 기본 라벨을 '하나만' 사용
          tabBarShowLabel: true,

          // 라벨 스타일(조금 크게/굵게)
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: -2,
            marginBottom: 4,
          },

          // 라벨 색
          tabBarActiveTintColor: '#00752F',
          tabBarInactiveTintColor: '#7B8E82',

          // 탭바 스타일
          tabBarStyle: {
            backgroundColor: '#F5F7F6',
            borderTopWidth: 0.5,
            borderTopColor: '#E1E9E4',
            height: 80,
            paddingTop: 0,
            paddingBottom: 20,
          },

          // ✅ 아이콘만 렌더 (PNG 이미지 사용)
        tabBarIcon: ({ focused }) => {
          const size = 28;
          
          if (route.name === '홈') {
            return (
              <View style={{ marginBottom: 4 }}>
                <Image
                  source={focused 
                    ? require('../assets/icons/tabs/home_active.png')
                    : require('../assets/icons/tabs/home.png')
                  }
                  style={{ width: size, height: size }}
                  resizeMode="contain"
                />
              </View>
            );
          }
          if (route.name === '기관') {
            return (
              <View style={{ marginBottom: 4 }}>
                <Image
                  source={focused 
                    ? require('../assets/icons/tabs/institution_active.png')
                    : require('../assets/icons/tabs/institution.png')
                  }
                  style={{ width: size, height: size }}
                  resizeMode="contain"
                />
              </View>
            );
          }
          if (route.name === 'MY') {
            return (
              <View style={{ marginBottom: 4 }}>
                <Image
                  source={focused 
                    ? require('../assets/icons/tabs/my_active.png')
                    : require('../assets/icons/tabs/my.png')
                  }
                  style={{ width: size, height: size }}
                  resizeMode="contain"
                />
              </View>
            );
          }
          return <View />;
        },
        })}
      >
        {/* ⚠️ 각 스크린 options에 tabBarLabel 함수/텍스트 넣지 말기! */}
        <Tab.Screen name="기관" component={OrgStack} />
        <Tab.Screen name="홈" component={HomeStack} />
        <Tab.Screen name="MY" component={MyScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}
