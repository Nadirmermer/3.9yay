import { openDB } from 'idb';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useEncryption } from '../hooks/useEncryption';
import { Question, Diagnosis, Report } from '../types';

const { encryptData, decryptData } = useEncryption();

interface BackupData {
  questions: Record<string, Question>;
  diagnoses: Record<string, Diagnosis>;
  reports: Report[];
  version: string;
  timestamp: string;
}

const DB_NAME = 'scid5-backups';
const STORE_NAME = 'backups';
const CURRENT_VERSION = '1.0.0';

export async function createBackup(data: Partial<BackupData>) {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'timestamp' });
      }
    },
  });

  const backup: BackupData = {
    questions: data.questions || {},
    diagnoses: data.diagnoses || {},
    reports: data.reports || [],
    version: CURRENT_VERSION,
    timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  };

  const encryptedBackup = encryptData(backup);
  await db.add(STORE_NAME, encryptedBackup);

  return backup;
}

export async function exportData(data: Partial<BackupData>) {
  const backup: BackupData = {
    questions: data.questions || {},
    diagnoses: data.diagnoses || {},
    reports: data.reports || [],
    version: CURRENT_VERSION,
    timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  };

  const encryptedBackup = encryptData(backup);
  const blob = new Blob([JSON.stringify(encryptedBackup)], { type: 'application/json' });
  const fileName = `scid5-yedek-${format(new Date(), 'yyyy-MM-dd-HH-mm', { locale: tr })}.json`;
  
  saveAs(blob, fileName);
}

export async function importData(file: File): Promise<BackupData | null> {
  try {
    const text = await file.text();
    const encryptedData = JSON.parse(text);
    const decryptedData = decryptData(encryptedData);

    if (!isValidBackupData(decryptedData)) {
      throw new Error('Geçersiz yedek dosyası');
    }

    return decryptedData;
  } catch (error) {
    console.error('Veri içe aktarma hatası:', error);
    return null;
  }
}

export async function listBackups(): Promise<BackupData[]> {
  const db = await openDB(DB_NAME, 1);
  const encryptedBackups = await db.getAll(STORE_NAME);
  return encryptedBackups.map(backup => decryptData(backup)).filter(isValidBackupData);
}

export async function restoreBackup(timestamp: string): Promise<BackupData | null> {
  const db = await openDB(DB_NAME, 1);
  const encryptedBackup = await db.get(STORE_NAME, timestamp);
  
  if (!encryptedBackup) return null;
  
  const decryptedBackup = decryptData(encryptedBackup);
  return isValidBackupData(decryptedBackup) ? decryptedBackup : null;
}

function isValidBackupData(data: any): data is BackupData {
  return (
    data &&
    typeof data.version === 'string' &&
    typeof data.timestamp === 'string' &&
    typeof data.questions === 'object' &&
    typeof data.diagnoses === 'object' &&
    Array.isArray(data.reports)
  );
}