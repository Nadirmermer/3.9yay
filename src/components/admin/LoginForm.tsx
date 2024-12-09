import React, { useState } from 'react';
import { X } from 'lucide-react';

interface LoginFormProps {
  onLogin: (password: string) => void;
  onClose: () => void;
}

export function LoginForm({ onLogin, onClose }: LoginFormProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          title="Kapat"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-4">Yönetici Girişi</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Giriş
          </button>
        </form>
      </div>
    </div>
  );
}