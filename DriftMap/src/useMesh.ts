import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import {
  connect,
  publish,
  subscribe,
  disconnect
} from 'react-native-google-nearby-messages';
import { v4 as uuidv4 } from 'uuid';

export interface MeshMessage {
  id: string;
  lat: number;
  lon: number;
  ts: number;
}

export function useMesh(apiKey: string) {
  const [peers, setPeers] = useState<MeshMessage[]>([]);
  const [self, setSelf] = useState<MeshMessage | null>(null);
  const idRef = useRef(uuidv4());

  useEffect(() => {
    let unsubPub: (() => void) | undefined;
    let unsubSub: (() => void) | undefined;
    let interval: NodeJS.Timer;
    let disconnectFn: (() => void) | undefined;

    const start = async () => {
      await Location.requestForegroundPermissionsAsync();
      await connect({ apiKey });

      const publishLocation = async () => {
        const loc = await Location.getCurrentPositionAsync({});
        const message: MeshMessage = {
          id: idRef.current,
          lat: loc.coords.latitude,
          lon: loc.coords.longitude,
          ts: Date.now()
        };
        setSelf(message);
        if (unsubPub) unsubPub();
        unsubPub = await publish(JSON.stringify(message));
      };

      await publishLocation();
      interval = setInterval(publishLocation, 10000);

      unsubSub = await subscribe(found => {
        try {
          const msg: MeshMessage = JSON.parse(found);
          if (msg.id === idRef.current) return;
          setPeers(p => {
            const filtered = p.filter(x => x.id !== msg.id);
            return [...filtered, msg];
          });
        } catch {}
      });

      disconnectFn = () => {
        if (interval) clearInterval(interval);
        unsubPub && unsubPub();
        unsubSub && unsubSub();
        disconnect();
      };
    };
    start();

    return () => {
      disconnectFn && disconnectFn();
    };
  }, [apiKey]);

  return { self, peers };
}
