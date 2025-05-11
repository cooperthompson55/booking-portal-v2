import React from 'react';
import PropertySizeSelector from './PropertySizeSelector';
import ServiceSelector from './ServiceSelector';
import { usePackageBuilder } from '../hooks/usePackageBuilder';
import { services } from '../data/services';
import { ArrowRight } from 'lucide-react';

interface SimplePackageBuilderProps {
  onShowFullForm: () => void;
}

const SimplePackageBuilder: React.FC<SimplePackageBuilderProps> = ({ onShowFullForm }) => {
  const { 
    selectedSize, 
    selectedServices, 
    totalPrice,
    validationErrors,
    handleSizeSelect, 
    handleServiceToggle,
  } = usePackageBuilder();

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden my-4">
      <div className="p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-center text-blue-600 mb-6">
          RePhotos Quick Quote
        </h1>

        <div className="space-y-6">
          <PropertySizeSelector 
            selectedSize={selectedSize} 
            onSizeSelect={handleSizeSelect}
            validationErrors={validationErrors}
          />

          <ServiceSelector 
            services={services} 
            selectedServices={selectedServices} 
            onServiceToggle={handleServiceToggle}
            selectedSize={selectedSize}
            validationErrors={validationErrors}
          />

          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Estimated Total</span>
              <span className="text-xl font-bold text-blue-600">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={onShowFullForm}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              Continue to Booking
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePackageBuilder;