// queueController.js
const Queue = require('bull');
const os = require('os');
const cluster = require('cluster');
const QueueStatHistory = require('./models/queueStatHistory');

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

// Add a task with priority
const addTask = (task, priority = PRIORITY.MEDIUM) => {
  taskQueue.add(task, { priority });
  console.log(`📥 Task added with priority ${priority}`);
};

// Insert queue stats into history
const insertQueueStatsHistory = async (queueId, numItems, status) => {
  const history = new QueueStatHistory({
    queueId,
    numItems,
    status,
  });

  await history.save();
};

// Process tasks with smart prioritization
const processTasks = () => {
  taskQueue.process(async (job) => {
    console.log(`🚀 Processing task: ${job.data.name}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`✅ Task completed: ${job.data.name}`);
    await insertQueueStatsHistory(job.id, 1, 'completed');
  });
};

// Auto-scaling logic
const autoScale = () => {
  const numCPUs = os.cpus().length;

  if (cluster.isMaster) {
    console.log(`🧠 Master process is running with ${numCPUs} CPUs available.`);

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

// Monitor queue length for dynamic scaling
const monitorQueue = () => {
  setInterval(async () => {
    const waitingCount = await taskQueue.getWaitingCount();
    console.log(`📊 Queue length: ${waitingCount}`);

    if (waitingCount > 10) {
      console.log('🚨 High queue load detected! Consider scaling up...');
    }
  }, 5000);
};

module.exports = { addTask, processTasks, autoScale, monitorQueue, PRIORITY, insertQueueStatsHistory };
