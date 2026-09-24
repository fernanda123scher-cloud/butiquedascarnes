import React, { useState } from 'react';
import { Layers, Plus, Trash2 } from 'lucide-react';

interface AdminCategoriesProps {
  categories: string[];
  onSaveCategories: (categories: string[]) => Promise<void>;
  onShowToast: (msg: string) => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  onSaveCategories,
  onShowToast,
}) => {
  const [catList, setCatList] = useState<string[]>([...categories]);
  const [newCatName, setNewCatName] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newCatName.trim().toUpperCase();
    if (!clean || catList.includes(clean)) return;

    const updated = [...catList, clean];
    setCatList(updated);
    setNewCatName('');
    await onSaveCategories(updated);
    onShowToast(`✓ Categoria "${clean}" adicionada com sucesso!`);
  };

  const handleRemove = async (cat: string) => {
    if (cat === 'TODAS') return;
    if (confirm(`Deseja remover a categoria "${cat}"?`)) {
      const updated = catList.filter((c) => c !== cat);
      setCatList(updated);
      await onSaveCategories(updated);
      onShowToast(`✓ Categoria "${cat}" removida.`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-brand-dark border border-brand-border p-5 rounded-2xl">
        <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-red" />
          Gerenciar Categorias
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Organize as abas de navegação que aparecem para os clientes no catálogo móvel.
        </p>
      </div>

      {/* Adicionar nova categoria */}
      <form onSubmit={handleAdd} className="bg-brand-dark border border-brand-border rounded-2xl p-5 flex gap-3">
        <input
          type="text"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          placeholder="Nome da nova categoria (ex: LINGUIÇAS & SUÍNOS)"
          className="flex-1 px-4 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-xs font-bold uppercase focus:outline-none focus:border-brand-red"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-brand-red/20 transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar</span>
        </button>
      </form>

      {/* Lista de Categorias */}
      <div className="bg-brand-dark border border-brand-border rounded-2xl overflow-hidden divide-y divide-brand-border">
        {catList.map((cat, idx) => (
          <div key={cat} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-black border border-brand-border text-[11px] font-mono font-bold flex items-center justify-center text-gray-400">
                {idx + 1}
              </span>
              <span className="font-extrabold text-sm text-white">{cat}</span>
              {cat === 'TODAS' && (
                <span className="text-[10px] text-gray-500 uppercase font-semibold">
                  (Padrão do Sistema)
                </span>
              )}
            </div>

            {cat !== 'TODAS' && (
              <button
                onClick={() => handleRemove(cat)}
                className="p-2 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
                title="Excluir categoria"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
