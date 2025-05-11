import React from 'react';
import PropertySizeSelector from './PropertySizeSelector';
import ServiceSelector from './ServiceSelector';
import PackageSummary from './PackageSummary';
import OrderForm from './OrderForm';
import { usePackageBuilder } from '../hooks/usePackageBuilder';
import { services } from '../data/services';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const PackageBuilder: React.FC = () => {
  const { 
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
  } = usePackageBuilder();

  if (showSuccess) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden my-4">
        <div className="p-4 sm:p-6 flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Booking Submitted Successfully!</h2>
          <p className="text-gray-600 mb-4">Thank you for your booking request. We'll be in touch shortly.</p>
          <button
            onClick={handleReset}
            className="px-5 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm"
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
        <h1 className="text-xl sm:text-2xl font-semibold text-center text-emerald-600 mb-6">
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
                ? 'bg-emerald-600 hover:bg-emerald-700'
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