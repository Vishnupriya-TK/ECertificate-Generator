// HTML generators mirrored from server to ensure preview matches PDF

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
		.map((f) => String(f).split(',')[0].trim().replace(/"|'|/g, ''));
	const common = Array.from(new Set(families.filter((f) => /^(Roboto|Poppins|Merriweather|Montserrat)$/i.test(f))));
	const unique = Array.from(new Set(families.filter((f) => !/^(Roboto|Poppins|Merriweather|Montserrat)$/i.test(f))));
	const all = Array.from(new Set([...common, ...unique]));
	if (all.length === 0) return '';
	const familyQuery = all.map((f) => `family=${encodeURIComponent(f)}:wght@300;400;600;700;800`).join('&');
	return `\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?${familyQuery}&display=swap" rel="stylesheet">`;
}

export function generateDirectHTML(doc) {
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
	// adaptive header (0/1/2 logos) - centers name/logo automatically
	const logosArr = (doc.logos || []).filter(Boolean).slice(0,2);
	let headerHtml = '';
	if (logosArr.length === 0) {
		headerHtml = `<div class="header" style="justify-content:center;"><div class="college-name"><div>${doc.collegeName || ''}</div></div></div>`;
	} else if (logosArr.length === 1) {
		headerHtml = `<div class="header" style="flex-direction:column; gap:8px; justify-content:center; align-items:center;"><img src="${logosArr[0]}" class="logo" /><div class="college-name"><div>${doc.collegeName || ''}</div></div></div>`;
	} else {
		headerHtml = `<div class="header"><img src="${logosArr[0]}" class="logo" /><div class="college-name"><div>${doc.collegeName || ''}</div></div><img src="${logosArr[1]}" class="logo" /></div>`;
	}

	return `
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="UTF-8">
				${fontLinks}
				<style>
					@page { size: A4; margin: 0 }
				html, body { margin: 0; padding: 0; font-family: Arial, sans-serif; background: #ffffff; overflow: hidden; }
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
${headerHtml}

						${doc.collegeDescription ? `<div class="college-desc">${doc.collegeDescription}</div>` : ''}

						${doc.customTitleImageUrl ? `<img src="${doc.customTitleImageUrl}" alt="title" class="title-image" />` : `<h2 style="font-family: ${titleStyle.fontFamily || 'inherit'}; font-size: ${titleStyle.fontSize || 48}px; line-height: ${titleStyle.lineHeight || 1.3}; width: ${titleStyle.width || 80}%; margin: ${titleStyle.marginTop || 20}px auto ${titleStyle.marginBottom || 20}px auto; text-align: ${titleStyle.align || 'center'}; font-weight: 800; color: #1e40af; letter-spacing: 0.025em;">${doc.titleOverride || (doc.eventType === 'custom' && doc.customTitleText ? `CERTIFICATE OF ${doc.customTitleText}` : 'CERTIFICATE')}</h2>`}

						<div style="width: ${introStyle.width || 80}%; margin: ${introStyle.marginTop || 10}px auto ${introStyle.marginBottom || 10}px auto; text-align: ${introStyle.align || 'center'}; font-family: ${introStyle.fontFamily || 'inherit'}; font-size: ${introStyle.fontSize || 16}px; line-height: ${introStyle.lineHeight || 1.4};">
							<span>${doc.introLeft || "This is to certify that Mr./Ms."} </span>
							<span style="font-family: ${nameStyle.fontFamily || 'inherit'}; font-size: ${Math.max(20, (nameStyle.fontSize || 44) * 0.7)}px; line-height: ${nameStyle.lineHeight || 1.3}; text-align: ${nameStyle.align || 'center'}; margin: ${nameStyle.marginTop || 15}px 0 ${nameStyle.marginBottom || 15}px 0; color: #1d4ed8; font-weight: 900;">${doc.studentName || ''}</span>
							<span> ${doc.introRight || "has participated in the event"}</span>
						</div>

						${doc.studentCollege ? `<div class="student-college">${doc.studentCollege}</div>` : ''}

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

						${doc.eventDescription ? `<div style="width: ${eventDescStyle.width || 80}%; margin: ${eventDescStyle.marginTop || 10}px auto ${eventDescStyle.marginBottom || 10}px auto; font-family: ${eventDescStyle.fontFamily || 'inherit'}; font-size: ${eventDescStyle.fontSize || 16}px; line-height: ${eventDescStyle.lineHeight || 1.4}; text-align: ${eventDescStyle.align || 'center'};">${doc.eventDescription}</div>` : ''}

						<p class="event-dates">${doc.eventName ? doc.eventName + " • " : ""}${start}${end ? " to " + end : ""}</p>

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

export function generateMinimalHTML(doc) {
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
	// adaptive header (0/1/2 logos)
	const logosArr = (doc.logos || []).filter(Boolean).slice(0,2);
	let headerHtml = '';
	if (logosArr.length === 0) {
		headerHtml = `<div class="header" style="justify-content:center;"><div class="college-name">${doc.collegeName || ''}</div></div>`;
	} else if (logosArr.length === 1) {
		headerHtml = `<div class="header" style="flex-direction:column; gap:8px; justify-content:center; align-items:center;"><img src="${logosArr[0]}" class="logo" /><div class="college-name">${doc.collegeName || ''}</div></div>`;
	} else {
		headerHtml = `<div class="header"><img src="${logosArr[0]}" class="logo" /><div class="college-name">${doc.collegeName || ''}</div><img src="${logosArr[1]}" class="logo" /></div>`;
	}
	return `
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="UTF-8">
				${fontLinks}
				<style>
					@page { size: A4; margin: 0 }
				html, body { margin: 0; padding: 0; font-family: Arial, sans-serif; background: #ffffff; overflow: hidden; }
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
					${headerHtml}

					${doc.collegeDescription ? `<div class="college-desc">${doc.collegeDescription}</div>` : ''}

					${doc.customTitleImageUrl ? `<img src="${doc.customTitleImageUrl}" alt="title" class="title-image" />` : `<h2 style="font-family: ${titleStyle.fontFamily || 'inherit'}; font-size: ${titleStyle.fontSize || 36}px; line-height: ${titleStyle.lineHeight || 1.2}; width: ${titleStyle.width || 80}%; margin: ${titleStyle.marginTop || 20}px auto ${titleStyle.marginBottom || 20}px auto; text-align: ${titleStyle.align || 'center'}; font-weight: 700; color: #1e40af;">${doc.titleOverride || (doc.eventType === 'custom' && doc.customTitleText ? `CERTIFICATE OF ${doc.customTitleText}` : 'CERTIFICATE')}</h2>`}

					<div style="width: ${introStyle.width || 80}%; margin: ${introStyle.marginTop || 10}px auto ${introStyle.marginBottom || 10}px auto; text-align: ${introStyle.align || 'center'}; font-family: ${introStyle.fontFamily || 'inherit'}; font-size: ${introStyle.fontSize || 18}px; line-height: ${introStyle.lineHeight || 1.5}; color: #374151;">
						<span>${doc.introLeft || "This is to certify that"} </span>
						<div style="font-family: ${nameStyle.fontFamily || 'inherit'}; font-size: ${nameStyle.fontSize || 32}px; line-height: ${nameStyle.lineHeight || 1.3}; text-align: ${nameStyle.align || 'center'}; margin: ${nameStyle.marginTop || 15}px 0 ${nameStyle.marginBottom || 15}px 0; color: #1d4ed8; font-weight: 800;">${doc.studentName || ''}</div>
						<span> ${doc.introRight || "has successfully completed the program"}</span>
					</div>

					${doc.studentCollege ? `<div class="student-college">${doc.studentCollege}</div>` : ''}

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

					${doc.eventDescription ? `<div style="width: ${eventDescStyle.width || 80}%; margin: ${eventDescStyle.marginTop || 15}px auto ${eventDescStyle.marginBottom || 15}px auto; font-family: ${eventDescStyle.fontFamily || 'inherit'}; font-size: ${eventDescStyle.fontSize || 18}px; line-height: ${eventDescStyle.lineHeight || 1.5}; text-align: ${eventDescStyle.align || 'center'}; color: #374151;">${doc.eventDescription}</div>` : ''}

					<p class="event-dates">${doc.eventName ? doc.eventName + " • " : ""}${start}${end ? " to " + end : ""}</p>

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

export function generateCertificateHTML(doc) {
	if (doc.templateKey === 'minimal') return generateMinimalHTML(doc);
	return generateDirectHTML(doc);
}


