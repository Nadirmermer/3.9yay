import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { Question, Diagnosis, PatientInfo, Answer } from '../types';
import { QuestionsTab } from './admin/QuestionsTab';
import { DiagnosesTab } from './admin/DiagnosesTab';
import { ReportsTab } from './admin/ReportsTab';
import { BackupTab } from './admin/BackupTab';
import { LoginForm } from './admin/LoginForm';
import { AdminProvider } from './admin/AdminContext';
import toast from 'react-hot-toast';

interface AdminPanelProps {
  onClose: () => void;
  onSave: (
    updatedQuestions: Record<string, Question>,
    updatedDiagnoses: Record<string, Diagnosis>
  ) => void;
  questions: Record<string, Question>;
  diagnoses: Record<string, Diagnosis>;
  patientInfo: PatientInfo | null;
  answers: Record<string, Answer>;
}

type TabType = 'questions' | 'diagnoses' | 'reports' | 'backup';

export function AdminPanel({ 
  onClose, 
  onSave, 
  questions, 
  diagnoses, 
  patientInfo, 
  answers 
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('questions');

  const handleLogin = (password: string) => {
    if (password === '0000') {
      setIsAuthenticated(true);
      toast.success('Giriş başarılı');
    } else {
      toast.error('Yanlış şifre!');
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} onClose={onClose} />;
  }

  return (
    <AdminProvider initialQuestions={questions} initialDiagnoses={diagnoses}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="sticky top-0 bg-white border-b p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-bold">Yönetim Paneli</h2>
              </div>
              <button
                onClick={() => {
                  onSave(questions, diagnoses);
                  onClose();
                  toast.success('Değişiklikler kaydedildi');
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Save size={18} />
                <span>Kaydet ve Kapat</span>
              </button>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('questions')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'questions'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Sorular
              </button>
              <button
                onClick={() => setActiveTab('diagnoses')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'diagnoses'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Tanılar
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'reports'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Raporlar
              </button>
              <button
                onClick={() => setActiveTab('backup')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'backup'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Yedekleme
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'questions' && (
              <QuestionsTab />
            )}
            {activeTab === 'diagnoses' && (
              <DiagnosesTab />
            )}
            {activeTab === 'reports' && (
              <ReportsTab
                currentPatient={patientInfo}
                currentAnswers={answers}
              />
            )}
            {activeTab === 'backup' && (
              <BackupTab
                questions={questions}
                diagnoses={diagnoses}
                reports={[]}
                onRestore={(data) => {
                  onSave(data.questions, data.diagnoses);
                  toast.success('Veriler geri yüklendi');
                }}
              />
            )}
          </div>
        </div>
      </div>
    </AdminProvider>
  );
}