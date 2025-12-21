import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';

// Convert HTML string to a PDF blob sized to A4 (794x1123px used by the app preview)
export async function htmlToPdfBlob(html) {
  // Create offscreen container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.height = '1123px';
  container.innerHTML = html;
  document.body.appendChild(container);

  // Render with a higher scale for better quality
  const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: '#ffffff', width: 794, height: 1123 });
  const imgData = canvas.toDataURL('image/png');

  // Create PDF with jsPDF using px units and exact pixel dimensions
  const pdf = new jsPDF({ unit: 'px', format: [794, 1123], orientation: 'portrait' });
  pdf.addImage(imgData, 'PNG', 0, 0, 794, 1123);

  const blob = pdf.output('blob');
  document.body.removeChild(container);
  return blob;
}

// Upload blob to server share endpoint as multipart/form-data
export async function sendPdfToServer({ certificateId, blob, subject, greeting, email, orientation = 'portrait' }) {
  const url = `/api/certificates/${certificateId}/share`;
  const form = new FormData();
  form.append('pdf', new File([blob], `certificate-${certificateId}.pdf`, { type: 'application/pdf' }));
  if (subject) form.append('subject', subject);
  if (greeting) form.append('greeting', greeting);
  if (email) form.append('email', email);
  form.append('orientation', orientation);

  const res = await axios.post(url, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}