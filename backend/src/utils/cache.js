const redisClient = require('../config/redis');

const invalidateUserCache = async (userId) => {
  try {
    const keys = await redisClient.keys(`analytics:*:${userId}*`);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};

const invalidateAllAnalyticsCache = async () => {
  try {
    const keys = await redisClient.keys('analytics:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};

const getCachedData = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

const setCachedData = async (key, data, ttl = 3600) => {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

module.exports = {
  invalidateUserCache,
  invalidateAllAnalyticsCache,
  getCachedData,
  setCachedData
};