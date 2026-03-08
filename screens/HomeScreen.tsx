import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Megan</Text>
      <Text style={styles.subtitle}>Lecteur Futuriste Vidéos & Musiques</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('MusicTab')}
        >
          <Text style={styles.btnEmoji}>🎵</Text>
          <Text style={styles.btnText}>Musique</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('VideosTab')}
        >
          <Text style={styles.btnEmoji}>🎬</Text>
          <Text style={styles.btnText}>Vidéos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Playlists')}
        >
          <Text style={styles.btnEmoji}>📋</Text>
          <Text style={styles.btnText}>Playlists</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 24,
    shadowColor: '#0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#0ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#aac',
    marginTop: 6,
    marginBottom: 40,
    letterSpacing: 1,
  },
  buttons: {
    flexDirection: 'row',
    gap: 14,
  },
  btn: {
    backgroundColor: 'rgba(0,255,234,0.1)',
    borderWidth: 1,
    borderColor: '#00ffea',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
    minWidth: 90,
  },
  btnEmoji: { fontSize: 28, marginBottom: 6 },
  btnText: { color: '#00ffea', fontWeight: '700', fontSize: 12 },
});
