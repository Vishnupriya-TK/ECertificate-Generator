import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Convert HTML string to a PDF blob sized to A4 (794x1123px used by the app preview)
export async function htmlToPdfBlob(html, orientation = 'portrait') {
  // Choose dimensions for A4 at ~96dpi
  const portrait = { width: 794, height: 1123 };
  const landscape = { width: 1123, height: 794 };
  const dims = orientation === 'landscape' ? landscape : portrait;

  // Create offscreen container sized for orientation
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = `${dims.width}px`;
  container.style.height = `${dims.height}px`;
  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  container.style.background = '#ffffff';
  container.innerHTML = html;
  document.body.appendChild(container);

  // If landscape, scale the internal certificate down so the portrait layout fits nicely
  if (orientation === 'landscape') {
    try {
      const cert = container.querySelector('.certificate');
      if (cert) {
        const originalHeight = 1123; // original portrait height used by templates
        const scale = Math.min(1, dims.height / originalHeight);
        cert.style.transform = `scale(${scale})`;
        cert.style.transformOrigin = 'top center';
        cert.style.margin = '0';
        // Because we scaled down, ensure the container scroll area matches the target dimensions
      }
    } catch (e) {
      // ignore if DOM structure differs
    }
  }

  // Render with a higher scale for better quality
  const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: '#ffffff', width: dims.width, height: dims.height });
  const imgData = canvas.toDataURL('image/png');

  // Create PDF with jsPDF using px units and exact pixel dimensions
  const pdf = new jsPDF({ unit: 'px', format: [dims.width, dims.height], orientation: orientation === 'landscape' ? 'landscape' : 'portrait' });
  pdf.addImage(imgData, 'PNG', 0, 0, dims.width, dims.height);

  const blob = pdf.output('blob');
  document.body.removeChild(container);
  return blob;
}