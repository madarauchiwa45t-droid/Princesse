import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';

let sound: Audio.Sound | null = null;
let currentUri: string | null = null;

// Configure le mode audio pour lecture en arrière-plan
async function configureAudio() {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
    });
  } catch (e) {
    console.warn('configureAudio error', e);
  }
}

export async function playUri(uri: string): Promise<void> {
  try {
    await configureAudio();

    // Si même piste déjà chargée, reprendre la lecture
    if (sound && currentUri === uri) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        await sound.playAsync();
        return;
      }
    }

    // Décharger la piste précédente
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (_) {}
      sound = null;
      currentUri = null;
    }

    // Charger et lancer la nouvelle piste
    const { sound: s } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true, staysActiveInBackground: true, progressUpdateIntervalMillis: 500 }
    );
    sound = s;
    currentUri = uri;
  } catch (e) {
    console.warn('playUri error', e);
    throw e;
  }
}

export async function pause(): Promise<void> {
  try {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await sound.pauseAsync();
      }
    }
  } catch (e) {
    console.warn('pause error', e);
  }
}

export async function resume(): Promise<void> {
  try {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && !status.isPlaying) {
        await sound.playAsync();
      }
    }
  } catch (e) {
    console.warn('resume error', e);
  }
}

export async function stop(): Promise<void> {
  try {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      sound = null;
      currentUri = null;
    }
  } catch (e) {
    console.warn('stop error', e);
  }
}

export async function seek(positionMillis: number): Promise<void> {
  try {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        await sound.setPositionAsync(positionMillis);
      }
    }
  } catch (e) {
    console.warn('seek error', e);
  }
}

export async function setVolume(volume: number): Promise<void> {
  try {
    if (sound) {
      await sound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
    }
  } catch (e) {
    console.warn('setVolume error', e);
  }
}

export async function getStatus(): Promise<any> {
  try {
    if (!sound) return null;
    return await sound.getStatusAsync();
  } catch (e) {
    console.warn('getStatus error', e);
    return null;
  }
}

export function getCurrentUri(): string | null {
  return currentUri;
}

export function getSoundInstance(): Audio.Sound | null {
  return sound;
}
