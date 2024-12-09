import { useState, useEffect } from 'react';
import { openDB } from 'idb';
import { format } from 'date-fns';
import { useEncryption } from './useEncryption';

const DB_NAME = 'scid5-backups';
const STORE_NAME = 'backups';

export function useBackup() {
  const [isBackupReady, setIsBackupReady] = useState(false);
  const { encryptData, decryptData } = useEncryption();

  useEffect(() => {
    initDB();
  }, []);

  const initDB = async () => {
    const db = await openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
    setIsBackupReady(true);
  };

  const createBackup = async (data: any) => {
    try {
      const db = await openDB(DB_NAME, 1);
      const encryptedData = encryptData(data);
      const backup = {
        id: Date.now(),
        date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        data: encryptedData
      };
      await db.add(STORE_NAME, backup);
      return true;
    } catch (error) {
      console.error('Backup creation failed:', error);
      return false;
    }
  };

  const restoreBackup = async (id: number) => {
    try {
      const db = await openDB(DB_NAME, 1);
      const backup = await db.get(STORE_NAME, id);
      if (backup) {
        return decryptData(backup.data);
      }
      return null;
    } catch (error) {
      console.error('Backup restoration failed:', error);
      return null;
    }
  };

  const listBackups = async () => {
    try {
      const db = await openDB(DB_NAME, 1);
      return await db.getAll(STORE_NAME);
    } catch (error) {
      console.error('Failed to list backups:', error);
      return [];
    }
  };

  const deleteBackup = async (id: number) => {
    try {
      const db = await openDB(DB_NAME, 1);
      await db.delete(STORE_NAME, id);
      return true;
    } catch (error) {
      console.error('Failed to delete backup:', error);
      return false;
    }
  };

  return {
    isBackupReady,
    createBackup,
    restoreBackup,
    listBackups,
    deleteBackup
  };
}