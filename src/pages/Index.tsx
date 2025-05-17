
import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import ProgressDashboard from '../components/ProgressDashboard';
import WeeklyFocus from '../components/WeeklyFocus';
import Statistics from '../components/Statistics';
import Confetti from '../components/Confetti';
import MonthlyCalendar from '../components/MonthlyCalendar';
import StudyNotesView from '../components/StudyNotesView';
import MotivationalQuote from '../components/MotivationalQuote';
import { CalendarData, DayData, AppState } from '../types';
import { initializeCalendarData, calculateStreak, checkReminder } from '../utils/calendarUtils';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Calendar as CalendarIcon, BarChart, FileText } from 'lucide-react';

const Index = () => {
  // Initialize app state
  const [appState, setAppState] = useState<AppState>({
    calendarData: {},
    weeklyFocus: '',
    streakCount: 0,
    showConfetti: false
  });
  
  const [reminderDismissed, setReminderDismissed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('calendar');
  
  // Load data from localStorage on first render
  useEffect(() => {
    const savedData = localStorage.getItem('dsaTrackerData');
    
    if (savedData) {
      try {
        const parsedData: AppState = JSON.parse(savedData);
        setAppState(parsedData);
      } catch (error) {
        console.error('Failed to parse saved data:', error);
        // Initialize with empty data if parsing fails
        setAppState({
          calendarData: initializeCalendarData(),
          weeklyFocus: '',
          streakCount: 0,
          showConfetti: false
        });
      }
    } else {
      // No saved data, initialize with empty data
      setAppState({
        calendarData: initializeCalendarData(),
        weeklyFocus: '',
        streakCount: 0,
        showConfetti: false
      });
    }
  }, []);
  
  // Save data to localStorage when state changes
  useEffect(() => {
    if (Object.keys(appState.calendarData).length > 0) {
      localStorage.setItem('dsaTrackerData', JSON.stringify(appState));
    }
  }, [appState]);
  
  // Update a day's data
  const updateDay = (month: number, day: number, data: Partial<DayData>) => {
    setAppState(prevState => {
      const newCalendarData = { ...prevState.calendarData };
      
      if (newCalendarData[month] && newCalendarData[month].days[day]) {
        newCalendarData[month].days[day] = {
          ...newCalendarData[month].days[day],
          ...data
        };
        
        // Check for streak after update
        const newStreak = calculateStreak(newCalendarData);
        const oldStreak = prevState.streakCount;
        
        // Show confetti if streak hits 7 days or multiples of 7
        const showConfetti = newStreak >= 7 && newStreak % 7 === 0 && newStreak > oldStreak;
        
        if (showConfetti) {
          // Show a special toast for the streak
          toast(`🔥 ${newStreak} day streak achieved! Keep it up!`, {
            duration: 5000
          });
        }
        
        return {
          ...prevState,
          calendarData: newCalendarData,
          streakCount: newStreak,
          showConfetti
        };
      }
      
      return prevState;
    });
  };
  
  // Update weekly focus
  const updateWeeklyFocus = (focus: string) => {
    setAppState(prevState => ({
      ...prevState,
      weeklyFocus: focus
    }));
    
    toast("Weekly focus updated successfully!", {
      duration: 3000
    });
  };
  
  // Hide confetti after animation
  const hideConfetti = () => {
    setAppState(prevState => ({
      ...prevState,
      showConfetti: false
    }));
  };

  // Check if reminder should show
  const shouldShowReminder = checkReminder(appState.calendarData) && !reminderDismissed;
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6">
        {/* Motivational Quote */}
        <MotivationalQuote />
        
        {/* Reminder Alert */}
        {shouldShowReminder && (
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <AlertDescription className="flex justify-between items-center">
              <span>📝 It's been 3+ days since your last study session. Ready to get back on track?</span>
              <button 
                onClick={() => setReminderDismissed(true)}
                className="p-1 rounded-full hover:bg-amber-100"
              >
                <X className="h-4 w-4" />
              </button>
            </AlertDescription>
          </Alert>
        )}
        
        <HeroSection />
        
        {/* Progress Dashboard */}
        <ProgressDashboard calendarData={appState.calendarData} />
        
        {/* Weekly Focus */}
        <WeeklyFocus 
          weeklyFocus={appState.weeklyFocus}
          updateWeeklyFocus={updateWeeklyFocus}
        />
        
        {/* Tabs for Calendar, Statistics and Notes */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="calendar" className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" /> Calendar
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center">
              <BarChart className="w-4 h-4 mr-2" /> Statistics
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" /> Study Notes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="animate-fade-in">
            <MonthlyCalendar 
              calendarData={appState.calendarData}
              updateDay={updateDay}
            />
          </TabsContent>
          
          <TabsContent value="statistics" className="animate-fade-in">
            <Statistics calendarData={appState.calendarData} />
          </TabsContent>
          
          <TabsContent value="notes" className="animate-fade-in">
            <StudyNotesView calendarData={appState.calendarData} />
          </TabsContent>
        </Tabs>
        
        {/* Confetti effect */}
        <Confetti 
          show={appState.showConfetti}
          onComplete={hideConfetti}
        />
      </div>
    </div>
  );
};

export default Index;
