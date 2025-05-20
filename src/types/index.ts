
export interface DayData {
  date: string;
  studied: boolean;
  hoursStudied: number;
  notes: string;
  justification?: string; // Added for days not studied
  mood?: string; // Added for mood tracking
  intensity?: number; // Added for heatmap intensity calculation
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

export interface HeatmapColors {
  none: string;
  low: string;
  medium: string;
  high: string;
  veryHigh: string;
}
