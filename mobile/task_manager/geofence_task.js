import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { use } from 'react';
import { useAuthStore } from '../store/authStore';

const GEOFENCE_TASK = "geofence-checkin";

TaskManager.defineTask(GEOFENCE_TASK, ({ data: { eventType, region }, error }) => {
  if (error) return;
  const { checkinGPS } = useAuthStore();
  if (eventType === Location.GeofencingEventType.Enter) {
    
    const now = new Date();
    const eventTime = new Date(region.identifier);
    if (Math.abs(now - eventTime) < 15 * 60 * 1000) {
      checkinGPS(region.identifier);
    }
  }
});

