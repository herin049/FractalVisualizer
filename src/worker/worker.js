import {
    CALC_MANDLEBROT_BLOCK,
    CALC_MANDLEBROT_BLOCK_SMOOTH,
} from './tasks.js';
import { calcMandlebrotBlock, calcMandlebrotBlockSmooth } from '../mandlebrot/math.js';

// eslint-disable-next-line
addEventListener('message', e => {
    if (!Array.isArray(e.data) || e.data.length < 2) {
        return;
    }
    const [task, taskId, ...args] = e.data;
    switch (task) {
        case CALC_MANDLEBROT_BLOCK: {
            const [rawBlockData, blockX, blockY, blockZoom, maxIter] = args;
            const blockData = new Float32Array(rawBlockData);
            calcMandlebrotBlock(blockData, blockX, blockY, blockZoom, maxIter);
            postMessage(taskId);
            break;
        }
        case CALC_MANDLEBROT_BLOCK_SMOOTH: {
            const [rawBlockData, blockX, blockY, blockZoom, maxIter] = args;
            const blockData = new Float32Array(rawBlockData);
            calcMandlebrotBlockSmooth(blockData, blockX, blockY, blockZoom, maxIter);
            postMessage(taskId);
            break;
        }
        default:
            console.error(`[worker.js] Unknown task ${task}`);
    }
});
