import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

const EventCard = ({ title, date, location }) => (
  <View style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
    <Image 
      source={require('../../assets/images/App-logo.png')}
      style={{ width: 80, height: 80, borderRadius: 10 }}
    />
    <View style={{ marginLeft: 15, flex: 1 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{title}</Text>
      <Text style={{ color: '#666', marginTop: 5 }}>{date}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
        <Ionicons name="location-outline" size={16} color="#666" />
        <Text style={{ color: '#666', marginLeft: 5 }}>{location}</Text>
      </View>
    </View>
    <TouchableOpacity 
      style={{ 
        padding: 8, 
        borderRadius: 5, 
        borderWidth: 1, 
        borderColor: '#000',
        height: 35,
        justifyContent: 'center'
      }}
    >
      <Text style={{ fontSize: 12 }}>SHOW DETAIL</Text>
    </TouchableOpacity>
  </View>
)

const EventSection = ({ title, events, type }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming')
  
  const filteredEvents = type === 'myEvents' ? 
    events.filter(event => event.status === activeTab) :
    events

  return (
    <View style={{ marginBottom: 20 }}>
      <TouchableOpacity 
        onPress={() => setIsExpanded(!isExpanded)}
        style={{ 
          flexDirection: 'row', 
          alignItems: 'center',
          paddingVertical: 15,
          paddingHorizontal: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#eee'
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', flex: 1 }}>{title}</Text>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="black" 
        />
      </TouchableOpacity>
      
      {isExpanded && type === 'myEvents' && (
        <View style={{ 
          flexDirection: 'row', 
          padding: 10, 
          backgroundColor: '#f5f5f5',
          borderBottomWidth: 1,
          borderBottomColor: '#eee'
        }}>
          <TouchableOpacity 
            style={{ 
              flex: 1, 
              alignItems: 'center',
              paddingVertical: 8,
              backgroundColor: activeTab === 'upcoming' ? '#fff' : 'transparent',
              borderRadius: 5
            }}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={{ 
              fontWeight: activeTab === 'upcoming' ? 'bold' : 'normal',
              color: activeTab === 'upcoming' ? '#000' : '#666'
            }}>
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ 
              flex: 1, 
              alignItems: 'center',
              paddingVertical: 8,
              backgroundColor: activeTab === 'completed' ? '#fff' : 'transparent',
              borderRadius: 5
            }}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={{ 
              fontWeight: activeTab === 'completed' ? 'bold' : 'normal',
              color: activeTab === 'completed' ? '#000' : '#666'
            }}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {isExpanded && filteredEvents.map((event, index) => (
        <EventCard key={index} {...event} />
      ))}
    </View>
  )
}

export default function Events() {
  const myEvents = [
    {
      title: "Designers Meetup 2022",
      date: "03 October, 22",
      location: "Gulshan, Dhaka",
      status: "upcoming"
    },
    {
      title: "Tech Conference 2022",
      date: "15 October, 22",
      location: "Gulshan, Dhaka",
      status: "upcoming"
    },
    {
      title: "Web Summit 2022",
      date: "01 September, 22",
      location: "Gulshan, Dhaka",
      status: "completed"
    },
    {
      title: "Mobile Dev Meetup",
      date: "20 August, 22",
      location: "Gulshan, Dhaka",
      status: "completed"
    }
  ]

  const attendedEvents = [
    {
      title: "Designers Meetup 2021",
      date: "03 October, 21",
      location: "Gulshan, Dhaka"
    },
    {
      title: "Tech Conference 2021",
      date: "15 October, 21",
      location: "Gulshan, Dhaka"
    }
  ]

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
      }}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15 }}>Events</Text>
      </View>

      <ScrollView>
        <EventSection title="My Events" events={myEvents} type="myEvents" />
        <EventSection title="Events attended" events={attendedEvents} type="attended" />
      </ScrollView>
    </View>
  )
}
