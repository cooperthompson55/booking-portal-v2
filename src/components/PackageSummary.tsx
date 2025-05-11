import React from 'react';
import { Check } from 'lucide-react';
import { PropertySize } from '../types';

interface PackageSummaryProps {
  selectedServices: Map<string, { price: number; count: number }>;
  totalPrice: number;
  selectedSize: PropertySize | null;
}

const PackageSummary: React.FC<PackageSummaryProps> = ({ 
  selectedServices, 
  totalPrice,
  selectedSize
}) => {
  const hasServices = selectedServices.size > 0;
  
  const formatSize = (size: PropertySize | null): string => {
    if (!size) return 'Not selected';
    
    switch (size) {
      case '<1000': return 'Under 1000 sq ft';
      case '1000-2000': return '1000–2000 sq ft';
      case '2000-3000': return '2000–3000 sq ft';
      case '3000-4000': return '3000–4000 sq ft';
      case '4000-5000': return '4000–5000 sq ft';
      default: return size;
    }
  };

  return (
    <div className="mt-8 border-t border-gray-100 pt-6">
      <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-4">
        Your Package
      </h2>
      
      {selectedSize && (
        <div className="flex items-center mb-4 bg-gray-50 p-3 rounded-lg">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <Check className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Property Size</p>
            <p className="font-medium">{formatSize(selectedSize)}</p>
          </div>
        </div>
      )}
      
      {hasServices && (
        <div className="mb-6">
          <ul className="space-y-2">
            {Array.from(selectedServices.entries()).map(([name, { price, count }]) => (
              <li key={name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">
                  {name}
                  {count > 1 && ` (x${count})`}
                </span>
                <span className="text-gray-700">${(price * count).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-6">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-xl font-bold text-blue-600">
          ${totalPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default PackageSummary;