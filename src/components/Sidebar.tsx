import React from 'react';

interface SidebarProps {
  activeMenu: string;
}

export default function Sidebar({ activeMenu }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: '' },
    { id: 'search', label: 'Search', icon: '' },
    { id: 'contact', label: 'Contact', icon: '' },
    { id: 'settings', label: 'Settings', icon: '' },
  ];

  return (
    <aside className="fixed h-screen w-48 bg-blue-600 text-white flex flex-col items-center py-8 shadow-xl z-50 left-0 top-0">
      {/* Logo/Avatar */}
      <div className="w-24 h-24 bg-blue-400 rounded-full flex items-center justify-center mb-6 shadow-md">
        <span className="text-4xl font-bold text-white">A</span>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col w-full">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full py-4 px-6 text-left text-lg font-semibold transition-colors ${
              activeMenu === item.id
                ? 'bg-blue-700 border-l-4 border-white'
                : 'hover:bg-blue-500'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer spacer */}
      <div className="flex-1"></div>
    </aside>
  );
}
