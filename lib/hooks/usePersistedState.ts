import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting state to localStorage with error handling
 *
 * @param key - localStorage key
 * @param initialValue - fallback value if localStorage is unavailable or empty
 * @returns [value, setValue] tuple similar to useState
 */
export function usePersistedState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize state with value from localStorage or fallback
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage whenever state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      // Handle quota exceeded, security errors in private browsing, etc.
      console.warn(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

/**
 * Get value from localStorage with error handling and type safety
 */
export function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
}

/**
 * Set value in localStorage with error handling
 */
export function setInStorage<T>(key: string, value: T): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Remove item from localStorage with error handling
 */
export function removeFromStorage(key: string): boolean {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
    return false;
  }
}

