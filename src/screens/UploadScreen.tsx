import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../styles/theme';
import { FileService } from '../services/fileService';
import { OCRService } from '../services/ocrService';
import { FilePreview } from '../components/FileUpload/FilePreview';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { DocumentFile } from '../types/document.types';

type UploadScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Upload'>;
type UploadScreenRouteProp = RouteProp<RootStackParamList, 'Upload'>;

interface Props {
  navigation: UploadScreenNavigationProp;
  route: UploadScreenRouteProp;
}

export const UploadScreen: React.FC<Props> = ({ navigation, route }) => {
  const { type } = route.params;
  const [file, setFile] = useState<DocumentFile | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectFile = async () => {
    try {
      if (type === 'image') {
        // Show options for camera or gallery
        Alert.alert(
          'Select Image',
          'Choose image source',
          [
            {
              text: 'Camera',
              onPress: async () => {
                const selectedFile = await FileService.pickImageFromCamera();
                if (selectedFile) {
                  validateAndSetFile(selectedFile);
                }
              },
            },
            {
              text: 'Gallery',
              onPress: async () => {
                const selectedFile = await FileService.pickImageFromGallery();
                if (selectedFile) {
                  validateAndSetFile(selectedFile);
                }
              },
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
      } else {
        // Pick PDF
        const selectedFile = await FileService.pickPDF();
        if (selectedFile) {
          validateAndSetFile(selectedFile);
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to select file');
    }
  };

  const validateAndSetFile = (selectedFile: DocumentFile) => {
    const validation = FileService.validateFile(selectedFile);
    if (!validation.valid) {
      Alert.alert('Invalid File', validation.error || ERROR_MESSAGES.INVALID_FILE_TYPE);
      return;
    }
    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleExtractText = async () => {
    if (!file) {
      Alert.alert('No File', 'Please select a file first');
      return;
    }

    setLoading(true);

    try {
      let result;

      if (file.type === 'image') {
        result = await OCRService.extractTextFromImage(file.uri);
      } else {
        result = await OCRService.extractTextFromPDF(file.uri);
      }

      setLoading(false);

      if (!result.text || result.text.trim().length === 0) {
        Alert.alert('No Text Found', 'Could not extract any text from the file. Please try a different image.');
        return;
      }

      // Navigate to text display screen
      navigation.navigate('TextDisplay', { text: result.text });
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Error', error.message || ERROR_MESSAGES.OCR_FAILED);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {type === 'image' ? 'Upload Image' : 'Upload PDF'}
      </Text>

      <View style={styles.engineNotice}>
        <Text style={styles.engineText}>🔍 Powered by {OCRService.getEngine()}</Text>
      </View>

      <View style={styles.previewContainer}>
        <FilePreview file={file} onRemove={handleRemoveFile} />
      </View>

      <TouchableOpacity
        style={styles.selectButton}
        onPress={handleSelectFile}
      >
        <Text style={styles.selectButtonText}>
          {file
            ? (type === 'image' ? 'Change Image' : 'Change PDF')
            : (type === 'image' ? 'Select Image' : 'Select PDF')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.extractButton,
          (!file || loading) && styles.extractButtonDisabled
        ]}
        onPress={handleExtractText}
        disabled={!file || loading}
      >
        <Text style={styles.extractButtonText}>
          {loading ? 'Extracting...' : 'Extract Text'}
        </Text>
      </TouchableOpacity>

      <LoadingSpinner
        visible={loading}
        message={`Extracting text from ${type}...`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  engineNotice: {
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  engineText: {
    ...theme.typography.bodySmall,
    color: theme.colors.background,
    fontWeight: '600',
  },
  previewContainer: {
    flex: 1,
    marginBottom: theme.spacing.lg,
  },
  selectButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  selectButtonText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  extractButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.md,
  },
  extractButtonDisabled: {
    opacity: 0.6,
  },
  extractButtonText: {
    ...theme.typography.body,
    color: theme.colors.background,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
