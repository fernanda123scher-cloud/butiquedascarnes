import React, { useState } from 'react';
import { X, Upload, Check, Trash2, Image as ImageIcon } from 'lucide-react';
import { Product, SaleUnit, StockStatus } from '../types/product';
import { compressImageToWebP } from '../services/imageService';

interface ProductEditModalProps {
  product: Product | null; // null se for criação de novo produto
  categories: string[];
  onSave: (product: Product) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  product,
  categories,
  onSave,
  onDelete,
  onClose,
}) => {
  const isEditing = Boolean(product);

  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product ? product.price.toString() : '');
  const [unit, setUnit] = useState<SaleUnit>(product?.unit || 'kg');
  const [category, setCategory] = useState(product?.category || (categories[1] || 'CARNES NOBRES'));
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
  const [description, setDescription] = useState(product?.description || '');
  const [isActive, setIsActive] = useState(product ? product.isActive : true);
  const [isFeatured, setIsFeatured] = useState(product ? product.isFeatured : false);
  const [stockStatus, setStockStatus] = useState<StockStatus>(product?.stockStatus || 'available');
  const [sortOrder, setSortOrder] = useState(product ? product.sortOrder.toString() : '1');

  const [isCompressing, setIsCompressing] = useState(false);
  const [imageSizeNote, setImageSizeNote] = useState('');

  // Manipulador de upload de imagem com compressão WebP automática
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const originalSizeKb = Math.round(file.size / 1024);
      // Comprime para WebP 800x600 q=0.82
      const compressedDataUrl = await compressImageToWebP(file, 800, 600, 0.82);
      setImageUrl(compressedDataUrl);

      // Estimativa de tamanho comprimido
      const compressedSizeKb = Math.round((compressedDataUrl.length * 0.75) / 1024);
      setImageSizeNote(`Otimizado: ${originalSizeKb} KB → ${compressedSizeKb} KB (WebP ultra rápido)`);
    } catch (err) {
      console.error('Falha ao comprimir imagem:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price.replace(',', '.'));
    if (!name.trim() || isNaN(parsedPrice) || parsedPrice <= 0) return;

    const savedProduct: Product = {
      id: product?.id || `prod-${Date.now()}`,
      name: name.trim(),
      price: Math.round(parsedPrice * 100) / 100,
      unit,
      category,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
      description: description.trim(),
      isActive,
      isFeatured,
      stockStatus,
      sortOrder: parseInt(sortOrder, 10) || 1
    };

    onSave(savedProduct);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-brand-dark border border-brand-border rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col justify-between shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between bg-brand-black/60">
          <h3 className="font-extrabold text-white text-base sm:text-lg">
            {isEditing ? `Editar: ${product?.name}` : 'Cadastrar Novo Produto'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Nome e Preço */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Nome do Corte / Produto *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Picanha Especial"
                className="w-full px-3.5 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Preço (R$) *
              </label>
              <input
                type="text"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^0-9,.]/g, ''))}
                placeholder="67,00"
                className="w-full px-3.5 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-sm font-bold text-brand-red focus:outline-none focus:border-brand-red"
              />
            </div>
          </div>

          {/* Unidade e Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Unidade de Venda *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as SaleUnit)}
                className="w-full px-3.5 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
              >
                <option value="kg">Por KG (Carnes e cortes)</option>
                <option value="unidade">Por Unidade (Espetinhos, peças)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
              >
                {categories.filter(c => c !== 'TODAS').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Gerenciamento de Foto com Otimização WebP */}
          <div className="bg-brand-black/60 border border-brand-border rounded-2xl p-4 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
              Foto do Produto (WebP Automático)
            </label>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-brand-card border border-brand-border overflow-hidden flex-shrink-0 flex items-center justify-center">
                {imageUrl ? (
                  <img src={imageUrl} alt="Prévia" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-600" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-brand-card hover:bg-brand-border border border-brand-border text-white text-xs font-bold rounded-xl cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-brand-red" />
                  <span>{isCompressing ? 'Comprimindo...' : 'Alterar Foto (Upload)'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                    disabled={isCompressing}
                  />
                </label>

                {imageSizeNote && (
                  <p className="text-[11px] text-emerald-400 font-medium">
                    {imageSizeNote}
                  </p>
                )}

                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Ou cole a URL da imagem aqui"
                  className="w-full px-3 py-1.5 bg-brand-black border border-brand-border rounded-lg text-white text-xs placeholder-gray-500 focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Descrição do Corte (opcional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Corte extremamente macio com capa de gordura perfeita."
              className="w-full px-3.5 py-2 bg-brand-black border border-brand-border rounded-xl text-white text-xs focus:outline-none focus:border-brand-red resize-none"
            />
          </div>

          {/* Flags: Ativo, Destaque, Estoque */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-black border border-brand-border cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-brand-red rounded bg-brand-dark border-brand-border focus:ring-0"
              />
              <span className="text-xs font-bold text-white">Ativo no Catálogo</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-black border border-brand-border cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-brand-red rounded bg-brand-dark border-brand-border focus:ring-0"
              />
              <span className="text-xs font-bold text-white">🔥 Destaque</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-black border border-brand-border cursor-pointer">
              <input
                type="checkbox"
                checked={stockStatus === 'available'}
                onChange={(e) => setStockStatus(e.target.checked ? 'available' : 'unavailable')}
                className="w-4 h-4 text-brand-red rounded bg-brand-dark border-brand-border focus:ring-0"
              />
              <span className="text-xs font-bold text-white">Em Estoque</span>
            </label>
          </div>

          {/* Botões do Rodapé */}
          <div className="pt-4 border-t border-brand-border flex items-center justify-between gap-3">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Deseja excluir o produto "${product?.name}"?`)) {
                    onDelete(product!.id);
                  }
                }}
                className="px-4 py-2.5 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Excluir
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-brand-card hover:bg-brand-border text-gray-300 text-xs font-bold rounded-xl transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-red/30 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Produto</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
