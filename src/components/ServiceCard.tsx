import React from 'react';

interface Service {
  id: string;
  name: string;
  cost: number; // in desired currency units
  duration: string; // e.g., "3–5 days"
  isOnline: boolean;
  requiresNotary: boolean;
  isDefault: boolean;
}

interface ServiceCardProps {
  service: Service;
  index: number;
  total: number;
  moveUp: (index: number) => void;
  moveDown: (index: number) => void;
  remove: (id: string) => void;
}

export default function ServiceCard({ service, index, total, moveUp, moveDown, remove }: ServiceCardProps) {
  const handleMoveUp = () => moveUp(index);
  const handleMoveDown = () => moveDown(index);
  const handleRemove = () => remove(service.id);

  return (
    <div className="flex items-start card p-4 mb-3">
      {/* Drag / move handles */}
      <div className="flex flex-col mr-4 space-y-1">
        <button
          onClick={handleMoveUp}
          disabled={index === 0}
          className="text-gray-400 hover:text-brand-600 disabled:opacity-30"
          aria-label="Move up"
        >
          ▲
        </button>
        <button
          onClick={handleMoveDown}
          disabled={index === total - 1}
          className="text-gray-400 hover:text-brand-600 disabled:opacity-30"
          aria-label="Move down"
        >
          ▼
        </button>
      </div>

      {/* Service details */}
      <div className="flex-1">
        <h5 className="font-semibold text-midnight-900 mb-1">
          {index + 1}. {service.name}
        </h5>
        <div className="text-sm text-midnight-600 space-x-4">
          <span>Cost: €{service.cost}</span>
          <span>Time: {service.duration}</span>
          <span>{service.isOnline ? 'Online' : 'Offline'}</span>
          {service.requiresNotary && <span>Notary required</span>}
        </div>
      </div>

      {/* Remove button */}
      {!service.isDefault && (
        <button
          onClick={handleRemove}
          className="ml-4 text-red-500 hover:text-red-600 text-sm font-medium"
          aria-label="Remove"
        >
          Remove
        </button>
      )}
    </div>
  );
} 