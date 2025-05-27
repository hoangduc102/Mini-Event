// // app/GuestList.jsx
// import React from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
// import { Ionicons, MaterialIcons } from '@expo/vector-icons';
// import styles from '../../assets/styles/addGuest.style';

// export default function GuestList() {
//   const guests = [
//     { name: 'Aman Gupta', status: 'Pending', contribution: 'Bringing drinks', icon: 'help-circle-outline', color: 'orange' },
//     { name: 'Swagat Tiwari', status: 'Canceled', contribution: '', icon: 'close', color: 'red' },
//     { name: 'Dave Johnson', status: 'Confirmed', contribution: 'Bringing snacks', icon: 'checkmark', color: 'green' },
//   ];

//   return (
//     <ScrollView style={styles.container}>
//       {/* Header */}
//       <TouchableOpacity style={styles.backButton}>
//         <Ionicons name="chevron-back" size={24} color="#000" />
//       </TouchableOpacity>

//       <Text style={styles.title}>Guests</Text>



//       {/* Search */}
//       <Text style={styles.sectionTitle}>Add Guests from Contact List</Text>
//       <View style={styles.searchContainer}>
//         <Ionicons name="search" size={18} color="#aaa" />
//         <TextInput style={styles.searchInput} placeholder="Enter Name or Mobile Number" />
//         <MaterialIcons name="contacts" size={20} color="#999" style={{ marginRight: 8 }} />
//         <Ionicons name="call-outline" size={20} color="#999" />
//       </View>

//       {/* Guest List */}
//       <Text style={styles.subHeading}>Guest List</Text>
//       <Text style={styles.smallText}>Availability and Contributions</Text>

//       {guests.map((guest, index) => (
//         <View key={index} style={styles.guestItem}>
//           <View style={styles.avatar} />
//           <View style={styles.guestInfo}>
//             <Text style={styles.guestName}>{guest.name}</Text>
//             <View style={styles.statusRow}>
//               <Text style={styles.statusText(guest.color)}>{guest.status}</Text>
//               <Ionicons name={guest.icon} size={14} color={guest.color} style={{ marginLeft: 4 }} />
//             </View>
//           </View>
//           {guest.contribution !== '' && (
//             <Text style={styles.contribution}>{guest.contribution}</Text>
//           )}
//         </View>
//       ))}

//       {/* Action Buttons */}
//       <TouchableOpacity style={styles.outlineButton}>
//         <Text style={styles.outlineButtonText}>Send Invitations</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.outlineButton}>
//         <Text style={styles.outlineButtonText}>Edit Contributions</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.primaryButton}>
//         <Text style={styles.primaryButtonText}>Send Reminders</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// app/GuestList.jsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from '../../assets/styles/addGuest.style';
import { useRouter } from 'expo-router';

export default function GuestList() {
  const router = useRouter();

  const guests = [
    { name: 'Aman Gupta', status: 'Pending', contribution: 'Bringing drinks', icon: 'help-circle-outline', color: 'orange' },
    { name: 'Swagat Tiwari', status: 'Canceled', contribution: '', icon: 'close', color: 'red' },
    { name: 'Dave Johnson', status: 'Confirmed', contribution: 'Bringing snacks', icon: 'checkmark', color: 'green' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Guests</Text>
      </View>

      {/* Search */}
      <Text style={styles.sectionTitle}>Add Guests from Contact List</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#aaa" />
        <TextInput style={styles.searchInput} placeholder="Enter Name or Mobile Number" />
        <MaterialIcons name="contacts" size={20} color="#999" style={{ marginRight: 8 }} />
        <Ionicons name="call-outline" size={20} color="#999" />
      </View>

      {/* Guest List */}
      <Text style={styles.subHeading}>Guest List</Text>
      <Text style={styles.smallText}>Availability and Contributions</Text>

      {guests.map((guest, index) => (
        <View key={index} style={styles.guestItem}>
          <View style={styles.avatar} />
          <View style={styles.guestInfo}>
            <Text style={styles.guestName}>{guest.name}</Text>
            <View style={styles.statusRow}>
              <Text style={styles.statusText(guest.color)}>{guest.status}</Text>
              <Ionicons name={guest.icon} size={14} color={guest.color} style={{ marginLeft: 4 }} />
            </View>
          </View>
          {guest.contribution !== '' && (
            <Text style={styles.contribution}>{guest.contribution}</Text>
          )}
        </View>
      ))}

      {/* Action Buttons */}
      <TouchableOpacity style={styles.outlineButton}>
        <Text style={styles.outlineButtonText}>Send Invitations</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.outlineButton}>
        <Text style={styles.outlineButtonText}>Edit Contributions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Send Reminders</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

