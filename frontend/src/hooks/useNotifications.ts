import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

export function useNotifications() {
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        // Request permission first
        const permission = await LocalNotifications.requestPermissions();
        
        if (permission.display === 'granted') {
          // Cancel any existing notifications
          await LocalNotifications.cancel({ notifications: [] });
          
          // Get current date and set up next 6AM and 6PM
          const now = new Date();
          const morning6 = new Date();
          morning6.setHours(6, 0, 0, 0);
          
          const evening6 = new Date();
          evening6.setHours(18, 0, 0, 0);
          
          // If current time is past 6AM, schedule for tomorrow's 6AM
          if (now.getHours() >= 6 && now.getHours() < 18) {
            morning6.setDate(morning6.getDate() + 1);
          }
          
          // If current time is past 6PM, schedule for tomorrow
          if (now.getHours() >= 18) {
            evening6.setDate(evening6.getDate() + 1);
            morning6.setDate(morning6.getDate() + 1);
          }
          
          // Schedule notifications for 6AM and 6PM daily
          await LocalNotifications.schedule({
            notifications: [
              {
                title: 'Time for your morning check-in! 🌅',
                body: 'Share how you\'re feeling and stay on track',
                id: 1,
                schedule: {
                  repeats: true,
                  every: 'day',
                  on: {
                    hour: 6,
                    minute: 0,
                  },
                },
                sound: 'default',
              },
              {
                title: 'Time for your evening check-in! 🌙',
                body: 'Reflect on your day and stay strong',
                id: 2,
                schedule: {
                  repeats: true,
                  every: 'day',
                  on: {
                    hour: 18,
                    minute: 0,
                  },
                },
                sound: 'default',
              },
            ],
          });
        }
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    // Only run on native platforms
    if (typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform()) {
      setupNotifications();
    }
  }, []);

  return {};
}
