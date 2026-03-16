import React from 'react';

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (id: string) => void;
}

const menuItems = [
  {
    id: 'home', label: 'Home',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>,
  },
  {
    id: 'search', label: 'Search',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>,
  },
  {
    id: 'contact', label: 'Contact',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" /></svg>,
  },
  {
    id: 'settings', label: 'Settings',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a6.96 6.96 0 0 0-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.74 8.87a.47.47 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.47.47 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.37 1.04.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></svg>,
  },
];

export default function Sidebar({ activeMenu, onMenuChange }: SidebarProps) {
  return (
    <aside className="fixed h-screen w-14 md:w-48 bg-blue-600 text-white flex flex-col items-center py-6 shadow-xl z-50 left-0 top-0 transition-all duration-200">
      {/* Avatar */}
      <div className="w-10 h-10 md:w-20 md:h-20 bg-blue-400 rounded-full flex items-center justify-center mb-6 shadow-md flex-shrink-0">
        <span className="text-sm md:text-3xl font-bold text-white">A</span>
      </div>

      {/* Menu */}
      <nav className="flex flex-col w-full flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onMenuChange(item.id)}
            title={item.label}
            className={`w-full py-3 md:py-4 px-3 md:px-6 flex items-center gap-3 font-semibold transition-colors ${
              activeMenu === item.id
                ? 'bg-blue-700 border-l-4 border-white'
                : 'hover:bg-blue-500'
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="hidden md:inline text-base">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
