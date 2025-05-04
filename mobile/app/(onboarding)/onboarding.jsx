import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';



const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Chào mừng đến với MiniEvent',
    description: 'Khám phá và tham gia các sự kiện thú vị xung quanh bạn',
    image: require('../../assets/images/App-logo.png'),
  },
  {
    id: 2,
    title: 'Tạo sự kiện dễ dàng',
    description: 'Tổ chức sự kiện của riêng bạn một cách đơn giản và nhanh chóng',
    image: require('../../assets/images/App-logo.png'),
  },
  {
    id: 3,
    title: 'Kết nối với mọi người',
    description: 'Gặp gỡ và tương tác với những người có cùng sở thích',
    image: require('../../assets/images/App-logo.png'),
  },
];

export default function Onboarding() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.slide}>
        <Image
          source={slides[currentSlideIndex].image}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{slides[currentSlideIndex].title}</Text>
        <Text style={styles.description}>{slides[currentSlideIndex].description}</Text>
      </View>

      <View style={styles.footer}>
        {currentSlideIndex === slides.length - 1 ? (
          <Link href="/(auth)" style={styles.button}>
            <Text style={styles.buttonText}>Bắt đầu</Text>
          </Link>
        ) : (
          <Text style={styles.button} onPress={handleNext}>
            Tiếp tục
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20,
  },
  footer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 