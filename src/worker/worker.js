import {
    CALC_BURNING_SHIP_BLOCK,
    CALC_BURNING_SHIP_BLOCK_SMOOTH,
    CALC_MANDLEBROT_BLOCK,
    CALC_MANDLEBROT_BLOCK_SMOOTH,
    CALC_MULTIBROT_BLOCK,
    CALC_MULTIBROT_BLOCK_SMOOTH,
    CALC_TRICORN_BLOCK,
    CALC_TRICORN_BLOCK_SMOOTH,
} from './tasks.js';
import {
    calcBurningShipBlock,
    calcBurningShipBlockSmooth,
    calcMandlebrotBlock,
    calcMandlebrotBlockSmooth,
    calcMultibrotBlock,
    calcMultibrotBlockSmooth,
    calcTricornBlock,
    calcTricornBlockSmooth,
} from './math.js';

// eslint-disable-next-line
addEventListener('message', e => {
    if (typeof e?.data?.taskType !== 'string') return;
    const { taskType, taskId, workerId, args } = e.data;
    const { blockX, blockY, blockZoom, maxIter } = args;

    switch (taskType) {
        case CALC_MANDLEBROT_BLOCK: {
            const blockData = calcMandlebrotBlock(
                blockX,
                blockY,
                blockZoom,
                maxIter
            );
            postMessage({ taskId, rawBlockData: blockData.buffer }, [
                blockData.buffer,
            ]);
            break;
        }
        case CALC_MANDLEBROT_BLOCK_SMOOTH: {
            const blockData = calcMandlebrotBlockSmooth(
                blockX,
                blockY,
                blockZoom,
                maxIter
            );
            postMessage({ taskId, rawBlockData: blockData.buffer }, [
                blockData.buffer,
            ]);
            break;
        }
        case CALC_BURNING_SHIP_BLOCK: {
            const blockData = calcBurningShipBlock(
                blockX,
                blockY,
                blockZoom,
                maxIter
            );
            postMessage({ taskId, rawBlockData: blockData.buffer }, [
                blockData.buffer,
            ]);
            break;
        }
        case CALC_BURNING_SHIP_BLOCK_SMOOTH: {
            const blockData = calcBurningShipBlockSmooth(
                blockX,
                blockY,
                blockZoom,
                maxIter
            );
            postMessage({ taskId, rawBlockData: blockData.buffer }, [
                blockData.buffer,
            ]);
            break;
        }
        case CALC_MULTIBROT_BLOCK: {
            const blockData = calcMultibrotBlock(
                blockX,
                blockY,
                blockZoom,
                maxIter
            );
            postMessage({ taskId, rawBlockData: blockData.buffer }, [
                blockData.buffer,
            ]);
            break;
        }
        case CALC_MULTIBROT_BLOCK_SMOOTH: {
            const blockData = calcMultibrotBlockSmooth(
                blockX,
                blockY,
                blockZoom,
                maxIter
            );
            postMessage({ taskId, rawBlockData: blockData.buffer }, [
                blockData.buffer,
            ]);
            break;
        }
        case CALC_TRICORN_BLOCK: {
            const blockData = calcTricornBlock(
                blockX,
                blockY,
                blockZoom,
                maxIter
            );
            postMessage({ taskId, rawBlockData: blockData.buffer }, [
                blockData.buffer,
            ]);
            break;
        }
        case CALC_TRICORN_BLOCK_SMOOTH: {
            const blockData = calcTricornBlockSmooth(
                blockX,
                blockY,
                blockZoom,
                maxIter
            );
            postMessage({ taskId, rawBlockData: blockData.buffer }, [
                blockData.buffer,
            ]);
            break;
        }
        default:
            console.error(`[worker.js] (${workerId}) Unknown task ${taskType}`);
    }
});
