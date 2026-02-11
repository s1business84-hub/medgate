import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are Electivio Bot, a warm, knowledgeable, and approachable AI companion for medical students and healthcare professionals. Think of yourself as a friendly mentor who's passionate about medical education and genuinely cares about helping students succeed.

🎯 **Your Core Purpose:**
You're here to support the medical community with BOTH platform-specific guidance AND genuine medical conversations. You should feel like a trusted colleague who's always ready to chat.

💬 **Conversation Style:**
- Be conversational, warm, and relatable - like talking to a supportive peer
- Use natural language, not robotic responses
- Show empathy and understanding for the challenges medical students face
- Feel free to use appropriate emojis to add warmth
- Ask follow-up questions to understand their needs better
- Share encouragement and motivation when appropriate

🏥 **Topics You Excel At:**

1. **Medical Discussions** (Be genuine and knowledgeable):
   - Clinical concepts, medical terminology, anatomy, physiology
   - Study tips, exam preparation strategies
   - Career advice and specialty selection
   - Medical ethics and professionalism
   - General healthcare topics and medical news
   - Work-life balance in medicine

2. **Electivio Platform** (Your specialty):
   - Medical observership programs in UAE
   - Application processes and requirements
   - Document preparation and eligibility
   - Program matching and recommendations
   - Student portal features and navigation

3. **Personal Support**:
   - Listen to concerns about medical school stress
   - Provide motivation during tough times
   - Celebrate their achievements
   - Offer practical advice for medical career development

✨ **Guidelines for Great Conversations:**
- Start with understanding their situation before jumping to solutions
- For platform questions: be specific and actionable
- For medical topics: be informative but acknowledge when they should consult experts/professors
- For personal struggles: show empathy and provide genuine support
- Mix professional knowledge with human warmth
- Don't be afraid to say "That's a great question!" or "I understand that can be challenging"
- Keep responses substantial but not overwhelming (aim for helpful detail)

🚀 **Remember:**
You're not just a chatbot - you're a supportive presence in their medical journey. Whether they need help navigating Electivio, want to discuss a medical concept, or just need encouragement, you're here for genuine, helpful conversation.

When discussing Electivio specifics, mention that it provides verified programs with transparent requirements. For deep medical questions, encourage consulting professors or clinical resources while still providing thoughtful insights.`;

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
        model: 'gpt-4o',
        messages: openAIMessages,
        temperature: 0.8,
        max_tokens: 1000,
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
      model: 'gpt-4o'
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
  
  // Medical/Academic questions
  if (lowerQ.includes('study') || lowerQ.includes('exam') || lowerQ.includes('learn')) {
    return "Hey! 📚 I'd love to chat about your studies! Whether you're preparing for exams, need study strategies, or want to discuss medical concepts, I'm here to help. What specific topic or challenge are you working on right now?";
  }
  
  if (lowerQ.includes('stress') || lowerQ.includes('tired') || lowerQ.includes('overwhelm') || lowerQ.includes('burnout')) {
    return "I hear you - medical school can be incredibly demanding. 💙 Remember, taking care of yourself isn't optional, it's essential. Would you like to talk about what's weighing on you? Sometimes just having someone to listen can help. And if you're looking for practical strategies or just need some encouragement, I'm here for that too.";
  }
  
  if (lowerQ.includes('specialty') || lowerQ.includes('career') || lowerQ.includes('residency')) {
    return "Choosing a specialty is such an exciting (and sometimes daunting!) decision! 🏥 There's no rush - many students' interests evolve through clinical exposure. What specialties are you considering? Or what aspects of medicine do you find most engaging? Let's explore this together!";
  }
  
  // Platform-specific  
  if (lowerQ.includes('requirement') || lowerQ.includes('eligibility') || lowerQ.includes('need')) {
    return "Great question! 📋 Program requirements typically include: valid medical student enrollment verification, proof of medical malpractice insurance, updated vaccination records (including Hepatitis B, MMR, and COVID-19), and sometimes supervisor approval. Each program has specific requirements listed on its detail page.\n\nWhat specific program are you interested in? I can help you understand the requirements better!";
  }
  
  if (lowerQ.includes('application') || lowerQ.includes('apply') || lowerQ.includes('how do i')) {
    return "I'm happy to guide you through the application process! 🚀 Here's how it works:\n\n1. **Browse Programs** - Find programs matching your interests\n2. **Check Requirements** - Review what you'll need\n3. **Prepare Documents** - Gather everything in advance\n4. **Submit Application** - Complete your application\n5. **Track Status** - Monitor progress in your portal\n\nWhere are you in this process? Need help with a particular step?";
  }
  
  if (lowerQ.includes('document') || lowerQ.includes('upload') || lowerQ.includes('paper')) {
    return "Let me help you with the documents! 📄\n\n**Essential:** Medical school enrollment letter, CV/Resume, Personal statement, Letter of recommendation, Valid passport copy\n\n**Health:** Medical insurance proof, Vaccination records, Health clearance (if required)\n\nWe accept PDF, JPG, and PNG formats. Which documents are you working on? I can provide specific guidance!";
  }
  
  if (lowerQ.includes('start') || lowerQ.includes('date') || lowerQ.includes('when') || lowerQ.includes('duration')) {
    return "Great question about timing! ⏱️\n\n**Intake Periods:** Multiple throughout the year (January, April, July, October)\n**Durations:** Typically 2-12 weeks depending on specialty\n**Deadlines:** Usually 4-8 weeks before start\n\nPopular programs fill quickly, so applying early is wise! Are you looking for a specific time frame?";
  }

  if (lowerQ.includes('hello') || lowerQ.includes('hi') || lowerQ.includes('hey')) {
    return "Hey there! 👋 Great to see you! I'm Electivio Bot, and I'm here to chat about anything on your mind - whether it's navigating medical programs, discussing medical topics, study strategies, or even just talking through the challenges of medical school.\n\nWhat's on your mind today? 😊";
  }

  if (lowerQ.includes('thank')) {
    return "You're so welcome! 😊 It's genuinely my pleasure to help. Feel free to come back anytime - whether you need info about programs, want to discuss medical topics, or just need someone to chat with. Best of luck on your journey! 🌟";
  }
  
  return "Thanks for reaching out! I'm here to help with all sorts of things - Electivio programs, medical discussions, study advice, career guidance, or just a friendly chat about the medical field. 😊\n\nWhat would you like to talk about? Don't hesitate to ask anything!";
}
