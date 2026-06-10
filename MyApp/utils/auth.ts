import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '@/constants/storage';
import { ENDPOINTS } from '@/constants/api';
import { getDeviceId } from './device';

export async function fetchToken(): Promise<string> {
  const deviceId = await getDeviceId();
  const res = await fetch(ENDPOINTS.getToken, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ device_id: deviceId }),
  });
  if (!res.ok) throw new Error('Auth failed');
  const { token } = await res.json();
  await SecureStore.setItemAsync(STORAGE_KEYS.token, token);
  return token;
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(STORAGE_KEYS.token);
}