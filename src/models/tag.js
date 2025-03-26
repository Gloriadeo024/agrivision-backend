const mongoose = require('mongoose');

// Define the schema for tags
const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a tag name'],
    unique: true,  // Ensure that tag names are unique
    trim: true,  // Trim leading and trailing whitespaces
    maxlength: [50, 'Tag name cannot be longer than 50 characters'],  // Maximum length for tag name
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be longer than 200 characters'],  // Optional description for the tag
  },
  deleted: {
    type: Boolean,
    default: false,  // Flag to mark if the tag is deleted
  },
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

// Indexes for faster searching by name and deleted flag
tagSchema.index({ name: 1 });
tagSchema.index({ deleted: 1 });  // Index for efficient querying of non-deleted tags

// Pre-save validation to ensure tag name uniqueness
tagSchema.pre('save', async function (next) {
  const tagExists = await Tag.findOne({ name: this.name }).exec();
  if (tagExists) {
    const error = new Error('Tag name must be unique');
    next(error);
  }
  next();
});

// Soft delete method to update the 'deleted' flag
tagSchema.methods.softDelete = async function () {
  this.deleted = true;
  return await this.save();
};

// Static method to get all active (non-deleted) tags
tagSchema.statics.getActiveTags = async function () {
  return await this.find({ deleted: false });
};

// Model and export Tag
const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
