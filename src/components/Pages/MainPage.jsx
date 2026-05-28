import { useState, useEffect } from 'react';
import {
  Chart,
  InfoSection2,
  MobileHeader,
  Sidebar,
  TemperatureDisplay,
  TimestampsList,
} from "../Dashboard"; 

export default function MainPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [timeStamp, setTimeStamp] = useState([]);
  const [temperature, setTemperature] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const [sensorId, setSensorId] = useState(() => {
    const saved = localStorage.getItem("sensorsList");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed[0]?.sensorID || 'sensor_28f8';
    }
    return 'sensor_28f8';
  });

  const fetchTemperatureData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sensor/${sensorId}`);
      const result = await response.json();

      if (result && result.measure) {
        const measure = result.measure;
        const last10 = measure.slice(-10);

        setTemperature(last10.map(m => m.temperature));
        setTimeStamp(last10.map(m => m.timeStamp));
      }
    } catch (err) {
      console.error('Error fetching sensor data:', err);
    }
  };

  const handleRemoveSensor = async () => {
    const confirmRemove = window.confirm("Remove this sensor?");
    if (!confirmRemove) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/remove_sensor/${sensorId}`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (response.ok) {
        const saved = localStorage.getItem("sensorsList");
        if (saved) {
          let parsed = JSON.parse(saved);
          parsed = parsed.filter(item => {
            const id = item.sensorID ? item.sensorID : item;
            return id !== sensorId;
          });
          localStorage.setItem("sensorsList", JSON.stringify(parsed));
        }

        alert("Sensor removed successfully!");
        window.location.reload();
      } else {
        alert("Error from server: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("API Error:", err);
      alert("Cannot connect to server!");
    }
  };

  useEffect(() => {
    fetchTemperatureData();
    const intervalId = setInterval(fetchTemperatureData, 1800000);
    return () => clearInterval(intervalId);
  }, [sensorId]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f0f0f0] font-sans">
      
      {/* Mobile Header */}
      <div className="hidden max-[968px]:block bg-[#252525]">
        <MobileHeader onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      <div className="flex min-h-[calc(100vh-60px)] min-[969px]:min-h-screen">
        
        {/* Sidebar */}
        <aside className={`
          w-[250px] min-w-[250px] bg-[#1a1a1a] p-5 transition-transform duration-300 z-[1000]
          max-[968px]:fixed max-[968px]:inset-y-0 max-[968px]:left-0 
          ${isSidebarOpen ? 'max-[968px]:translate-x-0' : 'max-[968px]:-translate-x-full'}
          min-[969px]:translate-x-0 min-[969px]:relative 
        `}>
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            onSensorSelect={setSensorId} 
            activeSensor={sensorId} 
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10 max-[968px]:p-5 overflow-x-hidden">
          
          <div className="w-[250px] mb-10 bg-[#202020] text-[#ff8c42] font-bold p-2 rounded-2xl border-b border-white/10 flex justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            <InfoSection2 sensorId={" " + sensorId} />
          </div>

          <div className="mb-2">
            {timeStamp.length > 0 ? (
              <div className="text-[48px] font-bold text-[#ff8c42] max-[480px]:text-[36px]">
                <TemperatureDisplay 
                  temperature={temperature[temperature.length - 1]} 
                  timestamp={timeStamp[timeStamp.length - 1]} 
                />
              </div>
            ) : (
              <div className="text-[48px] font-bold text-[#ff8c42] animate-pulse max-[480px]:text-[36px]">
                Updating...
              </div>
            )}
          </div>

          {timeStamp.length > 0 && (
            <div className="text-[14px] text-[#999] mb-[30px]">
              Last updated: {timeStamp[timeStamp.length - 1]}
            </div>
          )}

          {/* Chart and List */}
          <div className="flex flex-row max-[968px]:flex-col gap-[30px] items-start w-full">
            
            <div className="flex-1 w-full bg-[#252525] rounded-2xl p-5 min-h-[400px] border-b border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <Chart data={temperature} />
            </div>

            <div className="w-[200px] min-w-[200px] relative max-[968px]:w-full">
              <div className="absolute bottom-full left-0 w-full mb-[15px]">
                <button 
                  onClick={handleRemoveSensor} 
                  className="button3 w-full bg-[#202020] text-red-500 font-bold py-2 rounded-2xl border-b border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                >
                  Remove
                </button>
              </div>
              
              <div className="bg-[#252525] p-5 rounded-2xl border-b border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                {Array.isArray(timeStamp) && timeStamp.length > 0 ? (
                  <TimestampsList timestamps={timeStamp} />
                ) : (
                  <div className="text-gray-500 text-center">No data</div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}