import React, { useState, useEffect, useCallback } from 'react';
import { getDeviceInfo, checkLatestFirmware, triggerEsp32Update } from '../services/esp32Service';
import type { DeviceInfo, FirmwareInfo } from '../types';

interface SystemPanelProps {
    ipAddress: string;
    onUpdateComplete: () => void;
}

const VersionInfo: React.FC<{ title: string, version: string | null, isLoading: boolean, className?: string }> = ({ title, version, isLoading, className }) => (
    <div className={`bg-gray-800/50 p-3 rounded-lg text-center ${className}`}>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-lg font-mono font-semibold">
            {isLoading ? 'ກຳລັງໂຫຼດ...' : version || 'N/A'}
        </p>
    </div>
);

export const SystemPanel: React.FC<SystemPanelProps> = ({ ipAddress, onUpdateComplete }) => {
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
    const [latestFirmware, setLatestFirmware] = useState<FirmwareInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const [isFetchingDevice, setIsFetchingDevice] = useState(true);
    const [isCheckingForUpdate, setIsCheckingForUpdate] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchCurrentVersion = useCallback(async () => {
        setIsFetchingDevice(true);
        setError(null);
        try {
            const info = await getDeviceInfo(ipAddress);
            setDeviceInfo(info);
        } catch (err) {
            setError(err instanceof Error ? err.message : "ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຮູ້ຈັກ");
        } finally {
            setIsFetchingDevice(false);
        }
    }, [ipAddress]);
    
    useEffect(() => {
        fetchCurrentVersion();
    }, [fetchCurrentVersion]);
    
    const handleCheckForUpdate = async () => {
        setIsCheckingForUpdate(true);
        setError(null);
        setLatestFirmware(null);
        try {
            const firmware = await checkLatestFirmware();
            setLatestFirmware(firmware);
        } catch (err) {
            setError(err instanceof Error ? err.message : "ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຮູ້ຈັກ");
        } finally {
            setIsCheckingForUpdate(false);
        }
    };
    
    const handleUpdate = async () => {
        if (!latestFirmware) return;

        const confirmUpdate = window.confirm(
            `ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການອັບເດດເປັນເວີຊັ່ນ ${latestFirmware.version}?\n\nອຸປະກອນຈະຣີສະຕາດຫຼັງຈາກອັບເດດສຳເລັດ.`
        );

        if (confirmUpdate) {
            setIsUpdating(true);
            setError(null);
            try {
                await triggerEsp32Update(ipAddress, latestFirmware.url);
                // The device will reboot, so we don't expect a successful response.
                // We'll inform the user and then trigger a disconnect in the UI.
                setTimeout(() => {
                    alert("ຄຳສັ່ງອັບເດດຖືກສົ່ງສຳເລັດແລ້ວ. ອຸປະກອນກຳລັງຣີບູດ. ກະລຸນາເຊື່ອມຕໍ່ໃໝ່ອີກຄັ້ງໃນອີກຄາວໜຶ່ງ.");
                    onUpdateComplete();
                }, 2000);
            } catch (err) {
                 // Even with no-cors, an immediate network error might occur. We can mostly ignore it.
                 setTimeout(() => {
                    alert("ຄຳສັ່ງອັບເດດຖືກສົ່ງແລ້ວ. ອຸປະກອນກຳລັງຣີບູດ. ກະລຸນາເຊື່ອມຕໍ່ໃໝ່ອີກຄັ້ງ.");
                    onUpdateComplete();
                }, 2000);
            }
        }
    };
    
    const isUpdateAvailable = deviceInfo && latestFirmware && deviceInfo.version !== latestFirmware.version;

    return (
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl shadow-2xl border border-white/10 space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-center">ການຈັດການລະບົບ</h3>

            <div className="grid grid-cols-2 gap-4">
                <VersionInfo title="ເວີຊັ່ນປັດຈຸບັນ" version={deviceInfo?.version} isLoading={isFetchingDevice} />
                <VersionInfo title="ເວີຊັ່ນລ່າສຸດ" version={latestFirmware?.version} isLoading={isCheckingForUpdate} className={isUpdateAvailable ? 'border-2 border-green-500' : ''} />
            </div>
            
            {error && <p className="text-center text-red-400 text-sm">{error}</p>}
            
            {isUpdating && (
                 <div className="text-center p-4 bg-blue-900/50 rounded-lg">
                    <p className="font-semibold">ກຳລັງອັບເດດ...</p>
                    <p className="text-sm text-gray-300">ກະລຸນາຢ່າປິດໄຟ ຫຼື ຕັດການເຊື່ອມຕໍ່ອຸປະກອນ.</p>
                </div>
            )}

            {!isUpdating && (
                <>
                    {latestFirmware && (
                         <div className="bg-gray-800/50 p-4 rounded-lg space-y-2">
                            <h4 className="font-semibold text-lg">ລາຍລະອຽດການປ່ຽນແປງ (v{latestFirmware.version}):</h4>
                            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans bg-black/20 p-2 rounded">{latestFirmware.changelog}</pre>
                        </div>
                    )}

                    <div className="flex flex-col space-y-3">
                       {isUpdateAvailable && (
                            <button onClick={handleUpdate} className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg transition-all hover:bg-green-500 active:scale-95">
                                ອັບເດດດຽວນີ້ເປັນ v{latestFirmware.version}
                            </button>
                        )}
                        <button onClick={handleCheckForUpdate} disabled={isCheckingForUpdate || isFetchingDevice} className="w-full bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all hover:bg-gray-500 active:scale-95 disabled:bg-gray-700 disabled:cursor-not-allowed">
                            {isCheckingForUpdate ? 'ກຳລັງກວດສອບ...' : 'ກວດສອບອັບເດດ'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};