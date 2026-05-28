import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import web_logo from "../../assets/web_logo.png";

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="w-[95%] mx-auto mt-4 bg-[#252525] text-white px-4 sm:px-6 py-4 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 border-b border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
      
      <Link to="/" className="shrink-0 flex items-center">
        <img 
          src={web_logo} 
          alt="Vartija." 
          className="w-[120px] md:w-[150px] object-contain" 
        />
      </Link>

      <div className="text-center flex-1">
        <p className="text-lg md:text-xl font-bold text-[#ff8c42]">
          Welcome to the fridge dashboard!
        </p>
      </div>

      <div className="text-sm md:text-base font-mono text-gray-300 shrink-0">
        {currentTime}
      </div>

    </nav>
  );
}