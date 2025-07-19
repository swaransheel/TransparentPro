import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface GeneratedQuestion {
  questionText: string;
  category: "sustainability" | "quality" | "transparency";
  importance: "high" | "medium" | "low";
  orderIndex: number;
}

interface TransparencyScoring {
  overallScore: number;
  sustainabilityScore: number;
  qualityScore: number;
  transparencyScore: number;
  insights: string[];
  recommendations: string[];
}

export async function generateQuestions(productData: {
  name: string;
  category: string;
  brand?: string;
  description?: string;
  materials?: string;
}): Promise<GeneratedQuestion[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are an expert in product transparency and sustainability assessment. Based on the following product information, generate 5-8 specific, detailed questions that would help assess the product's transparency, sustainability, and quality. The questions should be tailored to the product category and materials used.

Product Information:
- Name: ${productData.name}
- Category: ${productData.category}
- Brand: ${productData.brand || 'Not specified'}
- Description: ${productData.description || 'Not specified'}
- Materials: ${productData.materials || 'Not specified'}

For each question, determine:
1. The question text (should be specific and actionable)
2. Category (sustainability, quality, or transparency)
3. Importance level (high, medium, or low)
4. Order index (1-8, with most important questions first)

Return the response as a valid JSON object with this exact structure:
{
  "questions": [
    {
      "questionText": "string",
      "category": "sustainability|quality|transparency",
      "importance": "high|medium|low",
      "orderIndex": number
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text to extract JSON
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
    }
    
    const parsedResult = JSON.parse(jsonText);
    return parsedResult.questions || [];
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate AI questions: " + (error as Error).message);
  }
}

export async function calculateTransparencyScore(productData: any, questionsAndAnswers: Array<{
  questionText: string;
  answer: string;
  category: string;
  importance: string;
}>): Promise<TransparencyScoring> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are an expert transparency and sustainability assessor. Analyze the following product and its transparency assessment responses to calculate a comprehensive transparency score.

Product Information:
${JSON.stringify(productData, null, 2)}

Questions and Answers:
${questionsAndAnswers.map(qa => `
Question (${qa.category}, ${qa.importance}): ${qa.questionText}
Answer: ${qa.answer || 'No answer provided'}
`).join('\n')}

Calculate scores (0-100) for:
1. Overall transparency score
2. Sustainability score
3. Quality score  
4. Transparency score

Also provide:
5. Key insights (3-5 bullet points about strengths and areas for improvement)
6. Actionable recommendations (3-5 specific suggestions)

Provide accurate, fair scoring based on the completeness and quality of responses. Be constructive in insights and recommendations.

Return as a valid JSON object with this exact structure:
{
  "overallScore": number,
  "sustainabilityScore": number,
  "qualityScore": number,
  "transparencyScore": number,
  "insights": ["string"],
  "recommendations": ["string"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text to extract JSON
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
    }
    
    const parsedResult = JSON.parse(jsonText);
    
    return {
      overallScore: Math.max(0, Math.min(100, parsedResult.overallScore || 0)),
      sustainabilityScore: Math.max(0, Math.min(100, parsedResult.sustainabilityScore || 0)),
      qualityScore: Math.max(0, Math.min(100, parsedResult.qualityScore || 0)),
      transparencyScore: Math.max(0, Math.min(100, parsedResult.transparencyScore || 0)),
      insights: parsedResult.insights || [],
      recommendations: parsedResult.recommendations || []
    };
  } catch (error) {
    console.error("Error calculating transparency score:", error);
    throw new Error("Failed to calculate transparency score: " + (error as Error).message);
  }
}
