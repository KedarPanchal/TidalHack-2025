import { useEffect } from 'react';
import ChatInterface from '../components/ChatInterface';
import { handleRelapseDetection } from '../lib/sobrietyUtils';

export default function CheckIn() {
  // Mark check-in as completed when user sends a message
  useEffect(() => {
    const handleStorageChange = () => {
      // Check if there are messages in the check-in chat
      const checkInMessages = localStorage.getItem('chat-history-checkin');
      if (checkInMessages) {
        try {
          const messages = JSON.parse(checkInMessages);
          if (messages.length > 0) {
            // Mark this check-in window as completed
            const now = new Date();
            const currentHour = now.getHours();
            
            let currentWindow: 'morning' | 'evening';
            if (currentHour < 6) {
              currentWindow = 'evening'; // Yesterday evening
            } else if (currentHour < 18) {
              currentWindow = 'morning'; // Today morning
            } else {
              currentWindow = 'evening'; // Today evening
            }
            
            localStorage.setItem('lastCheckIn', Date.now().toString());
            localStorage.setItem('lastCheckInWindow', currentWindow);
          }
        } catch (error) {
          console.warn('Error checking check-in status:', error);
        }
      }
    };
    
    // Check initially
    handleStorageChange();
    
    // Set up an interval to check for new messages
    const interval = setInterval(handleStorageChange, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full">
      <div className="p-3 sm:p-4 border-b border-border">
        <h1 className="text-xl sm:text-2xl font-bold">Daily Check-In</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Share how you're feeling and get personalized insights</p>
      </div>
      <div className="h-[calc(100vh-200px)]">
        <ChatInterface 
          persona="checkin"
          placeholder="How are you feeling today?"
          onRelapse={handleRelapseDetection}
        />
      </div>
    </div>
  );
}
