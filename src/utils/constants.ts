// Language codes for translation
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ur', name: 'Urdu' },
  { code: 'tr', name: 'Turkish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'th', name: 'Thai' },
  { code: 'id', name: 'Indonesian' },
];

// File validation constants
export const FILE_CONSTRAINTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  ALLOWED_PDF_TYPE: 'application/pdf',
};

// Error messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds 10MB limit',
  INVALID_FILE_TYPE: 'Invalid file type. Only JPG, PNG, and PDF are supported',
  OCR_FAILED: 'Failed to extract text from the file',
  TRANSLATION_FAILED: 'Translation failed. Please try again',
  PERMISSION_DENIED: 'Permission denied. Please enable permissions in settings',
  NETWORK_ERROR: 'Network error. Please check your internet connection',
};

// Success messages
export const SUCCESS_MESSAGES = {
  TEXT_COPIED: 'Text copied to clipboard',
  TEXT_SHARED: 'Text shared successfully',
  OCR_COMPLETED: 'Text extracted successfully',
  TRANSLATION_COMPLETED: 'Translation completed',
};
