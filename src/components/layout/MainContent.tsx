import React from 'react';
import { PatientForm } from '../PatientForm';
import { Question } from '../Question';
import { ProgressBar } from '../ProgressBar';
import { PatientInfo } from '../../types';
import { useQuestions } from '../../context/QuestionContext';

interface MainContentProps {
  patientInfo: PatientInfo | null;
  currentQuestionId: string;
  progress: number;
  onPatientSubmit: (info: PatientInfo) => void;
  onAnswer: (answer: boolean | null, date?: string, notes?: string) => void;
  onBack: () => void;
  canGoBack: boolean;
}

export function MainContent({
  patientInfo,
  currentQuestionId,
  progress,
  onPatientSubmit,
  onAnswer,
  onBack,
  canGoBack
}: MainContentProps) {
  const { questions, isLoading } = useQuestions();
  const currentQuestion = questions[currentQuestionId];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  // Hasta bilgileri formu yoksa onu göster
  if (!patientInfo) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <PatientForm onSubmit={onPatientSubmit} />
      </main>
    );
  }

  // Hasta bilgileri varsa görüşmeyi göster
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <ProgressBar progress={progress} />
      <Question
        question={currentQuestion}
        onAnswer={onAnswer}
        onBack={onBack}
        requiresDate={currentQuestion?.requiresDate}
        requiresNote={currentQuestion?.requiresNote}
        canGoBack={canGoBack}
      />
    </main>
  );
}