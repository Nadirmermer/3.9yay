import React, { createContext, useContext, ReactNode } from 'react';
import { Question, Diagnosis } from '../../types';
import { useQuestionManager } from '../../hooks/useQuestionManager';
import { useDiagnosisManager } from '../../hooks/useDiagnosisManager';

interface AdminContextType {
  questions: Record<string, Question>;
  diagnoses: Record<string, Diagnosis>;
  addQuestion: (question: Question) => boolean;
  updateQuestion: (question: Question) => boolean;
  deleteQuestion: (id: string) => void;
  addDiagnosis: (diagnosis: Diagnosis) => boolean;
  updateDiagnosis: (diagnosis: Diagnosis) => boolean;
  deleteDiagnosis: (id: string) => void;
  updateQuestionDiagnosis: (questionId: string, diagnosisId: string, diagnosisName: string) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ 
  children,
  initialQuestions,
  initialDiagnoses
}: { 
  children: ReactNode;
  initialQuestions: Record<string, Question>;
  initialDiagnoses: Record<string, Diagnosis>;
}) {
  const {
    questions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    updateQuestionDiagnosis
  } = useQuestionManager(initialQuestions);

  const {
    diagnoses,
    addDiagnosis,
    updateDiagnosis,
    deleteDiagnosis
  } = useDiagnosisManager(initialDiagnoses);

  return (
    <AdminContext.Provider value={{
      questions,
      diagnoses,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      addDiagnosis,
      updateDiagnosis,
      deleteDiagnosis,
      updateQuestionDiagnosis
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}