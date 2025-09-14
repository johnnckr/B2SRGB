import React from 'react';

interface HeaderProps {
  isConnected: boolean;
  onConnectClick: () => void;
  onDisconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isConnected, onConnectClick, onDisconnect }) => (
  <header className="text-center relative pt-4">
    <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-green-500 to-blue-500">
      B2SRGB
    </h1>
    <p className="mt-2 text-lg text-gray-400">ແຜງຄວບຄຸມໄຟອັດສະລິຍະ</p>
    
    <div className="absolute top-0 right-0">
        {isConnected ? (
            <button
                onClick={onDisconnect}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors duration-200"
                title="ຕັດການເຊື່ອມຕໍ່"
                aria-label="Disconnect from ESP32"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.536a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172L10.172 13.828" />
                </svg>
            </button>
        ) : (
            <button
                onClick={onConnectClick}
                className="p-2 text-gray-500 hover:text-cyan-400 transition-colors duration-200"
                title="ເຊື່ອມຕໍ່"
                aria-label="Connect to ESP32"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M1.394 8.532a15 15 0 0121.212 0" />
                </svg>
            </button>
        )}
    </div>

  </header>
);