import React from 'react';
import { Car, Bike, ShieldAlert } from 'lucide-react';

const VehicleBadge = ({ vehicleType }) => {
  const type = (vehicleType || '').toLowerCase();

  if (type === 'cars' || type === 'car accessories') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        <Car className="w-3 h-3" /> Car
      </span>
    );
  }
  if (type === 'scooters' || type === 'scooter accessories') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <Bike className="w-3 h-3" /> Scooter
      </span>
    );
  }
  if (type === 'motorcycles' || type === 'motorcycle accessories') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
        <Bike className="w-3 h-3" /> Motorcycle
      </span>
    );
  }
  return null;
};

export default VehicleBadge;
