import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Save Together',
    description: 'Join forces with your community to achieve your financial goals faster.',
    image: require('../assets/images/icon.png'), // Fixed image import
  },
  {
    id: '2',
    title: 'Track Contributions',
    description: 'Easily monitor who has contributed and when payments are due.',
    image: require('../assets/images/icon.png'), // Fixed image import
  },
  {
    id: '3',
    title: 'Transparent Rotations',
    description: 'Fair and clear rotation system ensures everyone gets their turn.',
    image: require('../assets/images/icon.png'), // Fixed image import
  },
];

const OnboardingScreen = ({ navigation }) => { // Accept navigation as a prop
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        {/* Fix 3: Add error handling for images */}
        <Image 
          source={item.image} 
          style={styles.image} 
          resizeMode="contain"
          // Add fallback for image loading errors
          onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
        />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: currentIndex + 1,
          animated: true,
        });
      }
    } else {
      navigation.navigate('Auth');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Auth');
  };

  // Fix 4: Properly define onViewableItemsChanged
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Auth')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
            {renderItem({ item })}
          </TouchableOpacity>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex ? styles.activeIndicator : null,
            ]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (currentIndex === slides.length - 1) {
            navigation.navigate('Auth'); // Navigate to AuthScreen on "Get Started"
          } else {
            handleNext(); // Navigate to the next slide
          }
        }}
      >
        <Text style={styles.buttonText}>
          {slides.length > 0 && currentIndex >= 0 && currentIndex < slides.length
            ? (currentIndex === slides.length - 1 
                ? 'Get Started' 
                : 'Next') 
            : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    width,
    alignItems: 'center',
    padding: 40,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#009E60',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#009E60',
    width: 20,
  },
  button: {
    backgroundColor: '#009E60',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    color: '#009E60',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;