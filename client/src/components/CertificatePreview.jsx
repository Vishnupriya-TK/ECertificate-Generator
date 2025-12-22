import React, { useEffect, useMemo, useRef } from "react";
import { generateCertificateHTML } from "../utils/certificateHtml";
import { htmlToPdfBlob } from "../utils/pdf";
import { saveAs } from 'file-saver';

function DirectTemplate({ item, start, end, onNameChange }) {
  const styles = item?.styles || {};
  const collegeStyle = styles.collegeStyle || {};
  const collegeDescStyle = styles.collegeDescStyle || {};
  const titleStyle = styles.titleStyle || {};
  const nameStyle = styles.nameStyle || {};
  const introStyle = styles.introStyle || {};
  const eventDescStyle = styles.eventDescStyle || {};
  const signatoryStyle = styles.signatoryStyle || {};
  const studentCollegeStyle = styles.studentCollegeStyle || {};
  const logos = (item?.logos || []).filter(Boolean);

  return (
    <div className="relative mx-auto shadow-2xl overflow-hidden" style={{ width: '794px', height: '1000px', backgroundImage: item?.backgroundUrl ? `url(${item.backgroundUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', boxSizing: 'border-box' }}>
      <div className="relative p-4 sm:p-6 lg:p-10 text-center" style={{ width: '100%', height: '100%' }}>
        {/* Header with logo and college name (3-column) */}
        <div className="flex items-center" style={{ marginBottom: (collegeStyle.marginBottom || 15) + 'px', justifyContent: logos.length === 1 ? 'flex-start' : 'space-between' }}>
          {(() => {
            const l = (item?.logos || []).filter(Boolean);
            return (
              <>
                <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {l[0] ? <img src={l[0]} alt="logo-left" className="h-10 sm:h-12 lg:h-14 object-contain" /> : null}
                </div>
                <div className="header-center" style={{ flex: 1, textAlign: logos.length === 1 ? 'left' : (collegeStyle.align || 'center'), marginLeft: 8, marginRight: 8 }}>
                  <div className="font-semibold" style={{ fontFamily: collegeStyle.fontFamily || 'inherit', fontSize: Math.max(12, (collegeStyle.fontSize || 18) * 0.8) + 'px', lineHeight: collegeStyle.lineHeight || 1.3, marginTop: (collegeStyle.marginTop || 5) + 'px' }}>{item?.collegeName}</div>
                  {item?.collegeDescription ? <div style={{ fontFamily: collegeDescStyle.fontFamily || 'inherit', fontSize: (collegeDescStyle.fontSize || 14) + 'px', lineHeight: collegeDescStyle.lineHeight || 1.3, marginTop: (collegeDescStyle.marginTop || 5) + 'px' }}>{item.collegeDescription}</div> : null}
                </div>
                <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {l[1] ? <img src={l[1]} alt="logo-right" className="h-10 sm:h-12 lg:h-14 object-contain" /> : null}
                </div>
              </>
            );
          })()}
        </div>

        
        {/* Title */}
        <h2 className="font-extrabold tracking-wide text-blue-900" style={{ 
          fontFamily: titleStyle.fontFamily || 'inherit',
          fontSize: (titleStyle.fontSize || 48) + 'px', 
          lineHeight: titleStyle.lineHeight || 1.3, 
          width: (titleStyle.width || 80) + '%', 
          margin: `${titleStyle.marginTop || 20}px auto ${titleStyle.marginBottom || 20}px auto`,
          textAlign: titleStyle.align || 'center'
        }}>
          {item?.titleOverride || "CERTIFICATE"}
        </h2>
        
        {/* Intro line with student name in between */}
        <div style={{ 
          width: (introStyle.width || 80) + '%', 
          margin: `${introStyle.marginTop || 10}px auto ${introStyle.marginBottom || 10}px auto`,
          textAlign: introStyle.align || 'center',
          fontFamily: introStyle.fontFamily || 'inherit',
          fontSize: (introStyle.fontSize || 16) + 'px',
          lineHeight: introStyle.lineHeight || 1.4
        }}>
          <span>{item?.introLeft || "This is to certify that Mr./Ms."} </span>
            <input 
            value={item?.studentName || ""} 
            onChange={(e)=>onNameChange?.(e.target.value)} 
            placeholder="Student Name" 
            className="text-blue-700 bg-transparent outline-none font-black inline w-full sm:w-auto" 
            style={{ 
              fontFamily: nameStyle.fontFamily || 'inherit',
              fontSize: Math.max(20, (nameStyle.fontSize || 44) * 0.7) + 'px', 
              lineHeight: nameStyle.lineHeight || 1.3, 
              minWidth: '200px',
              textAlign: nameStyle.align || 'center',
              margin: `${nameStyle.marginTop || 15}px 0 ${nameStyle.marginBottom || 15}px 0`
            }} 
          />
          <span> {item?.introRight || "has participated in the event"}</span>
        </div>
        
        {/* Student College */}
        {item?.studentCollege ? (
          <div className="mt-1" style={{ 
            fontFamily: studentCollegeStyle.fontFamily || introStyle.fontFamily || 'inherit',
            fontSize: (studentCollegeStyle.fontSize || introStyle.fontSize || 14) + 'px',
            textAlign: studentCollegeStyle.align || introStyle.align || 'center',
            marginTop: (studentCollegeStyle.marginTop || 4) + 'px'
          }}>
            {item.studentCollege}
          </div>
        ) : null}
        
        {/* Event Description */}
        {item?.eventDescription ? (
          <div style={{ 
            width: (eventDescStyle.width || 80) + '%', 
            margin: `${eventDescStyle.marginTop || 10}px auto ${eventDescStyle.marginBottom || 10}px auto`,
            fontFamily: eventDescStyle.fontFamily || 'inherit',
            fontSize: (eventDescStyle.fontSize || 16) + 'px',
            lineHeight: eventDescStyle.lineHeight || 1.4,
            textAlign: eventDescStyle.align || 'center'
          }}>
            {item.eventDescription}
          </div>
        ) : null}
        
        {/* Event Name and Dates */}
        <p style={{ 
          fontFamily: introStyle.fontFamily || 'inherit',
          fontSize: (introStyle.fontSize || 16) + 'px',
          textAlign: introStyle.align || 'center',
          margin: '10px 0'
        }}>
          {item?.eventName ? item.eventName + " • " : ""}{start}{end ? " to " + end : ""}
        </p>
        
        {/* Signatories row */}
        {Array.isArray(item?.signatories) && item.signatories.length > 0 ? (
          <div className="grid grid-cols-2 gap-10 items-end" style={{ 
            width: (signatoryStyle.width || 80) + '%', 
            margin: `${signatoryStyle.marginTop || 40}px auto ${signatoryStyle.marginBottom || 10}px auto`
          }}>
            {item.signatories.slice(0,4).map((s,idx)=> (
              <div key={idx} className="text-center">
                {s?.signatureUrl ? <img src={s.signatureUrl} alt="signature" className="h-10 mx-auto" /> : <div className="h-10" />}
                <p className="border-t border-gray-600 mt-2 pt-1 font-semibold" style={{ 
                  fontFamily: signatoryStyle.fontFamily || 'inherit',
                  fontSize: (signatoryStyle.fontSize || 12) + 'px',
                  lineHeight: signatoryStyle.lineHeight || 1.2,
                  textAlign: signatoryStyle.align || 'center'
                }}>
                  {s?.name || "Signatory"}
                </p>
                <p className="text-gray-600" style={{
                  fontFamily: signatoryStyle.fontFamily || 'inherit',
                  fontSize: ((signatoryStyle.fontSize || 12) - 2) + 'px',
                  textAlign: signatoryStyle.align || 'center'
                }}>
                  {s?.designation || "Designation"}{s?.department ? `, ${s.department}` : ''}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Minimal variant with solid border
function MinimalTemplate({ item, start, end, onNameChange }) {
  const styles = item?.styles || {};
  const collegeStyle = styles.collegeStyle || {};
  const collegeDescStyle = styles.collegeDescStyle || {};
  const studentCollegeStyle = styles.studentCollegeStyle || {};

  return (
    <div className="border-4 border-gray-900 p-8 mx-auto bg-white text-center rounded" style={{ width: '794px', height: '1000px', backgroundImage: item?.backgroundUrl ? `url(${item.backgroundUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', boxSizing: 'border-box' }}>
      <div className="flex items-center mb-6" style={{ justifyContent: (item?.logos || []).filter(Boolean).length === 1 ? 'flex-start' : 'space-between' }}>
        {(() => {
          const l = (item?.logos || []).filter(Boolean);
          return (
            <>
              <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {l[0] ? <img src={l[0]} alt="logo-left" className="h-10 object-contain" /> : null}
              </div>
              <div className="header-center" style={{ flex: 1, textAlign: collegeStyle.align || 'center', marginLeft: 8, marginRight: 8 }}>
                <div className="font-semibold" style={{ fontFamily: collegeStyle.fontFamily || 'inherit', fontSize: (collegeStyle.fontSize || 18) + 'px' }}>{item?.collegeName}</div>
                {item?.collegeDescription ? <div style={{ fontFamily: collegeDescStyle.fontFamily || 'inherit', fontSize: (collegeDescStyle.fontSize || 14) + 'px' }}>{item.collegeDescription}</div> : null}
              </div>
              <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {l[1] ? <img src={l[1]} alt="logo-right" className="h-10 object-contain" /> : null}
              </div>
            </>
          );
        })()}
      </div>
      {item?.customTitleImageUrl ? (
        <img src={item.customTitleImageUrl} alt="title" className="h-12 mx-auto" />
      ) : (
        <h2 className="text-2xl font-bold tracking-widest">{item?.titleOverride || (item?.eventType === 'custom' && item?.customTitleText ? `CERTIFICATE OF ${item.customTitleText}` : 'CERTIFICATE')}</h2>
      )}
      <p className="mt-4">{item?.bodyText || "This is to certify that"}</p>
      <input value={item?.studentName || ""} onChange={(e)=>onNameChange?.(e.target.value)} placeholder="Student Name" className="text-3xl font-extrabold mt-1 text-gray-900 text-center w-full bg-transparent outline-none" />
      {item?.studentCollege ? (
        <div style={{ fontFamily: studentCollegeStyle.fontFamily || 'inherit', fontSize: (studentCollegeStyle.fontSize || 16) + 'px', textAlign: studentCollegeStyle.align || 'center', marginTop: (studentCollegeStyle.marginTop || 8) + 'px' }}>{item.studentCollege}</div>
      ) : null}
      {(item?.textBlocks || []).map((b, idx)=> {
        const style = {
          textAlign: b.align || 'left',
          fontWeight: b.bold ? 700 : 400,
          textDecoration: b.underline ? 'underline' : 'none',
          fontSize: b.fontSize ? `${b.fontSize}px` : undefined,
          lineHeight: b.lineHeight ? `${b.lineHeight}` : undefined,
          width: b.width ? `${b.width}%` : undefined,
          marginLeft: b.align === 'left' ? '0' : 'auto',
          marginRight: b.align === 'right' ? '0' : 'auto',
          fontFamily: b.fontFamily || item?.fontFamily
        };
        return (
          <p key={idx} className="mt-2" style={style}>
            {b.label} {b.value && <span>{b.value}</span>}
          </p>
        );
      })}
      <p className="mt-2">{item?.eventName} {start}{end ? ` - ${end}` : ""}</p>
      <div className="mt-10 grid grid-cols-2 gap-6">
        {(item?.signatories || []).slice(0,4).map((s,idx)=> (
          <div key={idx} className="text-center">
            <div className="h-10">{s?.signatureUrl ? <img src={s.signatureUrl} className="h-10 mx-auto" /> : null}</div>
            <div className="border-t mt-2 pt-1 font-semibold">{s?.name}</div>
            <div className="text-xs">{s?.designation || "Designation"}{s?.department ? `, ${s.department}` : ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TEMPLATE_MAP = {
  classic: DirectTemplate,
  minimal: MinimalTemplate,
  elegant: DirectTemplate,
  modern: DirectTemplate,
  ribbon: DirectTemplate,
  royal: DirectTemplate,
  slate: DirectTemplate,
  ocean: DirectTemplate,
  sunset: DirectTemplate,
  bold: DirectTemplate
};

export default function CertificatePreview({ item, onChange }) {
  // Keep input binding for name editing via overlay, but render iframe with server-matched HTML
  const iframeRef = useRef(null);
  const html = useMemo(() => generateCertificateHTML(item || {}), [item]);

  // fixed portrait preview dims (landscape support removed)
  const previewDims = { width: 794, height: 1000 };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Prepare HTML to write into iframe
    let htmlToWrite = html;

    // Always center the certificate for preview (no landscape behavior)
    const centerStyle = `\n<style> body{display:flex;align-items:center;justify-content:center;background:#ffffff;margin:0;padding:0;} .certificate{margin:0;} </style>\n`;
    if (htmlToWrite.includes('</head>')) htmlToWrite = htmlToWrite.replace('</head>', `${centerStyle}</head>`);
    else htmlToWrite = centerStyle + htmlToWrite;

    doc.open();
    doc.write(htmlToWrite);
    doc.close();
  }, [html]);

  const downloadPdf = async () => {
    try {
      const blob = await htmlToPdfBlob(html);
      saveAs(blob, `certificate-${item?._id || 'preview'}-portrait.pdf`);
    } catch (err) {
      console.error('PDF export failed', err);
      alert('Failed to generate PDF: ' + (err?.message || err));
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative mx-auto" style={{ width: previewDims.width }}>
        <iframe
          ref={iframeRef}
          title="certificate-preview"
          style={{
            width: previewDims.width + 'px',
            height: previewDims.height + 'px',
            border: 0,
            background: 'transparent',
            display: 'block'
          }}
        />
      </div>

      <div className="mt-4 flex justify-center">
        <button type="button" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow" onClick={downloadPdf}>Download PDF</button>
      </div>

      <div className="mt-2 flex justify-center">
        <input value={item?.studentName || ''} onChange={(e)=>onChange?.({ studentName: e.target.value })} placeholder="Edit Student Name" className="p-2 border rounded w-64" />
      </div>
    </div>
  );
}
