import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { message, chapterContext } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const systemPrompt = `Tu es un guide spirituel bienveillant spécialisé dans le tadabbur (méditation réflexive du Coran). Tu aides les utilisateurs à approfondir leur compréhension des versets du Coran avec sagesse et douceur.

Ton approche :
- Tu cites les sources islamiques authentiques quand c'est pertinent (Al-Ghazālī, Ibn al-Qayyim, Ibn ʿArabī)
- Tu encourages la réflexion personnelle plutôt que de donner des réponses dogmatiques
- Tu utilises les concepts de "miroir" — chaque verset reflète l'état de l'âme du lecteur
- Tu réponds en français avec des termes arabes translittérés quand nécessaire
- Tu es respectueux, humble et inspirant
- Tu ne remplaces pas un scholar — tu orientes vers la recherche de savoir

${chapterContext ? `Contexte actuel : L'utilisateur médite sur le chapitre "${chapterContext}".` : ''}`;

    const response = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    });

    const assistantMessage = response.choices[0]?.message?.content || 'Je suis désolé, je n\'ai pas pu générer une réponse.';

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
