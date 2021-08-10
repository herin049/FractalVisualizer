import { DEFAULT_MAX_CACHE_SIZE } from '../shared/constants.js';

class MandlebrotCache {
    constructor() {
        this.cache = new Map();
        this.maxCacheSize = DEFAULT_MAX_CACHE_SIZE;
    }

    hasBlock(x, y, zoom) {
        return this.cache.has(`${x} ${y} ${zoom}`);
    }

    removeBlock(x, y, zoom) {
        return this.cache.delete(`${x} ${y} ${zoom}`);
    }

    addBlock(x, y, zoom, blockCanvas, loading) {
        this.cache.set(`${x} ${y} ${zoom}`, {
            x,
            y,
            zoom,
            blockCanvas,
            loading,
        });
    }

    setMaxCacheSize(maxCacheSize) {
        this.maxCacheSize = maxCacheSize;
    }

    getCacheMap() {
        return this.cache;
    }

    filterCache() {
        if (this.cache.size > this.maxCacheSize) {
            const numToRemove =
                this.cache.size -
                Math.max(0.5 * this.maxCacheSize, this.maxCacheSize - 1000);
            let i = 0;
            const keysIterator = this.cache.keys();
            while (i < numToRemove && !keysIterator.done) {
                this.cache.delete(keysIterator.next().value);
                i += 1;
            }
        }
    }

    clear() {
        this.cache.clear();
    }
}

const instance = new MandlebrotCache();
Object.freeze(instance);
export default instance;
