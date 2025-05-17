
export interface DayData {
  date: string;
  studied: boolean;
  hoursStudied: number;
  notes: string;
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
