import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {GameEngine} from 'react';
import BalloonGame from './Components/BalloonGame/BalloonGame';
 
export default function App() {
  return (
    <BalloonGame/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
