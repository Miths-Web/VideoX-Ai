
import { collection, addDoc, updateDoc, doc, deleteDoc, query, where, orderBy, getDocs, getDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

export interface VideoData {
  id?: string;
  userId: string;
  title: string;
  originalUrl?: string;
  enhancedUrl?: string;
  thumbnail?: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress?: number;
  duration?: string;
  originalResolution?: string;
  enhancedResolution?: string;
  originalSize?: number;
  enhancedSize?: number;
  createdAt: any;
  updatedAt: any;
  taskId?: string;
  settings?: {
    resolution: string;
    fps: string;
    enhanceColors: boolean;
    denoising: boolean;
    stabilization: boolean;
  };
}

export class VideoService {
  private static API_BASE = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_BACKEND_URL || 'https://videox-ai-backend.onrender.com'
    : process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  static async createVideo(videoData: Omit<VideoData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'videos'), {
        ...videoData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating video:', error);
      throw error;
    }
  }

  static async updateVideo(videoId: string, updates: Partial<VideoData>): Promise<void> {
    try {
      const videoRef = doc(db, 'videos', videoId);
      await updateDoc(videoRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  }

  static async getUserVideos(userId: string, status?: string): Promise<VideoData[]> {
    try {
      let q;
      if (status) {
        q = query(
          collection(db, 'videos'),
          where('userId', '==', userId),
          where('status', '==', status),
          orderBy('createdAt', 'desc')
        );
      } else {
        q = query(
          collection(db, 'videos'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as VideoData));
    } catch (error) {
      console.error('Error getting user videos:', error);
      throw error;
    }
  }

  static async getVideo(videoId: string): Promise<VideoData | null> {
    try {
      const videoRef = doc(db, 'videos', videoId);
      const videoSnap = await getDoc(videoRef);
      
      if (videoSnap.exists()) {
        return {
          id: videoSnap.id,
          ...videoSnap.data()
        } as VideoData;
      }
      return null;
    } catch (error) {
      console.error('Error getting video:', error);
      throw error;
    }
  }

  static async deleteVideo(videoId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'videos', videoId));
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }

  static async uploadVideo(file: File, userId: string, onProgress?: (progress: number) => void): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `${userId}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, `videos/${fileName}`);
      
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  }

  // Backend API Integration Methods
  static async enhanceVideoWithAI(
    file: File,
    enhancementType: string,
    settings: {
      resolution: string;
      fps: string;
      denoise: boolean;
      color_enhance: boolean;
      stabilize: boolean;
    }
  ): Promise<{ task_id: string; estimated_processing_time?: number }> {
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('enhancement_type', enhancementType);
      formData.append('resolution', settings.resolution);
      formData.append('fps', settings.fps);
      formData.append('denoising', settings.denoise.toString());
      formData.append('color_enhancement', settings.color_enhance.toString());
      formData.append('stabilization', settings.stabilize.toString());

      const response = await fetch(`${this.API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      return {
        task_id: result.task_id,
        estimated_processing_time: result.estimated_processing_time
      };
    } catch (error) {
      console.error('Error enhancing video:', error);

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to enhancement service. Please check your connection and try again.');
      }

      throw error;
    }
  }

  static async getEnhancementStatus(taskId: string): Promise<{
    task_id: string;
    status: string;
    progress: number;
    current_stage?: string;
    stages?: Record<string, number>;
    estimated_remaining?: number;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/api/status/${taskId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Task not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Status check failed');
      }

      return {
        task_id: result.task_id,
        status: result.status,
        progress: result.progress,
        current_stage: result.current_stage,
        stages: result.stages,
        estimated_remaining: result.estimated_remaining,
        error: result.error
      };
    } catch (error) {
      console.error('Error getting enhancement status:', error);

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to enhancement service. Please check your connection and try again.');
      }

      throw error;
    }
  }

  static async downloadEnhancedVideo(taskId: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.API_BASE}/api/download/${taskId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Enhanced video not found or not ready');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error downloading enhanced video:', error);

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to enhancement service. Please check your connection and try again.');
      }

      throw error;
    }
  }

  static getEnhancedVideoUrl(filename: string): string {
    return `${this.API_BASE}/outputs/${filename}`;
  }
}
