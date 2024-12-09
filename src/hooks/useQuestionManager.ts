import { useState } from 'react';
import { Question } from '../types';
import toast from 'react-hot-toast';

export function useQuestionManager(initialQuestions: Record<string, Question>) {
  const [questions, setQuestions] = useState(initialQuestions);

  const validateQuestion = (question: Question): boolean => {
    if (!question.id || !question.text) {
      toast.error('ID ve soru metni zorunludur');
      return false;
    }
    return true;
  };

  const addQuestion = (question: Question) => {
    if (!validateQuestion(question)) return false;
    
    if (questions[question.id]) {
      toast.error('Bu ID ile bir soru zaten mevcut');
      return false;
    }

    setQuestions(prev => ({
      ...prev,
      [question.id]: question
    }));
    return true;
  };

  const updateQuestion = (question: Question) => {
    if (!validateQuestion(question)) return false;
    
    setQuestions(prev => ({
      ...prev,
      [question.id]: question
    }));
    return true;
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => {
      const newQuestions = { ...prev };
      delete newQuestions[id];
      return newQuestions;
    });
  };

  const updateQuestionDiagnosis = (questionId: string, diagnosisId: string, diagnosisName: string) => {
    setQuestions(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        diagnosis: diagnosisId,
        diagnosisName
      }
    }));
  };

  return {
    questions,
    setQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    updateQuestionDiagnosis
  };
}