// styles/home.styles.js
import { StyleSheet, Dimensions } from "react-native";
import COLORS from "../../constants/colors";

const { width } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: COLORS.background,
//   },
//   listContainer: {
//     padding: 16,
//     paddingBottom: 80, 
//   },
//   header: {
//     marginBottom: 20,
//     alignItems: "center",
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontFamily: "JetBrainsMono-Medium",
//     letterSpacing: 0.5,
//     color: COLORS.primary,
//     marginBottom: 8,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     textAlign: "center",
//   },
//   bookCard: {
//     backgroundColor: COLORS.cardBackground,
//     borderRadius: 16,
//     marginBottom: 20,
//     padding: 16,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   bookHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   userInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   avatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     marginRight: 10,
//   },
//   username: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: COLORS.textPrimary,
//   },
//   bookImageContainer: {
//     width: "100%",
//     height: 200,
//     borderRadius: 12,
//     overflow: "hidden",
//     marginBottom: 12,
//     backgroundColor: COLORS.border,
//   },
//   bookImage: {
//     width: "100%",
//     height: "100%",
//   },
//   bookDetails: {
//     padding: 4,
//   },
//   bookTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: COLORS.textPrimary,
//     marginBottom: 6,
//   },
//   ratingContainer: {
//     flexDirection: "row",
//     marginBottom: 8,
//   },
//   caption: {
//     fontSize: 14,
//     color: COLORS.textDark,
//     marginBottom: 8,
//     lineHeight: 20,
//   },
//   date: {
//     fontSize: 12,
//     color: COLORS.textSecondary,
//   },
//   emptyContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 40,
//     marginTop: 40,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: COLORS.textPrimary,
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     textAlign: "center",
//   },
//   footerLoader: {
//     marginVertical: 20,
//   },
// });

// export default styles;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
    marginLeft: 10,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  emoji: {
    fontSize: 24,
    marginLeft: 5,
  },
  notificationButton: {
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 12,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  notificationBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 2,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  notificationCount: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#666',
    marginRight: 4,
  },
  eventCard: {
    width: width * 0.75,
    height: 180,
    marginRight: 15,
    borderRadius: 16,
    overflow: 'hidden',
  },
  eventCardGradient: {
    flex: 1,
    padding: 20,
  },
  eventCardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  eventInfo: {
    flex: 1,
  },
  eventDate: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  eventTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventLocation: {
    color: '#FFF',
    fontSize: 14,
  },
  joinButton: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  joinButtonText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  upcomingEventCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  upcomingEventDate: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#EEE',
    marginRight: 15,
  },
  upcomingEventDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  upcomingEventMonth: {
    fontSize: 14,
    color: '#666',
  },
  upcomingEventInfo: {
    flex: 1,
  },
  upcomingEventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  upcomingEventLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  upcomingEventStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  upcomingEventAttendees: {
    fontSize: 14,
    color: '#666',
  },
  upcomingEventTime: {
    fontSize: 14,
    color: '#666',
  },
  createEventSection: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  createEventGradient: {
    padding: 20,
  },
  createEventContent: {
    alignItems: 'flex-start',
  },
  createEventTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  createEventDescription: {
    color: '#FFF',
    opacity: 0.8,
    marginBottom: 20,
  },
  createEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  createEventButtonText: {
    color: '#4A90E2',
    fontWeight: '600',
    marginRight: 8,
  },
  showMoreButton: {
    // alignItems: 'center',
    // paddingVertical: 10,
    //backgroundColor: '#FFF',
    // borderRadius: 12,
    // marginTop: 5,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    //shadowOpacity: 0.1,
    //shadowRadius: 4,
    //elevation: 3,
    //width: '40%',
    alignSelf: 'center',
  },
});

export default styles;