import React, { useState } from 'react';
import { PatientInfo } from '../types';
import { AlertCircle } from 'lucide-react';

interface PatientFormProps {
  onSubmit: (info: PatientInfo) => void;
}

const EDUCATION_OPTIONS = [
  'İlkokul',
  'Ortaokul',
  'Lise',
  'Ön Lisans',
  'Lisans',
  'Yüksek Lisans',
  'Doktora',
  'Okur Yazar Değil',
];

const MIN_DATE = '1900-01-01';
const MAX_DATE = new Date().toISOString().split('T')[0];

export function PatientForm({ onSubmit }: PatientFormProps) {
  const [info, setInfo] = useState<PatientInfo>({
    fullName: '',
    birthDate: '',
    gender: '',
    education: '',
    maritalStatus: '',
    occupation: '',
    siblings: 0,
    notes: '',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    previousTherapy: false,
    medicationHistory: '',
    familyHistory: '',
    referralSource: '',
    insuranceInfo: '',
    consentSigned: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(info);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Danışan Bilgileri
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Tüm alanlar opsiyoneldir. Dilerseniz daha sonra doldurabilirsiniz.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* İsim ve Doğum Tarihi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ad Soyad
            </label>
            <input
              type="text"
              value={info.fullName}
              onChange={(e) => setInfo((prev) => ({ ...prev, fullName: e.target.value }))}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="İsimsiz Danışan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Doğum Tarihi
            </label>
            <input
              type="date"
              min={MIN_DATE}
              max={MAX_DATE}
              value={info.birthDate}
              onChange={(e) => setInfo((prev) => ({ ...prev, birthDate: e.target.value }))}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* İletişim Bilgileri */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Telefon
            </label>
            <input
              type="tel"
              value={info.phone}
              onChange={(e) => setInfo((prev) => ({ ...prev, phone: e.target.value }))}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="(___) ___ __ __"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              E-posta
            </label>
            <input
              type="email"
              value={info.email}
              onChange={(e) => setInfo((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="ornek@email.com"
            />
          </div>

          {/* Demografik Bilgiler */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cinsiyet
            </label>
            <select
              value={info.gender}
              onChange={(e) => setInfo((prev) => ({ ...prev, gender: e.target.value }))}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Seçiniz</option>
              <option value="male">Erkek</option>
              <option value="female">Kadın</option>
              <option value="other">Diğer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Eğitim Durumu
            </label>
            <select
              value={info.education}
              onChange={(e) => setInfo((prev) => ({ ...prev, education: e.target.value }))}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Seçiniz</option>
              {EDUCATION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Adres Bilgisi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Adres
          </label>
          <textarea
            value={info.address}
            onChange={(e) => setInfo((prev) => ({ ...prev, address: e.target.value }))}
            rows={2}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Adres bilgisi..."
          />
        </div>

        {/* Sağlık Geçmişi */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-white">Sağlık Geçmişi</h3>
          
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={info.previousTherapy}
                onChange={(e) => setInfo((prev) => ({ ...prev, previousTherapy: e.target.checked }))}
                className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Daha önce psikolojik destek aldınız mı?
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              İlaç Kullanım Geçmişi
            </label>
            <textarea
              value={info.medicationHistory}
              onChange={(e) => setInfo((prev) => ({ ...prev, medicationHistory: e.target.value }))}
              rows={2}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Varsa kullandığınız ilaçlar..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Aile Öyküsü
            </label>
            <textarea
              value={info.familyHistory}
              onChange={(e) => setInfo((prev) => ({ ...prev, familyHistory: e.target.value }))}
              rows={2}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Ailede psikolojik rahatsızlık öyküsü..."
            />
          </div>
        </div>

        {/* Ek Notlar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ek Notlar
          </label>
          <textarea
            value={info.notes}
            onChange={(e) => setInfo((prev) => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Eklemek istediğiniz notlar..."
          />
        </div>

        {/* Bilgilendirme ve Onay */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">Bilgilendirme</p>
            <p>
              Bu form tamamen opsiyoneldir. Dilerseniz şimdi doldurabilir veya daha sonra 
              tamamlayabilirsiniz. Görüşmeye başlamak için "Görüşmeye Başla" butonuna tıklayın.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Görüşmeye Başla
        </button>
      </div>
    </form>
  );
}