
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
    ? 'https://your-repl-name.replit.app' 
    : 'http://localhost:5000';

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
  ): Promise<{ task_id: string }> {
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('enhancement_type', enhancementType);
      formData.append('resolution', settings.resolution);
      formData.append('fps', settings.fps);
      formData.append('denoise', settings.denoise.toString());
      formData.append('color_enhance', settings.color_enhance.toString());
      formData.append('stabilize', settings.stabilize.toString());

      const response = await fetch(`${this.API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error enhancing video:', error);
      throw error;
    }
  }

  static async getEnhancementStatus(taskId: string): Promise<{
    task_id: string;
    status: string;
    progress: number;
    download_url?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/api/status/${taskId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting enhancement status:', error);
      throw error;
    }
  }

  static async downloadEnhancedVideo(filename: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.API_BASE}/api/download/${filename}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error downloading enhanced video:', error);
      throw error;
    }
  }

  static getEnhancedVideoUrl(filename: string): string {
    return `${this.API_BASE}/outputs/${filename}`;
  }
}
