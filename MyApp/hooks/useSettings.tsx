import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { darkColors, lightColors, ThemeColors } from "@/styles/theme";

export interface Settings {
  theme: "light" | "dark";
  sendOnEnter: boolean;
  vibrateOnMessage: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  sendOnEnter: true,
  vibrateOnMessage: true,
};

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>;
  colors: ThemeColors;
  isDark: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const stored = await SecureStore.getItemAsync("user_settings");
        if (stored) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
        }
      } catch (e) {
        console.error("Failed to load settings", e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  async function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    try {
      await SecureStore.setItemAsync("user_settings", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  }

  const isDark = settings.theme === "dark";
  const colors = isDark ? darkColors : lightColors;

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, colors, isDark }}>
      {!loading && children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
