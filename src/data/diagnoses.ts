import { Diagnosis } from '../types';

export const diagnoses: Record<string, Diagnosis> = {
  substanceInducedDepression: {
    id: 'substance_induced_depression',
    name: "BDS'na bağlı depresyon bozukluğu ya da Maddenin yol açtığı Depresyon bozukluğu",
    description: "BDS veya madde kullanımına bağlı depresyon bozukluğu tanı kriterleri",
    criteria: {
      requiredQuestions: ['A12_3', 'A12_5', 'A12_6'],
      minPositiveAnswers: 1,
      excludingQuestions: []
    }
  },
  currentMajorDepression: {
    id: 'current_major_depression',
    name: "O SIRADA YEĞİN DEPRESYON DÖNEMİ",
    description: "Yeğin depresyon dönemi tanı kriterleri",
    criteria: {
      requiredQuestions: ['A1_3', 'A2_3', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'],
      minPositiveAnswers: 5,
      excludingQuestions: [
        { questionId: 'A12_3', value: true },
        { questionId: 'A12_5', value: true },
        { questionId: 'A12_6', value: true }
      ]
    }
  }
};