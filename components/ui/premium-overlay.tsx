'use client';

import { X } from "lucide-react";
import { Button } from "./button";

interface PremiumOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumOverlay({ isOpen, onClose }: PremiumOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 m-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
          <p className="text-gray-600 mb-6">
            Sorry, this view is only available to our premium plan users. Please contact us if you'd like to upgrade!
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={onClose}>
              Maybe Later
            </Button>
            <Button>
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 