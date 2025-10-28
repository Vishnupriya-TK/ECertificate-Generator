

# 🏆 Ecertificate Generator

**Ecertificate Generator** is a **full-stack MERN web application** that allows users to **create, customize, and manage digital certificates** effortlessly.
It supports **individual and bulk certificate generation**, **PDF download**, and **email sharing**, all within a beautifully designed, responsive, and animated interface.

---

## 🌐 Live Demo

🚀 [https://ecertificate-generator-frontend.onrender.com/](Visit Here...)

## 🚀 Tech Stack

### 🖥️ Frontend

* **Framework:** React 19 + Vite
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
  * `Nodemailer` – Send certificates via email
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
* Choose from **Classic** and **Minimal** templates
* Real-time **preview** before saving or downloading
* Edit, delete, and manage certificates in the **Dashboard**

### 📦 PDF & File Handling

* Generate **A4-sized PDFs** using `html2canvas` & `jsPDF` (client-side)
* Backend supports **server-side rendering** with Puppeteer
* Templates are **print-optimized** and **responsive**

### 📧 Email Sharing

* Send generated certificates directly via email with attachments
* Integrated using **Nodemailer**

### 🎨 Modern UI

* **Glassmorphism-inspired** responsive design
* **Framer Motion** for fluid animations and transitions
* Intuitive, theme-friendly layout for seamless user experience

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/Ecertificate-Generator.git
cd Ecertificate-Generator
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

*(If using email features)*

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
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

* Frontend → [http://localhost:5173](http://localhost:5173)
* Backend → [http://localhost:5000](http://localhost:5000)

---

## 🧪 Sample Workflow

1. **Register or log in** to your account
2. **Create a certificate** using form inputs or **upload CSV** for bulk generation
3. **Preview** the certificate in real time
4. **Download as PDF** or **share via email**
5. **Manage** all generated certificates from the dashboard

---

## 📜 License

This project is licensed under the **MIT License**.
You are free to use, modify, and distribute it with attribution.

---

## 🧑‍💻 Author

**👩‍💻 Vishnu Priya T K**
📦 *Project:* Ecertificate Generator
📧 *Email:* [[your-email@example.com](mailto:tkvishnupriyacse@gmail.com)]
🌐 *GitHub:* [https://github.com/Vishnupriya-TK](https://github.com/Vishnupriya-TK)

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on [GitHub](https://github.com/Vishnupriya-TK/Ecertificate-Generator)!
It helps others discover the project and motivates further development 💖
