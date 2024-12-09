export interface PatientInfo {
  fullName: string;
  birthDate: string;
  gender: string;
  education: string;
  maritalStatus: string;
  occupation: string;
  siblings: number;
  notes: string;
  // Yeni alanlar
  phone?: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  previousTherapy?: boolean;
  medicationHistory?: string;
  familyHistory?: string;
  referralSource?: string;
  insuranceInfo?: string;
  consentSigned?: boolean;
}

export interface Answer {
  value: boolean | null;
  date?: string;
  notes?: string;
}

export interface DiagnosisCriteria {
  requiredQuestions: string[];
  minPositiveAnswers: number;
  excludingQuestions: {
    questionId: string;
    value: boolean;
  }[];
}

export interface Diagnosis {
  id: string;
  name: string;
  description: string;
  criteria: DiagnosisCriteria;
}

export interface Question {
  id: string;
  text: string;
  diagnosis: string;
  diagnosisName?: string;
  requiresDate?: boolean;
  requiresNote?: boolean;
  yesNext?: string;
  noNext?: string;
  isResult?: boolean;
  isInformational?: boolean;
  infoText?: string;
}

export interface Report {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  diagnoses: {
    id: string;
    name: string;
    confirmed: boolean;
  }[];
  answers: Record<string, Answer>;
  notes?: string;
}