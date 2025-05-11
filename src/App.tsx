import React, { useEffect, useState } from 'react';
import PackageBuilder from './components/PackageBuilder';
import SimplePackageBuilder from './components/SimplePackageBuilder';

function App() {
  const [showFullForm, setShowFullForm] = useState(false);

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
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4">
      {showFullForm ? (
        <PackageBuilder />
      ) : (
        <SimplePackageBuilder onShowFullForm={() => setShowFullForm(true)} />
      )}
    </div>
  );
}

export default App;