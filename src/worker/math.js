import { CACHE_BLOCK_SIZE } from '../shared/constants.js';

const calcMandlebrotBlock = (blockX, blockY, blockZoom, maxIter) => {
    const blockData = new Float32Array(CACHE_BLOCK_SIZE * CACHE_BLOCK_SIZE);

    for (let i = 0; i < CACHE_BLOCK_SIZE; i += 1) {
        for (let j = 0; j < CACHE_BLOCK_SIZE; j += 1) {
            const x0 = blockX + i / blockZoom;
            const y0 = blockY + j / blockZoom;

            let x = x0;
            let y = y0;
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

            let x = x0;
            let y = y0;
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

const calcBurningShipBlock = (blockX, blockY, blockZoom, maxIter) => {
    const blockData = new Float32Array(CACHE_BLOCK_SIZE * CACHE_BLOCK_SIZE);

    for (let i = 0; i < CACHE_BLOCK_SIZE; i += 1) {
        for (let j = 0; j < CACHE_BLOCK_SIZE; j += 1) {
            const x0 = blockX + i / blockZoom;
            const y0 = blockY + j / blockZoom;

            let x = x0;
            let y = y0;
            let iter = 0;

            while (x * x + y * y <= 4 && iter < maxIter) {
                const t = x * x - y * y + x0;
                y = Math.abs(2 * x * y) + y0;
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

const calcBurningShipBlockSmooth = (blockX, blockY, blockZoom, maxIter) => {
    const blockData = new Float32Array(CACHE_BLOCK_SIZE * CACHE_BLOCK_SIZE);

    for (let i = 0; i < CACHE_BLOCK_SIZE; i += 1) {
        for (let j = 0; j < CACHE_BLOCK_SIZE; j += 1) {
            const x0 = blockX + i / blockZoom;
            const y0 = blockY + j / blockZoom;

            let x = x0;
            let y = y0;
            let iter = 0;

            while (x * x + y * y <= 2 ** 64 && iter < maxIter) {
                const t = x * x - y * y + x0;
                y = Math.abs(2 * x * y) + y0;
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

const calcMultibrotBlock = (blockX, blockY, blockZoom, maxIter) => {
    const blockData = new Float32Array(CACHE_BLOCK_SIZE * CACHE_BLOCK_SIZE);

    for (let i = 0; i < CACHE_BLOCK_SIZE; i += 1) {
        for (let j = 0; j < CACHE_BLOCK_SIZE; j += 1) {
            const x0 = blockX + i / blockZoom;
            const y0 = blockY + j / blockZoom;

            let x = x0;
            let y = y0;
            let iter = 0;

            while (x * x + y * y <= 4 && iter < maxIter) {
                const t = x ** 3 - 3 * x * y ** 2 + x0;
                y = 3 * x ** 2 * y - y ** 3 + y0;
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

const calcMultibrotBlockSmooth = (blockX, blockY, blockZoom, maxIter) => {
    const blockData = new Float32Array(CACHE_BLOCK_SIZE * CACHE_BLOCK_SIZE);

    for (let i = 0; i < CACHE_BLOCK_SIZE; i += 1) {
        for (let j = 0; j < CACHE_BLOCK_SIZE; j += 1) {
            const x0 = blockX + i / blockZoom;
            const y0 = blockY + j / blockZoom;

            let x = x0;
            let y = y0;
            let iter = 0;

            while (x * x + y * y <= 2 ** 64 && iter < maxIter) {
                const t = x ** 3 - 3 * x * y ** 2 + x0;
                y = 3 * x ** 2 * y - y ** 3 + y0;
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

const calcTricornBlock = (blockX, blockY, blockZoom, maxIter) => {
    const blockData = new Float32Array(CACHE_BLOCK_SIZE * CACHE_BLOCK_SIZE);

    for (let i = 0; i < CACHE_BLOCK_SIZE; i += 1) {
        for (let j = 0; j < CACHE_BLOCK_SIZE; j += 1) {
            const x0 = blockX + i / blockZoom;
            const y0 = blockY + j / blockZoom;

            let x = x0;
            let y = y0;
            let iter = 0;

            while (x * x + y * y <= 4 && iter < maxIter) {
                const t = x * x - y * y + x0;
                y = -2 * x * y + y0;
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

const calcTricornBlockSmooth = (blockX, blockY, blockZoom, maxIter) => {
    const blockData = new Float32Array(CACHE_BLOCK_SIZE * CACHE_BLOCK_SIZE);

    for (let i = 0; i < CACHE_BLOCK_SIZE; i += 1) {
        for (let j = 0; j < CACHE_BLOCK_SIZE; j += 1) {
            const x0 = blockX + i / blockZoom;
            const y0 = blockY + j / blockZoom;

            let x = x0;
            let y = y0;
            let iter = 0;

            while (x * x + y * y <= 2 ** 64 && iter < maxIter) {
                const t = x * x - y * y + x0;
                y = -2 * x * y + y0;
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

export {
    calcMandlebrotBlock,
    calcMandlebrotBlockSmooth,
    calcBurningShipBlock,
    calcBurningShipBlockSmooth,
    calcMultibrotBlock,
    calcMultibrotBlockSmooth,
    calcTricornBlock,
    calcTricornBlockSmooth,
};
