import axios from 'axios';
import * as ImageManipulator from 'expo-image-manipulator';
import { ERROR_MESSAGES } from '../utils/constants';
import type { OCRResult } from '../types/document.types';

// OCR.space API key (Free - get yours at https://ocr.space/ocrapi)
// Free tier: 25,000 requests/month
const OCR_SPACE_API_KEY = 'K87899142388957'; // This is a public demo key

export class OCRService {
  /**
   * Extract text from an image URI using OCR.space API
   */
  static async extractTextFromImage(
    imageUri: string,
    language: string = 'eng',
    onProgress?: (progress: number) => void
  ): Promise<OCRResult> {
    try {
      // Prepare image for OCR (resize and optimize)
      const processedImage = await this.prepareImageForOCR(imageUri);

      // Create form data with file upload
      const formData = new FormData();

      // Add the file as a blob
      formData.append('file', {
        uri: processedImage.uri,
        type: 'image/jpeg',
        name: 'image.jpg',
      } as any);

      formData.append('language', language);
      formData.append('isOverlayRequired', 'false');
      formData.append('detectOrientation', 'true');
      formData.append('scale', 'true');
      formData.append('OCREngine', '2'); // Use OCR Engine 2 for better accuracy

      const response = await axios.post(
        'https://api.ocr.space/parse/image',
        formData,
        {
          headers: {
            'apikey': OCR_SPACE_API_KEY,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      if (response.data.OCRExitCode !== 1) {
        throw new Error(response.data.ErrorMessage || 'OCR processing failed');
      }

      const parsedText = response.data.ParsedResults?.[0]?.ParsedText;

      if (!parsedText || parsedText.trim().length === 0) {
        throw new Error('No text found in the image. Please try a clearer image.');
      }

      return {
        text: parsedText,
        confidence: 0.85, // OCR.space doesn't provide confidence, estimate 85%
        language: language,
      };
    } catch (error: any) {
      console.error('OCR Error:', error);
      if (error.response?.data?.ErrorMessage) {
        throw new Error(error.response.data.ErrorMessage);
      }
      throw new Error(error.message || ERROR_MESSAGES.OCR_FAILED);
    }
  }

  /**
   * Prepare image for OCR (resize, optimize)
   */
  private static async prepareImageForOCR(imageUri: string) {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          { resize: { width: 1024 } }, // Resize to max width 1024
        ],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      return manipResult;
    } catch (error) {
      console.error('Image preparation error:', error);
      throw error;
    }
  }


  /**
   * Extract text from PDF (converts to images first)
   */
  static async extractTextFromPDF(
    pdfUri: string,
    onProgress?: (progress: number) => void
  ): Promise<OCRResult> {
    try {
      // For now, return a helpful message
      // Full PDF support requires additional libraries to render pages
      throw new Error(
        'PDF OCR requires converting pages to images first. ' +
        'Please use the image upload option instead. ' +
        'You can screenshot PDF pages or use a PDF-to-image converter.'
      );

      // TODO: Future implementation
      // 1. Use react-native-pdf or pdf.js to render pages
      // 2. Convert each page to image
      // 3. Run OCR on each image
      // 4. Combine results
    } catch (error: any) {
      console.error('PDF OCR Error:', error);
      throw new Error(error.message);
    }
  }

  /**
   * Check if OCR service is ready
   */
  static isConfigured(): boolean {
    return true; // Tesseract is always ready
  }

  /**
   * Get OCR engine name
   */
  static getEngine(): string {
    return 'OCR.space (Free)';
  }

  /**
   * Get supported languages
   */
  static getSupportedLanguages(): Array<{ code: string; name: string }> {
    return [
      { code: 'eng', name: 'English' },
      { code: 'spa', name: 'Spanish' },
      { code: 'fra', name: 'French' },
      { code: 'deu', name: 'German' },
      { code: 'ita', name: 'Italian' },
      { code: 'por', name: 'Portuguese' },
      { code: 'rus', name: 'Russian' },
      { code: 'ara', name: 'Arabic' },
      { code: 'chi_sim', name: 'Chinese (Simplified)' },
      { code: 'jpn', name: 'Japanese' },
      { code: 'kor', name: 'Korean' },
      { code: 'hin', name: 'Hindi' },
    ];
  }
}
