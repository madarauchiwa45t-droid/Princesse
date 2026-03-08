import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { ThemeContext } from '../theme/ThemeContext';

const PRESETS = [
  { key: 'neon-blue', label: '🔵 Neon Blue', color: '#091540' },
  { key: 'cyber-violet', label: '🟣 Cyber Violet', color: '#1a0540' },
  { key: 'holo-cyan', label: '🩵 Holo Cyan', color: '#043a40' },
];

export default function BackgroundCustomizer() {
  const { theme, setTheme } = useContext(ThemeContext);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setTheme({ ...theme, customImage: uri, background: 'custom' });
    }
  };

  const selectPreset = (key: string, label: string) => {
    setTheme({ ...theme, background: key, name: label, customImage: null });
  };

  const handleOpacity = (val: number) => {
    setTheme({ ...theme, opacity: val });
  };

  return (
    <View style={styles.container}>
      {/* Préréglages de fond */}
      <Text style={styles.label}>Préréglages</Text>
      <View style={styles.presets}>
        {PRESETS.map(p => (
          <TouchableOpacity
            key={p.key}
            style={[
              styles.presetBtn,
              (theme.background === p.key || (!theme.background && p.key === 'neon-blue')) &&
                styles.presetActive,
              { borderColor: p.color },
            ]}
            onPress={() => selectPreset(p.key, p.label)}
          >
            <Text style={styles.presetTxt}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Image personnalisée */}
      <Text style={styles.label}>Image personnalisée</Text>
      {theme.customImage && (
        <Image source={{ uri: theme.customImage }} style={styles.preview} />
      )}
      <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
        <Text style={styles.pickTxt}>📁 Choisir depuis la galerie</Text>
      </TouchableOpacity>

      {theme.customImage && (
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => setTheme({ ...theme, customImage: null, background: 'neon-blue' })}
        >
          <Text style={styles.resetTxt}>✕ Supprimer l'image</Text>
        </TouchableOpacity>
      )}

      {/* Slider opacité */}
      <Text style={styles.label}>
        Opacité du fond : {Math.round((theme.opacity ?? 0.6) * 100)}%
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={0.1}
        maximumValue={1.0}
        step={0.05}
        value={theme.opacity ?? 0.6}
        minimumTrackTintColor="#00ffea"
        maximumTrackTintColor="#334"
        thumbTintColor="#00ffea"
        onValueChange={handleOpacity}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { color: '#aac', fontSize: 13, marginTop: 10, marginBottom: 4 },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  presetBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  presetActive: {
    backgroundColor: 'rgba(0,255,234,0.15)',
    borderColor: '#00ffea',
  },
  presetTxt: { color: '#fff', fontSize: 12 },
  preview: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  pickBtn: {
    backgroundColor: 'rgba(0,255,234,0.1)',
    borderWidth: 1,
    borderColor: '#00ffea',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  pickTxt: { color: '#00ffea', fontWeight: '700', fontSize: 13 },
  resetBtn: {
    backgroundColor: 'rgba(255,60,60,0.1)',
    borderWidth: 1,
    borderColor: '#ff3c3c',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  resetTxt: { color: '#ff6666', fontSize: 13 },
  slider: { width: '100%', height: 40 },
});
