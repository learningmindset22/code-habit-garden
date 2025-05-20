import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Check, X } from 'lucide-react';
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
  { emoji: '🧠', label: 'Focused' },
  { emoji: '💪', label: 'Strong' },
  { emoji: '😊', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😖', label: 'Struggling' },
  { emoji: '💤', label: 'Tired' },
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
        mood: dayData.mood || ''
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
      <DialogContent className="sm:max-w-md md:max-w-sm bg-white">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {formatDate(date)}
          </DialogTitle>
          <DialogDescription>
            Record your DSA learning for this day
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          {/* Studied toggle */}
          <div className="flex justify-between items-center">
            <span className="font-medium">Did you study today?</span>
            <Toggle
              pressed={localDayData.studied}
              onPressedChange={handleToggleStudied}
              className={`w-16 h-8 transition-all ${
                localDayData.studied 
                  ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                  : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
              }`}
            >
              {localDayData.studied ? (
                <Check className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Toggle>
          </div>
          
          {localDayData.studied ? (
            <>
              {/* Mood selector - simplified */}
              <div className="space-y-2">
                <label className="font-medium">How did you feel today?</label>
                <div className="flex flex-wrap gap-2">
                  {moods.map((mood) => (
                    <Toggle
                      key={mood.emoji}
                      pressed={localDayData.mood === mood.emoji}
                      onPressedChange={() => handleMoodSelect(mood.emoji)}
                      className={`h-10 px-3 rounded-lg transition-all
                        ${localDayData.mood === mood.emoji ? 'bg-primary/20 border-primary/30' : 'bg-white border-gray-200'}
                      `}
                    >
                      <span className="text-sm">{mood.emoji} {mood.label}</span>
                    </Toggle>
                  ))}
                </div>
              </div>

              {/* Hours studied - more compact layout */}
              <div className="space-y-2">
                <label className="font-medium">Time studied:</label>
                <div className="flex items-center gap-2">
                  <div className="w-1/2">
                    <div className="flex items-center gap-2">
                      <Input
                        id="hours"
                        type="number"
                        min="0"
                        max="24"
                        value={hours}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          setHours(value);
                          updateTotalHours(value, minutes);
                        }}
                        className="w-20"
                      />
                      <span>h</span>
                      <Input
                        id="minutes"
                        type="number"
                        min="0"
                        max="59"
                        value={minutes}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          setMinutes(value);
                          updateTotalHours(hours, value);
                        }}
                        className="w-20"
                      />
                      <span>m</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Slider for quick selection */}
              <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Quick select:</span>
                  <span className="font-medium">
                    {hours}h {minutes > 0 ? `${minutes}m` : ''}
                  </span>
                </div>
                <Slider
                  value={[localDayData.hoursStudied || 0]}
                  min={0}
                  max={12}
                  step={0.25}
                  onValueChange={(values) => {
                    const totalHours = values[0];
                    const wholeHours = Math.floor(totalHours);
                    const mins = Math.round((totalHours - wholeHours) * 60);
                    
                    setHours(wholeHours);
                    setMinutes(mins);
                    
                    setLocalDayData(prev => ({
                      ...prev,
                      hoursStudied: totalHours
                    }));
                  }}
                  className="py-2"
                />
              </div>
              
              {/* Notes - more compact */}
              <div className="space-y-2">
                <label className="font-medium">Study notes:</label>
                <Textarea
                  placeholder="What did you learn today?"
                  value={localDayData.notes || ''}
                  onChange={handleNotesChange}
                  rows={3}
                  className="resize-none bg-white/80 border-gray-200 focus:border-primary"
                />
              </div>
            </>
          ) : (
            <>
              {/* Reason for not studying - more compact */}
              <div className="space-y-2">
                <label className="font-medium">Reason for not studying:</label>
                <Textarea
                  placeholder="What prevented you from studying today?"
                  value={localDayData.justification || ''}
                  onChange={handleJustificationChange}
                  rows={3}
                  className="resize-none bg-white/80 border-gray-200 focus:border-primary"
                />
              </div>
              
              {/* Mood selector - simplified */}
              <div className="space-y-2">
                <label className="font-medium">How do you feel about missing today?</label>
                <div className="flex flex-wrap gap-2">
                  {moods.slice(2).map((mood) => (
                    <Toggle
                      key={mood.emoji}
                      pressed={localDayData.mood === mood.emoji}
                      onPressedChange={() => handleMoodSelect(mood.emoji)}
                      className={`h-10 px-3 rounded-lg transition-all
                        ${localDayData.mood === mood.emoji ? 'bg-primary/20 border-primary/30' : 'bg-white border-gray-200'}
                      `}
                    >
                      <span className="text-sm">{mood.emoji} {mood.label}</span>
                    </Toggle>
                  ))}
                </div>
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
