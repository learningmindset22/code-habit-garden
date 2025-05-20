
import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, ChevronDown } from 'lucide-react';
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
import CalendarDay from './CalendarDay';
import HeatmapLegend from './HeatmapLegend';

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
  for (let year = currentYear - 20; year <= currentYear + 20; year++) {
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
        
        {/* Heatmap Legend */}
        <HeatmapLegend />
        
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
                    <div key={`${selectedMonth}-${dayNumber}`} ref={isTodayCell ? todayRef : null}>
                      <CalendarDay
                        dayNumber={dayNumber}
                        day={day}
                        isTodayCell={isTodayCell}
                        onClick={() => openDayDialog(selectedMonth, dayNumber)}
                      />
                    </div>
                  );
                })
              ) : (
                // Generate empty calendar for other years
                Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNumber = i + 1;
                  const isTodayCell = isToday(dayNumber);
                  
                  return (
                    <div key={`empty-day-${dayNumber}`} ref={isTodayCell ? todayRef : null}>
                      <CalendarDay
                        dayNumber={dayNumber}
                        isTodayCell={isTodayCell}
                        onClick={() => {}}
                      />
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

export default MonthlyCalendar;
