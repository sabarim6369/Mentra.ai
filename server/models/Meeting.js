const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const meetingSchema = new mongoose.Schema({
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
  agentId: {
    type: String,
    required: true,
    ref: 'Agent'
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled', 'processing'],
    default: 'upcoming'
  },
  instructions: {
    type: String,
    required: true
  },
  startedAt: {
    type: Date
  },
  endedAt: {
    type: Date
  },
  transcriptUrl: {
    type: String
  },
  recordingUrl: {
    type: String
  },
  summary: {
    type: String
  },
  scheduledStartTime: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Meeting', meetingSchema);
