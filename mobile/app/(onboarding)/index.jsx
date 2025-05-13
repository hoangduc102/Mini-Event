import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Swiper from 'react-native-swiper';
import COLORS from '../../constants/colors';

const { width, height } = Dimensions.get('window');

export default function Onboarding() {
  const router = useRouter();

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

  const handleGetStarted = () => {
    router.replace('/(auth)');
  };

  const handleSkip = () => {
    router.replace('/(auth)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>LOGO</Text>
      </View>

      <Swiper
        style={styles.wrapper}
        loop={false}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        showsButtons={true}
        buttonWrapperStyle={styles.buttonWrapper}
        nextButton={<Text style={styles.nextButton}>Next</Text>}
        prevButton={<Text style={styles.prevButton}></Text>}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            <Image source={slide.image} style={styles.image} resizeMode="contain" />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{slide.title}</Text>
            </View>
          </View>
        ))}
      </Swiper>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipButton}>SKIP</Text>
        </TouchableOpacity>
        {/* Nút START chỉ hiển thị ở slide cuối */}
        <TouchableOpacity style={styles.startButton} onPress={handleGetStarted}>
          <Text style={styles.startButtonText}>START</Text>
        </TouchableOpacity>
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
    height: height * 0.5,
    marginTop: 20
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 40
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center'
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
    paddingBottom: 30
  },
  skipButton: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  startButton: {
    backgroundColor: '#666',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  buttonWrapper: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 40,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  nextButton: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600'
  },
  prevButton: {
    color: 'transparent'
  }
});