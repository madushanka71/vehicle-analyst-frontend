const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const compareVehicle = async (vehicle1, vehicle2) => {
  try {
    const response = await fetch(`${BASE_URL}/compare-vehicle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vehicle1, vehicle2 }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse the raw JSON data if exists (matching your API structure)
    if (data.result?.[1]?.raw) {
      data.parsedData = JSON.parse(data.result[1].raw);
    }

    return data;
  } catch (error) {
    console.error('Comparison error:', error);
    throw new Error('Failed to compare vehicles. Please try again.');
  }
};

export const findAds = async (vehicle1, vehicle2) => {
  try {
    const response = await fetch(`${BASE_URL}/find-ads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vehicle1, vehicle2 }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse structured ad data if exists
    if (data.result?.[2]?.raw) {
      data.parsedAds = JSON.parse(data.result[2].raw);
    }

    return data;
  } catch (error) {
    console.error('Ad search error:', error);
    throw new Error('Failed to fetch advertisements. Please try again.');
  }
};

// Helper function for GET requests (example)
export const getVehicleSuggestions = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/suggestions?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to fetch suggestions');
    return await response.json();
  } catch (error) {
    console.error('Suggestion error:', error);
    return [];
  }
};