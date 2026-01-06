# 🏆 Ecertificate Generator

**Ecertificate Generator** is a **full-stack MERN web application** that allows users to **create, customize, and manage digital certificates** effortlessly.
It supports **individual and bulk certificate generation**, **PDF download**, and **email sharing**, all within a beautifully designed, responsive, and animated interface.

---

## 🌐 Live Demo

🚀 **Live Site:** [Visit Here](https://ecertificate-generator-frontend.onrender.com/)

---

## 🚀 Tech Stack

### 🖥️ Frontend

* **Framework:** React + Vite
* **Styling:** Tailwind CSS + Framer Motion
* **Routing:** React Router DOM
* **HTTP Client:** Axios
* **Utilities:**

  * `html2canvas` & `jsPDF` – Convert certificates to downloadable PDFs
  * `PapaParse` – Process CSV uploads for bulk creation
  * `file-saver` – Handle client-side file downloads

### ⚙️ Backend

* **Framework:** Node.js + Express
* **Database:** MongoDB (via Mongoose)
* **Authentication:** JWT + bcrypt
* **Key Libraries:**

  * `Puppeteer` – Generate PDFs server-side
  * `Multer` – Handle CSV and file uploads

---

## 🧱 Architecture Overview

```
client/                 → React (Vite) Frontend
 ├── src/
 │   ├── pages/          → Login, Signup, Dashboard, Create & Manage Certificates
 │   ├── components/     → AuthForm, Sidebar, CertificateForm, CertificatePreview
 │   ├── context/        → AuthContext for authentication state
 │   ├── utils/          → API helpers, certificate HTML generation
 │   └── assets/         → Fonts, logos, and icons
 └── .env                → Frontend environment variables

server/                 → Express.js Backend
 ├── model/              → Mongoose Schemas (User, Certificate)
 ├── routes/             → Auth & Certificate routes
 ├── middleware/         → JWT protection, error handling
 └── server.js           → Entry point
 └── .env                → Backend environment variables
```

---

## 🧩 Key Features

### 👤 User Authentication

* Secure **JWT-based** login and signup
* Passwords encrypted using **bcrypt**
* **AuthContext** ensures persistent login state across sessions

### 🧾 Certificate Management

* Create certificates via **form** or **CSV bulk upload**
* Real-time **preview** before saving or downloading
* Edit, delete, and manage certificates in the **Dashboard**

### 📦 PDF & File Handling

* Generate **A4-sized PDFs** using `html2canvas` & `jsPDF` (client-side)
* Backend supports **server-side rendering** with Puppeteer
* Templates are **print-optimized** and **responsive**

### 🎨 Modern UI

* **Glassmorphism-inspired** responsive design
* **Framer Motion** for smooth animations and transitions
* Intuitive, **theme-friendly** layout for a seamless user experience

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Vishnupriya-TK/ECertificate-Generator.git
cd ECertificate-Generator
```

### 2️⃣ Install Dependencies

#### Client

```bash
cd client
npm install
```

#### Server

```bash
cd ../server
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file inside the **server** directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```


---

## ▶️ Running the App

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend:** [http://localhost:5000](http://localhost:5000)

---

## 🧪 Sample Workflow

1. **Register or log in** to your account
2. **Create a certificate** using form inputs or **upload CSV** for bulk generation
3. **Preview** the certificate in real time
4. **Download as PDF** or **share via email**
5. **Manage** all generated certificates from the dashboard

---

## 🧑‍💻 Author

**👩‍💻 Vishnu Priya T K**
📦 *Project:* Ecertificate Generator
📧 *Email:* [tkvishnupriyacse@gmail.com](mailto:tkvishnupriyacse@gmail.com)
🌐 *GitHub:* [https://github.com/Vishnupriya-TK](https://github.com/Vishnupriya-TK)

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on [GitHub](https://github.com/Vishnupriya-TK/Ecertificate-Generator)!
It helps others discover the project and motivates further development 💖
