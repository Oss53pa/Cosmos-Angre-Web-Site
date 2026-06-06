import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  language: 'fr' | 'en';
  notifications: Notification[];
  isLoading: boolean;
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: 'light',
  language: (localStorage.getItem('language') as 'fr' | 'en') || 'fr',
  notifications: [],
  isLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    setLanguage: (state, action: PayloadAction<'fr' | 'en'>) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setLanguage,
  addNotification,
  removeNotification,
  clearNotifications,
  setGlobalLoading,
} = uiSlice.actions;

// Selectors
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export const selectTheme = (state: RootState) => state.ui.theme;
export const selectLanguage = (state: RootState) => state.ui.language;
export const selectNotifications = (state: RootState) => state.ui.notifications;
export const selectGlobalLoading = (state: RootState) => state.ui.isLoading;

export default uiSlice.reducer;
