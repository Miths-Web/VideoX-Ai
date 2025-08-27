
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const authToken = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!authToken || !userId || !file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify user authentication
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(authToken);
    
    if (decodedToken.uid !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Upload file to Firebase Storage
    const storage = getStorage();
    const bucket = storage.bucket();
    const fileName = `videos/${userId}/${Date.now()}_${file.name}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    const fileUpload = bucket.file(fileName);
    await fileUpload.save(fileBuffer, {
      metadata: {
        contentType: file.type,
      },
    });

    // Get download URL
    const [downloadURL] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Save video record to Firestore
    const db = getFirestore();
    const videoDoc = await db.collection('videos').add({
      userId,
      title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
      originalUrl: downloadURL,
      status: 'uploaded',
      originalSize: file.size,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      videoId: videoDoc.id,
      downloadURL,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
