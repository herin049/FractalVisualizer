import { useState, useEffect, useRef } from 'react';

const usePanZoom = (
    canvasRef,
    initialZoom,
    initialCoords,
    minZoom,
    maxZoom,
    zoomFactor
) => {
    const [state, setState] = useState({
        zoom: initialZoom,
        coords: initialCoords,
    });
    const zoomRef = useRef(initialZoom);
    const coordsRef = useRef(initialCoords);

    useEffect(() => {
        const onZoom = e => {
            const canvas = canvasRef.current;
            const canvasRect = canvas.getBoundingClientRect();

            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            const dx = (e.pageX - canvasRect.left) / canvasWidth;
            const dy = (e.pageY - canvasRect.top) / canvasHeight;

            const currentZoom = zoomRef.current;

            const currentWidth = canvasWidth / currentZoom;
            const currentHeight = canvasHeight / currentZoom;

            const zoomMultiplier = 1 - e.deltaY / zoomFactor;
            const newZoom = Math.min(
                Math.max(currentZoom * zoomMultiplier, minZoom),
                maxZoom
            );

            const newWidth = canvasWidth / newZoom;
            const newHeight = canvasHeight / newZoom;

            const currentCoords = coordsRef.current;
            const newCoords = {
                x: currentCoords.x + currentWidth * dx - newWidth * dx,
                y: currentCoords.y + currentHeight * dy - newHeight * dy,
            };

            zoomRef.current = newZoom;
            coordsRef.current = newCoords;

            setState({ zoom: newZoom, coords: newCoords });
        };

        const canvas = canvasRef.current;
        canvas.addEventListener('wheel', onZoom);
        return () => canvas.removeEventListener('wheel', onZoom);
    }, []);

    return state;
};

export default usePanZoom;
