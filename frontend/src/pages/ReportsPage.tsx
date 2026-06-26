import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, FileSpreadsheet, CheckCircle, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Assume backend is running here; adjust if you have a global config
const BACKEND_URL = 'http://localhost:5000'; 

export default function ReportsPage() {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // =======================================================================
  // CSV Export Logic
  // =======================================================================
  const downloadCSV = async (type: 'telemetry' | 'decisions') => {
    setIsDownloading(`csv-${type}`);
    try {
      // Fetch the last 1000 records from your backend
      const endpoint = type === 'telemetry' ? '/history?limit=1000' : '/rl/decisions?limit=1000';
      const response = await fetch(`${BACKEND_URL}${endpoint}`);
      const data = await response.json();
      
      const records = type === 'telemetry' ? data.logs : data.decisions;
      
      if (!records || records.length === 0) {
        alert("No data available to export.");
        setIsDownloading(null);
        return;
      }

      // Dynamically extract headers
      const headers = Object.keys(records[0]).join(',');
      // Map rows to CSV format
      const rows = records.map((rec: any) => 
        Object.values(rec).map(val => `"${val}"`).join(',')
      ).join('\n');

      const csvContent = `${headers}\n${rows}`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create hidden anchor to trigger download
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `NeuroX_${type}_Export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      triggerToast();
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to generate CSV. Ensure backend is running.");
    } finally {
      setIsDownloading(null);
    }
  };

  // =======================================================================
  // PDF Export Logic
  // =======================================================================
  const downloadPDF = async () => {
    setIsDownloading('pdf');
    try {
      // Fetch summary data and recent logs for the report
      const [summaryRes, historyRes] = await Promise.all([
        fetch(`${BACKEND_URL}/dashboard`),
        fetch(`${BACKEND_URL}/history?limit=25`)
      ]);
      
      const summary = await summaryRes.json();
      const history = await historyRes.json();

      const doc = new jsPDF();
      
      // 1. Report Header
      doc.setFontSize(22);
      doc.setTextColor(41, 128, 185); // Professional Blue
      doc.text('NeuroX System Report', 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
      doc.text(`Target Environment: Edge Node (Raspberry Pi Pico W)`, 14, 35);
      
      // 2. Executive Summary Metrics
      doc.setFontSize(14);
      doc.setTextColor(40);
      doc.text('Executive Summary', 14, 48);
      
      doc.setFontSize(10);
      doc.setTextColor(80);
      doc.text(`Total AI Decisions Logged: ${summary.total_decisions || 0}`, 14, 56);
      doc.text(`Session Average Indoor Temp: ${summary.avg_indoor_temp || 0} °C`, 14, 62);
      doc.text(`Session Average Outdoor Temp: ${summary.avg_outdoor_temp || 0} °C`, 14, 68);
      doc.text(`Active AI Model Version: ${summary.model_version || 'N/A'}`, 14, 74);

      // 3. Telemetry Data Table
      doc.setFontSize(14);
      doc.setTextColor(40);
      doc.text('Recent Edge Telemetry & Agent Actions', 14, 88);

      const tableColumn = ["Time", "Indoor (°C)", "Outdoor (°C)", "Occupancy", "HVAC Output"];
      const tableRows = history.logs.map((log: any) => [
        new Date(log.timestamp).toLocaleTimeString(),
        log.indoor_temp,
        log.outdoor_temp,
        log.occupancy === 1 ? 'Occupied' : 'Empty',
        log.hvac_action.toFixed(2)
      ]);

      autoTable(doc, {
        startY: 94,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 9 },
      });

      // Download the generated PDF
      doc.save(`NeuroX_Executive_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      triggerToast();
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Ensure backend is running.");
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl relative">
      
      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 text-sm font-semibold"
            style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-success)', color: 'var(--color-success)' }}
          >
            <CheckCircle size={16} /> File downloaded successfully.
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Data Export & Reporting</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
          Generate flat files and executive summaries from live edge telemetry.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* PDF Export Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Executive Summary</h3>
          <p className="text-xs mb-6 flex-grow" style={{ color: 'var(--color-text-tertiary)' }}>
            A comprehensive PDF report featuring system metrics, hardware status, and the 25 most recent AI control decisions.
          </p>
          <button 
            onClick={downloadPDF}
            disabled={isDownloading !== null}
            className="w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            style={{ background: '#3b82f6', color: 'white', opacity: isDownloading ? 0.7 : 1 }}
          >
            {isDownloading === 'pdf' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {isDownloading === 'pdf' ? 'Generating...' : 'Download PDF'}
          </button>
        </motion.div>

        {/* Telemetry CSV Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <FileSpreadsheet size={32} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Raw Telemetry (CSV)</h3>
          <p className="text-xs mb-6 flex-grow" style={{ color: 'var(--color-text-tertiary)' }}>
            Export the last 1,000 raw sensor readings from the BMP280 and PIR motion modules straight from the PostgreSQL database.
          </p>
          <button 
            onClick={() => downloadCSV('telemetry')}
            disabled={isDownloading !== null}
            className="w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
          >
            {isDownloading === 'csv-telemetry' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Export Telemetry
          </button>
        </motion.div>

        {/* Decisions CSV Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <FileSpreadsheet size={32} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Agent Decisions (CSV)</h3>
          <p className="text-xs mb-6 flex-grow" style={{ color: 'var(--color-text-tertiary)' }}>
            Export the mathematical breakdown of the TD3 agent's calculated penalty math, rewards, and final output actions.
          </p>
          <button 
            onClick={() => downloadCSV('decisions')}
            disabled={isDownloading !== null}
            className="w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
          >
            {isDownloading === 'csv-decisions' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Export AI Logic
          </button>
        </motion.div>

      </div>
    </div>
  );
}