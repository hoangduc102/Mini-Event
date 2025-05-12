import { View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import styles from '../../assets/styles/signup.styles'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/colors'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../store/authStore'


export default function Signup() {
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const {user, isLoading, register, token} = useAuthStore()


  const router = useRouter()

  const handleSignup = async () => {
    const result = await register(username, phone, email, password)

    if (!result.success) {
      Alert.alert('Error', result.error)
    } 
  }

  return (
    <KeyboardAvoidingView
     style={{flex: 1}}
     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
     >
    <View style={styles.container}>
      <View style={styles.card}>

        {/*HEADER*/}
        <View style={styles.header}>
          <Text style={styles.title}>Mini Events </Text>
          <Text style={styles.subtitle}>Create your account</Text>
        </View>
        <View style={styles.formContainer}>
          {/*USERNAME INPUT*/}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputContainer}>
              <Ionicons 
              name='person-outline' 
              size={20} 
              color={COLORS.primary} 
              style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder='Enter your username'
                placeholderTextColor={COLORS.placeholderText}
                value={username}
                onChangeText={setUsername}
              />
            </View>
          </View>

          {/*PHONE INPUT*/}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <View style={styles.inputContainer}>
              <Ionicons 
              name='phone-portrait-outline' 
              size={20} 
              color={COLORS.primary} 
              style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder='Enter your phone'
                placeholderTextColor={COLORS.placeholderText}
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>

          {/*EMAIL INPUT*/}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons 
              name='mail-outline' 
              size={20} 
              color={COLORS.primary} 
              style={styles.inputIcon} />
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

          {/*SIGNUP BUTTON*/}
          <TouchableOpacity style={styles.button} onPress={handleSignup}
          disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size='small' color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Signup</Text>
            )}
          </TouchableOpacity>

          {/*FOOTER*/}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
            
          </View>
        </View>   
      </View>
    </View>
    </KeyboardAvoidingView>
  );
}
