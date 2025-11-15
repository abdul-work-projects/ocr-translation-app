import axios from 'axios';
import { ERROR_MESSAGES } from '../utils/constants';
import type { TranslationResult, Language } from '../types/translation.types';

// Set to true to use demo mode (no API key needed)
const DEMO_MODE = true;

// Google Translate API key (replace with your actual key)
const GOOGLE_TRANSLATE_API_KEY = 'YOUR_API_KEY_HERE';

// Demo translations database
const DEMO_TRANSLATIONS: { [key: string]: { [key: string]: string } } = {
  es: {
    'hello': 'hola',
    'world': 'mundo',
    'good morning': 'buenos días',
    'thank you': 'gracias',
  },
  fr: {
    'hello': 'bonjour',
    'world': 'monde',
    'good morning': 'bonjour',
    'thank you': 'merci',
  },
  de: {
    'hello': 'hallo',
    'world': 'welt',
    'good morning': 'guten morgen',
    'thank you': 'danke',
  },
};

export class TranslationService {
  private static translationCache: Map<string, TranslationResult> = new Map();

  /**
   * Translate text to target language
   */
  static async translateText(
    text: string,
    targetLang: string,
    sourceLang: string = 'auto'
  ): Promise<TranslationResult> {
    try {
      // Check cache first
      const cacheKey = `${sourceLang}-${targetLang}-${text.substring(0, 50)}`;
      const cached = this.translationCache.get(cacheKey);
      if (cached) {
        return cached;
      }

      if (DEMO_MODE) {
        return await this.demoTranslate(text, targetLang, sourceLang);
      }

      // Detect source language if auto
      let detectedSourceLang = sourceLang;
      if (sourceLang === 'auto') {
        detectedSourceLang = await this.detectLanguage(text);
      }

      // Call Google Translate API
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
        {
          q: text,
          target: targetLang,
          source: detectedSourceLang !== 'auto' ? detectedSourceLang : undefined,
          format: 'text',
        }
      );

      const translatedText = response.data.data.translations[0].translatedText;
      const detectedLang = response.data.data.translations[0].detectedSourceLanguage || detectedSourceLang;

      const result: TranslationResult = {
        originalText: text,
        translatedText,
        sourceLang: detectedLang,
        targetLang,
        timestamp: Date.now(),
      };

      // Cache the result
      this.translationCache.set(cacheKey, result);

      return result;
    } catch (error: any) {
      console.error('Translation Error:', error);
      throw new Error(error.message || ERROR_MESSAGES.TRANSLATION_FAILED);
    }
  }

  /**
   * Detect language of text
   */
  static async detectLanguage(text: string): Promise<string> {
    try {
      if (DEMO_MODE) {
        // Simple heuristic detection for demo
        return this.demoDetectLanguage(text);
      }

      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2/detect?key=${GOOGLE_TRANSLATE_API_KEY}`,
        {
          q: text,
        }
      );

      return response.data.data.detections[0][0].language;
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en'; // Default to English
    }
  }

  /**
   * Demo mode - simulates translation
   */
  private static async demoTranslate(
    text: string,
    targetLang: string,
    sourceLang: string
  ): Promise<TranslationResult> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const detectedLang = sourceLang === 'auto' ? this.demoDetectLanguage(text) : sourceLang;

    // Generate demo translation
    let translatedText = this.generateDemoTranslation(text, targetLang);

    const result: TranslationResult = {
      originalText: text,
      translatedText,
      sourceLang: detectedLang,
      targetLang,
      timestamp: Date.now(),
    };

    return result;
  }

  /**
   * Generate demo translation
   */
  private static generateDemoTranslation(text: string, targetLang: string): string {
    // For demo, create a mock translation
    const langNames: { [key: string]: string } = {
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      it: 'Italian',
      pt: 'Portuguese',
      ru: 'Russian',
      ja: 'Japanese',
      ko: 'Korean',
      zh: 'Chinese',
      ar: 'Arabic',
      hi: 'Hindi',
      ur: 'Urdu',
    };

    const languageName = langNames[targetLang] || targetLang.toUpperCase();

    return `[Demo ${languageName} Translation]\n\n${text}\n\n---\nThis is a simulated translation. To use real translation:\n1. Get a Google Translate API key\n2. Set DEMO_MODE to false\n3. Add your API key to the service\n\nThe actual translation would appear here in ${languageName}.`;
  }

  /**
   * Demo language detection
   */
  private static demoDetectLanguage(text: string): string {
    // Simple detection based on common patterns
    const lowerText = text.toLowerCase();

    // Spanish indicators
    if (lowerText.includes('hola') || lowerText.includes('gracias') || lowerText.includes('señor')) {
      return 'es';
    }

    // French indicators
    if (lowerText.includes('bonjour') || lowerText.includes('merci') || lowerText.includes('français')) {
      return 'fr';
    }

    // German indicators
    if (lowerText.includes('hallo') || lowerText.includes('danke') || lowerText.includes('deutsch')) {
      return 'de';
    }

    // Default to English
    return 'en';
  }

  /**
   * Get supported languages
   */
  static async getSupportedLanguages(): Promise<Language[]> {
    // This would call the API in production mode
    // For now, return the list from constants
    return [];
  }

  /**
   * Clear translation cache
   */
  static clearCache(): void {
    this.translationCache.clear();
  }

  /**
   * Get cache size
   */
  static getCacheSize(): number {
    return this.translationCache.size;
  }

  /**
   * Check if translation service is configured
   */
  static isConfigured(): boolean {
    return DEMO_MODE || GOOGLE_TRANSLATE_API_KEY !== 'YOUR_API_KEY_HERE';
  }

  /**
   * Get translation mode (demo or production)
   */
  static getMode(): 'demo' | 'production' {
    return DEMO_MODE ? 'demo' : 'production';
  }
}
