import React from 'react';

interface ColorSliderProps {
  label: string;
  value: number;
  colorClass: 'red' | 'green' | 'blue';
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const ColorSlider: React.FC<ColorSliderProps> = ({ label, value, colorClass, onChange, disabled = false }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="font-medium text-gray-300">{label}</label>
      <span className="text-sm font-mono bg-gray-700 px-2 py-1 rounded">{value}</span>
    </div>
    <input
      type="range"
      min="0"
      max="255"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value, 10))}
      disabled={disabled}
      className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer ${colorClass} disabled:opacity-50 disabled:cursor-not-allowed`}
    />
  </div>
);
