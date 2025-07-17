import { supabase } from '../utils/supabase.js';
import { logAction } from '../utils/logger.js';

export async function createDisaster(req, res) {
  const { title, location_name, description, tags } = req.body;
  const owner_id = req.user.id;
  const audit_trail = [{ action: 'create', user_id: owner_id, timestamp: new Date().toISOString() }];
  const { data, error } = await supabase.from('disasters').insert([
    { title, location_name, description, tags, owner_id, audit_trail }
  ]).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  req.io.emit('disaster_updated', { type: 'create', data });
  logAction(`Disaster created: ${title} by ${owner_id}`);
  res.status(201).json(data);
}

export async function getDisasters(req, res) {
  const { tag } = req.query;
  let query = supabase.from('disasters').select('*');
  if (tag) query = query.contains('tags', [tag]);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
}

export async function updateDisaster(req, res) {
  const { id } = req.params;
  const { title, location_name, description, tags } = req.body;
  const user_id = req.user.id;
  // Fetch current
  const { data: current, error: fetchError } = await supabase.from('disasters').select('*').eq('id', id).single();
  if (fetchError || !current) return res.status(404).json({ error: 'Disaster not found' });
  const audit_trail = [...(current.audit_trail || []), { action: 'update', user_id, timestamp: new Date().toISOString() }];
  const { data, error } = await supabase.from('disasters').update({ title, location_name, description, tags, audit_trail }).eq('id', id).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  req.io.emit('disaster_updated', { type: 'update', data });
  logAction(`Disaster updated: ${id} by ${user_id}`);
  res.json(data);
}

export async function deleteDisaster(req, res) {
  const { id } = req.params;
  const user_id = req.user.id;
  // Fetch current
  const { data: current, error: fetchError } = await supabase.from('disasters').select('*').eq('id', id).single();
  if (fetchError || !current) return res.status(404).json({ error: 'Disaster not found' });
  const audit_trail = [...(current.audit_trail || []), { action: 'delete', user_id, timestamp: new Date().toISOString() }];
  const { error } = await supabase.from('disasters').update({ audit_trail }).eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  await supabase.from('disasters').delete().eq('id', id);
  req.io.emit('disaster_updated', { type: 'delete', id });
  logAction(`Disaster deleted: ${id} by ${user_id}`);
  res.json({ success: true });
}
