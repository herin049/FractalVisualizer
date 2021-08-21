import React, { useEffect, useRef } from 'react';
import usePanZoom from '../hooks/usePanZoom.js';
import useForceUpdate from '../hooks/useForceUpdate.js';
import useWindowDims from '../hooks/useWindowDims.js';
import useThrottledFn from '../hooks/useThrottledFn.js';
import * as Constants from '../shared/constants.js';
import * as Tasks from '../worker/tasks.js';
import WorkerPool from '../worker/WorkerPool.js';
import CanvasCache from '../canvas/CanvasCache.js';
import {
    mapBlockToCanvas,
    hsvRedPallet,
    hsvBluePallet,
    hsvGreenPallet,
} from '../canvas/pallet.js';
import { renderBlock } from '../canvas/renderUtils.js';

const Fractal = ({ settings }) => {
    const { width, height } = useWindowDims();
    const forceUpdate = useForceUpdate();
    const canvasRef = useRef(null);
    const palletRef = useRef(null);
    const fractalTaskRef = useRef(null);
    const maxIterRef = useRef(null);

    const { maxIter, continuousColoring, selectedPallet, selectedFractal } =
        settings;

    let fractalTask;
    let minHeight;
    let minWidth;
    let centerX;
    let centerY;

    switch (selectedFractal) {
        case Constants.FRACTAL_TYPES.BURNING_SHIP: {
            minHeight = Constants.BURNING_SHIP_MIN_HEIGHT;
            minWidth = Constants.BURNING_SHIP_MIN_WIDTH;
            centerX = Constants.BURNING_SHIP_CENTER_X;
            centerY = Constants.BURNING_SHIP_CENTER_Y;

            fractalTask = continuousColoring
                ? Tasks.CALC_BURNING_SHIP_BLOCK_SMOOTH
                : Tasks.CALC_BURNING_SHIP_BLOCK;
            break;
        }
        case Constants.FRACTAL_TYPES.MULTIBROT: {
            minHeight = Constants.MULTIBROT_MIN_HEIGHT;
            minWidth = Constants.MULTIBROT_MIN_WIDTH;
            centerX = Constants.MULTIBROT_CENTER_X;
            centerY = Constants.MULTIBROT_CENTER_Y;

            fractalTask = continuousColoring
                ? Tasks.CALC_MULTIBROT_BLOCK_SMOOTH
                : Tasks.CALC_MULTIBROT_BLOCK;
            break;
        }
        case Constants.FRACTAL_TYPES.TRICORN: {
            minHeight = Constants.TRICORN_MIN_HEIGHT;
            minWidth = Constants.TRICORN_MIN_WIDTH;
            centerX = Constants.TRICORN_CENTER_X;
            centerY = Constants.TRICORN_CENTER_Y;

            fractalTask = continuousColoring
                ? Tasks.CALC_TRICORN_BLOCK_SMOOTH
                : Tasks.CALC_TRICORN_BLOCK;
            break;
        }
        case Constants.FRACTAL_TYPES.MANDLEBROT:
        default: {
            minHeight = Constants.MANDLEBROT_MIN_HEIGHT;
            minWidth = Constants.MANDLEBROT_MIN_WIDTH;
            centerX = Constants.MANDLEBROT_CENTER_X;
            centerY = Constants.MANDLEBROT_CENTER_Y;

            fractalTask = continuousColoring
                ? Tasks.CALC_MANDLEBROT_BLOCK_SMOOTH
                : Tasks.CALC_MANDLEBROT_BLOCK;
            break;
        }
    }

    useEffect(() => {
        CanvasCache.clear();
        WorkerPool.clearTaskQueue();
        switch (selectedPallet) {
            case Constants.COLOR_PALLETS.HSV_BLUE: {
                palletRef.current = hsvBluePallet(maxIter);
                break;
            }
            case Constants.COLOR_PALLETS.HSV_GREEN: {
                palletRef.current = hsvGreenPallet(maxIter);
                break;
            }
            case Constants.COLOR_PALLETS.HSV_RED:
            default: {
                palletRef.current = hsvRedPallet(maxIter);
            }
        }
    }, [selectedPallet, maxIter]);

    useEffect(() => {
        CanvasCache.clear();
        WorkerPool.clearTaskQueue();
        fractalTaskRef.current = fractalTask;
    }, [fractalTask]);

    useEffect(() => {
        maxIterRef.current = maxIter;
    }, [maxIter]);

    const {
        zoom: canvasZoom,
        coords: canvasCoords,
        resetOrientation,
    } = usePanZoom(
        canvasRef,
        width,
        height,
        minHeight,
        minWidth,
        centerX,
        centerY,
        Constants.CANVAS_MIN_ZOOM,
        Constants.CANVAS_MAX_ZOOM,
        Constants.ZOOM_FACTOR,
        Constants.CLICK_ZOOM_FACTOR
    );

    useEffect(() => {
        const onReset = resetOrientation;
        const resetButton = document.getElementById('reset-button');

        resetButton.addEventListener('click', onReset);
        return () => resetButton.removeEventListener('click', onReset);
    }, [resetOrientation]);

    const x0 = canvasCoords.x;
    const x1 = canvasCoords.x + width / canvasZoom;
    const y0 = canvasCoords.y;
    const y1 = canvasCoords.y + height / canvasZoom;

    const renderFractal = useThrottledFn(
        () => {
            const currentZoom = canvasZoom;
            const canvasCtx = canvasRef.current.getContext('2d');

            canvasCtx.imageSmoothingEnabled = false;
            canvasCtx.mozImageSmoothingEnabled = false;
            canvasCtx.oImageSmoothingEnabled = false;
            canvasCtx.webkitImageSmoothingEnabled = false;
            canvasCtx.msImageSmoothingEnabled = false;

            canvasCtx.clearRect(0, 0, width, height);

            const highestZoom = 2 ** (3 + Math.ceil(Math.log2(currentZoom)));

            CanvasCache.getCacheMap().forEach(block => {
                if (
                    !block.loading &&
                    block.zoom <= highestZoom &&
                    block.x < x1 &&
                    block.y < y1 &&
                    block.x + Constants.CACHE_BLOCK_SIZE / block.zoom > x0 &&
                    block.y + Constants.CACHE_BLOCK_SIZE / block.zoom > y0
                ) {
                    block.lastViewed = Date.now();
                }
            });

            const sortedBlocks = [...CanvasCache.getCacheMap()]
                .map(e => e[1])
                .filter(e => !e.loading)
                .filter(e => e.zoom <= highestZoom)
                .slice()
                .sort((a, b) => a.zoom - b.zoom);

            sortedBlocks.forEach(block =>
                renderBlock(block, canvasCtx, currentZoom, x0, y0, x1, y1)
            );
        },
        33,
        [canvasZoom, x0, x1, y0, y1]
    );

    const populateCanvas = useThrottledFn(
        () => {
            const currentZoom = canvasZoom;
            const closestZoom = 2 ** (1 + Math.ceil(Math.log2(currentZoom)));
            const cacheBlockWidth = Constants.CACHE_BLOCK_SIZE / closestZoom;

            const minReBlockIndex = Math.floor(x0 / cacheBlockWidth);
            const maxReBlockIndex = Math.ceil(x1 / cacheBlockWidth);

            const minImBlockIndex = Math.floor(y0 / cacheBlockWidth);
            const maxImBlockIndex = Math.ceil(y1 / cacheBlockWidth);

            for (let i = minReBlockIndex; i <= maxReBlockIndex; i += 1) {
                for (let j = minImBlockIndex; j <= maxImBlockIndex; j += 1) {
                    const bx0 = i * cacheBlockWidth;
                    const by0 = j * cacheBlockWidth;
                    const bx1 = bx0 + cacheBlockWidth;
                    const by1 = by0 + cacheBlockWidth;

                    if (
                        bx0 < x1 &&
                        by0 < y1 &&
                        bx1 > x0 &&
                        by1 > y0 &&
                        !CanvasCache.hasBlock(bx0, by0, closestZoom)
                    ) {
                        const currentTask = fractalTaskRef.current;
                        WorkerPool.postTask(currentTask, {
                            blockX: bx0,
                            blockY: by0,
                            blockZoom: closestZoom,
                            maxIter,
                        })
                            .then(({ rawBlockData }) => {
                                if (
                                    maxIterRef.current !== maxIter ||
                                    currentTask !== fractalTaskRef.current
                                ) {
                                    CanvasCache.removeBlock(
                                        bx0,
                                        by0,
                                        closestZoom
                                    );
                                    return;
                                }

                                const blockData = new Float32Array(
                                    rawBlockData
                                );
                                const blockCanvas = mapBlockToCanvas(
                                    blockData,
                                    palletRef.current
                                );

                                CanvasCache.addBlock(
                                    bx0,
                                    by0,
                                    closestZoom,
                                    blockCanvas,
                                    false,
                                    Date.now()
                                );

                                forceUpdate();
                            })
                            .catch(() => {
                                console.error('Failed to calculate block.');
                            });

                        CanvasCache.addBlock(
                            bx0,
                            by0,
                            closestZoom,
                            null,
                            true,
                            Date.now()
                        );
                    }
                }
            }

            WorkerPool.filterTaskQueue(task => {
                if (!task?.args || !task?.taskType) {
                    return false;
                }

                const { blockX, blockY, blockZoom } = task.args;
                if (
                    task.taskType === fractalTask &&
                    task.args?.maxIter === maxIter &&
                    blockX < x1 &&
                    blockY < y1 &&
                    blockX + Constants.CACHE_BLOCK_SIZE / blockZoom > x0 &&
                    blockY + Constants.CACHE_BLOCK_SIZE / blockZoom > y0 &&
                    blockZoom >= closestZoom / 2 &&
                    blockZoom <= closestZoom * 2
                ) {
                    return true;
                }

                CanvasCache.removeBlock(blockX, blockY, blockZoom);
                return false;
            });

            CanvasCache.filterCache();
        },
        200,
        [canvasZoom, x0, x1, y0, y1, maxIter, fractalTask]
    );

    useEffect(renderFractal);
    useEffect(populateCanvas);

    return <canvas width={width} height={height} ref={canvasRef} />;
};

export default Fractal;
