import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from './HomeStack';
import OrgScreen from '../screens/OrgScreen';
import MyScreen from '../screens/MyScreen';
import { Ionicons } from '@expo/vector-icons'; //아이콘 라이브러리

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName='홈' //홈에서 시작
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#16a34a', //초록
          tabBarInactiveTintColor: '#9ca3af', //회색
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === '홈') iconName = 'home';
            else if (route.name === '기관') iconName = 'business';
            else if (route.name === 'MY') iconName = 'person';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="기관" component={OrgScreen} />
        <Tab.Screen name="홈" component={HomeStack} />
        <Tab.Screen name="MY" component={MyScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
