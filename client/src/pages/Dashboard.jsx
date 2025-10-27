import React from "react";
import { motion } from "framer-motion";
import VcetLogo from "../assets/Vcet logo.jpeg";
import CseLogo from "../assets/CSE logo.jpeg";

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-gray-900 font-poppins pt-6 overflow-x-hidden">
      
      {/* Header */}
      <div className="w-full max-w-6xl flex items-center justify-between px-6 mb-8 bg-white/60 backdrop-blur-lg rounded-xl shadow-md py-4">
        <img
          src={VcetLogo}
          alt="VCET Logo"
          className="w-20 h-20 object-contain"
        />
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
            Velammal College of Engineering and Technology
          </h1>
          <p className="text-sm md:text-base font-medium text-gray-700">
            Department of Computer Science and Engineering
          </p>
        </div>
        <img
          src={CseLogo}
          alt="CSE Logo"
          className="w-20 h-20 object-contain"
        />
      </div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-6 text-center"
      >
        E-Certificate Generation System
      </motion.h1>

      {/* Intro Section */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="max-w-5xl text-lg text-gray-800 text-center mb-10 px-6 leading-relaxed"
      >
        At <span className="font-semibold text-blue-700">Velammal College of Engineering and Technology (VCET), Madurai</span>,
        the <span className="font-semibold text-blue-700">E-Certificate Generation System</span> is a digital initiative designed to
        simplify and automate certificate management for both individual students and large batches.
        This platform ensures secure generation, verification, and distribution of digital certificates,
        streamlining academic recognition while promoting sustainability.
      </motion.p>

      {/* Vision, Mission, and Achievements Section */}
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-10 px-10 pb-16 w-full max-w-6xl">
        
        {/* Vision Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex-1 bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300"
        >
          <h3 className="text-3xl font-bold text-blue-700 mb-4">Vision</h3>
          <p className="text-lg text-gray-700 leading-relaxed">
            To establish a seamless, reliable, and globally recognized platform for
            digital certification that enhances transparency, efficiency, and trust in
            academic credentialing.
          </p>
        </motion.div>

        {/* Mission Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="flex-1 bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300"
        >
          <h3 className="text-3xl font-bold text-blue-700 mb-4">Mission</h3>
          <p className="text-lg text-gray-700 leading-relaxed">
            To revolutionize the process of issuing and managing academic certificates
            through automation and secure digital solutions, ensuring transparency,
            efficiency, and reliability in every stage of certification.
          </p>
        </motion.div>

        {/* Key Achievements Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.4 }}
          className="flex-1 bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300"
        >
          <h3 className="text-3xl font-bold text-blue-700 mb-4">Key Features</h3>
          <ul className="text-lg text-gray-800 list-disc list-inside space-y-2">
            <li>Centralized and secure student data management</li>
            <li>Easy template customization with drag-and-drop editor</li>
            <li>Batch processing for large-scale certificate generation</li>
            <li>Real-time preview of certificates before finalization</li>
            <li>Instant download and sharing options</li>   
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
