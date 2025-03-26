// models/Transaction.js - Enhanced Transaction Model for AgriVision System
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' }, // Multi-currency support
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'reversed'], 
    default: 'pending' 
  },
  transactionType: { type: String, enum: ['deposit', 'withdrawal', 'purchase', 'refund'], required: true },
  referenceId: { type: String, unique: true, required: true }, // Unique reference ID
  relatedTransaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', default: null }, // Parent-child transactions
  paymentMethod: { type: String, enum: ['credit_card', 'paypal', 'bank_transfer', 'mobile_money'], required: true },
  tax: { type: Number, default: 0 }, // Automatic tax calculations
  fees: { type: Number, default: 0 }, // Additional fees if applicable
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }, // Timestamp for completed transactions
  transactionLog: [{
    action: String,
    timestamp: { type: Date, default: Date.now },
    status: String,
    details: String,
  }], // Logs transaction history
  digitalSignature: { type: String, required: true }, // Security feature
});

TransactionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

TransactionSchema.methods.markAsCompleted = function () {
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

TransactionSchema.methods.markAsFailed = function (reason) {
  this.status = 'failed';
  this.transactionLog.push({ action: 'Failed', status: 'failed', details: reason });
  return this.save();
};

TransactionSchema.methods.calculateTotalAmount = function () {
  return this.amount + this.tax + this.fees;
};

TransactionSchema.methods.attachRelatedTransaction = function (relatedTransactionId) {
  this.relatedTransaction = relatedTransactionId;
  return this.save();
};

module.exports = mongoose.model('Transaction', TransactionSchema);
