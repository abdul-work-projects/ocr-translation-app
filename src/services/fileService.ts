import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { FILE_CONSTRAINTS, ERROR_MESSAGES } from '../utils/constants';
import type { DocumentFile } from '../types/document.types';

export class FileService {
  /**
   * Request camera permissions
   */
  static async requestCameraPermission(): Promise<boolean> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  }

  /**
   * Request media library permissions
   */
  static async requestMediaLibraryPermission(): Promise<boolean> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  }

  /**
   * Pick image from camera
   */
  static async pickImageFromCamera(): Promise<DocumentFile | null> {
    try {
      const hasPermission = await this.requestCameraPermission();
      if (!hasPermission) {
        throw new Error(ERROR_MESSAGES.PERMISSION_DENIED);
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: 'image',
          name: asset.fileName || 'camera-image.jpg',
          size: asset.fileSize,
        };
      }

      return null;
    } catch (error) {
      console.error('Error picking image from camera:', error);
      throw error;
    }
  }

  /**
   * Pick image from gallery
   */
  static async pickImageFromGallery(): Promise<DocumentFile | null> {
    try {
      const hasPermission = await this.requestMediaLibraryPermission();
      if (!hasPermission) {
        throw new Error(ERROR_MESSAGES.PERMISSION_DENIED);
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: 'image',
          name: asset.fileName || 'gallery-image.jpg',
          size: asset.fileSize,
        };
      }

      return null;
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      throw error;
    }
  }

  /**
   * Pick PDF document
   */
  static async pickPDF(): Promise<DocumentFile | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: 'pdf',
          name: asset.name,
          size: asset.size,
        };
      }

      return null;
    } catch (error) {
      console.error('Error picking PDF:', error);
      throw error;
    }
  }

  /**
   * Validate file size
   */
  static validateFileSize(size?: number): boolean {
    if (!size) return true;
    return size <= FILE_CONSTRAINTS.MAX_FILE_SIZE;
  }

  /**
   * Validate file type
   */
  static validateFileType(type: 'image' | 'pdf', mimeType?: string): boolean {
    if (!mimeType) return true;

    if (type === 'image') {
      return FILE_CONSTRAINTS.ALLOWED_IMAGE_TYPES.includes(mimeType);
    } else {
      return mimeType === FILE_CONSTRAINTS.ALLOWED_PDF_TYPE;
    }
  }

  /**
   * Validate file
   */
  static validateFile(file: DocumentFile): { valid: boolean; error?: string } {
    // Validate size
    if (!this.validateFileSize(file.size)) {
      return {
        valid: false,
        error: ERROR_MESSAGES.FILE_TOO_LARGE,
      };
    }

    // For now, we trust the type from our pickers
    // Additional validation can be added here

    return { valid: true };
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes?: number): string {
    if (!bytes) return 'Unknown size';

    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}
