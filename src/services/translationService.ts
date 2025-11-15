import axios from 'axios';
import { ERROR_MESSAGES } from '../utils/constants';
import type { TranslationResult, Language } from '../types/translation.types';

// MyMemory Translation API (Free - no API key needed)
// Free tier: 10,000 words/day
// Optional: Get free API key at https://mymemory.translated.net/doc/spec.php for higher limits
const MYMEMORY_API_URL = 'https://api.mymemory.translated.net/get';

export class TranslationService {
  private static translationCache: Map<string, TranslationResult> = new Map();

  /**
   * Translate text to target language using MyMemory API
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

      // Detect source language if auto
      let detectedSourceLang = sourceLang;
      if (sourceLang === 'auto') {
        detectedSourceLang = await this.detectLanguage(text);
      }

      // Prepare language pair
      const langPair = detectedSourceLang === 'auto'
        ? targetLang
        : `${detectedSourceLang}|${targetLang}`;

      // Call MyMemory Translation API
      const response = await axios.get(MYMEMORY_API_URL, {
        params: {
          q: text,
          langpair: langPair,
        },
        timeout: 15000,
      });

      if (response.data.responseStatus !== 200) {
        throw new Error('Translation failed. Please try again.');
      }

      const translatedText = response.data.responseData.translatedText;

      if (!translatedText || translatedText === text) {
        throw new Error('Translation not available for this language pair.');
      }

      const result: TranslationResult = {
        originalText: text,
        translatedText,
        sourceLang: detectedSourceLang,
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
      // Use simple heuristic detection
      return this.simpleLanguageDetection(text);
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en'; // Default to English
    }
  }

  /**
   * Simple language detection based on common patterns
   */
  private static simpleLanguageDetection(text: string): string {
    const lowerText = text.toLowerCase();

    // Spanish indicators
    if (lowerText.match(/\b(hola|gracias|señor|buenos|días|como|está)\b/)) {
      return 'es';
    }

    // French indicators
    if (lowerText.match(/\b(bonjour|merci|français|comment|allez|vous)\b/)) {
      return 'fr';
    }

    // German indicators
    if (lowerText.match(/\b(hallo|danke|deutsch|guten|morgen|wie)\b/)) {
      return 'de';
    }

    // Italian indicators
    if (lowerText.match(/\b(ciao|grazie|italiano|buongiorno|come|stai)\b/)) {
      return 'it';
    }

    // Portuguese indicators
    if (lowerText.match(/\b(olá|obrigado|português|bom|dia|como)\b/)) {
      return 'pt';
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
    return true; // MyMemory is always available
  }

  /**
   * Get translation engine name
   */
  static getEngine(): string {
    return 'MyMemory (Free)';
  }

  /**
   * Get translation mode
   */
  static getMode(): 'free' | 'demo' {
    return 'free';
  }
}
