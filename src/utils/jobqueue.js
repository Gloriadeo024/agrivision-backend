// jobqueue.js
const Queue = require('bull');
const os = require('os');
const cluster = require('cluster');
const { insertQueueStatsHistory } = require('../models/queueStatHistory');

// Initialize the task queue
const taskQueue = new Queue('taskQueue', {
  redis: { host: '127.0.0.1', port: 6379 },
});

// Priority levels
const PRIORITY = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

// Add a task to the queue with priority
const addTask = async (task, priority = PRIORITY.MEDIUM) => {
  await taskQueue.add(task, { priority });
  console.log(`📥 Task added with priority ${priority}`);
};

// Process tasks
const processTasks = () => {
  taskQueue.process(async (job) => {
    try {
      console.log(`🚀 Processing task: ${job.data.name}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`✅ Task completed: ${job.data.name}`);

      await insertQueueStatsHistory(job.id, 1, 'completed');
    } catch (error) {
      console.error(`❌ Task failed: ${job.data.name}`, error);
      await insertQueueStatsHistory(job.id, 1, 'failed');
    }
  });
};

// Auto-scaling with cluster
const autoScale = () => {
  const numCPUs = os.cpus().length;

  if (cluster.isMaster) {
    console.log(`🧠 Master process running with ${numCPUs} CPUs.`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      console.log(`⚠️ Worker ${worker.process.pid} died. Spawning a new one...`);
      cluster.fork();
    });
  } else {
    processTasks();
  }
};

module.exports = { addTask, processTasks, autoScale, PRIORITY };
