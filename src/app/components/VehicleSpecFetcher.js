"use client";
import { useState, useEffect } from 'react';
import { compareVehicle } from '../services/api';

export default function VehicleSpecFetcher({ vehicle1, vehicle2, fetchTrigger }) {
  const [specs, setSpecs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if both vehicles are provided
    if (vehicle1 && vehicle2) {
      setLoading(true);
      setError(null);
      
      async function fetchSpecs() {
        try {
          const result = await compareVehicle(vehicle1, vehicle2);
          setSpecs(result.parsedData);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchSpecs();
    }
  }, [vehicle1, vehicle2, fetchTrigger]); // Added fetchTrigger to dependencies

  if (!vehicle1 || !vehicle2) {
    return (
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 my-4">
        <p>Enter two vehicles to compare specifications</p>
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
      <p>Error loading specifications: {error}</p>
    </div>
  );

  if (!specs) return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-4">
      <p>No specification data available for these vehicles</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-400 mb-2">
          {specs.vehicle[0].model_info.make} {specs.vehicle[0].model_info.model} vs {' '}
          {specs.vehicle[1].model_info.make} {specs.vehicle[1].model_info.model}
        </h1>
        <p className="text-xl text-gray-400">Detailed side-by-side comparison</p>
      </header>

      {/* Side-by-side Vehicle Comparison */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {/* Vehicle 1 */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {specs.vehicle[0].model_info.make} {specs.vehicle[0].model_info.model}
                </h2>
                <p className="text-gray-600">{specs.vehicle[0].model_info.year} {specs.vehicle[0].model_info.trim}</p>
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {specs.vehicle[0].model_info.vehicle_type}
              </div>
            </div>

            <div className="relative h-64 mb-6 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={specs.vehicle[0].model_info.image_url}
                alt={`${specs.vehicle[0].model_info.make} ${specs.vehicle[0].model_info.model}`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Key Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(specs.vehicle[0].key_specs).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-gray-500">{key.replace(/_/g, ' ')}</p>
                      <p className="font-medium text-gray-400">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 border-b pb-2">Pricing</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Base:</span> <span className="text-gray-400">{specs.vehicle[0].pricing.base_price}</span></p>
                  {specs.vehicle[0].pricing.as_tested && (
                    <p><span className="text-gray-600">As Tested:</span> <span className="text-gray-400">{specs.vehicle[0].pricing.as_tested}</span></p>
                  )}
                  <p className="text-green-600">{specs.vehicle[0].pricing.incentives}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 border-b pb-2">Ratings</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Reliability:</span> <span className="text-gray-400">{specs.vehicle[0].ratings.reliability.score}</span></p>
                  <p><span className="text-gray-600">Safety:</span> <span className="text-gray-400">{specs.vehicle[0].ratings.safety}</span></p>
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">User Rating:</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(parseFloat(specs.vehicle[0].user_rating)) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-gray-600">{specs.vehicle[0].user_rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle 2 */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {specs.vehicle[1].model_info.make} {specs.vehicle[1].model_info.model}
                </h2>
                <p className="text-gray-600">{specs.vehicle[1].model_info.year} <span className="text-gray-400">{specs.vehicle[1].model_info.trim}</span></p>
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {specs.vehicle[1].model_info.vehicle_type}
              </div>
            </div>

            <div className="relative h-64 mb-6 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={specs.vehicle[1].model_info.image_url}
                alt={`${specs.vehicle[1].model_info.make} ${specs.vehicle[1].model_info.model}`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Key Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(specs.vehicle[1].key_specs).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-gray-500">{key.replace(/_/g, ' ')}</p>
                      <p className="font-medium"><span className="text-gray-400">{value}</span></p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 border-b pb-2">Pricing</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Base:</span> <span className="text-gray-400">{specs.vehicle[1].pricing.base_price}</span></p>
                  {specs.vehicle[1].pricing.as_tested && (
                    <p><span className="text-gray-600">As Tested:</span> <span className="text-gray-400">{specs.vehicle[1].pricing.as_tested}</span></p>
                  )}
                  <p className="text-green-600">{specs.vehicle[1].pricing.incentives}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 border-b pb-2">Ratings</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Reliability:</span> <span className="text-gray-400">{specs.vehicle[1].ratings.reliability.score}</span></p>
                  <p><span className="text-gray-600">Safety:</span> <span className="text-gray-400">{specs.vehicle[1].ratings.safety}</span></p>
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">User Rating:</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(parseFloat(specs.vehicle[1].user_rating)) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-gray-600">{specs.vehicle[1].user_rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Differences Table */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Differences</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{specs.vehicle[0].model_info.model}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{specs.vehicle[1].model_info.model}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {specs.key_differences.map((diff, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{diff.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{diff.vehicle1}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{diff.vehicle2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pros & Cons Side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Vehicle 1 Pros & Cons */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {specs.vehicle[0].model_info.model} Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-600 border-b border-green-200 pb-2">Pros</h3>
              <ul className="space-y-2">
                {specs.vehicle[0].pros.map((pro, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-400">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-600 border-b border-red-200 pb-2">Cons</h3>
              <ul className="space-y-2">
                {specs.vehicle[0].cons.map((con, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-400">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Vehicle 2 Pros & Cons */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {specs.vehicle[1].model_info.model} Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-600 border-b border-green-200 pb-2">Pros</h3>
              <ul className="space-y-2">
                {specs.vehicle[1].pros.map((pro, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-400">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-600 border-b border-red-200 pb-2">Cons</h3>
              <ul className="space-y-2">
                {specs.vehicle[1].cons.map((con, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-400">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Verdict */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Expert Verdict</h2>
        <div className="space-y-6">
          {specs.vehicle.map((car, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {car.model_info.make} {car.model_info.model}
              </h3>
              <p className="text-gray-700">{car.expert_verdict}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}