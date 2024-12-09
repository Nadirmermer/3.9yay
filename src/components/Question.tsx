import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Question as QuestionType } from '../types';

interface QuestionProps {
  question: QuestionType | undefined;
  onAnswer: (answer: boolean | null, date?: string, notes?: string) => void;
  onBack: () => void;
  requiresDate?: boolean;
  requiresNote?: boolean;
  canGoBack: boolean;
}

export function Question({
  question,
  onAnswer,
  onBack,
  requiresDate,
  requiresNote,
  canGoBack,
}: QuestionProps) {
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const MIN_DATE = '1900-01-01';
  const MAX_DATE = new Date().toISOString().split('T')[0];

  const handleAnswer = (answer: boolean) => {
    onAnswer(
      answer,
      date || undefined,
      notes || undefined
    );
    setDate('');
    setNotes('');
    setShowInfo(false);
  };

  if (!question) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Görüşme tamamlandı veya geçerli bir soru bulunamadı.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto relative min-h-[calc(100vh-8rem)] flex flex-col">
      {canGoBack && (
        <button
          onClick={onBack}
          className="absolute -left-4 md:-left-16 top-4 text-gray-600 hover:text-gray-900 transition-colors"
          title="Geri"
        >
          <ArrowLeft size={24} />
        </button>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 flex-grow flex flex-col">
        <div className="flex-grow">
          <p className="text-lg md:text-xl font-medium text-gray-800 dark:text-gray-200 mb-8 leading-relaxed">
            {question.text}
          </p>

          {showInfo && question.infoText && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {question.infoText}
              </p>
            </div>
          )}

          {requiresDate && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tarih
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={MIN_DATE}
                max={MAX_DATE}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          )}

          {requiresNote && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notlar
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8 sticky bottom-0 bg-white dark:bg-gray-800 py-4">
          <button
            onClick={() => {
              if (question.infoText && !showInfo) {
                setShowInfo(true);
              } else {
                handleAnswer(false);
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Hayır (1)
          </button>
          <button
            onClick={() => {
              if (question.infoText && !showInfo) {
                setShowInfo(true);
              } else {
                handleAnswer(true);
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Evet (3)
          </button>
        </div>
      </div>
    </div>
  );
}