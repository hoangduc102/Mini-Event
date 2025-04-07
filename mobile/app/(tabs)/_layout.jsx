import { Tabs } from 'expo-router'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import COLORS from '../../constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'



export default function TabsLayout() {
  const insets = useSafeAreaInsets()
  
  return (
    <Tabs
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor:  COLORS.primary,
      headerTitleStyle:{
        color: COLORS.textPrimary,
        fontWeight: "600"
      },
      headerShadowVisible: false,
      tabBarStyle: {
        backgroundColor: COLORS.cardBackground,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 5,
        paddingBottom: insets.bottom,
        height: 60 + insets.bottom,
      }
    }}
    >
      <Tabs.Screen 
        name="index"  
        options={{
          title: "Home",
          tabBarIcon: ({color, size}) => (<Ionicons name="home-outline" size={size} color={color} />)
        }}
      />
      <Tabs.Screen 
        name="events" 
        options={{
          title: 'Events',
          tabBarIcon: ({color, size}) => (<MaterialIcons name="event-available" size={size} color={color} />)
        }}
      />
      <Tabs.Screen 
        name="create"  
        options={{
          title: 'Create',
          tabBarIcon: ({color, size}) => (<Ionicons name="add-circle-outline" size={size} color={color} />)
        }}
      />
      <Tabs.Screen 
        name="search" 
        options={{
          title: 'Search',
          tabBarIcon: ({color, size}) => (<Ionicons name="search-outline" size={size} color={color} />)
        }}
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          title: 'Profile',
          tabBarIcon: ({color, size}) => (<Ionicons name="person-outline" size={size} color={color} />)
        }}
      />
    </Tabs>
  )
}