// styles/create.styles.js
import { StyleSheet } from "react-native";
import COLORS from "../../constants/colors";

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: COLORS.background,
//     padding: 16,
//   },
//   scrollViewStyle: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   card: {
//     backgroundColor: COLORS.cardBackground,
//     borderRadius: 16,
//     padding: 20,
//     marginVertical: 16,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   header: {
//     alignItems: "center",
//     marginBottom: 24,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: COLORS.textPrimary,
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     textAlign: "center",
//   },
//   form: {
//     marginBottom: 16,
//   },
//   formGroup: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     marginBottom: 8,
//     color: COLORS.textPrimary,
//     fontWeight: "500",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: COLORS.inputBackground,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 12,
//   },
//   inputIcon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     height: 48,
//     color: COLORS.textDark,
//   },
//   textArea: {
//     backgroundColor: COLORS.inputBackground,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     padding: 12,
//     height: 100,
//     color: COLORS.textDark,
//   },
//   ratingContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     backgroundColor: COLORS.inputBackground,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     padding: 8,
//   },
//   starButton: {
//     padding: 8,
//   },
//   imagePicker: {
//     width: "100%",
//     height: 200,
//     backgroundColor: COLORS.inputBackground,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     overflow: "hidden",
//   },
//   previewImage: {
//     width: "100%",
//     height: "100%",
//   },
//   placeholderContainer: {
//     width: "100%",
//     height: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   placeholderText: {
//     color: COLORS.textSecondary,
//     marginTop: 8,
//   },
//   button: {
//     backgroundColor: COLORS.primary,
//     borderRadius: 12,
//     height: 50,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 16,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   buttonText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   buttonIcon: {
//     marginRight: 8,
//   },
// });



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#000',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  imageUpload: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chooseText: {
    fontSize: 16,
    color: '#000',
    marginRight: 8,
  },
  typeText: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#000',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    zIndex: 100,
    height: 56, // hoặc 60
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 8,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});


export default styles;