import React, { useState } from 'react';
import { Service, PropertySize } from '../types';
import { getServiceIcon } from '../utils/serviceIcons';
import { Plus, Minus, AlertCircle } from 'lucide-react';

interface ServiceSelectorProps {
  services: Service[];
  selectedServices: Map<string, { price: number; count: number }>;
  onServiceToggle: (service: Service, count?: number) => void;
  selectedSize: PropertySize | null;
  validationErrors: string[];
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ 
  services, 
  selectedServices, 
  onServiceToggle,
  selectedSize,
  validationErrors
}) => {
  const [stagingCount, setStagingCount] = useState<number>(1);

  const hasError = validationErrors.some(error => 
    error.toLowerCase().includes('service')
  );

  const handleServiceClick = (service: Service) => {
    if (service.id === 'virtualStaging') {
      onServiceToggle(service, stagingCount);
    } else {
      onServiceToggle(service);
    }
  };

  const handleStagingCountChange = (increment: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    setStagingCount(prev => {
      const newCount = increment ? prev + 1 : Math.max(1, prev - 1);
      const serviceData = selectedServices.get('Virtual Staging');
      if (serviceData) {
        onServiceToggle(
          services.find(s => s.id === 'virtualStaging')!,
          newCount
        );
      }
      return newCount;
    });
  };

  return (
    <div className={`${hasError ? 'animate-shake' : ''}`}>
      <div className="flex items-center mb-4">
        <h2 className={`text-lg md:text-xl font-medium ${hasError ? 'text-red-600' : 'text-gray-800'}`}>
          Select Your Services
        </h2>
        {hasError && (
          <AlertCircle className="w-5 h-5 text-red-500 ml-2" />
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {services.map((service) => {
          const serviceData = selectedServices.get(service.name);
          const isSelected = !!serviceData;
          const ServiceIcon = getServiceIcon(service.id);
          const price = serviceData?.price || service.price;
          
          return (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service)}
              className={`
                group relative flex flex-col items-center justify-center p-4 h-[140px]
                rounded-xl transition-all duration-200 ease-in-out cursor-pointer
                ${isSelected 
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                  : hasError
                    ? 'bg-red-50 text-red-700 border-2 border-red-300 hover:bg-red-100'
                    : 'bg-white text-gray-800 border border-gray-200 hover:border-blue-300 hover:shadow-md'
                }
              `}
            >
              <div className="mb-2">
                <ServiceIcon className={`w-8 h-8 ${
                  isSelected 
                    ? 'text-white' 
                    : hasError 
                      ? 'text-red-500' 
                      : 'text-blue-600 group-hover:text-blue-500'
                }`} />
              </div>
              <span className="text-sm font-medium text-center">{service.name}</span>
              <span className={`text-xs mt-1 ${
                isSelected 
                  ? 'text-blue-100' 
                  : hasError 
                    ? 'text-red-400' 
                    : 'text-gray-500'
              }`}>
                ${price.toFixed(2)}
              </span>
              
              {service.id === 'virtualStaging' && (
                <div className={`absolute top-2 right-2 flex items-center gap-1 ${
                  isSelected 
                    ? 'text-white' 
                    : hasError 
                      ? 'text-red-500' 
                      : 'text-gray-600'
                }`}>
                  <button
                    type="button"
                    onClick={(e) => handleStagingCountChange(false, e)}
                    className={`p-1 rounded-full ${
                      isSelected 
                        ? 'hover:bg-blue-500' 
                        : hasError 
                          ? 'hover:bg-red-200' 
                          : 'hover:bg-gray-100'
                    }`}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-medium min-w-[12px] text-center">{stagingCount}</span>
                  <button
                    type="button"
                    onClick={(e) => handleStagingCountChange(true, e)}
                    className={`p-1 rounded-full ${
                      isSelected 
                        ? 'hover:bg-blue-500' 
                        : hasError 
                          ? 'hover:bg-red-200' 
                          : 'hover:bg-gray-100'
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSelector;