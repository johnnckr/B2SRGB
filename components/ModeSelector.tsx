import React from 'react';
import type { ControlMode } from '../types';

interface ModeSelectorProps {
    mode: ControlMode;
    onModeChange: (mode: ControlMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onModeChange }) => (
    <div className="flex bg-gray-800 rounded-lg p-1 w-full max-w-md mb-6">
        <button
            onClick={() => onModeChange('SOLID')}
            className={`w-1/3 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'SOLID' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
        >
            ສີດຽວ
        </button>
        <button
            onClick={() => onModeChange('PATTERN')}
            className={`w-1/3 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'PATTERN' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
        >
            ຮູບແບບ
        </button>
         <button
            onClick={() => onModeChange('SYSTEM')}
            className={`w-1/3 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'SYSTEM' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
        >
            ລະບົບ
        </button>
    </div>
);
