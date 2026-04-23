// Get user's current location
export const getCurrentLocation = (): Promise<{lat: number; lng: number; address: string}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Get address from coordinates (reverse geocoding)
        const address = await getAddressFromCoordinates(lat, lng);
        
        resolve({ lat, lng, address });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

// Get address from coordinates using OpenStreetMap (Free, no API key)
export const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    
    if (data.display_name) {
      return data.display_name;
    }
    return `${lat}, ${lng}`;
  } catch (error) {
    console.error('Error getting address:', error);
    return `${lat}, ${lng}`;
  }
};

// Calculate distance between two coordinates (in km)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Get delivery fee based on distance
export const getDeliveryFee = (distance: number): number => {
  if (distance <= 3) return 30;
  if (distance <= 5) return 40;
  if (distance <= 8) return 60;
  if (distance <= 12) return 80;
  return 100;
};