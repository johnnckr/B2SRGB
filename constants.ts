import type { PresetColor, PatternStep } from './types';
import { RGBColor } from './types';

// ! ຄ່າເລີ່ມຕົ້ນສຳລັບ IP Address ຂອງ ESP32
// ! Default value for the ESP32's IP Address.
export const DEFAULT_ESP32_IP = "192.168.1.100";

// ! URL ຂອງເຊີບເວີທີ່ເກັບໄຟລ໌ version.json ແລະ firmware.bin
// ! URL of the server hosting the version.json and firmware.bin files.
// ! ຕ້ອງປ່ຽນແທນດ້ວຍ URL ຂອງທ່ານເອງ.
export const FIRMWARE_SERVER_URL = "https://raw.githubusercontent.com/user/repo/main/firmware/version.json";


export const PRESET_COLORS: PresetColor[] = [
  { name: 'ສີແດງ', color: { r: 255, g: 0, b: 0 }, class: 'bg-red-500' },
  { name: 'ສີຂຽວ', color: { r: 0, g: 255, b: 0 }, class: 'bg-green-500' },
  { name: 'ສີຟ້າ', color: { r: 0, g: 0, b: 255 }, class: 'bg-blue-500' },
  { name: 'ສີເຫຼືອງ', color: { r: 255, g: 255, b: 0 }, class: 'bg-yellow-400' },
  { name: 'ສີຟ້າອ່ອນ', color: { r: 0, g: 255, b: 255 }, class: 'bg-cyan-400' },
  { name: 'ສີມ່ວງ', color: { r: 255, g: 0, b: 255 }, class: 'bg-fuchsia-500' },
  { name: 'ສີຂາວ', color: { r: 255, g: 255, b: 255 }, class: 'bg-white' },
];

export const OFF_COLOR: RGBColor = { r: 0, g: 0, b: 0 };
export const DEFAULT_COLOR: RGBColor = { r: 239, g: 68, b: 68 }; // Red-500

export const MAX_PATTERN_STEPS = 256;
export const DEFAULT_STEP_DURATION = 500;
export const DEFAULT_STEP_BRIGHTNESS = 100;
export const INITIAL_PATTERN_STEP: PatternStep = {
    color: DEFAULT_COLOR,
    duration: DEFAULT_STEP_DURATION,
    brightness: DEFAULT_STEP_BRIGHTNESS,
};