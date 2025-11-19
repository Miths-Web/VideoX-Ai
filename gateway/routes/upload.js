const express = require('express');
const multer = require('multer');
const axios = require('axios');
const Joi = require('joi');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP4, MOV, AVI, MKV, and WebM are allowed.'), false);
    }
  }
});

// Validation schema for enhancement settings
const enhancementSchema = Joi.object({
  resolution: Joi.string().valid('720p', '1080p', '4K', '8K').required(),
  fps: Joi.string().valid('24', '30', '60', '120').required(),
  denoising: Joi.boolean().required(),
  color_enhancement: Joi.boolean().required(),
  stabilization: Joi.boolean().required(),
  enhancement_type: Joi.string().valid('super_resolution', 'denoising', 'interpolation', 'restoration').required()
});

// POST /api/upload - Handle video upload and start enhancement
router.post('/', upload.single('video'), async (req, res) => {
  try {
    const {
      enhancement_type,
      resolution,
      fps,
      denoising,
      color_enhancement,
      stabilization
    } = req.body;

    // Validate enhancement settings
    const { error, value } = enhancementSchema.validate({
      enhancement_type,
      resolution,
      fps,
      denoising: denoising === 'true',
      color_enhancement: color_enhancement === 'true',
      stabilization: stabilization === 'true'
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No video file uploaded'
      });
    }

    // Prepare data for Python AI service
    const formData = new FormData();
    formData.append('video', new Blob([req.file.buffer]), req.file.originalname);
    formData.append('enhancement_type', value.enhancement_type);
    formData.append('enhancement_settings', JSON.stringify({
      resolution: value.resolution,
      fps: parseInt(value.fps),
      denoising: value.denoising,
      color_enhancement: value.color_enhancement,
      stabilization: value.stabilization
    }));

    // Forward request to Python AI service
    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
    const response = await axios.post(`${pythonServiceUrl}/process`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000 // 30 seconds timeout
    });

    // Return task_id to frontend
    res.json({
      success: true,
      task_id: response.data.task_id,
      estimated_processing_time: response.data.estimated_time || 300
    });

  } catch (error) {
    console.error('Upload error:', error);

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 500MB.'
      });
    }

    if (error.response) {
      // Error from Python service
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data.error || 'Processing service error'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Upload failed. Please try again.'
    });
  }
});

module.exports = router;