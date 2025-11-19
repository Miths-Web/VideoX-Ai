import os
import uuid
import asyncio
import logging
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime

from fastapi import FastAPI, File, UploadFile, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import structlog
from pydantic import BaseModel
import aiofiles
import tempfile
import shutil

from services.enhancement_processor import EnhancementProcessor
from services.task_manager import TaskManager
from services.video_manager import VideoManager

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Initialize FastAPI app
app = FastAPI(
    title="VideoX-Ai Processor",
    description="AI-powered video enhancement service",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
task_manager = TaskManager()
video_manager = VideoManager()
enhancement_processor = EnhancementProcessor()

# Pydantic models
class EnhancementSettings(BaseModel):
    resolution: str
    fps: int
    denoising: bool
    color_enhancement: bool
    stabilization: bool

class ProcessRequest(BaseModel):
    video_url: str
    enhancement_settings: EnhancementSettings

class TaskResponse(BaseModel):
    task_id: str
    status: str
    estimated_time: int

class StatusResponse(BaseModel):
    task_id: str
    status: str
    progress: int
    current_stage: Optional[str]
    stages: Dict[str, int]
    estimated_remaining: Optional[int]
    error: Optional[str]

# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "gpu_available": enhancement_processor.is_gpu_available(),
        "active_tasks": len(task_manager.get_active_tasks()),
        "temp_dir": os.getenv("TEMP_DIR", "./temp")
    }

@app.get("/gpu-status")
async def gpu_status():
    """GPU status endpoint"""
    return {
        "gpu_available": enhancement_processor.is_gpu_available(),
        "gpu_memory": enhancement_processor.get_gpu_memory_info(),
        "cuda_available": enhancement_processor.is_cuda_available()
    }

@app.post("/process", response_model=TaskResponse)
async def start_processing(
    background_tasks: BackgroundTasks,
    video: UploadFile = File(...),
    enhancement_type: str = Form(...),
    enhancement_settings: str = Form(...)
):
    """
    Start video enhancement processing
    """
    try:
        # Validate file type
        allowed_types = ["video/mp4", "video/mov", "video/avi", "video/mkv", "video/webm"]
        if video.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type: {video.content_type}. Allowed types: {', '.join(allowed_types)}"
            )

        # Parse enhancement settings
        try:
            import json
            settings_dict = json.loads(enhancement_settings)
            settings = EnhancementSettings(**settings_dict)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid enhancement settings: {str(e)}"
            )

        # Generate task ID
        task_id = str(uuid.uuid4())

        # Create temp directory for this task
        temp_dir = Path(os.getenv("TEMP_DIR", "./temp")) / task_id
        temp_dir.mkdir(parents=True, exist_ok=True)

        # Save uploaded video
        video_path = temp_dir / video.filename
        async with aiofiles.open(video_path, 'wb') as f:
            content = await video.read()
            await f.write(content)

        # Initialize task
        task_manager.create_task(
            task_id=task_id,
            video_path=str(video_path),
            enhancement_type=enhancement_type,
            settings=settings,
            temp_dir=str(temp_dir)
        )

        # Start processing in background
        background_tasks.add_task(
            process_video_background,
            task_id,
            str(video_path),
            enhancement_type,
            settings,
            str(temp_dir)
        )

        # Estimate processing time (very rough estimate)
        file_size_mb = video_path.stat().st_size / (1024 * 1024)
        estimated_time = int(file_size_mb * 2)  # 2 seconds per MB estimate

        logger.info("Processing started",
                   task_id=task_id,
                   filename=video.filename,
                   file_size_mb=file_size_mb,
                   enhancement_type=enhancement_type)

        return TaskResponse(
            task_id=task_id,
            status="processing",
            estimated_time=estimated_time
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Processing start failed", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to start processing")

async def process_video_background(
    task_id: str,
    video_path: str,
    enhancement_type: str,
    settings: EnhancementSettings,
    temp_dir: str
):
    """
    Background task for video processing
    """
    try:
        # Update task status to downloading
        task_manager.update_progress(task_id, 0, "downloading")

        # Process video
        enhanced_video_path = await enhancement_processor.process_video(
            task_id=task_id,
            video_path=video_path,
            enhancement_type=enhancement_type,
            settings=settings,
            temp_dir=temp_dir,
            progress_callback=lambda progress, stage: task_manager.update_progress(task_id, progress, stage)
        )

        # Complete task
        task_manager.complete_task(task_id, enhanced_video_path)
        logger.info("Processing completed", task_id=task_id)

    except Exception as e:
        logger.error("Processing failed", task_id=task_id, error=str(e))
        task_manager.fail_task(task_id, str(e))

        # Cleanup temp directory on failure
        try:
            shutil.rmtree(temp_dir)
        except:
            pass

@app.get("/status/{task_id}", response_model=StatusResponse)
async def get_status(task_id: str):
    """
    Get processing status for a task
    """
    task = task_manager.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return StatusResponse(
        task_id=task_id,
        status=task["status"],
        progress=task["progress"],
        current_stage=task.get("current_stage"),
        stages=task.get("stages", {}),
        estimated_remaining=task.get("estimated_remaining"),
        error=task.get("error")
    )

@app.get("/tasks")
async def list_tasks():
    """
    List all tasks (for monitoring)
    """
    return {
        "tasks": task_manager.list_tasks(),
        "active_count": len(task_manager.get_active_tasks()),
        "completed_count": len(task_manager.get_completed_tasks()),
        "failed_count": len(task_manager.get_failed_tasks())
    }

@app.get("/download/{task_id}")
async def download_enhanced_video(task_id: str):
    """
    Download processed video
    """
    task = task_manager.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task["status"] != "completed":
        raise HTTPException(
            status_code=400,
            detail=f"Task not completed. Current status: {task['status']}"
        )

    if not task.get("enhanced_video_path"):
        raise HTTPException(status_code=404, detail="Enhanced video not found")

    video_path = Path(task["enhanced_video_path"])
    if not video_path.exists():
        raise HTTPException(status_code=404, detail="Enhanced video file not found")

    # Cleanup temp directory after download
    temp_dir = Path(task["temp_dir"])

    try:
        # Stream file and cleanup after
        def cleanup():
            try:
                shutil.rmtree(temp_dir)
                task_manager.cleanup_task(task_id)
                logger.info("Cleanup completed", task_id=task_id)
            except Exception as e:
                logger.error("Cleanup failed", task_id=task_id, error=str(e))

        return FileResponse(
            path=video_path,
            filename=f"enhanced_{task_id}.mp4",
            media_type="video/mp4",
            background=cleanup
        )

    except Exception as e:
        logger.error("Download failed", task_id=task_id, error=str(e))
        raise HTTPException(status_code=500, detail="Download failed")

# Cleanup on startup
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("VideoX-Ai Processor starting up...")

    # Create temp directory
    temp_dir = Path(os.getenv("TEMP_DIR", "./temp"))
    temp_dir.mkdir(exist_ok=True)

    # Initialize enhancement processor
    await enhancement_processor.initialize()

    logger.info("VideoX-Ai Processor startup complete")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("VideoX-Ai Processor shutting down...")

    # Cancel all active tasks
    for task_id in task_manager.get_active_tasks():
        task_manager.fail_task(task_id, "Server shutdown")

    logger.info("VideoX-Ai Processor shutdown complete")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("ENVIRONMENT") == "development",
        log_level="info"
    )