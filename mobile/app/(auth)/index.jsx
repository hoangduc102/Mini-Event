import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import styles from '../../assets/styles/login.styles'
import {useState} from 'react'
import {Image} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/colors'
import {Link} from 'expo-router'
import { useAuthStore } from '../../store/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading} = useAuthStore();

  const handleLogin = async () => {
    // Kiểm tra input
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Invalid email format');
      return;
    }

    const result = await login(email, password);
    if(!result.success) {
      Alert.alert('Error', result.error);
    }
  }
  
  return (
    <KeyboardAvoidingView 
    style={{flex: 1}}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    <View style={styles.container}>
      {/* ILLUSTRATION */}
      <View style={styles.topIllustration}>
        <Image 
          source={require('../../assets/images/Events-pana.png')} 
          style={styles.illustrationImage} 
          resizeMode='contain'
        />
      </View>
      <View style={styles.card}>
        <View style={styles.formContainer}>
          {/*EMAIL INPUT*/}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons 
                name='mail-outline' 
                size={20} 
                color={COLORS.primary} 
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='Enter your email'
                placeholderTextColor={COLORS.placeholderText}
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
              />
            </View>
          </View>

          {/*PASSWORD INPUT*/}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              {/*LEFT ICON*/}
              <Ionicons 
                name='lock-closed-outline' 
                size={20} 
                color={COLORS.primary} 
                style={styles.inputIcon}
              />
              {/*INPUT*/}
              <TextInput
                style={styles.input}
                placeholder='Enter your password'
                placeholderTextColor={COLORS.placeholderText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />

              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={20} 
                  color={COLORS.primary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}
          disabled = {isLoading}>
            {isLoading ? (
              <ActivityIndicator size='small' color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/*FOOTER*/}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href='/signup' asChild>
            <TouchableOpacity >
              <Text style={styles.link}>Sign up</Text>
              
            </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    
    </View>
    </KeyboardAvoidingView>
  );
}
