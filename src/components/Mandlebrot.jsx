import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import MandlebrotCache from '../mandlebrot/MandlebrotCache.js';
import { CACHE_BLOCK_SIZE, MIN_ZOOM } from '../mandlebrot/constants.js';
import { calcMandlebrotBlockSmooth } from '../mandlebrot/math.js';
import { mapBlockToCanvas, standardPallet } from '../mandlebrot/pallet.js';

const Mandlebrot = ({ width, height }) => {
    const canvasRef = useRef(null);

    const [reStart, setReStart] = useState(-3);
    const [reEnd, setReEnd] = useState(1);
    const [imStart, setImStart] = useState(-1.5);
    const [imEnd, setImEnd] = useState(1.5);

    const handleScroll = e => {
        const canvasRect = canvasRef.current.getBoundingClientRect();

        const canvasX = e.pageX - canvasRect.left;
        const canvasY = e.pageY - canvasRect.top;

        const dx = canvasX / width;
        const dy = canvasY / height;

        const currentWidth = reEnd - reStart;
        const currentHeight = imEnd - imStart;

        const currentZoom = width / currentWidth;
        const zoomMultiplier = 1 - e.deltaY / 1000;
        const newZoom = Math.max(currentZoom * zoomMultiplier, MIN_ZOOM);

        const newWidth = width / newZoom;
        const newHeight = height / newZoom;

        setReStart(reStart + currentWidth * dx - newWidth * dx);
        setReEnd(reStart + currentWidth * dx - newWidth * dx + newWidth);
        setImStart(imStart + currentHeight * dy - newHeight * dy);
        setImEnd(imStart + currentHeight * dy - newHeight * dy + newHeight);
    };

    const renderBlock = (
        { x, y, zoom, blockCanvas },
        canvasCtx,
        blurCanvas,
        blurContext,
        currentZoom
    ) => {
        if (
            x < reEnd &&
            y < imEnd &&
            x + CACHE_BLOCK_SIZE / zoom > reStart &&
            y + CACHE_BLOCK_SIZE / zoom > imStart
        ) {
            let sx0 = 0;
            let sy0 = 0;

            if (x < reStart) {
                sx0 = (reStart - x) * zoom;
            }

            if (y < imStart) {
                sy0 = (imStart - y) * zoom;
            }

            let sx1 = CACHE_BLOCK_SIZE - 1;
            let sy1 = CACHE_BLOCK_SIZE - 1;

            if (x + (CACHE_BLOCK_SIZE - 1) / zoom > reEnd) {
                sx1 -= (x + (CACHE_BLOCK_SIZE - 1) / zoom - reEnd) * zoom;
            }

            if (y + CACHE_BLOCK_SIZE / zoom > imEnd) {
                sy1 -= (y + (CACHE_BLOCK_SIZE - 1) / zoom - imEnd) * zoom;
            }

            const sWidth = sx1 - sx0 + 1;
            const sHeight = sy1 - sy0 + 1;

            let dx = 0;
            let dy = 0;

            if (x > reStart) {
                dx = (x - reStart) * currentZoom;
            }

            if (y > imStart) {
                dy = (y - imStart) * currentZoom;
            }

            const dWidth = (sWidth / zoom) * currentZoom;
            const dHeight = (sHeight / zoom) * currentZoom;

            // const steps = Math.floor(Math.floor(zoom / currentZoom) / 4);
            const steps = 3;

            // eslint-disable-next-line
            blurContext.filter = `blur(${steps}px)`;
            blurContext.clearRect(0, 0, CACHE_BLOCK_SIZE, CACHE_BLOCK_SIZE);
            blurContext.drawImage(blockCanvas, 0, 0);

            canvasCtx.drawImage(
                blurCanvas,
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

    const renderMandlebrot = () => {
        const currentZoom = width / (reEnd - reStart);
        const canvasCtx = canvasRef.current.getContext('2d');

        canvasCtx.imageSmoothingEnabled = false;
        canvasCtx.mozImageSmoothingEnabled = false;
        canvasCtx.oImageSmoothingEnabled = false;
        canvasCtx.webkitImageSmoothingEnabled = false;
        canvasCtx.msImageSmoothingEnabled = false;

        canvasCtx.clearRect(0, 0, width, height);

        const blurCanvas = document.createElement('canvas');

        blurCanvas.height = CACHE_BLOCK_SIZE;
        blurCanvas.width = CACHE_BLOCK_SIZE;

        const blurContext = blurCanvas.getContext('2d');

        const sortedBlocks = [...MandlebrotCache.getCacheMap()]
            .map(e => e[1])
            .slice()
            .sort((a, b) => a.zoom - b.zoom);

        console.log(sortedBlocks);

        sortedBlocks.forEach(block => {
            if (block.x === -1 && block.y === 0) {
                console.log(block);
                renderBlock(
                    block,
                    canvasCtx,
                    blurCanvas,
                    blurContext,
                    currentZoom
                );
            }
        });
    };

    useEffect(() => {
        const currentZoom = width / (reEnd - reStart);
        const closestZoom = 2 ** (1 + Math.ceil(Math.log2(currentZoom)));
        const cacheBlockWidth = CACHE_BLOCK_SIZE / closestZoom;

        const minReBlockIndex = Math.floor(reStart / cacheBlockWidth);
        const maxReBlockIndex = Math.ceil(reEnd / cacheBlockWidth);

        const minImBlockIndex = Math.floor(imStart / cacheBlockWidth);
        const maxImBlockIndex = Math.ceil(imEnd / cacheBlockWidth);

        for (let i = minReBlockIndex; i <= maxReBlockIndex; i += 1) {
            for (let j = minImBlockIndex; j <= maxImBlockIndex; j += 1) {
                const x0 = i * cacheBlockWidth;
                const y0 = j * cacheBlockWidth;
                const x1 = x0 + cacheBlockWidth;
                const y1 = y0 + cacheBlockWidth;

                if (
                    x0 < reEnd &&
                    y0 < imEnd &&
                    x1 > reStart &&
                    y1 > imStart &&
                    !MandlebrotCache.hasBlock(x0, y0, closestZoom)
                ) {
                    const block = calcMandlebrotBlockSmooth(
                        x0,
                        y0,
                        closestZoom,
                        500
                    );
                    const blockCanvas = mapBlockToCanvas(block, standardPallet);

                    MandlebrotCache.addBlock(
                        x0,
                        y0,
                        closestZoom,
                        block,
                        blockCanvas
                    );
                }
            }
        }
    }, [reStart, reEnd, imStart, imEnd]);

    useEffect(renderMandlebrot, [
        renderMandlebrot,
        reStart,
        reEnd,
        imStart,
        imEnd,
    ]);

    return (
        <canvas
            width={width}
            height={height}
            ref={canvasRef}
            onWheel={handleScroll}
        />
    );
};

Mandlebrot.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
};

export default Mandlebrot;
