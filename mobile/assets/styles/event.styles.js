import { StyleSheet, Platform, StatusBar } from 'react-native';

const colors = {
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  secondary: '#64748B',
  background: '#FFFFFF',
  border: '#E2E8F0',
  text: '#1E293B',
  lightGray: '#F1F5F9',
  success: '#10B981',
  error: '#EF4444',
  cardBackground: '#FFFFFF',
};

const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  android: {
    elevation: 3,
  },
});

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomColor: '#f5f5f5',
    borderBottomWidth: 1,
    marginTop: Platform.OS === 'ios' ? 32 : -5,
    position: 'relative'
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    position: 'absolute',
    left: 16,
    zIndex: 1
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center'
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  eventCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.cardBackground,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    ...shadow,
  },
  eventImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  eventInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  eventDate: {
    color: colors.secondary,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  locationText: {
    color: colors.secondary,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  showDetailButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.primary,
    height: 36,
    justifyContent: 'center',
    alignSelf: 'center',
    ...shadow,
  },
  showDetailText: {
    fontSize: 13,
    color: colors.background,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    color: colors.text,
    letterSpacing: 0.5,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    margin: 16,
    ...shadow,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: colors.primary,
    ...shadow,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  activeTabText: {
    color: colors.background,
    fontWeight: '600',
  },
  inactiveTabText: {
    color: colors.secondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
  upcomingBadge: {
    backgroundColor: colors.success,
  },
  completedBadge: {
    backgroundColor: colors.secondary,
  },
}); 