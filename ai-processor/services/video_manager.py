import os
import shutil
import tempfile
import subprocess
from pathlib import Path
from typing import Optional, Tuple
import cv2
import numpy as np

class VideoManager:
    """
    Handles video file operations: extraction, processing, reconstruction
    """

    def __init__(self):
        self.supported_formats = ['.mp4', '.mov', '.avi', '.mkv', '.webm']

    def validate_video_file(self, video_path: str) -> bool:
        """Validate video file format and integrity"""
        path = Path(video_path)

        if not path.exists():
            return False

        if path.suffix.lower() not in self.supported_formats:
            return False

        try:
            # Try to read video info using OpenCV
            cap = cv2.VideoCapture(str(path))
            if not cap.isOpened():
                return False

            # Try to read first frame
            ret, _ = cap.read()
            cap.release()

            return ret

        except Exception:
            return False

    def get_video_info(self, video_path: str) -> dict:
        """Get video properties"""
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError(f"Cannot open video: {video_path}")

        info = {
            'fps': cap.get(cv2.CAP_PROP_FPS),
            'frame_count': int(cap.get(cv2.CAP_PROP_FRAME_COUNT)),
            'width': int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
            'height': int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)),
            'duration': 0
        }

        if info['fps'] > 0:
            info['duration'] = info['frame_count'] / info['fps']

        cap.release()
        return info

    def extract_frames(self, video_path: str, output_dir: str, progress_callback=None) -> Tuple[int, str]:
        """
        Extract video frames to PNG sequence

        Returns:
            Tuple of (frame_count, output_pattern_path)
        """
        video_info = self.get_video_info(video_path)
        total_frames = video_info['frame_count']

        output_dir_path = Path(output_dir) / "frames"
        output_dir_path.mkdir(parents=True, exist_ok=True)

        # Use ffmpeg for frame extraction (faster than OpenCV)
        output_pattern = str(output_dir_path / "frame_%08d.png")

        cmd = [
            'ffmpeg',
            '-i', video_path,
            '-q:v', '2',  # High quality
            '-vsync', '0',  # Preserve frame rate
            output_pattern,
            '-y'  # Overwrite output files
        ]

        try:
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                universal_newlines=True
            )

            # Monitor progress
            while True:
                output = process.stderr.readline()
                if output == '' and process.poll() is not None:
                    break
                if output and progress_callback:
                    # Parse ffmpeg progress (basic parsing)
                    if "frame=" in output:
                        try:
                            frame_num = int(output.split("frame=")[1].split()[0])
                            progress = min(90, int((frame_num / total_frames) * 90))  # Max 90% for extraction
                            progress_callback(progress, "extracting_frames")
                        except:
                            pass

            return_code = process.poll()
            if return_code != 0:
                error_output = process.stderr.read()
                raise RuntimeError(f"Frame extraction failed: {error_output}")

        except Exception as e:
            raise RuntimeError(f"Frame extraction failed: {str(e)}")

        return total_frames, output_pattern

    def extract_audio(self, video_path: str, output_dir: str) -> Optional[str]:
        """
        Extract audio track from video

        Returns:
            Path to extracted audio file, or None if no audio
        """
        output_dir_path = Path(output_dir)
        output_dir_path.mkdir(parents=True, exist_ok=True)

        audio_output = str(output_dir_path / "audio.mp3")

        cmd = [
            'ffmpeg',
            '-i', video_path,
            '-q:a', '0',  # Best quality
            '-map', 'a',  # Extract audio only
            '-y',  # Overwrite
            audio_output
        ]

        try:
            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode != 0:
                # Check if there's no audio stream (this is normal)
                if "Stream #0:0: not a audio stream" in result.stderr or \
                   "No audio stream found" in result.stderr:
                    return None
                raise RuntimeError(f"Audio extraction failed: {result.stderr}")

            return audio_output

        except FileNotFoundError:
            raise RuntimeError("ffmpeg not found. Please install ffmpeg.")
        except Exception as e:
            raise RuntimeError(f"Audio extraction failed: {str(e)}")

    def reconstruct_video(
        self,
        frames_pattern: str,
        audio_path: Optional[str],
        output_path: str,
        original_fps: float,
        progress_callback=None
    ):
        """
        Reconstruct video from enhanced frames and original audio
        """
        output_dir = Path(output_path).parent
        output_dir.mkdir(parents=True, exist_ok=True)

        # Create temporary video without audio
        temp_video = str(output_dir / "temp_video.mp4")

        try:
            # Create video from frames
            cmd_video = [
                'ffmpeg',
                '-framerate', str(original_fps),
                '-i', frames_pattern,
                '-c:v', 'libx264',
                '-preset', 'medium',
                '-crf', '18',  # High quality
                '-pix_fmt', 'yuv420p',
                '-y',
                temp_video
            ]

            if progress_callback:
                progress_callback(95, "rebuilding_video")

            result = subprocess.run(cmd_video, capture_output=True, text=True)
            if result.returncode != 0:
                raise RuntimeError(f"Video reconstruction failed: {result.stderr}")

            # Add audio if available
            if audio_path and Path(audio_path).exists():
                cmd_audio = [
                    'ffmpeg',
                    '-i', temp_video,
                    '-i', audio_path,
                    '-c:v', 'copy',
                    '-c:a', 'aac',
                    '-map', '0:v:0',
                    '-map', '1:a:0',
                    '-y',
                    output_path
                ]
            else:
                # No audio, just move temp file
                shutil.move(temp_video, output_path)
                if progress_callback:
                    progress_callback(100, "rebuilding_video")
                return

            result = subprocess.run(cmd_audio, capture_output=True, text=True)
            if result.returncode != 0:
                raise RuntimeError(f"Audio merging failed: {result.stderr}")

            # Clean up temp file
            if Path(temp_video).exists():
                os.remove(temp_video)

            if progress_callback:
                progress_callback(100, "rebuilding_video")

        except Exception as e:
            # Clean up temp file on error
            if Path(temp_video).exists():
                os.remove(temp_video)
            raise RuntimeError(f"Video reconstruction failed: {str(e)}")

    def optimize_video(self, input_path: str, output_path: str, resolution: str = "auto"):
        """
        Optimize video for web delivery
        """
        input_path = Path(input_path)
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        try:
            if resolution == "auto":
                cmd = [
                    'ffmpeg',
                    '-i', str(input_path),
                    '-c:v', 'libx264',
                    '-preset', 'medium',
                    '-crf', '23',  # Good quality/size balance
                    '-c:a', 'aac',
                    '-movflags', '+faststart',  # Optimize for web streaming
                    '-y',
                    str(output_path)
                ]
            else:
                # Specific resolution optimization
                cmd = [
                    'ffmpeg',
                    '-i', str(input_path),
                    '-vf', f'scale={resolution}',
                    '-c:v', 'libx264',
                    '-preset', 'medium',
                    '-crf', '23',
                    '-c:a', 'aac',
                    '-movflags', '+faststart',
                    '-y',
                    str(output_path)
                ]

            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode != 0:
                raise RuntimeError(f"Video optimization failed: {result.stderr}")

        except Exception as e:
            raise RuntimeError(f"Video optimization failed: {str(e)}")

    def generate_thumbnail(self, video_path: str, output_path: str, timestamp: float = 1.0):
        """Generate thumbnail from video"""
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        cmd = [
            'ffmpeg',
            '-i', video_path,
            '-ss', str(timestamp),
            '-vframes', '1',
            '-q:v', '2',
            '-y',
            str(output_path)
        ]

        try:
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode != 0:
                raise RuntimeError(f"Thumbnail generation failed: {result.stderr}")

        except Exception as e:
            raise RuntimeError(f"Thumbnail generation failed: {str(e)}")

    def cleanup_temp_files(self, temp_dir: str):
        """Clean up temporary files"""
        try:
            if Path(temp_dir).exists():
                shutil.rmtree(temp_dir)
        except Exception as e:
            print(f"Warning: Failed to cleanup temp files: {e}")