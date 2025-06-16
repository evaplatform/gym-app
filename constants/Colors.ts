/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * The base color is #0cf70d (a vibrant green).
 */

const tintColorLight = '#0cf70d';
const tintColorDark = '#0a9c0b';

export const Colors = {
  light: {
    text: '#11181C',               // Nearly black
    background: '#ffffff',         // Pure white
    backgroundSecondary: '#E9ECEF', // Slightly darker light gray
    tint: tintColorLight,          // Primary action color (green)
    icon: '#687076',               // Soft gray
    tabIconDefault: '#687076',     // Default tab icon
    tabIconSelected: tintColorLight, // Highlighted tab icon
    gray100: '#f8f9fa',
    gray200: '#e9ecef',
    gray300: '#dee2e6',
    gray400: '#ced4da',
    gray500: '#adb5bd',
    gray600: '#6c757d', 
  },
  dark: {
    text: '#ECEDEE',               // Light text
    background: '#151718',         // Deep gray
    backgroundSecondary: '#2c2c2c', // Slightly lighter gray
    tint: tintColorDark,           // Primary action color (green)
    icon: '#9BA1A6',               // Muted gray
    tabIconDefault: '#9BA1A6',     // Default tab icon
    tabIconSelected: tintColorDark, // Highlighted tab icon
    gray100: '#1f1f1f',
    gray200: '#2c2c2c',
    gray300: '#3a3a3a',
    gray400: '#484848',
    gray500: '#5c5c5c',
    gray600: '#717171',
  },
};
