// backend/src/controllers/farmController.js
// Manages farm data: CRUD operations with role-based access, audit trails, and webhooks
const Farm = require('./models/Farm');
const { logEvent } = require('./utils/logger');
const rateLimiter = require('./utils/rateLimiter');
const auditTrail = require('./utils/auditTrail');
const { triggerWebhook } = require('./utils/webhookUtils');
const { checkRole } = require('./middlewares/roleMiddleware');
const { reportError } = require('./context/ErrorContext');

exports.createFarm = [checkRole('admin'), rateLimiter(async (req, res) => {
  try {
    const farm = await Farm.create(req.body);
    logEvent('Farm Created', { farmId: farm._id, name: farm.name });
    auditTrail.record('Farm Created', farm._id, 'admin', new Date());
    triggerWebhook('farm.created', { farmId: farm._id, name: farm.name, timestamp: new Date() });
    res.status(201).json({ message: 'Farm successfully created', farm });
  } catch (error) {
    reportError(error, 'Create Farm');
    res.status(500).json({ error: error.message });
  }
})];

exports.getFarms = rateLimiter(async (req, res) => {
  try {
    const farms = await Farm.find();
    logEvent('Fetched Farms', { count: farms.length });
    auditTrail.record('Farms Fetched', null, req.user?.role || 'guest', new Date());
    res.json({ message: 'Farms successfully retrieved', farms });
  } catch (error) {
    reportError(error, 'Get Farms');
    res.status(500).json({ error: error.message });
  }
});

exports.updateFarm = [checkRole('admin'), rateLimiter(async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFarm = await Farm.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedFarm) return res.status(404).json({ message: 'Farm not found' });

    logEvent('Farm Updated', { farmId: id });
    auditTrail.record('Farm Updated', id, 'admin', new Date());
    triggerWebhook('farm.updated', { farmId: id, timestamp: new Date() });
    res.json({ message: 'Farm successfully updated', updatedFarm });
  } catch (error) {
    reportError(error, 'Update Farm');
    res.status(500).json({ error: error.message });
  }
})];

exports.deleteFarm = [checkRole('admin'), rateLimiter(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFarm = await Farm.findByIdAndDelete(id);
    if (!deletedFarm) return res.status(404).json({ message: 'Farm not found' });

    logEvent('Farm Deleted', { farmId: id });
    auditTrail.record('Farm Deleted', id, 'admin', new Date());
    triggerWebhook('farm.deleted', { farmId: id, timestamp: new Date() });
    res.json({ message: 'Farm successfully deleted' });
  } catch (error) {
    reportError(error, 'Delete Farm');
    res.status(500).json({ error: error.message });
  }
})];
