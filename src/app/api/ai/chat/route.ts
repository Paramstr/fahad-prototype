import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Build conversation context
    const messages = [
      {
        role: "system" as const,
        content: `You are a knowledgeable legal assistant specializing in UAE legal processes, document notarization, and attestation services. 

        Your expertise includes:
        - UAE legal document requirements and procedures
        - Notarization and attestation processes in the UAE
        - Document translation requirements (Arabic/English)
        - Common legal procedures for expatriates and UAE residents
        - Embassy and consulate procedures
        - MOFA (Ministry of Foreign Affairs) requirements
        - Legal document formatting and compliance

        Guidelines:
        - Provide clear, accurate information about UAE legal processes
        - Be helpful and professional
        - Always recommend consulting with qualified legal professionals for specific legal advice
        - Explain complex procedures in simple terms
        - Provide step-by-step guidance when appropriate
        - Include relevant timeframes and costs when known
        - Mention required documents and prerequisites

        Important: This is for informational purposes only and does not constitute legal advice.`
      }
    ];

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      messages.push(...conversationHistory.slice(-10)); // Keep last 10 messages for context
    }

    // Add current message
    messages.push({
      role: "user" as const,
      content: message
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 800,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

    return NextResponse.json({ 
      response,
      usage: completion.usage,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    if (error instanceof Error) {
      // Handle specific OpenAI errors
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Service temporarily busy. Please try again in a moment.' },
          { status: 429 }
        );
      }
      
      if (error.message.includes('invalid API key')) {
        return NextResponse.json(
          { error: 'Service configuration error. Please contact support.' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Chat service temporarily unavailable', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}