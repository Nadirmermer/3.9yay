import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Report, Question } from '../types';

export async function generateSummaryPDF(report: Report) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Başlık
  doc.setFontSize(16);
  doc.text('SCID-5-CV Görüşme Özeti', 20, 20);

  // Hasta Bilgileri
  doc.setFontSize(12);
  doc.text(`Hasta: ${report.patientName}`, 20, 35);
  doc.text(`Tarih: ${format(new Date(report.date), 'dd MMMM yyyy', { locale: tr })}`, 20, 45);

  // Tanılar
  let yPos = 60;
  doc.setFontSize(14);
  doc.text('Tanılar:', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  report.diagnoses.forEach((diagnosis, index) => {
    doc.text(`${index + 1}. ${diagnosis.name}`, 25, yPos);
    yPos += 8;
  });

  const fileName = `SCID5-Ozet-${format(new Date(report.date), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
}

export async function generateDetailedPDF(report: Report, questions: Record<string, Question>) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Başlık
  doc.setFontSize(16);
  doc.text('SCID-5-CV Detaylı Görüşme Raporu', 20, 20);

  // Hasta Bilgileri
  doc.setFontSize(12);
  doc.text(`Hasta: ${report.patientName}`, 20, 35);
  doc.text(`Tarih: ${format(new Date(report.date), 'dd MMMM yyyy', { locale: tr })}`, 20, 45);

  // Cevaplar
  let yPos = 60;
  doc.setFontSize(14);
  doc.text('Cevaplar:', 20, yPos);
  yPos += 10;

  doc.setFontSize(10);
  Object.entries(report.answers).forEach(([questionId, answer]) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    const answerText = answer.value === true ? 'Evet' : answer.value === false ? 'Hayır' : 'Bilinmiyor';
    doc.text(`${questionId}: ${answerText}`, 20, yPos);
    yPos += 7;
  });

  const fileName = `SCID5-Detayli-${format(new Date(report.date), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
}