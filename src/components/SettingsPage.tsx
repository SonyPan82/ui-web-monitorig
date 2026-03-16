'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

type Modal = 'name' | 'permission' | 'password' | 'add' | 'delete' | null;

interface SettingsPageProps {
  onClose: () => void;
}

export default function SettingsPage({ onClose }: SettingsPageProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<User | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [input, setInput] = useState('');
  const [input2, setInput2] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
    if (data.length > 0 && !selected) setSelected(data[0]);
  };

  useEffect(() => { fetchUsers(); }, []);

  const openModal = (type: Modal, prefill = '') => {
    setInput(prefill);
    setInput2('');
    setError('');
    setModal(type);
  };

  const closeModal = () => { setModal(null); setError(''); };

  const handleRename = async () => {
    if (!selected || !input.trim()) return;
    const res = await fetch(`/api/users/${selected.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: input.trim() }),
    });
    if (!res.ok) { setError('Nom déjà utilisé'); return; }
    const updated = { ...selected, username: input.trim() };
    setSelected(updated);
    await fetchUsers();
    closeModal();
  };

  const handlePermission = async (role: 'admin' | 'user') => {
    if (!selected) return;
    await fetch(`/api/users/${selected.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    setSelected(prev => prev ? { ...prev, role } : prev);
    await fetchUsers();
    closeModal();
  };

  const handleResetPassword = async () => {
    if (!selected || !input.trim()) return;
    if (input !== input2) { setError('Les mots de passe ne correspondent pas'); return; }
    await fetch(`/api/users/${selected.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: input }),
    });
    closeModal();
  };

  const handleDelete = async () => {
    if (!selected) return;
    await fetch(`/api/users/${selected.id}`, { method: 'DELETE' });
    await fetchUsers();
    setSelected(null);
    closeModal();
  };

  const handleAdd = async () => {
    if (!input.trim() || !input2.trim()) { setError('Tous les champs sont requis'); return; }
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: input.trim(), password: input2 }),
    });
    if (!res.ok) { const d = await res.json(); setError(d.error); return; }
    await fetchUsers();
    closeModal();
  };

  return (
    <>
      {/* Overlay transparent pour fermer au clic */}
      <div
        className="fixed inset-0 z-30"
        onClick={onClose}
        style={{ backgroundColor: 'rgba(0,0,0,0)' }}
      />

      {/* Panel Settings — bulle qui s'agrandit */}
      <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none p-4 sm:p-8 sm:ml-48">
        <div
          className="w-full max-w-3xl pointer-events-auto rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #c8d0e8 0%, #d0c8e8 100%)',
            animation: 'bubbleGrow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white flex items-center justify-between px-6 py-4">
            <span className="text-xl font-bold tracking-widest flex-1 text-center">SETTINGS</span>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-700 rounded-full p-1 w-8 h-8 flex items-center justify-center text-lg"
            >
              ✕
            </button>
          </div>

          {/* Corps */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 max-h-[70vh] overflow-hidden">

            {/* Colonne gauche — liste */}
            <div className="sm:w-48 flex flex-col bg-blue-200 bg-opacity-60 rounded-2xl p-3 gap-2 min-h-0">
              <p className="text-blue-900 font-semibold text-center text-sm">Active User</p>
              <div className="flex flex-col gap-2 overflow-y-auto flex-1">
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => setSelected(u)}
                    className={`w-full py-2 px-3 rounded-xl font-bold text-sm transition-colors text-left ${
                      selected?.id === u.id
                        ? 'bg-blue-700 text-white'
                        : 'bg-blue-300 text-blue-900 hover:bg-blue-400'
                    }`}
                  >
                    {u.username.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                onClick={() => openModal('add')}
                className="mt-1 mx-auto w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold flex items-center justify-center shadow transition-colors flex-shrink-0"
              >
                +
              </button>
            </div>

            {/* Colonne droite — détail */}
            <div className="flex-1 bg-blue-500 bg-opacity-50 rounded-2xl p-4 sm:p-6 flex flex-col items-center gap-3 overflow-y-auto">
              {selected ? (
                <>
                  <p className="text-white font-bold text-base sm:text-lg tracking-wide text-center">
                    {selected.username.toUpperCase()}
                    <span className="ml-2 text-blue-200 font-normal text-sm">({selected.role})</span>
                  </p>

                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-300 bg-opacity-60 flex items-center justify-center shadow-md flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-12 h-12 sm:w-16 sm:h-16 text-blue-700" fill="currentColor">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>

                  <div className="w-full flex flex-col gap-2">
                    <button onClick={() => openModal('name', selected.username)} className="w-full bg-blue-300 bg-opacity-60 hover:bg-opacity-80 text-blue-900 font-bold py-2.5 rounded-xl text-sm transition-colors">NAME</button>
                    <button onClick={() => openModal('permission')} className="w-full bg-blue-300 bg-opacity-60 hover:bg-opacity-80 text-blue-900 font-bold py-2.5 rounded-xl text-sm transition-colors">CHANGE PERMISSION</button>
                    <button onClick={() => openModal('password')} className="w-full bg-blue-300 bg-opacity-60 hover:bg-opacity-80 text-blue-900 font-bold py-2.5 rounded-xl text-sm transition-colors">RESET PASSWORD</button>
                  </div>

                  <button
                    onClick={() => openModal('delete')}
                    className="w-full bg-red-400 bg-opacity-60 hover:bg-opacity-80 text-white font-bold py-2.5 rounded-xl text-sm transition-colors mt-auto"
                  >
                    DELETE
                  </button>
                </>
              ) : (
                <p className="text-white font-semibold mt-10 text-sm">Sélectionne un utilisateur</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4">
            {modal === 'name' && (
              <>
                <h3 className="font-bold text-lg text-gray-800">Renommer l'utilisateur</h3>
                <input className="border-2 border-blue-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500" value={input} onChange={e => setInput(e.target.value)} placeholder="Nouveau nom" />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 bg-gray-200 hover:bg-gray-300 font-bold py-2 rounded-lg">Annuler</button>
                  <button onClick={handleRename} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg">Confirmer</button>
                </div>
              </>
            )}
            {modal === 'permission' && (
              <>
                <h3 className="font-bold text-lg text-gray-800">Changer le rôle</h3>
                <p className="text-gray-600 text-sm">Rôle actuel : <strong>{selected?.role}</strong></p>
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 bg-gray-200 hover:bg-gray-300 font-bold py-2 rounded-lg">Annuler</button>
                  <button onClick={() => handlePermission('user')} className="flex-1 bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 rounded-lg">User</button>
                  <button onClick={() => handlePermission('admin')} className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-lg">Admin</button>
                </div>
              </>
            )}
            {modal === 'password' && (
              <>
                <h3 className="font-bold text-lg text-gray-800">Nouveau mot de passe</h3>
                <input type="password" className="border-2 border-blue-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500" value={input} onChange={e => setInput(e.target.value)} placeholder="Nouveau mot de passe" />
                <input type="password" className="border-2 border-blue-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500" value={input2} onChange={e => setInput2(e.target.value)} placeholder="Confirmer" />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 bg-gray-200 hover:bg-gray-300 font-bold py-2 rounded-lg">Annuler</button>
                  <button onClick={handleResetPassword} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg">Confirmer</button>
                </div>
              </>
            )}
            {modal === 'delete' && (
              <>
                <h3 className="font-bold text-lg text-gray-800">Supprimer l'utilisateur</h3>
                <p className="text-gray-600 text-sm">Supprimer <strong>{selected?.username}</strong> ? Cette action est irréversible.</p>
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 bg-gray-200 hover:bg-gray-300 font-bold py-2 rounded-lg">Annuler</button>
                  <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg">Supprimer</button>
                </div>
              </>
            )}
            {modal === 'add' && (
              <>
                <h3 className="font-bold text-lg text-gray-800">Ajouter un utilisateur</h3>
                <input className="border-2 border-blue-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500" value={input} onChange={e => setInput(e.target.value)} placeholder="Nom d'utilisateur" />
                <input type="password" className="border-2 border-blue-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500" value={input2} onChange={e => setInput2(e.target.value)} placeholder="Mot de passe" />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 bg-gray-200 hover:bg-gray-300 font-bold py-2 rounded-lg">Annuler</button>
                  <button onClick={handleAdd} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg">Créer</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bubbleGrow {
          from { transform: scale(0.3); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </>
  );
}
