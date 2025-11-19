const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/download/:filename - Download enhanced video
router.get('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({
        success: false,
        error: 'Filename is required'
      });
    }

    // Forward request to Python AI service
    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
    const response = await axios.get(`${pythonServiceUrl}/download/${filename}`, {
      responseType: 'stream',
      timeout: 60000 // 60 seconds timeout for large files
    });

    // Set appropriate headers for video download
    const contentType = response.headers['content-type'];
    const contentLength = response.headers['content-length'];

    res.setHeader('Content-Type', contentType || 'video/mp4');
    res.setHeader('Content-Length', contentLength);
    res.setHeader('Cache-Control', 'no-cache');

    // Stream the video file to the client
    response.data.pipe(res);

  } catch (error) {
    console.error('Download error:', error);

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        error: 'Enhanced video not found'
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data.error || 'Download failed'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Unable to download video. Please try again.'
    });
  }
});

module.exports = router;