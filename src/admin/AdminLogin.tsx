import React, { useState } from 'react';
import { Lock, ShieldAlert, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToStore }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Senha padrão para acesso ao painel
    if (password === 'admin123' || password === 'butique2026') {
      sessionStorage.setItem('butique_admin_session', 'authenticated');
      onLoginSuccess();
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-brand-dark border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <button
          onClick={onBackToStore}
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-brand-red/10 border border-brand-red/30 flex items-center justify-center mx-auto text-brand-red">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider">
            Painel Administrativo
          </h2>
          <p className="text-xs text-gray-400">
            Acesso restrito para gerenciar catálogo e pedidos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1.5">
              Senha de Acesso:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Digite a senha..."
              autoFocus
              className="w-full px-4 py-3 bg-brand-black border border-brand-border rounded-xl text-white text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
            />
            {error && (
              <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-brand-red hover:bg-brand-redDark text-white font-bold rounded-xl shadow-lg shadow-brand-red/30 transition-all min-h-[46px]"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
};
