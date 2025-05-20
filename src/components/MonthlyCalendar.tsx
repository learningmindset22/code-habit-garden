import React, { useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DayData } from '../types';
import DayEntryModal from './DayEntryModal';

interface MonthlyCalendarProps {
  calendarData: Record<number, {
    month: number;
    year: number;
    days: Record<number, DayData>;
  }>;
  updateDay: (month: number, day: number, data: Partial<DayData>) => void;
}

// Month names
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Days of the week
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({ calendarData, updateDay }) => {
  // Get current date for initial focus
  const today = new Date();
  const currentYear = 2025; // Hard-coded to 2025
  const isCurrentYear = today.getFullYear() === currentYear;
  const currentMonth = isCurrentYear ? today.getMonth() : 0; // Default to January if not 2025
  const currentDay = isCurrentYear ? today.getDate() : 1;
  
  const [selectedMonth, setSelectedMonth] = React.useState<number>(currentMonth);
  const [selectedDayInfo, setSelectedDayInfo] = React.useState<{month: number, day: number, data: DayData} | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  
  const calendarRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);
  
  // Focus on today's day when component mounts
  useEffect(() => {    
    // Focus on today's cell (with a delay to ensure rendering is complete)
    setTimeout(() => {
      if (todayRef.current) {
        todayRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 500);
  }, []);
  
  // Handle next/prev month navigation
  const goToNextMonth = () => {
    const nextMonth = selectedMonth + 1;
    if (nextMonth < 12) {
      setSelectedMonth(nextMonth);
    }
  };

  const goToPrevMonth = () => {
    const prevMonth = selectedMonth - 1;
    if (prevMonth >= 0) {
      setSelectedMonth(prevMonth);
    }
  };
  
  // Open day dialog
  const openDayDialog = (month: number, day: number) => {
    const dayData = calendarData[month]?.days[day];
    if (dayData) {
      setSelectedDayInfo({ month, day, data: dayData });
      setIsModalOpen(true);
    }
  };
  
  // Close day dialog
  const closeDayDialog = () => {
    setIsModalOpen(false);
    setSelectedDayInfo(null);
  };
  
  // Save day data
  const handleSaveDayData = (data: Partial<DayData>) => {
    if (selectedDayInfo) {
      updateDay(selectedDayInfo.month, selectedDayInfo.day, data);
    }
  };
  
  // Get day status class
  const getDayStatusClass = (day: DayData) => {
    const isPast = new Date(day.date) < new Date();
    
    if (!day.studied && isPast) return 'day-missed';
    if (!day.studied) return 'day-future';
    if (day.hoursStudied < 1) return 'day-partial';
    return 'day-studied';
  };

  // Get day icon
  const renderDayIcon = (day: DayData) => {
    if (day.studied) {
      return <Check className="h-4 w-4 text-green-600" />;
    } else if (day.justification) {
      return <X className="h-4 w-4 text-amber-600" />;
    } 
    return null;
  };

  // Extract current month data
  const currentMonthData = calendarData[selectedMonth];
  
  // Get first day of month to calculate offset
  const firstDay = new Date(2025, selectedMonth, 1).getDay();
  
  return (
    <Card className="mb-8 shadow-lg border-primary/20 overflow-hidden animate-scale-in">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center text-primary">
            <Calendar className="h-6 w-6 mr-3 text-primary" />
            Study Calendar
          </h2>
        </div>

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-6 px-1">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToPrevMonth} 
            disabled={selectedMonth === 0}
            className="rounded-full h-10 w-10 transition-all hover:bg-primary/10 shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {monthNames[selectedMonth]} 2025
          </h3>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToNextMonth}
            disabled={selectedMonth === 11}
            className="rounded-full h-10 w-10 transition-all hover:bg-primary/10 shadow-sm"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Legend */}
        <div className="flex gap-3 mb-4 justify-end">
          <div className="flex items-center gap-1 text-xs">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Studied</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span>Missed</span>
          </div>
        </div>
        
        {/* Calendar view */}
        <div 
          ref={calendarRef}
          className="custom-scrollbar"
        >
          <div className="month-container w-full">
            {/* Day of week headers */}
            <div className="grid grid-cols-7 mb-4">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center font-medium text-sm text-gray-600 py-1 rounded-md bg-gray-50/50">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {/* Empty cells for offset */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16 md:h-20"></div>
              ))}
              
              {/* Day tiles */}
              {currentMonthData && Object.entries(currentMonthData.days).map(([dayNum, day]) => {
                const dayNumber = parseInt(dayNum);
                const isToday = selectedMonth === currentMonth && dayNumber === currentDay;
                
                return (
                  <div
                    ref={isToday ? todayRef : null}
                    key={`${selectedMonth}-${dayNumber}`}
                    className={`relative h-16 md:h-20 p-2 rounded-xl border ${getDayStatusClass(day)} 
                      hover:shadow-md transition-all duration-200 cursor-pointer
                      ${isToday ? 'ring-2 ring-primary shadow-lg scale-105' : ''}
                      hover:scale-[1.02]
                    `}
                    onClick={() => openDayDialog(selectedMonth, dayNumber)}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`font-medium ${isToday ? 'text-primary' : ''}`}>{dayNumber}</span>
                      {day.studied && (
                        <span className="text-xs font-semibold bg-white/80 px-1.5 py-0.5 rounded-full shadow-sm">
                          {day.hoursStudied}h
                        </span>
                      )}
                    </div>
                    
                    <div className="absolute bottom-2 right-2">
                      {renderDayIcon(day)}
                    </div>
                    
                    {(day.notes || day.justification) && (
                      <div className="absolute bottom-2 left-2">
                        <NoteIcon className="h-3 w-3 text-gray-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Day entry modal */}
        <DayEntryModal 
          isOpen={isModalOpen} 
          onClose={closeDayDialog}
          dayData={selectedDayInfo?.data || null}
          date={selectedDayInfo?.data?.date || null}
          onSave={handleSaveDayData}
        />
      </CardContent>
    </Card>
  );
};

// Note icon
const NoteIcon = (props: any) => (
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
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
    <line x1="9" y1="9" x2="10" y2="9" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="15" y2="17" />
  </svg>
);

export default MonthlyCalendar;
