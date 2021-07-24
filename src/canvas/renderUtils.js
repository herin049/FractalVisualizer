import { CACHE_BLOCK_SIZE } from '../mandlebrot/constants';

export const renderBlock = (
    { x, y, zoom, blockCanvas },
    canvasCtx,
    currentZoom,
    x0,
    y0,
    x1,
    y1
) => {
    if (
        x < x1 &&
        y < y1 &&
        x + CACHE_BLOCK_SIZE / zoom > x0 &&
        y + CACHE_BLOCK_SIZE / zoom > y0
    ) {
        let sx0 = 0;
        let sy0 = 0;

        if (x < x0) {
            sx0 = (x0 - x) * zoom;
        }

        if (y < y0) {
            sy0 = (y0 - y) * zoom;
        }

        let sx1 = CACHE_BLOCK_SIZE - 1;
        let sy1 = CACHE_BLOCK_SIZE - 1;

        if (x + (CACHE_BLOCK_SIZE - 1) / zoom > x1) {
            sx1 -= (x + (CACHE_BLOCK_SIZE - 1) / zoom - x1) * zoom;
        }

        if (y + CACHE_BLOCK_SIZE / zoom > y1) {
            sy1 -= (y + (CACHE_BLOCK_SIZE - 1) / zoom - y1) * zoom;
        }

        const sWidth = sx1 - sx0 + 1;
        const sHeight = sy1 - sy0 + 1;

        let dx = 0;
        let dy = 0;

        if (x > x0) {
            dx = (x - x0) * currentZoom;
        }

        if (y > y0) {
            dy = (y - y0) * currentZoom;
        }

        const dWidth = (sWidth / zoom) * currentZoom;
        const dHeight = (sHeight / zoom) * currentZoom;

        canvasCtx.drawImage(
            blockCanvas,
            sx0,
            sy0,
            sWidth,
            sHeight,
            dx,
            dy,
            dWidth,
            dHeight
        );
    }
};
