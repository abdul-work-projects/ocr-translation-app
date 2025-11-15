import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { theme } from '../styles/theme';
import { SUCCESS_MESSAGES } from '../utils/constants';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';

type TextDisplayScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TextDisplay'>;
type TextDisplayScreenRouteProp = RouteProp<RootStackParamList, 'TextDisplay'>;

interface Props {
  navigation: TextDisplayScreenNavigationProp;
  route: TextDisplayScreenRouteProp;
}

export const TextDisplayScreen: React.FC<Props> = ({ navigation, route }) => {
  const { text } = route.params;
  const [editedText, setEditedText] = useState(text);

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(editedText);
      Alert.alert('Success', SUCCESS_MESSAGES.TEXT_COPIED);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy text');
    }
  };

  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      // Create a temporary file with the text
      const fileUri = FileSystem.cacheDirectory + 'extracted_text.txt';
      await FileSystem.writeAsStringAsync(fileUri, editedText);

      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: 'Share extracted text',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share text');
    }
  };

  const handleTranslate = () => {
    navigation.navigate('Translation', { text: editedText });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Extracted Text</Text>

      <ScrollView style={styles.scrollView}>
        <TextInput
          style={styles.textInput}
          multiline
          value={editedText}
          onChangeText={setEditedText}
          placeholder="Extracted text will appear here..."
          placeholderTextColor={theme.colors.textSecondary}
        />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
          <Text style={styles.actionButtonText}>📋 Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Text style={styles.actionButtonText}>📤 Share</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.translateButton} onPress={handleTranslate}>
        <Text style={styles.translateButtonText}>Translate Text</Text>
      </TouchableOpacity>
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
    marginBottom: theme.spacing.lg,
  },
  scrollView: {
    flex: 1,
    marginBottom: theme.spacing.lg,
  },
  textInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
    color: theme.colors.text,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
  },
  translateButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.md,
  },
  translateButtonText: {
    ...theme.typography.body,
    color: theme.colors.background,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
