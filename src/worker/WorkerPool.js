import { CALC_MANDLEBROT_BLOCK } from './tasks.js';

class WorkerPool {
    constructor() {
        this.workers = [];
    }

    resize(numWorkers) {
        if (numWorkers > this.workers.length) {
            for (let i = 0; i < numWorkers - this.workers.length; i += 1) {
                const worker = new Worker('worker.js');
                this.workers.push(worker);
            }
        } else if (numWorkers < this.workers.length) {
            for (let i = 0; i < this.workers.length - numWorkers; i += 1) {
                const worker = this.workers.pop();
                worker.terminate();
            }
        }
    }

    test() {
        for (let i = 0; i < this.workers.length; i += 1) {
            const worker = this.workers[i];
            worker.postMessage([CALC_MANDLEBROT_BLOCK, 1.5, 0.25, 256]);
        }
    }
}

const instance = new WorkerPool();
Object.freeze(instance);
export default instance;
