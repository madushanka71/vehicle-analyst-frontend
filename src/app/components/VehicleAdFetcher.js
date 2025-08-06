"use client";
import { useState, useEffect } from 'react';
import { findAds } from '../services/api';

export default function VehicleAds({ vehicle1, vehicle2, fetchTrigger }) {
  const [ads, setAds] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if both vehicles are provided
    if (vehicle1 && vehicle2) {
      setLoading(true);
      setError(null);
      
      async function fetchAds() {
        try {
          const result = await findAds(vehicle1, vehicle2);
          setAds(result.parsedAds);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchAds();
    }
  }, [vehicle1, vehicle2, fetchTrigger]); // Add fetchTrigger to dependencies

  if (!vehicle1 || !vehicle2) {
    return (
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 my-4">
        <p>Please enter both vehicles to see advertisements</p>
      </div>
    );
  }

  if (loading) return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4">
      <p>Error loading advertisements: {error}</p>
    </div>
  );

  if (!ads) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Market Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">
            {vehicle1} Listings ({ads.vehicle1_ads?.length || 0})
          </h3>
          {ads.vehicle1_ads?.map((ad, i) => (
            <AdCard key={i} ad={ad} />
          ))}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3">
            {vehicle2} Listings ({ads.vehicle2_ads?.length || 0})
          </h3>
          {ads.vehicle2_ads?.map((ad, i) => (
            <AdCard key={i} ad={ad} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AdCard({ ad }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h4 className="font-bold text-lg text-gray-400">{ad.title}</h4>
      <div className="flex gap-2 mt-1 text-sm text-gray-600">
        <span>{ad.price}</span>
        <span>•</span>
        <span>{ad.year}</span>
        <span>•</span>
        <span>{ad.mileage}</span>
      </div>
      <p className="mt-2 text-gray-700">{ad.description}</p>
      <a 
        href={ad.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block mt-2 text-blue-600 hover:underline"
      >
        View Original Ad
      </a>
    </div>
  );
}