import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  StatusBar,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import Slider from '@react-native-community/slider';

const { width, height } = Dimensions.get('window');

function formatTime(ms: number) {
  if (!ms || isNaN(ms)) return '0:00';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VideoPlayerScreen({ route, navigation }: any) {
  const { video } = route.params;
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);

  const isLoaded = status?.isLoaded ?? false;
  const isPlaying = isLoaded && (status as any).isPlaying;
  const positionMs: number = isLoaded ? (status as any).positionMillis ?? 0 : 0;
  const durationMs: number = isLoaded ? (status as any).durationMillis ?? 0 : 0;

  const togglePlay = async () => {
    if (!isLoaded) return;
    if (isPlaying) {
      await videoRef.current?.pauseAsync();
    } else {
      await videoRef.current?.playAsync();
    }
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
    setSeekPosition(positionMs);
  };

  const handleSeekChange = (value: number) => {
    setSeekPosition(value);
  };

  const handleSeekComplete = async (value: number) => {
    await videoRef.current?.setPositionAsync(value);
    setIsSeeking(false);
  };

  const handleReplay = async () => {
    await videoRef.current?.setPositionAsync(0);
    await videoRef.current?.playAsync();
  };

  const progressValue = isSeeking ? seekPosition : positionMs;

  return (
    <View style={[styles.container, fullscreen && styles.containerFullscreen]}>
      <StatusBar hidden={fullscreen} />

      {/* Bouton retour */}
      {!fullscreen && (
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backTxt}>‹ Retour</Text>
        </TouchableOpacity>
      )}

      {/* Titre */}
      {!fullscreen && (
        <Text style={styles.title} numberOfLines={1}>
          {video?.filename?.replace(/\.[^.]+$/, '') || 'Vidéo'}
        </Text>
      )}

      {/* Lecteur vidéo */}
      <View style={[styles.videoWrapper, fullscreen && styles.videoFullscreen]}>
        <Video
          ref={videoRef}
          source={{ uri: video.uri }}
          style={styles.video}
          useNativeControls={false}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          onPlaybackStatusUpdate={s => setStatus(s)}
        />

        {/* Overlay play/pause au tap */}
        <TouchableOpacity style={styles.overlay} onPress={togglePlay} activeOpacity={1}>
          {!isPlaying && (
            <View style={styles.playOverlay}>
              <Text style={styles.playOverlayTxt}>▶</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Bouton quitter fullscreen (visible en plein écran) */}
        {fullscreen && (
          <TouchableOpacity
            style={styles.exitFullBtnOverlay}
            onPress={() => setFullscreen(false)}
          >
            <Text style={styles.ctrlTxt}>⤵️</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Zone de contrôles (hors fullscreen) */}
      {!fullscreen && (
        <View style={styles.controlsArea}>
          {/* Barre de progression */}
          <View style={styles.progressRow}>
            <Text style={styles.timeText}>{formatTime(progressValue)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={durationMs || 1}
              value={progressValue}
              minimumTrackTintColor="#00ffea"
              maximumTrackTintColor="#334"
              thumbTintColor="#00ffea"
              onSlidingStart={handleSeekStart}
              onValueChange={handleSeekChange}
              onSlidingComplete={handleSeekComplete}
            />
            <Text style={styles.timeText}>{formatTime(durationMs)}</Text>
          </View>

          {/* Boutons de contrôle */}
          <View style={styles.controls}>
            <TouchableOpacity style={styles.ctrlBtn} onPress={handleReplay}>
              <Text style={styles.ctrlTxt}>⏮</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ctrlBtnMain} onPress={togglePlay}>
              <Text style={styles.ctrlTxtMain}>{isPlaying ? '⏸' : '▶️'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ctrlBtn}
              onPress={() => videoRef.current?.stopAsync()}
            >
              <Text style={styles.ctrlTxt}>⏹</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ctrlBtn}
              onPress={() => setFullscreen(f => !f)}
            >
              <Text style={styles.ctrlTxt}>{fullscreen ? '⤵️' : '⛶'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  containerFullscreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  backBtn: {
    alignSelf: 'flex-start',
    padding: 16,
    paddingTop: 50,
  },
  backTxt: { color: '#00ffea', fontSize: 18 },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  videoWrapper: {
    width: width,
    height: height * 0.42,
    backgroundColor: '#000',
    position: 'relative',
  },
  videoFullscreen: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100,
  },
  video: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    padding: 18,
  },
  playOverlayTxt: { color: '#fff', fontSize: 36 },
  exitFullBtnOverlay: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 200,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 20,
  },
  controlsArea: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  slider: { flex: 1, height: 40 },
  timeText: {
    color: '#889',
    fontSize: 12,
    width: 44,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginTop: 4,
  },
  ctrlBtn: {
    backgroundColor: 'rgba(0,255,234,0.1)',
    borderWidth: 1,
    borderColor: '#00ffea44',
    padding: 14,
    borderRadius: 50,
  },
  ctrlBtnMain: {
    backgroundColor: '#00ffea',
    padding: 18,
    borderRadius: 50,
    shadowColor: '#00ffea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 6,
  },
  ctrlTxt: { fontSize: 22, color: '#fff' },
  ctrlTxtMain: { fontSize: 28, color: '#000' },
});
