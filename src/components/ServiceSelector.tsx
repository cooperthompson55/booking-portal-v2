import React, { useState } from 'react';
import { Service, PropertySize } from '../types';
import { getServiceIcon } from '../utils/serviceIcons';
import { Plus, Minus, AlertCircle } from 'lucide-react';
import { pricingData } from '../data/pricing';

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

  const getServicePrice = (service: Service): number => {
    if (!selectedSize) return service.price;
    return pricingData[selectedSize][service.id];
  };

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
    <div>
      <div className="flex items-center mb-3">
        <h2 className={`text-base font-medium ${hasError ? 'text-red-600' : 'text-gray-800'}`}>
          Select Your Services
        </h2>
        {hasError && (
          <AlertCircle className="w-4 h-4 text-red-500 ml-2" />
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {services.map((service) => {
          const serviceData = selectedServices.get(service.name);
          const isSelected = !!serviceData;
          const ServiceIcon = getServiceIcon(service.id);
          const price = getServicePrice(service);
          
          return (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service)}
              className={`
                group relative flex flex-col items-center justify-center p-3
                rounded-md transition-all duration-200 ease-in-out cursor-pointer
                ${isSelected 
                  ? 'bg-accent text-white shadow-sm' 
                  : 'bg-white text-gray-800 border border-gray-200 hover:border-accent hover:shadow-sm'
                }
              `}
            >
              <div className="mb-2">
                <ServiceIcon className={`w-6 h-6 ${
                  isSelected 
                    ? 'text-white' 
                    : 'text-accent group-hover:text-accent-dark'
                }`} />
              </div>
              <span className="text-xs font-medium text-center mb-1">{service.name}</span>
              <span className={`text-xs ${
                isSelected 
                  ? 'text-white/90'
                  : 'text-gray-500'
              }`}>
                ${price.toFixed(2)}
              </span>
              
              {service.id === 'virtualStaging' && (
                <div className={`absolute top-1 right-1 flex items-center gap-1 ${
                  isSelected ? 'text-white' : 'text-gray-600'
                }`}>
                  <button
                    type="button"
                    onClick={(e) => handleStagingCountChange(false, e)}
                    className={`p-1 rounded-full ${
                      isSelected 
                        ? 'hover:bg-accent-dark'
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
                        ? 'hover:bg-accent-dark'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSelector;