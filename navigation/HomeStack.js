import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import NoticeScreen from '../screens/NoticeScreen';
import NoticeDetailScreen from '../screens/NoticeDetailScreen';
import RiskInstitutionScreen from '../screens/RiskInstitutionScreen';
import RecentChangeScreen from '../screens/RecentChangeScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown:false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Notices" component={NoticeScreen} />
      <Stack.Screen name="NoticeDetail" component={NoticeDetailScreen} />
      <Stack.Screen name="RiskInstitution" component={RiskInstitutionScreen} />
      <Stack.Screen name="RecentChanges" component={RecentChangeScreen} />
    </Stack.Navigator>
  );
}
