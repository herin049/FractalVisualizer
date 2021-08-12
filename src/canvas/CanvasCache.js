import { DEFAULT_MAX_CACHE_SIZE } from '../shared/constants.js';

class CanvasCache {
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

    addBlock(x, y, zoom, blockCanvas, loading, lastViewed) {
        this.cache.set(`${x} ${y} ${zoom}`, {
            x,
            y,
            zoom,
            blockCanvas,
            loading,
            lastViewed,
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
            const numToRemove = Math.min(this.cache.size * 0.5, 1000);

            const orderedBlocks = [...this.cache].sort(
                (a, b) => b[1].lastViewed - a[1].lastViewed
            );
            let i = 0;

            while (i < numToRemove && orderedBlocks.length > 0) {
                const removedBlock = orderedBlocks.pop();
                this.cache.delete(removedBlock[0]);
                i += 1;
            }
        }
    }

    clear() {
        this.cache.clear();
    }
}

const instance = new CanvasCache();
export default instance;
