import React, { useState } from 'react';
import type { Status } from '../types';
import { StatusType } from '../types';

interface ConnectionManagerProps {
    defaultIp: string;
    onConnect: (ip: string) => void;
    onCancel: () => void;
    isConnecting: boolean;
    status: Status;
}

export const ConnectionManager: React.FC<ConnectionManagerProps> = ({ defaultIp, onConnect, onCancel, isConnecting, status }) => {
    const [ip, setIp] = useState(defaultIp);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConnect(ip);
    };

    const hasError = status.type === StatusType.ERROR;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-gray-800 border border-white/10 w-full max-w-sm p-6 rounded-xl shadow-2xl space-y-6 text-center">
                <h2 className="text-2xl font-bold text-white">ເຊື່ອມຕໍ່ກັບ ESP32</h2>
                <p className="text-gray-400">ກະລຸນາປ້ອນ IP Address ຂອງບอร์ด ESP32 ໃນເຄືອຂ່າຍຂອງທ່ານ</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="ip-address" className="sr-only">ESP32 IP Address</label>
                        <input
                            id="ip-address"
                            type="text"
                            value={ip}
                            onChange={(e) => setIp(e.target.value)}
                            placeholder="ຕົວຢ່າງ 192.168.1.100"
                            className={`w-full bg-gray-900 text-white text-center font-mono text-lg px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${hasError ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'}`}
                            disabled={isConnecting}
                            required
                            pattern="\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"
                            title="ກະລຸນາປ້ອນ IP Address ທີ່ຖືກຕ້ອງ"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isConnecting}
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all hover:bg-blue-500 active:scale-95 disabled:bg-gray-500 disabled:cursor-wait flex items-center justify-center space-x-2"
                    >
                        {isConnecting && (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        <span>{isConnecting ? 'ກຳລັງເຊື່ອມຕໍ່...' : 'ເຊື່ອມຕໍ່'}</span>
                    </button>
                </form>
                 <button
                    onClick={onCancel}
                    disabled={isConnecting}
                    className="w-full bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all hover:bg-gray-500 active:scale-95 disabled:opacity-50"
                >
                    ຍົກເລີກ
                </button>

                {status.message && status.type !== StatusType.IDLE && (
                    <div className="pt-2">
                        <p className={`text-sm ${
                            status.type === StatusType.ERROR ? 'text-red-400' : 
                            status.type === StatusType.SUCCESS ? 'text-green-400' : 'text-gray-400'
                        }`}>
                            {status.message}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};