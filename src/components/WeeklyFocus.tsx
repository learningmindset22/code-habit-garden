
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Check, Edit, Loader } from 'lucide-react';

interface WeeklyFocusProps {
  weeklyFocus: string;
  updateWeeklyFocus: (focus: string) => void;
}

const WeeklyFocus: React.FC<WeeklyFocusProps> = ({ 
  weeklyFocus, 
  updateWeeklyFocus 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [focus, setFocus] = useState(weeklyFocus);
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFocus(weeklyFocus);
    setIsEditing(false);
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      updateWeeklyFocus(focus);
      setIsEditing(false);
      setLoading(false);
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFocus(e.target.value);
  };

  // Get current week number
  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 604800000;
    const week = Math.ceil(diff / oneWeek);
    return week;
  };

  return (
    <Card className="p-6 mb-8 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-primary mr-2" />
          <h2 className="text-lg font-semibold">This Week's Focus (Week {getCurrentWeek()})</h2>
        </div>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-1" /> Edit
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <Textarea
            value={focus}
            onChange={handleChange}
            placeholder="What are you focusing on this week? E.g. Graph algorithms, Dynamic programming, Tree traversals..."
            className="min-h-[100px]"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-secondary/50 rounded-lg p-4 min-h-[100px]">
          {weeklyFocus ? (
            <p className="whitespace-pre-wrap text-gray-700">{weeklyFocus}</p>
          ) : (
            <p className="text-gray-500 italic">
              Set a focus for this week to stay on track with your DSA goals.
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default WeeklyFocus;
