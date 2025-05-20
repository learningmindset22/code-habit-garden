
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface YearPickerProps {
  selectedYear: number;
  onChange: (year: number) => void;
  startYear: number;
  endYear: number;
}

const YearPicker: React.FC<YearPickerProps> = ({ 
  selectedYear, 
  onChange, 
  startYear, 
  endYear 
}) => {
  const [viewYear, setViewYear] = React.useState(Math.floor(selectedYear / 10) * 10);
  
  // Get years for current view (display 16 years at once - 4x4 grid)
  const getYearsInView = () => {
    const years = [];
    const startDecade = Math.floor(viewYear / 10) * 10;
    for (let i = 0; i < 16; i++) {
      const year = startDecade + i;
      if (year >= startYear && year <= endYear) {
        years.push(year);
      }
    }
    return years;
  };
  
  const yearsInView = getYearsInView();
  
  // Navigate to previous/next set of years
  const goToPreviousYears = () => {
    setViewYear(prev => Math.max(prev - 16, startYear));
  };
  
  const goToNextYears = () => {
    setViewYear(prev => Math.min(prev + 16, endYear - 15));
  };
  
  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={goToPreviousYears}
          disabled={viewYear <= startYear}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium">
          {yearsInView[0]}-{yearsInView[yearsInView.length - 1]}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={goToNextYears}
          disabled={viewYear + 16 > endYear}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-4 gap-1">
        {yearsInView.map((year) => (
          <Button
            key={year}
            variant={selectedYear === year ? "default" : "ghost"}
            size="sm"
            onClick={() => onChange(year)}
            className={`
              ${selectedYear === year ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
            `}
          >
            {year}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default YearPicker;
