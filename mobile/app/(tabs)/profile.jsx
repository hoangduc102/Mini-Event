import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, Alert, StyleSheet } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../assets/styles/profile.styles';
import { SvgUri } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import COLORS from '../../constants/colors';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

export default function Profile() {
  const { logout, user, deleteAccount } = useAuthStore();
  const router = useRouter();

  const handleResetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('hasSeenOnboarding');
      router.replace('/(onboarding)');
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();
    if (result.success) {
      router.replace('/login');
    } else {
      Alert.alert(
        "Lỗi",
        result.error || "Không thể xóa tài khoản. Vui lòng thử lại sau."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBackground} />
      <ScrollView style={styles.contentContainer}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
          {user?.image?.endsWith('.svg') ? (
            <View style={styles.avatar}>
              <SvgUri
                width="100%"
                height="100%"
                uri={user.image}
              />
            </View>
          ) : (
            <Image 
              source={user?.image ? { uri: user.image } : require('../../assets/images/App-logo.png')}
              style={styles.avatar}
              defaultSource={require('../../assets/images/App-logo.png')}
            />
          )}
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={20} color="#4a90e2" />
            </TouchableOpacity>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.username}>{user?.username || 'No username'}</Text>
          <Text style={styles.handle}>{user?.email || 'No email'}</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.eventCreate || 0}</Text>
              <Text style={styles.statLabel}>Created Events</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.eventJoin || 0}</Text>
              <Text style={styles.statLabel}>Joined Events</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.createDay ? formatDate(user.createDay) : ''}</Text>
              <Text style={styles.statLabel}>Start Date</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="help-circle-outline" size={22} color="#4a90e2" />
            </View>
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={22} color="#95a5a6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="information-circle-outline" size={22} color="#4a90e2" />
            </View>
            <Text style={styles.menuText}>About App</Text>
            <Ionicons name="chevron-forward" size={22} color="#95a5a6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="settings-outline" size={22} color="#4a90e2" />
            </View>
            <Text style={styles.menuText}>Settings</Text>
            <Ionicons name="chevron-forward" size={22} color="#95a5a6" />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={logout}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Đăng xuất</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.deleteAccountButton}
            onPress={() => {
              Alert.alert(
                "Xóa tài khoản",
                "Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.",
                [
                  {
                    text: "Hủy",
                    style: "cancel"
                  },
                  { 
                    text: "Xóa", 
                    onPress: handleDeleteAccount,
                    style: "destructive"
                  }
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Xóa tài khoản</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.debugSection}>
          <Text style={styles.debugTitle}>Debug Tools</Text>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={handleResetOnboarding}
          >
            <Text style={styles.resetButtonText}>Reset Onboarding</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

