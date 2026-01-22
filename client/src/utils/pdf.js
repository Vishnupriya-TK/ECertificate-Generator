import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Convert HTML string to a PDF blob sized to certificate dimensions (794x900px used by the app preview)
export async function htmlToPdfBlob(html, orientation = 'portrait') {
  // Choose dimensions for certificate at ~96dpi (portrait only)
  const dims = { width: 794, height: 900 };

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

  // Ensure the certificate is centered and scaled for portrait
  try {
    // wait for images to load
    const imgs = Array.from(container.querySelectorAll('img'));
    await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = img.onerror = r; })));
    // small delay for fonts/images
    await new Promise((r) => setTimeout(r, 50));

    const cert = container.querySelector('.certificate');
    if (cert) {
      const originalWidth = 794;
      const originalHeight = 900;
      const scale = Math.min(dims.width / originalWidth, dims.height / originalHeight) * 0.95;
      cert.style.transform = `scale(${scale})`;
      cert.style.transformOrigin = 'center center';
      cert.style.margin = '0';
      container.style.display = 'flex';
      container.style.justifyContent = 'center';
      container.style.alignItems = 'center';
      container.style.overflow = 'hidden';
    }
  } catch (e) {
    // ignore and continue
  }

  // Render with a higher scale for better quality
  const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: '#ffffff', width: dims.width, height: dims.height });
  const imgData = canvas.toDataURL('image/png');

  // Create PDF with jsPDF using px units and exact pixel dimensions
  const pdf = new jsPDF({ unit: 'px', format: [dims.width, dims.height], orientation: 'portrait' });
  pdf.addImage(imgData, 'PNG', 0, 0, dims.width, dims.height);

  const blob = pdf.output('blob');
  document.body.removeChild(container);
  return blob;
}