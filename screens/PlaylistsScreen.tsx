import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { saveItem, loadItem } from '../services/asyncHelpers';

const STORAGE_KEY = '@megan_playlists_v2';

interface Playlist {
  id: string;
  name: string;
  tracks: any[];
  createdAt: string;
}

export default function PlaylistsScreen() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newName, setNewName] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  // Charger les playlists depuis AsyncStorage au démarrage
  useEffect(() => {
    (async () => {
      const saved = await loadItem(STORAGE_KEY);
      if (saved) setPlaylists(saved);
    })();
  }, []);

  // Sauvegarder chaque fois que les playlists changent
  useEffect(() => {
    saveItem(STORAGE_KEY, playlists);
  }, [playlists]);

  const addPlaylist = () => {
    const name = newName.trim();
    if (!name) return;
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      tracks: [],
      createdAt: new Date().toLocaleDateString('fr-FR'),
    };
    setPlaylists(prev => [newPlaylist, ...prev]);
    setNewName('');
  };

  const deletePlaylist = (id: string) => {
    Alert.alert(
      'Supprimer',
      'Supprimer cette playlist ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => setPlaylists(prev => prev.filter(p => p.id !== id)),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Mes Playlists</Text>

      {/* Créer une playlist */}
      <View style={styles.addRow}>
        <TextInput
          placeholder="Nom de la playlist..."
          placeholderTextColor="#667"
          value={newName}
          onChangeText={setNewName}
          style={styles.input}
          onSubmitEditing={addPlaylist}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={addPlaylist}>
          <Text style={styles.addBtnTxt}>＋</Text>
        </TouchableOpacity>
      </View>

      {playlists.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🎵</Text>
          <Text style={styles.emptyTxt}>
            Aucune playlist. Créez-en une !
          </Text>
        </View>
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => setExpanded(prev => prev === item.id ? null : item.id)}
              onLongPress={() => deletePlaylist(item.id)}
            >
              <View style={styles.itemLeft}>
                <Text style={styles.playlistIcon}>🎶</Text>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemMeta}>
                    {item.tracks.length} piste{item.tracks.length !== 1 ? 's' : ''} · {item.createdAt}
                  </Text>
                </View>
              </View>
              <Text style={styles.chevron}>
                {expanded === item.id ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Text style={styles.hint}>💡 Appui long sur une playlist pour la supprimer</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: 'transparent' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textShadowColor: '#0ff6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  addRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#00ffea44',
    padding: 10,
    borderRadius: 10,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.06)',
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: '#00ffea',
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnTxt: { fontSize: 22, color: '#000', fontWeight: 'bold' },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1a2a4a',
    backgroundColor: 'rgba(0,255,234,0.03)',
    borderRadius: 8,
    marginBottom: 4,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  playlistIcon: { fontSize: 26 },
  itemName: { color: '#fff', fontSize: 15, fontWeight: '600' },
  itemMeta: { color: '#889', fontSize: 11, marginTop: 2 },
  chevron: { color: '#00ffea', fontSize: 12 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  emptyEmoji: { fontSize: 48 },
  emptyTxt: { color: '#889', textAlign: 'center' },
  hint: { color: '#445', fontSize: 11, textAlign: 'center', marginTop: 8 },
});
