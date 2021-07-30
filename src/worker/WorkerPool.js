class WorkerPool {
    constructor() {
        this.workers = [];
        this.activeTasks = [];
        this.taskQueue = [];
    }

    resize(numWorkers) {
        const numCurrentWorkers = this.workers.length;
        if (numWorkers > numCurrentWorkers) {
            for (let i = 0; i < numWorkers - numCurrentWorkers; i += 1) {
                const worker = new Worker('worker.js');
                const workerIndex = numCurrentWorkers + i;
                worker.onmessage = e => {
                    const { taskType, taskId, ...rest } = e.data;
                    if (this.activeTasks[workerIndex]?.taskId === taskId) {
                        this.activeTasks[workerIndex].resolve(rest);
                        this.activeTasks[workerIndex] = null;
                        this.saturateWorkers();
                    }
                };
                this.workers.push(worker);
                this.activeTasks.push(null);
            }
            this.saturateWorkers();
        } else if (numWorkers < numCurrentWorkers) {
            for (let i = 0; i < numCurrentWorkers - numWorkers; i += 1) {
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
                const { taskType, taskId, args } = nextTask;

                this.workers[i].postMessage({
                    taskType,
                    taskId,
                    workerId: i,
                    args,
                });
            }
        }
    }

    postTask(taskType, args) {
        const allTasks = [...this.activeTasks, ...this.taskQueue]
            .filter(e => e)
            .sort((a, b) => a.taskId - b.taskId);

        let taskId = 0;

        while (allTasks[taskId]?.taskId === taskId) {
            taskId += 1;
        }

        return new Promise((resolve, reject) => {
            const newTask = {
                taskType,
                taskId,
                resolve,
                reject,
                args,
            };
            this.taskQueue.push(newTask);
            this.saturateWorkers();
        });
    }

    filterTaskQueue(filterFn) {
        this.taskQueue = this.taskQueue.filter(filterFn);
    }
}

const instance = new WorkerPool();
export default instance;
