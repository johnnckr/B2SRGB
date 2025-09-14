export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface PresetColor {
  name: string;
  color: RGBColor;
  class: string;
}

export enum StatusType {
    IDLE = 'IDLE',
    SENDING = 'SENDING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR'
}

export enum ConnectionStatus {
    DISCONNECTED = 'DISCONNECTED',
    CONNECTING = 'CONNECTING',
    CONNECTED = 'CONNECTED',
}

export interface Status {
    type: StatusType;
    message: string;
}

export interface PatternStep {
  color: RGBColor;
  duration: number; // in ms, 50-2000
  brightness: number; // in %, 0-100
}

export type ControlMode = 'SOLID' | 'PATTERN' | 'SYSTEM';

export interface DeviceInfo {
  version: string;
}

export interface FirmwareInfo {
  version: string;
  url: string;
  changelog: string;
}