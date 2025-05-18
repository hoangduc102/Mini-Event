import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Swiper from 'react-native-swiper';
import COLORS from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useRef, useEffect } from 'react';

const { width, height } = Dimensions.get('window');

export default function Onboarding() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const slides = [
    {
      id: 1,
      image: require('../../assets/images/onboarding1.png'),
      title: 'Khám phá sự kiện',
      description: 'Tìm kiếm và tham gia các sự kiện thú vị xung quanh bạn'
    },
    {
      id: 2,
      image: require('../../assets/images/onboarding1.png'), 
      title: 'Tạo sự kiện',
      description: 'Dễ dàng tạo và quản lý sự kiện của riêng bạn'
    },
    {
      id: 3,
      image: require('../../assets/images/onboarding1.png'),
      title: 'Kết nối cộng đồng', 
      description: 'Gặp gỡ những người có cùng sở thích và đam mê'
    }
  ];

  useEffect(() => {
    // Đảm bảo swiper và state luôn đồng bộ
    if (swiperRef.current) {
      swiperRef.current.scrollTo(activeIndex, true);
    }
  }, [activeIndex]);

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(auth)');
    } catch (error) {
      console.error('Error saving onboarding state:', error);
      router.replace('/(auth)');
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(auth)');
    } catch (error) {
      console.error('Error saving onboarding state:', error);
      router.replace('/(auth)');
    }
  };

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      setActiveIndex(prevIndex => prevIndex + 1);
    }
  };

  const renderSlides = () => {
    return slides.map((slide) => (
      <View key={slide.id} style={styles.slide}>
        <Image source={slide.image} style={styles.image} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>LOGO</Text>
      </View>

      <Swiper
        ref={swiperRef}
        style={styles.wrapper}
        loop={false}
        index={activeIndex}
        onIndexChanged={setActiveIndex}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        scrollEnabled={true}
        showsButtons={false}
        removeClippedSubviews={false}
        bounces={false}
        automaticallyAdjustContentInsets={false}
      >
        {renderSlides()}
      </Swiper>

      <View style={styles.footer}>
        <TouchableOpacity 
          onPress={handleSkip} 
          style={styles.skipButton}
        >
          <Text style={[styles.buttonText, styles.skipButtonText]}>SKIP</Text>
        </TouchableOpacity>

        {activeIndex === slides.length - 1 ? (
          <TouchableOpacity 
            style={[styles.button, styles.startButton]} 
            onPress={handleGetStarted}
            activeOpacity={0.7}
          >
            <Text style={[styles.buttonText, styles.startButtonText]}>BẮT ĐẦU</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.button, styles.nextButton]} 
            onPress={handleNext}
            activeOpacity={0.7}
          >
            <Text style={[styles.buttonText, styles.nextButtonText]}>NEXT</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  wrapper: {
    flex: 1
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginTop: 20
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 16
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24
  },
  dot: {
    backgroundColor: '#D8D8D8',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 20,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    minWidth: 120,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 48,
    minWidth: 160,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  skipButtonText: {
    color: COLORS.textSecondary,
  },
  nextButtonText: {
    color: '#fff',
  },
  startButtonText: {
    color: '#fff',
  }
});