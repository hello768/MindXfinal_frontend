import web_logo from "../../assets/web_logo.png";
import React, { useEffect, useState } from "react";
import InfoSection from "./InfoSection";

function Sidebar({ isOpen, onClose, onSensorSelect, activeSensor }) {
  const [currentTime, setCurrentTime] = useState("");
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("sensorsList");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setSensors(parsed);
        
        if (parsed.length > 0 && !activeSensor && typeof onSensorSelect === "function") {
          const firstId = parsed[0].sensorID || parsed[0];
          onSensorSelect(firstId);
        }
      } catch(e) {
        console.error("Lỗi đọc data:", e);
      }
    }

    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSensor, onSensorSelect]);

  const handleAddSensor = async () => {
    const inputSensorId = window.prompt("Enter new Sensor ID:");
    if (!inputSensorId || inputSensorId.trim() === "") return;

    let inputAlias = window.prompt("Enter an Alias for this sensor (optional):");

    if (!inputAlias || inputAlias.trim() === "") {
      inputAlias = inputSensorId.trim();
    }

    const hubId = localStorage.getItem("hubID");
    if (!hubId) {
      alert("Hub ID is missing. Please sign in again.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/add_sensor/${inputSensorId.trim()}/${hubId}/${inputAlias.trim()}`);
      const result = await response.json();

      if (response.ok && !result.errCode) {

        const newSensor = { sensorID: inputSensorId.trim(), sensorAlias: inputAlias.trim() };
        const updatedSensors = [...sensors, newSensor];
        
        setSensors(updatedSensors);
        localStorage.setItem("sensorsList", JSON.stringify(updatedSensors));
        
        alert("Sensor added successfully!");
        
        if (typeof onSensorSelect === "function") {
          onSensorSelect(inputSensorId.trim());
        }
      } else {
        alert("Failed to add sensor: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Cannot connect to server!");
    }
  };

  return (
    <div className="flex flex-col h-full w-[95%] mx-auto bg-[#252525] text-white px-4 py-4 rounded-2xl shadow-lg border-b border-white/10">
      <div className="mb-10 pt-5 flex justify-center">
        <img src={web_logo} alt="Vartija." width="200px" />
      </div>
      
      <div className="w-full mb-10 bg-[#202020] text-[#ff8c42] font-bold py-2 rounded-2xl border-b border-white/10 flex justify-center items-center">
        <InfoSection hubId={" " + localStorage.getItem("hubID")} />
      </div>

      <div className="mb-6 border-b border-gray-700 pb-2 flex justify-center font-mono text-gray-400 text-sm">
        {currentTime}
      </div>

      <nav className="flex flex-col">
        <button 
          type="button" 
          onClick={handleAddSensor}
          className="button2 w-full mt-4 text-white px-3 py-2 rounded-2xl border-b border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex justify-center items-center cursor-pointer transition-all hover:bg-white/5"
        >
          Add sensors
        </button>
        
        {sensors.map((item, index) => {
          const id = item.sensorID ? item.sensorID : item;
          const isActive = activeSensor?.trim() === id?.trim();

          return (
            <button 
              key={index}
              className="button2 w-full mt-4 px-3 py-2 rounded-2xl border-b border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex justify-center items-center cursor-pointer transition-all hover:bg-white/5"
              style={isActive ? { 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                color: '#ff8c42', 
                fontWeight: 'bold' 
              } : { 
                color: 'white' 
              }}
              onClick={() => {
                if (typeof onSensorSelect === "function") {
                  onSensorSelect(id);
                }
                if (window.innerWidth < 968) onClose();
              }}
            >
              {id}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-4">
        <button 
          onClick={() => { 
            if (window.confirm("Say goodbye to Vartija?")) {
              localStorage.clear(); 
              window.location.href = "/"; 
            }
          }} 
          className="button3 w-full bg-[#202020] text-red-500 font-bold py-3 rounded-2xlborder-b border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]  flex justify-center items-center"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
