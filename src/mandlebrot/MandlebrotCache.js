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

    addBlock(x, y, zoom, blockData, blockCanvas, loading) {
        this.cache.set(`${x} ${y} ${zoom}`, {
            x,
            y,
            zoom,
            blockData,
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

    clear() {
        this.cache.clear();
    }
}

const instance = new MandlebrotCache();
Object.freeze(instance);
export default instance;
