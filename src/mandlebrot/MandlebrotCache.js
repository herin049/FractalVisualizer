import { DEFAULT_MAX_CACHE_SIZE } from '../constants.js';

class MandlebrotCache {
    constructor() {
        this.cache = new Map();
        this.maxCacheSize = DEFAULT_MAX_CACHE_SIZE;
    }

    hasBlock(x, y, zoom) {
        return this.cache.has(`${x} ${y} ${zoom}`);
    }

    addBlock(x, y, zoom, block) {
        this.cache.set(`${x} ${y} ${zoom}`, { x, y, zoom, data: block });
    }

    setMaxCacheSize(maxCacheSize) {
        this.maxCacheSize = maxCacheSize;
    }

    getCacheValues() {
        return this.cache.values();
    }

    clear() {
        this.cache.clear();
    }
}

const instance = new MandlebrotCache();
Object.freeze(instance);
export default instance;
