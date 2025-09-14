import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ColorPreview } from './components/ColorPreview';
import { ControlPanel } from './components/ControlPanel';
import { PatternEditor } from './components/PatternEditor';
import { StatusIndicator } from './components/StatusIndicator';
import { ConnectionManager } from './components/ConnectionManager';
import { ModeSelector } from './components/ModeSelector';
import { SystemPanel } from './components/SystemPanel';
import { updateColorOnESP32, sendPatternToESP32, checkConnection } from './services/esp32Service';
import type { RGBColor, Status, ControlMode, PatternStep } from './types';
import { StatusType, ConnectionStatus } from './types';
import { DEFAULT_COLOR, OFF_COLOR, INITIAL_PATTERN_STEP, DEFAULT_ESP32_IP } from './constants';

// Helper to convert HSL to RGB (for rainbow)
function hslToRgb(h: number, s: number, l: number): RGBColor {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function App() {
  // Connection State
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [esp32Ip, setEsp32Ip] = useState<string>(localStorage.getItem('esp32ip') || DEFAULT_ESP32_IP);
  const [showConnectionModal, setShowConnectionModal] = useState<boolean>(false);

  // Common State
  const [isOn, setIsOn] = useState<boolean>(true);
  const [status, setStatus] = useState<Status>({ type: StatusType.IDLE, message: 'ພ້ອມໃຊ້ງານ' });
  const [mode, setMode] = useState<ControlMode>('SOLID');

  // Solid Mode State
  const [solidColor, setSolidColor] = useState<RGBColor>(DEFAULT_COLOR);

  // Pattern Mode State
  const [pattern, setPattern] = useState<PatternStep[]>([INITIAL_PATTERN_STEP]);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);
  
  const isConnected = connectionStatus === ConnectionStatus.CONNECTED;

  // Debounce effect for SOLID color changes
  useEffect(() => {
    if (mode !== 'SOLID' || !isConnected) return;

    const handler = setTimeout(() => {
      if (isOn) {
        sendColorToDevice(solidColor);
      }
    }, 200);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solidColor, isOn, mode, isConnected]);

  // --- Connection Handlers ---
  const handleConnect = async (ip: string) => {
    setConnectionStatus(ConnectionStatus.CONNECTING);
    setStatus({ type: StatusType.SENDING, message: `ກຳລັງເຊື່ອມຕໍ່ກັບ ${ip}...` });
    try {
      await checkConnection(ip);
      setEsp32Ip(ip);
      localStorage.setItem('esp32ip', ip);
      setConnectionStatus(ConnectionStatus.CONNECTED);
      setStatus({ type: StatusType.SUCCESS, message: 'ເຊື່ອມຕໍ່ສຳເລັດ!' });
      setShowConnectionModal(false);
       setTimeout(() => setStatus({ type: StatusType.IDLE, message: 'ພ້ອມໃຊ້ງານ' }), 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຮູ້ຈັກ';
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
      setStatus({ type: StatusType.ERROR, message: errorMessage });
    }
  };

  const handleDisconnect = () => {
    setConnectionStatus(ConnectionStatus.DISCONNECTED);
    setStatus({ type: StatusType.IDLE, message: 'ບໍ່ໄດ້ເຊື່ອມຕໍ່' });
  };
  
  // --- API Callbacks ---
  const sendColorToDevice = useCallback(async (colorToSend: RGBColor) => {
    if (!isConnected) return;
    setStatus({ type: StatusType.SENDING, message: 'ກຳລັງສົ່ງຂໍ້ມູນສີ...' });
    try {
      await updateColorOnESP32(colorToSend, esp32Ip);
      setStatus({ type: StatusType.SUCCESS, message: 'ອັບເດດສີສຳເລັດ' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຮູ້ຈັກ';
      setStatus({ type: StatusType.ERROR, message: errorMessage });
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
    }
  }, [esp32Ip, isConnected]);

  const handleSendPattern = useCallback(async () => {
    if (!isConnected) {
        setShowConnectionModal(true);
        return;
    }
    setStatus({ type: StatusType.SENDING, message: 'ກຳລັງສົ່ງແພັດເທີນ...' });
    try {
      await sendPatternToESP32(pattern, esp32Ip);
      setStatus({ type: StatusType.SUCCESS, message: 'ສົ່ງແພັດເທີນສຳເລັດ' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຮູ້ຈັກ';
        setStatus({ type: StatusType.ERROR, message: errorMessage });
        setConnectionStatus(ConnectionStatus.DISCONNECTED);
    }
  }, [pattern, esp32Ip, isConnected]);

  // --- Mode Change Handler ---
  const handleModeChange = (newMode: ControlMode) => {
      if (newMode === 'SYSTEM' && !isConnected) {
          setShowConnectionModal(true);
          return;
      }
      setMode(newMode);
  }

  // --- SOLID Mode Handlers ---
  const handleSolidColorChange = (newColor: Partial<RGBColor>) => {
    setSolidColor(prev => ({ ...prev, ...newColor }));
  };

  const handlePresetSelect = (presetColor: RGBColor) => {
    setSolidColor(presetColor);
    if (!isOn) setIsOn(true);
  };

  // --- PATTERN Mode Handlers ---
  const handleGenerateRainbow = () => {
    const steps = 24;
    const newPattern = Array.from({ length: steps }, (_, i) => ({
      color: hslToRgb(i / steps, 1, 0.5),
      duration: 100,
      brightness: 100,
    }));
    setPattern(newPattern);
    setSelectedStepIndex(0);
  };
  
  const handleGenerateRandom = () => {
      const steps = Math.floor(Math.random() * 10) + 8; // 8-17 steps
      const newPattern = Array.from({ length: steps }, () => ({
          color: { r: Math.floor(Math.random() * 256), g: Math.floor(Math.random() * 256), b: Math.floor(Math.random() * 256) },
          duration: Math.floor(Math.random() * 1500) + 200,
          brightness: Math.floor(Math.random() * 50) + 50, // 50-100%
      }));
      setPattern(newPattern);
      setSelectedStepIndex(0);
  };

  // --- Common Handlers ---
  const handlePowerToggle = () => {
    const newPowerState = !isOn;
    setIsOn(newPowerState);

    if (!isConnected) {
      if (newPowerState) setShowConnectionModal(true);
      return;
    }
    
    if (mode === 'SOLID') {
       sendColorToDevice(newPowerState ? solidColor : OFF_COLOR);
    } else if (mode === 'PATTERN') {
       if (!newPowerState) {
          sendColorToDevice(OFF_COLOR);
       } else {
          handleSendPattern();
       }
    }
  };
  
  const displayColor = isOn
    ? (mode === 'SOLID' ? solidColor : pattern[selectedStepIndex]?.color ?? OFF_COLOR)
    : OFF_COLOR;


  const renderContent = () => {
    switch (mode) {
        case 'SOLID':
            return (
                <ControlPanel
                    color={solidColor}
                    isOn={isOn}
                    onColorChange={handleSolidColorChange}
                    onPresetSelect={handlePresetSelect}
                    onPowerToggle={handlePowerToggle}
                />
            );
        case 'PATTERN':
            return (
                <PatternEditor 
                    pattern={pattern}
                    selectedStepIndex={selectedStepIndex}
                    onPatternChange={setPattern}
                    onStepSelect={setSelectedStepIndex}
                    onSendPattern={handleSendPattern}
                    onGenerateRainbow={handleGenerateRainbow}
                    onGenerateRandom={handleGenerateRandom}
                />
            );
        case 'SYSTEM':
            return isConnected ? (
                <SystemPanel 
                  ipAddress={esp32Ip}
                  onUpdateComplete={handleDisconnect}
                />
            ) : null;
        default:
            return null;
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 font-sans">
       {showConnectionModal && (
         <ConnectionManager
            defaultIp={esp32Ip}
            onConnect={handleConnect}
            onCancel={() => setShowConnectionModal(false)}
            isConnecting={connectionStatus === ConnectionStatus.CONNECTING}
            status={status}
         />
       )}
      <div className="w-full max-w-md">
        <Header 
            isConnected={isConnected} 
            onConnectClick={() => setShowConnectionModal(true)} 
            onDisconnect={handleDisconnect} 
        />
        <main className="mt-8 space-y-6">
            {mode !== 'SYSTEM' && <ColorPreview color={displayColor} />}
            <ModeSelector mode={mode} onModeChange={handleModeChange} />
            
            {renderContent()}

            {isConnected && <StatusIndicator status={status} />}
        </main>
      </div>
    </div>
  );
}

export default App;