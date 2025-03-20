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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';



const AuthScreen = () => {
  const navigation = useNavigation();
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');


  const handleAuth = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
      return;
    }

    if (isLogin) {
      if (!pin || pin.length < 4) {
        Alert.alert('Invalid PIN', 'Please enter a valid PIN');
        return;
      }
      // In a real app, you would verify the PIN with your backend
      navigation.navigate('Home');
    } else {
      if (!otpSent) {
        // In a real app, you would send an OTP to the phone number
        setOtpSent(true);
        Alert.alert('OTP Sent', `A verification code has been sent to ${phoneNumber}`);
      } else {
        if (!otp || otp.length < 4) {
          Alert.alert('Invalid OTP', 'Please enter the verification code');
          return;
        }
        if (!pin || pin.length < 4) {
          Alert.alert('Invalid PIN', 'Please create a PIN with at least 4 digits');
          return;
        }
        if (pin !== confirmPin) {
          Alert.alert('PINs do not match', 'Please make sure your PINs match');
          return;
        }
        // In a real app, you would verify the OTP and create the account
        navigation.navigate('Home');
      }
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setOtpSent(false);
    setOtp('');
    setPin('');
    setConfirmPin('');
  };

  const handleForgotPin = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter your phone number first');
      return;
    }
    Alert.alert('Reset PIN', 'A verification code will be sent to your phone to reset your PIN');
    // In a real app, you would send a reset code
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
              />
            </View>
          </>
        )}

        {isLogin && (
          <TouchableOpacity style={styles.forgotPin} onPress={handleForgotPin}>
            <Text style={styles.forgotPinText}>Forgot PIN?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>
            {isLogin
              ? 'Login'
              : otpSent
                ? 'Create Account'
                : 'Send Verification Code'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toggleAuth} onPress={toggleAuthMode}>
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
    backgroundColor: 'white',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#009E60',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  forgotPin: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPinText: {
    color: '#009E60',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#009E60',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleAuth: {
    alignItems: 'center',
  },
  toggleAuthText: {
    color: '#009E60',
    fontSize: 14,
  },
});

export default AuthScreen;