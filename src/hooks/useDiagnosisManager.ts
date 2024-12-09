import { useState } from 'react';
import { Diagnosis } from '../types';
import toast from 'react-hot-toast';

export function useDiagnosisManager(initialDiagnoses: Record<string, Diagnosis>) {
  const [diagnoses, setDiagnoses] = useState(initialDiagnoses);

  const validateDiagnosis = (diagnosis: Diagnosis): boolean => {
    if (!diagnosis.id || !diagnosis.name) {
      toast.error('ID ve tanı adı zorunludur');
      return false;
    }
    return true;
  };

  const addDiagnosis = (diagnosis: Diagnosis) => {
    if (!validateDiagnosis(diagnosis)) return false;
    
    if (diagnoses[diagnosis.id]) {
      toast.error('Bu ID ile bir tanı zaten mevcut');
      return false;
    }

    setDiagnoses(prev => ({
      ...prev,
      [diagnosis.id]: diagnosis
    }));
    return true;
  };

  const updateDiagnosis = (diagnosis: Diagnosis) => {
    if (!validateDiagnosis(diagnosis)) return false;
    
    setDiagnoses(prev => ({
      ...prev,
      [diagnosis.id]: diagnosis
    }));
    return true;
  };

  const deleteDiagnosis = (id: string) => {
    setDiagnoses(prev => {
      const newDiagnoses = { ...prev };
      delete newDiagnoses[id];
      return newDiagnoses;
    });
  };

  return {
    diagnoses,
    setDiagnoses,
    addDiagnosis,
    updateDiagnosis,
    deleteDiagnosis
  };
}