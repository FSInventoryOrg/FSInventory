import { useState } from "react";

export const useLocalStorage = (
  key: string,
  defaultValue?: Record<string, any>
) => {
  const [storedItem, setStoredItem] = useState(() => {
    const localStorageItem = localStorage.getItem(key);
    return localStorageItem ? JSON.parse(localStorageItem) : defaultValue;
  });

  const setValue = (newValue: string) => {
    localStorage.setItem(key, newValue);
    setStoredItem(newValue);
  };

  return [storedItem, setValue];
};
