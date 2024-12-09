import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Question } from '../../types';

interface QuestionListProps {
  questions: Record<string, Question>;
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
}

export function QuestionList({ questions, onEdit, onDelete }: QuestionListProps) {
  return (
    <div className="space-y-4">
      {Object.entries(questions).map(([id, question]) => (
        <div key={id} className="border rounded-lg p-4 bg-white">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium text-gray-900">{id}</h4>
              <p className="text-sm text-gray-600">{question.text}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(question)}
                className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                title="Düzenle"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(id)}
                className="p-1 text-red-600 hover:text-red-700 transition-colors"
                title="Sil"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <p>Evet → {question.yesNext || '(son)'}</p>
              <p>Hayır → {question.noNext || '(son)'}</p>
            </div>
            <div>
              {question.diagnosis && (
                <p className="text-indigo-600">{question.diagnosisName}</p>
              )}
              {question.isInformational && (
                <p className="text-blue-600">Bilgilendirme Sorusu</p>
              )}
              {question.isResult && (
                <p className="text-green-600">Sonuç Sayfası</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}