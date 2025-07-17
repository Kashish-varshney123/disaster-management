import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://uitunsvmbbgdpquiguoy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpdHVuc3ZtYmJnZHBxdWlndW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NzYzNjIsImV4cCI6MjA2ODI1MjM2Mn0.LYEIcVLKelAWMw_Bw-F6-eopaNI8pk2Kj1jc33yTsAM'
);