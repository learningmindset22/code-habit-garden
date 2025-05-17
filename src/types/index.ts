
export interface DayData {
  date: string;
  studied: boolean;
  hoursStudied: number;
  notes: string;
  justification?: string; // Added for days not studied
}

export interface MonthData {
  month: number;
  year: number;
  days: Record<number, DayData>;
}

export type CalendarData = Record<number, MonthData>;

export interface AppState {
  calendarData: CalendarData;
  weeklyFocus: string;
  streakCount: number;
  showConfetti: boolean;
}

export interface StatisticsData {
  totalDaysStudied: number;
  totalDaysNotStudied: number;
  averageHoursPerDay: string;
  mostProductiveDay: string;
  mostProductiveHours: number;
  longestStreak: number;
  currentStreak: number;
}
