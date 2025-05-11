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
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4">
      <PackageBuilder />
    </div>
  );
}

export default App;