const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/status/:taskId - Check processing status
router.get('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }

    // Forward request to Python AI service
    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
    const response = await axios.get(`${pythonServiceUrl}/status/${taskId}`, {
      timeout: 10000 // 10 seconds timeout
    });

    // Return processing status to frontend
    res.json({
      success: true,
      ...response.data
    });

  } catch (error) {
    console.error('Status check error:', error);

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data.error || 'Status check failed'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Unable to check status. Please try again.'
    });
  }
});

module.exports = router;