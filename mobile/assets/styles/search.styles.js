import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 16,
  },
  searchContainer: {
    paddingVertical: 16,
    backgroundColor: '#F5F7FA',
  },
  eventsContainer: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
    marginTop: 8,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 32,
    color: '#666',
    fontSize: 16,
  }
});

export default styles;
