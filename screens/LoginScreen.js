import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { authAPI } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!id || !password) {
      Alert.alert('입력 오류', '아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      // 백엔드 로그인 API 호출
      const result = await authAPI.login(id, password);
      
      console.log('로그인 성공:', result);
      
      // 로그인 성공 시 메인 화면으로 이동
      if (navigation && navigation.replace) {
        navigation.replace('MainTabs');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      Alert.alert(
        '로그인 실패',
        error.message || '로그인 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
    }
  };

  const handleSignup = () => {
    // 회원가입 화면으로 이동
    if (navigation && navigation.navigate) {
      navigation.navigate('Signup');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentBox}>
        <Text style={styles.title}>로그인화면</Text>
        
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/icons/logo/logo1.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.subtitle}>원하는 동의를 한번에 ON/OFF</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>아이디</Text>
          <TextInput
            style={styles.input}
            placeholder="아이디를 입력하세요"
            value={id}
            onChangeText={setId}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1E9E4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentBox: {
    width: '90%',
    backgroundColor: '#F5F7F6',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  logoContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 120,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E1E9E4',
  },
  loginButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#00752F',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E1E9E4',
  },
  signupButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
});
