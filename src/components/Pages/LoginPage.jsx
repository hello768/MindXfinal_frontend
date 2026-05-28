import "../Styles/Global.css";
import React, { useState } from "react";
import { useUser } from "../Context/UserContext";
import Navbar from "../Dashboard/NavBar";

export default function LoginPage() {
  const { setUser } = useUser();
  const [hubID, setHubID] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_BACKEND_URL; 
  
    try {
      const response = await fetch(`${API_URL}/sign_in/${hubID}/${password}`);
      const result = await response.json();
  
      if (response.ok && result.auth) {
        localStorage.setItem("hubID", hubID);

        const hubRes = await fetch(`${API_URL}/hub/${hubID}`);
        const hubData = await hubRes.json();

        if (hubData && hubData.sensors) {
          localStorage.setItem("sensorsList", JSON.stringify(hubData.sensors));
        }

        setUser({ hubID: hubID });
        window.location.href = "/"; 
      } else {
        alert("HubID or password is incorrect");
      }
    } catch (error) {
      alert("Error connection!");
    }
  };

  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen font-sans flex flex-col rounded-2xl">
      <Navbar />
      <div className="flex flex-1 justify-center items-center px-4 py-8">
        <div className="bg-[#252525] p-10 rounded-2xl shadow-md w-full max-w-sm border-b border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
          <h1 className="text-center text-2xl font-semibold mb-6 text-[#ff8c42]">Hi there!</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Hub ID"
              className="bg-gray-800 text-white p-3 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-[#ff8c42]"
              value={hubID}
              onChange={(e) => setHubID(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-gray-800 text-white p-3 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-[#ff8c42]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="button p-3 rounded-2xl w-full font-medium mt-2">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}