import React, { useState } from 'react';
import { Service, PropertySize } from '../types';
import { getServiceIcon } from '../utils/serviceIcons';
import { Plus, Minus, AlertCircle, PackageOpen } from 'lucide-react';
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
  const [bulkMode, setBulkMode] = useState<boolean>(false);

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
      onServiceToggle(service, bulkMode ? 1 : undefined);
    }
  };

  const handleQuantityChange = (serviceName: string, increment: boolean) => {
    const serviceData = selectedServices.get(serviceName);
    if (serviceData) {
      const service = services.find(s => s.name === serviceName);
      if (service) {
        const newCount = increment ? serviceData.count + 1 : Math.max(1, serviceData.count - 1);
        onServiceToggle(service, newCount);
      }
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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <h2 className={`text-base font-medium ${hasError ? 'text-red-600' : 'text-gray-800'}`}>
            Select Your Services
          </h2>
          {hasError && (
            <AlertCircle className="w-4 h-4 text-red-500 ml-2" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <PackageOpen className={`w-4 h-4 ${bulkMode ? 'text-blue-600' : 'text-gray-500'}`} />
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={bulkMode}
              onChange={(e) => setBulkMode(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-2 text-sm font-medium text-gray-600">
              Bulk Booking
            </span>
          </label>
        </div>
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
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-800 border border-gray-200 hover:border-blue-300 hover:shadow-sm'
                }
              `}
            >
              <div className="mb-2">
                <ServiceIcon className={`w-6 h-6 ${
                  isSelected 
                    ? 'text-white' 
                    : 'text-blue-600 group-hover:text-blue-500'
                }`} />
              </div>
              <span className="text-xs font-medium text-center mb-1">{service.name}</span>
              <span className={`text-xs ${
                isSelected 
                  ? 'text-blue-100'
                  : 'text-gray-500'
              }`}>
                ${price.toFixed(2)}
              </span>
              
              {(service.id === 'virtualStaging' || (bulkMode && isSelected)) && (
                <div className={`absolute top-1 right-1 flex items-center gap-1 ${
                  isSelected ? 'text-white' : 'text-gray-600'
                }`}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (service.id === 'virtualStaging') {
                        handleStagingCountChange(false, e);
                      } else {
                        handleQuantityChange(service.name, false);
                      }
                    }}
                    className={`p-1 rounded-full ${
                      isSelected 
                        ? 'hover:bg-blue-500'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-medium min-w-[12px] text-center">
                    {service.id === 'virtualStaging' ? stagingCount : serviceData?.count || 1}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (service.id === 'virtualStaging') {
                        handleStagingCountChange(true, e);
                      } else {
                        handleQuantityChange(service.name, true);
                      }
                    }}
                    className={`p-1 rounded-full ${
                      isSelected 
                        ? 'hover:bg-blue-500'
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
      {bulkMode && (
        <p className="mt-2 text-sm text-gray-600">
          Tip: Click on a service and use the + / - buttons to add multiple shoots
        </p>
      )}
    </div>
  );
};

export default ServiceSelector;