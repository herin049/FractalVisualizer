import { CALC_MANDLEBROT_BLOCK, CALC_MANDLEBROT_BLOCK_SMOOTH } from './tasks.js';

class WorkerPool {
    constructor() {
        this.workers = [];
        this.activeTasks = [];
        this.taskQueue = [];
    }

    resize(numWorkers) {
        if (numWorkers > this.workers.length) {
            for (let i = 0; i < numWorkers - this.workers.length; i += 1) {
                const worker = new Worker('worker.js');
                const workerIndex = this.workers.length + i;
                worker.onmessage = e => {
                    if (!Array.isArray(e.data) || e.data.length < 1) {
                        return;
                    }
                    const [taskId, ...rest] = e.data;
                    if (this.activeTasks[workerIndex]?.taskId === taskId) {
                        this.activeTasks[workerIndex].resolve(...rest);
                        this.activeTasks[workerIndex] = null;
                        this.saturateWorkers();
                    }
                };
                this.workers.push(worker);
                this.activeTasks.push(null);
            }
            this.saturateWorkers();
        } else if (numWorkers < this.workers.length) {
            for (let i = 0; i < this.workers.length - numWorkers; i += 1) {
                const worker = this.workers.pop();
                const activeTask = this.activeTasks.pop();
                this.taskQueue.unshift(activeTask);
                worker.terminate();
            }
        }
    }

    saturateWorkers() {
        for (let i = 0; i < this.workers.length; i += 1) {
            if (this.activeTasks[i] === null) {
                const nextTask = this.taskQueue.shift();
                if (!nextTask) {
                    break;
                }
                this.activeTasks[i] = nextTask;
                const { task, taskId, args } = nextTask;
                switch (task) {
                    case CALC_MANDLEBROT_BLOCK: 
                    case CALC_MANDLEBROT_BLOCK_SMOOTH: {
                        const [blockData, blockX, blockY, blockZoom, maxIter] = args;
                        this.workers[i].postMessage([task, taskId, blockData.buffer, blockX, blockY, blockZoom, maxIter], [blockData.buffer]);
                        break;
                    }
                    default: {
                        console.error(`[WorkerPool.js] Unknown task ${task}`);
                    }
                }
            }
        }
    }

    postTask(task, args) {
        const allTasks = [...this.activeTasks, ...this.taskQueue].sort((a, b) => a.taskId - b.taskId);
        
        let taskId = 0;

        if (allTasks.length > 0 && allTasks[0].taskId === 0) {
            taskId = 1;
            while(allTasks[taskId].taskId === allTasks[taskId - 1].taskId + 1) {
                taskId += 1;
            }
        }

        return new Promise((resolve, reject) => {
            const newTask = {
                task,
                taskId,
                resolve,
                reject,
                args
            };
            this.taskQueue.push(newTask);
            this.saturateWorkers();
        });
    }
}

const instance = new WorkerPool();
Object.freeze(instance);
export default instance;
