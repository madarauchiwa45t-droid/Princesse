import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MusicScreen from '../screens/MusicScreen';
import NowPlayingScreen from '../screens/NowPlayingScreen';

export type MusicStackParamList = {
  MusicList: undefined;
  NowPlaying: { track: any; playlist: any[] };
};

const Stack = createStackNavigator<MusicStackParamList>();

export default function MusicStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: 'transparent' } }}>
      <Stack.Screen name="MusicList" component={MusicScreen} />
      <Stack.Screen name="NowPlaying" component={NowPlayingScreen} />
    </Stack.Navigator>
  );
}
