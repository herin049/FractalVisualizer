import { CACHE_BLOCK_SIZE } from './constants.js';

const mapBlockToCanvas = (block) => {
    const canvas = document.createElement('canvas');

    canvas.height = CACHE_BLOCK_SIZE;
    canvas.width = CACHE_BLOCK_SIZE;

    const canvasCtx = canvas.getContext('2d');
    const imageData = canvasCtx.getImageData(
        0,
        0,
        CACHE_BLOCK_SIZE,
        CACHE_BLOCK_SIZE
    );

    const { data } = imageData;

    for (let i = 0; i < CACHE_BLOCK_SIZE * CACHE_BLOCK_SIZE; i += 1) {
        data[i * 4] = (block[i] % 32) * 7;
        data[i * 4 + 1] = (block[i] % 32) * 7;
        data[i * 4 + 2] = (block[i] % 32) * 7;
        data[i * 4 + 3] = 255;
    }

    canvasCtx.putImageData(imageData, 0, 0);
    return canvas;
};

export { mapBlockToCanvas };
