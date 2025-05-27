import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallText: {
    fontSize: 14,
    marginHorizontal: 4,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 4,
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  organizerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  organizerName: {
    fontWeight: 'bold',
  },
  descriptionContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
  },
  readMore: {
    color: 'orange',
    marginTop: 4,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#000',
    margin: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
    viewAllButton: {
    backgroundColor: '#f97316',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
    },
    viewAllText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    },

});

export default styles;
