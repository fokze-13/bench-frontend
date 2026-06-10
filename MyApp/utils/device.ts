import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "@/constants/storage";

export async function getDeviceId(): Promise<string> {
    let id = await SecureStore.getItemAsync(STORAGE_KEYS.deviceId);
    if (!id) {
        id = Math.random().toString(36).slice(2) + Date.now().toString(36);
        await SecureStore.setItemAsync(STORAGE_KEYS.deviceId, id);
    }
    return id;
}
