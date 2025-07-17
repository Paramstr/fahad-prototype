import React, { useMemo } from 'react';

interface Service {
  id: string;
  name: string;
  cost: number;
  duration: string; // e.g., "3–5 days" or "2 days"
}

interface SummaryCardProps {
  services: Service[];
}

export default function SummaryCard({ services }: SummaryCardProps) {
  const { totalCost, totalServices } = useMemo(() => {
    const cost = services.reduce((sum, s) => sum + s.cost, 0);
    return { totalCost: cost, totalServices: services.length };
  }, [services]);

  return (
    <div className="card p-6 w-full md:max-w-xs">
      <h4 className="font-semibold text-midnight-900 mb-4">Order Summary</h4>
      <div className="space-y-2 text-sm text-midnight-600">
        <div className="flex justify-between">
          <span>Services</span>
          <span>{totalServices}</span>
        </div>
        <div className="flex justify-between font-medium text-midnight-900">
          <span>Total Cost</span>
          <span>€{totalCost}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-4">Prices are estimates for prototype purposes.</p>
    </div>
  );
} 