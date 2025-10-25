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

  // Get color for days circle (rotates through colors)
  const getDaysColor = (days: number) => {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // emerald
      '#F59E0B', // amber
      '#EF4444', // red
      '#8B5CF6', // violet
      '#EC4899', // pink
      '#06B6D4', // cyan
      '#84CC16', // lime
    ];
    return colors[days % colors.length];
  };

  // Get previous color for days circle
  const getPreviousDaysColor = (days: number) => {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // emerald
      '#F59E0B', // amber
      '#EF4444', // red
      '#8B5CF6', // violet
      '#EC4899', // pink
      '#06B6D4', // cyan
      '#84CC16', // lime
    ];
    return colors[(days - 1 + colors.length) % colors.length];
  };

  const secondsProgress = getCircleProgress(sobrietyTime.seconds, 60);
  const minutesProgress = getCircleProgress(sobrietyTime.minutes, 60);
  const hoursProgress = getCircleProgress(sobrietyTime.hours, 24);
  const daysProgress = getCircleProgress(sobrietyTime.days, 1); // Days don't reset, so always 1

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <h1 className="text-3xl font-bold mb-8">You've been sober for...</h1>
      
      <div className="relative w-80 h-80 mb-8">
        {/* Days Circle (outermost) */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getPreviousDaysColor(sobrietyTime.days)}
            strokeWidth="8"
            className="opacity-30"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getDaysColor(sobrietyTime.days)}
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - daysProgress)}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Hours Circle */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="#6B7280"
            strokeWidth="6"
            className="opacity-30"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="#8B5CF6"
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
            stroke="#6B7280"
            strokeWidth="4"
            className="opacity-30"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="none"
            stroke="#10B981"
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
            stroke="#6B7280"
            strokeWidth="3"
            className="opacity-30"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r="15"
            fill="none"
            stroke="#EF4444"
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
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{sobrietyTime.days}</div>
          <div className="text-sm text-blue-500">
            {sobrietyTime.days === 1 ? 'day' : 'days'}
          </div>
        </div>
        <div className="bg-violet-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-violet-600">{Math.floor(sobrietyTime.hours)}</div>
          <div className="text-sm text-violet-500">
            {Math.floor(sobrietyTime.hours) === 1 ? 'hour' : 'hours'}
          </div>
        </div>
        <div className="bg-emerald-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-emerald-600">{Math.floor(sobrietyTime.minutes)}</div>
          <div className="text-sm text-emerald-500">
            {Math.floor(sobrietyTime.minutes) === 1 ? 'minute' : 'minutes'}
          </div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{Math.floor(sobrietyTime.seconds)}</div>
          <div className="text-sm text-red-500">
            {Math.floor(sobrietyTime.seconds) === 1 ? 'second' : 'seconds'}
          </div>
        </div>
      </div>
    </div>
  );
}
