import { useState, useEffect, useRef, useCallback } from 'react';

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
    const panCoordsRef = useRef(null);

    const onZoom = useCallback(e => {
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
    }, []);

    // x0 + px / zoom = xi
    const onPan = useCallback(e => {
        const canvas = canvasRef.current;
        const canvasRect = canvas.getBoundingClientRect();

        const px = e.pageX - canvasRect.left;
        const py = e.pageY - canvasRect.top;

        const initialPanCoords = panCoordsRef.current;
        const currentZoom = zoomRef.current;

        const newCoords = {
            x: initialPanCoords.x - px / currentZoom,
            y: initialPanCoords.y - py / currentZoom,
        };

        coordsRef.current = newCoords;

        setState({ zoom: currentZoom, coords: newCoords });
    }, []);

    const disablePan = useCallback(() => {
        panCoordsRef.current = null;
        document.removeEventListener('mousemove', onPan);
        document.removeEventListener('mouseup', disablePan);
    });

    const onMouseDown = useCallback(e => {
        const canvas = canvasRef.current;
        const canvasRect = canvas.getBoundingClientRect();

        const px = e.pageX - canvasRect.left;
        const py = e.pageY - canvasRect.top;

        const currentCords = coordsRef.current;
        const currentZoom = zoomRef.current;

        panCoordsRef.current = {
            x: currentCords.x + px / currentZoom,
            y: currentCords.y + py / currentZoom,
        };

        document.addEventListener('mousemove', onPan);
        document.addEventListener('mouseup', disablePan);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.addEventListener('wheel', onZoom);
        canvas.addEventListener('mousedown', onMouseDown);
        return () => {
            canvas.removeEventListener('wheel', onZoom);
            canvas.removeEventListener('mousedown', onMouseDown);
        };
    }, []);

    return state;
};

export default usePanZoom;
