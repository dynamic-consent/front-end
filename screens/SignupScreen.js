import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { authAPI } from '../services/api';

export default function SignupScreen({ navigation }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSignup = async () => {
    try {
      // 회원가입 데이터 준비
      const userData = {
        id,
        password,
        name,
        birthDate,
        englishName,
        phone,
        email
      };

      console.log('회원가입 요청 데이터:', userData);
      console.log('BASE_URL:', require('../services/api').BASE_URL);

      // 백엔드 API 호출
      const result = await authAPI.signup(userData);
      
      console.log('회원가입 성공:', result);
      
      // 회원가입 성공 시 메인 화면으로 이동
      Alert.alert(
        '회원가입 완료',
        '회원가입이 완료되었습니다.',
        [
          {
            text: '확인',
            onPress: () => {
              // 메인 탭으로 이동
              if (navigation && navigation.replace) {
                navigation.replace('MainTabs');
              } else if (navigation && navigation.navigate) {
                navigation.navigate('MainTabs');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('회원가입 오류:', error);
      console.error('에러 상세:', error.message, error.stack);
      
      let errorMessage = '회원가입 중 오류가 발생했습니다.';
      
      if (error.message.includes('Network request failed')) {
        errorMessage = '백엔드 서버에 연결할 수 없습니다.\n\n확인사항:\n1. 백엔드 서버가 실행 중인지 확인하세요\n2. 서버 주소가 올바른지 확인하세요\n3. 네트워크 연결을 확인하세요';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert(
        '회원가입 실패',
        errorMessage
      );
    }
  };

  const handleBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentBox}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← 뒤로</Text>
          </TouchableOpacity>

          <Text style={styles.title}>회원가입</Text>
          
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/icons/logo/logo1.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.subtitle}>기본 정보를 입력해주세요</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>아이디 *</Text>
            <TextInput
              style={styles.input}
              placeholder="아이디를 입력하세요"
              value={id}
              onChangeText={setId}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>비밀번호 *</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>이름 *</Text>
            <TextInput
              style={styles.input}
              placeholder="이름을 입력하세요"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>생년월일 *</Text>
            <TextInput
              style={styles.input}
              placeholder="8자리 숫자로 입력하세요"
              value={birthDate}
              onChangeText={setBirthDate}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>영문 이름 *</Text>
            <TextInput
              style={styles.input}
              placeholder="영문 이름을 입력하세요"
              value={englishName}
              onChangeText={setEnglishName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>휴대폰 번호 *</Text>
            <TextInput
              style={styles.input}
              placeholder="01012345678 형식으로 입력하세요"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={13}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>이메일 *</Text>
            <TextInput
              style={styles.input}
              placeholder="이메일을 입력하세요"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.signupButton,
              (!id || !password || !name || !birthDate || !englishName || !phone || !email) && styles.signupButtonDisabled
            ]} 
            onPress={handleSignup}
            disabled={!id || !password || !name || !birthDate || !englishName || !phone || !email}
          >
            <Text style={styles.signupButtonText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1E9E4',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  contentBox: {
    width: '90%',
    backgroundColor: '#F5F7F6',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#00752F',
    fontWeight: '600',
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
  signupButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#00752F',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

