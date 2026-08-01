
// src/config/apiConfig.js
import { Platform } from 'react-native';

// Android emulator should use 10.0.2.2 to reach your PC's localhost
// iOS simulator can use localhost directly

export const API_BASE_URL =
  __DEV__ && Platform.OS === 'android'
    ? 'http://10.0.2.2:5000/api'
    : 'http://localhost:5000/api';