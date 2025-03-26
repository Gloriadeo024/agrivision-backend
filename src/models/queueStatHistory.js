const mongoose = require('mongoose');

const queueStatHistorySchema = new mongoose.Schema({
  queueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Queue' },
  timestamp: { type: Date, default: Date.now },
  numItems: Number,
  status: String,
});

const QueueStatHistory = mongoose.model('QueueStatHistory', queueStatHistorySchema);
module.exports = QueueStatHistory;
