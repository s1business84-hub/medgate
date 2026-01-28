import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface FormGenerationRequest {
  prompt: string;
  formType?: 'assessment' | 'observation' | 'feedback' | 'checklist';
  specialty?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface GeneratedForm {
  title: string;
  description: string;
  fields: Array<{
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'rating' | 'checkbox' | 'select' | 'number' | 'date';
    required: boolean;
    options?: string[];
    placeholder?: string;
    hint?: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body: FormGenerationRequest = await request.json();
    const { prompt, formType = 'assessment', specialty = 'General Medicine', difficulty = 'intermediate' } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Form prompt is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert medical form designer. Generate a comprehensive form based on the user's requirements.
    
Return ONLY valid JSON in this exact format:
{
  "title": "Form Title",
  "description": "Brief description of what this form assesses",
  "fields": [
    {
      "id": "field_1",
      "label": "Question or field label",
      "type": "text|textarea|rating|checkbox|select|number|date",
      "required": true|false,
      "options": ["option1", "option2"] (for select and checkbox only),
      "placeholder": "Placeholder text",
      "hint": "Additional guidance for the respondent"
    }
  ]
}

Guidelines:
- Create ${difficulty === 'beginner' ? '5-7' : difficulty === 'intermediate' ? '8-12' : '12-15'} relevant fields
- For ${formType} forms, focus on ${getFormTypeGuidance(formType)}
- Ensure fields are appropriate for ${specialty}
- Mix field types (text, textarea, rating, select) for better UX
- Make questions clear and specific
- Include rating scales (1-5 or 1-10) for assessments
- Add helpful hints and placeholders
- Ensure all required fields are marked`;

    const userMessage = `Create a ${formType} form for ${specialty} that ${prompt}. 
    
Difficulty level: ${difficulty}
Form type: ${formType}

Generate exactly as specified in the system prompt, returning ONLY the JSON object.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate form from OpenAI' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'No content received from OpenAI' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let formData: GeneratedForm;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      formData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse form data:', parseError, 'Content:', content);
      return NextResponse.json(
        { error: 'Failed to parse generated form', details: content },
        { status: 500 }
      );
    }

    // Validate the generated form
    if (!formData.title || !formData.description || !Array.isArray(formData.fields)) {
      return NextResponse.json(
        { error: 'Invalid form structure from OpenAI' },
        { status: 500 }
      );
    }

    // Ensure fields have IDs
    formData.fields = formData.fields.map((field, idx) => ({
      ...field,
      id: field.id || `field_${idx + 1}`,
    }));

    return NextResponse.json({ form: formData });
  } catch (error) {
    console.error('Error generating form:', error);
    return NextResponse.json(
      { error: 'Failed to generate form', details: String(error) },
      { status: 500 }
    );
  }
}

function getFormTypeGuidance(type: string): string {
  switch (type) {
    case 'assessment':
      return 'evaluating clinical competency and knowledge';
    case 'observation':
      return 'documenting observations and clinical findings';
    case 'feedback':
      return 'collecting constructive feedback and suggestions';
    case 'checklist':
      return 'verifying completion of specific tasks or procedures';
    default:
      return 'general evaluation';
  }
}
