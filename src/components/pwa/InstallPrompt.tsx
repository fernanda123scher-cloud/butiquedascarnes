import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Verifica se já está em modo standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-16 left-4 right-4 z-40 max-w-sm mx-auto bg-brand-dark border border-brand-red/40 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center flex-shrink-0">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white">Instalar App do Açougue</h4>
          <p className="text-[11px] text-gray-400">Acesse direto da tela inicial</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold rounded-lg transition-colors"
        >
          Instalar
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 text-gray-400 hover:text-white"
          aria-label="Dispensar aviso de instalação"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
