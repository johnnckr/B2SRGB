
import React from 'react';
import type { RGBColor } from '../types';

interface ColorPreviewProps {
  color: RGBColor;
}

export const ColorPreview: React.FC<ColorPreviewProps> = ({ color }) => {
  const { r, g, b } = color;
  const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  const isDark = (r * 0.299 + g * 0.587 + b * 0.114) < 128;

  return (
    <div className="w-full h-32 rounded-lg shadow-lg transition-colors duration-200 ease-in-out flex items-center justify-center"
         style={{ backgroundColor: hexColor }}>
      <span className={`font-mono text-lg p-2 rounded ${isDark ? 'text-white bg-black/30' : 'text-black bg-white/30'}`}>
        {hexColor.toUpperCase()}
      </span>
    </div>
  );
};
