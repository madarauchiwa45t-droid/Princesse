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

const PAGE_SIZE = 30;

export default function VideoScreen({ navigation }: any) {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [after, setAfter] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);

  const loadVideos = useCallback(async (afterCursor?: string) => {
    if (loading || (!hasMore && afterCursor)) return;
    setLoading(true);
    try {
      const res = await MediaLibrary.getAssetsAsync({
        mediaType: 'video',
        first: PAGE_SIZE,
        after: afterCursor,
        sortBy: [MediaLibrary.SortBy.default],
      });
      setVideos(prev => afterCursor ? [...prev, ...res.assets] : res.assets);
      setHasMore(res.hasNextPage);
      setAfter(res.endCursor);
    } catch (e) {
      console.warn('Erreur chargement vidéos', e);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        setPermissionGranted(true);
        loadVideos();
      }
    })();
  }, []);

  const filteredVideos = search.trim()
    ? videos.filter(v => v.filename.toLowerCase().includes(search.toLowerCase()))
    : videos;

  if (!permissionGranted) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>
          Autorisation nécessaire pour accéder à vos vidéos.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Rechercher une vidéo..."
        placeholderTextColor="#667"
        value={search}
        onChangeText={setSearch}
      />

      {filteredVideos.length === 0 && !loading ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Aucune vidéo trouvée.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredVideos}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate('VideoPlayer', { video: item })}
            >
              <Text style={styles.videoIcon}>🎬</Text>
              <View style={styles.itemInfo}>
                <Text style={styles.text} numberOfLines={1}>
                  {item.filename.replace(/\.[^.]+$/, '')}
                </Text>
                <Text style={styles.meta}>
                  {formatDuration(item.duration)} · {formatSize(item.fileSize)}
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          )}
          onEndReached={() => !search && loadVideos(after)}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator color="#00ffea" style={{ margin: 16 }} />
            ) : null
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

function formatSize(bytes: number) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
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
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1a2a4a',
    gap: 10,
  },
  videoIcon: { fontSize: 28 },
  itemInfo: { flex: 1 },
  text: { color: '#fff', fontSize: 14, fontWeight: '600' },
  meta: { color: '#889', fontSize: 11, marginTop: 2 },
  arrow: { color: '#00ffea', fontSize: 22, fontWeight: '300' },
  emptyText: { color: '#889', textAlign: 'center', padding: 20 },
});
