import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VideoScreen from '../screens/VideoScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';

export type VideoStackParamList = {
  VideoList: undefined;
  VideoPlayer: { video: any };
};

const Stack = createStackNavigator<VideoStackParamList>();

export default function VideoStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: 'transparent' } }}>
      <Stack.Screen name="VideoList" component={VideoScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
    </Stack.Navigator>
  );
}
