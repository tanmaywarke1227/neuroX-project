import { useState, useEffect } from 'react';
import { useLiveHardware, type DashboardState } from '../hooks/useLiveHardware';
import { Download, Activity, Zap, Thermometer } from 'lucide-react';

export const BedroomReports = () => {
  const { data, isOffline } = useLiveHardware();
  const [sessionHistory, setSessionHistory] = useState<DashboardState[]>([]);

  // Log incoming data for the current session
  useEffect(() => {
    if (data && !isOffline) {
      setSessionHistory(prev => [...prev, data].slice(-200)); // Keep last 200 records in memory
    }
  }, [data, isOffline]);

  const generateCSV = () => {
    if (sessionHistory.length === 0) return alert("No data recorded yet!");

    const headers = "Timestamp,Temperature (C),Pressure (hPa),Occupancy,Current (A),Power Draw (W),Relay Status,AI Action\n";
    
    const rows = sessionHistory.map(row => {
      const timestamp = new Date().toLocaleTimeString();
      return `${timestamp},${row.temperature},${row.pressure},${row.occupancy},${row.current_amps},${row.power_draw_w},${row.relay_cool === 1 ? 'ON' : 'OFF'},${row.rl_action}`;
    }).join("\n");

    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `HVAC_Session_Report_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const avgTemp = sessionHistory.length 
    ? (sessionHistory.reduce((acc, curr) => acc + curr.temperature, 0) / sessionHistory.length).toFixed(1)
    : "0.0";

  return (
    <div className="p-6 text-white space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bedroom Analytics & Reports</h1>
        <p className="text-gray-400 mt-1">Live session tracking and historical data export.</p>
      </div>
      
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111111] p-5 rounded-xl border border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 font-medium">Session Avg Temp</p>
            <h3 className="text-2xl font-bold text-white mt-1">{avgTemp}°C</h3>
          </div>
          <Thermometer className="text-blue-500 w-8 h-8 opacity-80" />
        </div>
        
        <div className="bg-[#111111] p-5 rounded-xl border border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 font-medium">Live Power Draw</p>
            <h3 className="text-2xl font-bold text-white mt-1">{data?.power_draw_w || 0} W</h3>
          </div>
          <Zap className="text-yellow-500 w-8 h-8 opacity-80" />
        </div>

        <div className="bg-[#111111] p-5 rounded-xl border border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 font-medium">Current Status</p>
            <h3 className="text-2xl font-bold text-white mt-1">{isOffline ? 'Offline' : 'Tracking'}</h3>
          </div>
          <Activity className={`${isOffline ? 'text-red-500' : 'text-green-500'} w-8 h-8 opacity-80`} />
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-[#111111] p-6 rounded-xl border border-gray-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Session Data Export</h2>
          <p className="text-sm text-gray-400 mt-1">Download raw hardware and AI agent metrics as a spreadsheet.</p>
          <p className="text-xs text-gray-500 mt-2">Records in memory: {sessionHistory.length}</p>
        </div>
        <button 
          onClick={generateCSV}
          disabled={sessionHistory.length === 0}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 px-6 py-3 rounded-lg font-semibold text-white transition-all shadow-md hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]"
        >
          <Download className="w-5 h-5" />
          Export .CSV
        </button>
      </div>
    </div>
  );
};