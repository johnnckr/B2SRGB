import React from 'react';
import type { RGBColor } from '../types';
import { PRESET_COLORS } from '../constants';
import { ColorSlider } from './ColorSlider';

interface ControlPanelProps {
  color: RGBColor;
  isOn: boolean;
  onColorChange: (newColor: Partial<RGBColor>) => void;
  onPresetSelect: (color: RGBColor) => void;
  onPowerToggle: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ color, isOn, onColorChange, onPresetSelect, onPowerToggle }) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl shadow-2xl border border-white/10 space-y-6 animate-fade-in">
      {/* Power Toggle */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">ຄວບຄຸມສີດຽວ</h3>
        <button
          onClick={onPowerToggle}
          className={`relative inline-flex items-center h-8 rounded-full w-16 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
            isOn ? 'bg-green-500 focus:ring-green-400' : 'bg-gray-600 focus:ring-gray-500'
          }`}
        >
          <span className="sr-only">ເປີດ/ປິດໄຟ</span>
          <span
            className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${
              isOn ? 'translate-x-9' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Sliders */}
      <div className={`space-y-4 transition-opacity duration-300 ${!isOn && 'opacity-50 pointer-events-none'}`}>
        <ColorSlider label="ສີແດງ (Red)" value={color.r} colorClass="red" onChange={(r) => onColorChange({ r })} />
        <ColorSlider label="ສີຂຽວ (Green)" value={color.g} colorClass="green" onChange={(g) => onColorChange({ g })} />
        <ColorSlider label="ສີຟ້າ (Blue)" value={color.b} colorClass="blue" onChange={(b) => onColorChange({ b })} />
      </div>

      {/* Presets */}
      <div>
        <h4 className="text-lg font-semibold mb-3">ສີທີ່ຕັ້ງໄວ້</h4>
        <div className={`grid grid-cols-4 gap-3 transition-opacity duration-300 ${!isOn && 'opacity-50 pointer-events-none'}`}>
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset.name}
              title={preset.name}
              onClick={() => onPresetSelect(preset.color)}
              className={`w-full h-12 rounded-lg transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white ${preset.class}`}
            />
          ))}
          <button
            onClick={() => onPowerToggle()}
            className="w-full h-12 rounded-lg bg-black border-2 border-gray-600 flex items-center justify-center transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
            title="ປິດໄຟ"
            >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
             </svg>
          </button>
        </div>
      </div>
    </div>
  );
};