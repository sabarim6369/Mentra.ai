const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');

// Get all meetings for a user
router.get('/', async (req, res) => {
  try {
    const { userId, status, agentId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const query = { userId };
    
    if (status) {
      query.status = status;
    }
    
    if (agentId) {
      query.agentId = agentId;
    }

    const meetings = await Meeting.find(query).sort({ createdAt: -1 });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single meeting by ID
router.get('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ id: req.params.id });
    
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new meeting
router.post('/', async (req, res) => {
  try {
    const { name, userId, agentId, instructions, scheduledStartTime } = req.body;

    if (!name || !userId || !agentId || !instructions) {
      return res.status(400).json({ 
        error: 'name, userId, agentId, and instructions are required' 
      });
    }

    const meeting = new Meeting({
      name,
      userId,
      agentId,
      instructions,
      scheduledStartTime: scheduledStartTime ? new Date(scheduledStartTime) : null
    });

    const savedMeeting = await meeting.save();
    res.status(201).json(savedMeeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update meeting
router.put('/:id', async (req, res) => {
  try {
    const { name, status, instructions, scheduledStartTime, startedAt, endedAt, transcriptUrl, recordingUrl, summary } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (status) updateData.status = status;
    if (instructions) updateData.instructions = instructions;
    if (scheduledStartTime !== undefined) updateData.scheduledStartTime = scheduledStartTime ? new Date(scheduledStartTime) : null;
    if (startedAt !== undefined) updateData.startedAt = startedAt ? new Date(startedAt) : null;
    if (endedAt !== undefined) updateData.endedAt = endedAt ? new Date(endedAt) : null;
    if (transcriptUrl !== undefined) updateData.transcriptUrl = transcriptUrl;
    if (recordingUrl !== undefined) updateData.recordingUrl = recordingUrl;
    if (summary !== undefined) updateData.summary = summary;

    const meeting = await Meeting.findOneAndUpdate(
      { id: req.params.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete meeting
router.delete('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findOneAndDelete({ id: req.params.id });

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
