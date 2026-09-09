require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/agents', require('./routes/agents'));
app.use('/api/meetings', require('./routes/meetings'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/webhook', require('./routes/webhook'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mentra.ai API Server is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
