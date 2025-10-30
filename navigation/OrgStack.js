import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrgScreen from '../screens/OrgScreen';
import OrgDetailScreen from '../screens/OrgDetailScreen';

const Stack = createNativeStackNavigator();

export default function OrgStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrgMain" component={OrgScreen} />
      <Stack.Screen name="OrgDetail" component={OrgDetailScreen} />
    </Stack.Navigator>
  );
}

