import React from 'react';

interface CategoryPillsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-2 whitespace-nowrap min-w-max">
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-150 min-h-[44px] flex items-center justify-center ${
                isSelected
                  ? 'bg-brand-red text-white shadow-md shadow-brand-red/30 border border-brand-red'
                  : 'bg-brand-dark text-gray-300 hover:text-white hover:bg-brand-border border border-brand-border'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};
