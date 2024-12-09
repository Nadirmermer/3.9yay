import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Question } from '../../types';
import { QuestionList } from './QuestionList';
import { QuestionForm } from './QuestionForm';
import { FlowDiagram } from './FlowDiagram';
import { useQuestions } from '../../context/QuestionContext';
import { useAdmin } from './AdminContext';
import toast from 'react-hot-toast';

export function QuestionsTab() {
  const { questions, updateQuestions } = useQuestions();
  const { diagnoses } = useAdmin();
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [showFlowDiagram, setShowFlowDiagram] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuestionSelect = (id: string) => {
    const question = questions[id];
    if (question) {
      setEditingQuestion(question);
      setShowFlowDiagram(false);
    }
  };

  const handleAddQuestion = async (newQuestion: Question) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (questions[newQuestion.id]) {
        toast.error('Bu ID ile bir soru zaten mevcut');
        return;
      }

      const updatedQuestions = {
        ...questions,
        [newQuestion.id]: newQuestion,
      };

      await updateQuestions(updatedQuestions);
      setShowNewQuestion(false);
      toast.success('Soru başarıyla eklendi');
    } catch (error) {
      console.error('Error adding question:', error);
      toast.error('Soru eklenirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateQuestion = async (updatedQuestion: Question) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Mevcut soruları kopyala ve güncelle
      const updatedQuestions = {
        ...questions,
        [updatedQuestion.id]: {
          ...updatedQuestion,
          diagnosisName: updatedQuestion.diagnosis ? diagnoses[updatedQuestion.diagnosis]?.name || '' : ''
        }
      };

      // Güncellenmiş soruları kaydet
      await updateQuestions(updatedQuestions);
      
      setEditingQuestion(null);
      toast.success('Soru başarıyla güncellendi');
    } catch (error) {
      console.error('Error updating question:', error);
      toast.error('Soru güncellenirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (isSubmitting) return;

    const confirmed = window.confirm('Bu soruyu silmek istediğinizden emin misiniz?');
    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      const newQuestions = { ...questions };
      delete newQuestions[id];
      await updateQuestions(newQuestions);
      toast.success('Soru başarıyla silindi');
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Soru silinirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-x-4">
          <button
            onClick={() => {
              setShowNewQuestion(!showNewQuestion);
              setShowFlowDiagram(false);
              setEditingQuestion(null);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            disabled={isSubmitting}
          >
            <Plus size={18} />
            <span>Yeni Soru</span>
          </button>
          <button
            onClick={() => {
              setShowFlowDiagram(!showFlowDiagram);
              setShowNewQuestion(false);
              setEditingQuestion(null);
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showFlowDiagram
                ? 'bg-gray-200 text-gray-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            disabled={isSubmitting}
          >
            Akış Diyagramı
          </button>
        </div>
      </div>

      {showNewQuestion && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Yeni Soru Ekle</h3>
          <QuestionForm
            questions={questions}
            diagnoses={diagnoses}
            onSubmit={handleAddQuestion}
          />
        </div>
      )}

      {editingQuestion && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Soru Düzenle</h3>
          <QuestionForm
            initialQuestion={editingQuestion}
            questions={questions}
            diagnoses={diagnoses}
            onSubmit={handleUpdateQuestion}
          />
        </div>
      )}

      {showFlowDiagram ? (
        <FlowDiagram
          questions={questions}
          diagnoses={diagnoses}
          onQuestionSelect={handleQuestionSelect}
        />
      ) : (
        !showNewQuestion && !editingQuestion && (
          <QuestionList
            questions={questions}
            onEdit={setEditingQuestion}
            onDelete={handleDeleteQuestion}
          />
        )
      )}
    </div>
  );
}