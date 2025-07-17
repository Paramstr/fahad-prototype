import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType, documentContent } = await request.json();

    if (!fileName || !fileType) {
      return NextResponse.json({ error: 'File name and type are required' }, { status: 400 });
    }

    const prompt = `Analyze this ${fileType} document: "${fileName}"
    
    ${documentContent ? `Document content: ${documentContent}` : ''}
    
    Please provide a detailed analysis including:
    1. Document type identification
    2. Completeness assessment (what's present vs missing)
    3. UAE legal requirements compliance
    4. Translation requirements (Arabic/English)
    5. Quality and formatting assessment
    6. Specific recommendations for notarization/attestation
    7. Confidence score (0-100%)
    
    Format your response as a structured analysis suitable for a legal document processing system.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert in UAE legal document analysis and notarization requirements. 
          Analyze documents for completeness, legal compliance, and provide specific recommendations for UAE processes.
          Always consider UAE-specific legal requirements and cultural considerations.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const analysis = completion.choices[0]?.message?.content || 'Analysis could not be completed';

    // Parse the analysis to extract structured data
    const structuredAnalysis = {
      documentType: extractDocumentType(analysis),
      confidence: extractConfidence(analysis),
      issues: extractIssues(analysis),
      recommendations: extractRecommendations(analysis),
      translationRequired: analysis.toLowerCase().includes('translation') || analysis.toLowerCase().includes('arabic'),
      completeness: extractCompleteness(analysis),
      rawAnalysis: analysis
    };

    return NextResponse.json({ 
      analysis: structuredAnalysis,
      usage: completion.usage
    });

  } catch (error) {
    console.error('Document analysis error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Document analysis failed', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function extractDocumentType(analysis: string): string {
  const typeMatch = analysis.match(/document type[:\s]*([^\n.]+)/i);
  return typeMatch ? typeMatch[1].trim() : 'Unknown';
}

function extractConfidence(analysis: string): number {
  const confidenceMatch = analysis.match(/confidence[:\s]*(\d+)%?/i);
  return confidenceMatch ? parseInt(confidenceMatch[1]) : 85;
}

function extractIssues(analysis: string): string[] {
  const issues: string[] = [];
  const issuePatterns = [
    /missing[:\s]*([^\n.]+)/gi,
    /required[:\s]*([^\n.]+)/gi,
    /incomplete[:\s]*([^\n.]+)/gi
  ];
  
  issuePatterns.forEach(pattern => {
    const matches = analysis.match(pattern);
    if (matches) {
      issues.push(...matches.map(match => match.trim()));
    }
  });
  
  return issues.slice(0, 5); // Limit to top 5 issues
}

function extractRecommendations(analysis: string): string[] {
  const recommendations: string[] = [];
  const recMatch = analysis.match(/recommendations?[:\s]*([^]*?)(?=\n\n|\d\.|$)/i);
  
  if (recMatch) {
    const recText = recMatch[1];
    const recItems = recText.split(/\n[-•]\s*|\n\d+\.\s*/).filter(item => item.trim());
    recommendations.push(...recItems.map(item => item.trim()).slice(0, 5));
  }
  
  return recommendations;
}

function extractCompleteness(analysis: string): number {
  const completenessMatch = analysis.match(/completeness[:\s]*(\d+)%?/i);
  if (completenessMatch) {
    return parseInt(completenessMatch[1]);
  }
  
  // Estimate based on issues found
  const issuesCount = extractIssues(analysis).length;
  return Math.max(100 - (issuesCount * 15), 20);
}