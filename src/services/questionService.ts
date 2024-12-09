import { Question } from '../types';
import { apiRequest } from './api';
import { questions as initialQuestions } from '../data/questions';

export class QuestionServiceError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'QuestionServiceError';
  }
}

export async function saveQuestions(questions: Record<string, Question>): Promise<Record<string, Question>> {
  try {
    // GitHub üzerinden kaydetme
    const response = await apiRequest<Record<string, Question>>('saveQuestions', {
      method: 'POST',
      body: JSON.stringify(questions),
    });

    // Başarılı kayıt sonrası localStorage'ı güncelle
    localStorage.setItem('questions', JSON.stringify(response));
    return response;
  } catch (error) {
    console.error('Failed to save questions:', error);
    // Hata durumunda localStorage'a kaydet
    localStorage.setItem('questions', JSON.stringify(questions));
    throw new QuestionServiceError(
      'Sorular GitHub\'a kaydedilemedi. Değişiklikler geçici olarak yerel olarak saklandı.',
      error instanceof Error ? error : undefined
    );
  }
}

export async function loadQuestions(): Promise<Record<string, Question>> {
  try {
    // Önce GitHub'dan yüklemeyi dene
    const response = await apiRequest<Record<string, Question>>('loadQuestions');
    
    if (Object.keys(response).length > 0) {
      // Başarılı yükleme sonrası localStorage'ı güncelle
      localStorage.setItem('questions', JSON.stringify(response));
      return response;
    }
    
    // GitHub'dan veri gelmezse localStorage'a bak
    const savedQuestions = localStorage.getItem('questions');
    if (savedQuestions) {
      return JSON.parse(savedQuestions);
    }

    return initialQuestions;
  } catch (error) {
    console.warn('GitHub\'dan sorular yüklenemedi, yerel verileri kullanıyorum:', error);
    
    // Hata durumunda localStorage'a bak
    const savedQuestions = localStorage.getItem('questions');
    if (savedQuestions) {
      return JSON.parse(savedQuestions);
    }

    return initialQuestions;
  }
}