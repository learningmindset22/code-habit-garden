
import React from 'react';
import { heatmapColors } from '../utils/heatmapUtils';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

const HeatmapLegend: React.FC = () => {
  return (
    <div className="flex items-center justify-end gap-4 mb-4 flex-wrap bg-white/40 p-2 rounded-lg shadow-sm">
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="text-xs font-medium text-gray-700 flex items-center cursor-help">
            Hours Studied:
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="text-sm">
            <p className="font-medium mb-2">Study Intensity Legend</p>
            <p className="text-muted-foreground text-xs mb-3">
              The color intensity represents your study time for each day. 
              More intense colors indicate more productive study sessions.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
      
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-sm ${heatmapColors.none.split(' ')[0]}`}></div>
        <span className="text-xs text-gray-600">0h</span>
      </div>
      
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-sm ${heatmapColors.low.split(' ')[0]}`}></div>
        <span className="text-xs text-gray-600">1-2h</span>
      </div>
      
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-sm ${heatmapColors.medium.split(' ')[0]}`}></div>
        <span className="text-xs text-gray-600">3-4h</span>
      </div>
      
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-sm ${heatmapColors.high.split(' ')[0]}`}></div>
        <span className="text-xs text-gray-600">5-6h</span>
      </div>
      
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-sm ${heatmapColors.veryHigh.split(' ')[0]}`}></div>
        <span className="text-xs text-gray-600">6h+</span>
      </div>
    </div>
  );
};

export default HeatmapLegend;
