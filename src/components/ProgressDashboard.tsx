
import React from 'react';
import { Circle, TrendingUp } from 'lucide-react';
import { CalendarData } from '../types';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

interface ProgressDashboardProps {
  calendarData: CalendarData;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ calendarData }) => {
  const { totalDaysStudied, totalHours, daysInYear, averageHoursPerDay, streak } = React.useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    
    let totalDaysStudied = 0;
    let totalHours = 0;
    let currentStreak = 0;
    let maxStreak = 0;
    let isStreakActive = true;
    
    // Calculate days in 2025
    const daysInYear = 365; // Not a leap year
    
    // Process data
    Object.values(calendarData).forEach(month => {
      Object.values(month.days).forEach(day => {
        if (day.studied) {
          totalDaysStudied++;
          totalHours += day.hoursStudied;
        }
      });
    });
    
    // Calculate streak (simplified - a complete implementation would check consecutive days)
    // This is a placeholder implementation
    for (let m = 0; m <= currentMonth; m++) {
      const month = calendarData[m];
      if (!month) continue;
      
      const daysToCheck = m === currentMonth ? currentDay : Object.keys(month.days).length;
      
      for (let d = 1; d <= daysToCheck; d++) {
        const day = month.days[d];
        if (day && day.studied) {
          if (isStreakActive) {
            currentStreak++;
          } else {
            // Streak was broken before, starting a new one
            currentStreak = 1;
            isStreakActive = true;
          }
        } else {
          isStreakActive = false;
          maxStreak = Math.max(maxStreak, currentStreak);
          currentStreak = 0;
        }
      }
    }
    
    // Final check for ongoing streak
    maxStreak = Math.max(maxStreak, currentStreak);
    
    // Calculate average (avoid division by zero)
    const today2025 = new Date(2025, currentMonth, currentDay);
    const startOf2025 = new Date(2025, 0, 1);
    const daysPassed = Math.floor((today2025.getTime() - startOf2025.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const averageHoursPerDay = totalDaysStudied > 0 ? (totalHours / totalDaysStudied).toFixed(1) : '0.0';
    
    return { 
      totalDaysStudied, 
      totalHours, 
      daysInYear,
      averageHoursPerDay, 
      streak: maxStreak
    };
  }, [calendarData]);
  
  const percentComplete = Math.round((totalDaysStudied / daysInYear) * 100);
  
  // Determine motivation message based on stats
  const getMotivationMessage = () => {
    if (streak >= 7) return "You're on fire! 🔥";
    if (streak >= 3) return "Keep the streak alive! 🔄";
    if (totalDaysStudied > 30) return "Consistency is key! 🔑";
    if (totalHours > 50) return "Making solid progress! 📈";
    return "Every session counts! 💪";
  };

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8 animate-slide-in">
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Days Studied</h3>
          <Circle className="h-4 w-4 text-green-500" fill="#22c55e" />
        </div>
        <div className="flex items-baseline">
          <p className="text-2xl font-bold">{totalDaysStudied}</p>
          <p className="text-sm text-gray-500 ml-2">/ {daysInYear} days</p>
        </div>
        <Progress 
          value={percentComplete} 
          className="h-2 mt-2" 
        />
        <p className="text-xs text-gray-500 mt-2">{percentComplete}% of year</p>
      </Card>
      
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Hours Studied</h3>
          <Clock className="h-4 w-4 text-blue-500" />
        </div>
        <p className="text-2xl font-bold">{totalHours.toFixed(1)}</p>
        <div className="flex items-center mt-2">
          <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
          <p className="text-xs text-gray-500">
            ~{(totalHours / 24).toFixed(1)} days of continuous learning
          </p>
        </div>
      </Card>
      
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Average Per Day</h3>
          <ChartIcon className="h-4 w-4 text-purple-500" />
        </div>
        <p className="text-2xl font-bold">{averageHoursPerDay} hrs</p>
        <p className="text-xs text-gray-500 mt-2">
          {Number(averageHoursPerDay) >= 1 
            ? "Great consistency!" 
            : "Aim for 1+ hour daily for best results"}
        </p>
      </Card>
      
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Current Streak</h3>
          <Flame className="h-4 w-4 text-orange-500" />
        </div>
        <p className="text-2xl font-bold">{streak} days</p>
        <p className="text-xs text-gray-500 mt-2">
          {getMotivationMessage()}
        </p>
      </Card>
    </div>
  );
};

// Custom icons
const Clock = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const Flame = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
  </svg>
);

const ChartIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M8 15v-5" />
    <path d="M12 15V8" />
    <path d="M16 15v-3" />
  </svg>
);

export default ProgressDashboard;
