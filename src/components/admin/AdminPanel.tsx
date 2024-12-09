import React, { useState } from 'react';
import { Settings, Save, X } from 'lucide-react';
import { Question, Diagnosis, PatientInfo, Answer } from '../../types';
import { QuestionsTab } from './QuestionsTab';
import { DiagnosesTab } from './DiagnosesTab';
import { ReportsTab } from './ReportsTab';
import { BackupTab } from './BackupTab';
import { LoginForm } from './LoginForm';
import { AdminProvider } from './AdminContext';
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges';
import { saveQuestions } from '../../services/questionService';
import toast from 'react-hot-toast';

interface AdminPanelProps {
  onClose: () => void;
  questions: Record<string, Question>;
  diagnoses: Record<string, Diagnosis>;
  patientInfo: PatientInfo | null;
  answers: Record<string, Answer>;
  onSaveChanges?: (questions: Record<string, Question>, diagnoses: Record<string, Diagnosis>) => void;
}

type TabType = 'questions' | 'diagnoses' | 'reports' | 'backup';

export function AdminPanel({ 
  onClose, 
  questions, 
  diagnoses, 
  patientInfo, 
  answers,
  onSaveChanges 
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('questions');
  const { hasUnsavedChanges, setHasUnsavedChanges } = useUnsavedChanges();
  const [localQuestions, setLocalQuestions] = useState(questions);
  const [localDiagnoses, setLocalDiagnoses] = useState(diagnoses);
  const [isSaving, setIsSaving] = useState(false);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'Kaydedilmemiş değişiklikleriniz var. Çıkmak istediğinizden emin misiniz?'
      );
      if (!confirmed) return;
    }
    onClose();
  };

  const handleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      await saveQuestions(localQuestions);
      
      if (onSaveChanges) {
        onSaveChanges(localQuestions, localDiagnoses);
      }

      setHasUnsavedChanges(false);
      toast.success('Değişiklikler başarıyla kaydedildi');
      onClose();
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Değişiklikler kaydedilirken bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuestionChange = (updatedQuestions: Record<string, Question>) => {
    setLocalQuestions(updatedQuestions);
    setHasUnsavedChanges(true);
  };

  const handleDiagnosisChange = (updatedDiagnoses: Record<string, Diagnosis>) => {
    setLocalDiagnoses(updatedDiagnoses);
    setHasUnsavedChanges(true);
  };

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
    <AdminProvider initialQuestions={localQuestions} initialDiagnoses={localDiagnoses}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="sticky top-0 bg-white border-b p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-bold">Yönetim Paneli</h2>
                {hasUnsavedChanges && (
                  <span className="text-sm text-orange-500 ml-2">
                    (Kaydedilmemiş değişiklikler)
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges || isSaving}
                  className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 ${
                    (!hasUnsavedChanges || isSaving) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Save size={18} />
                  <span>{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</span>
                </button>
                <button
                  onClick={handleClose}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <X size={18} />
                  <span>Kapat</span>
                </button>
              </div>
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
              <QuestionsTab
                questions={localQuestions}
                onQuestionsChange={handleQuestionChange}
              />
            )}
            {activeTab === 'diagnoses' && (
              <DiagnosesTab
                diagnoses={localDiagnoses}
                questions={localQuestions}
                onDiagnosesChange={handleDiagnosisChange}
                onQuestionsChange={handleQuestionChange}
              />
            )}
            {activeTab === 'reports' && (
              <ReportsTab
                currentPatient={patientInfo}
                currentAnswers={answers}
              />
            )}
            {activeTab === 'backup' && (
              <BackupTab
                questions={localQuestions}
                diagnoses={localDiagnoses}
                reports={[]}
                onRestore={(data) => {
                  handleQuestionChange(data.questions);
                  handleDiagnosisChange(data.diagnoses);
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