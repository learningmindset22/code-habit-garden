
import { HeatmapColors } from "../types";

// Define the color palette for the heatmap
export const heatmapColors: HeatmapColors = {
  none: "bg-gray-50 border-gray-200", // No study time
  low: "bg-green-50 border-green-200", // 0-2 hours
  medium: "bg-green-100 border-green-300", // 2-4 hours
  high: "bg-green-200 border-green-400", // 4-6 hours
  veryHigh: "bg-green-300 border-green-500", // 6+ hours
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

// Get emoji based on hours studied
export const getIntensityEmoji = (hoursStudied: number): string => {
  if (hoursStudied === 0) return "";
  if (hoursStudied <= 2) return "📚";
  if (hoursStudied <= 4) return "📝";
  if (hoursStudied <= 6) return "💪";
  return "🔥"; // 6+ hours
};
