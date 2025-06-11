"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
  StatusBar,
} from "react-native"

const { width, height } = Dimensions.get("window")

const slides = [
  {
    id: "1",
    title: "Save Together",
    description: "Join forces with your community to achieve your financial goals faster.",
    image: require("../assets/images/icon.png"),
  },
  {
    id: "2",
    title: "Track Contributions",
    description: "Easily monitor who has contributed and when payments are due.",
    image: require("../assets/images/icon.png"),
  },
  {
    id: "3",
    title: "Transparent Rotations",
    description: "Fair and clear rotation system ensures everyone gets their turn.",
    image: require("../assets/images/icon.png"),
  },
]

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef(null)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateYAnim = useRef(new Animated.Value(50)).current

  // Run entrance animation when slide changes
  useEffect(() => {
    // Reset animations
    fadeAnim.setValue(0)
    translateYAnim.setValue(50)

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()
  }, [currentIndex, fadeAnim, translateYAnim])

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Animated.View
          style={[
            styles.imageContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }],
            },
          ]}
        >
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="contain"
            onError={(e) => console.log("Image loading error:", e.nativeEvent.error)}
          />
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Animated.View>
      </View>
    )
  }

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: currentIndex + 1,
          animated: true,
        })
      }
    } else {
      navigation.replace("Auth")
    }
  }

  const handleSkip = () => {
    navigation.replace("Auth")
  }

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index)
    }
  }).current

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current

  const progressWidth = width * 0.7 * ((currentIndex + 1) / slides.length)

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEnabled={true}
      />

      <View style={styles.bottomContainer}>
        {/* Progress bar instead of dots */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground} />
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{currentIndex === slides.length - 1 ? "Get Started" : "Next"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  imageContainer: {
    width: width * 0.8,
    height: height * 0.4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#009E60",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    lineHeight: 24,
    maxWidth: width * 0.8,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
    paddingBottom: 50,
    alignItems: "center",
  },
  progressContainer: {
    width: width * 0.7,
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    marginBottom: 30,
    overflow: "hidden",
  },
  progressBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#E0E0E0",
  },
  progressFill: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "#009E60",
    borderRadius: 3,
  },
  button: {
    backgroundColor: "#009E60",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: width * 0.7,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  skipText: {
    color: "#009E60",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default OnboardingScreen
