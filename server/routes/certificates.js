const express = require("express");
const router = express.Router();
const Certificate = require("../model/Certificate.js");
const { protect } = require("../middleware/authMiddleware.js");
const nodemailer = require("nodemailer");

// Create certificate(s) - protected
router.post("/create", protect, async (req, res) => {
  try {
    const { students } = req.body;

    // If students is an array with items, create one Certificate per student (bulk)
    if (Array.isArray(students) && students.length > 0) {
      const docs = students.map((s) => {
        const name = typeof s === "string" ? s : s.name || s.studentName || "";
        // keep the original student object in `students` subdoc if available
        const singleStudent = typeof s === "object" ? s : { name };
        // spread other top-level fields from body (except students) into each doc
        const { students: _discard, ...rest } = req.body;
        return {
          studentName: name,
          students: [singleStudent],
          ...rest,
          createdBy: req.user._id,
        };
      });

      const created = await Certificate.insertMany(docs);
      return res.status(201).json({ success: true, created });
    }

    // Otherwise create a single certificate document from the request body
    const cert = new Certificate({ ...req.body, createdBy: req.user._id });
    await cert.save();
    res.status(201).json({ success: true, certificate: cert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get certificates for logged-in admin
router.get("/", protect, async (req, res) => {
  try {
    const list = await Certificate.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update certificate
router.put("/:id", protect, async (req, res) => {
  try {
    const doc = await Certificate.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    if (doc.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });
    const updated = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper function to generate DirectTemplate HTML
function buildGoogleFontsLink(doc) {
  const styles = doc.styles || {};
  const families = [
    styles.collegeStyle?.fontFamily,
    styles.collegeDescStyle?.fontFamily,
    styles.titleStyle?.fontFamily,
    styles.nameStyle?.fontFamily,
    styles.introStyle?.fontFamily,
    styles.eventDescStyle?.fontFamily,
    styles.signatoryStyle?.fontFamily,
  ]
    .filter(Boolean)
    .map((f) => String(f).split(',')[0].trim().replace(/"|'/g, ''));
  const unique = Array.from(new Set(families)).filter((f) => f && !/^(Arial|Georgia|Times New Roman|Times|Roboto|Poppins|Merriweather|Montserrat)$/i.test(''));
  // We still want to include common Google fonts if chosen
  const common = Array.from(new Set(families.filter((f) => /^(Roboto|Poppins|Merriweather|Montserrat)$/i.test(f))));
  const all = Array.from(new Set([...common, ...unique]));
  if (all.length === 0) return '';
  const familyQuery = all.map((f) => `family=${encodeURIComponent(f)}:wght@300;400;600;700;800`).join('&');
  return `\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?${familyQuery}&display=swap" rel="stylesheet">`;
}

function generateDirectHTML(doc) {
  const styles = doc.styles || {};
  const collegeStyle = styles.collegeStyle || {};
  const collegeDescStyle = styles.collegeDescStyle || {};
  const titleStyle = styles.titleStyle || {};
  const nameStyle = styles.nameStyle || {};
  const introStyle = styles.introStyle || {};
  const eventDescStyle = styles.eventDescStyle || {};
  const signatoryStyle = styles.signatoryStyle || {};

  const start = "";
  const end = "";

  const textBlocks = Array.isArray(doc.textBlocks) ? doc.textBlocks : [];
  const fontLinks = buildGoogleFontsLink(doc);
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        ${fontLinks}
        <style>
          @page { size: A4; margin: 0 }
          html, body { margin: 0; padding: 0; font-family: Arial, sans-serif; background: #ffffff; }
          /* A4 portrait at ~96dpi: 794x1123px */
          .certificate { position: relative; width: 794px; height: 1123px; margin: 0 auto; background-size: cover; background-position: center; background-repeat: no-repeat; box-sizing: border-box; }
          .content { position: relative; padding: 40px; text-align: center; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: ${collegeStyle.marginBottom || 15}px; }
          .logo { height: 56px; object-fit: contain; }
          .college-name { font-family: ${collegeStyle.fontFamily || 'inherit'}; font-size: ${Math.max(12, (collegeStyle.fontSize || 18) * 0.8)}px; line-height: ${collegeStyle.lineHeight || 1.3}; text-align: ${collegeStyle.align || 'left'}; margin-top: ${collegeStyle.marginTop || 5}px; font-weight: bold; }
          .college-desc { font-family: ${collegeDescStyle.fontFamily || 'inherit'}; font-size: ${collegeDescStyle.fontSize || 14}px; line-height: ${collegeDescStyle.lineHeight || 1.3}; text-align: ${collegeDescStyle.align || 'center'}; width: ${collegeDescStyle.width || 80}%; margin: ${collegeDescStyle.marginTop || 5}px auto ${collegeDescStyle.marginBottom || 20}px auto; }
          .title { font-family: ${titleStyle.fontFamily || 'inherit'}; font-size: ${titleStyle.fontSize || 48}px; line-height: ${titleStyle.lineHeight || 1.3}; width: ${titleStyle.width || 80}%; margin: ${titleStyle.marginTop || 20}px auto ${titleStyle.marginBottom || 20}px auto; text-align: ${titleStyle.align || 'center'}; font-weight: 800; color: #1e40af; letter-spacing: 0.025em; }
          .title-image { height: 48px; object-fit: contain; margin: ${titleStyle.marginTop || 20}px auto ${titleStyle.marginBottom || 20}px auto; }
          .intro { width: ${introStyle.width || 80}%; margin: ${introStyle.marginTop || 10}px auto ${introStyle.marginBottom || 10}px auto; text-align: ${introStyle.align || 'center'}; font-family: ${introStyle.fontFamily || 'inherit'}; font-size: ${introStyle.fontSize || 16}px; line-height: ${introStyle.lineHeight || 1.4}; }
          .student-name { font-family: ${nameStyle.fontFamily || 'inherit'}; font-size: ${Math.max(20, (nameStyle.fontSize || 44) * 0.7)}px; line-height: ${nameStyle.lineHeight || 1.3}; text-align: ${nameStyle.align || 'center'}; margin: ${nameStyle.marginTop || 15}px 0 ${nameStyle.marginBottom || 15}px 0; color: #1d4ed8; font-weight: 900; background: transparent; border: none; outline: none; min-width: 200px; }
          .student-college { font-family: ${introStyle.fontFamily || 'inherit'}; font-size: ${introStyle.fontSize || 14}px; text-align: ${introStyle.align || 'center'}; margin-top: 4px; }
          .event-desc { width: ${eventDescStyle.width || 80}%; margin: ${eventDescStyle.marginTop || 10}px auto ${eventDescStyle.marginBottom || 10}px auto; font-family: ${eventDescStyle.fontFamily || 'inherit'}; font-size: ${eventDescStyle.fontSize || 16}px; line-height: ${eventDescStyle.lineHeight || 1.4}; text-align: ${eventDescStyle.align || 'center'}; }
          .event-dates { font-family: ${introStyle.fontFamily || 'inherit'}; font-size: ${introStyle.fontSize || 16}px; text-align: ${introStyle.align || 'center'}; margin: 10px 0; }
          .signatories { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; width: ${signatoryStyle.width || 80}%; margin: ${signatoryStyle.marginTop || 40}px auto ${signatoryStyle.marginBottom || 10}px auto; }
          .signatory { text-align: center; }
          .signature { height: 40px; margin: 0 auto; }
          .signatory-name { border-top: 1px solid #374151; margin-top: 8px; padding-top: 4px; font-weight: 600; font-family: ${signatoryStyle.fontFamily || 'inherit'}; font-size: ${signatoryStyle.fontSize || 12}px; line-height: ${signatoryStyle.lineHeight || 1.2}; text-align: ${signatoryStyle.align || 'center'}; }
          .signatory-designation { color: #4b5563; font-family: ${signatoryStyle.fontFamily || 'inherit'}; font-size: ${((signatoryStyle.fontSize || 12) - 2)}px; text-align: ${signatoryStyle.align || 'center'}; }
          .text-block { margin-top: 8px; }
        </style>
      </head>
      <body>
        <div class="certificate" style="background-image: ${doc.backgroundUrl ? `url(${doc.backgroundUrl})` : 'none'};">
          <div class="content">
            <!-- Header with logo and college name -->
            <div class="header">
              <div style="display: flex; align-items: center; gap: 12px;">
                ${(doc.logos || []).filter(Boolean).slice(0,1).map(url => `<img src="${url}" alt="logo-left" class="logo" />`).join('')}
                <div class="college-name">
                  <div>${doc.collegeName}</div>
                </div>
              </div>
              ${(doc.logos || []).filter(Boolean).slice(1,2).map(url => `<img src="${url}" alt="logo-right" class="logo" />`).join('')}
            </div>

            <!-- College Description -->
            ${doc.collegeDescription ? `<div class="college-desc">${doc.collegeDescription}</div>` : ''}

            <!-- Title -->
            ${doc.customTitleImageUrl ? `<img src="${doc.customTitleImageUrl}" alt="title" class="title-image" />` : `<h2 style="font-family: ${titleStyle.fontFamily || 'inherit'}; font-size: ${titleStyle.fontSize || 48}px; line-height: ${titleStyle.lineHeight || 1.3}; width: ${titleStyle.width || 80}%; margin: ${titleStyle.marginTop || 20}px auto ${titleStyle.marginBottom || 20}px auto; text-align: ${titleStyle.align || 'center'}; font-weight: 800; color: #1e40af; letter-spacing: 0.025em;">${doc.titleOverride || (doc.eventType === 'custom' && doc.customTitleText ? `CERTIFICATE OF ${doc.customTitleText}` : 'CERTIFICATE')}</h2>`}

            <!-- Intro line with student name -->
            <div style="width: ${introStyle.width || 80}%; margin: ${introStyle.marginTop || 10}px auto ${introStyle.marginBottom || 10}px auto; text-align: ${introStyle.align || 'center'}; font-family: ${introStyle.fontFamily || 'inherit'}; font-size: ${introStyle.fontSize || 16}px; line-height: ${introStyle.lineHeight || 1.4};">
              <span>${doc.introLeft || "This is to certify that Mr./Ms."} </span>
              <span style="font-family: ${nameStyle.fontFamily || 'inherit'}; font-size: ${Math.max(20, (nameStyle.fontSize || 44) * 0.7)}px; line-height: ${nameStyle.lineHeight || 1.3}; text-align: ${nameStyle.align || 'center'}; margin: ${nameStyle.marginTop || 15}px 0 ${nameStyle.marginBottom || 15}px 0; color: #1d4ed8; font-weight: 900;">${doc.studentName}</span>
              <span> ${doc.introRight || "has participated in the event"}</span>
            </div>

            <!-- Student College -->
            ${doc.studentCollege ? `<div class="student-college">${doc.studentCollege}</div>` : ''}

            <!-- Optional text blocks -->
            ${textBlocks.map((b) => {
              const align = b.align || 'left';
              const weight = b.bold ? 700 : 400;
              const decoration = b.underline ? 'underline' : 'none';
              const fontSize = b.fontSize ? `${b.fontSize}px` : '';
              const lineHeight = b.lineHeight ? `${b.lineHeight}` : '';
              const width = b.width ? `${b.width}%` : '';
              const fontFamily = b.fontFamily || (styles && styles.fontFamily) || 'Arial';
              const marginLeft = align === 'left' ? '0' : 'auto';
              const marginRight = align === 'right' ? '0' : 'auto';
              const style = `text-align:${align};font-weight:${weight};text-decoration:${decoration};font-size:${fontSize};line-height:${lineHeight};width:${width};margin-left:${marginLeft};margin-right:${marginRight};font-family:${fontFamily};`;
              const value = `${b.label || ''} ${b.value || ''}`.trim();
              return value ? `<p class="text-block" style="${style}">${value}</p>` : '';
            }).join('')}

            <!-- Event Description -->
            ${doc.eventDescription ? `<div style="width: ${eventDescStyle.width || 80}%; margin: ${eventDescStyle.marginTop || 10}px auto ${eventDescStyle.marginBottom || 10}px auto; font-family: ${eventDescStyle.fontFamily || 'inherit'}; font-size: ${eventDescStyle.fontSize || 16}px; line-height: ${eventDescStyle.lineHeight || 1.4}; text-align: ${eventDescStyle.align || 'center'};">${doc.eventDescription}</div>` : ''}

            <!-- Event Name and Dates -->
            <p class="event-dates">${doc.eventName ? doc.eventName + " • " : ""}${start}${end ? " to " + end : ""}</p>

            <!-- Signatories -->
            ${Array.isArray(doc.signatories) && doc.signatories.length > 0 ? `
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; width: ${signatoryStyle.width || 80}%; margin: ${signatoryStyle.marginTop || 40}px auto ${signatoryStyle.marginBottom || 10}px auto;">
                ${doc.signatories.slice(0,4).map(s => `
                  <div style="text-align: center;">
                    ${s.signatureUrl ? `<img src="${s.signatureUrl}" alt="signature" style="height: 40px; margin: 0 auto;" />` : '<div style="height: 40px;"></div>'}
                    <p style="border-top: 1px solid #374151; margin-top: 8px; padding-top: 4px; font-weight: 600; font-family: ${signatoryStyle.fontFamily || 'inherit'}; font-size: ${signatoryStyle.fontSize || 12}px; line-height: ${signatoryStyle.lineHeight || 1.2}; text-align: ${signatoryStyle.align || 'center'};">${s.name || "Signatory"}</p>
                    <p style="color: #4b5563; font-family: ${signatoryStyle.fontFamily || 'inherit'}; font-size: ${(signatoryStyle.fontSize || 12) - 2}px; text-align: ${signatoryStyle.align || 'center'};">${s.designation || "Designation"}${s.department ? `, ${s.department}` : ''}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </body>
    </html>
  `;
}

// Helper function to generate MinimalTemplate HTML
function generateMinimalHTML(doc) {
  const styles = doc.styles || {};
  const collegeStyle = styles.collegeStyle || {};
  const collegeDescStyle = styles.collegeDescStyle || {};
  const titleStyle = styles.titleStyle || {};
  const nameStyle = styles.nameStyle || {};
  const introStyle = styles.introStyle || {};
  const eventDescStyle = styles.eventDescStyle || {};
  const signatoryStyle = styles.signatoryStyle || {};

  const start = "";
  const end = "";

  const textBlocks = Array.isArray(doc.textBlocks) ? doc.textBlocks : [];
  const fontLinks = buildGoogleFontsLink(doc);
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        ${fontLinks}
        <style>
          @page { size: A4; margin: 0 }
          html, body { margin: 0; padding: 0; font-family: Arial, sans-serif; background: #ffffff; }
          /* A4 portrait content area */
          .certificate { position: relative; width: 794px; height: 1123px; margin: 0 auto; background: white; padding: 40px; text-align: center; box-sizing: border-box; }
          .header { margin-bottom: 30px; display:flex; justify-content: space-between; align-items:center; }
          .logo { height: 60px; object-fit: contain; margin-bottom: 0; }
          .college-name { font-family: ${collegeStyle.fontFamily || 'inherit'}; font-size: ${collegeStyle.fontSize }px; line-height: ${collegeStyle.lineHeight || 1.3}; text-align: ${collegeStyle.align || 'center'}; font-weight: bold; color: #1f2937; }
          .college-desc { font-family: ${collegeDescStyle.fontFamily }; font-size: ${collegeDescStyle.fontSize }px; line-height: ${collegeDescStyle.lineHeight || 1.5}; text-align: ${collegeDescStyle.align || 'center'}; width: ${collegeDescStyle.width || 80}%; margin: ${collegeDescStyle.marginTop || 10}px auto ${collegeDescStyle.marginBottom || 20}px auto; color: #6b7280; }
          .title { font-family: ${titleStyle.fontFamily || 'inherit'}; font-size: ${titleStyle.fontSize || 36}px; line-height: ${titleStyle.lineHeight || 1.2}; width: ${titleStyle.width || 80}%; margin: ${titleStyle.marginTop || 20}px auto ${titleStyle.marginBottom || 20}px auto; text-align: ${titleStyle.align || 'center'}; font-weight: 700; color: #1e40af; }
          .title-image { height: 48px; object-fit: contain; margin: ${titleStyle.marginTop || 20}px auto ${titleStyle.marginBottom || 20}px auto; }
          .intro { width: ${introStyle.width || 80}%; margin: ${introStyle.marginTop || 10}px auto ${introStyle.marginBottom || 10}px auto; text-align: ${introStyle.align || 'center'}; font-family: ${introStyle.fontFamily || 'inherit'}; font-size: ${introStyle.fontSize || 18}px; line-height: ${introStyle.lineHeight || 1.5}; color: #374151; }
          .student-name { font-family: ${nameStyle.fontFamily || 'inherit'}; font-size: ${nameStyle.fontSize || 32}px; line-height: ${nameStyle.lineHeight || 1.3}; text-align: ${nameStyle.align || 'center'}; margin: ${nameStyle.marginTop || 15}px 0 ${nameStyle.marginBottom || 15}px 0; color: #1d4ed8; font-weight: 800; }
          .student-college { font-family: ${introStyle.fontFamily || 'inherit'}; font-size: ${introStyle.fontSize || 16}px; text-align: ${introStyle.align || 'center'}; margin-top: 8px; color: #6b7280; }
          .event-desc { width: ${eventDescStyle.width || 80}%; margin: ${eventDescStyle.marginTop || 15}px auto ${eventDescStyle.marginBottom || 15}px auto; font-family: ${eventDescStyle.fontFamily || 'inherit'}; font-size: ${eventDescStyle.fontSize || 18}px; line-height: ${eventDescStyle.lineHeight || 1.5}; text-align: ${eventDescStyle.align || 'center'}; color: #374151; }
          .event-dates { font-family: ${introStyle.fontFamily || 'inherit'}; font-size: ${introStyle.fontSize || 18}px; text-align: ${introStyle.align || 'center'}; margin: 15px 0; color: #6b7280; }
          .signatories { display: flex; justify-content: center; gap: 60px; width: ${signatoryStyle.width || 80}%; margin: ${signatoryStyle.marginTop || 40}px auto ${signatoryStyle.marginBottom || 20}px auto; }
          .signatory { text-align: center; flex: 1; }
          .signature { height: 50px; margin: 0 auto 10px; }
          .signatory-name { border-top: 2px solid #374151; padding-top: 8px; font-weight: 600; font-family: ${signatoryStyle.fontFamily || 'inherit'}; font-size: ${signatoryStyle.fontSize || 14}px; line-height: ${signatoryStyle.lineHeight || 1.2}; text-align: ${signatoryStyle.align || 'center'}; color: #1f2937; }
          .signatory-designation { color: #6b7280; font-family: ${signatoryStyle.fontFamily || 'inherit'}; font-size: ${((signatoryStyle.fontSize || 14) - 2)}px; text-align: ${signatoryStyle.align || 'center'}; margin-top: 4px; }
          .text-block { margin-top: 8px; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            ${(doc.logos || []).filter(Boolean).slice(0,1).map(url => `<img src="${url}" alt="logo-left" class="logo" />`).join('')}
            <div class="college-name">${doc.collegeName}</div>
            ${(doc.logos || []).filter(Boolean).slice(1,2).map(url => `<img src="${url}" alt="logo-right" class="logo" />`).join('')}
          </div>

          <!-- College Description -->
          ${doc.collegeDescription ? `<div class="college-desc">${doc.collegeDescription}</div>` : ''}

            <!-- Title -->
            ${doc.customTitleImageUrl ? `<img src="${doc.customTitleImageUrl}" alt="title" class="title-image" />` : `<h2 style="font-family: ${titleStyle.fontFamily || 'inherit'}; font-size: ${titleStyle.fontSize || 36}px; line-height: ${titleStyle.lineHeight || 1.2}; width: ${titleStyle.width || 80}%; margin: ${titleStyle.marginTop || 20}px auto ${titleStyle.marginBottom || 20}px auto; text-align: ${titleStyle.align || 'center'}; font-weight: 700; color: #1e40af;">${doc.titleOverride || (doc.eventType === 'custom' && doc.customTitleText ? `CERTIFICATE OF ${doc.customTitleText}` : 'CERTIFICATE')}</h2>`}

          <!-- Intro line with student name -->
          <div style="width: ${introStyle.width || 80}%; margin: ${introStyle.marginTop || 10}px auto ${introStyle.marginBottom || 10}px auto; text-align: ${introStyle.align || 'center'}; font-family: ${introStyle.fontFamily || 'inherit'}; font-size: ${introStyle.fontSize || 18}px; line-height: ${introStyle.lineHeight || 1.5}; color: #374151;">
            <span>${doc.introLeft || "This is to certify that"} </span>
            <div style="font-family: ${nameStyle.fontFamily || 'inherit'}; font-size: ${nameStyle.fontSize || 32}px; line-height: ${nameStyle.lineHeight || 1.3}; text-align: ${nameStyle.align || 'center'}; margin: ${nameStyle.marginTop || 15}px 0 ${nameStyle.marginBottom || 15}px 0; color: #1d4ed8; font-weight: 800;">${doc.studentName}</div>
            <span> ${doc.introRight || "has successfully completed the program"}</span>
          </div>

          <!-- Student College -->
          ${doc.studentCollege ? `<div class="student-college">${doc.studentCollege}</div>` : ''}

          <!-- Optional text blocks -->
          ${textBlocks.map((b) => {
            const align = b.align || 'left';
            const weight = b.bold ? 700 : 400;
            const decoration = b.underline ? 'underline' : 'none';
            const fontSize = b.fontSize ? `${b.fontSize}px` : '';
            const lineHeight = b.lineHeight ? `${b.lineHeight}` : '';
            const width = b.width ? `${b.width}%` : '';
            const fontFamily = b.fontFamily || (styles && styles.fontFamily) || 'Arial';
            const marginLeft = align === 'left' ? '0' : 'auto';
            const marginRight = align === 'right' ? '0' : 'auto';
            const style = `text-align:${align};font-weight:${weight};text-decoration:${decoration};font-size:${fontSize};line-height:${lineHeight};width:${width};margin-left:${marginLeft};margin-right:${marginRight};font-family:${fontFamily};`;
            const value = `${b.label || ''} ${b.value || ''}`.trim();
            return value ? `<p class="text-block" style="${style}">${value}</p>` : '';
          }).join('')}

          <!-- Event Description -->
          ${doc.eventDescription ? `<div style="width: ${eventDescStyle.width || 80}%; margin: ${eventDescStyle.marginTop || 15}px auto ${eventDescStyle.marginBottom || 15}px auto; font-family: ${eventDescStyle.fontFamily || 'inherit'}; font-size: ${eventDescStyle.fontSize || 18}px; line-height: ${eventDescStyle.lineHeight || 1.5}; text-align: ${eventDescStyle.align || 'center'}; color: #374151;">${doc.eventDescription}</div>` : ''}

            <!-- Event Name and Dates -->
            <p class="event-dates">${doc.eventName ? doc.eventName + " • " : ""}${start}${end ? " to " + end : ""}</p>

          <!-- Signatories -->
          ${Array.isArray(doc.signatories) && doc.signatories.length > 0 ? `
            <div style="display: flex; justify-content: center; gap: 60px; width: ${signatoryStyle.width || 80}%; margin: ${signatoryStyle.marginTop || 40}px auto ${signatoryStyle.marginBottom || 20}px auto;">
              ${doc.signatories.slice(0,2).map(s => `
                <div style="text-align: center; flex: 1;">
                  ${s.signatureUrl ? `<img src="${s.signatureUrl}" alt="signature" style="height: 50px; margin: 0 auto 10px;" />` : '<div style="height: 50px;"></div>'}
                  <p style="border-top: 2px solid #374151; padding-top: 8px; font-weight: 600; font-family: ${signatoryStyle.fontFamily || 'inherit'}; font-size: ${signatoryStyle.fontSize || 14}px; line-height: ${signatoryStyle.lineHeight || 1.2}; text-align: ${signatoryStyle.align || 'center'}; color: #1f2937;">${s.name || "Signatory"}</p>
                  <p style="color: #6b7280; font-family: ${signatoryStyle.fontFamily || 'inherit'}; font-size: ${(signatoryStyle.fontSize || 14) - 2}px; text-align: ${signatoryStyle.align || 'center'}; margin-top: 4px;">${s.designation || "Designation"}${s.department ? `, ${s.department}` : ''}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </body>
    </html>
  `;
}
// Download certificate PDF
router.get("/:id/download", protect, async (req, res) => {
  try {
    const doc = await Certificate.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    if (doc.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

    // Generate PDF using puppeteer
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });

    // Choose HTML generator based on templateKey
    let html;
    if (doc.templateKey === 'minimal') {
      html = generateMinimalHTML(doc);
    } else {
      html = generateDirectHTML(doc);
    }

    await page.setContent(html, { waitUntil: 'load' });
    const landscape = String(req.query.orientation || '').toLowerCase() === 'landscape';
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true
    });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${doc._id}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF download error:', err);
    res.status(500).json({ message: err.message || 'Failed to generate PDF' });
  }
});

// Share certificate via email with attached PDF
router.post("/:id/share", protect, async (req, res) => {
  try {
    const doc = await Certificate.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    if (doc.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });
    const toEmail = (doc.students && doc.students[0] && doc.students[0].email) || req.body.email;
    if (!toEmail) return res.status(400).json({ message: "No recipient email found" });

    // Generate HTML
    let html;
    if (doc.templateKey === 'minimal') html = generateMinimalHTML(doc); else html = generateDirectHTML(doc);

    // Render PDF
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });
    await page.setContent(html, { waitUntil: 'load' });
    const landscape = String(req.body?.orientation || '').toLowerCase() === 'landscape';
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true
    });
    await browser.close();

    // Email transport - use env vars
    let transporter;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Boolean(process.env.SMTP_SECURE === 'true'),
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
    } else {
      // Fallback to Ethereal for testing (avoids ECONNREFUSED on localhost)
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass }
      });
    }

    const greeting = req.body.greeting || `Dear ${doc.studentName},\n\nCongratulations! Please find your certificate attached.\n\nRegards,\n${doc.collegeName || 'Team'}`;

    if (req.body?.dryRun) {
      return res.json({
        success: true,
        message: 'Email draft generated',
        draft: {
          to: toEmail,
          subject: req.body.subject || 'Your Certificate',
          body: greeting
        }
      });
    }

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: toEmail,
      subject: req.body.subject || 'Your Certificate',
      text: greeting,
      attachments: [{ filename: `certificate-${doc._id}.pdf`, content: pdfBuffer }]
    });

    const previewUrl = nodemailer.getTestMessageUrl?.(info);
    res.json({ success: true, message: 'Email sent successfully', previewUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete certificate
router.delete("/:id", protect, async (req, res) => {
  try {
    const doc = await Certificate.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    if (doc.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });
    await doc.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
