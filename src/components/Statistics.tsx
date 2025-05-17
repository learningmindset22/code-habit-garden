
import React, { useState } from 'react';
import { CalendarData, StatisticsData } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, FileText } from 'lucide-react';

interface StatisticsProps {
  calendarData: CalendarData;
}

const Statistics: React.FC<StatisticsProps> = ({ calendarData }) => {
  const [activeTab, setActiveTab] = useState<string>("summary");

  const statisticsData = React.useMemo(() => {
    let totalDaysStudied = 0;
    let totalDaysNotStudied = 0;
    let totalHoursStudied = 0;
    let mostProductiveDay = '';
    let mostProductiveHours = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Get all days in chronological order
    const allDays: { date: string; studied: boolean; hours: number }[] = [];
    
    Object.values(calendarData).forEach(month => {
      Object.values(month.days).forEach(day => {
        allDays.push({
          date: day.date,
          studied: day.studied,
          hours: day.hoursStudied
        });
        
        if (day.studied) {
          totalDaysStudied++;
          totalHoursStudied += day.hoursStudied;
          
          if (day.hoursStudied > mostProductiveHours) {
            mostProductiveHours = day.hoursStudied;
            mostProductiveDay = day.date;
          }
        } else {
          totalDaysNotStudied++;
        }
      });
    });
    
    // Sort days chronologically
    allDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Calculate streaks
    for (const day of allDays) {
      if (day.studied) {
        tempStreak++;
        currentStreak = tempStreak;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }
    
    const averageHoursPerDay = totalDaysStudied > 0 
      ? (totalHoursStudied / totalDaysStudied).toFixed(1) 
      : '0.0';
    
    return {
      totalDaysStudied,
      totalDaysNotStudied,
      averageHoursPerDay,
      mostProductiveDay: mostProductiveDay ? new Date(mostProductiveDay).toLocaleDateString() : 'None',
      mostProductiveHours,
      longestStreak,
      currentStreak
    } as StatisticsData;
    
  }, [calendarData]);

  // Get all notes from calendar data
  const studyNotes = React.useMemo(() => {
    const notes: { date: string; notes: string }[] = [];
    
    Object.values(calendarData).forEach(month => {
      Object.values(month.days).forEach(day => {
        if (day.notes && day.notes.trim() !== '') {
          notes.push({
            date: day.date,
            notes: day.notes
          });
        }
      });
    });
    
    // Sort notes by date (newest first)
    return notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [calendarData]);
  
  return (
    <div className="space-y-6 animate-slide-in">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <BarChart className="h-6 w-6 mr-2 text-primary" />
        Study Statistics
      </h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="summary" className="flex items-center">
            <BarChart className="w-4 h-4 mr-2" /> Summary
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center">
            <FileText className="w-4 h-4 mr-2" /> Study Notes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-md border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Study Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Total Days Studied</TableCell>
                      <TableCell className="text-right">{statisticsData.totalDaysStudied}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total Days Missed</TableCell>
                      <TableCell className="text-right">{statisticsData.totalDaysNotStudied}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Avg. Hours Per Day</TableCell>
                      <TableCell className="text-right">{statisticsData.averageHoursPerDay}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Most Productive Day</TableCell>
                      <TableCell className="text-right">{statisticsData.mostProductiveDay}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card className="shadow-md border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Streak Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Current Streak</TableCell>
                      <TableCell className="text-right">{statisticsData.currentStreak} days</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Longest Streak</TableCell>
                      <TableCell className="text-right">{statisticsData.longestStreak} days</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Consistency Rating</TableCell>
                      <TableCell className="text-right">
                        {statisticsData.totalDaysStudied > 0 
                          ? Math.round((statisticsData.totalDaysStudied / (statisticsData.totalDaysStudied + statisticsData.totalDaysNotStudied)) * 100) + '%'
                          : '0%'
                        }
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6 shadow-md border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <LineChart className="h-5 w-5 mr-2" /> Study Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {statisticsData.averageHoursPerDay >= '1.0' 
                  ? "You're maintaining good study habits! Consistency is key to mastering DSA."
                  : "Try to increase your daily study time to at least 1 hour for optimal progress."
                }
              </p>
              
              <p className="text-sm text-muted-foreground">
                {statisticsData.currentStreak >= 3
                  ? `You're on a ${statisticsData.currentStreak}-day streak! Keep going!`
                  : "Build your streak by studying every day - consistency builds mastery."
                }
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes" className="animate-fade-in">
          <Card className="shadow-md border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2" /> Study Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {studyNotes.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                  {studyNotes.map((note, index) => (
                    <div key={index} className="p-4 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-primary">
                          {new Date(note.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-line">{note.notes}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p>No study notes added yet.</p>
                  <p className="text-xs mt-1">Add notes when recording your daily study progress.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
