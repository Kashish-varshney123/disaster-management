import fetch from 'node-fetch';
import xml2js from 'xml2js';
import { supabase } from '../utils/supabase.js';
import { logAction } from '../utils/logger.js';

const CACHE_KEY = 'official_updates';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const SOURCES = [
  {
    name: 'ReliefWeb',
    url: 'https://reliefweb.int/updates/rss.xml',
    type: 'rss',
  }
];

export async function getOfficialUpdates(req, res) {
  const parser = new xml2js.Parser();
  let allUpdates = [];

  // 1. Try cache first
  try {
    const { data: cacheRow, error: cacheError } = await supabase
      .from('api_cache')
      .select('*')
      .eq('cache_key', CACHE_KEY)
      .single();
    if (cacheRow && cacheRow.data && cacheRow.updated_at && (Date.now() - new Date(cacheRow.updated_at).getTime() < CACHE_TTL_MS)) {
      logAction('Official updates cache hit');
      return res.json(cacheRow.data);
    }
    logAction('Official updates cache miss or expired');
  } catch (err) {
    logAction('Cache lookup error: ' + err.message);
  }

  // 2. Fetch from external APIs if cache miss/stale
  for (const source of SOURCES) {
    try {
      const resp = await fetch(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        }
      });
      const contentType = resp.headers.get('content-type') || '';
      const status = resp.status;
      if (!resp.ok) throw new Error(`HTTP ${status}`);
      if (!contentType.includes('xml')) throw new Error(`Content-Type not XML: ${contentType}`);
      const xml = await resp.text();
      let feed;
      try {
        feed = await parser.parseStringPromise(xml);
      } catch (err) {
        throw new Error(`XML Parse Error: ${err.message}`);
      }
      const channel = feed.rss && feed.rss.channel && feed.rss.channel[0];
      if (!channel || !channel.item) throw new Error('Invalid RSS structure');
      const items = channel.item.map(item => ({
        source: source.name,
        title: item.title ? item.title[0] : 'No Title',
        link: item.link ? item.link[0] : '',
        pubDate: item.pubDate ? item.pubDate[0] : '',
        description: item.description ? item.description[0] : ''
      }));
      allUpdates = allUpdates.concat(items);
      logAction(`Official updates fetched from ${source.name}`);
    } catch (e) {
      allUpdates.push({
        source: source.name,
        title: 'Failed to fetch updates',
        link: source.url,
        pubDate: '',
        description: (e && e.message) ? e.message : 'Unknown error'
      });
      logAction(`Official updates error for ${source.name}: ${e && e.message}`);
    }
  }
  allUpdates.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // 3. Save to cache
  try {
    await supabase.from('api_cache').upsert({
      cache_key: CACHE_KEY,
      data: allUpdates,
      updated_at: new Date().toISOString()
    }, { onConflict: ['cache_key'] });
    logAction('Official updates cache updated');
  } catch (err) {
    logAction('Cache update error: ' + err.message);
  }
  res.json(allUpdates);
}
