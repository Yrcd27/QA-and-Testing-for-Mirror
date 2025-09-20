import React from "react";
import logo from "../assets/logo192.png"; // adjust path as needed
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 sm:px-12 md:px-20 py-6 bg-black text-white">
      {/* Left section: Logo + Brand Name */}
      <div className="flex items-center space-x-2">
        {/* Logo image */}
        <img src={logo} alt="Mirror Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
        {/* Hide brand name on small screens */}
        <span className="hidden sm:inline text-2xl sm:text-3xl font-semibold">Mirror</span>
      </div>

      {/* Right section: Button */}
      <Link to="/login">
        <button
          className="border-2 border-white rounded-full px-4 py-1.5 sm:px-6 sm:py-2.5 text-sm sm:text-lg text-white hover:text-[#7a7ffb] hover:border-[#7a7ffb] transition-colors duration-300"
        >
          Get Started
        </button>
      </Link>
    </nav>
  );
}
