import React, { useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  yesNext?: string;
  noNext?: string;
  isResult?: boolean;
}

interface QuestionEditorProps {
  questions: Record<string, Question>;
  onSave: (questions: Record<string, Question>) => void;
}

export function QuestionEditor({ questions, onSave }: QuestionEditorProps) {
  const [editedQuestions, setEditedQuestions] = useState(questions);
  const [newQuestion, setNewQuestion] = useState({
    id: '',
    text: '',
    yesNext: '',
    noNext: '',
    isResult: false,
  });

  const handleAddQuestion = () => {
    if (!newQuestion.id || !newQuestion.text) return;

    setEditedQuestions((prev) => ({
      ...prev,
      [newQuestion.id]: newQuestion,
    }));

    setNewQuestion({
      id: '',
      text: '',
      yesNext: '',
      noNext: '',
      isResult: false,
    });
  };

  const handleDeleteQuestion = (id: string) => {
    const updatedQuestions = { ...editedQuestions };
    delete updatedQuestions[id];
    setEditedQuestions(updatedQuestions);
  };

  const handleSaveAll = () => {
    onSave(editedQuestions);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Yeni Soru Ekle</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Soru ID (örn: question_1)"
            value={newQuestion.id}
            onChange={(e) =>
              setNewQuestion((prev) => ({ ...prev, id: e.target.value }))
            }
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Soru metni"
            value={newQuestion.text}
            onChange={(e) =>
              setNewQuestion((prev) => ({ ...prev, text: e.target.value }))
            }
            className="w-full p-2 border rounded h-24"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Evet cevabı sonrası (ID)"
              value={newQuestion.yesNext}
              onChange={(e) =>
                setNewQuestion((prev) => ({ ...prev, yesNext: e.target.value }))
              }
              className="flex-1 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Hayır cevabı sonrası (ID)"
              value={newQuestion.noNext}
              onChange={(e) =>
                setNewQuestion((prev) => ({ ...prev, noNext: e.target.value }))
              }
              className="flex-1 p-2 border rounded"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newQuestion.isResult}
              onChange={(e) =>
                setNewQuestion((prev) => ({
                  ...prev,
                  isResult: e.target.checked,
                }))
              }
              className="rounded"
            />
            <label>Sonuç sayfası mı?</label>
          </div>
          <button
            onClick={handleAddQuestion}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            <span>Soru Ekle</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Mevcut Sorular</h2>
          <button
            onClick={handleSaveAll}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2"
          >
            <Save size={18} />
            <span>Tümünü Kaydet</span>
          </button>
        </div>
        <div className="space-y-4">
          {Object.entries(editedQuestions).map(([id, question]) => (
            <div key={id} className="border rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{id}</span>
                <button
                  onClick={() => handleDeleteQuestion(id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="text-gray-600 mb-2">{question.text}</p>
              <div className="text-sm text-gray-500">
                <div>Evet → {question.yesNext || '(boş)'}</div>
                <div>Hayır → {question.noNext || '(boş)'}</div>
                {question.isResult && (
                  <div className="text-blue-600">Sonuç sayfası</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
