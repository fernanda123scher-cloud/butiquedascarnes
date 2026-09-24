import React, { useState } from 'react';
import { Settings, Save, Check } from 'lucide-react';
import { StoreSettings } from '../types/settings';

interface AdminSettingsProps {
  settings: StoreSettings;
  onSave: (settings: StoreSettings) => Promise<void>;
  onShowToast: (msg: string) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onSave,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onShowToast('✓ Configurações salvas com sucesso!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-brand-dark border border-brand-border p-5 rounded-2xl">
        <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-red" />
          Configurações Gerais do Açougue
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Personalize as informações da loja, WhatsApp de recebimento e regras de entrega.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-brand-dark border border-brand-border rounded-2xl p-6 space-y-6">
        {/* Identidade do Açougue */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-red border-b border-brand-border pb-2">
            Identidade do Açougue
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Nome do Açougue *
              </label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                WhatsApp Oficial para Receber Pedidos (com DDD) *
              </label>
              <input
                type="text"
                required
                placeholder="79999999999"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value.replace(/\D/g, '') })}
                className="w-full px-3.5 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-sm font-mono focus:outline-none focus:border-brand-red"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Apenas números com DDD. Exemplo: 79999998888
              </p>
            </div>
          </div>
        </div>

        {/* Entrega e Taxas */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-red border-b border-brand-border pb-2">
            Entrega & Taxas
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Taxa Padrão de Entrega (R$)
              </label>
              <input
                type="number"
                step="0.50"
                min="0"
                value={formData.deliveryFee}
                onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-3 bg-brand-black border border-brand-border rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFreeDelivery}
                  onChange={(e) => setFormData({ ...formData, isFreeDelivery: e.target.checked })}
                  className="w-4 h-4 text-brand-red rounded bg-brand-dark border-brand-border"
                />
                <span className="text-xs font-bold text-white">Ativar Entrega Grátis Geral</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <label className="flex items-center gap-2 p-3 bg-brand-black border border-brand-border rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={formData.deliveryEnabled}
                onChange={(e) => setFormData({ ...formData, deliveryEnabled: e.target.checked })}
                className="w-4 h-4 text-brand-red rounded bg-brand-dark border-brand-border"
              />
              <span className="text-xs font-bold text-white">Permitir Pedidos para Entrega</span>
            </label>

            <label className="flex items-center gap-2 p-3 bg-brand-black border border-brand-border rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={formData.pickupEnabled}
                onChange={(e) => setFormData({ ...formData, pickupEnabled: e.target.checked })}
                className="w-4 h-4 text-brand-red rounded bg-brand-dark border-brand-border"
              />
              <span className="text-xs font-bold text-white">Permitir Retirada no Balcão</span>
            </label>
          </div>
        </div>

        {/* Localização & Atendimento */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-red border-b border-brand-border pb-2">
            Localização & Atendimento
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Endereço Físico do Açougue
              </label>
              <input
                type="text"
                value={formData.storeAddress}
                onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Horário de Atendimento
              </label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Instagram da Loja (opcional)
              </label>
              <input
                type="url"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
              />
            </div>
          </div>
        </div>

        {/* Salvar */}
        <div className="pt-4 border-t border-brand-border flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-brand-red hover:bg-brand-redDark text-white font-bold rounded-xl shadow-lg shadow-brand-red/30 transition-all flex items-center gap-2 min-h-[46px]"
          >
            {isSaving ? <Check className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>Salvar Configurações</span>
          </button>
        </div>
      </form>
    </div>
  );
};
