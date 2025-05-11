import React from 'react';
import PropertySizeSelector from './PropertySizeSelector';
import ServiceSelector from './ServiceSelector';
import { services } from '../data/services';
import { ArrowRight } from 'lucide-react';
import { PropertySize, Service } from '../types';

interface SimplePackageBuilderProps {
  onShowFullForm: () => void;
  selectedSize: PropertySize | null;
  selectedServices: Map<string, { price: number; count: number }>;
  totalPrice: number;
  validationErrors: string[];
  handleSizeSelect: (size: PropertySize) => void;
  handleServiceToggle: (service: Service, count?: number) => void;
}

const SimplePackageBuilder: React.FC<SimplePackageBuilderProps> = ({
  onShowFullForm,
  selectedSize,
  selectedServices,
  totalPrice,
  validationErrors,
  handleSizeSelect,
  handleServiceToggle,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden my-4">
      <div className="p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-center text-primary mb-6">
          RePhotos Quick Quote
        </h1>

        <div className="space-y-8">
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
              <span className="text-lg font-semibold text-primary">Estimated Total</span>
              <span className="text-xl font-bold text-primary">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={onShowFullForm}
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-light text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
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