const mongoose = require('mongoose');

const versionCommentSchema = new mongoose.Schema({
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  version: Date,
  comment: String,
});

const VersionComment = mongoose.model('VersionComment', versionCommentSchema);
module.exports = VersionComment;
