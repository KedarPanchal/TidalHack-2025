import { useState, useEffect } from 'react';

interface SobrietyTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Summary() {
  const [sobrietyTime, setSobrietyTime] = useState<SobrietyTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [startTime, setStartTime] = useState<number | null>(null);

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
    <div className="flex flex-col items-center justify-center h-full p-6">
      <h1 className="text-3xl font-bold mb-8">You've been sober for...</h1>
      
      <div className="relative w-80 h-80 mb-8">
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
            className="opacity-50"
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
            className="opacity-50"
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
            className="opacity-50"
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
            className="opacity-50"
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
          <div className="text-4xl font-bold text-gray-800">
            {sobrietyTime.days}
          </div>
          <div className="text-sm text-gray-600">
            {sobrietyTime.days === 1 ? 'day' : 'days'}
          </div>
        </div>
      </div>

      {/* Time display */}
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="p-3 rounded-lg" style={{ backgroundColor: '#A7C4A0', color: '#FFFFFF' }}>
          <div className="text-2xl font-bold">{sobrietyTime.days}</div>
          <div className="text-sm text-white">
            {sobrietyTime.days === 1 ? 'day' : 'days'}
          </div>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: '#90AFC5', color: '#FFFFFF' }}>
          <div className="text-2xl font-bold">{Math.floor(sobrietyTime.hours)}</div>
          <div className="text-sm text-white">
            {Math.floor(sobrietyTime.hours) === 1 ? 'hour' : 'hours'}
          </div>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: '#B8C5DB', color: '#FFFFFF' }}>
          <div className="text-2xl font-bold">{Math.floor(sobrietyTime.minutes)}</div>
          <div className="text-sm text-white">
            {Math.floor(sobrietyTime.minutes) === 1 ? 'minute' : 'minutes'}
          </div>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: '#BBD2C5', color: '#FFFFFF' }}>
          <div className="text-2xl font-bold">{Math.floor(sobrietyTime.seconds)}</div>
          <div className="text-sm text-white">
            {Math.floor(sobrietyTime.seconds) === 1 ? 'second' : 'seconds'}
          </div>
        </div>
      </div>
    </div>
  );
}

