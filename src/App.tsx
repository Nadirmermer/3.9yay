import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { Header } from './components/layout/Header';
import { MainContent } from './components/layout/MainContent';
import { AdminPanel } from './components/admin/AdminPanel';
import { QuestionProvider } from './context/QuestionContext';
import { useTheme } from './hooks/useTheme';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useEncryption } from './hooks/useEncryption';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useBackup } from './hooks/useBackup';
import { useQuestions } from './context/QuestionContext';
import {
  PatientInfo,
  Answer,
  Question,
  Diagnosis,
  Report
} from './types';
import { diagnoses as initialDiagnoses } from './data/diagnoses';

function App() {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('start');
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [questionHistory, setQuestionHistory] = useState<string[]>(['start']);
  const [diagnoses, setDiagnoses] = useState<Record<string, Diagnosis>>(initialDiagnoses);
  const { theme, toggleTheme } = useTheme();
  const { encryptData, decryptData } = useEncryption();
  const { saveData, loadData } = useLocalStorage();
  const { createBackup, isBackupReady } = useBackup();
  const { questions, isLoading } = useQuestions();

  const calculateProgress = () => {
    if (!questions) return 0;
    const totalQuestions = Object.keys(questions).length;
    if (totalQuestions === 0) return 0;
    return (Object.keys(answers).length / totalQuestions) * 100;
  };

  useEffect(() => {
    const loadSession = async () => {
      const savedSession = await loadData('currentSession');
      if (savedSession) {
        const decryptedSession = decryptData(savedSession);
        if (decryptedSession) {
          setPatientInfo(decryptedSession.patientInfo);
          setAnswers(decryptedSession.answers);
          setQuestionHistory(decryptedSession.questionHistory);
          setCurrentQuestionId(decryptedSession.currentQuestionId);
        }
      }
    };
    loadSession();
  }, []);

  useEffect(() => {
    const saveSession = async () => {
      const sessionData = {
        patientInfo,
        answers,
        questionHistory,
        currentQuestionId,
      };
      const encryptedSession = encryptData(sessionData);
      await saveData('currentSession', encryptedSession);
      
      if (isBackupReady && patientInfo) {
        await createBackup(sessionData);
      }
    };
    saveSession();
  }, [patientInfo, answers, questionHistory, currentQuestionId]);

  useKeyboardShortcuts({
    '1': () => handleAnswer(false),
    '2': () => handleAnswer(null),
    '3': () => handleAnswer(true),
  });

  const handleReset = async () => {
    const confirmed = window.confirm('Tüm veriler silinecek. Emin misiniz?');
    if (confirmed) {
      setPatientInfo(null);
      setCurrentQuestionId('start');
      setAnswers({});
      setQuestionHistory(['start']);
      await saveData('currentSession', null);
      toast.success('Görüşme sıfırlandı');
    }
  };

  const handlePatientSubmit = (info: PatientInfo) => {
    setPatientInfo(info);
    setCurrentQuestionId('start');
  };

  const handleAnswer = async (answer: boolean | null, date?: string, notes?: string) => {
    if (!questions) return;

    setAnswers(prev => ({
      ...prev,
      [currentQuestionId]: { value: answer, date, notes }
    }));

    const nextQuestionId = answer ? 
      questions[currentQuestionId]?.yesNext : 
      questions[currentQuestionId]?.noNext;

    if (nextQuestionId) {
      setCurrentQuestionId(nextQuestionId);
      setQuestionHistory(prev => [...prev, nextQuestionId]);
    }
  };

  const handleBack = () => {
    if (questionHistory.length > 1) {
      const newHistory = [...questionHistory];
      newHistory.pop();
      setQuestionHistory(newHistory);
      setCurrentQuestionId(newHistory[newHistory.length - 1]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <Toaster position="top-right" />

      <Header
        theme={theme}
        onThemeToggle={toggleTheme}
        onReset={handleReset}
        onOpenAdmin={() => setShowAdminPanel(true)}
      />

      <MainContent
        patientInfo={patientInfo}
        currentQuestionId={currentQuestionId}
        progress={calculateProgress()}
        onPatientSubmit={handlePatientSubmit}
        onAnswer={handleAnswer}
        onBack={handleBack}
        canGoBack={questionHistory.length > 1}
      />

      {showAdminPanel && (
        <AdminPanel
          onClose={() => setShowAdminPanel(false)}
          diagnoses={diagnoses}
          patientInfo={patientInfo}
          answers={answers}
        />
      )}
    </div>
  );
}

function AppWrapper() {
  return (
    <QuestionProvider>
      <App />
    </QuestionProvider>
  );
}

export default AppWrapper;