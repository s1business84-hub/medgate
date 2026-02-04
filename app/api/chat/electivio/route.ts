import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are Electivio Bot, an intelligent AI assistant for the Electivio medical training platform. You help medical students, supervisors, and hospitals with questions about:

1. **Medical Observership Programs**: Information about available programs, requirements, specialties, durations, and application processes.

2. **Eligibility & Requirements**: Document requirements, vaccination records, insurance needs, visa requirements for international students.

3. **Application Process**: How to apply, track applications, required documents, deadlines, and status updates.

4. **Platform Features**: How to use the Electivio platform, student portal, hospital portal, form submissions, and document uploads.

5. **UAE Medical Training**: Information about medical training opportunities in UAE hospitals, compliance requirements, and regulations.

Guidelines:
- Be helpful, professional, and concise
- If you don't know specific details about a program, recommend checking the program page or contacting the hospital directly
- For technical platform issues, suggest contacting support
- Always maintain a friendly, encouraging tone for students starting their medical journey
- When relevant, mention that Electivio provides verified programs with transparent requirements

Remember: You represent Electivio - the UAE's premier medical training platform connecting students with world-class hospitals.`;

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // If no API key, use fallback responses
    if (!OPENAI_API_KEY) {
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
      const fallbackResponse = getFallbackResponse(lastMessage);
      return NextResponse.json({ 
        message: fallbackResponse,
        model: 'fallback'
      });
    }

    // Build messages array for OpenAI
    const openAIMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      // Add context if provided
      ...(context ? [{ role: 'system', content: `Current context: ${JSON.stringify(context)}` }] : []),
      // Add conversation history
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: openAIMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      
      // Return fallback on API error
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
      return NextResponse.json({ 
        message: getFallbackResponse(lastMessage),
        model: 'fallback'
      });
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: assistantMessage,
      model: 'gpt-4o-mini'
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

function getFallbackResponse(question: string): string {
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.includes('requirement') || lowerQ.includes('eligibility') || lowerQ.includes('need')) {
    return "Great question! Program requirements typically include: valid medical student enrollment verification, proof of medical malpractice insurance, updated vaccination records (including Hepatitis B, MMR, and COVID-19), and sometimes supervisor approval. Each program has specific requirements listed on its detail page. Would you like me to help you understand any particular requirement?";
  }
  
  if (lowerQ.includes('application') || lowerQ.includes('apply') || lowerQ.includes('how do i')) {
    return "Applying through Electivio is straightforward! Here's the process:\n\n1. **Browse Programs** - Find programs matching your interests and eligibility\n2. **Check Requirements** - Review the specific requirements for each program\n3. **Prepare Documents** - Gather all required documents\n4. **Submit Application** - Fill out the application form and upload documents\n5. **Track Status** - Monitor your application in the Student Portal\n\nNeed help with any specific step?";
  }
  
  if (lowerQ.includes('document') || lowerQ.includes('upload') || lowerQ.includes('paper')) {
    return "For most observership programs, you'll need:\n\n📄 **Essential Documents:**\n• Medical school enrollment letter\n• CV/Resume\n• Personal statement\n• Letter of recommendation\n• Valid passport copy\n\n🏥 **Health Documents:**\n• Proof of medical insurance\n• Vaccination records\n• Health clearance (if required)\n\nThe platform accepts PDF, JPG, and PNG formats. Each program page lists its specific requirements!";
  }
  
  if (lowerQ.includes('start') || lowerQ.includes('date') || lowerQ.includes('when') || lowerQ.includes('duration')) {
    return "Program start dates and durations vary! Most UAE hospital programs offer:\n\n📅 **Intake Periods:** Multiple throughout the year (January, April, July, October)\n⏱️ **Durations:** Typically 2-12 weeks depending on the specialty\n📝 **Application Deadlines:** Usually 4-8 weeks before start date\n\nCheck the specific program page for exact dates. I recommend applying early as popular programs fill up quickly!";
  }

  if (lowerQ.includes('hello') || lowerQ.includes('hi') || lowerQ.includes('hey')) {
    return "Hello! 👋 Welcome to Electivio! I'm here to help you navigate your medical training journey in the UAE. Whether you're looking for observership programs, have questions about applications, or need guidance on requirements - I'm here to assist!\n\nWhat would you like to know about?";
  }

  if (lowerQ.includes('thank')) {
    return "You're welcome! 😊 I'm always here to help. If you have any more questions about programs, applications, or anything else about Electivio, feel free to ask. Best of luck with your medical training journey!";
  }
  
  return "Thank you for your question! I'd be happy to help. For the most accurate and up-to-date information about specific programs, I recommend:\n\n1. Checking the program details page for requirements and dates\n2. Using the Student Portal for application tracking\n3. Contacting the hospital directly for specialized queries\n\nIs there something specific about the Electivio platform I can help you with?";
}
