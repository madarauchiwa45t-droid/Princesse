import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { playUri, pause, resume, stop, seek, getStatus } from '../services/playerAudio';
import EqualizerVisualizer from '../components/EqualizerVisualizer';

const { width } = Dimensions.get('window');

export default function NowPlayingScreen({ route, navigation }: any) {
  const { track, playlist } = route.params ?? {};
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  // Indice de la piste courante dans la playlist
  const currentIndex = playlist?.findIndex((t: any) => t.id === track?.id) ?? -1;

  const startPlayback = useCallback(async (t: any) => {
    if (!t || !isMountedRef.current) return;
    setPlaying(false);
    setPosition(0);
    setDuration(0);
    try {
      await playUri(t.uri);
      if (isMountedRef.current) setPlaying(true);
    } catch (e) {
      console.warn('Erreur lecture', e);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    startPlayback(track);
    return () => {
      isMountedRef.current = false;
    };
  }, [track?.id]);

  // Polling du statut de lecture toutes les 500ms
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(async () => {
      if (!isMountedRef.current) return;
      if (isSeeking) return;

      const status = await getStatus();
      if (!isMountedRef.current) return;

      if (status && status.isLoaded) {
        setPosition(status.positionMillis ?? 0);
        if (status.durationMillis) setDuration(status.durationMillis);
        if (status.didJustFinish) {
          goNext();
        }
      }
    }, 500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSeeking, currentIndex, playlist?.length]);

  const goNext = () => {
    if (!playlist || currentIndex < 0) return;
    const nextIndex = (currentIndex + 1) % playlist.length;
    navigation.replace('NowPlaying', { track: playlist[nextIndex], playlist });
  };

  const goPrev = () => {
    if (!playlist || currentIndex < 0) return;
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    navigation.replace('NowPlaying', { track: playlist[prevIndex], playlist });
  };

  const handlePausePlay = async () => {
    if (playing) {
      await pause();
      setPlaying(false);
    } else {
      await resume();
      setPlaying(true);
    }
  };

  const handleStop = async () => {
    await stop();
    setPlaying(false);
    setPosition(0);
  };

  const handleSeekStart = () => setIsSeeking(true);

  const handleSeekComplete = async (value: number) => {
    await seek(value);
    setPosition(value);
    setIsSeeking(false);
  };

  return (
    <View style={styles.container}>
      {/* Bouton retour */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backTxt}>‹ Retour</Text>
      </TouchableOpacity>

      {/* Pochette simulée */}
      <View style={styles.artworkContainer}>
        <View style={styles.artwork}>
          <Text style={styles.artworkEmoji}>🎵</Text>
        </View>
      </View>

      {/* Titre */}
      <Text style={styles.title} numberOfLines={2}>
        {track?.filename?.replace(/\.[^.]+$/, '') || 'Pas de piste'}
      </Text>
      <Text style={styles.indexText}>
        {playlist && currentIndex >= 0
          ? `${currentIndex + 1} / ${playlist.length}`
          : ''}
      </Text>

      {/* Visualiseur */}
      {playing && <EqualizerVisualizer />}

      {/* Barre de progression */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration || 1}
          value={position}
          minimumTrackTintColor="#00ffea"
          maximumTrackTintColor="#334"
          thumbTintColor="#00ffea"
          onSlidingStart={handleSeekStart}
          onSlidingComplete={handleSeekComplete}
        />
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      {/* Contrôles */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.ctrlBtn} onPress={goPrev}>
          <Text style={styles.ctrlTxt}>⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.playBtn} onPress={handlePausePlay}>
          <Text style={styles.playTxt}>{playing ? '⏸' : '▶️'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ctrlBtn} onPress={goNext}>
          <Text style={styles.ctrlTxt}>⏭</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ctrlBtn} onPress={handleStop}>
          <Text style={styles.ctrlTxt}>⏹</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function formatTime(ms: number) {
  if (!ms || isNaN(ms)) return '0:00';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: 50,
    paddingHorizontal: 24,
  },
  backBtn: { alignSelf: 'flex-start', marginBottom: 10 },
  backTxt: { color: '#00ffea', fontSize: 18 },
  artworkContainer: { marginVertical: 20 },
  artwork: {
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: 20,
    backgroundColor: 'rgba(0,255,234,0.08)',
    borderWidth: 2,
    borderColor: '#00ffea44',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00ffea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  artworkEmoji: { fontSize: 80 },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: '#0ff6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  indexText: { color: '#667', fontSize: 12, marginBottom: 12 },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  slider: { flex: 1, height: 40 },
  timeText: { color: '#889', fontSize: 12, width: 40, textAlign: 'center' },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginTop: 20,
  },
  ctrlBtn: {
    backgroundColor: 'rgba(0,255,234,0.1)',
    borderWidth: 1,
    borderColor: '#00ffea44',
    padding: 14,
    borderRadius: 50,
  },
  ctrlTxt: { fontSize: 22 },
  playBtn: {
    backgroundColor: '#00ffea',
    padding: 18,
    borderRadius: 50,
    shadowColor: '#00ffea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 6,
  },
  playTxt: { fontSize: 28 },
});
