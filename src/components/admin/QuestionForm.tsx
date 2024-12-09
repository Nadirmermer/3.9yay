import React, { useState, useEffect } from 'react';
import { Question, Diagnosis } from '../../types';

interface QuestionFormProps {
  initialQuestion?: Question;
  diagnoses: Record<string, Diagnosis>;
  questions: Record<string, Question>;
  onSubmit: (question: Question) => void;
}

const emptyQuestion: Question = {
  id: '',
  text: '',
  diagnosis: '',
  diagnosisName: '',
  requiresDate: false,
  requiresNote: false,
  isInformational: false,
  isResult: false,
  yesNext: '',
  noNext: '',
  infoText: ''
};

export function QuestionForm({ 
  initialQuestion,
  diagnoses,
  questions,
  onSubmit 
}: QuestionFormProps) {
  const [question, setQuestion] = useState<Question>(() => 
    initialQuestion ? { ...initialQuestion } : { ...emptyQuestion }
  );

  useEffect(() => {
    if (initialQuestion) {
      setQuestion({ ...initialQuestion });
    }
  }, [initialQuestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.id || !question.text) {
      return;
    }
    
    const updatedQuestion = {
      ...question,
      diagnosisName: question.diagnosis ? diagnoses[question.diagnosis]?.name || '' : ''
    };
    
    onSubmit(updatedQuestion);
    
    if (!initialQuestion) {
      setQuestion({ ...emptyQuestion });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Soru ID
        </label>
        <input
          type="text"
          value={question.id}
          onChange={(e) => setQuestion(prev => ({ ...prev, id: e.target.value }))}
          className="w-full p-2 border rounded-lg"
          placeholder="örn: q1, start, result_depression"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Soru Metni
        </label>
        <textarea
          value={question.text}
          onChange={(e) => setQuestion(prev => ({ ...prev, text: e.target.value }))}
          className="w-full p-2 border rounded-lg"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Evet Sonrası
          </label>
          <select
            value={question.yesNext || ''}
            onChange={(e) => setQuestion(prev => ({ ...prev, yesNext: e.target.value }))}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Son</option>
            {Object.keys(questions).map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hayır Sonrası
          </label>
          <select
            value={question.noNext || ''}
            onChange={(e) => setQuestion(prev => ({ ...prev, noNext: e.target.value }))}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Son</option>
            {Object.keys(questions).map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          İlişkili Tanı
        </label>
        <select
          value={question.diagnosis || ''}
          onChange={(e) => setQuestion(prev => ({ ...prev, diagnosis: e.target.value }))}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Tanı Yok</option>
          {Object.entries(diagnoses).map(([id, diagnosis]) => (
            <option key={id} value={id}>{diagnosis.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={question.requiresDate || false}
            onChange={(e) => setQuestion(prev => ({ ...prev, requiresDate: e.target.checked }))}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Tarih Gerekli</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={question.requiresNote || false}
            onChange={(e) => setQuestion(prev => ({ ...prev, requiresNote: e.target.checked }))}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Not Gerekli</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={question.isInformational || false}
            onChange={(e) => setQuestion(prev => ({ ...prev, isInformational: e.target.checked }))}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Bilgilendirme Sorusu</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={question.isResult || false}
            onChange={(e) => setQuestion(prev => ({ ...prev, isResult: e.target.checked }))}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Sonuç Sayfası</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bilgilendirme Metni (Opsiyonel)
        </label>
        <textarea
          value={question.infoText || ''}
          onChange={(e) => setQuestion(prev => ({ ...prev, infoText: e.target.value }))}
          className="w-full p-2 border rounded-lg"
          rows={2}
          placeholder="Soru sonrası gösterilecek ek bilgi"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        {initialQuestion ? 'Güncelle' : 'Ekle'}
      </button>
    </form>
  );
}