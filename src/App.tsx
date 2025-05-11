import React, { useEffect } from 'react';
import PackageBuilder from './components/PackageBuilder';

function App() {
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <PackageBuilder />
    </div>
  );
}

export default App;
