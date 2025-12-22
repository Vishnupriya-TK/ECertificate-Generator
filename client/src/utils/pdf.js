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

  // Content-aware fitting to reduce blank margins and crop to visible content (applies to both portrait & landscape)
  try {
    // wait for images to load
    const imgs = Array.from(container.querySelectorAll('img'));
    await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = img.onerror = r; })));
    // small delay for fonts/images
    await new Promise((r) => setTimeout(r, 50));

    const cert = container.querySelector('.certificate');
    if (cert) {
      const elRect = cert.getBoundingClientRect();
      // compute bounding box of visible children
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      const children = cert.querySelectorAll('*');
      children.forEach((ch) => {
        const r = ch.getBoundingClientRect();
        if (r.width > 2 && r.height > 2) {
          minX = Math.min(minX, r.left);
          minY = Math.min(minY, r.top);
          maxX = Math.max(maxX, r.right);
          maxY = Math.max(maxY, r.bottom);
        }
      });

      if (!isFinite(minX)) {
        // fallback to full certificate
        minX = elRect.left; minY = elRect.top; maxX = elRect.right; maxY = elRect.bottom;
      }

      const contentW = maxX - minX;
      const contentH = maxY - minY;
      const margin = 24; // keep a small margin in px
      const scale = Math.min((dims.width - margin * 2) / contentW, (dims.height - margin * 2) / contentH) * 0.95;

      // Build a clean wrapper and a trimmed clone to avoid side-effects
      const wrapper = document.createElement('div');
      wrapper.style.width = `${dims.width}px`;
      wrapper.style.height = `${dims.height}px`;
      wrapper.style.display = 'flex';
      wrapper.style.justifyContent = 'center';
      wrapper.style.alignItems = 'center';
      wrapper.style.overflow = 'hidden';
      wrapper.style.background = '#ffffff';

      const clone = cert.cloneNode(true);
      // shift clone so the content bounding box aligns with origin, then scale
      clone.style.margin = `-${Math.round(minY - elRect.top)}px 0 0 -${Math.round(minX - elRect.left)}px`;
      clone.style.transformOrigin = 'top left';
      clone.style.transform = `scale(${scale})`;
      clone.style.display = 'block';

      // replace container contents with wrapper
      container.innerHTML = '';
      wrapper.appendChild(clone);
      container.appendChild(wrapper);
    }
  } catch (e) {
    // If anything fails, fallback to simple centering
    const cert = container.querySelector('.certificate');
    if (cert) {
      const originalWidth = 794;
      const originalHeight = 1123;
      const scale = Math.min(dims.width / originalWidth, dims.height / originalHeight) * 0.95;
      cert.style.transform = `scale(${scale})`;
      cert.style.transformOrigin = 'center center';
      cert.style.margin = '0';
      container.style.display = 'flex';
      container.style.justifyContent = 'center';
      container.style.alignItems = 'center';
      container.style.overflow = 'hidden';
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