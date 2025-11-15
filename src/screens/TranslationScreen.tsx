import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { theme } from '../styles/theme';
import { LANGUAGES, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants';
import { TranslationService } from '../services/translationService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';

type TranslationScreenRouteProp = RouteProp<RootStackParamList, 'Translation'>;

interface Props {
  route: TranslationScreenRouteProp;
}

export const TranslationScreen: React.FC<Props> = ({ route }) => {
  const { text } = route.params;
  const [targetLang, setTargetLang] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLang, setDetectedLang] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  // Auto-detect language on mount
  useEffect(() => {
    detectSourceLanguage();
  }, []);

  const detectSourceLanguage = async () => {
    try {
      const detected = await TranslationService.detectLanguage(text);
      setDetectedLang(detected);
    } catch (error) {
      console.error('Language detection failed:', error);
    }
  };

  const handleTranslate = async () => {
    if (!targetLang) {
      Alert.alert('Error', 'Please select a target language');
      return;
    }

    setLoading(true);

    try {
      const result = await TranslationService.translateText(text, targetLang, detectedLang || 'auto');
      setTranslatedText(result.translatedText);
      setDetectedLang(result.sourceLang);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Error', error.message || ERROR_MESSAGES.TRANSLATION_FAILED);
    }
  };

  const handleCopyOriginal = async () => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Success', 'Original text copied');
  };

  const handleCopyTranslated = async () => {
    if (!translatedText) {
      Alert.alert('Error', 'No translation available');
      return;
    }
    await Clipboard.setStringAsync(translatedText);
    Alert.alert('Success', 'Translated text copied');
  };

  const selectedLanguage = LANGUAGES.find(lang => lang.code === targetLang);
  const sourceLanguage = LANGUAGES.find(lang => lang.code === detectedLang);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Translate Text</Text>

        <View style={styles.engineNotice}>
          <Text style={styles.engineText}>🌐 Powered by {TranslationService.getEngine()}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Original Text Section */}
        <View style={styles.textSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>
              Original Text {sourceLanguage && `(${sourceLanguage.name})`}
            </Text>
            <TouchableOpacity onPress={handleCopyOriginal} style={styles.copyButton}>
              <Text style={styles.copyButtonText}>📋 Copy</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.textContainer}
            contentContainerStyle={styles.textContentContainer}
          >
            <Text style={styles.text}>{text}</Text>
          </ScrollView>
        </View>

        {/* Translated Text Section */}
        {translatedText !== '' && (
          <View style={styles.textSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>
                Translated Text ({selectedLanguage?.name})
              </Text>
              <TouchableOpacity onPress={handleCopyTranslated} style={styles.copyButton}>
                <Text style={styles.copyButtonText}>📋 Copy</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.textContainer}
              contentContainerStyle={styles.textContentContainer}
            >
              <Text style={styles.text}>{translatedText}</Text>
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {/* Language Selector */}
        <View style={styles.languageSelector}>
          <Text style={styles.languageSelectorLabel}>Translate to:</Text>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => setShowLanguages(!showLanguages)}
          >
            <Text style={styles.languageButtonText}>
              {selectedLanguage?.name || 'Select Language'}
            </Text>
            <Text style={styles.languageButtonIcon}>{showLanguages ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showLanguages && (
            <ScrollView style={styles.languageList}>
              {LANGUAGES.map(lang => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageItem,
                    lang.code === targetLang && styles.languageItemSelected,
                  ]}
                  onPress={() => {
                    setTargetLang(lang.code);
                    setShowLanguages(false);
                    setTranslatedText('');
                  }}
                >
                  <Text style={[
                    styles.languageItemText,
                    lang.code === targetLang && styles.languageItemTextSelected,
                  ]}>
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Translate Button */}
        <TouchableOpacity
          style={[styles.translateButton, loading && styles.translateButtonDisabled]}
          onPress={handleTranslate}
          disabled={loading}
        >
          <Text style={styles.translateButtonText}>
            {loading ? 'Translating...' : 'Translate'}
          </Text>
        </TouchableOpacity>
      </View>

      <LoadingSpinner
        visible={loading}
        message="Translating text..."
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
  header: {
    // Fixed header section at top
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  engineNotice: {
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  engineText: {
    ...theme.typography.bodySmall,
    color: theme.colors.background,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  textSection: {
    flex: 1,
    marginBottom: theme.spacing.md,
    minHeight: 0, // Important for nested ScrollView
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionLabel: {
    ...theme.typography.h3,
    color: theme.colors.text,
    flex: 1,
  },
  copyButton: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  copyButtonText: {
    ...theme.typography.caption,
    color: theme.colors.text,
  },
  textContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  textContentContainer: {
    flexGrow: 1,
  },
  footer: {
    // Fixed footer section at bottom
  },
  languageSelector: {
    marginBottom: theme.spacing.md,
    zIndex: 1000,
  },
  languageSelectorLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  languageButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  languageButtonIcon: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  languageList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.xs,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  languageItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  languageItemSelected: {
    backgroundColor: theme.colors.primary,
  },
  languageItemText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  languageItemTextSelected: {
    color: theme.colors.background,
    fontWeight: '600',
  },
  translateButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.md,
  },
  translateButtonDisabled: {
    opacity: 0.6,
  },
  translateButtonText: {
    ...theme.typography.body,
    color: theme.colors.background,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
