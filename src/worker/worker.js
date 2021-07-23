import {
    CALC_MANDLEBROT_BLOCK,
    CALC_MANDLEBROT_BLOCK_SMOOTH,
} from './tasks.js';
import {
    calcMandlebrotBlock,
    calcMandlebrotBlockSmooth,
} from '../mandlebrot/math.js';

// eslint-disable-next-line
addEventListener('message', e => {
    const { taskType, taskId, args } = e.data;
    switch (taskType) {
        case CALC_MANDLEBROT_BLOCK: {
            const { blockX, blockY, blockZoom, maxIter } = args;
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
            const { blockX, blockY, blockZoom, maxIter } = args;
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
        default:
            console.error(`[worker.js] Unknown task ${taskType}`);
    }
});
