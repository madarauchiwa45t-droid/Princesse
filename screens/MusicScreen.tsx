import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { playUri, pause, getStatus } from '../services/playerAudio';
import MiniPlayer from '../components/MiniPlayer';

const PAGE_SIZE = 30;

export default function MusicScreen({ navigation }: any) {
  const [tracks, setTracks] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [after, setAfter] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);

  const loadTracks = useCallback(async (afterCursor?: string) => {
    if (loading || (!hasMore && afterCursor)) return;
    setLoading(true);
    try {
      const res = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: PAGE_SIZE,
        after: afterCursor,
        sortBy: [MediaLibrary.SortBy.default],
      });
      setTracks(prev => afterCursor ? [...prev, ...res.assets] : res.assets);
      setHasMore(res.hasNextPage);
      setAfter(res.endCursor);
    } catch (e) {
      console.warn('Erreur chargement pistes', e);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        setPermissionGranted(true);
        loadTracks();
      }
    })();
  }, []);

  const playTrack = async (track: any) => {
    await playUri(track.uri);
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleMiniPlayerToggle = async () => {
    if (isPlaying) {
      await pause();
      setIsPlaying(false);
    } else if (currentTrack) {
      await playUri(currentTrack.uri);
      setIsPlaying(true);
    }
  };

  const filteredTracks = search.trim()
    ? tracks.filter(t => t.filename.toLowerCase().includes(search.toLowerCase()))
    : tracks;

  if (!permissionGranted) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>
          Autorisation nécessaire pour accéder à vos fichiers audio.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Rechercher une piste..."
        placeholderTextColor="#667"
        value={search}
        onChangeText={setSearch}
      />

      {filteredTracks.length === 0 && !loading ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Aucune piste audio trouvée.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTracks}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: currentTrack ? 90 : 20 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.item,
                currentTrack?.id === item.id && styles.activeItem,
              ]}
              onPress={() => playTrack(item)}
            >
              <View style={styles.itemLeft}>
                <Text style={styles.trackNum}>{index + 1}</Text>
                <View>
                  <Text style={styles.text} numberOfLines={1}>
                    {item.filename.replace(/\.[^.]+$/, '')}
                  </Text>
                  <Text style={styles.duration}>
                    {formatDuration(item.duration)}
                  </Text>
                </View>
              </View>
              {currentTrack?.id === item.id && (
                <Text style={styles.playingIcon}>{isPlaying ? '▶️' : '⏸️'}</Text>
              )}
            </TouchableOpacity>
          )}
          onEndReached={() => !search && loadTracks(after)}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator color="#00ffea" style={{ margin: 16 }} />
            ) : null
          }
        />
      )}

      {/* Mini lecteur en bas */}
      {currentTrack && (
        <MiniPlayer
          track={currentTrack}
          isPlaying={isPlaying}
          onToggle={handleMiniPlayerToggle}
          onPress={() =>
            navigation.navigate('NowPlaying', {
              track: currentTrack,
              playlist: filteredTracks,
            })
          }
        />
      )}
    </View>
  );
}

function formatDuration(seconds: number) {
  if (!seconds) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchInput: {
    margin: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#0ff2',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1a2a4a',
  },
  activeItem: {
    backgroundColor: 'rgba(0,255,234,0.08)',
    borderLeftWidth: 3,
    borderLeftColor: '#00ffea',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
  trackNum: { color: '#556', fontSize: 12, width: 24, textAlign: 'center' },
  text: { color: '#fff', fontSize: 14, fontWeight: '600', maxWidth: 250 },
  duration: { color: '#889', fontSize: 11, marginTop: 2 },
  playingIcon: { fontSize: 18 },
  emptyText: { color: '#889', textAlign: 'center', padding: 20 },
});
