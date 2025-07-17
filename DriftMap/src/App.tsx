import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useMesh, MeshMessage } from './useMesh';

export default function App() {
  const apiKey = 'YOUR_GOOGLE_NEARBY_API_KEY';
  const { self, peers } = useMesh(apiKey);
  const [region, setRegion] = useState(null as any);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      {region && (
        <MapView style={styles.map} initialRegion={region}>
          {self && (
            <Marker
              coordinate={{ latitude: self.lat, longitude: self.lon }}
              pinColor="blue"
              title="Me"
            />
          )}
          {peers.map(p => (
            <Marker
              key={p.id}
              coordinate={{ latitude: p.lat, longitude: p.lon }}
              pinColor="green"
              title={p.id}
            />
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  }
});
