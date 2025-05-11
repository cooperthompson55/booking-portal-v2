import React from 'react';
import { Check, Gift } from 'lucide-react';
import { PropertySize } from '../types';
import { discountTiers, getDiscount } from '../data/discounts';

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
  const subtotal = totalPrice;
  const appliedDiscount = getDiscount(subtotal);
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percentage) / 100 : 0;
  const finalTotal = subtotal - discountAmount;
  
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

  // Find next discount tier
  const nextDiscountTier = discountTiers.find(tier => subtotal < tier.threshold);

  return (
    <div className="mt-8 border-t border-gray-100 pt-6">
      <h2 className="text-lg font-medium text-gray-800 mb-4">
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

      {/* Discount Tiers */}
      <div className="mb-6 p-4 bg-primary/5 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Gift className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-primary">Volume Discounts</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {discountTiers.map((tier) => (
            <div
              key={tier.threshold}
              className={`p-2 rounded-md text-center ${
                appliedDiscount?.threshold === tier.threshold
                  ? 'bg-primary text-white'
                  : subtotal >= tier.threshold
                  ? 'bg-primary/10 text-primary'
                  : 'bg-gray-50 text-gray-500'
              }`}
            >
              <div className="text-xs mb-1">Orders over</div>
              <div className="font-semibold">${tier.threshold}</div>
              <div className="text-xs">{tier.percentage}% off</div>
            </div>
          ))}
        </div>
        
        {nextDiscountTier && (
          <div className="mt-3 text-sm text-primary">
            Add ${(nextDiscountTier.threshold - subtotal).toFixed(2)} more to get {nextDiscountTier.percentage}% off!
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-gray-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        {appliedDiscount && (
          <div className="flex justify-between items-center text-primary">
            <span>Discount ({appliedDiscount.percentage}% off)</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center border-t border-gray-100 pt-2 text-lg font-semibold">
          <span className="text-primary">Total</span>
          <span className="text-primary">
            ${finalTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PackageSummary;