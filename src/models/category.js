const mongoose = require('mongoose');

// Define the schema for categories
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,  // Ensure the category name is unique
    trim: true,  // Trim leading and trailing whitespaces
    maxlength: [100, 'Category name cannot be longer than 100 characters'],  // Maximum length of category name
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be longer than 500 characters'],  // Optional description for the category
  },
  deleted: {
    type: Boolean,
    default: false,  // Default value indicating the category is not deleted
  },
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

// Create indexes for better performance when querying by name or deleted flag
categorySchema.index({ name: 1 });
categorySchema.index({ deleted: 1 });  // Index for efficient querying of non-deleted categories

// Ensure category name uniqueness and validate properly
categorySchema.pre('save', async function (next) {
  const categoryExists = await Category.findOne({ name: this.name }).exec();
  if (categoryExists) {
    const error = new Error('Category name must be unique');
    next(error);
  }
  next();
});

// Soft delete method to update the 'deleted' flag instead of removing the category
categorySchema.methods.softDelete = async function() {
  this.deleted = true;
  return await this.save();
};

// Static method to get all active (non-deleted) categories
categorySchema.statics.getActiveCategories = async function() {
  return await this.find({ deleted: false });
};

// Model and export Category
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
