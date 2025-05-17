
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Check, X } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { DayData } from '../types';

interface DayEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayData: DayData | null;
  date: string | null;
  onSave: (data: Partial<DayData>) => void;
}

const DayEntryModal: React.FC<DayEntryModalProps> = ({ isOpen, onClose, dayData, date, onSave }) => {
  const [localDayData, setLocalDayData] = React.useState<Partial<DayData>>({
    studied: false,
    hoursStudied: 0,
    notes: '',
    justification: ''
  });

  React.useEffect(() => {
    if (dayData) {
      setLocalDayData({
        studied: dayData.studied,
        hoursStudied: dayData.hoursStudied,
        notes: dayData.notes || '',
        justification: dayData.justification || ''
      });
    }
  }, [dayData]);

  const handleToggleStudied = () => {
    setLocalDayData(prev => ({
      ...prev,
      studied: !prev.studied
    }));
  };

  const handleHoursChange = (hours: number[]) => {
    setLocalDayData(prev => ({
      ...prev,
      hoursStudied: hours[0]
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
              {/* Hours studied slider */}
              <div className="space-y-2 bg-gray-50 p-3 rounded-lg shadow-inner">
                <div className="flex justify-between">
                  <span>Hours studied:</span>
                  <span className="font-medium text-primary">{localDayData.hoursStudied} hrs</span>
                </div>
                <Slider
                  value={[localDayData.hoursStudied || 0]}
                  min={0}
                  max={12}
                  step={0.5}
                  onValueChange={handleHoursChange}
                  className="py-4"
                />
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
