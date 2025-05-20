
import { HeatmapColors } from "../types";

// Define a more sophisticated color palette for the heatmap
export const heatmapColors: HeatmapColors = {
  none: "bg-gray-50 border-gray-200 hover:bg-gray-100/80", // No study time
  low: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100/80", // 0-2 hours
  medium: "bg-emerald-100 border-emerald-300 hover:bg-emerald-200/80", // 2-4 hours
  high: "bg-emerald-200 border-emerald-400 hover:bg-emerald-300/80", // 4-6 hours
  veryHigh: "bg-emerald-300 border-emerald-500 hover:bg-emerald-400/80", // 6+ hours
};

// Calculate intensity class based on hours studied
export const getIntensityClass = (hoursStudied: number): keyof HeatmapColors => {
  if (hoursStudied === 0) return "none";
  if (hoursStudied <= 2) return "low";
  if (hoursStudied <= 4) return "medium";
  if (hoursStudied <= 6) return "high";
  return "veryHigh";
};

// Get color class based on intensity
export const getHeatmapColorClass = (hoursStudied: number): string => {
  const intensity = getIntensityClass(hoursStudied);
  return heatmapColors[intensity];
};

// Format hours for display
export const formatHours = (hours: number): string => {
  if (hours === 0) return "No study time";
  if (hours === 1) return "1 hour";
  return `${hours} hours`;
};

// Get emoji based on hours studied - removed as per minimalist request
export const getIntensityEmoji = (hoursStudied: number): string => {
  return ""; // Return empty string to maintain function signature without emojis
};

// Check if a date is in the past
export const isDateInPast = (dateString: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(dateString);
  return checkDate < today;
};

// Check if a date is today
export const isToday = (dateString: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(dateString);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate.getTime() === today.getTime();
};
