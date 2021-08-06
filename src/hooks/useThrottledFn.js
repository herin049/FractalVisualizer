import { useRef, useEffect, useCallback } from 'react';

const useThrottledFn = (fn, throttleDelay) => {
    const lastExecution = useRef(0);
    const timeoutId = useRef(null);
    const fnRef = useRef(fn);
    const throttleDelayRef = useRef(throttleDelay);

    useEffect(() => {
        fnRef.current = fn;
    }, [fn]);

    useEffect(() => {
        throttleDelayRef.current = throttleDelay;
    }, [throttleDelay]);

    return useCallback(() => {
        if (Date.now() - lastExecution.current >= throttleDelayRef.current) {
            // eslint-disable-next-line
            fnRef.current.apply(null, arguments);
            lastExecution.current = Date.now();
            if (timeoutId.current !== null) {
                clearTimeout(timeoutId.current);
                timeoutId.current = null;
            }
            return true;
        }
        // eslint-disable-next-line
        const args = arguments;
        timeoutId.current = setTimeout(() => {
            // eslint-disable-next-line
            fnRef.current.apply(null, args);
            lastExecution.current = Date.now();
            timeoutId.current = null;
        }, throttleDelayRef.current - (Date.now() - lastExecution.current));
        return false;
    }, []);
};

export default useThrottledFn;
