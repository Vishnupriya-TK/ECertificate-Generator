import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar({ isOpen, setOpen }) {
  const loc = useLocation();
  const { logout } = useContext(AuthContext);

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setOpen(false)}></div>}
      <aside className={`w-64 bg-gray-800 text-white min-h-screen p-4 flex-col justify-between fixed md:static top-0 left-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 md:block`}>
        <div>
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
          <ul className="space-y-3">
            <li><Link className={`block px-4 py-2 rounded ${loc.pathname === "/" ? "bg-gray-700" : "hover:bg-gray-700"}`} to="/" onClick={handleLinkClick}>Dashboard</Link></li>
            <li><Link className={`block px-4 py-2 rounded ${loc.pathname === "/create" ? "bg-gray-700" : "hover:bg-gray-700"}`} to="/create" onClick={handleLinkClick}>Create Certificate</Link></li>
            <li><Link className={`block px-4 py-2 rounded ${loc.pathname === "/manage" ? "bg-gray-700" : "hover:bg-gray-700"}`} to="/manage" onClick={handleLinkClick}>Manage Certificates</Link></li>
          </ul>
        </div>
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-2 rounded w-full mt-4">Logout</button>
      </aside>
    </>
  );
}
