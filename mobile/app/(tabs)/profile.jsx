import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../assets/styles/profile.styles';

export default function Profile() {
  const { logout } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBackground} />
      <ScrollView style={styles.contentContainer}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://placekitten.com/200/200' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={20} color="#4a90e2" />
            </TouchableOpacity>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.username}>Itunuoluwa Abidoye</Text>
          <Text style={styles.handle}>@itunuoluwa</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>25</Text>
              <Text style={styles.statLabel}>Sự kiện đã tạo</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1.2k</Text>
              <Text style={styles.statLabel}>Sự kiện đã tham gia </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>348</Text>
              <Text style={styles.statLabel}>Ngày bắt đầu </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="help-circle-outline" size={22} color="#4a90e2" />
            </View>
            <Text style={styles.menuText}>Trợ giúp & Hỗ trợ</Text>
            <Ionicons name="chevron-forward" size={22} color="#95a5a6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="information-circle-outline" size={22} color="#4a90e2" />
            </View>
            <Text style={styles.menuText}>Thông tin ứng dụng</Text>
            <Ionicons name="chevron-forward" size={22} color="#95a5a6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="settings-outline" size={22} color="#4a90e2" />
            </View>
            <Text style={styles.menuText}>Cài đặt</Text>
            <Ionicons name="chevron-forward" size={22} color="#95a5a6" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

