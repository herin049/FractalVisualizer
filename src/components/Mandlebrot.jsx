import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import calcMandlebrot from '../math/mandlebrot.js';

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

    const renderMandlebrot = () => {
        const ctx = canvasRef.current.getContext('2d');
        const imageData = ctx.getImageData(0, 0, width, height);
        const { data } = imageData;
        for (let px = 0; px < width; px += 1) {
            for (let py = 0; py < height; py += 1) {
                const i = (py * width + px) * 4;
                const x = reStart + (reEnd - reStart) * (px / width);
                const y = imStart + (imEnd - imStart) * (py / height);
                const z = calcMandlebrot(x, y, 1000);

                data[i] = (z % 32) * 7;
                data[i + 1] = (z % 32) * 7;
                data[i + 2] = (z % 32) * 7;
                data[i + 3] = 255;
            }
        }

        ctx.putImageData(imageData, 0, 0);
    };

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
