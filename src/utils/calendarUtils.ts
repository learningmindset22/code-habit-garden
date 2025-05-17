
import { CalendarData, DayData } from '../types';

// Initialize calendar data for 2025
export function initializeCalendarData(): CalendarData {
  const calendarData: CalendarData = {};
  
  // Loop through months (0-11)
  for (let month = 0; month < 12; month++) {
    // Get days in month
    const daysInMonth = getDaysInMonth(2025, month);
    
    const monthData = {
      month,
      year: 2025,
      days: {} as Record<number, DayData>
    };
    
    // Create data for each day
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(2025, month, day);
      
      monthData.days[day] = {
        date: date.toISOString().split('T')[0],
        studied: false,
        hoursStudied: 0,
        notes: '',
        justification: ''
      };
    }
    
    calendarData[month] = monthData;
  }
  
  return calendarData;
}

// Get days in month
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// Calculate streak from calendar data
export function calculateStreak(calendarData: CalendarData): number {
  const today = new Date();
  let currentStreak = 0;
  
  // Start from today and go backward
  for (let d = today.getDate(); d >= 1; d--) {
    const month = today.getMonth();
    const day = calendarData[month]?.days[d];
    
    if (day?.studied) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  // Loop through previous months
  for (let m = today.getMonth() - 1; m >= 0; m--) {
    const daysInMonth = getDaysInMonth(today.getFullYear(), m);
    
    for (let d = daysInMonth; d >= 1; d--) {
      const day = calendarData[m]?.days[d];
      
      if (day?.studied) {
        currentStreak++;
      } else {
        return currentStreak;
      }
    }
  }
  
  return currentStreak;
}

// Check if we need to show the reminder
export function checkReminder(calendarData: CalendarData): boolean {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  
  // Check last 3 days
  for (let i = 0; i < 3; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(currentDay - i);
    
    if (checkDate.getMonth() === currentMonth) {
      const day = calendarData[currentMonth]?.days[checkDate.getDate()];
      if (day?.studied) {
        // Found a studied day in the last 3 days
        return false;
      }
    }
  }
  
  // No studied days found in the last 3 days
  return true;
}

// Get statistics for a given time period
export function getStatistics(calendarData: CalendarData) {
  let totalDaysStudied = 0;
  let totalHours = 0;
  let mostProductiveDay = '';
  let mostProductiveHours = 0;
  
  // Process all days
  Object.values(calendarData).forEach(month => {
    Object.values(month.days).forEach(day => {
      if (day.studied) {
        totalDaysStudied++;
        totalHours += day.hoursStudied;
        
        if (day.hoursStudied > mostProductiveHours) {
          mostProductiveHours = day.hoursStudied;
          mostProductiveDay = day.date;
        }
      }
    });
  });
  
  // Calculate average (avoid division by zero)
  const averageHoursPerDay = totalDaysStudied > 0 ? 
    (totalHours / totalDaysStudied).toFixed(1) : '0.0';
    
  return {
    totalDaysStudied,
    totalHours,
    averageHoursPerDay,
    mostProductiveDay: mostProductiveDay ? new Date(mostProductiveDay).toLocaleDateString() : 'None',
    mostProductiveHours
  };
}
