import { useState } from 'react';

interface Service {
  id?: string;
  name: string;
  url: string;
}

interface ServiceFormProps {
  initialData?: Service;
  onSubmit: (data: Omit<Service, 'id'>) => void;
  isLoading?: boolean;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function ServiceForm({
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
  isEditing = false,
}: ServiceFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    url: initialData?.url || '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Le nom est requis');
      return;
    }
    if (!formData.url.trim()) {
      setError('L\'URL est requise');
      return;
    }

    // Valider l'URL
    try {
      new URL(formData.url);
    } catch {
      setError('L\'URL n\'est pas valide');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nom du service
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="ex: Google, Facebook"
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white placeholder-gray-400"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          URL
        </label>
        <input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="ex: https://google.com"
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white placeholder-gray-400"
          disabled={isLoading}
        />
      </div>

      {error && <div className="text-red-600 text-sm font-semibold bg-red-100 px-3 py-2 rounded">{error}</div>}

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          {isLoading ? 'Chargement...' : isEditing ? 'Mettre à jour' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
