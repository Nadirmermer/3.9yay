import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Question, Diagnosis } from '../../types';
import toast from 'react-hot-toast';

interface DiagnosesTabProps {
  diagnoses: Record<string, Diagnosis>;
  questions: Record<string, Question>;
  onDiagnosesChange: (diagnoses: Record<string, Diagnosis>) => void;
  onQuestionsChange: (questions: Record<string, Question>) => void;
}

const emptyDiagnosis: Diagnosis = {
  id: '',
  name: '',
  description: '',
  criteria: {
    requiredQuestions: [],
    minPositiveAnswers: 0,
    excludingQuestions: []
  }
};

export function DiagnosesTab({
  diagnoses = {},
  questions = {},
  onDiagnosesChange,
  onQuestionsChange,
}: DiagnosesTabProps) {
  const [editingDiagnosis, setEditingDiagnosis] = useState<Diagnosis | null>(null);
  const [newDiagnosis, setNewDiagnosis] = useState<Diagnosis>({ ...emptyDiagnosis });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddExcludingQuestion = (diagnosisToUpdate: Diagnosis) => {
    const updatedDiagnosis = {
      ...diagnosisToUpdate,
      criteria: {
        ...diagnosisToUpdate.criteria,
        excludingQuestions: [
          ...diagnosisToUpdate.criteria.excludingQuestions,
          { questionId: '', value: false }
        ]
      }
    };
    
    if (editingDiagnosis) {
      setEditingDiagnosis(updatedDiagnosis);
    } else {
      setNewDiagnosis(updatedDiagnosis);
    }
  };

  const handleRemoveExcludingQuestion = (diagnosisToUpdate: Diagnosis, index: number) => {
    const updatedDiagnosis = {
      ...diagnosisToUpdate,
      criteria: {
        ...diagnosisToUpdate.criteria,
        excludingQuestions: diagnosisToUpdate.criteria.excludingQuestions.filter((_, i) => i !== index)
      }
    };
    
    if (editingDiagnosis) {
      setEditingDiagnosis(updatedDiagnosis);
    } else {
      setNewDiagnosis(updatedDiagnosis);
    }
  };

  const handleUpdateExcludingQuestion = (
    diagnosisToUpdate: Diagnosis,
    index: number,
    field: 'questionId' | 'value',
    value: string | boolean
  ) => {
    const updatedExcludingQuestions = [...diagnosisToUpdate.criteria.excludingQuestions];
    updatedExcludingQuestions[index] = {
      ...updatedExcludingQuestions[index],
      [field]: field === 'value' ? value === 'true' : value
    };

    const updatedDiagnosis = {
      ...diagnosisToUpdate,
      criteria: {
        ...diagnosisToUpdate.criteria,
        excludingQuestions: updatedExcludingQuestions
      }
    };
    
    if (editingDiagnosis) {
      setEditingDiagnosis(updatedDiagnosis);
    } else {
      setNewDiagnosis(updatedDiagnosis);
    }
  };

  const handleAddDiagnosis = async () => {
    if (isSubmitting) return;
    if (!newDiagnosis.name) {
      toast.error('Lütfen tanı adını girin');
      return;
    }

    try {
      setIsSubmitting(true);

      const id = newDiagnosis.name
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');

      if (diagnoses[id]) {
        toast.error('Bu isimde bir tanı zaten mevcut');
        return;
      }

      const diagnosisToAdd = {
        ...newDiagnosis,
        id,
      };

      onDiagnosesChange({
        ...diagnoses,
        [id]: diagnosisToAdd,
      });

      const updatedQuestions = { ...questions };
      Object.values(updatedQuestions).forEach(question => {
        if (question.diagnosis === id) {
          question.diagnosisName = diagnosisToAdd.name;
        }
      });
      onQuestionsChange(updatedQuestions);

      toast.success('Tanı başarıyla eklendi');
      setNewDiagnosis({ ...emptyDiagnosis });
    } catch (error) {
      console.error('Error adding diagnosis:', error);
      toast.error('Tanı eklenirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDiagnosis = async () => {
    if (!editingDiagnosis || isSubmitting) return;

    try {
      setIsSubmitting(true);

      onDiagnosesChange({
        ...diagnoses,
        [editingDiagnosis.id]: editingDiagnosis,
      });

      const updatedQuestions = { ...questions };
      Object.values(updatedQuestions).forEach(question => {
        if (question.diagnosis === editingDiagnosis.id) {
          question.diagnosisName = editingDiagnosis.name;
        }
      });
      onQuestionsChange(updatedQuestions);

      toast.success('Tanı başarıyla güncellendi');
      setEditingDiagnosis(null);
    } catch (error) {
      console.error('Error updating diagnosis:', error);
      toast.error('Tanı güncellenirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDiagnosis = async (id: string) => {
    if (isSubmitting) return;

    const confirmed = window.confirm(
      'Bu tanıyı silmek istediğinizden emin misiniz?'
    );
    if (!confirmed) return;

    try {
      setIsSubmitting(true);

      const newDiagnoses = { ...diagnoses };
      delete newDiagnoses[id];
      onDiagnosesChange(newDiagnoses);

      const updatedQuestions = { ...questions };
      Object.values(updatedQuestions).forEach(question => {
        if (question.diagnosis === id) {
          question.diagnosis = '';
          question.diagnosisName = '';
        }
      });
      onQuestionsChange(updatedQuestions);

      toast.success('Tanı başarıyla silindi');
    } catch (error) {
      console.error('Error deleting diagnosis:', error);
      toast.error('Tanı silinirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderExcludingQuestionsSection = (diagnosis: Diagnosis, isEditing: boolean) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Dışlama Soruları
        </label>
        <button
          onClick={() => handleAddExcludingQuestion(diagnosis)}
          className="text-indigo-600 hover:text-indigo-700 text-sm"
          disabled={isSubmitting}
        >
          <Plus size={18} /> Dışlama Sorusu Ekle
        </button>
      </div>
      {diagnosis.criteria.excludingQuestions.map((eq, index) => (
        <div key={index} className="flex gap-2 items-center">
          <select
            value={eq.questionId}
            onChange={(e) => handleUpdateExcludingQuestion(diagnosis, index, 'questionId', e.target.value)}
            className="flex-grow p-2 border rounded"
            disabled={isSubmitting}
          >
            <option value="">Soru Seçin</option>
            {Object.entries(questions)
              .filter(([_, q]) => !q.isInformational)
              .map(([id, question]) => (
                <option key={id} value={id}>
                  {id} - {question.text.substring(0, 50)}...
                </option>
              ))}
          </select>
          <select
            value={eq.value.toString()}
            onChange={(e) => handleUpdateExcludingQuestion(diagnosis, index, 'value', e.target.value)}
            className="w-32 p-2 border rounded"
            disabled={isSubmitting}
          >
            <option value="true">Evet</option>
            <option value="false">Hayır</option>
          </select>
          <button
            onClick={() => handleRemoveExcludingQuestion(diagnosis, index)}
            className="text-red-600 hover:text-red-700"
            disabled={isSubmitting}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Yeni Tanı Ekle</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Tanı Adı"
            value={newDiagnosis.name}
            onChange={(e) =>
              setNewDiagnosis((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full p-2 border rounded"
            disabled={isSubmitting}
          />
          <textarea
            placeholder="Tanı Açıklaması"
            value={newDiagnosis.description}
            onChange={(e) =>
              setNewDiagnosis((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
            rows={3}
            disabled={isSubmitting}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gerekli Sorular
            </label>
            <select
              multiple
              value={newDiagnosis.criteria.requiredQuestions}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                setNewDiagnosis((prev) => ({
                  ...prev,
                  criteria: {
                    ...prev.criteria,
                    requiredQuestions: selected,
                  },
                }));
              }}
              className="w-full p-2 border rounded"
              size={5}
              disabled={isSubmitting}
            >
              {Object.entries(questions)
                .filter(([_, q]) => !q.isInformational)
                .map(([id, question]) => (
                  <option key={id} value={id}>
                    {id} - {question.text.substring(0, 50)}...
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Pozitif Cevap Sayısı
            </label>
            <input
              type="number"
              value={newDiagnosis.criteria.minPositiveAnswers}
              onChange={(e) =>
                setNewDiagnosis((prev) => ({
                  ...prev,
                  criteria: {
                    ...prev.criteria,
                    minPositiveAnswers: parseInt(e.target.value) || 0,
                  },
                }))
              }
              className="w-full p-2 border rounded"
              min="0"
              disabled={isSubmitting}
            />
          </div>
          
          {renderExcludingQuestionsSection(newDiagnosis, false)}

          <button
            onClick={handleAddDiagnosis}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            disabled={isSubmitting}
          >
            <Plus size={18} />
            <span>Tanı Ekle</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Mevcut Tanılar</h3>
        <div className="space-y-4">
          {Object.entries(diagnoses || {}).map(([id, diagnosis]) => (
            <div key={id} className="border rounded-lg p-4">
              {editingDiagnosis?.id === id ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{diagnosis.name}</span>
                    <button
                      onClick={() => setEditingDiagnosis(null)}
                      className="text-gray-600 hover:text-gray-900"
                      disabled={isSubmitting}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={editingDiagnosis.name}
                    onChange={(e) =>
                      setEditingDiagnosis((prev) => ({
                        ...prev!,
                        name: e.target.value,
                      }))
                    }
                    className="w-full p-2 border rounded"
                    disabled={isSubmitting}
                  />
                  <textarea
                    value={editingDiagnosis.description}
                    onChange={(e) =>
                      setEditingDiagnosis((prev) => ({
                        ...prev!,
                        description: e.target.value,
                      }))
                    }
                    className="w-full p-2 border rounded"
                    rows={3}
                    disabled={isSubmitting}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gerekli Sorular
                    </label>
                    <select
                      multiple
                      value={editingDiagnosis.criteria.requiredQuestions}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                        setEditingDiagnosis((prev) => ({
                          ...prev!,
                          criteria: {
                            ...prev!.criteria,
                            requiredQuestions: selected,
                          },
                        }));
                      }}
                      className="w-full p-2 border rounded"
                      size={5}
                      disabled={isSubmitting}
                    >
                      {Object.entries(questions)
                        .filter(([_, q]) => !q.isInformational)
                        .map(([id, question]) => (
                          <option key={id} value={id}>
                            {id} - {question.text.substring(0, 50)}...
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Pozitif Cevap Sayısı
                    </label>
                    <input
                      type="number"
                      value={editingDiagnosis.criteria.minPositiveAnswers}
                      onChange={(e) =>
                        setEditingDiagnosis((prev) => ({
                          ...prev!,
                          criteria: {
                            ...prev!.criteria,
                            minPositiveAnswers: parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                      className="w-full p-2 border rounded"
                      min="0"
                      disabled={isSubmitting}
                    />
                  </div>

                  {renderExcludingQuestionsSection(editingDiagnosis, true)}

                  <button
                    onClick={handleUpdateDiagnosis}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    Güncelle
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{diagnosis.name}</h4>
                      <p className="text-sm text-gray-600">{diagnosis.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingDiagnosis(diagnosis)}
                        className="text-blue-600 hover:text-blue-700"
                        disabled={isSubmitting}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteDiagnosis(id)}
                        className="text-red-600 hover:text-red-700"
                        disabled={isSubmitting}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div>
                      Gerekli Sorular: {diagnosis.criteria.requiredQuestions.join(', ')}
                    </div>
                    <div>
                      Minimum Pozitif Cevap: {diagnosis.criteria.minPositiveAnswers}
                    </div>
                    {diagnosis.criteria.excludingQuestions.length > 0 && (
                      <div>
                        Dışlama Soruları:
                        <ul className="list-disc list-inside ml-4">
                          {diagnosis.criteria.excludingQuestions.map((eq, index) => (
                            <li key={index}>
                              {eq.questionId} - {eq.value ? 'Evet' : 'Hayır'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}