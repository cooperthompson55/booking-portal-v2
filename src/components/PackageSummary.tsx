import React from 'react';
import { Check, Gift, Package } from 'lucide-react';
import { PropertySize } from '../types';
import { discountTiers, getDiscount } from '../data/discounts';
import { findApplicableBundles, calculateBundleDiscount } from '../data/bundles';
import { services } from '../data/services';

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
  
  // Calculate volume discount
  const volumeDiscount = getDiscount(subtotal);
  const volumeDiscountAmount = volumeDiscount ? (subtotal * volumeDiscount.percentage) / 100 : 0;
  
  // Calculate bundle discount
  const selectedServiceIds = Array.from(selectedServices.keys()).map(name => {
    const service = services.find(s => s.name === name);
    return service ? service.id : '';
  }).filter(Boolean);
  
  const applicableBundles = findApplicableBundles(selectedServiceIds);
  const bundleDiscount = calculateBundleDiscount(applicableBundles);
  const bundleDiscountAmount = (subtotal * bundleDiscount) / 100;
  
  // Calculate total discount and final price
  const totalDiscountAmount = volumeDiscountAmount + bundleDiscountAmount;
  const finalTotal = subtotal - totalDiscountAmount;
  
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
          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
            <Check className="w-4 h-4 text-primary" />
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

      {/* Discounts Section */}
      {hasServices && (applicableBundles.length > 0 || volumeDiscount) && (
        <div className="mb-6 p-4 bg-primary/5 rounded-lg space-y-4">
          {/* Volume Discount */}
          {volumeDiscount && (
            <div className="flex items-start gap-2">
              <Gift className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="font-medium text-primary">Volume Discount</h3>
                <p className="text-sm text-primary">
                  {volumeDiscount.percentage}% off orders over ${volumeDiscount.threshold}
                </p>
                {nextDiscountTier && (
                  <p className="text-sm text-gray-600 mt-1">
                    Add ${(nextDiscountTier.threshold - subtotal).toFixed(2)} more for {nextDiscountTier.percentage}% off
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Bundle Discount */}
          {applicableBundles.length > 0 && (
            <div className="flex items-start gap-2">
              <Package className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="font-medium text-primary">Bundle Savings</h3>
                <p className="text-sm text-primary">
                  Extra {bundleDiscount}% off with {applicableBundles[0].name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {applicableBundles[0].description}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Price Summary */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-gray-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        {volumeDiscountAmount > 0 && (
          <div className="flex justify-between items-center text-primary">
            <span>Volume Discount ({volumeDiscount?.percentage}% off)</span>
            <span>-${volumeDiscountAmount.toFixed(2)}</span>
          </div>
        )}

        {bundleDiscountAmount > 0 && (
          <div className="flex justify-between items-center text-primary">
            <span>Bundle Discount ({bundleDiscount}% off)</span>
            <span>-${bundleDiscountAmount.toFixed(2)}</span>
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