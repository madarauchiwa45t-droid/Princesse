import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';
import { ThemeProvider, ThemeContext } from './theme/ThemeContext';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

// Empêche le splash screen de se masquer automatiquement
SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppBody />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppBody() {
  const { theme, loaded } = useContext(ThemeContext);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  const bgSource = theme.customImage
    ? { uri: theme.customImage }
    : theme.background === 'cyber-violet'
    ? require('./assets/backgrounds/cyber-violet.jpg')
    : theme.background === 'holo-cyan'
    ? require('./assets/backgrounds/holo-cyan.jpg')
    : require('./assets/backgrounds/neon-blue.jpg');

  return (
    <ImageBackground
      source={bgSource}
      style={styles.bg}
      imageStyle={{ opacity: theme.opacity ?? 0.6 }}
    >
      <StatusBar style="light" />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
});
