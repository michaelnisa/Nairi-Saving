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
import { useAuth } from '../screens/context/AuthContext';

const AuthScreen = () => {
  // Step: 0 = Phone, 1 = OTP, 2 = Registration
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const { sendOtp, verifyOtp, register } = useAuth();

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
      return;
    }
    setIsLoading(true);
    try {
      await sendOtp(phone);
      Alert.alert('OTP Sent', `A verification code has been sent to ${phone}`);
      setStep(1);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter the verification code');
      return;
    }
    setIsLoading(true);
    try {
      await verifyOtp(phone, otp);
      setStep(2);
    } catch (error) {
      Alert.alert('Verification Failed', error.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Register
  const handleRegister = async () => {
    if (!firstName || firstName.trim().length < 2) {
      Alert.alert('Invalid First Name', 'Please enter your first name');
      return;
    }
    if (!lastName || lastName.trim().length < 2) {
      Alert.alert('Invalid Last Name', 'Please enter your last name');
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
    setIsLoading(true);
    try {
      await register(phone, otp, pin, firstName, lastName);
      // Optionally, auto-login after registration
      // await login(phone, pin);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Registration Error', error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset all fields and go back to step 0
  const handleBackToPhone = () => {
    setStep(0);
    setOtp('');
    setFirstName('');
    setLastName('');
    setPin('');
    setConfirmPin('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign Up</Text>

        {step === 0 && (
          <>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#009E60" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                editable={!isLoading}
              />
            </View>
            <TouchableOpacity
              style={[styles.button, isLoading && styles.disabledButton]}
              onPress={handleSendOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.buttonText}>Send Verification Code</Text>
              )}
            </TouchableOpacity>
          </>
        )}
        {step === 0 && (
          <TouchableOpacity
            style={styles.toggleAuth}
            onPress={() => navigation.navigate('Login')}
            disabled={isLoading}
          >
            <Text style={styles.toggleAuthText}>Already have an account? Login</Text>
          </TouchableOpacity>
        )}

        {step === 1 && (
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
            <TouchableOpacity
              style={[styles.button, isLoading && styles.disabledButton]}
              onPress={handleVerifyOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.buttonText}>Verify</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toggleAuth}
              onPress={handleBackToPhone}
              disabled={isLoading}
            >
              <Text style={styles.toggleAuthText}>Back</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#009E60" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#009E60" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
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
            <TouchableOpacity
              style={[styles.button, isLoading && styles.disabledButton]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toggleAuth}
              onPress={handleBackToPhone}
              disabled={isLoading}
            >
              <Text style={styles.toggleAuthText}>Back</Text>
            </TouchableOpacity>
          </>
        )}
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
});

export default AuthScreen;