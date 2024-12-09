import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Search, Download, FileText, Trash2, Eye } from 'lucide-react';
import { PatientInfo, Answer, Report } from '../../types';
import { useEncryption } from '../../hooks/useEncryption';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { generateSummaryPDF, generateDetailedPDF } from '../../utils/pdfGenerator';
import { questions } from '../../data/questions';
import toast from 'react-hot-toast';

interface ReportsTabProps {
  currentPatient: PatientInfo | null;
  currentAnswers: Record<string, Answer>;
}

export function ReportsTab({ currentPatient, currentAnswers }: ReportsTabProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { encryptData, decryptData } = useEncryption();
  const { loadData, saveData } = useLocalStorage();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const savedReports = await loadData('reports');
    if (savedReports) {
      const decryptedReports = decryptData(savedReports);
      setReports(decryptedReports || []);
    }
  };

  const handleDeleteReport = async (id: string) => {
    const confirmed = window.confirm('Bu raporu silmek istediğinizden emin misiniz?');
    if (!confirmed) return;

    const updatedReports = reports.filter(report => report.id !== id);
    const encryptedReports = encryptData(updatedReports);
    await saveData('reports', encryptedReports);
    setReports(updatedReports);
    toast.success('Rapor başarıyla silindi');
  };

  const handleDownloadReport = async (report: Report, type: 'summary' | 'detailed') => {
    try {
      if (type === 'summary') {
        await generateSummaryPDF(report);
      } else {
        await generateDetailedPDF(report, questions);
      }
      toast.success('Rapor başarıyla indirildi');
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Rapor oluşturulurken bir hata oluştu');
    }
  };

  const filteredReports = reports.filter(report => 
    report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.date.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Hasta adı veya tarih ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Raporlar</h3>
        </div>

        <div className="divide-y">
          {filteredReports.map(report => (
            <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{report.patientName}</h4>
                  <p className="text-sm text-gray-500">
                    {format(new Date(report.date), 'dd MMMM yyyy HH:mm', { locale: tr })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadReport(report, 'summary')}
                    className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                    title="Özet PDF İndir"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    onClick={() => handleDownloadReport(report, 'detailed')}
                    className="p-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                    title="Detaylı PDF İndir"
                  >
                    <FileText size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="p-2 text-green-600 hover:text-green-700 transition-colors"
                    title="Görüntüle"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="p-2 text-red-600 hover:text-red-700 transition-colors"
                    title="Sil"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {selectedReport?.id === report.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium mb-2">Tanılar:</h5>
                  <ul className="list-disc list-inside space-y-1">
                    {report.diagnoses.map((diagnosis, index) => (
                      <li key={index} className="text-sm">
                        {diagnosis.name}
                      </li>
                    ))}
                  </ul>
                  {report.notes && (
                    <>
                      <h5 className="font-medium mt-4 mb-2">Notlar:</h5>
                      <p className="text-sm text-gray-600">{report.notes}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'Aramanızla eşleşen rapor bulunamadı.' : 'Henüz rapor bulunmuyor.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}