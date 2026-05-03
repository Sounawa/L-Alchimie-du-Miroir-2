import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-static";

import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { text, speed } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Limit text to 1024 characters (API constraint)
    const trimmedText = text.trim().slice(0, 1024);

    if (trimmedText.length === 0) {
      return NextResponse.json(
        { error: 'Text cannot be empty' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Use the correct TTS SDK API as documented
    const response = await zai.audio.tts.create({
      input: trimmedText,
      voice: 'tongtong',
      speed: typeof speed === 'number' && speed >= 0.5 && speed <= 2.0 ? speed : 0.9,
      response_format: 'mp3',
      stream: false,
    });

    // The SDK returns a standard Response object - use arrayBuffer()
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}
