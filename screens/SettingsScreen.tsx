import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BackgroundCustomizer from '../components/BackgroundCustomizer';
import { ThemeContext } from '../theme/ThemeContext';

export default function SettingsScreen() {
  const { theme } = useContext(ThemeContext);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>⚙️ Paramètres</Text>

      {/* Infos app */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>À propos de Megan</Text>
        <Text style={styles.info}>Version : 1.0.0</Text>
        <Text style={styles.info}>Thème actif : {theme.name ?? 'Neon Blue'}</Text>
        <Text style={styles.info}>Opacité : {Math.round((theme.opacity ?? 0.6) * 100)}%</Text>
      </View>

      {/* Personnalisation du fond */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎨 Fond d'écran</Text>
        <BackgroundCustomizer />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 14 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: '#0ff6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  card: {
    backgroundColor: 'rgba(0,255,234,0.04)',
    borderWidth: 1,
    borderColor: '#00ffea22',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#00ffea',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  info: { color: '#aab', fontSize: 13, marginBottom: 4 },
});
