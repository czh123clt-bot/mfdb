export type EditMode = 'remove' | 'text' | 'replace' | 'custom';

export type PerformanceScheme = 'scheme1' | 'scheme2' | 'scheme3';

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface DoubaoConfig {
  apiKey: string;
  endpointId: string;
  useCustomKey: boolean;
}

export interface GenerationRequest {
  originalImage: string; // Base64 data URL
  maskImage: string;     // Base64 mask data URL
  prompt: string;
  mode: EditMode;
  width: number;
  height: number;
  doubaoConfig?: DoubaoConfig;
}

export interface GenerationResponse {
  success: boolean;
  resultImage?: string; // Base64 data URL
  width: number;
  height: number;
  modelUsed: string;
  isSimulated?: boolean;
  error?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  originalUrl: string;
  resultUrl: string;
  prompt: string;
  mode: EditMode;
  width: number;
  height: number;
}
