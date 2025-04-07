/**
 * Utility service for handling data caching with expiration
 */
class CacheService {
  /**
   * Set data in cache with expiration
   * @param key Cache key
   * @param data Data to cache
   * @param expirationHours Number of hours until cache expires (default: 6)
   */
  setWithExpiry(key: string, data: any, expirationHours = 6): void {
    const now = new Date();
    const item = {
      value: data,
      expiry: now.getTime() + (expirationHours * 60 * 60 * 1000),
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  /**
   * Get data from cache if not expired
   * @param key Cache key
   * @returns Cached data or null if expired/not found
   */
  getWithExpiry(key: string): any {
    const itemStr = localStorage.getItem(key);
    
    // Return null if item doesn't exist
    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();
    
    // Return null if expired
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  }

  /**
   * Clear specific cache item
   * @param key Cache key
   */
  clearCache(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear all cache items that start with a prefix
   * @param prefix Cache key prefix
   */
  clearCacheByPrefix(prefix: string): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    }
  }

  // Check if a specific cache key exists
  hasKey(key: string): boolean {
    return !!localStorage.getItem(`cache_${key}`);
  }

  // Clear a specific cache item
  clearItem(key: string): void {
    localStorage.removeItem(`cache_${key}`);
  }

  // Clear all cache items
  clearAll(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

export default new CacheService(); 