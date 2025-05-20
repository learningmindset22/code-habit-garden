
import React from 'react';
import { heatmapColors } from '../utils/heatmapUtils';

const HeatmapLegend: React.FC = () => {
  return (
    <div className="flex items-center justify-end gap-4 mb-4 flex-wrap">
      <div className="text-xs font-medium">Hours Studied:</div>
      
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-sm ${heatmapColors.none.replace('border-gray-200', '')}`}></div>
        <span className="text-xs">0h</span>
      </div>
      
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-sm ${heatmapColors.low.replace('border-green-200', '')}`}></div>
        <span className="text-xs">1-2h</span>
      </div>
      
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-sm ${heatmapColors.medium.replace('border-green-300', '')}`}></div>
        <span className="text-xs">3-4h</span>
      </div>
      
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-sm ${heatmapColors.high.replace('border-green-400', '')}`}></div>
        <span className="text-xs">5-6h</span>
      </div>
      
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-sm ${heatmapColors.veryHigh.replace('border-green-500', '')}`}></div>
        <span className="text-xs">6h+</span>
      </div>
    </div>
  );
};

export default HeatmapLegend;
