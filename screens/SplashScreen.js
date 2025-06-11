import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate logo appearance first
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Then animate buttons after logo animation completes
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });

    // Navigate to onboarding after 3 seconds (giving time for button animation)
    const timer = setTimeout(() => {
      navigation.replace('Onboarding'); // Use replace instead of navigate
    }, 3000);

    return () => clearTimeout(timer);
  }, [logoOpacity, logoScale, buttonOpacity, navigation]);

  const handleSkip = () => {
    navigation.replace('Onboarding');
  };

  const handleNext = () => {
    navigation.replace('Onboarding');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009E60" barStyle="light-content" />
      
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.logoPlaceholder}>
          {/* Placeholder for logo - replace with your actual logo */}
          <Text style={styles.logoText}>LOGO</Text>
        </View>
        <Text style={styles.tagline}>Empowering Community Savings</Text>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.buttonContainer,
          { opacity: buttonOpacity }
        ]}
      >
        <TouchableOpacity 
          style={[styles.button, styles.skipButton]} 
          onPress={handleSkip}
          activeOpacity={3.8}
        >
          <Text style={[styles.buttonText, styles.skipButtonText]}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.nextButton]} 
          onPress={handleNext}
          activeOpacity={3.8}
        >
          <Text style={[styles.buttonText, styles.nextButtonText]}>Next</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009E60',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoPlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
  },
  nextButton: {
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  skipButtonText: {
    color: 'white',
  },
  nextButtonText: {
    color: '#009E60',
  },
});

export default SplashScreen;