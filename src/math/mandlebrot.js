import { CACHE_BLOCK_SIZE } from '../constants.js';

const calcMandlebrot = (x0, y0, maxIter) => {
    let x = 0;
    let y = 0;
    let iter = 0;

    while (x * x + y * y <= 4 && iter < maxIter) {
        const t = x * x - y * y + x0;
        y = 2 * x * y + y0;
        x = t;
        iter += 1;
    }
    return iter;
};

const calcMandlebrotBlock = (x, y, zoom, maxIter) => {
    const block = new Uint16Array(CACHE_BLOCK_SIZE * CACHE_BLOCK_SIZE);

    for (let i = 0; i < CACHE_BLOCK_SIZE; i += 1) {
        for (let j = 0; j < CACHE_BLOCK_SIZE; j += 1) {
            block[i + CACHE_BLOCK_SIZE * j] = calcMandlebrot(
                x + i / zoom,
                y + j / zoom,
                maxIter
            );
        }
    }

    return block;
};

export { calcMandlebrot, calcMandlebrotBlock };
