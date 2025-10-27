import { useState } from "react";
import axios from "axios";

export default function CertificateForm() {
  const [form, setForm] = useState({
    students: [],
    eventName: "",
    description: "",
    collegeName: "",
    collegeLogo: "",
    collegeAddress: "",
    signatories: [],
    templateKey: "classic",
    styles: {
      collegeStyle: { fontFamily: "Arial", fontSize: 18, align: "left", marginTop: 5, marginBottom: 15, lineHeight: 1.3 },
      collegeDescStyle: { fontFamily: "Arial", fontSize: 14, align: "center", width: 80, marginTop: 5, marginBottom: 20, lineHeight: 1.3 },
      titleStyle: { fontFamily: "Arial", fontSize: 48, align: "center", width: 80, marginTop: 20, marginBottom: 20, lineHeight: 1.3 },
      nameStyle: { fontFamily: "Arial", fontSize: 44, align: "center", marginTop: 15, marginBottom: 15, lineHeight: 1.3 },
      introStyle: { fontFamily: "Arial", fontSize: 16, align: "center", width: 80, marginTop: 10, marginBottom: 10, lineHeight: 1.4 },
      eventDescStyle: { fontFamily: "Arial", fontSize: 16, align: "center", width: 80, marginTop: 10, marginBottom: 10, lineHeight: 1.4 },
      signatoryStyle: { fontFamily: "Arial", fontSize: 12, align: "center", width: 80, marginTop: 40, marginBottom: 10, lineHeight: 1.2 }
    }
  });

  const addStudent = () => {
    setForm({ ...form, students: [...form.students, { name: "", course: "", position: "" }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post("http://localhost:5000/api/certificates/create", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Certificate Created!");
      console.log(data);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Certificate</h2>
      <input placeholder="Event Name" onChange={(e) => setForm({ ...form, eventName: e.target.value })} />
      <input placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input placeholder="College Name" onChange={(e) => setForm({ ...form, collegeName: e.target.value })} />
      <input placeholder="College Logo URL" onChange={(e) => setForm({ ...form, collegeLogo: e.target.value })} />
      <input placeholder="College Address" onChange={(e) => setForm({ ...form, collegeAddress: e.target.value })} />

      <h3>Students</h3>
      {form.students.map((s, i) => (
        <div key={i}>
          <input placeholder="Name" onChange={(e) => { const students=[...form.students]; students[i].name=e.target.value; setForm({...form,students}); }} />
          <input placeholder="Course" onChange={(e) => { const students=[...form.students]; students[i].course=e.target.value; setForm({...form,students}); }} />
          <input placeholder="Position" onChange={(e) => { const students=[...form.students]; students[i].position=e.target.value; setForm({...form,students}); }} />
        </div>
      ))}
      <button type="button" onClick={addStudent}>+ Add Student</button>

      <button type="submit">Create Certificate</button>
    </form>
  );
}
