const { StreamClient } = require('@stream-io/node-sdk');

const streamVideo = new StreamClient(
  process.env.STREAM_VIDEO_API_KEY || '',
  process.env.STREAM_VIDEO_SECRET_KEY || ''
);

module.exports = { streamVideo };
