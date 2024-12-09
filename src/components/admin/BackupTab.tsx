import React, { useState, useEffect, useRef } from 'react';
import { Download, Upload, RotateCcw, Clock, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { Question, Diagnosis, Report } from '../../types';
import { createBackup, exportData, importData, listBackups, restoreBackup } from '../../services/backupService';

interface BackupTabProps {
  questions: Record<string, Question>;
  diagnoses: Record<string, Diagnosis>;
  reports: Report[];
  onRestore: (data: { questions: Record<string, Question>; diagnoses: Record<string, Diagnosis>; reports: Report[] }) => void;
}

export function BackupTab({ questions, diagnoses, reports, onRestore }: BackupTabProps) {
  const [backups, setBackups] = useState<Array<{ timestamp: string; version: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    const backupList = await listBackups();
    setBackups(backupList.map(({ timestamp, version }) => ({ timestamp, version })));
  };

  const handleCreateBackup = async () => {
    setIsLoading(true);
    try {
      await createBackup({ questions, diagnoses, reports });
      await loadBackups();
      toast.success('Yedek oluşturuldu');
    } catch (error) {
      toast.error('Yedek oluşturulurken hata oluştu');
    }
    setIsLoading(false);
  };

  const handleExport = async () => {
    try {
      await exportData({ questions, diagnoses, reports });
      toast.success('Veriler dışa aktarıldı');
    } catch (error) {
      toast.error('Dışa aktarma sırasında hata oluştu');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const importedData = await importData(file);
      if (importedData) {
        onRestore({
          questions: importedData.questions,
          diagnoses: importedData.diagnoses,
          reports: importedData.reports
        });
        toast.success('Veriler içe aktarıldı');
      } else {
        toast.error('Geçersiz yedek dosyası');
      }
    } catch (error) {
      toast.error('İçe aktarma sırasında hata oluştu');
    }
    setIsLoading(false);
    event.target.value = '';
  };

  const handleRestore = async (timestamp: string) => {
    setIsLoading(true);
    try {
      const backup = await restoreBackup(timestamp);
      if (backup) {
        onRestore({
          questions: backup.questions,
          diagnoses: backup.diagnoses,
          reports: backup.reports
        });
        toast.success('Yedek geri yüklendi');
      } else {
        toast.error('Yedek geri yüklenemedi');
      }
    } catch (error) {
      toast.error('Geri yükleme sırasında hata oluştu');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <button
          onClick={handleCreateBackup}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          <Clock size={18} />
          <span>Yedek Oluştur</span>
        </button>

        <button
          onClick={handleExport}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <Download size={18} />
          <span>Dışa Aktar</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Upload size={18} />
          <span>İçe Aktar</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b">
          <h3 className="text-lg font-semibold">Yedekler</h3>
        </div>
        <div className="divide-y">
          {backups.map(({ timestamp, version }) => (
            <div key={timestamp} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {format(new Date(timestamp), 'dd MMMM yyyy HH:mm', { locale: tr })}
                </p>
                <p className="text-sm text-gray-500">Versiyon: {version}</p>
              </div>
              <button
                onClick={() => handleRestore(timestamp)}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              >
                <RotateCcw size={16} />
                <span>Geri Yükle</span>
              </button>
            </div>
          ))}
          {backups.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              Henüz yedek bulunmuyor
            </div>
          )}
        </div>
      </div>
    </div>
  );
}