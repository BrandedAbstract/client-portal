import { renderHook, act } from '@testing-library/react-hooks';
import { useMesh } from './useMesh';
import * as Location from 'expo-location';
import { connect, publish, subscribe } from 'react-native-google-nearby-messages';

jest.mock('expo-location');
jest.mock('react-native-google-nearby-messages', () => ({
  publish: jest.fn(),
  subscribe: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn()
}));

const mockPublish = publish as jest.Mock;
const mockSubscribe = subscribe as jest.Mock;
const mockConnect = connect as jest.Mock;

beforeEach(() => {
  mockPublish.mockResolvedValue(jest.fn());
  mockSubscribe.mockResolvedValue(jest.fn());
  mockConnect.mockResolvedValue(undefined);
  (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
  (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({ coords: { latitude: 1, longitude: 2 } });
});

test('publishes current location', async () => {
  jest.useFakeTimers();
  const { result } = renderHook(() => useMesh('k')); 
  await act(async () => {
    jest.runOnlyPendingTimers();
  });
  expect(mockPublish).toHaveBeenCalled();
  expect(result.current.self?.lat).toBe(1);
  jest.useRealTimers();
});
