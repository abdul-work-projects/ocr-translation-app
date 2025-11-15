import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { UploadScreen } from '../screens/UploadScreen';
import { TextDisplayScreen } from '../screens/TextDisplayScreen';
import { TranslationScreen } from '../screens/TranslationScreen';
import { theme } from '../styles/theme';

export type RootStackParamList = {
  Home: undefined;
  Upload: { type: 'image' | 'pdf' };
  TextDisplay: { text: string };
  Translation: { text: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.background,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Upload"
          component={UploadScreen}
          options={{ title: 'Upload Document' }}
        />
        <Stack.Screen
          name="TextDisplay"
          component={TextDisplayScreen}
          options={{ title: 'Extracted Text' }}
        />
        <Stack.Screen
          name="Translation"
          component={TranslationScreen}
          options={{ title: 'Translation' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
