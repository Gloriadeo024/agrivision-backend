// versionController.js
const Version = require('./models/Version');
const { logEvent } = require('./utils/logger');
const auditTrail = require('./utils/auditTrail');
const { categorizeError } = require('./utils/errorCategorizer');
const { checkRole } = require('./middlewares/roleMiddleware');

// Create a new version
exports.createVersion = [checkRole('admin'), async (req, res) => {
  try {
    const version = await Version.create(req.body);
    logEvent('Version Created', { versionId: version._id, name: version.name });
    auditTrail.record('Version Created', version._id, 'admin');
    res.status(201).json({ message: 'Version successfully created', version });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
}];

// Get all versions
exports.getVersions = async (req, res) => {
  try {
    const versions = await Version.find();
    logEvent('Fetched Versions', { count: versions.length });
    res.status(200).json({ message: 'Versions retrieved successfully', versions });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

// Update a version
exports.updateVersion = [checkRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVersion = await Version.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedVersion) return res.status(404).json({ message: 'Version not found' });
    logEvent('Version Updated', { versionId: id });
    auditTrail.record('Version Updated', id, 'admin');
    res.status(200).json({ message: 'Version updated successfully', updatedVersion });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
}];

// Delete a version
exports.deleteVersion = [checkRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVersion = await Version.findByIdAndDelete(id);
    if (!deletedVersion) return res.status(404).json({ message: 'Version not found' });
    logEvent('Version Deleted', { versionId: id });
    auditTrail.record('Version Deleted', id, 'admin');
    res.status(200).json({ message: 'Version deleted successfully' });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
}];
