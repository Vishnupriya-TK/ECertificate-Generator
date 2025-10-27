import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateCertificate from "./pages/CreateCertificate";
import ManageCertificates from "./pages/ManageCertificates";

// Protects routes
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function AppContent() {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {user && <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} />}
      <div className="flex-1 min-h-screen bg-gray-100">
        {user && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className="block w-5 h-0.5 bg-white mb-1"></span>
              <span className="block w-5 h-0.5 bg-white mb-1"></span>
              <span className="block w-5 h-0.5 bg-white"></span>
            </div>
          </button>
        )}
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreateCertificate /></ProtectedRoute>} />
          <Route path="/manage" element={<ProtectedRoute><ManageCertificates /></ProtectedRoute>} />

          {/* Redirect unknown */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
