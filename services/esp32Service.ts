import type { RGBColor, PatternStep, DeviceInfo, FirmwareInfo } from '../types';
import { FIRMWARE_SERVER_URL } from '../constants';

/**
 * Checks if a connection can be established with the ESP32 at the given IP address.
 * @param ipAddress The IP address of the ESP32.
 * @returns A promise that resolves if the connection is successful, and rejects otherwise.
 */
export const checkConnection = async (ipAddress: string): Promise<void> => {
  const url = `http://${ipAddress}/status`;
  try {
    // We use 'no-cors' to bypass browser CORS restrictions for a simple check.
    // This means we can't read the response, but we can detect network errors like timeouts.
    await fetch(url, {
      mode: 'no-cors',
      signal: AbortSignal.timeout(3000), // 3-second timeout
    });
  } catch (error) {
    console.error(`Connection check failed for IP ${ipAddress}:`, error);
    // The error will likely be a network error (e.g., failed to fetch) if the IP is wrong or device is offline.
    throw new Error(`ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບ ESP32 ທີ່ ${ipAddress} ໄດ້. ກະລຸນາກວດສອບ IP ແລະ ການເຊື່ອມຕໍ່.`);
  }
};


/**
 * Sends the specified color to the ESP32.
 * @param color The RGB color object.
 * @param ipAddress The IP address of the ESP32.
 * @returns A promise that resolves if the request is successful, and rejects otherwise.
 */
export const updateColorOnESP32 = async (color: RGBColor, ipAddress: string): Promise<void> => {
  const { r, g, b } = color;
  const url = `http://${ipAddress}/setcolor?r=${r}&g=${g}&b=${b}`;

  try {
    await fetch(url, {
      method: 'GET',
      mode: 'no-cors', 
      signal: AbortSignal.timeout(2000), // 2-second timeout
    });
  } catch (error) {
    console.error("Failed to send color to ESP32:", error);
    throw new Error("ບໍ່ສາມາດສົ່ງຂໍ້ມູນສີໄດ້");
  }
};

/**
 * Sends a custom pattern sequence to the ESP32.
 * @param pattern The array of PatternStep objects.
 * @param ipAddress The IP address of the ESP32.
 * @returns A promise that resolves if the request is successful, and rejects otherwise.
 */
export const sendPatternToESP32 = async (pattern: PatternStep[], ipAddress: string): Promise<void> => {
  const url = `http://${ipAddress}/setpattern`;
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ steps: pattern }),
      signal: AbortSignal.timeout(5000), // Longer timeout for potentially larger pattern data
    });
  } catch (error) {
    console.error("Failed to send pattern to ESP32:", error);
    throw new Error("ບໍ່ສາມາດສົ່ງແພັດເທີນໄດ້");
  }
};

/**
 * Fetches device information (like firmware version) from the ESP32.
 * Assumes the ESP32 has an /info endpoint that returns a JSON object.
 * @param ipAddress The IP address of the ESP32.
 * @returns A promise that resolves with the device information.
 */
export const getDeviceInfo = async (ipAddress: string): Promise<DeviceInfo> => {
    const url = `http://${ipAddress}/info`;
    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Basic validation
        if (typeof data.version !== 'string') {
             throw new Error("ຂໍ້ມູນທີ່ໄດ້ຮັບບໍ່ຖືກຕ້ອງ");
        }
        return data as DeviceInfo;
    } catch (error) {
        console.error("Failed to get device info:", error);
        throw new Error("ບໍ່ສາມາດດຶງຂໍ້ມູນຈາກອຸປະກອນໄດ້");
    }
};

/**
 * Checks for the latest firmware version from a central server.
 * @returns A promise that resolves with the latest firmware information.
 */
export const checkLatestFirmware = async (): Promise<FirmwareInfo> => {
    try {
        const response = await fetch(`${FIRMWARE_SERVER_URL}?t=${new Date().getTime()}`, {
             cache: 'no-cache'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
         // Basic validation
        if (typeof data.version !== 'string' || typeof data.url !== 'string' || typeof data.changelog !== 'string') {
            throw new Error("ຂໍ້ມູນ Firmware ຈາກເຊີບເວີບໍ່ຖືກຕ້ອງ");
        }
        return data as FirmwareInfo;
    } catch (error) {
        console.error("Failed to check for latest firmware:", error);
        throw new Error("ບໍ່ສາມາດກວດສອບອັບເດດລ່າສຸດໄດ້");
    }
};

/**
 * Sends a command to the ESP32 to start the OTA update process.
 * @param ipAddress The IP address of the ESP32.
 * @param firmwareUrl The URL of the .bin file for the new firmware.
 * @returns A promise that resolves when the update command is sent.
 */
export const triggerEsp32Update = async (ipAddress: string, firmwareUrl: string): Promise<void> => {
    const url = `http://${ipAddress}/update`;
    try {
        // This request only triggers the update. The ESP32 will then handle the download.
        // We use a longer timeout as the ESP32 might be busy before responding.
        await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: firmwareUrl }),
            signal: AbortSignal.timeout(10000), 
        });
    } catch (error) {
        console.error("Failed to trigger ESP32 update:", error);
        // It's possible for this to throw an error because the ESP32 reboots before responding.
        // So, we don't throw a critical error back to the user, the UI will handle the disconnect.
    }
};