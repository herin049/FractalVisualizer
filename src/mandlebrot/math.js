import { CACHE_BLOCK_SIZE } from '../shared/constants.js';

const calcMandlebrotBlock = (blockX, blockY, blockZoom, maxIter) => {
    const blockData = new Float32Array(CACHE_BLOCK_SIZE * CACHE_BLOCK_SIZE);

    for (let i = 0; i < CACHE_BLOCK_SIZE; i += 1) {
        for (let j = 0; j < CACHE_BLOCK_SIZE; j += 1) {
            const x0 = blockX + i / blockZoom;
            const y0 = blockY + j / blockZoom;

            let x = 0;
            let y = 0;
            let iter = 0;

            while (x * x + y * y <= 4 && iter < maxIter) {
                const t = x * x - y * y + x0;
                y = 2 * x * y + y0;
                x = t;
                iter += 1;
            }

            if (iter >= maxIter) {
                iter = 0;
            }

            blockData[i + CACHE_BLOCK_SIZE * j] = iter;
        }
    }

    return blockData;
};

const calcMandlebrotBlockSmooth = (blockX, blockY, blockZoom, maxIter) => {
    const blockData = new Float32Array(CACHE_BLOCK_SIZE * CACHE_BLOCK_SIZE);

    for (let i = 0; i < CACHE_BLOCK_SIZE; i += 1) {
        for (let j = 0; j < CACHE_BLOCK_SIZE; j += 1) {
            const x0 = blockX + i / blockZoom;
            const y0 = blockY + j / blockZoom;

            let x = 0;
            let y = 0;
            let iter = 0;

            while (x * x + y * y <= 2 ** 64 && iter < maxIter) {
                const t = x * x - y * y + x0;
                y = 2 * x * y + y0;
                x = t;
                iter += 1;
            }

            if (iter < maxIter) {
                const nu = Math.log2(Math.log(x * x + y * y));
                if (!Number.isNaN(nu)) {
                    iter = iter + 6 - nu;
                } else {
                    iter = 0;
                }
            } else {
                iter = 0;
            }

            blockData[i + CACHE_BLOCK_SIZE * j] = iter;
        }
    }

    return blockData;
};

export { calcMandlebrotBlock, calcMandlebrotBlockSmooth };
