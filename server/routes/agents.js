const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');

// Get all agents for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const agents = await Agent.find({ userId }).sort({ createdAt: -1 });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single agent by ID
router.get('/:id', async (req, res) => {
  try {
    const agent = await Agent.findOne({ id: req.params.id });
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new agent
router.post('/', async (req, res) => {
  try {
    const { name, userId, instructions } = req.body;

    if (!name || !userId || !instructions) {
      return res.status(400).json({ 
        error: 'name, userId, and instructions are required' 
      });
    }

    const agent = new Agent({
      name,
      userId,
      instructions
    });

    const savedAgent = await agent.save();
    res.status(201).json(savedAgent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update agent
router.put('/:id', async (req, res) => {
  try {
    const { name, instructions } = req.body;

    const agent = await Agent.findOneAndUpdate(
      { id: req.params.id },
      { name, instructions },
      { new: true, runValidators: true }
    );

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete agent
router.delete('/:id', async (req, res) => {
  try {
    const agent = await Agent.findOneAndDelete({ id: req.params.id });

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
