
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const { videoId, settings, file } = await request.json();
    const authToken = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!authToken || !videoId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify authentication
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(authToken);

    // Get video document
    const db = getFirestore();
    const videoRef = db.collection('videos').doc(videoId);
    const videoDoc = await videoRef.get();

    if (!videoDoc.exists) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const videoData = videoDoc.data();
    if (videoData?.userId !== decodedToken.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update video status to processing
    await videoRef.update({
      status: 'processing',
      progress: 0,
      settings: settings,
      updatedAt: new Date(),
    });

    // Start real video enhancement process
    // The actual enhancement will be triggered from the frontend using VideoService
    // This endpoint now just updates the database status

    return NextResponse.json({
      success: true,
      message: 'Enhancement ready to start',
      videoId,
      settings: settings,
    });

  } catch (error) {
    console.error('Enhancement API error:', error);
    return NextResponse.json(
      { error: 'Enhancement failed' },
      { status: 500 }
    );
  }
}
