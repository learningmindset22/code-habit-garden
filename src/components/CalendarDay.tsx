
import React from 'react';
import { DayData } from '../types';
import { getHeatmapColorClass, isDateInPast, isToday } from '../utils/heatmapUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Check, X, FileText } from 'lucide-react';

interface CalendarDayProps {
  dayNumber: number;
  day?: DayData;
  isTodayCell: boolean;
  onClick: () => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ 
  dayNumber, 
  day, 
  isTodayCell,
  onClick
}) => {
  if (!day) {
    // Empty day for other years that don't have data
    return (
      <div
        className={`relative h-16 md:h-20 p-2 rounded-xl border border-gray-200
          hover:shadow-sm transition-all duration-200 cursor-pointer bg-white/80
          ${isTodayCell ? 'ring-2 ring-primary shadow-lg scale-105' : ''}
          hover:bg-gray-50
        `}
        onClick={onClick}
      >
        <span className={`font-medium ${isTodayCell ? 'text-primary' : ''}`}>
          {dayNumber}
        </span>
      </div>
    );
  }

  // Get color based on hours studied
  const colorClass = day.studied 
    ? getHeatmapColorClass(day.hoursStudied)
    : day.justification 
      ? 'bg-amber-50 border-amber-200 hover:bg-amber-100/80' 
      : 'bg-red-50 border-red-200 hover:bg-red-100/80';
  
  // Format date for tooltip
  const formattedDate = new Date(day.date).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Only show check/cross for past days
  const isPast = isDateInPast(day.date);
  const isDayToday = isToday(day.date);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`relative h-16 md:h-20 p-2 rounded-xl border ${colorClass} 
              hover:shadow-md transition-all duration-300 cursor-pointer
              ${isTodayCell ? 'ring-2 ring-primary shadow-lg scale-[1.03]' : ''}
              hover:scale-[1.02] group
              ${day.studied ? 'shadow-sm' : ''}
              transform transition duration-300 ease-in-out
            `}
            onClick={onClick}
          >
            <div className="flex justify-between items-start">
              <span className={`font-medium ${isTodayCell ? 'text-primary' : ''}`}>{dayNumber}</span>
              {day.studied && (
                <div className="text-xs font-medium bg-white/90 px-1.5 py-0.5 rounded-full shadow-sm group-hover:bg-white">
                  {day.hoursStudied}h
                </div>
              )}
            </div>
            
            {/* Only show status icons for past days */}
            {isPast && !isDayToday && (
              <div className="absolute bottom-2 right-2">
                {day.studied ? (
                  <div className="bg-emerald-100/80 p-1 rounded-full">
                    <Check className="h-3 w-3 text-emerald-700" />
                  </div>
                ) : (
                  <div className="bg-red-100/80 p-1 rounded-full">
                    <X className="h-3 w-3 text-red-700" />
                  </div>
                )}
              </div>
            )}
            
            {(day.notes || day.justification) && (
              <div className="absolute bottom-2 left-2">
                <div className="bg-gray-100/80 p-1 rounded-full">
                  <FileText className="h-3 w-3 text-gray-600" />
                </div>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-3 max-w-xs z-50 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
          <div className="flex flex-col gap-1.5">
            <p className="font-medium text-primary">{formattedDate}</p>
            <p className="text-sm">{day.studied ? `${day.hoursStudied} hours studied` : 'Not studied'}</p>
            {day.mood && <p className="text-sm">Mood: {day.mood}</p>}
            {(day.notes || day.justification) && (
              <p className="text-xs text-gray-600 max-w-full line-clamp-2 italic">
                "{day.notes || day.justification}"
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CalendarDay;
