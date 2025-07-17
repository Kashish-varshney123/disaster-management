import { supabase } from '../utils/supabase.js';

// Create a new resource
export async function createResource(req, res) {
  const { name, type, description, lat, lng } = req.body;
  if (!name || !type || !lat || !lng) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const point = `SRID=4326;POINT(${lng} ${lat})`;
  const { data, error } = await supabase
    .from('resources')
    .insert([{ name, type, description, location: point }])
    .select('*')
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
}

// Get nearby resources
export async function getNearbyResources(req, res) {
  const { lat, lng, radius } = req.query;
  if (!lat || !lng || !radius) {
    return res.status(400).json({ error: 'lat, lng, and radius are required' });
  }
  // Use Supabase RPC to call the Postgres function
  const { data, error } = await supabase
    .rpc('get_resources_nearby', {
      lat: Number(lat),
      lng: Number(lng),
      radius_meters: Number(radius)
    });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
}
