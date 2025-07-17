import fetch from 'node-fetch';

// Extract location using Google Gemini API (mock for now)
export async function extractLocationGemini(description) {
  // For now, just return a hardcoded value for testing:
  return "Manhattan, NYC";
}

// Geocode using OpenStreetMap Nominatim (free, no API key needed)
export async function geocodeWithNominatim(location_name) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location_name)}`;
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'DisasterResponseApp/1.0' }
  });
  const data = await resp.json();
  if (data && data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
}