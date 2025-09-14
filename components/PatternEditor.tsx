import React from 'react';
import type { PatternStep, RGBColor } from '../types';
import { ColorSlider } from './ColorSlider';
import { MAX_PATTERN_STEPS, INITIAL_PATTERN_STEP } from '../constants';

// Helper function to convert RGB to a string for CSS
const rgbToCss = (color: RGBColor, brightness: number = 100) => {
    const factor = brightness / 100;
    return `rgb(${Math.round(color.r * factor)}, ${Math.round(color.g * factor)}, ${Math.round(color.b * factor)})`;
};

// --- Sub-components defined within the same file for encapsulation ---

// 1. Pattern Preview Component
const PatternPreview: React.FC<{
    pattern: PatternStep[];
    selectedIndex: number;
    onSelect: (index: number) => void;
    onAdd: () => void;
}> = ({ pattern, selectedIndex, onSelect, onAdd }) => (
    <div>
        <div className="flex justify-between items-center mb-2">
             <h4 className="text-lg font-semibold">ຕົວຢ່າງຮູບແບບ</h4>
             <span className="text-sm text-gray-400">{pattern.length} / {MAX_PATTERN_STEPS} ຂັ້ນຕອນ</span>
        </div>
        <div className="flex items-center space-x-2 bg-black/20 p-2 rounded-lg">
            <div className="flex-grow overflow-x-auto whitespace-nowrap scrollbar-thin py-2">
                {pattern.map((step, index) => (
                    <button
                        key={index}
                        onClick={() => onSelect(index)}
                        className={`inline-block w-10 h-10 rounded-md mr-2 transition-all duration-200 border-2 ${selectedIndex === index ? 'border-cyan-400 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: rgbToCss(step.color, step.brightness) }}
                        title={`ຂັ້ນຕອນ ${index + 1}`}
                    >
                      <span className="text-xs font-bold" style={{textShadow: '0 0 3px #000, 0 0 3px #000'}}>{index + 1}</span>
                    </button>
                ))}
            </div>
            <button
                onClick={onAdd}
                disabled={pattern.length >= MAX_PATTERN_STEPS}
                className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center text-2xl font-light hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="ເພີ່ມຂັ້ນຕອນ"
            >
                +
            </button>
        </div>
    </div>
);

// 2. Step Editor Component
const StepEditor: React.FC<{
    step: PatternStep;
    index: number;
    onChange: (updatedStep: PatternStep) => void;
    onDelete: () => void;
}> = ({ step, index, onChange, onDelete }) => {
    if (!step) return <div className="text-center text-gray-500 py-4">ກະລຸນາເລືອກຂັ້ນຕອນເພື່ອແກ້ໄຂ</div>;
    
    const handleColorChange = (newColor: Partial<RGBColor>) => {
        onChange({ ...step, color: { ...step.color, ...newColor } });
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...step, duration: parseInt(e.target.value, 10) });
    };
    
    const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...step, brightness: parseInt(e.target.value, 10) });
    };

    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">ແກ້ໄຂຂັ້ນຕອນທີ {index + 1}</h4>
                <button onClick={onDelete} className="text-sm text-red-400 hover:text-red-300 transition-colors" title="ລົບຂັ້ນຕອນ">
                    ລົບຂັ້ນຕອນນີ້
                </button>
             </div>
            <div className="space-y-4">
                <ColorSlider label="ສີແດງ" value={step.color.r} colorClass="red" onChange={(r) => handleColorChange({ r })} />
                <ColorSlider label="ສີຂຽວ" value={step.color.g} colorClass="green" onChange={(g) => handleColorChange({ g })} />
                <ColorSlider label="ສີຟ້າ" value={step.color.b} colorClass="blue" onChange={(b) => handleColorChange({ b })} />
            </div>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="font-medium text-gray-300">ໄລຍະເວລາ (Duration)</label>
                    <span className="text-sm font-mono bg-gray-700 px-2 py-1 rounded">{step.duration}ms</span>
                </div>
                <input type="range" min="50" max="2000" step="50" value={step.duration} onChange={handleDurationChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
            </div>
             <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="font-medium text-gray-300">ຄວາມສະຫວ່າງ (Brightness)</label>
                    <span className="text-sm font-mono bg-gray-700 px-2 py-1 rounded">{step.brightness}%</span>
                </div>
                <input type="range" min="0" max="100" value={step.brightness} onChange={handleBrightnessChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
            </div>
        </div>
    );
};

// 3. Pattern Controls Component
const PatternControls: React.FC<{
    onGenerateRainbow: () => void;
    onGenerateRandom: () => void;
    onClear: () => void;
    onSend: () => void;
}> = ({ onGenerateRainbow, onGenerateRandom, onClear, onSend }) => (
    <div className="space-y-3">
        <h4 className="text-lg font-semibold">ເຄື່ອງມື</h4>
        <div className="grid grid-cols-2 gap-3">
            <button onClick={onGenerateRainbow} className="py-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-lg font-semibold hover:opacity-90 transition-opacity">ສາຍຮຸ້ງ</button>
            <button onClick={onGenerateRandom} className="py-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg font-semibold hover:opacity-90 transition-opacity">ສຸ່ມສີ</button>
            <button onClick={onClear} className="py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold transition-colors">ລ້າງທັງໝົດ</button>
            <button onClick={onSend} className="py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-colors">ສົ່ງໄປທີ່ ESP32</button>
        </div>
    </div>
);

// --- Main PatternEditor Component ---

interface PatternEditorProps {
  pattern: PatternStep[];
  selectedStepIndex: number;
  onPatternChange: (newPattern: PatternStep[]) => void;
  onStepSelect: (index: number) => void;
  onSendPattern: () => void;
  onGenerateRainbow: () => void;
  onGenerateRandom: () => void;
}

export const PatternEditor: React.FC<PatternEditorProps> = ({
    pattern,
    selectedStepIndex,
    onPatternChange,
    onStepSelect,
    onSendPattern,
    onGenerateRainbow,
    onGenerateRandom
}) => {
    
    const handleAddStep = () => {
        if (pattern.length >= MAX_PATTERN_STEPS) return;
        const lastStep = pattern[pattern.length - 1] || INITIAL_PATTERN_STEP;
        onPatternChange([...pattern, lastStep]);
        onStepSelect(pattern.length); // Select the new step
    };

    const handleUpdateStep = (updatedStep: PatternStep) => {
        const newPattern = [...pattern];
        newPattern[selectedStepIndex] = updatedStep;
        onPatternChange(newPattern);
    };

    const handleDeleteStep = () => {
        if (pattern.length <= 1) {
            alert("ຕ້ອງມີຢ່າງໜ້ອຍ 1 ຂັ້ນຕອນໃນຮູບແບບ");
            return;
        }
        const newPattern = pattern.filter((_, index) => index !== selectedStepIndex);
        onPatternChange(newPattern);
        // Adjust selected index if needed
        if (selectedStepIndex >= newPattern.length) {
            onStepSelect(newPattern.length - 1);
        }
    };
    
    const handleClearPattern = () => {
       const confirmClear = window.confirm("ເຈົ້າແນ່ໃຈບໍ່ວ່າຕ້ອງການລ້າງຮູບແບບທັງໝົດ?");
       if (confirmClear) {
           onPatternChange([INITIAL_PATTERN_STEP]);
           onStepSelect(0);
       }
    };

    const selectedStep = pattern[selectedStepIndex];

    return (
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl shadow-2xl border border-white/10 space-y-6 animate-fade-in">
             <h3 className="text-xl font-semibold text-center">ໂຕແກ້ໄຂຮູບແບບ (Pattern Editor)</h3>
            <PatternPreview
                pattern={pattern}
                selectedIndex={selectedStepIndex}
                onSelect={onStepSelect}
                onAdd={handleAddStep}
            />
            <hr className="border-gray-700" />
            {selectedStep && (
                <StepEditor
                    step={selectedStep}
                    index={selectedStepIndex}
                    onChange={handleUpdateStep}
                    onDelete={handleDeleteStep}
                />
            )}
             <hr className="border-gray-700" />
            <PatternControls
                onGenerateRainbow={onGenerateRainbow}
                onGenerateRandom={onGenerateRandom}
                onClear={handleClearPattern}
                onSend={onSendPattern}
            />
        </div>
    );
};