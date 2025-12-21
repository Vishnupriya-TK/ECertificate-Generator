import React, { useEffect, useMemo, useRef, useState } from "react";
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

  return (
    <div className="relative w-full max-w-[900px] mx-auto shadow-2xl overflow-hidden min-h-[400px] md:min-h-[600px]" style={{ backgroundImage: item?.backgroundUrl ? `url(${item.backgroundUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="relative p-4 sm:p-6 lg:p-10 text-center">
        {/* Header with logo and college name */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0" style={{ marginBottom: (collegeStyle.marginBottom || 15) + 'px' }}>
          <div className="flex items-center gap-2 sm:gap-3">
            {(item?.logos || []).filter(Boolean).slice(0,1).map((url,idx)=> (
              <img key={idx} src={url} alt="logo-left" className="h-10 sm:h-12 lg:h-14 object-contain" />
            ))}
            <div className="text-left leading-tight" style={{ 
              fontFamily: collegeStyle.fontFamily || 'inherit',
              fontSize: Math.max(12, (collegeStyle.fontSize || 18) * 0.8) + 'px',
              lineHeight: collegeStyle.lineHeight || 1.3,
              textAlign: collegeStyle.align || 'left',
              marginTop: (collegeStyle.marginTop || 5) + 'px'
            }}>
              <div className="font-semibold">{item?.collegeName}</div>
            </div>
          </div>
          {(item?.logos || []).filter(Boolean).slice(1,2).map((url,idx)=> (
            <img key={idx} src={url} alt="logo-right" className="h-10 sm:h-12 lg:h-14 object-contain" />
          ))}
        </div>

        {/* College Description below college name */}
        {item?.collegeDescription ? (
          <div style={{ 
            fontFamily: collegeDescStyle.fontFamily || 'inherit',
            fontSize: (collegeDescStyle.fontSize || 14) + 'px',
            lineHeight: collegeDescStyle.lineHeight || 1.3,
            textAlign: collegeDescStyle.align || 'center',
            width: (collegeDescStyle.width || 80) + '%',
            margin: `${collegeDescStyle.marginTop || 5}px auto ${collegeDescStyle.marginBottom || 20}px auto`
          }}>
            {item.collegeDescription}
          </div>
        ) : null}
        
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
            fontFamily: introStyle.fontFamily || 'inherit',
            fontSize: (introStyle.fontSize || 14) + 'px',
            textAlign: introStyle.align || 'center'
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
  return (
    <div className="border-4 border-gray-900 p-12 w-[900px] mx-auto bg-white text-center rounded" style={{ backgroundImage: item?.backgroundUrl ? `url(${item.backgroundUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="flex justify-between mb-6">
        {(item?.logos || []).slice(0,3).map((url,idx)=> (<img key={idx} src={url} alt="logo" className="h-10 object-contain" />))}
      </div>
      {item?.customTitleImageUrl ? (
        <img src={item.customTitleImageUrl} alt="title" className="h-12 mx-auto" />
      ) : (
        <h2 className="text-2xl font-bold tracking-widest">{item?.titleOverride || (item?.eventType === 'custom' && item?.customTitleText ? `CERTIFICATE OF ${item.customTitleText}` : 'CERTIFICATE')}</h2>
      )}
      <p className="mt-4">{item?.bodyText || "This is to certify that"}</p>
      <input value={item?.studentName || ""} onChange={(e)=>onNameChange?.(e.target.value)} placeholder="Student Name" className="text-3xl font-extrabold mt-1 text-gray-900 text-center w-full bg-transparent outline-none" />
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
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
  }, [html]);

  const downloadPdf = async () => {
    try {
      const blob = await htmlToPdfBlob(html, orientation);
      saveAs(blob, `certificate-${item?._id || 'preview'}-${orientation}.pdf`);
    } catch (err) {
      console.error('PDF export failed', err);
      alert('Failed to generate PDF: ' + (err?.message || err));
    }
  };

  return (
    <div className="relative w-full overflow-auto">
      <div className="relative mx-auto" style={{ width: 794 }}>
        <iframe ref={iframeRef} title="certificate-preview" style={{ width: 794, height: 1123, border: 0, background: "transparent" }} />
      </div>

      <div className="mt-4 flex gap-3 justify-center items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm">Orientation:</label>
          <select value={orientation} onChange={(e)=>setOrientation(e.target.value)} className="p-1 border rounded">
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
        <button type="button" className="btn" onClick={downloadPdf}>Download as PDF</button>
      </div>
    </div>
  );
}
