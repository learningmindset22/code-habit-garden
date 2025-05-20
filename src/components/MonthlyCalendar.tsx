
import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Check, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DayData } from '../types';
import DayEntryModal from './DayEntryModal';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import YearPicker from './YearPicker';

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

// Generate array of years (current year +/- 20 years)
const generateYearArray = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear - 10; year <= currentYear + 20; year++) {
    years.push(year);
  }
  return years;
};

const yearOptions = generateYearArray();

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({ calendarData, updateDay }) => {
  // Get current date for initial focus
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(2025); // Default to 2025 as in current data
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectedDayInfo, setSelectedDayInfo] = useState<{month: number, day: number, data: DayData} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
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
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  const goToPrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  // Jump to today
  const goToToday = () => {
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
  };
  
  // Handle month change
  const handleMonthChange = (value: string) => {
    setSelectedMonth(parseInt(value));
  };

  // Handle year change
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };
  
  // Open day dialog
  const openDayDialog = (month: number, day: number) => {
    // For now, we'll continue to use the 2025 data as that's what we have
    // In a full implementation, we would have data for each year/month
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

  // Extract current month data - for now using only 2025 data
  const currentMonthData = selectedYear === 2025 ? calendarData[selectedMonth] : null;
  
  // Get first day of month to calculate offset
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();

  // Get days in month
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  
  // Check if day is today
  const isToday = (dayNumber: number) => {
    const nowDate = new Date();
    return selectedYear === nowDate.getFullYear() && 
           selectedMonth === nowDate.getMonth() && 
           dayNumber === nowDate.getDate();
  };

  // Navigation shortcuts
  const goToPrevYear = () => setSelectedYear(prev => prev - 1);
  const goToNextYear = () => setSelectedYear(prev => prev + 1);
  
  return (
    <Card className="mb-8 shadow-lg border-primary/20 overflow-hidden animate-scale-in">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center text-primary">
            <Calendar className="h-6 w-6 mr-3 text-primary" />
            Study Calendar
          </h2>
          
          {/* Quick navigation buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToToday}
              className="text-xs"
            >
              Today
            </Button>
          </div>
        </div>

        {/* Month/Year navigation */}
        <div className="flex flex-wrap items-center justify-between mb-6 px-1 gap-2">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToPrevMonth}
              className="rounded-full h-10 w-10 transition-all hover:bg-primary/10 shadow-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex gap-2">
              {/* Month selector */}
              <Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Month</SelectLabel>
                    {monthNames.map((month, index) => (
                      <SelectItem key={month} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              {/* Year selector */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="min-w-[90px] flex items-center justify-between">
                    {selectedYear}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0">
                  <YearPicker 
                    selectedYear={selectedYear} 
                    onChange={handleYearChange} 
                    startYear={yearOptions[0]} 
                    endYear={yearOptions[yearOptions.length - 1]} 
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToNextMonth}
              className="rounded-full h-10 w-10 transition-all hover:bg-primary/10 shadow-sm"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Year navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevYear}
              className="text-xs flex items-center"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              {selectedYear - 1}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextYear}
              className="text-xs flex items-center"
            >
              {selectedYear + 1}
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
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
              {selectedYear === 2025 && currentMonthData ? (
                // We have data for 2025
                Object.entries(currentMonthData.days).map(([dayNum, day]) => {
                  const dayNumber = parseInt(dayNum);
                  const isTodayCell = isToday(dayNumber);
                  
                  return (
                    <div
                      ref={isTodayCell ? todayRef : null}
                      key={`${selectedMonth}-${dayNumber}`}
                      className={`relative h-16 md:h-20 p-2 rounded-xl border ${getDayStatusClass(day)} 
                        hover:shadow-md transition-all duration-200 cursor-pointer
                        ${isTodayCell ? 'ring-2 ring-primary shadow-lg scale-105' : ''}
                        hover:scale-[1.02]
                      `}
                      onClick={() => openDayDialog(selectedMonth, dayNumber)}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`font-medium ${isTodayCell ? 'text-primary' : ''}`}>{dayNumber}</span>
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
                })
              ) : (
                // Generate empty calendar for other years
                Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNumber = i + 1;
                  const isTodayCell = isToday(dayNumber);
                  
                  return (
                    <div
                      ref={isTodayCell ? todayRef : null}
                      key={`empty-day-${dayNumber}`}
                      className={`relative h-16 md:h-20 p-2 rounded-xl border border-gray-200
                        hover:shadow-sm transition-all duration-200 cursor-pointer bg-white/80
                        ${isTodayCell ? 'ring-2 ring-primary shadow-lg scale-105' : ''}
                        hover:bg-gray-50
                      `}
                      onClick={() => {}}
                    >
                      <span className={`font-medium ${isTodayCell ? 'text-primary' : ''}`}>
                        {dayNumber}
                      </span>
                    </div>
                  );
                })
              )}
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
