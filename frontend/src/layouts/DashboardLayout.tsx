import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Topbar from '../components/navigation/Topbar';
import { useState, useEffect } from 'react';

export default function DashboardLayout() {
  const [sidebarWidth, setSidebarWidth] = useState(260);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const sidebar = document.querySelector('aside');
      if (sidebar) {
        setSidebarWidth(sidebar.getBoundingClientRect().width);
      }
    });

    const sidebar = document.querySelector('aside');
    if (sidebar) {
      setSidebarWidth(sidebar.getBoundingClientRect().width);
      observer.observe(sidebar, { attributes: true, attributeFilter: ['style'] });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface-1)' }}>
      <Sidebar />
      <div
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <Topbar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
