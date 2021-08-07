import React, { useEffect, useRef } from 'react';
import usePanZoom from '../hooks/usePanZoom.js';
import useForceUpdate from '../hooks/useForceUpdate.js';
import useWindowDims from '../hooks/useWindowDims.js';
import useThrottledFn from '../hooks/useThrottledFn.js';
import * as Constants from '../shared/constants.js';
import * as Tasks from '../worker/tasks.js';
import WorkerPool from '../worker/WorkerPool.js';
import MandlebrotCache from '../mandlebrot/MandlebrotCache.js';
import { mapBlockToCanvas, standardPallet } from '../canvas/pallet.js';
import { renderBlock } from '../canvas/renderUtils.js';

const Mandlebrot = () => {
    const { width, height } = useWindowDims();
    const forceUpdate = useForceUpdate();
    const canvasRef = useRef(null);

    const {
        zoom: canvasZoom,
        coords: canvasCoords,
        resetOrientation,
    } = usePanZoom(
        canvasRef,
        width,
        height,
        Constants.MANDLEBROT_DEFAULT_ZOOM,
        Constants.MANDLEBROT_CENTER_X,
        Constants.MANDLEBROT_CENTER_Y,
        Constants.MANDLEBROT_MIN_ZOOM,
        Constants.MANDLEBROT_MAX_ZOOM,
        Constants.ZOOM_FACTOR,
        Constants.CLICK_ZOOM_FACTOR
    );

    useEffect(() => {
        const onReset = resetOrientation;
        const resetButton = document.getElementById('reset-button');

        resetButton.addEventListener('click', onReset);
        return () => resetButton.removeEventListener('click', onReset);
    }, [resetOrientation]);

    const reStart = canvasCoords.x;
    const reEnd = canvasCoords.x + width / canvasZoom;
    const imStart = canvasCoords.y;
    const imEnd = canvasCoords.y + height / canvasZoom;

    const renderMandlebrot = useThrottledFn(
        () => {
            console.log(Date.now());
            const currentZoom = canvasZoom;
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
                .filter(
                    e => e.zoom <= 2 ** (2 + Math.ceil(Math.log2(currentZoom)))
                )
                .slice()
                .sort((a, b) => a.zoom - b.zoom);

            sortedBlocks.forEach(block =>
                renderBlock(
                    block,
                    canvasCtx,
                    currentZoom,
                    reStart,
                    imStart,
                    reEnd,
                    imEnd
                )
            );
        },
        33,
        [canvasZoom, reStart, reEnd, imStart, imEnd]
    );

    const populateCanvas = useThrottledFn(
        () => {
            const currentZoom = canvasZoom;
            const closestZoom = 2 ** (1 + Math.ceil(Math.log2(currentZoom)));
            const cacheBlockWidth = Constants.CACHE_BLOCK_SIZE / closestZoom;

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
                        WorkerPool.postTask(
                            Tasks.CALC_MANDLEBROT_BLOCK_SMOOTH,
                            {
                                blockX: x0,
                                blockY: y0,
                                blockZoom: closestZoom,
                                maxIter: 1024,
                            }
                        )
                            .then(({ rawBlockData }) => {
                                const blockData = new Float32Array(
                                    rawBlockData
                                );
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
                    taskType === Tasks.CALC_MANDLEBROT_BLOCK_SMOOTH ||
                    taskType === Tasks.CALC_MANDLEBROT_BLOCK
                ) {
                    const { blockX, blockY, blockZoom } = args;
                    if (
                        blockX < reEnd &&
                        blockY < imEnd &&
                        blockX + Constants.CACHE_BLOCK_SIZE / blockZoom >
                            reStart &&
                        blockY + Constants.CACHE_BLOCK_SIZE / blockZoom >
                            imStart &&
                        blockZoom >= closestZoom &&
                        blockZoom <= closestZoom * 4
                    ) {
                        return true;
                    }

                    MandlebrotCache.removeBlock(blockX, blockY, blockZoom);
                    return false;
                }
                return false;
            });
        },
        200,
        [canvasZoom, reStart, reEnd, imStart, imEnd]
    );

    useEffect(renderMandlebrot);
    useEffect(populateCanvas);

    useEffect(() => {
        WorkerPool.resize(12);
    }, []);

    return <canvas width={width} height={height} ref={canvasRef} />;
};

export default Mandlebrot;
