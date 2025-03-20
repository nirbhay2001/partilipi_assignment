const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  type: {
    type: String,
    enum: ['promotion', 'order_update', 'recommendation', 'alert', 'other'],
    required: true,
  },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  sentAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

