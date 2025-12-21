import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { htmlToPdfBlob, sendPdfToServer } from "../utils/pdf";
import { generateCertificateHTML } from "../utils/certificateHtml";
import { saveAs } from 'file-saver';

export default function ManageCertificates() {
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ studentName: '', email: '', collegeName: '', titleOverride: '', introLeft: '', introRight: '' });
  const [modalOpen, setModalOpen] = useState(false);

  const fetchList = async () => {
    try {
      const res = await API.get("/certificates");
      setList(res.data);
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  useEffect(()=> { fetchList(); }, []);

  const handleShare = async (id, orientation = 'portrait') => {
    try {
      const item = list.find(i => i._id === id);
      if (!item) return alert('Certificate not found');

      const toEmail = item.students?.[0]?.email || '';
      if (!toEmail) return alert('No recipient email found for this certificate');

      const html = generateCertificateHTML(item);
      const blob = await htmlToPdfBlob(html);

      const res = await sendPdfToServer({ certificateId: id, blob, subject: 'Your Certificate', greeting: 'Congratulations on your achievement! Please find your certificate attached.', email: toEmail, orientation });
      alert(res.message || 'Email request sent');
    } catch (err) {
      console.error('Email (client) failed', err);
      alert(err?.response?.data?.message || err.message || 'Failed to send email');
    }
  }; 

  const handleQuickEdit = (id) => {
    const item = list.find(i => i._id === id);
    if (item) {
      setEditingId(id);
      setEditData({
        studentName: item.studentName || '',
        email: item.students?.[0]?.email || '',
        collegeName: item.collegeName || '',
        titleOverride: item.titleOverride || '',
        introLeft: item.introLeft || '',
        introRight: item.introRight || ''
      });
    }
  };

  const handleEdit = (id) => {
    const item = list.find(i => i._id === id);
    if (item) {
      setEditingId(id);
      setEditData({
        studentName: item.studentName || '',
        email: item.students?.[0]?.email || '',
        collegeName: item.collegeName || '',
        titleOverride: item.titleOverride || '',
        introLeft: item.introLeft || '',
        introRight: item.introRight || ''
      });
      setModalOpen(true);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const payload = {
        studentName: editData.studentName,
        students: [{ name: editData.studentName, email: editData.email }],
        collegeName: editData.collegeName,
        titleOverride: editData.titleOverride,
        introLeft: editData.introLeft,
        introRight: editData.introRight
      };
      await API.put(`/certificates/${id}`, payload);
      setEditingId(null);
      fetchList(); // Refresh list
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({ studentName: '', email: '', collegeName: '', eventName: '', titleOverride: '', introLeft: '', introRight: '' });
    setModalOpen(false);
  };

  const handleDownload = async (id, orientation = 'portrait') => {
    try {
      const item = list.find(i => i._id === id);
      if (!item) return alert('Certificate not found');
      const html = generateCertificateHTML(item);
      const blob = await htmlToPdfBlob(html);
      saveAs(blob, `certificate-${id}-${orientation}.pdf`);
    } catch (err) {
      console.error('Client PDF download failed', err);
      alert('Download failed: ' + (err?.message || err));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this certificate?")) return;
    try {
      await API.delete(`/certificates/${id}`);
      setList(l => l.filter(i => i._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-gray-900 font-poppins pt-6 overflow-x-hidden p-6">
      <div className="w-full max-w-6xl bg-white/60 backdrop-blur-lg rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Manage Certificates</h2>
        {modalOpen && (
          <FullEditModal
            item={list.find(i=>i._id===editingId) || {}}
            onClose={handleCancelEdit}
            onSaved={()=>{ setModalOpen(false); setEditingId(null); fetchList(); }}
          />
        )}
        <table className="w-full border-collapse">
          <thead><tr className="bg-gray-200"><th className="p-2 border">Name</th><th className="p-2 border">Email</th><th className="p-2 border">College</th><th className="p-2 border">Actions</th></tr></thead>
          <tbody>
            {list.map(item => (
              <tr key={item._id} className="text-center">
                <td className="p-2 border">
                  {editingId === item._id ? (
                    <input
                      value={editData.studentName}
                      onChange={(e) => setEditData({ ...editData, studentName: e.target.value })}
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    item.studentName
                  )}
                </td>
                <td className="p-2 border">
                  {editingId === item._id ? (
                    <input
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full p-1 border rounded"
                      placeholder="Email"
                    />
                  ) : (
                    item.students?.[0]?.email || ''
                  )}
                </td>
                <td className="p-2 border">
                  {editingId === item._id ? (
                    <input
                      value={editData.collegeName}
                      onChange={(e) => setEditData({ ...editData, collegeName: e.target.value })}
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    item.collegeName
                  )}
                </td>
                {editingId === item._id && (
                  <td className="p-2 border" colSpan={2}>
                    <div className="grid grid-cols-2 gap-2">
                      <input value={editData.titleOverride} onChange={(e)=>setEditData({ ...editData, titleOverride: e.target.value })} placeholder="Title override" className="p-1 border rounded" />
                      <input value={editData.introLeft} onChange={(e)=>setEditData({ ...editData, introLeft: e.target.value })} placeholder="Intro left" className="p-1 border rounded" />
                      <input value={editData.introRight} onChange={(e)=>setEditData({ ...editData, introRight: e.target.value })} placeholder="Intro right" className="p-1 border rounded" />
                    </div>
                  </td>
                )}
                <td className="p-2 border align-top">
                  <div className="grid grid-cols-2 gap-1">
                    {/* <button onClick={()=>handleShare(item._id, 'mailto', 'portrait')} className="bg-teal-500 text-white px-2 py-1 rounded">Mail</button> */}
                    <button onClick={()=>handleShare(item._id, 'portrait')} className="bg-teal-500 text-white px-2 py-1 rounded">Mail</button>
                    <button onClick={()=>handleDownload(item._id, 'portrait')} className="bg-purple-600 text-white px-2 py-1 rounded">Download</button>
                    {editingId === item._id ? (
                      <>
                        <button onClick={()=>handleUpdate(item._id)} className="bg-green-500 text-white px-2 py-1 rounded col-span-2">Save</button>
                        <button onClick={handleCancelEdit} className="bg-gray-500 text-white px-2 py-1 rounded col-span-2">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={()=>handleQuickEdit(item._id)} className="bg-yellow-500 text-white px-2 py-1 rounded">Quick Edit</button>
                        <button onClick={()=>handleEdit(item._id)} className="bg-indigo-500 text-white px-2 py-1 rounded">Full Edit</button>
                      </>
                    )}
                    <button onClick={()=>handleDelete(item._id)} className="bg-red-500 text-white px-2 py-1 rounded col-span-2">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FullEditModal({ item, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    studentName: item.studentName || '',
    email: item.students?.[0]?.email || '',
    collegeName: item.collegeName || '',
    collegeDescription: item.collegeDescription || '',
    // eventType removed
    titleOverride: item.titleOverride || '',
    introLeft: item.introLeft || '',
    introRight: item.introRight || '',
    eventDescription: item.eventDescription || '',
    studentCollege: item.studentCollege || '',
    templateKey: item.templateKey || 'classic',
    backgroundUrl: item.backgroundUrl || '',
    logos: item.logos || [],
    signatories: item.signatories || [{ name:'', designation:'', signatureUrl:'' }]
  }));

  const fileToDataUrl = (file) => new Promise((resolve)=>{ const r=new FileReader(); r.onload=()=>resolve(r.result); r.readAsDataURL(file); });

  const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    try {
      const payload = {
        studentName: form.studentName,
        students: [{ name: form.studentName, email: form.email }],
        collegeName: form.collegeName,
        collegeDescription: form.collegeDescription,
        // eventType removed
        titleOverride: form.titleOverride,
        introLeft: form.introLeft,
        introRight: form.introRight,
        eventDescription: form.eventDescription,
        studentCollege: form.studentCollege,
        templateKey: form.templateKey || 'classic',
        backgroundUrl: form.backgroundUrl,
        logos: form.logos,
        signatories: form.signatories
      };
      await API.put(`/certificates/${item._id}`, payload);
      onSaved?.();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-12">
      <div className="bg-white w-[98vw] max-w-5xl max-h-[85vh] overflow-y-auto overflow-x-hidden rounded shadow-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold">Edit Certificate</h3>
          <button onClick={onClose} className="px-2 py-1 bg-gray-200 rounded">Close</button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="p-2 border rounded" value={form.studentName} onChange={(e)=>updateField('studentName', e.target.value)} placeholder="Student name" />
          <input className="p-2 border rounded" value={form.email} onChange={(e)=>updateField('email', e.target.value)} placeholder="Email" />

          <input className="p-2 border rounded" value={form.collegeName} onChange={(e)=>updateField('collegeName', e.target.value)} placeholder="College name" />
          <input className="p-2 border rounded" value={form.collegeDescription} onChange={(e)=>updateField('collegeDescription', e.target.value)} placeholder="College description" />
          <input className="p-2 border rounded" value={form.titleOverride} onChange={(e)=>updateField('titleOverride', e.target.value)} placeholder="Title" />
          {/* eventType selection removed */}

          <input className="p-2 border rounded" value={form.introLeft} onChange={(e)=>updateField('introLeft', e.target.value)} placeholder="Intro left (e.g., This is to certify...)" />
          <input className="p-2 border rounded" value={form.introRight} onChange={(e)=>updateField('introRight', e.target.value)} placeholder="Intro right (e.g., has participated...)" />

          <input className="p-2 border rounded" value={form.eventDescription} onChange={(e)=>updateField('eventDescription', e.target.value)} placeholder="Description (optional)" />
          <input className="p-2 border rounded" value={form.studentCollege} onChange={(e)=>updateField('studentCollege', e.target.value)} placeholder="Student college (optional)" />

          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            <input className="p-2 border rounded" value={form.backgroundUrl} onChange={(e)=>updateField('backgroundUrl', e.target.value)} placeholder="Background URL" />
            <input type="file" accept="image/*" onChange={async (e)=>{ if(e.target.files?.[0]) updateField('backgroundUrl', await fileToDataUrl(e.target.files[0])); }} />
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold mb-1">Logos</h4>
            {form.logos.map((logo, i)=> (
              <div key={i} className="flex gap-2 mb-1">
                <input className="p-2 border rounded w-full" value={logo} onChange={(e)=>{
                  const arr=[...form.logos]; arr[i]=e.target.value; updateField('logos', arr);
                }} placeholder="Logo URL" />
                <input type="file" accept="image/*" onChange={async (e)=>{ if(e.target.files?.[0]){ const data=await fileToDataUrl(e.target.files[0]); const arr=[...form.logos]; arr[i]=data; updateField('logos', arr);} }} />
              </div>
            ))}
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={()=>updateField('logos', [...form.logos, ''])}>Add Logo</button>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold mb-1">Signatories</h4>
            {form.signatories.map((s, i)=> (
              <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 p-2 border rounded">
                <input className="p-2 border rounded" value={s.name || ''} onChange={(e)=>{ const arr=[...form.signatories]; arr[i]={...arr[i], name:e.target.value}; updateField('signatories', arr); }} placeholder="Name" />
                <input className="p-2 border rounded" value={s.designation || ''} onChange={(e)=>{ const arr=[...form.signatories]; arr[i]={...arr[i], designation:e.target.value}; updateField('signatories', arr); }} placeholder="Designation" />
                <input className="p-2 border rounded" value={s.department || ''} onChange={(e)=>{ const arr=[...form.signatories]; arr[i]={...arr[i], department:e.target.value}; updateField('signatories', arr); }} placeholder="Department (optional)" />

                <input className="p-2 border rounded" value={s.email || ''} onChange={(e)=>{ const arr=[...form.signatories]; arr[i]={...arr[i], email:e.target.value}; updateField('signatories', arr); }} placeholder="Email (optional)" />
                <input className="p-2 border rounded" value={s.phone || ''} onChange={(e)=>{ const arr=[...form.signatories]; arr[i]={...arr[i], phone:e.target.value}; updateField('signatories', arr); }} placeholder="Phone (optional)" />
                <div className="flex gap-2">
                  <input className="p-2 border rounded w-full" value={s.signatureUrl || ''} onChange={(e)=>{ const arr=[...form.signatories]; arr[i]={...arr[i], signatureUrl:e.target.value}; updateField('signatories', arr); }} placeholder="Signature URL" />
                  <input type="file" accept="image/*" onChange={async (e)=>{ if(e.target.files?.[0]){ const data=await fileToDataUrl(e.target.files[0]); const arr=[...form.signatories]; arr[i]={...arr[i], signatureUrl:data}; updateField('signatories', arr); } }} />
                </div>
              </div>
            ))}
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={()=>updateField('signatories', [...form.signatories, { name:'', designation:'', signatureUrl:'' }])}>Add Signatory</button>
          </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={handleSave} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
          <button onClick={onClose} className="px-3 py-1 bg-gray-500 text-white rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}
