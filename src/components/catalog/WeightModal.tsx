import React, { useState } from 'react';
import { X, Check, Scale } from 'lucide-react';
import { Product } from '../../types/product';
import { calculateSubtotal, formatCurrency } from '../../utils/formatters';

interface WeightModalProps {
  product: Product;
  currentQuantity: number;
  onConfirm: (quantity: number, notes?: string) => void;
  onClose: () => void;
}

const PRESETS = [0.5, 1.0, 1.5, 2.0];

export const WeightModal: React.FC<WeightModalProps> = ({
  product,
  currentQuantity,
  onConfirm,
  onClose,
}) => {
  const [weight, setWeight] = useState<number>(currentQuantity > 0 ? currentQuantity : 1.0);
  const [customInput, setCustomInput] = useState<string>(
    currentQuantity > 0 ? currentQuantity.toString().replace('.', ',') : '1,0'
  );
  const [notes, setNotes] = useState<string>('');

  const handlePresetClick = (preset: number) => {
    setWeight(preset);
    setCustomInput(preset.toString().replace('.', ','));
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9,.]/g, '');
    setCustomInput(val);
    const normalized = parseFloat(val.replace(',', '.'));
    if (!isNaN(normalized) && normalized > 0) {
      setWeight(normalized);
    }
  };

  const handleStep = (delta: number) => {
    const newWeight = Math.max(0.1, Math.round((weight + delta) * 10) / 10);
    setWeight(newWeight);
    setCustomInput(newWeight.toString().replace('.', ','));
  };

  const currentSubtotal = calculateSubtotal(product.price, weight);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (weight > 0) {
      onConfirm(weight, notes);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-brand-dark border border-brand-border rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-brand-red" />
            <h3 className="font-bold text-white text-base">Escolha o Peso</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Product Summary */}
          <div>
            <h4 className="font-bold text-lg text-white leading-tight">{product.name}</h4>
            <p className="text-brand-red font-bold text-sm mt-0.5">
              {formatCurrency(product.price)} <span className="text-gray-400 font-normal">/ kg</span>
            </p>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="text-xs uppercase font-bold text-gray-400 tracking-wider block mb-2">
              Pesos Frequentes:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map((preset) => {
                const isSelected = Math.abs(weight - preset) < 0.001;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={`py-2 rounded-xl text-xs font-bold transition-colors min-h-[44px] ${
                      isSelected
                        ? 'bg-brand-red text-white shadow-md shadow-brand-red/30 border border-brand-red'
                        : 'bg-brand-card text-gray-300 hover:bg-brand-border border border-brand-border'
                    }`}
                  >
                    {preset.toString().replace('.', ',')} kg
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Weight Stepper */}
          <div>
            <label className="text-xs uppercase font-bold text-gray-400 tracking-wider block mb-2">
              Peso Exato (kg):
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleStep(-0.1)}
                className="w-12 h-12 rounded-xl bg-brand-card hover:bg-brand-border border border-brand-border text-white text-xl font-bold flex items-center justify-center transition-colors min-w-[44px] min-h-[44px]"
              >
                -
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={customInput}
                  onChange={handleCustomChange}
                  className="w-full h-12 text-center text-xl font-extrabold bg-brand-black border border-brand-border rounded-xl text-white focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                  placeholder="1,0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold pointer-events-none">
                  kg
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleStep(0.1)}
                className="w-12 h-12 rounded-xl bg-brand-card hover:bg-brand-border border border-brand-border text-white text-xl font-bold flex items-center justify-center transition-colors min-w-[44px] min-h-[44px]"
              >
                +
              </button>
            </div>
          </div>

          {/* Observation */}
          <div>
            <label className="text-xs uppercase font-bold text-gray-400 tracking-wider block mb-1">
              Observação para este corte (opcional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Em bifes finos, peça inteira, etc."
              className="w-full px-3 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-xs placeholder-gray-500 focus:outline-none focus:border-brand-red"
            />
          </div>

          {/* Subtotal Calculation Box */}
          <div className="p-3 bg-brand-card border border-brand-border rounded-xl flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Subtotal Calculado:</span>
            <span className="text-lg font-black text-white">
              {formatCurrency(currentSubtotal)}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-brand-red hover:bg-brand-redDark text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-red/30 transition-all min-h-[48px]"
          >
            <Check className="w-5 h-5" />
            <span>Confirmar {customInput} kg</span>
          </button>
        </form>
      </div>
    </div>
  );
};
