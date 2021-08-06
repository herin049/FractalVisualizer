import { useState, useEffect, useRef, useCallback } from 'react';

const usePanZoom = (
    canvasRef,
    windowWidth,
    windowHeight,
    defaultZoom,
    centerX,
    centerY,
    minZoom,
    maxZoom,
    zoomFactor,
    clickZoomFactor
) => {
    const [state, setState] = useState(() => ({
        zoom: defaultZoom,
        coords: {
            x: centerX - windowWidth / (defaultZoom * 2),
            y: centerY - windowHeight / (defaultZoom * 2),
        },
    }));

    const zoomRef = useRef(defaultZoom);
    const coordsRef = useRef(state.coords);
    const panCoordsRef = useRef(state.coords);

    const updateZoom = useCallback((newZoom, dx, dy) => {
        const canvas = canvasRef.current;

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const currentZoom = zoomRef.current;

        const currentWidth = canvasWidth / currentZoom;
        const currentHeight = canvasHeight / currentZoom;

        newZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);

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

    const onClickZoom = useCallback(zoomIn => {
        const newZoom = zoomIn
            ? zoomRef.current * (1 + clickZoomFactor)
            : zoomRef.current * (1 - clickZoomFactor);

        updateZoom(newZoom, 0.5, 0.5);
    }, []);

    const onZoom = useCallback(e => {
        const canvas = canvasRef.current;
        const canvasRect = canvas.getBoundingClientRect();

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const dx = (e.pageX - canvasRect.left) / canvasWidth;
        const dy = (e.pageY - canvasRect.top) / canvasHeight;

        const zoomMultiplier = 1 - e.deltaY / zoomFactor;
        const newZoom = zoomRef.current * zoomMultiplier;

        updateZoom(newZoom, dx, dy);
    }, []);

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
        document.removeEventListener('pointermove', onPan);
        document.removeEventListener('pointerup', disablePan);
    }, []);

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

        document.addEventListener('pointermove', onPan);
        document.addEventListener('pointerup', disablePan);
    }, []);

    const resetOrientation = useCallback(() => {
        zoomRef.current = defaultZoom;
        coordsRef.current = {
            x: centerX - windowWidth / (defaultZoom * 2),
            y: centerY - windowHeight / (defaultZoom * 2),
        };

        panCoordsRef.current = coordsRef.current;

        setState({
            zoom: defaultZoom,
            coords: coordsRef.current,
        });
    }, [centerX, centerY, windowWidth, windowHeight, defaultZoom]);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.addEventListener('wheel', onZoom);

        canvas.addEventListener('pointerdown', onMouseDown);

        const zoomInButton = document.getElementById('zoom-in-button');
        const zoomOutButton = document.getElementById('zoom-out-button');

        const onClickZoomIn = () => onClickZoom(true);
        const onClickZoomOut = () => onClickZoom(false);

        zoomInButton.addEventListener('click', onClickZoomIn);
        zoomOutButton.addEventListener('click', onClickZoomOut);

        return () => {
            canvas.removeEventListener('wheel', onZoom);

            canvas.removeEventListener('pointerdown', onMouseDown);

            zoomInButton.removeEventListener('click', onClickZoomIn);
            zoomInButton.removeEventListener('click', onClickZoomOut);
        };
    }, []);

    return { ...state, resetOrientation };
};

export default usePanZoom;
