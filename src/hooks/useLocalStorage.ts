import localforage from 'localforage';

export function useLocalStorage() {
  const saveData = async (key: string, value: any) => {
    try {
      await localforage.setItem(key, value);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const loadData = async (key: string) => {
    try {
      return await localforage.getItem(key);
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  };

  return { saveData, loadData };
}