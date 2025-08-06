'use client';

import { useState } from 'react';
import VehicleSpecs from '../app/components/VehicleSpecFetcher';
import VehicleAds from '../app/components/VehicleAdFetcher';

export default function VehicleComparison() {
  const [inputVehicle1, setInputVehicle1] = useState('Toyota Aqua');
  const [inputVehicle2, setInputVehicle2] = useState('Honda Fit');
  const [vehicle1, setVehicle1] = useState('');
  const [vehicle2, setVehicle2] = useState('');
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<'comparison' | 'ads'>('comparison');

  const handleCompare = () => {
    setVehicle1(inputVehicle1);
    setVehicle2(inputVehicle2);
    setFetchTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Vehicle Comparison Tool
      </h1>

      {/* Input Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          value={inputVehicle1}
          onChange={(e) => setInputVehicle1(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Enter first vehicle"
        />
        <input
          type="text"
          value={inputVehicle2}
          onChange={(e) => setInputVehicle2(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Enter second vehicle"
        />
        <button
          onClick={handleCompare}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Compare Vehicles
        </button>
      </div>

      {/* Tabs Section */}
      {(vehicle1 && vehicle2) && (
        <div>
          {/* Tab Headers */}
          <div className="flex border-b mb-4">
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-4 py-2 font-semibold ${
                activeTab === 'comparison'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Expert Comparison
            </button>
            <button
              onClick={() => setActiveTab('ads')}
              className={`px-4 py-2 font-semibold ${
                activeTab === 'ads'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Local Market Ads
            </button>
          </div>

          {/* Tab Content - Keep both mounted to prevent unnecessary re-fetch */}
          <div>
            <div className={activeTab === 'comparison' ? '' : 'hidden'}>
              <VehicleSpecs
                vehicle1={vehicle1}
                vehicle2={vehicle2}
                fetchTrigger={fetchTrigger}
              />
            </div>
            <div className={activeTab === 'ads' ? '' : 'hidden'}>
              <VehicleAds
                vehicle1={vehicle1}
                vehicle2={vehicle2}
                fetchTrigger={fetchTrigger}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
