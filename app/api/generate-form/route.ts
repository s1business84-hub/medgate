import { NextRequest, NextResponse } from "next/server";

// Using OpenAI's API client library would be ideal, but for this implementation,
// we'll create a direct API call to OpenAI's GPT-4o model

interface FormQuestion {
  id: string;
  type: "text" | "textarea" | "multiple-choice" | "rating" | "date" | "time";
  question: string;
  description?: string;
  required: boolean;
  options?: string[]; // For multiple choice
  placeholder?: string;
  maxLength?: number;
  minRating?: number;
  maxRating?: number;
}

interface GeneratedForm {
  title: string;
  description: string;
  questions: FormQuestion[];
  estimatedTime: number;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, hospitalName } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.warn("OPENAI_API_KEY not configured, using mock data");
      return NextResponse.json(mockFormResponse(prompt, hospitalName));
    }

    const systemPrompt = `You are an expert form designer for medical education and healthcare. 
Your task is to create well-structured, professional forms based on user prompts.
Generate a JSON response with the following structure:
{
  "title": "Form Title",
  "description": "Brief description of the form purpose",
  "questions": [
    {
      "id": "q1",
      "type": "text|textarea|multiple-choice|rating|date|time",
      "question": "Question text",
      "description": "Optional description",
      "required": true/false,
      "options": ["option1", "option2"] (only for multiple-choice),
      "placeholder": "Placeholder text",
      "maxLength": 100,
      "minRating": 1,
      "maxRating": 5
    }
  ],
  "estimatedTime": 10
}

Important:
- Create 5-10 relevant questions based on the prompt
- Use appropriate field types (text, textarea, multiple-choice, rating, etc.)
- Make sure questions are clear and professional
- For medical forms, include appropriate rating scales and validation
- Set reasonable maxLength and other constraints
- Return ONLY valid JSON, no additional text`;

    const userMessage = `Create a form based on this prompt: "${prompt}"${
      hospitalName ? ` This is for ${hospitalName} hospital.` : ""
    }`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        { error: "Failed to generate form", details: error },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No content returned from API" },
        { status: 500 }
      );
    }

    try {
      const formData = JSON.parse(content);
      return NextResponse.json(formData);
    } catch (parseError) {
      console.error("Failed to parse response:", content);
      return NextResponse.json(
        { error: "Invalid form data returned", details: parseError },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating form:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

// Mock response for when API is not configured
function mockFormResponse(
  prompt: string,
  hospitalName: string = "Your Hospital"
): GeneratedForm {
  return {
    title: `Form: ${prompt.substring(0, 50)}...`,
    description: `This form was created to gather information about ${prompt.toLowerCase()}. Please answer all questions thoroughly.`,
    questions: [
      {
        id: "q1",
        type: "text",
        question: "What is your name?",
        required: true,
        placeholder: "Enter your full name",
        maxLength: 100,
      },
      {
        id: "q2",
        type: "textarea",
        question: `How would you describe your experience with ${prompt.toLowerCase()}?`,
        description: "Please provide detailed feedback",
        required: true,
        maxLength: 500,
        placeholder: "Your response here...",
      },
      {
        id: "q3",
        type: "rating",
        question: "Rate your overall experience",
        required: true,
        minRating: 1,
        maxRating: 5,
      },
      {
        id: "q4",
        type: "multiple-choice",
        question: "Which of the following best applies?",
        required: true,
        options: ["Very much agree", "Somewhat agree", "Neutral", "Disagree"],
      },
      {
        id: "q5",
        type: "date",
        question: "When would you like to schedule a follow-up?",
        required: false,
      },
      {
        id: "q6",
        type: "textarea",
        question: "Any additional comments?",
        required: false,
        maxLength: 300,
        placeholder: "Optional comments...",
      },
    ],
    estimatedTime: 10,
  };
}
