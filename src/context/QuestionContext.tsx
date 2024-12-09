import React, { createContext, useContext, ReactNode } from 'react';
import { Question } from '../types';
import { useQuestionSync } from '../hooks/useQuestionSync';

interface QuestionContextType {
  questions: Record<string, Question>;
  isLoading: boolean;
  error: string | null;
  updateQuestions: (questions: Record<string, Question>) => Promise<void>;
  reloadQuestions: () => Promise<void>;
}

const QuestionContext = createContext<QuestionContextType | null>(null);

export function QuestionProvider({ children }: { children: ReactNode }) {
  const { questions, isLoading, error, updateQuestions, reloadQuestions } = useQuestionSync();

  return (
    <QuestionContext.Provider 
      value={{ questions, isLoading, error, updateQuestions, reloadQuestions }}
    >
      {children}
    </QuestionContext.Provider>
  );
}

export function useQuestions() {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error('useQuestions must be used within a QuestionProvider');
  }
  return context;
}