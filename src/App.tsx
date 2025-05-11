import React, { useEffect } from 'react';
import PackageBuilder from './components/PackageBuilder';
import SimplePackageBuilder from './components/SimplePackageBuilder';
import { usePackageBuilder } from './hooks/usePackageBuilder';

function App() {
  const packageBuilderState = usePackageBuilder();
  const [showFullForm, setShowFullForm] = React.useState(false);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      window.parent.postMessage(
        {
          type: 'resize',
          height: document.documentElement.scrollHeight,
        },
        '*'
      );
    });

    resizeObserver.observe(document.body);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-6">
      <div className="container mx-auto">
        {showFullForm ? (
          <PackageBuilder {...packageBuilderState} />
        ) : (
          <SimplePackageBuilder 
            onShowFullForm={() => setShowFullForm(true)}
            selectedSize={packageBuilderState.selectedSize}
            selectedServices={packageBuilderState.selectedServices}
            totalPrice={packageBuilderState.totalPrice}
            validationErrors={packageBuilderState.validationErrors}
            handleSizeSelect={packageBuilderState.handleSizeSelect}
            handleServiceToggle={packageBuilderState.handleServiceToggle}
          />
        )}
      </div>
    </div>
  );
}

export default App;