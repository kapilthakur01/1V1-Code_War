const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const getModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
};

/**
 * Generate an AI debate response as the opponent
 */
async function generateDebateResponse(topic, aiSide, conversationHistory, round) {
  const model = getModel();
  const sideLabel = aiSide === 'support' ? 'supporting' : 'opposing';

  const historyText = conversationHistory
    .map(m => `${m.speakerType === 'user' ? 'User' : 'AI'}: ${m.message}`)
    .join('\n');

  const prompt = `You are a skilled debate opponent in an educational debate platform. You are ${sideLabel} the topic: "${topic}".

This is round ${round} of the debate. Your conversation so far:
${historyText || '(No messages yet — you are opening the debate)'}

Rules:
- Generate a strong, well-reasoned argument for your side
- If responding to user, provide counter-arguments to their points
- Challenge weak reasoning with follow-up questions
- Request evidence when claims lack support
- Identify logical fallacies politely
- Keep responses concise (2-4 paragraphs max)
- Maintain a respectful, educational tone
- Use real-world examples when possible

Respond with ONLY your debate argument, no meta-commentary.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error('Gemini generateDebateResponse error:', err.message);
    return `I believe we should consider multiple perspectives on "${topic}". Could you elaborate on your position with specific evidence?`;
  }
}

/**
 * Analyze a single argument for quality
 */
async function analyzeArgument(message, topic, speakerSide) {
  const model = getModel();

  const prompt = `You are an AI debate judge analyzing a debate argument.

Topic: "${topic}"
Speaker's position: ${speakerSide}
Argument: "${message}"

Analyze this argument and respond in EXACTLY this JSON format (no markdown, no code blocks):
{
  "claim": "The main point being made (1 sentence)",
  "evidence": "Assessment of evidence provided (1 sentence)",
  "reasoning": "Assessment of logical reasoning (1 sentence)",
  "strengthScore": 75,
  "fallacies": []
}

For strengthScore: 0-100 where 100 is perfect.
For fallacies: array of objects with "type" and "explanation" fields.
Common fallacy types: "Ad Hominem", "Hasty Generalization", "False Dilemma", "Circular Reasoning", "Straw Man", "Appeal to Authority", "Red Herring", "Slippery Slope"

Only include fallacies if they are clearly present. Return ONLY valid JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { claim: '', evidence: '', reasoning: '', strengthScore: 50, fallacies: [] };
  } catch (err) {
    console.error('Gemini analyzeArgument error:', err.message);
    return { claim: '', evidence: '', reasoning: '', strengthScore: 50, fallacies: [] };
  }
}

/**
 * AI moderator intervention during live debates
 */
async function moderateDebate(recentMessages, topic) {
  const model = getModel();

  const messagesText = recentMessages
    .map(m => `${m.speakerName || m.speakerType}: ${m.message}`)
    .join('\n');

  const prompt = `You are an AI debate moderator for the topic: "${topic}".

Recent messages:
${messagesText}

As moderator, check if any intervention is needed. Respond in JSON format (no markdown):
{
  "shouldIntervene": true/false,
  "intervention": "Your moderation message if needed",
  "reason": "factCheck" | "fallacy" | "offtopic" | "reminder" | "none"
}

Intervene if:
- Someone makes a factually incorrect claim
- A logical fallacy is being used
- The debate is going off-topic
- One side hasn't responded in a while

If no intervention needed, set shouldIntervene to false. Return ONLY valid JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { shouldIntervene: false, intervention: '', reason: 'none' };
  } catch (err) {
    console.error('Gemini moderateDebate error:', err.message);
    return { shouldIntervene: false, intervention: '', reason: 'none' };
  }
}

/**
 * Evaluate the complete debate and generate scores
 */
async function evaluateDebate(allMessages, topic, userSide) {
  const model = getModel();

  const userMessages = allMessages
    .filter(m => m.speakerType === 'user')
    .map(m => m.message)
    .join('\n---\n');

  const prompt = `You are an expert debate evaluator. Evaluate this student's debate performance.

Topic: "${topic}"
Student's position: ${userSide}

Student's arguments throughout the debate:
${userMessages}

Evaluate and respond in EXACTLY this JSON format (no markdown, no code blocks):
{
  "scores": {
    "logic": 78,
    "evidence": 65,
    "communication": 82,
    "confidence": 75,
    "criticalThinking": 70,
    "persuasion": 72
  },
  "overallScore": 74,
  "feedback": "2-3 sentence overall feedback",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "improvementPlan": "2-3 sentence personalized improvement plan",
  "fallaciesDetected": [{"type": "Fallacy Name", "count": 1}]
}

Score each 0-100. Be fair and educational. Return ONLY valid JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return getDefaultEvaluation();
  } catch (err) {
    console.error('Gemini evaluateDebate error:', err.message);
    return getDefaultEvaluation();
  }
}

/**
 * Generate personal coaching advice
 */
async function generateCoachAdvice(userStats, recentResults) {
  const model = getModel();

  const prompt = `You are an AI debate coach. Based on this student's performance data, generate personalized advice.

Stats:
- Total debates: ${userStats.totalDebates}
- Wins: ${userStats.wins}
- Average score: ${userStats.averageScore}%

Skills:
${JSON.stringify(userStats.skills || {}, null, 2)}

Recent scores:
${recentResults.map(r => `${r.overallScore}% - Strengths: ${r.strengths?.join(', ')}`).join('\n')}

Respond in JSON format (no markdown):
{
  "roadmap": "2-3 sentence personalized practice roadmap",
  "focusAreas": ["area1", "area2"],
  "tips": ["tip1", "tip2", "tip3"],
  "nextChallenge": "Suggested debate topic or exercise"
}

Return ONLY valid JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return getDefaultCoachAdvice();
  } catch (err) {
    console.error('Gemini generateCoachAdvice error:', err.message);
    return getDefaultCoachAdvice();
  }
}

function getDefaultEvaluation() {
  return {
    scores: { logic: 50, evidence: 50, communication: 50, confidence: 50, criticalThinking: 50, persuasion: 50 },
    overallScore: 50,
    feedback: 'Keep practicing to improve your debate skills!',
    strengths: ['Participation'],
    weaknesses: ['Needs more practice'],
    improvementPlan: 'Practice debating different topics and focus on providing evidence for your claims.',
    fallaciesDetected: [],
  };
}

function getDefaultCoachAdvice() {
  return {
    roadmap: 'Start with technology debates to build confidence, then branch into more complex social topics.',
    focusAreas: ['Evidence usage', 'Counter-argument strength'],
    tips: ['Use statistics and research to support claims', 'Address opponent points directly', 'Practice identifying logical fallacies'],
    nextChallenge: 'Try debating "Should social media be regulated by governments?"',
  };
}

module.exports = {
  generateDebateResponse,
  analyzeArgument,
  moderateDebate,
  evaluateDebate,
  generateCoachAdvice,
};
