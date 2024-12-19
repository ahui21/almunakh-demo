'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

export function MobileWarning() {
  const [showWarning, setShowWarning] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md relative">
            <button 
              onClick={() => setShowWarning(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-2">Desktop Recommended</h2>
            <p className="text-gray-600">
              For the best experience, please use this dashboard on a desktop. 
              Some features may not work as intended on smaller screens.
            </p>
          </div>
        </div>
      )}
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-semibold text-center mb-4">
          Almunakh Dashboard Preview
        </h1>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/images/product-screenshot.png"
            alt="Dashboard Preview"
            width={1920}
            height={1080}
            className="w-full h-auto"
            priority
          />
        </div>
        <p className="text-sm text-gray-500 text-center mt-4">
          To display detailed data visualizations, our features need a larger screen. Please use a desktop for full access and functionality.
        </p>
      </div>
    </div>
  );
} 