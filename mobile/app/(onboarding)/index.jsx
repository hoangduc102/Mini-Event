import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Animated, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import COLORS from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function Onboarding() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const slides = [
    {
      id: 1,
      image: require('../../assets/images/onboarding1.png'),
      title: 'Khám phá sự kiện',
      description: 'Tìm và tham gia các sự kiện thú vị xung quanh bạn. Kết nối với cộng đồng có cùng sở thích.'
    },
    {
      id: 2,
      image: require('../../assets/images/onboarding2.png'),
      title: 'Tạo & Quản lý',
      description: 'Dễ dàng tạo và quản lý sự kiện của riêng bạn. Theo dõi số người tham gia và phản hồi.'
    },
    {
      id: 3,
      image: require('../../assets/images/onboarding3.png'),
      title: 'Kết nối cộng đồng',
      description: 'Chia sẻ trải nghiệm, đánh giá và kết nối với những người có cùng đam mê.'
    }
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true
      });
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(auth)');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(auth)');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,1)']}
        style={styles.gradient}
      >
        <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
          <Text style={styles.logo}>Mini Event</Text>
        </Animated.View>

        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(newIndex);
          }}
          keyExtractor={(item) => item.id.toString()}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />

        <Pagination />

        <View style={styles.footer}>
          {currentIndex < slides.length - 1 ? (
            <>
              <TouchableOpacity onPress={handleSkip}>
                <Text style={styles.skipButton}>Bỏ qua</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.nextButton} 
                onPress={handleNext}
              >
                <Text style={styles.nextButtonText}>Tiếp tục</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.startButton} onPress={handleGetStarted}>
              <Text style={styles.startButtonText}>Bắt đầu ngay</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  gradient: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary
  },
  slide: {
    width: width,
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
    marginBottom: 15
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginHorizontal: 4
  },
  activeDot: {
    width: 20,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20
  },
  skipButton: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%'
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center'
  }
});