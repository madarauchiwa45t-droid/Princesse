import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface MiniPlayerProps {
  track: any;
  isPlaying: boolean;
  onToggle: () => void;
  onPress: () => void;
}

export default function MiniPlayer({ track, isPlaying, onToggle, onPress }: MiniPlayerProps) {
  if (!track) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.infoArea} onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.emoji}>🎵</Text>
        <View style={styles.textArea}>
          <Text numberOfLines={1} style={styles.title}>
            {track.filename?.replace(/\.[^.]+$/, '') || 'Piste inconnue'}
          </Text>
          <Text style={styles.sub}>Appuyer pour ouvrir</Text>
        </View>
      </TouchableOpacity>

      {/* Bouton play/pause sur le mini player */}
      <TouchableOpacity style={styles.playBtn} onPress={onToggle}>
        <Text style={styles.playTxt}>{isPlaying ? '⏸' : '▶️'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 20, 50, 0.88)',
    borderWidth: 1,
    borderColor: '#00ffea44',
    shadowColor: '#00ffea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  infoArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emoji: { fontSize: 24 },
  textArea: { flex: 1 },
  title: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  sub: { color: '#667', fontSize: 10, marginTop: 1 },
  playBtn: {
    backgroundColor: '#00ffea',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playTxt: { fontSize: 18 },
});
