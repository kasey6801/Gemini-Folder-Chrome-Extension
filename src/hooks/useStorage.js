import { useState, useEffect } from 'react';
import { get, set } from '../utils/storage';

export function useStorage(key, defaultValue) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    get(key).then(data => {
      if (data[key] !== undefined) setValue(data[key]);
    });
  }, [key]);

  useEffect(() => {
    const listener = changes => {
      if (key in changes) setValue(changes[key].newValue);
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, [key]);

  async function update(newValue) {
    setValue(newValue);
    await set({ [key]: newValue });
  }

  return [value, update];
}
