import time
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

class TaskManager:
    """
    Manages video enhancement tasks with progress tracking
    """

    def __init__(self):
        self.tasks: Dict[str, Dict[str, Any]] = {}
        self.max_age_hours = 24  # Clean up tasks after 24 hours

    def create_task(self, task_id: str, video_path: str, enhancement_type: str, settings, temp_dir: str):
        """Create a new task"""
        self.tasks[task_id] = {
            "task_id": task_id,
            "status": "processing",
            "progress": 0,
            "current_stage": "initializing",
            "stages": {
                "downloading": 0,
                "extracting_frames": 0,
                "enhancing_frames": 0,
                "rebuilding_video": 0,
                "uploading": 0
            },
            "video_path": video_path,
            "enhancement_type": enhancement_type,
            "settings": settings.dict() if hasattr(settings, 'dict') else settings,
            "temp_dir": temp_dir,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "estimated_remaining": None,
            "enhanced_video_path": None,
            "error": None
        }

    def update_progress(self, task_id: str, progress: int, stage: str, estimated_remaining: Optional[int] = None):
        """Update task progress"""
        if task_id in self.tasks:
            self.tasks[task_id]["progress"] = min(100, max(0, progress))
            self.tasks[task_id]["current_stage"] = stage
            self.tasks[task_id]["stages"][stage] = min(100, max(0, progress))
            self.tasks[task_id]["updated_at"] = datetime.now()

            if estimated_remaining is not None:
                self.tasks[task_id]["estimated_remaining"] = estimated_remaining

    def complete_task(self, task_id: str, enhanced_video_path: str):
        """Mark task as completed"""
        if task_id in self.tasks:
            self.tasks[task_id]["status"] = "completed"
            self.tasks[task_id]["progress"] = 100
            self.tasks[task_id]["enhanced_video_path"] = enhanced_video_path
            self.tasks[task_id]["updated_at"] = datetime.now()
            self.tasks[task_id]["estimated_remaining"] = 0

    def fail_task(self, task_id: str, error_message: str):
        """Mark task as failed"""
        if task_id in self.tasks:
            self.tasks[task_id]["status"] = "failed"
            self.tasks[task_id]["error"] = error_message
            self.tasks[task_id]["updated_at"] = datetime.now()

    def get_task(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get task by ID"""
        return self.tasks.get(task_id)

    def list_tasks(self) -> List[Dict[str, Any]]:
        """List all tasks"""
        return list(self.tasks.values())

    def get_active_tasks(self) -> List[str]:
        """Get IDs of active (processing) tasks"""
        return [
            task_id for task_id, task in self.tasks.items()
            if task["status"] == "processing"
        ]

    def get_completed_tasks(self) -> List[str]:
        """Get IDs of completed tasks"""
        return [
            task_id for task_id, task in self.tasks.items()
            if task["status"] == "completed"
        ]

    def get_failed_tasks(self) -> List[str]:
        """Get IDs of failed tasks"""
        return [
            task_id for task_id, task in self.tasks.items()
            if task["status"] == "failed"
        ]

    def cleanup_task(self, task_id: str):
        """Remove task from memory"""
        if task_id in self.tasks:
            del self.tasks[task_id]

    def cleanup_old_tasks(self):
        """Remove tasks older than max_age_hours"""
        cutoff_time = datetime.now() - timedelta(hours=self.max_age_hours)
        old_task_ids = [
            task_id for task_id, task in self.tasks.items()
            if task["created_at"] < cutoff_time
        ]

        for task_id in old_task_ids:
            self.cleanup_task(task_id)

        return len(old_task_ids)