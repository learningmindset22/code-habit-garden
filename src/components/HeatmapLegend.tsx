
import React from 'react';
import { heatmapColors } from '../utils/heatmapUtils';

const HeatmapLegend: React.FC = () => {
  return (
    <div className="flex items-center justify-end gap-4 mb-4 flex-wrap">
      <div className="text-xs font-medium text-gray-700">Hours Studied:</div>
      
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-sm ${heatmapColors.none.replace('border-gray-200', '').replace('hover:bg-gray-100/80', '')}`}></div>
        <span className="text-xs text-gray-600">0h</span>
      </div>
      
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-sm ${heatmapColors.low.replace('border-emerald-200', '').replace('hover:bg-emerald-100/80', '')}`}></div>
        <span className="text-xs text-gray-600">1-2h</span>
      </div>
      
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-sm ${heatmapColors.medium.replace('border-emerald-300', '').replace('hover:bg-emerald-200/80', '')}`}></div>
        <span className="text-xs text-gray-600">3-4h</span>
      </div>
      
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-sm ${heatmapColors.high.replace('border-emerald-400', '').replace('hover:bg-emerald-300/80', '')}`}></div>
        <span className="text-xs text-gray-600">5-6h</span>
      </div>
      
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-sm ${heatmapColors.veryHigh.replace('border-emerald-500', '').replace('hover:bg-emerald-400/80', '')}`}></div>
        <span className="text-xs text-gray-600">6h+</span>
      </div>
    </div>
  );
};

export default HeatmapLegend;
