import React, { useState } from "react";
import API from "../utils/api";
import CertificatePreview from "../components/CertificatePreview";

export default function CreateCertificate() {
  const [college, setCollege] = useState("");
  const [collegeDescription, setCollegeDescription] = useState("");
  // simplified controls per requirements
  // eventType removed
  // Removed start/end date per requirements
  // course removed per requirements
  const [mode, setMode] = useState("single");
  const [students, setStudents] = useState([{ name: "", email: "" }]);
  const [logos, setLogos] = useState([""]); // array of logo URLs or dataURLs; first logo is used
  const [backgroundUrl, setBackgroundUrl] = useState("");
  // typography selections for each field with spacing controls
  const [titleStyle, setTitleStyle] = useState({ fontFamily: "", fontSize: 48, lineHeight: 1.3, width: 80, align: "center", marginTop: 20, marginBottom: 20 });
  const [nameStyle, setNameStyle] = useState({ fontFamily: "", fontSize: 44, lineHeight: 1.3, width: 80, align: "center", marginTop: 15, marginBottom: 15 });
  const [introStyle, setIntroStyle] = useState({ fontFamily: "", fontSize: 16, lineHeight: 1.4, width: 80, align: "center", marginTop: 10, marginBottom: 10 });
  const [eventDescStyle, setEventDescStyle] = useState({ fontFamily: "", fontSize: 16, lineHeight: 1.4, width: 80, align: "center", marginTop: 10, marginBottom: 10 });
  const [collegeStyle, setCollegeStyle] = useState({ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 18, lineHeight: 1.3, width: 80, align: "center", marginTop: 5, marginBottom: 15 });
  const [collegeDescStyle, setCollegeDescStyle] = useState({ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 14, lineHeight: 1.3, width: 80, align: "center", marginTop: 5, marginBottom: 20 });
  const [signatoryStyle, setSignatoryStyle] = useState({ fontFamily: "", fontSize: 12, lineHeight: 1.2, width: 80, align: "center", marginTop: 40, marginBottom: 10 });
  const templateKey = "classic";
  const [titleOverride, setTitleOverride] = useState("");
  const [introLeft, setIntroLeft] = useState("");
  const [introRight, setIntroRight] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [studentCollege, setStudentCollege] = useState("");
  const [signatories, setSignatories] = useState([{ name: "", designation: "", signatureUrl: "", department: "" }]);

  const handleStudentChange = (i, field, value) => {
    const arr = [...students];
    arr[i][field] = value;
    setStudents(arr);
  };

  const addStudent = () => setStudents([...students, { name: "", email: "" }]);
  const addLogo = () => setLogos([...logos, ""]);
  const addSignatory = () => setSignatories([...signatories, { name: "", designation: "", signatureUrl: "", department: "" }]);
  

  const fileToDataUrl = (file) => new Promise((resolve)=>{
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

  const handleCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const rows = text.split("\n").filter(Boolean);
      const parsed = rows.slice(1).map(r => {
        const cols = r.split(",").map(c => c.trim());
        return { name: cols[0] || "", email: cols[1] || "" };
      });
      setStudents(parsed);
    };
    reader.readAsText(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payloadStudents = students.map(s => (s.name ? { name: s.name, email: s.email } : null)).filter(Boolean);
      await API.post("/certificates/create", {
        students: payloadStudents,
        // courseName removed
        // eventName removed
        // eventType removed
        // dates removed
        collegeName: college,
        logos: logos.filter(Boolean),
        templateKey,
        titleOverride,
        backgroundUrl,
        introLeft,
        introRight,
        eventDescription,
        studentCollege,
        collegeDescription,
        signatories: signatories.filter(s=>s.name && s.designation),
        styles: { titleStyle, nameStyle, introStyle, eventDescStyle, collegeStyle, collegeDescStyle, signatoryStyle }
      });
      alert("Certificates created in DB!");
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 text-gray-900 font-poppins pt-6 overflow-x-hidden p-2 sm:p-4 lg:p-6">
      <div className="w-full lg:w-1/2 bg-white p-3 sm:p-4 lg:p-6 rounded shadow space-y-3">
        <h2 className="text-xl font-bold">Create Certificate</h2>

        <input value={college} onChange={(e)=>setCollege(e.target.value)} placeholder="College name" className="w-full p-2 border rounded" style={{ fontFamily: collegeStyle.fontFamily || 'Arial, Helvetica, sans-serif' }} />
        <textarea value={collegeDescription} onChange={(e)=>setCollegeDescription(e.target.value)} placeholder="College description (appears at top)" className="w-full p-2 border rounded" rows="2" style={{ fontFamily: collegeDescStyle.fontFamily || 'Arial, Helvetica, sans-serif' }} />
        
        {/* College Name Styling */}
        <div className="space-y-2">
          <h4 className="font-semibold">College Name Style</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1 sm:gap-2">
            <select value={collegeStyle.fontFamily} onChange={(e)=>setCollegeStyle({...collegeStyle, fontFamily: e.target.value})} className="p-2 border rounded">
              <option value="">Font</option>
              <option value="Poppins, sans-serif">Poppins</option>
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Merriweather, serif">Merriweather</option>
              <option value="Montserrat, sans-serif">Montserrat</option>
              <option value="Times New Roman, serif">Times</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Arial, Helvetica, sans-serif">Arial</option>
            </select>
            <select value={collegeStyle.fontSize} onChange={(e)=>setCollegeStyle({...collegeStyle, fontSize: Number(e.target.value)})} className="p-2 border rounded">
              {[10,12,14,16,18,20,22,24,26,28,30,32,36,40,44,48].map(n=> <option key={n} value={n}>{n}px</option>)}
            </select>
            <select value={collegeStyle.lineHeight} onChange={(e)=>setCollegeStyle({...collegeStyle, lineHeight: Number(e.target.value)})} className="p-2 border rounded">
              {[1,1.1,1.2,1.3,1.4,1.5].map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
            <select value={collegeStyle.width} onChange={(e)=>setCollegeStyle({...collegeStyle, width: Number(e.target.value)})} className="p-2 border rounded">
              {[60,70,80,90,100].map(n=> <option key={n} value={n}>{n}%</option>)}
            </select>
            <select value={collegeStyle.align} onChange={(e)=>setCollegeStyle({...collegeStyle, align: e.target.value})} className="p-2 border rounded">
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
            <select value={collegeStyle.marginTop} onChange={(e)=>setCollegeStyle({...collegeStyle, marginTop: Number(e.target.value)})} className="p-2 border rounded">
              {[0,5,10,15,20,25,30].map(n=> <option key={n} value={n}>↑{n}px</option>)}
            </select>
            <select value={collegeStyle.marginBottom} onChange={(e)=>setCollegeStyle({...collegeStyle, marginBottom: Number(e.target.value)})} className="p-2 border rounded">
              {[0,5,10,15,20,25,30].map(n=> <option key={n} value={n}>↓{n}px</option>)}
            </select>
          </div>
        </div>

        {/* College Description Styling */}
        <div className="space-y-2">
          <h4 className="font-semibold">College Description Style</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1 sm:gap-2">
            <select value={collegeDescStyle.fontFamily} onChange={(e)=>setCollegeDescStyle({...collegeDescStyle, fontFamily: e.target.value})} className="p-2 border rounded">
              <option value="">Font</option>
              <option value="Poppins, sans-serif">Poppins</option>
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Merriweather, serif">Merriweather</option>
              <option value="Montserrat, sans-serif">Montserrat</option>
              <option value="Times New Roman, serif">Times</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Arial, Helvetica, sans-serif">Arial</option>
            </select>
            <select value={collegeDescStyle.fontSize} onChange={(e)=>setCollegeDescStyle({...collegeDescStyle, fontSize: Number(e.target.value)})} className="p-2 border rounded">
              {[10,12,14,16,18,20,22,24,26,28,30,32,36,40,44,48].map(n=> <option key={n} value={n}>{n}px</option>)}
            </select>
            <select value={collegeDescStyle.lineHeight} onChange={(e)=>setCollegeDescStyle({...collegeDescStyle, lineHeight: Number(e.target.value)})} className="p-2 border rounded">
              {[1,1.1,1.2,1.3,1.4,1.5].map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
            <select value={collegeDescStyle.width} onChange={(e)=>setCollegeDescStyle({...collegeDescStyle, width: Number(e.target.value)})} className="p-2 border rounded">
              {[60,70,80,90,100].map(n=> <option key={n} value={n}>{n}%</option>)}
            </select>
            <select value={collegeDescStyle.align} onChange={(e)=>setCollegeDescStyle({...collegeDescStyle, align: e.target.value})} className="p-2 border rounded">
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
            <select value={collegeDescStyle.marginTop} onChange={(e)=>setCollegeDescStyle({...collegeDescStyle, marginTop: Number(e.target.value)})} className="p-2 border rounded">
              {[0,5,10,15,20,25,30].map(n=> <option key={n} value={n}>↑{n}px</option>)}
            </select>
            <select value={collegeDescStyle.marginBottom} onChange={(e)=>setCollegeDescStyle({...collegeDescStyle, marginBottom: Number(e.target.value)})} className="p-2 border rounded">
              {[0,5,10,15,20,25,30].map(n=> <option key={n} value={n}>↓{n}px</option>)}
            </select>
          </div>
        </div>

        {/* Title Styling */}
        <div className="space-y-2">
          <h4 className="font-semibold">Title Style</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1 sm:gap-2">
            <select value={titleStyle.fontFamily} onChange={(e)=>setTitleStyle({...titleStyle, fontFamily: e.target.value})} className="p-2 border rounded">
              <option value="">Font</option>
            <option value="Poppins, sans-serif">Poppins</option>
            <option value="Roboto, sans-serif">Roboto</option>
            <option value="Merriweather, serif">Merriweather</option>
            <option value="Montserrat, sans-serif">Montserrat</option>
              <option value="Times New Roman, serif">Times</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="Arial, Helvetica, sans-serif">Arial</option>
          </select>
            <select value={titleStyle.fontSize} onChange={(e)=>setTitleStyle({...titleStyle, fontSize: Number(e.target.value)})} className="p-2 border rounded">
              {[10,12,14,16,18,20,22,24,26,28,30,32,36,40,44,48].map(n=> <option key={n} value={n}>{n}px</option>)}
            </select>
            <select value={titleStyle.lineHeight} onChange={(e)=>setTitleStyle({...titleStyle, lineHeight: Number(e.target.value)})} className="p-2 border rounded">
              {[1,1.1,1.2,1.3,1.4,1.5].map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
            <select value={titleStyle.width} onChange={(e)=>setTitleStyle({...titleStyle, width: Number(e.target.value)})} className="p-2 border rounded">
              {[60,70,80,90,100].map(n=> <option key={n} value={n}>{n}%</option>)}
            </select>
            <select value={titleStyle.align} onChange={(e)=>setTitleStyle({...titleStyle, align: e.target.value})} className="p-2 border rounded">
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
            <select value={titleStyle.marginTop} onChange={(e)=>setTitleStyle({...titleStyle, marginTop: Number(e.target.value)})} className="p-2 border rounded">
              {[0,5,10,15,20,25,30,35,40].map(n=> <option key={n} value={n}>↑{n}px</option>)}
            </select>
            <select value={titleStyle.marginBottom} onChange={(e)=>setTitleStyle({...titleStyle, marginBottom: Number(e.target.value)})} className="p-2 border rounded">
              {[0,5,10,15,20,25,30,35,40].map(n=> <option key={n} value={n}>↓{n}px</option>)}
            </select>
          </div>
        </div>

        {/* Student Name Styling */}
        <div className="space-y-2">
          <h4 className="font-semibold">Student Name Style</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1 sm:gap-2">
            <select value={nameStyle.fontFamily} onChange={(e)=>setNameStyle({...nameStyle, fontFamily: e.target.value})} className="p-2 border rounded">
              <option value="">Font</option>
              <option value="Poppins, sans-serif">Poppins</option>
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Merriweather, serif">Merriweather</option>
              <option value="Montserrat, sans-serif">Montserrat</option>
              <option value="Times New Roman, serif">Times</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Arial, Helvetica, sans-serif">Arial</option>
            </select>
            <select value={nameStyle.fontSize} onChange={(e)=>setNameStyle({...nameStyle, fontSize: Number(e.target.value)})} className="p-2 border rounded">
              {[10,12,14,16,18,20,22,24,26,28,30,32,36,40,44,48].map(n=> <option key={n} value={n}>{n}px</option>)}
            </select>
            <select value={nameStyle.lineHeight} onChange={(e)=>setNameStyle({...nameStyle, lineHeight: Number(e.target.value)})} className="p-2 border rounded">
              {[1,1.1,1.2,1.3,1.4,1.5].map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
            <select value={nameStyle.width} onChange={(e)=>setNameStyle({...nameStyle, width: Number(e.target.value)})} className="p-2 border rounded">
              {[60,70,80,90,100].map(n=> <option key={n} value={n}>{n}%</option>)}
            </select>
            <select value={nameStyle.align} onChange={(e)=>setNameStyle({...nameStyle, align: e.target.value})} className="p-2 border rounded">
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
            <select value={nameStyle.marginTop} onChange={(e)=>setNameStyle({...nameStyle, marginTop: Number(e.target.value)})} className="p-2 border rounded">
              {[0,5,10,15,20,25,30].map(n=> <option key={n} value={n}>↑{n}px</option>)}
            </select>
            <select value={nameStyle.marginBottom} onChange={(e)=>setNameStyle({...nameStyle, marginBottom: Number(e.target.value)})} className="p-2 border rounded">
              {[0,5,10,15,20,25,30].map(n=> <option key={n} value={n}>↓{n}px</option>)}
        </select>
          </div>
        </div>

        {/* Intro Text Styling */}
          <div className="space-y-2">
          <h4 className="font-semibold">Intro Text Style</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1 sm:gap-2">
            <select value={introStyle.fontFamily} onChange={(e)=>setIntroStyle({...introStyle, fontFamily: e.target.value})} className="p-2 border rounded">
              <option value="">Font</option>
              <option value="Poppins, sans-serif">Poppins</option>
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Merriweather, serif">Merriweather</option>
              <option value="Montserrat, sans-serif">Montserrat</option>
              <option value="Times New Roman, serif">Times</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Arial, Helvetica, sans-serif">Arial</option>
            </select>
            <select value={introStyle.fontSize} onChange={(e)=>setIntroStyle({...introStyle, fontSize: Number(e.target.value)})} className="p-2 border rounded">
              {[10,12,14,16,18,20,22,24,26,28,30,32,36,40,44,48].map(n=> <option key={n} value={n}>{n}px</option>)}
            </select>
            <select value={introStyle.lineHeight} onChange={(e)=>setIntroStyle({...introStyle, lineHeight: Number(e.target.value)})} className="p-2 border rounded">
              {[1,1.1,1.2,1.3,1.4,1.5].map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
            <select value={introStyle.width} onChange={(e)=>setIntroStyle({...introStyle, width: Number(e.target.value)})} className="p-2 border rounded">
              {[60,70,80,90,100].map(n=> <option key={n} value={n}>{n}%</option>)}
            </select>
            <select value={introStyle.align} onChange={(e)=>setIntroStyle({...introStyle, align: e.target.value})} className="p-2 border rounded">
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
            <select value={introStyle.marginTop} onChange={(e)=>setIntroStyle({...introStyle, marginTop: Number(e.target.value)})} className="p-2 border rounded">
              {[0,5,10,15,20,25,30].map(n=> <option key={n} value={n}>↑{n}px</option>)}
            </select>
            <select value={introStyle.marginBottom} onChange={(e)=>setIntroStyle({...introStyle, marginBottom: Number(e.target.value)})} className="p-2 border rounded">
              {[0,5,10,15,20,25,30].map(n=> <option key={n} value={n}>↓{n}px</option>)}
            </select>
          </div>
        </div>

        {/* Event Description Styling */}
        <div className="space-y-2">
          <h4 className="font-semibold">Event Description Style</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1 sm:gap-2">
            <select value={eventDescStyle.fontFamily} onChange={(e)=>setEventDescStyle({...eventDescStyle, fontFamily: e.target.value})} className="p-2 border rounded">
              <option value="">Font</option>
              <option value="Poppins, sans-serif">Poppins</option>
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Merriweather, serif">Merriweather</option>
              <option value="Montserrat, sans-serif">Montserrat</option>
              <option value="Times New Roman, serif">Times</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Arial, Helvetica, sans-serif">Arial</option>
            </select>
            <select value={eventDescStyle.fontSize} onChange={(e)=>setEventDescStyle({...eventDescStyle, fontSize: Number(e.target.value)})} className="p-2 border rounded">
              {[10,12,14,16,18,20,22,24,26,28,30,32,36,40,44,48].map(n=> <option key={n} value={n}>{n}px</option>)}
            </select>
            <select value={eventDescStyle.lineHeight} onChange={(e)=>setEventDescStyle({...eventDescStyle, lineHeight: Number(e.target.value)})} className="p-2 border rounded">
              {[1,1.1,1.2,1.3,1.4,1.5].map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
            <select value={eventDescStyle.width} onChange={(e)=>setEventDescStyle({...eventDescStyle, width: Number(e.target.value)})} className="p-2 border rounded">
              {[60,70,80,90,100].map(n=> <option key={n} value={n}>{n}%</option>)}
            </select>
            <select value={eventDescStyle.align} onChange={(e)=>setEventDescStyle({...eventDescStyle, align: e.target.value})} className="p-2 border rounded">
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
            <select value={eventDescStyle.marginTop} onChange={(e)=>setEventDescStyle({...eventDescStyle, marginTop: Number(e.target.value)})} className="p-2 border rounded">
              {[0,5,10,15,20,25,30].map(n=> <option key={n} value={n}>↑{n}px</option>)}
            </select>
            <select value={eventDescStyle.marginBottom} onChange={(e)=>setEventDescStyle({...eventDescStyle, marginBottom: Number(e.target.value)})} className="p-2 border rounded">
              {[0,5,10,15,20,25,30].map(n=> <option key={n} value={n}>↓{n}px</option>)}
            </select>
          </div>
        </div>

        {/* Signatory Styling */}
        <div className="space-y-2">
          <h4 className="font-semibold">Signatory Style</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1 sm:gap-2">
            <select value={signatoryStyle.fontFamily} onChange={(e)=>setSignatoryStyle({...signatoryStyle, fontFamily: e.target.value})} className="p-2 border rounded">
              <option value="">Font</option>
              <option value="Poppins, sans-serif">Poppins</option>
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Merriweather, serif">Merriweather</option>
              <option value="Montserrat, sans-serif">Montserrat</option>
              <option value="Times New Roman, serif">Times</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Arial, Helvetica, sans-serif">Arial</option>
            </select>
            <select value={signatoryStyle.fontSize} onChange={(e)=>setSignatoryStyle({...signatoryStyle, fontSize: Number(e.target.value)})} className="p-2 border rounded">
              {[10,12,14,16,18,20,22,24,26,28,30,32,36,40,44,48].map(n=> <option key={n} value={n}>{n}px</option>)}
            </select>
            <select value={signatoryStyle.lineHeight} onChange={(e)=>setSignatoryStyle({...signatoryStyle, lineHeight: Number(e.target.value)})} className="p-2 border rounded">
              {[1,1.1,1.2,1.3,1.4,1.5].map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
            <select value={signatoryStyle.width} onChange={(e)=>setSignatoryStyle({...signatoryStyle, width: Number(e.target.value)})} className="p-2 border rounded">
              {[60,70,80,90,100].map(n=> <option key={n} value={n}>{n}%</option>)}
            </select>
            <select value={signatoryStyle.align} onChange={(e)=>setSignatoryStyle({...signatoryStyle, align: e.target.value})} className="p-2 border rounded">
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
            <select value={signatoryStyle.marginTop} onChange={(e)=>setSignatoryStyle({...signatoryStyle, marginTop: Number(e.target.value)})} className="p-2 border rounded">
              {[0,10,20,30,40,50,60,70,80].map(n=> <option key={n} value={n}>↑{n}px</option>)}
            </select>
            <select value={signatoryStyle.marginBottom} onChange={(e)=>setSignatoryStyle({...signatoryStyle, marginBottom: Number(e.target.value)})} className="p-2 border rounded">
              {[0,5,10,15,20,25,30].map(n=> <option key={n} value={n}>↓{n}px</option>)}
            </select>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input value={introLeft} onChange={(e)=>setIntroLeft(e.target.value)} placeholder="Intro left (e.g., This is to certify...)" className="p-2 border rounded" />
          <input value={introRight} onChange={(e)=>setIntroRight(e.target.value)} placeholder="Intro right (e.g., has participated...)" className="p-2 border rounded" />
        </div>
        <input value={eventDescription} onChange={(e)=>setEventDescription(e.target.value)} placeholder="Event description (e.g., COGNIVERSE ... dates)" className="w-full p-2 border rounded" />
        <input value={studentCollege} onChange={(e)=>setStudentCollege(e.target.value)} placeholder="Student college (optional)" className="w-full p-2 border rounded" />

        <div className="space-y-2">
          <h4 className="font-semibold">Signatories</h4>
          {signatories.map((s,i)=> (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <input value={s.name} onChange={(e)=>{ const arr=[...signatories]; arr[i].name=e.target.value; setSignatories(arr); }} placeholder="Name" className="p-2 border rounded" />
              <input value={s.designation} onChange={(e)=>{ const arr=[...signatories]; arr[i].designation=e.target.value; setSignatories(arr); }} placeholder="Designation" className="p-2 border rounded" />
              <input value={s.department || ''} onChange={(e)=>{ const arr=[...signatories]; arr[i].department=e.target.value; setSignatories(arr); }} placeholder="Department (optional)" className="p-2 border rounded" />
              {/* email and phone removed as requested */}
              <div className="flex gap-2">
                <input value={s.signatureUrl} onChange={(e)=>{ const arr=[...signatories]; arr[i].signatureUrl=e.target.value; setSignatories(arr); }} placeholder="Signature URL or upload" className="p-2 border rounded w-full" />
                <input type="file" accept="image/*" onChange={async (e)=>{ if (e.target.files?.[0]) { const data = await fileToDataUrl(e.target.files[0]); const arr=[...signatories]; arr[i].signatureUrl=data; setSignatories(arr);} }} />
              </div>
            </div>
          ))}
          <button type="button" onClick={addSignatory} className="px-3 py-1 bg-gray-200 rounded">Add Signatory</button>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Logos</h4>
          {logos.map((logo,i)=> (
            <div key={i} className="flex gap-2">
              <input value={logo} onChange={(e)=>{ const arr=[...logos]; arr[i]=e.target.value; setLogos(arr); }} placeholder="Logo URL" className="w-full p-2 border rounded" />
              <input type="file" accept="image/*" onChange={async (e)=>{ if (e.target.files?.[0]) { const data = await fileToDataUrl(e.target.files[0]); const arr=[...logos]; arr[i]=data; setLogos(arr);} }} />
            </div>
          ))}
          <button type="button" onClick={addLogo} className="px-3 py-1 bg-gray-200 rounded">Add Logo</button>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Title</h4>
          <input value={titleOverride} onChange={(e)=>setTitleOverride(e.target.value)} placeholder="Certificate title" className="w-full p-2 border rounded" />
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Template Background</h4>
          <input value={backgroundUrl} onChange={(e)=>setBackgroundUrl(e.target.value)} placeholder="Background image URL (optional)" className="w-full p-2 border rounded" />
          <input type="file" accept="image/*" onChange={async (e)=>{ if (e.target.files?.[0]) { const data = await fileToDataUrl(e.target.files[0]); setBackgroundUrl(data); } }} />
        </div>

        {/* Removed text lines and other free-form fields per requirement */}

        {/* Removed template selector - now using direct background image */}

        <div>
          <label className="mr-4"><input checked={mode==="single"} onChange={()=>setMode("single")} type="radio" /> Single</label>
          <label><input checked={mode==="multiple"} onChange={()=>setMode("multiple")} type="radio" /> Multiple (CSV)</label>
        </div>

        {mode === "single" ? (
          <>
            {students.map((s,i) => (
              <div key={i} className="space-y-2 border p-2 rounded">
                <input value={s.name} onChange={(e)=>handleStudentChange(i,"name",e.target.value)} placeholder="Student name" className="w-full p-2 border rounded" />
                <input value={s.email} onChange={(e)=>handleStudentChange(i,"email",e.target.value)} placeholder="Student email (optional)" className="w-full p-2 border rounded" />
              </div>
            ))}
            <button type="button" onClick={addStudent} className="px-3 py-1 bg-green-500 text-white rounded">Add Student</button>
          </>
        ) : (
          <div className="space-y-2">
            <a href="/template.csv" download className="inline-block px-3 py-1 bg-blue-500 text-white rounded">Download CSV Template</a>
            <input type="file" accept=".csv" onChange={handleCSV} className="p-2 border rounded" />
          </div>
        )}

        <button onClick={submit} className="w-full bg-blue-600 text-white p-2 rounded">Generate</button>
      </div>

      <div className="w-full lg:w-1/2 space-y-4">
        <h3 className="text-lg font-bold">Preview</h3>
        {students.map((s, i) => (
          <CertificatePreview key={i} item={{
            studentName: s.name || "Student Name",
            // course removed
            // event removed
            // eventType removed
            // dates removed
            collegeName: college,
            collegeDescription,
            logos,
            templateKey,
            backgroundUrl,
            titleOverride,
            introLeft,
            introRight,
            eventDescription,
            studentCollege,
            signatories,
            styles: { titleStyle, nameStyle, introStyle, eventDescStyle, collegeStyle, collegeDescStyle, signatoryStyle }
          }} onChange={(updated)=>{
            const arr = [...students];
            arr[i].name = updated.studentName;
            setStudents(arr);
          }} />
        ))}
      </div>
    </div>
  );
}
        