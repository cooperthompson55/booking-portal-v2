import { useState, useCallback, useMemo } from 'react';
import { Service, PropertySize, OrderFormData } from '../types';
import { pricingData } from '../data/pricing';
import { services } from '../data/services';

const initialFormData: OrderFormData = {
  address: {
    street: '',
    street2: '',
    city: '',
    state: '',
    zipCode: '',
  },
  occupancyStatus: 'Vacant',
  preferredDate: '',
  propertyNotes: '',
};

interface ServiceCount {
  price: number;
  count: number;
}

export const usePackageBuilder = () => {
  const [selectedSize, setSelectedSize] = useState<PropertySize | null>(null);
  const [selectedServices, setSelectedServices] = useState<Map<string, ServiceCount>>(new Map());
  const [formData, setFormData] = useState<OrderFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!selectedSize) {
      errors.push('Please select a property size');
    }

    if (selectedServices.size === 0) {
      errors.push('Please select at least one service');
    }

    if (!formData.address.street) {
      errors.push('Please enter the street address');
    }

    if (!formData.address.city) {
      errors.push('Please enter the city');
    }

    if (!formData.address.state) {
      errors.push('Please enter the state');
    }

    if (!formData.address.zipCode) {
      errors.push('Please enter the postal code');
    }

    if (!formData.preferredDate) {
      errors.push('Please select a preferred date');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSizeSelect = useCallback((size: PropertySize) => {
    setSelectedSize(size);
    setValidationErrors([]);
    
    // Update prices for all currently selected services based on new size
    setSelectedServices(prev => {
      const updated = new Map<string, ServiceCount>();
      prev.forEach((serviceData, serviceName) => {
        const service = services.find(s => s.name === serviceName);
        if (service) {
          updated.set(serviceName, {
            price: pricingData[size][service.id],
            count: serviceData.count
          });
        }
      });
      return updated;
    });
  }, []);

  const handleServiceToggle = useCallback((service: Service, count: number = 1) => {
    if (!selectedSize) return; // Prevent adding services without a size selected
    
    setValidationErrors([]);
    setSelectedServices(prev => {
      const updated = new Map(prev);
      
      if (updated.has(service.name)) {
        updated.delete(service.name);
      } else {
        updated.set(service.name, {
          price: pricingData[selectedSize][service.id],
          count
        });
      }
      
      return updated;
    });
  }, [selectedSize]);

  const handleAddressChange = useCallback((field: keyof OrderFormData['address'], value: string) => {
    setValidationErrors([]);
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  }, []);

  const handleFormChange = useCallback((field: keyof Omit<OrderFormData, 'address'>, value: any) => {
    setValidationErrors([]);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const totalPrice = useMemo(() => {
    let total = 0;
    selectedServices.forEach(serviceData => {
      total += serviceData.price * serviceData.count;
    });
    return total;
  }, [selectedServices]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Format services as a simple string for Google Sheets
      const servicesStr = Array.from(selectedServices.entries())
        .map(([name, data]) => `${name} ($${data.price} x ${data.count})`)
        .join(', ');

      const fullAddress = [
        formData.address.street,
        formData.address.street2,
        formData.address.city,
        formData.address.state,
        formData.address.zipCode
      ].filter(Boolean).join(', ');

      const formattedDate = new Date(formData.preferredDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const payload = {
        timestamp: new Date().toISOString(),
        propertySize: selectedSize,
        services: servicesStr,
        totalAmount: totalPrice.toFixed(2),
        address: fullAddress,
        notes: formData.propertyNotes || 'No additional notes',
        preferredDate: formattedDate,
        propertyStatus: formData.occupancyStatus
      };

      // Use URLSearchParams to send data in a format that Google Sheets can handle
      const formData = new URLSearchParams();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      await fetch(
        "https://script.google.com/macros/s/AKfycbwDSmFp7yzOlnyJuohNyssQnTQJm8gDWNC6gIrAbUqM3gSM4i3T1jqsexFbHnjGUgC_1Q/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      // Wait a bit to ensure the request has time to process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedSize, selectedServices, totalPrice, isSubmitting, validateForm]);

  const handleReset = useCallback(() => {
    setSelectedServices(new Map());
    setFormData(initialFormData);
    setSelectedSize(null);
    setShowSuccess(false);
    setValidationErrors([]);
  }, []);

  return {
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
  };
};