import { View, Text, StyleSheet } from 'react-native';
import { useWindowDimensions } from 'react-native';

export default function ResponsiveInfo() {
  const { width, height, scale, fontScale } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Width: {width}</Text>
      <Text style={styles.text}>Height: {height}</Text>
      <Text style={styles.text}>Scale: {scale}</Text>
      <Text style={styles.text}>Font Scale: {fontScale}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: 'white',
    fontSize: 12,
    marginVertical: 2,
  }
}); 