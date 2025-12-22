import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Convert HTML string to a PDF blob sized to A4 (794x1000px used by the app preview - reduced height)
export async function htmlToPdfBlob(html, orientation = 'portrait') {
  // Choose dimensions for A4 at ~96dpi
  // Always generate portrait sized A4 at the app scale (reduced height)
  const dims = { width: 794, height: 1000 };

  // Create offscreen container sized for portrait
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

  // Ensure content is centered/fitted in portrait fallback if required
  try {
    // Parse the HTML to avoid nested <html>/<body> interfering with layout and prefer the .certificate element
    const parser = new DOMParser();
    const docFrag = parser.parseFromString(html, 'text/html');
    const certEl = docFrag.querySelector('.certificate');

    // Wait for image assets referenced by the certificate to load
    const imgs = [];
    if (certEl) {
      Array.from(certEl.querySelectorAll('img')).forEach((imgNode) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imgNode.src;
        imgs.push(img);
      });
    } else {
      Array.from(container.querySelectorAll('img')).forEach((i) => imgs.push(i));
    }
    await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = img.onerror = r; })));
    await new Promise((r) => setTimeout(r, 30));

    // If we parsed a certificate element, replace the container content with it so it occupies the container exactly
    if (certEl) {
      container.innerHTML = '';
      const cloned = certEl.cloneNode(true);
      cloned.style.width = '100%';
      cloned.style.height = '100%';
      cloned.style.margin = '0';
      cloned.style.transform = 'none';
      cloned.style.boxSizing = 'border-box';
      container.appendChild(cloned);
    } else {
      const cert = container.querySelector('.certificate');
      if (cert) {
        cert.style.width = '100%';
        cert.style.height = '100%';
        cert.style.margin = '0';
        cert.style.transform = 'none';
        cert.style.boxSizing = 'border-box';
      }
    }

    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.overflow = 'hidden';
  } catch (e) {
    // ignore and fallback to default rendering
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