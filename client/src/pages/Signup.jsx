
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import VcetLogo from "../assets/Vcet logo.jpeg";
import CseLogo from "../assets/CSE logo.jpeg";

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      alert("Registered! Please login.");
      nav("/login");
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-200 to-blue-300 animate-fadeIn pt-6">
      {/* Header with logos and college name */}
      <div className="w-full max-w-6xl flex items-center justify-between px-6 mb-16 rounded-xl shadow-md py-4">
        <img src={VcetLogo} alt="VCET Logo" className="w-20 h-20" />
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold">
            Velammal College of Engineering and Technology
          </h1>
          <p className="text-sm md:text-base font-medium">
            Department of Computer Science and Engineering
          </p>
        </div>
        <img src={CseLogo} alt="CSE Logo" className="w-20 h-20" />
      </div>
      <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent px-6 mb-16 bg-gradient-to-r from-black to-gray-900"> Welcome to the eCertificate Generator! </h1>
      {/* Form */}
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Sign Up
        </button>
        <div className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
