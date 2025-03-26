// taskController.js
const Task = require('./models/Task');
const { logEvent } = require('./utils/logger');
const auditTrail = require('./utils/auditTrail');
const aiTaskOptimizer = require('./utils/aiTaskOptimizer');
const { categorizeError } = require('./utils/errorCategorizer');
const { triggerWebhook } = require('./utils/webhookUtils');
const rateLimiter = require('./utils/rateLimiter');

// Create a new task
exports.createTask = rateLimiter(async (req, res) => {
  try {
    const task = await Task.create(req.body);
    logEvent('Task Created', { taskId: task._id, name: task.name });
    auditTrail.record('Task Created', task._id, req.user?.role || 'user', new Date());
    triggerWebhook('task.created', { taskId: task._id, name: task.name, timestamp: new Date() });
    res.status(201).json({ message: 'Task successfully created', task });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
});

// Get all tasks
exports.getTasks = rateLimiter(async (req, res) => {
  try {
    const tasks = await Task.find();
    logEvent('Fetched Tasks', { count: tasks.length });
    auditTrail.record('Tasks Fetched', null, req.user?.role || 'guest', new Date());
    res.status(200).json({ message: 'Tasks successfully retrieved', tasks });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
});

// Update task
exports.updateTask = rateLimiter(async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
    
    logEvent('Task Updated', { taskId: id });
    auditTrail.record('Task Updated', id, req.user?.role || 'user', new Date());
    triggerWebhook('task.updated', { taskId: id, timestamp: new Date() });
    res.status(200).json({ message: 'Task successfully updated', updatedTask });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
});

// Delete task
exports.deleteTask = rateLimiter(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' });

    logEvent('Task Deleted', { taskId: id });
    auditTrail.record('Task Deleted', id, req.user?.role || 'user', new Date());
    triggerWebhook('task.deleted', { taskId: id, timestamp: new Date() });
    res.status(200).json({ message: 'Task successfully deleted' });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
});

// AI Optimization for tasks
exports.optimizeTasks = rateLimiter(async (req, res) => {
  try {
    const { taskId, taskData } = req.body;
    const optimizedPlan = await aiTaskOptimizer.optimize(taskId, taskData);
    logEvent('Task Optimization Completed', { taskId, optimizedPlan });
    auditTrail.record('Task Optimization', taskId);
    res.status(200).json({ message: 'Task optimization successful', optimizedPlan });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = exports;
