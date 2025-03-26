const mongoose = require('mongoose');

// Define the schema for the template
const templateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,  // Trim leading and trailing whitespaces
    maxlength: [100, 'Title cannot be longer than 100 characters'],  // Add a max length constraint
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
    maxlength: [5000, 'Content cannot be longer than 5000 characters'],  // Add a max length constraint
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please add at least one category'],  // Ensure at least one category is assigned
  }],
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    required: [true, 'Please add at least one tag'],  // Ensure at least one tag is assigned
  }],
  deleted: {
    type: Boolean,
    default: false,  // Indicates if the template is deleted (soft delete)
  },
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

// Create indexes for better performance when querying by categories, tags, or deleted flag
templateSchema.index({ categories: 1 });
templateSchema.index({ tags: 1 });
templateSchema.index({ deleted: 1 });  // Index for soft deletes to make querying non-deleted templates faster

// Enhance the schema with population capabilities
templateSchema.methods.populateCategoriesAndTags = function() {
  return this.populate({
    path: 'categories',
    select: 'name -_id',  // Only return category name field
  }).populate({
    path: 'tags',
    select: 'name -_id',  // Only return tag name field
  });
};

// Model and export Template
const Template = mongoose.model('Template', templateSchema);
module.exports = Template;
