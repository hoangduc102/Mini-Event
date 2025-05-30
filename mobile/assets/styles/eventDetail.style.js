import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  imagePlaceholder: {
    height: 220,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  imageText: {
    fontWeight: 'bold',
    fontSize: 32,
    color: '#22223B',
    letterSpacing: 1,
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#22223B',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  smallText: {
    fontSize: 15,
    marginHorizontal: 4,
    color: '#4B5563',
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginLeft: 6,
    backgroundColor: '#eee',
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    backgroundColor: '#fff',
  },
  organizerImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  organizerName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#22223B',
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#22223B',
  },
  descriptionText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  readMore: {
    color: '#F97316',
    marginTop: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#22223B',
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 13,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  viewAllButton: {
    backgroundColor: '#F97316',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginLeft: 10,
  },
  viewAllText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.2,
  },
});

export default styles;
