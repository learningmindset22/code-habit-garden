
import React, { useState, useRef, useEffect } from 'react';
import { CalendarData, MonthData, DayData } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

interface CalendarViewProps {
  calendarData: CalendarData;
  updateDay: (month: number, day: number, data: Partial<DayData>) => void;
}

// Month names
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Days of the week
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarView: React.FC<CalendarViewProps> = ({ calendarData, updateDay }) => {
  // Get current date for initial focus
  const today = new Date();
  const currentYear = 2025; // Hard-coded to 2025
  const isCurrentYear = today.getFullYear() === currentYear;
  const currentMonth = isCurrentYear ? today.getMonth() : 0; // Default to January if not 2025
  const currentDay = isCurrentYear ? today.getDate() : 1;
  
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [selectedDayInfo, setSelectedDayInfo] = useState<{month: number, day: number} | null>(null);
  
  const calendarRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);
  
  // Focus on today's day when component mounts
  useEffect(() => {
    // Scroll to current month
    scrollToMonth(currentMonth);
    
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
  
  // Handle scrolling to months
  const scrollToMonth = (index: number) => {
    if (calendarRef.current) {
      const months = calendarRef.current.querySelectorAll('.month-container');
      if (months[index]) {
        months[index].scrollIntoView({ 
          behavior: 'smooth', 
          inline: 'center'
        });
        setSelectedMonth(index);
      }
    }
  };

  // Handle next/prev month navigation
  const goToNextMonth = () => {
    const nextMonth = selectedMonth + 1;
    if (nextMonth < 12) {
      scrollToMonth(nextMonth);
    }
  };

  const goToPrevMonth = () => {
    const prevMonth = selectedMonth - 1;
    if (prevMonth >= 0) {
      scrollToMonth(prevMonth);
    }
  };
  
  // Open day dialog
  const openDayDialog = (month: number, day: number) => {
    const dayData = calendarData[month]?.days[day];
    if (dayData) {
      setSelectedDay(dayData);
      setSelectedDayInfo({ month, day });
    }
  };
  
  // Close day dialog
  const closeDayDialog = () => {
    setSelectedDay(null);
    setSelectedDayInfo(null);
  };
  
  // Save day data
  const saveDayData = () => {
    if (selectedDay && selectedDayInfo) {
      updateDay(selectedDayInfo.month, selectedDayInfo.day, {
        studied: selectedDay.studied,
        hoursStudied: selectedDay.hoursStudied,
        notes: selectedDay.notes,
        justification: selectedDay.justification
      });
      
      // Show toast message based on status
      if (selectedDay.studied) {
        if (selectedDay.hoursStudied < 1) {
          toast("Keep building your momentum! Even a little progress is still progress.", {
            icon: "👍"
          });
        } else {
          toast("Great work today! Your consistency will pay off.", {
            icon: "🎉"
          });
        }
      } else if (selectedDay.justification) {
        toast("No worries! Tomorrow is another opportunity.", {
          icon: "🌱"
        });
      }
      
      closeDayDialog();
    }
  };
  
  // Handle toggle day studied
  const handleToggleStudied = () => {
    if (selectedDay) {
      setSelectedDay({
        ...selectedDay,
        studied: !selectedDay.studied
      });
    }
  };
  
  // Handle hours studied change
  const handleHoursChange = (hours: number[]) => {
    if (selectedDay) {
      setSelectedDay({
        ...selectedDay,
        hoursStudied: hours[0]
      });
    }
  };
  
  // Handle notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedDay) {
      setSelectedDay({
        ...selectedDay,
        notes: e.target.value
      });
    }
  };
  
  // Handle justification change for non-study days
  const handleJustificationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedDay) {
      setSelectedDay({
        ...selectedDay,
        justification: e.target.value
      });
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

  return (
    <Card className="mb-8">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4 px-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Track Your Progress
          </h2>
        </div>

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4 px-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToPrevMonth} 
            disabled={selectedMonth === 0}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <h3 className="text-lg font-semibold">
            {monthNames[selectedMonth]} 2025
          </h3>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToNextMonth}
            disabled={selectedMonth === 11}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Horizontal scrolling calendar */}
        <div 
          ref={calendarRef}
          className="custom-scrollbar flex overflow-x-auto space-x-4 pb-6 px-4 scroll-snap-x"
        >
          {Object.entries(calendarData).map(([monthIndex, month]) => {
            const monthNum = parseInt(monthIndex);
            
            // Get first day of month to calculate offset
            const firstDay = new Date(2025, monthNum, 1).getDay();
            
            return (
              <div 
                key={monthNum} 
                className="month-container min-w-full md:min-w-[600px] flex-shrink-0 scroll-snap-center"
              >
                {/* Day of week headers */}
                <div className="grid grid-cols-7 mb-2">
                  {daysOfWeek.map(day => (
                    <div key={day} className="text-center text-xs text-gray-500 font-medium">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for offset */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-16 md:h-24"></div>
                  ))}
                  
                  {/* Day tiles */}
                  {Object.entries(month.days).map(([dayNum, day]) => {
                    const dayNumber = parseInt(dayNum);
                    const isToday = monthNum === currentMonth && dayNumber === currentDay;
                    
                    return (
                      <div
                        ref={isToday ? todayRef : null}
                        key={`${monthNum}-${dayNumber}`}
                        className={`relative h-16 md:h-24 p-2 rounded-lg border ${getDayStatusClass(day)} 
                          hover:border-primary hover:shadow-md transition-all cursor-pointer
                          ${isToday ? 'ring-2 ring-primary' : ''}
                        `}
                        onClick={() => openDayDialog(monthNum, dayNumber)}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`font-medium ${isToday ? 'text-primary' : ''}`}>{dayNumber}</span>
                          {day.studied && (
                            <span className="text-xs font-semibold">
                              {day.hoursStudied}h
                            </span>
                          )}
                        </div>
                        
                        <div className="absolute bottom-2 right-2">
                          {renderDayIcon(day)}
                        </div>
                        
                        {(day.notes || day.justification) && (
                          <div className="absolute bottom-2 left-2">
                            <NoteIcon className="h-3 w-3 text-gray-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Day dialog */}
        <Dialog open={!!selectedDay} onOpenChange={(open) => !open && closeDayDialog()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedDayInfo && 
                  `${monthNames[selectedDayInfo.month]} ${selectedDayInfo.day}, 2025`
                }
              </DialogTitle>
              <DialogDescription>
                Update your study progress for this day
              </DialogDescription>
            </DialogHeader>
            
            {selectedDay && (
              <div className="space-y-4 pt-2">
                {/* Studied toggle */}
                <div className="flex justify-between items-center">
                  <span className="font-medium">Did you study today?</span>
                  <Button
                    variant={selectedDay.studied ? "default" : "outline"}
                    onClick={handleToggleStudied}
                    className="w-20 h-10 transition-all"
                  >
                    {selectedDay.studied ? (
                      <span className="flex items-center">
                        <Check className="mr-1 h-4 w-4" /> Yes
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <X className="mr-1 h-4 w-4" /> No
                      </span>
                    )}
                  </Button>
                </div>
                
                {selectedDay.studied ? (
                  <>
                    {/* Hours studied slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Hours studied:</span>
                        <span className="font-medium">{selectedDay.hoursStudied} hrs</span>
                      </div>
                      <Slider
                        value={[selectedDay.hoursStudied]}
                        min={0}
                        max={12}
                        step={0.5}
                        onValueChange={handleHoursChange}
                      />
                    </div>
                    
                    {/* Notes */}
                    <div className="space-y-2">
                      <label className="font-medium">Study notes:</label>
                      <Textarea
                        placeholder="What did you learn today? Any challenges?"
                        value={selectedDay.notes || ''}
                        onChange={handleNotesChange}
                        rows={3}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Justification for not studying */}
                    <div className="space-y-2">
                      <label className="font-medium">Reason for not studying:</label>
                      <Textarea
                        placeholder="What prevented you from studying today?"
                        value={selectedDay.justification || ''}
                        onChange={handleJustificationChange}
                        rows={3}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={closeDayDialog}>
                Cancel
              </Button>
              <Button onClick={saveDayData}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

export default CalendarView;
