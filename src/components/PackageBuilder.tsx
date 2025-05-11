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
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden my-8">
        <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Booking Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">Thank you for your booking request. We'll be in touch shortly.</p>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Another Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden my-8">
      <div className="p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-center text-blue-600 mb-6">
          RePhotos Booking Request
        </h1>
        
        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-medium">Please fix the following issues:</h3>
            </div>
            <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form id="bookingForm" onSubmit={handleSubmit} className="space-y-8">
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
              w-full py-3 px-6 rounded-lg text-white font-medium
              transition-all duration-200
              ${!isSubmitting
                ? 'bg-blue-600 hover:bg-blue-700'
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