# OCR Translation App

A mobile application built with React Native and Expo that allows users to extract text from images using OCR (Optical Character Recognition) and translate it into different languages.

## Features

- **Image Upload**: Capture images using camera or select from gallery
- **OCR Text Extraction**: Extract text from images using OCR.space API
- **Language Detection**: Automatically detect the source language of extracted text
- **Multi-language Translation**: Translate text into 12+ languages using MyMemory API
- **Text Management**: Copy extracted and translated text to clipboard
- **Offline Caching**: Translation results are cached for faster access
- **Clean UI**: Modern, intuitive interface with dark theme

## Supported Languages

- English
- Spanish (Español)
- French (Français)
- German (Deutsch)
- Italian (Italiano)
- Portuguese (Português)
- Russian (Русский)
- Arabic (العربية)
- Chinese Simplified (简体中文)
- Japanese (日本語)
- Korean (한국어)
- Hindi (हिन्दी)

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack Navigator)
- **Image Handling**: expo-image-picker, expo-image-manipulator
- **HTTP Client**: Axios
- **OCR Service**: OCR.space API (Free tier - 25,000 requests/month)
- **Translation Service**: MyMemory API (Free tier - 10,000 words/day)
- **UI Components**: React Native Paper (Vector Icons)

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

### Setup Steps

1. Clone the repository:

```bash
git clone <repository-url>
cd ocr-translation-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the Expo development server:

```bash
npx expo start
```

4. Run on your preferred platform:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your physical device

## Usage

### Extract Text from Image

1. Launch the app
2. Tap "Upload Image" or "Upload PDF"
3. Choose to take a photo or select from gallery
4. The app will automatically extract text using OCR
5. View the extracted text on the Text Display screen

### Translate Text

1. After text extraction, tap "Translate"
2. Select your target language from the dropdown
3. Tap the "Translate" button
4. View the translated text below
5. Copy original or translated text using the copy buttons

## Project Structure

```
OCRTranslationApp/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/       # Common components (LoadingSpinner)
│   │   └── FileUpload/   # File upload components
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── UploadScreen.tsx
│   │   ├── TextDisplayScreen.tsx
│   │   └── TranslationScreen.tsx
│   ├── services/         # API services
│   │   ├── ocrService.ts
│   │   ├── translationService.ts
│   │   └── fileService.ts
│   ├── styles/           # Theme and styling
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Constants and utilities
├── App.tsx               # Root component
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript configuration
```

## API Services

### OCR Service (OCR.space)

- **Free Tier**: 25,000 requests/month
- **Engine**: OCR Engine 2 for better accuracy
- **Supported Languages**: 12+ languages
- **API Key**: Uses public demo key (consider getting your own at https://ocr.space/ocrapi)

### Translation Service (MyMemory)

- **Free Tier**: 10,000 words/day
- **No API Key Required**
- **Features**: Automatic language detection, translation caching
- **Supported Language Pairs**: 100+ languages
- **Documentation**: https://mymemory.translated.net/doc/spec.php

## Permissions Required

### iOS

- Camera access (NSCameraUsageDescription)
- Photo library access (NSPhotoLibraryUsageDescription)

### Android

- Camera permission
- Read external storage permission
- Write external storage permission

## Features in Detail

### OCR Text Extraction

- Image optimization and resizing before OCR
- Maximum width of 1024px for faster processing
- JPEG compression (80% quality)
- Automatic orientation detection

### Translation

- In-memory caching for faster repeated translations
- Simple heuristic language detection
- Support for manual language selection
- Real-time translation status updates

### File Management

- Image size validation (max 10MB)
- Type validation for images and PDFs
- File size formatting for display
- Camera and gallery integration

## Known Limitations

- PDF text extraction is not yet implemented (requires additional libraries)
- Language detection uses simple pattern matching (may not be 100% accurate)
- Translation quality depends on MyMemory API
- OCR accuracy depends on image quality and text clarity

## Future Enhancements

- [ ] PDF page rendering and OCR support
- [ ] History of translations and extractions
- [ ] Offline OCR using on-device processing
- [ ] More advanced language detection
- [ ] Text-to-speech for translations
- [ ] Batch image processing
- [ ] Share translations to other apps
- [ ] Dark/Light theme toggle
- [ ] Multiple translation engine options

## Troubleshooting

### Common Issues

**OCR Not Working:**

- Ensure image is clear and well-lit
- Check internet connection
- Verify OCR.space API is accessible

**Translation Failing:**

- Check internet connection
- Verify MyMemory API is accessible
- Try clearing the translation cache

**Camera/Gallery Not Working:**

- Grant necessary permissions in device settings
- Restart the app after granting permissions

**App Crashes:**

- Clear Expo cache: `rm -rf .expo && rm -rf node_modules/.cache`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Restart the development server

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- OCR.space for providing free OCR API
- MyMemory for providing free translation API
- Expo team for excellent development tools
- React Native community for extensive documentation

## Contact

For questions or support, please open an issue in the repository.

---

Built with ❤️ using React Native and Expo
