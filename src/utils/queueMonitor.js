// queueMonitor.js
const Queue = require('bull');

const taskQueue = new Queue('taskQueue', {
  redis: { host: '127.0.0.1', port: 6379 },
});

// Get queue stats
const getQueueStats = async (req, res) => {
  try {
    const waiting = await taskQueue.getWaitingCount();
    const active = await taskQueue.getActiveCount();
    const completed = await taskQueue.getCompletedCount();
    const failed = await taskQueue.getFailedCount();
    
    res.status(200).json({
      waiting,
      active,
      completed,
      failed,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getQueueStats };
