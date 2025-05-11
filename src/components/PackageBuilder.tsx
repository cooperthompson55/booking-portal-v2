import React from 'react';
import PropertySizeSelector from './PropertySizeSelector';
import ServiceSelector from './ServiceSelector';
import PackageSummary from './PackageSummary';
import OrderForm from './OrderForm';
import { services } from '../data/services';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { OrderFormData, PropertySize, Service } from '../types';

interface PackageBuilderProps {
  selectedSize: PropertySize | null;
  selectedServices: Map<string, { price: number; count: number }>;
  totalPrice: number;
  formData: OrderFormData;
  isSubmitting: boolean;
  showSuccess: boolean;
  validationErrors: string[];
  handleSizeSelect: (size: PropertySize) => void;
  handleServiceToggle: (service: Service, count?: number) => void;
  handleFormChange: (field: keyof Omit<OrderFormData, 'address'>, value: any) => void;
  handleAddressChange: (field: keyof OrderFormData['address'], value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleReset: () => void;
}

const PackageBuilder: React.FC<PackageBuilderProps> = ({
  selectedSize,
  selectedServices,
  totalPrice,
  formData,
  isSubmitting,
  showSuccess,
  validationErrors,
  handleSizeSelect,
  handleServiceToggle,
  handleFormChange,
  handleAddressChange,
  handleSubmit,
  handleReset
}) => {
  if (showSuccess) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden my-4">
        <div className="p-4 sm:p-6 flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
          <h2 className="text-xl font-semibold text-primary mb-2">Booking Submitted Successfully!</h2>
          <p className="text-gray-600 mb-4">Thank you for your booking request. We'll be in touch shortly.</p>
          <button
            onClick={handleReset}
            className="px-5 py-2 bg-primary hover:bg-primary-light text-white rounded-md transition-colors text-sm"
          >
            Submit Another Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden my-4">
      <div className="p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-center text-primary mb-6">
          RePhotos Booking Request
        </h1>
        
        {validationErrors.length > 0 && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-md">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertCircle className="w-4 h-4" />
              <h3 className="font-medium text-sm">Please fix the following issues:</h3>
            </div>
            <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form id="bookingForm" onSubmit={handleSubmit} className="space-y-6">
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
          
          <PackageSummary 
            selectedServices={selectedServices} 
            totalPrice={totalPrice} 
            selectedSize={selectedSize}
          />

          <OrderForm 
            formData={formData}
            onFormChange={handleFormChange}
            onAddressChange={handleAddressChange}
            validationErrors={validationErrors}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-2.5 px-4 rounded-md text-white text-sm font-medium
              transition-all duration-200
              ${!isSubmitting
                ? 'bg-primary hover:bg-primary-light'
                : 'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PackageBuilder;