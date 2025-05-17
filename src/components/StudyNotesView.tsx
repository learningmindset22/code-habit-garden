
import React, { useState } from 'react';
import { FileText, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DayData, CalendarData } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StudyNotesViewProps {
  calendarData: CalendarData;
}

type NoteType = 'all' | 'studied' | 'not-studied';
type DateRange = 'all' | 'this-month' | 'last-month' | 'custom';

const StudyNotesView: React.FC<StudyNotesViewProps> = ({ calendarData }) => {
  const [noteType, setNoteType] = useState<NoteType>('all');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Get all notes from calendar data with filters applied
  const filteredNotes = React.useMemo(() => {
    const notes: { date: string; notes: string; studied: boolean }[] = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    
    Object.values(calendarData).forEach(month => {
      Object.values(month.days).forEach(day => {
        // Apply note type filter
        if (noteType === 'studied' && !day.studied) return;
        if (noteType === 'not-studied' && day.studied) return;
        
        // Apply date range filter
        if (dateRange === 'this-month') {
          const dayMonth = new Date(day.date).getMonth();
          if (dayMonth !== currentMonth) return;
        } else if (dateRange === 'last-month') {
          const dayMonth = new Date(day.date).getMonth();
          if (dayMonth !== lastMonth) return;
        }
        
        const noteText = day.studied ? day.notes : day.justification;
        
        if (noteText && noteText.trim() !== '') {
          // Apply search filter if provided
          if (searchQuery && !noteText.toLowerCase().includes(searchQuery.toLowerCase())) {
            return;
          }
          
          notes.push({
            date: day.date,
            notes: noteText,
            studied: day.studied
          });
        }
      });
    });
    
    // Sort notes by date (newest first)
    return notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [calendarData, noteType, dateRange, searchQuery]);
  
  return (
    <Card className="shadow-md border-primary/10 animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <FileText className="h-5 w-5 mr-2" /> Study Journal
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search notes..." 
              className="max-w-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={noteType} onValueChange={(value: NoteType) => setNoteType(value)}>
              <SelectTrigger className="w-[140px]">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Notes</SelectItem>
                <SelectItem value="studied">Study Days</SelectItem>
                <SelectItem value="not-studied">Missed Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateRange} onValueChange={(value: DateRange) => setDateRange(value)}>
              <SelectTrigger className="w-[140px]">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Notes */}
        {filteredNotes.length > 0 ? (
          <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            {filteredNotes.map((note, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border shadow-sm transition-all ${
                  note.studied 
                    ? 'bg-gradient-to-br from-white to-green-50 border-green-100' 
                    : 'bg-gradient-to-br from-white to-amber-50 border-amber-100'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-medium ${note.studied ? 'text-green-700' : 'text-amber-700'}`}>
                    {new Date(note.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    note.studied 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {note.studied ? 'Studied' : 'Missed'}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-line">{note.notes}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>No study notes match your filters.</p>
            <p className="text-xs mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Calendar icon
const Calendar = (props: any) => (
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
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export default StudyNotesView;
