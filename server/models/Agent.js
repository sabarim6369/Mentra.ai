const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const agentSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => nanoid(),
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  instructions: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Agent', agentSchema);
