import React, { useEffect, useRef, useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import MandlebrotCache from '../mandlebrot/MandlebrotCache.js';
import { CACHE_BLOCK_SIZE, MIN_ZOOM } from '../mandlebrot/constants.js';
import { mapBlockToCanvas, standardPallet } from '../mandlebrot/pallet.js';
import WorkerPool from '../worker/WorkerPool.js';
import {
    CALC_MANDLEBROT_BLOCK_SMOOTH,
    CALC_MANDLEBROT_BLOCK,
} from '../worker/tasks.js';

const Mandlebrot = ({ width, height }) => {
    const [, forceUpdate] = useReducer(x => (x + 1) % 2, 0);
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

    const renderMandlebrot = () => {
        const currentZoom = width / (reEnd - reStart);
        const canvasCtx = canvasRef.current.getContext('2d');

        canvasCtx.imageSmoothingEnabled = false;
        canvasCtx.mozImageSmoothingEnabled = false;
        canvasCtx.oImageSmoothingEnabled = false;
        canvasCtx.webkitImageSmoothingEnabled = false;
        canvasCtx.msImageSmoothingEnabled = false;

        canvasCtx.clearRect(0, 0, width, height);

        const sortedBlocks = [...MandlebrotCache.getCacheMap()]
            .map(e => e[1])
            .filter(e => !e.loading)
            .filter(e => e.zoom <= 2 ** (1 + Math.ceil(Math.log2(currentZoom))))
            .slice()
            .sort((a, b) => a.zoom - b.zoom);

        sortedBlocks.forEach(block =>
            renderBlock(block, canvasCtx, currentZoom)
        );
    };

    useEffect(() => {
        WorkerPool.resize(16);
    }, []);

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
                    WorkerPool.postTask(CALC_MANDLEBROT_BLOCK_SMOOTH, {
                        blockX: x0,
                        blockY: y0,
                        blockZoom: closestZoom,
                        maxIter: 2 ** 15,
                    })
                        .then(({ rawBlockData }) => {
                            const blockData = new Float32Array(rawBlockData);
                            const blockCanvas = mapBlockToCanvas(
                                blockData,
                                standardPallet
                            );

                            MandlebrotCache.addBlock(
                                x0,
                                y0,
                                closestZoom,
                                blockData,
                                blockCanvas,
                                false
                            );
                            forceUpdate();
                        })
                        .catch(() => {
                            console.error('Failed to calculate block.');
                        });

                    MandlebrotCache.addBlock(
                        x0,
                        y0,
                        closestZoom,
                        null,
                        null,
                        true
                    );
                }
            }
        }

        WorkerPool.filterTaskQueue(task => {
            const { taskType, args } = task;
            if (
                taskType === CALC_MANDLEBROT_BLOCK_SMOOTH ||
                taskType === CALC_MANDLEBROT_BLOCK
            ) {
                const { blockX, blockY, blockZoom } = args;
                return (
                    blockX < reEnd &&
                    blockY < imEnd &&
                    blockX + CACHE_BLOCK_SIZE / blockZoom > reStart &&
                    blockY + CACHE_BLOCK_SIZE / blockZoom > imStart &&
                    blockZoom >= closestZoom
                );
            }
            return false;
        });
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
