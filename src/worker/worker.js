import {
    CALC_MANDLEBROT_BLOCK,
    CALC_MANDLEBROT_BLOCK_SMOOTH,
} from './tasks.js';

// eslint-disable-next-line
addEventListener('message', e => {
    const [task, ...args] = e.data;
    switch (task) {
        case CALC_MANDLEBROT_BLOCK:
        case CALC_MANDLEBROT_BLOCK_SMOOTH:
        default:
            
    }
});
