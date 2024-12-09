import { useState, useEffect } from 'react';
import { Question } from '../types';
import { loadQuestions, saveQuestions, QuestionServiceError } from '../services/questionService';
import { questions as initialQuestions } from '../data/questions';
import toast from 'react-hot-toast';

interface QuestionSyncState {
  questions: Record<string, Question>;
  isLoading: boolean;
  error: string | null;
}

export function useQuestionSync() {
  const [state, setState] = useState<QuestionSyncState>({
    questions: initialQuestions,
    isLoading: true,
    error: null,
  });

  const loadInitialQuestions = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const loadedQuestions = await loadQuestions();
      setState(prev => ({ ...prev, questions: loadedQuestions, isLoading: false }));
    } catch (error) {
      console.error('Failed to load questions:', error);
      setState(prev => ({
        ...prev,
        questions: initialQuestions,
        isLoading: false,
        error: 'Failed to load questions'
      }));
      toast.error('Sorular yüklenirken hata oluştu');
    }
  };

  const updateQuestions = async (newQuestions: Record<string, Question>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const savedQuestions = await saveQuestions(newQuestions);
      setState(prev => ({ ...prev, questions: savedQuestions, isLoading: false }));
      toast.success('Sorular başarıyla kaydedildi');
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: error instanceof QuestionServiceError ? error.message : 'Failed to save questions'
      }));
      toast.error('Sorular kaydedilirken hata oluştu');
      throw error;
    }
  };

  useEffect(() => {
    loadInitialQuestions();
  }, []);

  return {
    ...state,
    updateQuestions,
    reloadQuestions: loadInitialQuestions,
  };
}