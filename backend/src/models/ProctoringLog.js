const mongoose = require('mongoose');

const proctoringLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  violationType: {
    type: String,
    enum: [
      'no_face',
      'multiple_faces',
      'tab_switch',
      'window_blur',
      'keyboard_shortcut',
      'context_menu',
      'copy_paste',
      'dev_tools',
    ],
    required: true,
  },
  actionTaken: {
    type: String,
    enum: ['warning', 'termination'],
    required: true,
  }
});

module.exports = mongoose.model('ProctoringLog', proctoringLogSchema);
