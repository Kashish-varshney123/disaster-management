import { extractLocationGemini, geocodeWithNominatim } from '../utils/geocode.js';

export async function geocodeLocation(req, res) {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: 'Description is required' });
  try {
    // 1. Extract location name using Gemini
    const location_name = await extractLocationGemini(description);
    if (!location_name) return res.status(404).json({ error: 'No location found in description' });
    // 2. Geocode location name to lat/lng
    const coords = await geocodeWithNominatim(location_name);
    if (!coords) return res.status(404).json({ error: 'Could not geocode location' });
    res.json({ location_name, ...coords });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
