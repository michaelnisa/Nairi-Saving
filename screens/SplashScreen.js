import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

const SplashScreen = () => {
  const navigation = useNavigation();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoOpacity, logoScale, buttonOpacity]);

  const handleGetStarted = () => {
    navigation.replace('Onboarding');
  };

  return (
    <LinearGradient
      colors={['#009E60', '#00B383', '#00D6A2']}
      style={styles.gradient}
    >
      <StatusBar backgroundColor="#009E60" barStyle="light-content" />
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          {/* Replace with your actual logo image */}
          <Image
            // source={require('../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Nairi</Text>
          <Text style={styles.tagline}>Empowering Community Savings</Text>
        </Animated.View>
      </View>
      <Animated.View style={[styles.buttonWrapper, { opacity: buttonOpacity }]}>
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted} activeOpacity={0.85}>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.15,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 18,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
    opacity: 0.85,
    marginTop: 4,
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: height * 0.08,
  },
  getStartedButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#009E60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  getStartedText: {
    color: '#009E60',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default SplashScreen;