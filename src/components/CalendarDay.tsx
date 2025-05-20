
import React from 'react';
import { DayData } from '../types';
import { getHeatmapColorClass } from '../utils/heatmapUtils';
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
      ? 'bg-amber-50 border-amber-200' 
      : 'bg-red-50 border-red-200';
  
  // Format date for tooltip
  const formattedDate = new Date(day.date).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`relative h-16 md:h-20 p-2 rounded-xl border ${colorClass} 
              hover:shadow-md transition-all duration-200 cursor-pointer
              ${isTodayCell ? 'ring-2 ring-primary shadow-lg scale-105' : ''}
              hover:scale-[1.02]
              transform transition duration-300 ease-in-out
            `}
            onClick={onClick}
          >
            <div className="flex justify-between items-start">
              <span className={`font-medium ${isTodayCell ? 'text-primary' : ''}`}>{dayNumber}</span>
              {day.studied && (
                <div className="text-xs font-semibold bg-white/80 px-1.5 py-0.5 rounded-full shadow-sm">
                  {day.hoursStudied}h
                </div>
              )}
            </div>
            
            <div className="absolute bottom-2 right-2">
              {day.studied ? (
                <Check className="h-4 w-4 text-gray-600" />
              ) : (
                <X className="h-4 w-4 text-gray-600" />
              )}
            </div>
            
            {(day.notes || day.justification) && (
              <div className="absolute bottom-2 left-2">
                <FileText className="h-3 w-3 text-gray-500" />
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-3 max-w-xs z-50">
          <div className="flex flex-col gap-1.5">
            <p className="font-medium">{formattedDate}</p>
            <p className="text-sm">{day.studied ? `${day.hoursStudied} hours studied` : 'Not studied'}</p>
            {day.mood && <p className="text-sm">Mood: {day.mood}</p>}
            {(day.notes || day.justification) && (
              <p className="text-xs text-gray-600 max-w-full line-clamp-2">
                {day.notes || day.justification}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CalendarDay;
