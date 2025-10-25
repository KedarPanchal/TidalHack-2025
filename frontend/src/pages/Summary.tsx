import { useState, useEffect } from 'react';

interface SobrietyTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface SummaryProps {
  onNavigateToCheckIn: () => void;
}

export default function Summary({ onNavigateToCheckIn }: SummaryProps) {
  const [sobrietyTime, setSobrietyTime] = useState<SobrietyTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [needsCheckIn, setNeedsCheckIn] = useState(false);
  const [nextResetTime, setNextResetTime] = useState<string>('');

  // Load start time from localStorage on component mount
  useEffect(() => {
    const savedStartTime = localStorage.getItem('sobrietyStartTime');
    if (savedStartTime) {
      setStartTime(parseInt(savedStartTime));
    } else {
      // If no start time exists, set current time as start
      const now = Date.now();
      setStartTime(now);
      localStorage.setItem('sobrietyStartTime', now.toString());
    }
  }, []);

  // Check if user needs to check in (resets at 6AM and 6PM)
  useEffect(() => {
    const checkCheckInStatus = () => {
      const now = new Date();
      const currentHour = now.getHours();
      
      // Determine the current check-in window
      let currentWindow: 'morning' | 'evening';
      if (currentHour < 6) {
        currentWindow = 'evening'; // Yesterday evening (waiting for 6AM)
      } else if (currentHour < 18) {
        currentWindow = 'morning'; // Today morning (waiting for 6PM)
      } else {
        currentWindow = 'evening'; // Today evening (waiting for 6AM next day)
      }
      
      // Get the last check-in timestamp
      const lastCheckIn = localStorage.getItem('lastCheckIn');
      const lastCheckInWindowSaved = localStorage.getItem('lastCheckInWindow') as 'morning' | 'evening' | null;
      
      // Calculate next reset time
      const nextReset = new Date(now);
      if (currentHour < 6) {
        // Next reset is at 6AM today
        nextReset.setHours(6, 0, 0, 0);
      } else if (currentHour < 18) {
        // Next reset is at 6PM today
        nextReset.setHours(18, 0, 0, 0);
      } else {
        // Next reset is at 6AM tomorrow
        nextReset.setDate(nextReset.getDate() + 1);
        nextReset.setHours(6, 0, 0, 0);
      }
      
      setNextResetTime(nextReset.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }));
      
      // If no check-in recorded or window changed, user needs to check in
      if (!lastCheckIn || lastCheckInWindowSaved !== currentWindow) {
        setNeedsCheckIn(true);
      } else {
        setNeedsCheckIn(false);
      }
    };
    
    checkCheckInStatus();
    // Check every minute to update status at 6AM and 6PM
    const interval = setInterval(checkCheckInStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Update timer with different frequencies for smooth seconds vs pulsed others
  useEffect(() => {
    if (!startTime) return;

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000; // elapsed seconds (with decimals)

      const days = Math.floor(elapsed / 86400);
      const hours = Math.floor((elapsed % 86400) / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);
      const seconds = elapsed % 60;

      setSobrietyTime({ days, hours, minutes, seconds });
    };

    updateTimer(); // Initial update
    const interval = setInterval(updateTimer, 16); // ~60fps for smooth seconds animation

    return () => clearInterval(interval);
  }, [startTime]);

  // Calculate circle progress (0-1) - clockwise filling
  const getCircleProgress = (value: number, max: number) => {
    return Math.min(value / max, 1);
  };

  // Cool/calm color palette (all different from each other)
  const coolColors = [
    '#A7C4A0', // sage green
    '#90AFC5', // powder blue
    '#B8C5DB', // lavender blue
    '#BBD2C5', // mint green
    '#A8C8EC', // sky blue
    '#C7D9D0', // dusty mint
    '#9CB4B8', // blue-grey
    '#B3A9C0', // dusty purple
    '#A5C5B7', // sea green
    '#C4B5CA', // soft purple
  ];

  // Days: complete every 30 days, accumulate filled circles
  const getDaysCircleData = (days: number) => {
    const completedCycles = Math.floor(days / 30);
    const currentProgress = (days % 30) / 30;
    
    return {
      completedCycles,
      currentProgress,
      colors: coolColors,
    };
  };

  const daysData = getDaysCircleData(sobrietyTime.days);
  const secondsProgress = getCircleProgress(sobrietyTime.seconds, 60);
  const minutesProgress = getCircleProgress(sobrietyTime.minutes, 60);
  const hoursProgress = getCircleProgress(sobrietyTime.hours, 24);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-foreground text-center px-2">You've been sober for...</h1>
      
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 mb-4 sm:mb-6 md:mb-8">
        {/* Days Circle (outermost) - with multiple filled layers */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
            className="opacity-50 dark:stroke-gray-600"
            strokeLinecap="round"
          />
          
          {/* Completed cycles (fully filled circles) */}
          {Array.from({ length: Math.min(daysData.completedCycles, daysData.colors.length) }).map((_, index) => (
            <circle
              key={`completed-${index}`}
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={daysData.colors[index % daysData.colors.length]}
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
          ))}
          
          {/* Current progress circle */}
          {daysData.currentProgress > 0 && (
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={daysData.colors[daysData.completedCycles % daysData.colors.length]}
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - daysData.currentProgress)}`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          )}
        </svg>

        {/* Hours Circle */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="6"
            className="opacity-50 dark:stroke-gray-600"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="#90AFC5"
            strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 35}`}
            strokeDashoffset={`${2 * Math.PI * 35 * (1 - hoursProgress)}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Minutes Circle */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="4"
            className="opacity-50 dark:stroke-gray-600"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="none"
            stroke="#B8C5DB"
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 25}`}
            strokeDashoffset={`${2 * Math.PI * 25 * (1 - minutesProgress)}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Seconds Circle (innermost) */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="15"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="3"
            className="opacity-50 dark:stroke-gray-600"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r="15"
            fill="none"
            stroke="#BBD2C5"
            strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 15}`}
            strokeDashoffset={`${2 * Math.PI * 15 * (1-secondsProgress)}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            {sobrietyTime.days}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            {sobrietyTime.days === 1 ? 'day' : 'days'}
          </div>
        </div>
      </div>

      {/* Time display */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 text-center w-full max-w-md">
        <div className="p-2 sm:p-3 rounded-lg" style={{ backgroundColor: '#A7C4A0', color: '#FFFFFF' }}>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">{sobrietyTime.days}</div>
          <div className="text-xs sm:text-sm text-white">
            {sobrietyTime.days === 1 ? 'day' : 'days'}
          </div>
        </div>
        <div className="p-2 sm:p-3 rounded-lg" style={{ backgroundColor: '#90AFC5', color: '#FFFFFF' }}>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">{Math.floor(sobrietyTime.hours)}</div>
          <div className="text-xs sm:text-sm text-white">
            {Math.floor(sobrietyTime.hours) === 1 ? 'hour' : 'hours'}
          </div>
        </div>
        <div className="p-2 sm:p-3 rounded-lg" style={{ backgroundColor: '#B8C5DB', color: '#FFFFFF' }}>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">{Math.floor(sobrietyTime.minutes)}</div>
          <div className="text-xs sm:text-sm text-white">
            {Math.floor(sobrietyTime.minutes) === 1 ? 'minute' : 'minutes'}
          </div>
        </div>
        <div className="p-2 sm:p-3 rounded-lg" style={{ backgroundColor: '#BBD2C5', color: '#FFFFFF' }}>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">{Math.floor(sobrietyTime.seconds)}</div>
          <div className="text-xs sm:text-sm text-white">
            {Math.floor(sobrietyTime.seconds) === 1 ? 'second' : 'seconds'}
          </div>
        </div>
      </div>

      {/* Check-in reminder */}
      {needsCheckIn ? (
        <div className="mt-4 sm:mt-6 md:mt-8 w-full max-w-md mx-auto px-2">
          <button
            onClick={onNavigateToCheckIn}
            className="w-full p-3 sm:p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            style={{ 
              backgroundColor: '#90AFC5', 
              color: '#FFFFFF',
              border: '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#7A9FB5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#90AFC5';
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse flex-shrink-0"></div>
                <div className="text-left">
                  <div className="font-semibold text-sm sm:text-base md:text-lg">Time for your check-in!</div>
                  <div className="text-xs sm:text-sm opacity-90">Share how you're feeling</div>
                </div>
              </div>
              <svg 
                className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </div>
          </button>
        </div>
      ) : (
        <div className="mt-4 sm:mt-6 md:mt-8 w-full max-w-md mx-auto px-2">
          <div
            className="w-full p-3 sm:p-4 rounded-lg shadow-md"
            style={{ 
              backgroundColor: '#A7C4A0', 
              color: '#FFFFFF'
            }}
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <svg 
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <div className="text-center">
                <div className="font-semibold text-sm sm:text-base md:text-lg">You've already checked in!</div>
                <div className="text-xs sm:text-sm opacity-90">Be sure to come back at {nextResetTime}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

