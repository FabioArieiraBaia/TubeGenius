
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export enum AppState {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR,
}

export enum GeminiModel {
  FLASH_IMAGE = 'gemini-2.5-flash-image',
}

export enum AspectRatio {
  SQUARE = '1:1',
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  PORTRAIT_4_3 = '3:4',
  LANDSCAPE_4_3 = '4:3',
}

export enum GenerationMode {
  STANDARD = 'standard',
  YOUTUBE_THUMBNAIL = 'youtube_thumbnail',
  CHANNEL_BANNER = 'channel_banner',
  VIRAL_TITLE = 'viral_title',
}

export interface ViralTitle {
  title: string;
  score: number; // 0-100
  cognitiveBias: string;
}

export interface GenerateImageParams {
  prompt: string;
  description?: string; // Added for Banner mode
  model: GeminiModel;
  aspectRatio: AspectRatio;
  referenceImage?: string; // base64 string
  referenceImageMimeType?: string;
  mode: GenerationMode;
}

export interface GenerationResult {
  imageUrls: string[];
  textResults?: ViralTitle[];
}
