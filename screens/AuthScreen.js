import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
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
            placeholder="Phone"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#009E60',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 55,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#009E60',
    borderRadius: 10,
    height: 55,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#aaa',
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleAuth: {
    marginTop: 25,
    padding: 10,
  },
  toggleAuthText: {
    color: '#009E60',
    fontSize: 15,
    fontWeight: '500',
  },
  forgotPin: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    padding: 5,
  },
  forgotPinText: {
    color: '#009E60',
    fontSize: 14,
    fontWeight: '500',
  }
})

export default AuthScreen;