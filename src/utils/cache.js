// backend/src/utils/cache.js
const NodeCache = require('node-cache');
const logger = require('./logger');

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

const cacheUtils = {
  set: (key, value, ttl = 3600) => {
    const success = cache.set(key, value, ttl);
    if (success) {
      logger.info(`Cache set: Key = ${key}, TTL = ${ttl} seconds`);
    } else {
      logger.warn(`Failed to set cache: Key = ${key}`);
    }
    return success;
  },

  get: (key) => {
    const value = cache.get(key);
    if (value) {
      logger.info(`Cache hit: Key = ${key}`);
    } else {
      logger.warn(`Cache miss: Key = ${key}`);
    }
    return value;
  },

  del: (key) => {
    const deleted = cache.del(key);
    if (deleted) {
      logger.info(`Cache deleted: Key = ${key}`);
    } else {
      logger.warn(`Failed to delete from cache: Key = ${key}`);
    }
    return deleted;
  },

  flush: () => {
    cache.flushAll();
    logger.info('Cache flushed: All keys cleared');
  },

  stats: () => {
    const stats = cache.getStats();
    logger.info('Cache Stats:', stats);
    return stats;
  }
};

module.exports = cacheUtils;
