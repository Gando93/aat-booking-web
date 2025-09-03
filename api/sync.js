import { Redis } from '@upstash/redis';

// Initialize Redis client with environment variables
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Helper function to deduplicate arrays based on ID and keep most recent
function deduplicateArray(array, key) {
  const seen = new Map();
  
  for (const item of array) {
    const id = item[key];
    const existing = seen.get(id);
    
    if (!existing) {
      seen.set(id, item);
    } else {
      // Keep the most recently updated item
      const existingTime = new Date(existing.updatedAt || existing.createdAt || '').getTime();
      const itemTime = new Date(item.updatedAt || item.createdAt || '').getTime();
      
      if (itemTime > existingTime) {
        seen.set(id, item);
      }
    }
  }
  
  return Array.from(seen.values());
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Get data from Redis
      const cloudData = await redis.get('aat-booking-data');
      
      if (!cloudData) {
        // Return empty data structure if no data exists
        const emptyData = {
          bookings: [],
          services: [],
          users: [],
          lastModified: new Date().toISOString(),
          version: 1,
          deviceId: 'server'
        };
        return res.status(200).json(emptyData);
      }

      return res.status(200).json(cloudData);
    }

    if (req.method === 'POST') {
      // Save/merge data to Redis
      const { bookings = [], services = [], users = [], deviceId = 'unknown' } = req.body || {};

      // Get existing data
      const existingData = await redis.get('aat-booking-data');

      let mergedData;

      if (existingData) {
        // Merge with deduplication
        mergedData = {
          bookings: deduplicateArray([...existingData.bookings, ...bookings], 'id'),
          services: deduplicateArray([...existingData.services, ...services], 'id'),
          users: deduplicateArray([...existingData.users, ...users], 'id'),
          lastModified: new Date().toISOString(),
          version: existingData.version + 1,
          deviceId
        };
      } else {
        // First time saving
        mergedData = {
          bookings,
          services,
          users,
          lastModified: new Date().toISOString(),
          version: 1,
          deviceId
        };
      }

      // Save to Redis
      await redis.set('aat-booking-data', mergedData);

      return res.status(200).json({ 
        success: true, 
        message: 'Data synced successfully',
        version: mergedData.version,
        lastModified: mergedData.lastModified,
        recordCount: {
          bookings: mergedData.bookings.length,
          services: mergedData.services.length,
          users: mergedData.users.length
        }
      });
    }

    if (req.method === 'DELETE') {
      // Clear all data
      await redis.del('aat-booking-data');
      return res.status(200).json({ success: true, message: 'Data cleared successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Sync API error:', error);
    
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      debug: {
        method: req.method,
        hasUrl: !!process.env.KV_REST_API_URL,
        hasToken: !!process.env.KV_REST_API_TOKEN,
        errorType: error.constructor.name
      }
    });
  }
}
