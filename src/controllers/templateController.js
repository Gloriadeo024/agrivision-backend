// templateController.js
const Template = require('./models/Template');
const { logEvent } = require('./utils/logger');
const auditTrail = require('./utils/auditTrail');
const { categorizeError } = require('./utils/errorCategorizer');
const { checkRole } = require('./middlewares/roleMiddleware');

// Create a new template
exports.createTemplate = [checkRole('admin'), async (req, res) => {
  try {
    const template = await Template.create(req.body);
    logEvent('Template Created', { templateId: template._id, name: template.name });
    auditTrail.record('Template Created', template._id, 'admin');
    res.status(201).json({ message: 'Template successfully created', template });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
}];

// Get all templates
exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find();
    logEvent('Fetched Templates', { count: templates.length });
    res.status(200).json({ message: 'Templates retrieved successfully', templates });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

// Update a template
exports.updateTemplate = [checkRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTemplate = await Template.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTemplate) return res.status(404).json({ message: 'Template not found' });
    logEvent('Template Updated', { templateId: id });
    auditTrail.record('Template Updated', id, 'admin');
    res.status(200).json({ message: 'Template updated successfully', updatedTemplate });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
}];

// Delete a template
exports.deleteTemplate = [checkRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTemplate = await Template.findByIdAndDelete(id);
    if (!deletedTemplate) return res.status(404).json({ message: 'Template not found' });
    logEvent('Template Deleted', { templateId: id });
    auditTrail.record('Template Deleted', id, 'admin');
    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
}];
