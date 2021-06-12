import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import MandlebrotCache from '../mandlebrot/MandlebrotCache.js';
import { CACHE_BLOCK_SIZE } from '../constants.js';
import { calcMandlebrotBlock } from '../math/mandlebrot.js';

const Mandlebrot = ({ width, height }) => {
    const canvasRef = useRef(null);

    const [reStart, setReStart] = useState(-3);
    const [reEnd, setReEnd] = useState(1);
    const [imStart, setImStart] = useState(-1.5);
    const [imEnd, setImEnd] = useState(1.5);

    const handleScroll = (e) => {
        const canvasRect = canvasRef.current.getBoundingClientRect();

        const canvasX = e.pageX - canvasRect.left;
        const canvasY = e.pageY - canvasRect.top;

        const dx = canvasX / width;
        const dy = canvasY / height;

        const currentWidth = reEnd - reStart;
        const currentHeight = imEnd - imStart;

        const zoomMultiplier = 1 + e.deltaY / 1000;

        const newWidth = currentWidth * zoomMultiplier;
        const newHeight = currentHeight * zoomMultiplier;

        setReStart(reStart + currentWidth * dx - newWidth * dx);
        setReEnd(reStart + currentWidth * dx - newWidth * dx + newWidth);
        setImStart(imStart + currentHeight * dy - newHeight * dy);
        setImEnd(imStart + currentHeight * dy - newHeight * dy + newHeight);
    };

    const renderBlock = (
        { x, y, zoom, data },
        canvasCtx,
        currentZoom,
        offscreenCanvas,
        offscreenCanvasCtx
    ) => {
        if (
            x < reEnd &&
            y < imEnd &&
            x + CACHE_BLOCK_SIZE / zoom > reStart &&
            y + CACHE_BLOCK_SIZE / zoom > imStart
        ) {
            const imageData = offscreenCanvasCtx.getImageData(
                0,
                0,
                CACHE_BLOCK_SIZE,
                CACHE_BLOCK_SIZE
            );

            for (let i = 0; i < CACHE_BLOCK_SIZE * CACHE_BLOCK_SIZE; i += 1) {
                imageData.data[i * 4] = (data[i] % 32) * 7;
                imageData.data[i * 4 + 1] = (data[i] % 32) * 7;
                imageData.data[i * 4 + 2] = (data[i] % 32) * 7;
                imageData.data[i * 4 + 3] = 255;
            }

            offscreenCanvasCtx.putImageData(imageData, 0, 0);

            let sx0 = 0;
            let sy0 = 0;

            if (x < reStart) {
                sx0 = (reStart - x) * zoom;
            }

            if (y < imStart) {
                sy0 = (imStart - y) * zoom;
            }

            let sx1 = CACHE_BLOCK_SIZE;
            let sy1 = CACHE_BLOCK_SIZE;

            if (x + CACHE_BLOCK_SIZE / zoom > reEnd) {
                sx1 -= (x + CACHE_BLOCK_SIZE / zoom - reEnd) * zoom;
            }

            if (y + CACHE_BLOCK_SIZE / zoom > imEnd) {
                sy1 -= (y + CACHE_BLOCK_SIZE / zoom - imEnd) * zoom;
            }

            const sWidth = sx1 - sx0;
            const sHeight = sy1 - sy0;

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

            console.log('sx', sx0, 'sy', sy0);

            canvasCtx.drawImage(
                offscreenCanvas,
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
        canvasCtx.clearRect(0, 0, width, height);
        const offscreenCanvas = document.createElement('canvas', {
            height: CACHE_BLOCK_SIZE,
            width: CACHE_BLOCK_SIZE,
        });
        const offscreenCanvasCtx = offscreenCanvas.getContext('2d');
        MandlebrotCache.getCacheMap().forEach((block) =>
            renderBlock(
                block,
                canvasCtx,
                currentZoom,
                offscreenCanvas,
                offscreenCanvasCtx
            )
        );
    };

    useEffect(renderMandlebrot, [
        renderMandlebrot,
        reStart,
        reEnd,
        imStart,
        imEnd,
    ]);

    useEffect(() => {
        MandlebrotCache.addBlock(
            -3,
            -1.5,
            64,
            calcMandlebrotBlock(-3, -1.5, 64, 1000)
        );
    }, []);

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
