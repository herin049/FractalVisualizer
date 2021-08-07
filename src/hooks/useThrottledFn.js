import { useRef, useEffect, useCallback } from 'react';

const useThrottledFn = (fn, throttleDelay, deps) => {
    const lastExecution = useRef(0);
    const timeoutId = useRef(null);
    const fnCallbackRef = useRef(null);
    const throttleDelayRef = useRef(throttleDelay);

    const fnCallback = useCallback(fn, deps);

    useEffect(() => {
        fnCallbackRef.current = fnCallback;
    }, [fnCallback]);

    useEffect(() => {
        throttleDelayRef.current = throttleDelay;
    }, [throttleDelay]);

    useEffect(() => {
        return () => {
            if (timeoutId.current !== null) {
                clearTimeout(timeoutId.current);
            }
        };
    }, []);

    return useCallback((...args) => {
        if (Date.now() - lastExecution.current >= throttleDelayRef.current) {
            // eslint-disable-next-line
            fnCallbackRef.current.apply(null, ...args);
            lastExecution.current = Date.now();
            if (timeoutId.current !== null) {
                clearTimeout(timeoutId.current);
                timeoutId.current = null;
            }
            return true;
        }

        if (timeoutId.current === null) {
            timeoutId.current = setTimeout(() => {
                // eslint-disable-next-line
                fnCallbackRef.current.apply(null, ...args);
                lastExecution.current = Date.now();
                timeoutId.current = null;
            }, throttleDelayRef.current - (Date.now() - lastExecution.current));
        }
        return false;
    }, []);
};

export default useThrottledFn;
