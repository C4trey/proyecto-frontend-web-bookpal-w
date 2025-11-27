import { useState } from "react";

export const useLocalStorage = (
  keyName: string, 
  defaultValue: string
): [string, (value: string) => void] => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Intentar obtener el valor del localStorage
      const value = window.localStorage.getItem(keyName);
      if (value) {
        return value;
      } else {
        window.localStorage.setItem(keyName, defaultValue);
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });

  const setValue = (newValue: string) => {
    try {
      window.localStorage.setItem(keyName, newValue);
    } catch (err) {
      console.error(err);
    }
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
};