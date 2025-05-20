
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Check, X, Brain, Clock, Smile, Frown, Meh, Zap } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { DayData } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DayEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayData: DayData | null;
  date: string | null;
  onSave: (data: Partial<DayData>) => void;
}

const moods = [
  { emoji: '🧠', label: 'Focused', icon: <Brain className="h-4 w-4" /> },
  { emoji: '💪', label: 'Strong', icon: <Zap className="h-4 w-4" /> },
  { emoji: '😊', label: 'Happy', icon: <Smile className="h-4 w-4" /> },
  { emoji: '😐', label: 'Neutral', icon: <Meh className="h-4 w-4" /> },
  { emoji: '😖', label: 'Struggling', icon: <Frown className="h-4 w-4" /> },
  { emoji: '💤', label: 'Tired', icon: <Clock className="h-4 w-4" /> },
];

const DayEntryModal: React.FC<DayEntryModalProps> = ({ isOpen, onClose, dayData, date, onSave }) => {
  const [localDayData, setLocalDayData] = useState<Partial<DayData> & { mood?: string }>({
    studied: false,
    hoursStudied: 0,
    notes: '',
    justification: '',
    mood: ''
  });

  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);

  useEffect(() => {
    if (dayData) {
      const wholeHours = Math.floor(dayData.hoursStudied);
      const mins = Math.round((dayData.hoursStudied - wholeHours) * 60);
      
      setHours(wholeHours);
      setMinutes(mins);
      
      setLocalDayData({
        studied: dayData.studied,
        hoursStudied: dayData.hoursStudied,
        notes: dayData.notes || '',
        justification: dayData.justification || '',
        mood: dayData.mood || '' // Add mood property if it exists
      });
    }
  }, [dayData]);

  const handleToggleStudied = () => {
    setLocalDayData(prev => ({
      ...prev,
      studied: !prev.studied
    }));
  };

  const handleHoursInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setHours(value);
    updateTotalHours(value, minutes);
  };

  const handleMinutesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setMinutes(value);
    updateTotalHours(hours, value);
  };

  const handleSliderChange = (values: number[]) => {
    const totalHours = values[0];
    const wholeHours = Math.floor(totalHours);
    const mins = Math.round((totalHours - wholeHours) * 60);
    
    setHours(wholeHours);
    setMinutes(mins);
    
    setLocalDayData(prev => ({
      ...prev,
      hoursStudied: totalHours
    }));
  };

  const updateTotalHours = (hrs: number, mins: number) => {
    const totalHours = hrs + (mins / 60);
    setLocalDayData(prev => ({
      ...prev,
      hoursStudied: parseFloat(totalHours.toFixed(2))
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalDayData(prev => ({
      ...prev,
      notes: e.target.value
    }));
  };

  const handleJustificationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalDayData(prev => ({
      ...prev,
      justification: e.target.value
    }));
  };

  const handleMoodSelect = (mood: string) => {
    setLocalDayData(prev => ({
      ...prev,
      mood
    }));
  };

  const handleSave = () => {
    onSave(localDayData);
    onClose();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-gray-50">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {formatDate(date)}
          </DialogTitle>
          <DialogDescription>
            Record your DSA learning journey for this day
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          {/* Studied toggle */}
          <div className="flex justify-between items-center">
            <span className="font-medium">Did you study today?</span>
            <Toggle
              pressed={localDayData.studied}
              onPressedChange={handleToggleStudied}
              className={`w-20 h-10 transition-all ${
                localDayData.studied 
                  ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                  : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
              }`}
            >
              {localDayData.studied ? (
                <span className="flex items-center">
                  <Check className="mr-1 h-4 w-4" /> Yes
                </span>
              ) : (
                <span className="flex items-center">
                  <X className="mr-1 h-4 w-4" /> No
                </span>
              )}
            </Toggle>
          </div>
          
          {localDayData.studied ? (
            <>
              {/* Mood selector */}
              <div className="space-y-2">
                <label className="font-medium">How did you feel today?</label>
                <div className="flex flex-wrap gap-2">
                  {moods.map((mood) => (
                    <Toggle
                      key={mood.emoji}
                      pressed={localDayData.mood === mood.emoji}
                      onPressedChange={() => handleMoodSelect(mood.emoji)}
                      className={`flex flex-col items-center justify-center h-16 w-16 p-1 rounded-lg transition-all
                        ${localDayData.mood === mood.emoji ? 'bg-primary/20 border-primary/30' : 'bg-white border-gray-200'}
                      `}
                    >
                      <span className="text-xl mb-1">{mood.emoji}</span>
                      <span className="text-xs">{mood.label}</span>
                    </Toggle>
                  ))}
                </div>
              </div>

              {/* Hours studied - numeric inputs */}
              <div className="space-y-2">
                <label className="font-medium">Time studied:</label>
                <div className="flex items-center gap-2">
                  <div className="w-20">
                    <Label htmlFor="hours">Hours</Label>
                    <Input
                      id="hours"
                      type="number"
                      min="0"
                      max="24"
                      value={hours}
                      onChange={handleHoursInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div className="w-20">
                    <Label htmlFor="minutes">Minutes</Label>
                    <Input
                      id="minutes"
                      type="number"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={handleMinutesInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
              
              {/* Hours studied slider */}
              <div className="space-y-2 bg-gray-50 p-3 rounded-lg shadow-inner">
                <div className="flex justify-between">
                  <span>Quick select:</span>
                  <span className="font-medium text-primary">
                    {hours}h {minutes > 0 ? `${minutes}m` : ''}
                  </span>
                </div>
                <Slider
                  value={[localDayData.hoursStudied || 0]}
                  min={0}
                  max={12}
                  step={0.25}
                  onValueChange={handleSliderChange}
                  className="py-4"
                />
                
                {/* Visual time bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-blue-500" 
                    style={{ width: `${Math.min(100, (localDayData.hoursStudied || 0) * 100 / 12)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0h</span>
                  <span>6h</span>
                  <span>12h</span>
                </div>
              </div>
              
              {/* Notes */}
              <div className="space-y-2">
                <label className="font-medium">Study notes:</label>
                <Textarea
                  placeholder="What did you learn today? Any challenges?"
                  value={localDayData.notes || ''}
                  onChange={handleNotesChange}
                  rows={4}
                  className="resize-none bg-white/80 border-gray-200 focus:border-primary transition-colors"
                />
              </div>
            </>
          ) : (
            <>
              {/* Mood selector for non-study days */}
              <div className="space-y-2">
                <label className="font-medium">How do you feel about missing today?</label>
                <div className="flex flex-wrap gap-2">
                  {moods.slice(2).map((mood) => (
                    <Toggle
                      key={mood.emoji}
                      pressed={localDayData.mood === mood.emoji}
                      onPressedChange={() => handleMoodSelect(mood.emoji)}
                      className={`flex flex-col items-center justify-center h-16 w-16 p-1 rounded-lg transition-all
                        ${localDayData.mood === mood.emoji ? 'bg-primary/20 border-primary/30' : 'bg-white border-gray-200'}
                      `}
                    >
                      <span className="text-xl mb-1">{mood.emoji}</span>
                      <span className="text-xs">{mood.label}</span>
                    </Toggle>
                  ))}
                </div>
              </div>
            
              {/* Justification for not studying */}
              <div className="space-y-2">
                <label className="font-medium">Reason for not studying:</label>
                <Textarea
                  placeholder="What prevented you from studying today?"
                  value={localDayData.justification || ''}
                  onChange={handleJustificationChange}
                  rows={4}
                  className="resize-none bg-white/80 border-gray-200 focus:border-primary transition-colors"
                />
              </div>
            </>
          )}
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DayEntryModal;
