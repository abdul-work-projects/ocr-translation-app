export interface DocumentFile {
  uri: string;
  type: 'image' | 'pdf';
  name?: string;
  size?: number;
}

export interface ExtractedText {
  text: string;
  documentUri: string;
  timestamp: number;
}

export interface OCRResult {
  text: string;
  confidence?: number;
  language?: string;
}
