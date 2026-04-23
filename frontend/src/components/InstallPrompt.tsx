import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();  // This shows the banner
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted install');
        }
        setDeferredPrompt(null);
        setShowPrompt(false);
      });
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 p-4 animate-slide-up">
      <div className="flex gap-3">
        <div className="bg-emerald-100 p-2 rounded-xl">
          <Download className="h-6 w-6 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">Install KiranaConnect</h3>
          <p className="text-sm text-gray-500 mt-1">
            Install our app for faster checkout and order tracking
          </p>
          <div className="flex gap-3 mt-3">
            <button
              onClick={handleInstall}
              className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-emerald-700"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="text-gray-500 text-sm hover:text-gray-700"
            >
              Maybe later
            </button>
          </div>
        </div>
        <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;