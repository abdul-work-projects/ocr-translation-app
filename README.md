# OCR & Translation App

A React Native Expo application for extracting text from images and PDFs, and translating them into multiple languages.

## Features

- 📷 Upload images from camera or gallery
- 📄 Upload PDF documents
- 🔍 Extract text using OCR
- 🌍 Translate to 50+ languages
- 📋 Copy and share extracted text

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

1. Navigate to the project directory:
```bash
cd OCRTranslationApp
```

2. Install dependencies (already done):
```bash
npm install
```

### Running the App

Start the Expo development server:
```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan the QR code with Expo Go app on your phone

## Project Structure

```
OCRTranslationApp/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Screen components
│   ├── navigation/       # Navigation configuration
│   ├── services/         # OCR and translation services
│   ├── store/            # State management
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions and constants
│   └── styles/           # Theme and styling
├── App.tsx              # Main app entry point
└── package.json         # Dependencies
```

## Current Status

✅ Phase 1 Complete: Basic app structure and navigation
- Home screen with upload options
- Upload screen
- Text display screen
- Translation screen
- Navigation between screens

## Next Steps

1. Implement file upload functionality
2. Integrate OCR library
3. Add translation API
4. Implement copy/share features
5. Add error handling
6. UI/UX improvements

## Technologies Used

- React Native + Expo
- TypeScript
- React Navigation
- Zustand (State Management)
- React Native Paper (UI Components)

## License

Private project
