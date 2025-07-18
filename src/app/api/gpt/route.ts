import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from "openai/resources/chat";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const maxDuration = 60; // Maximum allowed duration for Vercel Hobby is 60s
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check request size - Vercel has a 4.5MB limit for serverless functions
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 4.5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'Request too large. Vercel serverless functions have a 4.5MB limit. Please compress your image or consider using cloud storage.'
      }, { status: 413 });
    }

    // Check API key first
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json({ 
        error: 'AI service not configured. Please add OPENAI_API_KEY to your .env.local file.'
      }, { status: 500 });
    }

    const body = await request.json();
    const { type, ...params } = body;

    console.log('GPT API request type:', type);

    switch (type) {
      case 'document-analysis':
        return await handleDocumentAnalysis(params);
      
      case 'chat':
        return await handleChat(params);
      
      default:
        return NextResponse.json({ 
          error: 'Invalid request type. Use "document-analysis" or "chat"' 
        }, { status: 400 });
    }

  } catch (error) {
    console.error('GPT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

interface DocumentAnalysisParams {
  fileName: string;
  fileType: string;
  fileBase64: string | string[]; // Support multiple files (e.g., PDF pages)
}

async function handleDocumentAnalysis(params: DocumentAnalysisParams) {
  const { fileName, fileType, fileBase64 } = params;

  if (!fileName || !fileType) {
    return NextResponse.json({ 
      error: 'File name and type are required',
      received: { fileName: !!fileName, fileType: !!fileType, fileBase64: !!fileBase64 }
    }, { status: 400 });
  }

  if (!fileBase64) {
    return NextResponse.json({ 
      error: 'File content (base64) is required' 
    }, { status: 400 });
  }

  // Handle multiple files (e.g., PDF pages)
  const files = Array.isArray(fileBase64) ? fileBase64 : [fileBase64];
  const totalSize = files.reduce((sum, file) => sum + file.length, 0);
  const fileSizeMB = (totalSize * 0.75 / 1024 / 1024).toFixed(2); // Base64 is ~33% larger
  console.log('Processing document:', fileName, 'Type:', fileType, 'Files:', files.length, 'Total Size:', fileSizeMB, 'MB');

  const visionPrompt = `Analyze this legal document for UAE processing. Respond ONLY with valid JSON in this exact format:

{
  "documentType": "specific document type (e.g., Birth Certificate, Passport, Educational Certificate)",
  "confidence": 95,
  "language": "detected language",
  "needsTranslation": false,
  "needsArabicTranslation": false,
  "quality": "good/fair/poor",
  "recommendations": [
    "Action 1: Brief actionable step",
    "Action 2: Brief actionable step",
    "Action 3: Brief actionable step"
  ],
  "notarizationSteps": [
    "Step 1: Brief notarization step",
    "Step 2: Brief notarization step"
  ],
  "estimatedTime": "5-7 business days",
  "priority": "high/medium/low"
}

File: "${fileName}"

Provide 3-5 concise, actionable recommendations for UAE legal compliance and notarization. Focus on practical next steps.`;

  try {
    // Build content array with text prompt and all image files
    const content = [
      {
        type: "text",
        text: files.length > 1 ? 
          `${visionPrompt}\n\nThis document has ${files.length} pages. Please analyze all pages together.` : 
          visionPrompt
      },
      // Add all files as image_url entries
      ...files.map(file => ({
        type: "image_url",
        image_url: {
          url: file.startsWith('http') ? file : file, // Support both URLs and base64
          detail: "high" // Use high detail for better accuracy
        }
      }))
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: content
        }
      ],
      max_tokens: 2000,
      temperature: 0.3
    });

    const analysis = completion.choices[0]?.message?.content || '{}';
    
    console.log('GPT-4o Vision Analysis Response:', analysis);

    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanedAnalysis = analysis.trim();
      
      // Remove ```json and ``` markers if they exist
      if (cleanedAnalysis.startsWith('```json')) {
        cleanedAnalysis = cleanedAnalysis.replace(/^```json\s*/, '');
      }
      if (cleanedAnalysis.startsWith('```')) {
        cleanedAnalysis = cleanedAnalysis.replace(/^```\s*/, '');
      }
      if (cleanedAnalysis.endsWith('```')) {
        cleanedAnalysis = cleanedAnalysis.replace(/\s*```$/, '');
      }
      
      // Parse JSON response
      const parsedAnalysis = JSON.parse(cleanedAnalysis);
      
      // Ensure we have the expected structure
      const structuredAnalysis = {
        documentType: parsedAnalysis.documentType || 'Unknown Document',
        confidence: parsedAnalysis.confidence || 85,
        language: parsedAnalysis.language || 'Unknown',
        needsTranslation: parsedAnalysis.needsTranslation || false,
        needsArabicTranslation: parsedAnalysis.needsArabicTranslation || false,
        quality: parsedAnalysis.quality || 'fair',
        recommendations: parsedAnalysis.recommendations || [],
        notarizationSteps: parsedAnalysis.notarizationSteps || [],
        estimatedTime: parsedAnalysis.estimatedTime || '5-7 business days',
        priority: parsedAnalysis.priority || 'medium',
        rawAnalysis: analysis
      };
      
      console.log('Extracted document type:', structuredAnalysis.documentType);

      return NextResponse.json({ 
        analysis: structuredAnalysis,
        usage: completion.usage
      });
      
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      
      // Fallback to basic analysis if JSON parsing fails
      const fallbackAnalysis = {
        documentType: 'Unknown Document',
        confidence: 75,
        language: 'Unknown',
        needsTranslation: false,
        needsArabicTranslation: false,
        quality: 'fair',
        recommendations: ['Please re-upload the document for better analysis'],
        notarizationSteps: ['Contact support for assistance'],
        estimatedTime: '5-7 business days',
        priority: 'medium',
        rawAnalysis: analysis
      };
      
      return NextResponse.json({ 
        analysis: fallbackAnalysis,
        usage: completion.usage
      });
    }

  } catch (error) {
    console.error('Document analysis error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Service temporarily busy. Please try again in a moment.' },
          { status: 429 }
        );
      }
      
      if (error.message.includes('invalid_api_key')) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your OpenAI API key configuration.' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: 'Document analysis failed', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Document analysis failed' },
      { status: 500 }
    );
  }
}

interface ChatParams {
  message: string;
  conversationHistory?: ChatCompletionMessageParam[];
}

async function handleChat(params: ChatParams) {
  const { message, conversationHistory } = params;

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  // Build conversation context
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
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
    role: "user",
    content: message
  });

  try {
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
    console.error('Chat error:', error);
    
    if (error instanceof Error) {
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
      { error: 'Chat service error' },
      { status: 500 }
    );
  }
}

// No helper functions needed - using JSON parsing directly