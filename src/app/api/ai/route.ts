import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, type, context } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let systemPrompt = '';
    
    switch (type) {
      case 'chat':
        systemPrompt = `You are a helpful legal assistant specializing in UAE legal documents and notarization processes. 
        You help users understand document requirements, legal procedures, and provide guidance on notarization and attestation processes in the UAE.
        Be concise, accurate, and helpful. Always remind users to consult with qualified legal professionals for specific legal advice.`;
        break;
      
      case 'document-analysis':
        systemPrompt = `You are a document analysis expert specializing in UAE legal documents. 
        Analyze the provided document and identify:
        1. Document type and classification
        2. Required fields and their completeness
        3. Missing information or requirements
        4. Translation needs (Arabic/English)
        5. Quality assessment and formatting issues
        6. Specific requirements for UAE notarization/attestation
        
        Provide a structured analysis with actionable recommendations.`;
        break;
      
      case 'requirements-check':
        systemPrompt = `You are a UAE legal requirements specialist. 
        For the given document type, provide:
        1. Complete list of required documents
        2. Formatting and content requirements
        3. Translation requirements
        4. Notarization/attestation steps
        5. Common issues and how to avoid them
        
        Be specific to UAE legal requirements and processes.`;
        break;
      
      default:
        systemPrompt = `You are a helpful assistant specializing in UAE legal documents and processes.`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: context ? `${context}\n\n${message}` : message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content || 'No response generated';

    return NextResponse.json({ 
      response,
      usage: completion.usage
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}