import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../screens/context/AuthContext'; // Ensure the correct relative path

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { login, register, sendOtp, resetPin } = useAuth();

  const handleAuth = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        if (!pin || pin.length < 4) {
          Alert.alert('Invalid PIN', 'Please enter a valid PIN');
          setIsLoading(false);
          return;
        }

        console.log('Attempting login with:', { phoneNumber, pin }); // Debug log
        // Login with phone and PIN
        await login(phoneNumber, pin);
        // Navigation is handled by the AuthContext
      } else {
        if (!otpSent) {
          // Send OTP for registration
          await sendOtp(phoneNumber);
          setOtpSent(true);
          Alert.alert('OTP Sent', `A verification code has been sent to ${phoneNumber}`);
        } else {
          if (!otp || otp.length < 4) {
            Alert.alert('Invalid OTP', 'Please enter the verification code');
            setIsLoading(false);
            return;
          }
          if (!pin || pin.length < 4) {
            Alert.alert('Invalid PIN', 'Please create a PIN with at least 4 digits');
            setIsLoading(false);
            return;
          }
          if (pin !== confirmPin) {
            Alert.alert('PINs do not match', 'Please make sure your PINs match');
            setIsLoading(false);
            return;
          }
          
          // Register with phone, OTP, and PIN
          await register(phoneNumber, otp, pin);
          // Navigation is handled by the AuthContext
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert('Authentication Error', error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setOtpSent(false);
    setOtp('');
    setPin('');
    setConfirmPin('');
  };

  const handleForgotPin = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter your phone number first');
      return;
    }

    setIsLoading(true);
    try {
      await sendOtp(phoneNumber);
      Alert.alert(
        'Reset PIN',
        'A verification code has been sent to your phone. Please use it to reset your PIN.',
        [
          {
            text: 'OK',
            onPress: () => {
              setIsLogin(false);
              setOtpSent(true);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Failed to send OTP:', error);
      Alert.alert('Error', error.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
        
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#009E60" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            editable={!isLoading}
          />
        </View>

        {isLogin && (
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#009E60" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="PIN"
              keyboardType="number-pad"
              secureTextEntry
              value={pin}
              onChangeText={setPin}
              maxLength={6}
              editable={!isLoading}
            />
          </View>
        )}

        {!isLogin && otpSent && (
          <>
            <View style={styles.inputContainer}>
              <Ionicons name="key-outline" size={20} color="#009E60" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Verification Code"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
                maxLength={6}
                editable={!isLoading}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#009E60" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Create PIN"
                keyboardType="number-pad"
                secureTextEntry
                value={pin}
                onChangeText={setPin}
                maxLength={6}
                editable={!isLoading}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#009E60" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm PIN"
                keyboardType="number-pad"
                secureTextEntry
                value={confirmPin}
                onChangeText={setConfirmPin}
                maxLength={6}
                editable={!isLoading}
              />
            </View>
          </>
        )}

        {isLogin && (
          <TouchableOpacity 
            style={styles.forgotPin} 
            onPress={handleForgotPin}
            disabled={isLoading}
          >
            <Text style={styles.forgotPinText}>Forgot PIN?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.disabledButton]} 
          onPress={handleAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.buttonText}>
              {isLogin
                ? 'Login'
                : otpSent
                ? 'Create Account'
                : 'Send Verification Code'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.toggleAuth} 
          onPress={toggleAuthMode}
          disabled={isLoading}
        >
          <Text style={styles.toggleAuthText}>
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;