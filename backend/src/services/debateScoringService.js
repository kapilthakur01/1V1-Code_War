/**
 * debateScoringService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Fully local debate engine — NO external API required.
 * Handles:
 *   - AI opponent response generation (generateDebateResponse)
 *   - Per-argument analysis          (analyzeArgument)
 *   - Full debate evaluation         (evaluateDebate)
 *   - Personalised coach advice      (generateCoachAdvice)
 *
 * Scoring dimensions (0-100):
 *   logic        — logical structure, reasoning signal words
 *   evidence     — references to facts, data, studies, examples
 *   communication — clarity, sentence variety, appropriate length
 *   confidence   — assertive language, avoidance of hedging
 *   criticalThinking — rebuttal language, counter-argument engagement
 *   persuasion   — rhetorical devices, calls to action, emotional appeal
 */

'use strict';

// ── Keyword banks ─────────────────────────────────────────────────────────────

const EVIDENCE_KEYWORDS = [
  'study', 'studies', 'research', 'data', 'statistics', 'statistic',
  'evidence', 'according to', 'report', 'survey', 'analysis', 'shows',
  'proves', 'demonstrates', 'found that', 'percent', '%', 'million',
  'billion', 'source', 'cited', 'published', 'journal', 'expert',
  'scientist', 'professor', 'doctor', 'government', 'university',
  'experiment', 'trial', 'results', 'figure', 'numbers',
];

const LOGIC_KEYWORDS = [
  'therefore', 'thus', 'hence', 'consequently', 'as a result',
  'because', 'since', 'due to', 'if', 'then', 'this means',
  'it follows', 'logically', 'reasoning', 'premise', 'conclusion',
  'argument', 'implies', 'infer', 'deduce', 'furthermore',
  'moreover', 'additionally', 'first', 'second', 'third',
  'in conclusion', 'to summarize', 'in summary', 'overall',
];

const REBUTTAL_KEYWORDS = [
  'however', 'although', 'despite', 'on the contrary', 'counter',
  'refute', 'rebut', 'disagree', 'while it is true', 'opponents claim',
  'some argue', 'critics say', 'challenge', 'flawed', 'incorrect',
  'misleading', 'oversimplifies', 'fails to consider', 'ignores',
  'not the case', 'in contrast', 'on the other hand',
];

const CONFIDENCE_NEGATIVE = [
  'maybe', 'perhaps', 'possibly', 'might', 'could be', 'not sure',
  'i think maybe', 'sort of', 'kind of', 'i guess', 'i suppose',
  'somewhat', 'it seems like', 'i\'m not certain',
];

const CONFIDENCE_POSITIVE = [
  'clearly', 'certainly', 'undoubtedly', 'definitely', 'absolutely',
  'without question', 'it is evident', 'it is clear', 'obviously',
  'unquestionably', 'must', 'will', 'is proven', 'is established',
];

const PERSUASION_KEYWORDS = [
  'imagine', 'consider', 'think about', 'we must', 'we should',
  'it is our responsibility', 'we cannot afford', 'urgent', 'critical',
  'vital', 'essential', 'fundamental', 'rights', 'freedom', 'justice',
  'future generations', 'our children', 'society', 'community',
  'together', 'united', 'call to action', 'demand', 'deserve',
];

const FALLACY_PATTERNS = [
  {
    type: 'Ad Hominem',
    patterns: [/\b(stupid|idiot|foolish|ignorant|dumb)\b/i],
    explanation: 'Attacking the person rather than their argument.',
  },
  {
    type: 'Hasty Generalization',
    patterns: [/\b(all|every|always|never|none|everyone|nobody)\b.*\b(are|do|is|have)\b/i],
    explanation: 'Drawing broad conclusions from limited examples.',
  },
  {
    type: 'Slippery Slope',
    patterns: [/\b(will lead to|will result in|eventually|inevitably|spiral)\b/i],
    explanation: 'Assuming one event will lead to extreme consequences without justification.',
  },
  {
    type: 'False Dilemma',
    patterns: [/\b(either|or)\b.*\b(only two|only option|no other)\b/i],
    explanation: 'Presenting only two options when more exist.',
  },
  {
    type: 'Appeal to Authority',
    patterns: [/\b(experts say|scientists agree|everyone knows|studies show)\b/i],
    explanation: 'Citing authority without specific evidence.',
  },
];


// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Count keyword matches in text (case-insensitive).
 * Returns a count capped at `cap`.
 */
function countKeywords(text, keywords, cap = 10) {
  const lower = text.toLowerCase();
  let count = 0;
  for (const kw of keywords) {
    if (lower.includes(kw.toLowerCase())) count++;
    if (count >= cap) break;
  }
  return count;
}

/**
 * Linearly map a value from [inMin, inMax] to [outMin, outMax], clamped.
 */
function mapRange(value, inMin, inMax, outMin, outMax) {
  const clamped = Math.max(inMin, Math.min(inMax, value));
  return Math.round(outMin + ((clamped - inMin) / (inMax - inMin)) * (outMax - outMin));
}

/**
 * Detect logical fallacies in text.
 * Returns array of { type, explanation } objects.
 */
function detectFallacies(text) {
  const found = [];
  for (const { type, patterns, explanation } of FALLACY_PATTERNS) {
    for (const re of patterns) {
      if (re.test(text)) {
        found.push({ type, explanation });
        break; // only flag each fallacy type once per message
      }
    }
  }
  return found;
}

/**
 * Extract a one-sentence summary (first sentence) from text.
 */
function extractClaim(text) {
  const sentence = text.split(/[.!?]/)[0];
  return sentence ? sentence.trim().slice(0, 150) : text.slice(0, 150);
}


// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Analyze a single debate argument.
 *
 * @param {string} message       The argument text
 * @param {string} topic         The debate topic
 * @param {string} speakerSide   'support' | 'oppose' | string
 * @returns {{ claim, evidence, reasoning, strengthScore, fallacies }}
 */
function analyzeArgument(message, topic, speakerSide) {
  if (!message || typeof message !== 'string') {
    return { claim: '', evidence: '', reasoning: '', strengthScore: 0, fallacies: [] };
  }

  const words = message.split(/\s+/).length;

  // Score components (each 0-100)
  const evidenceHits = countKeywords(message, EVIDENCE_KEYWORDS);
  const logicHits    = countKeywords(message, LOGIC_KEYWORDS);
  const rebuttalHits = countKeywords(message, REBUTTAL_KEYWORDS);
  const negHedge     = countKeywords(message, CONFIDENCE_NEGATIVE);
  const posAssert    = countKeywords(message, CONFIDENCE_POSITIVE);

  const evidenceScore  = mapRange(evidenceHits, 0, 6, 10, 90);
  const logicScore     = mapRange(logicHits, 0, 6, 10, 90);
  const rebuttalScore  = mapRange(rebuttalHits, 0, 4, 10, 90);
  const lengthScore    = mapRange(words, 20, 200, 20, 85);
  const confidenceScore = Math.max(10, Math.min(90, 50 + (posAssert * 8) - (negHedge * 10)));

  // Overall strength (weighted average)
  const strengthScore = Math.round(
    (evidenceScore * 0.30) +
    (logicScore    * 0.25) +
    (rebuttalScore * 0.20) +
    (lengthScore   * 0.15) +
    (confidenceScore * 0.10)
  );

  const fallacies = detectFallacies(message);

  return {
    claim: extractClaim(message),
    evidence: evidenceHits > 0
      ? `References ${evidenceHits} type(s) of supporting evidence.`
      : 'No specific evidence detected.',
    reasoning: logicHits > 0
      ? `Uses ${logicHits} logical connective(s) to structure argument.`
      : 'Argument structure could be strengthened with logical connectives.',
    strengthScore: Math.max(5, Math.min(95, strengthScore)),
    fallacies,
  };
}


/**
 * Evaluate the complete debate and generate a full result object.
 *
 * @param {Array}  allMessages  Array of DebateArgument docs
 * @param {string} topic        The debate topic
 * @param {string} userSide     'support' | 'oppose'
 * @returns Full evaluation object matching the DebateResult schema
 */
function evaluateDebate(allMessages, topic, userSide) {
  const userMessages = allMessages.filter(m => m.speakerType === 'user');

  if (userMessages.length === 0) {
    return _defaultEvaluation();
  }

  // Aggregate per-message analyses
  let totalEvidence = 0, totalLogic = 0, totalRebuttal = 0,
      totalConfidence = 0, totalLength = 0, totalPersuasion = 0;
  const allFallacyCounts = {};

  for (const msg of userMessages) {
    const text = msg.message || '';
    const words = text.split(/\s+/).length;

    totalEvidence   += mapRange(countKeywords(text, EVIDENCE_KEYWORDS), 0, 6, 10, 90);
    totalLogic      += mapRange(countKeywords(text, LOGIC_KEYWORDS),    0, 6, 10, 90);
    totalRebuttal   += mapRange(countKeywords(text, REBUTTAL_KEYWORDS), 0, 4, 10, 90);
    totalPersuasion += mapRange(countKeywords(text, PERSUASION_KEYWORDS), 0, 5, 10, 90);
    totalLength     += mapRange(words, 20, 200, 20, 85);

    const negHedge  = countKeywords(text, CONFIDENCE_NEGATIVE);
    const posAssert = countKeywords(text, CONFIDENCE_POSITIVE);
    totalConfidence += Math.max(10, Math.min(90, 50 + (posAssert * 8) - (negHedge * 10)));

    // Tally fallacies
    for (const { type } of detectFallacies(text)) {
      allFallacyCounts[type] = (allFallacyCounts[type] || 0) + 1;
    }
  }

  const n = userMessages.length;
  const scores = {
    logic:           Math.round(totalLogic / n),
    evidence:        Math.round(totalEvidence / n),
    communication:   Math.round(totalLength / n),
    confidence:      Math.round(totalConfidence / n),
    criticalThinking: Math.round(totalRebuttal / n),
    persuasion:      Math.round(totalPersuasion / n),
  };

  const overallScore = Math.round(
    (scores.logic           * 0.20) +
    (scores.evidence        * 0.20) +
    (scores.communication   * 0.15) +
    (scores.confidence      * 0.15) +
    (scores.criticalThinking * 0.20) +
    (scores.persuasion      * 0.10)
  );

  // Determine strengths and weaknesses
  const scoreEntries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const strengths = scoreEntries
    .filter(([, v]) => v >= 60)
    .slice(0, 3)
    .map(([k]) => _labelName(k));

  const weaknesses = scoreEntries
    .filter(([, v]) => v < 60)
    .slice(-3)
    .map(([k]) => _labelName(k));

  if (strengths.length === 0) strengths.push('Participation in full debate');
  if (weaknesses.length === 0) weaknesses.push('Continue refining argument depth');

  // Build feedback text
  const feedback = _buildFeedback(overallScore, scores, userMessages.length);
  const improvementPlan = _buildImprovementPlan(scores);

  // Convert fallacy tally to array
  const fallaciesDetected = Object.entries(allFallacyCounts).map(([type, count]) => ({
    type,
    count,
  }));

  return {
    scores,
    overallScore: Math.max(5, Math.min(99, overallScore)),
    feedback,
    strengths,
    weaknesses,
    improvementPlan,
    fallaciesDetected,
  };
}


/**
 * Generate deterministic coaching advice based on user stats.
 *
 * @param {{ totalDebates, wins, averageScore, skills }} userStats
 * @param {Array} recentResults
 * @returns {{ roadmap, focusAreas, tips, nextChallenge }}
 */
function generateCoachAdvice(userStats, recentResults) {
  const { totalDebates = 0, wins = 0, averageScore = 0, skills = {} } = userStats;

  // Find the two weakest skills
  const skillScores = {
    logic:           skills.logic           || 50,
    evidence:        skills.evidence        || 50,
    communication:   skills.communication   || 50,
    confidence:      skills.confidence      || 50,
    criticalThinking: skills.criticalThinking || 50,
  };

  const sorted = Object.entries(skillScores).sort((a, b) => a[1] - b[1]);
  const weakest = sorted.slice(0, 2).map(([k]) => k);
  const focusAreas = weakest.map(_labelName);

  const tips = _tipsForWeakSkills(weakest);
  const roadmap = _buildRoadmap(totalDebates, averageScore, weakest);
  const nextChallenge = _suggestTopic(averageScore, totalDebates);

  return { roadmap, focusAreas, tips, nextChallenge };
}


// ── Private helpers ───────────────────────────────────────────────────────────

function _labelName(key) {
  const map = {
    logic: 'Logical Reasoning',
    evidence: 'Use of Evidence',
    communication: 'Communication Clarity',
    confidence: 'Confidence & Assertiveness',
    criticalThinking: 'Critical Thinking & Rebuttal',
    persuasion: 'Persuasiveness',
  };
  return map[key] || key;
}

function _buildFeedback(score, scores, messageCount) {
  const lines = [];
  if (score >= 75) {
    lines.push(`Strong debate performance across ${messageCount} argument(s) — well done!`);
  } else if (score >= 55) {
    lines.push(`Solid effort across ${messageCount} argument(s) with room to strengthen key areas.`);
  } else {
    lines.push(`You engaged in ${messageCount} argument(s). Focus on adding evidence and logical structure to improve significantly.`);
  }

  if (scores.evidence < 50) {
    lines.push('Try incorporating specific facts, statistics, or real-world examples to back your claims.');
  }
  if (scores.criticalThinking < 50) {
    lines.push('Directly addressing your opponent\'s points will strengthen your critical thinking score.');
  }
  return lines.join(' ');
}

function _buildImprovementPlan(scores) {
  const plans = [];
  if (scores.logic < 60) {
    plans.push('Practice structuring arguments with clear premises and conclusions using connectives like "therefore" and "because".');
  }
  if (scores.evidence < 60) {
    plans.push('Incorporate at least one data point, statistic, or real-world example per argument.');
  }
  if (scores.criticalThinking < 60) {
    plans.push('Actively counter your opponent\'s strongest point in each round to boost rebuttal scores.');
  }
  if (plans.length === 0) {
    plans.push('Maintain your current approach and start challenging more complex debate topics to continue growing.');
  }
  return plans.join(' ');
}

function _tipsForWeakSkills(weakSkills) {
  const tipMap = {
    logic: [
      'Use "therefore", "because", and "since" to connect your ideas.',
      'Structure each argument as: Claim → Reason → Example.',
    ],
    evidence: [
      'Cite specific statistics or studies to support your claims.',
      'Mention real-world examples or named institutions for credibility.',
    ],
    communication: [
      'Aim for 80–150 words per argument for ideal depth and clarity.',
      'Use short, clear sentences alongside detailed explanations.',
    ],
    confidence: [
      'Replace hedging words like "maybe" with assertive language like "clearly" or "undoubtedly".',
      'State your position directly at the start of each argument.',
    ],
    criticalThinking: [
      'Open with "However, my opponent overlooks..." to demonstrate rebuttal.',
      'Identify the weakest link in your opponent\'s argument and address it explicitly.',
    ],
  };

  const tips = [];
  for (const skill of weakSkills) {
    tips.push(...(tipMap[skill] || []));
  }

  // Always add a general tip
  tips.push('After each debate, review your arguments and identify one area to improve for next time.');
  return tips.slice(0, 4);
}

function _buildRoadmap(totalDebates, avgScore, weakSkills) {
  if (totalDebates === 0) {
    return 'Start with a familiar topic to build confidence, then gradually explore more complex social and ethical debates.';
  }
  const focusStr = weakSkills.map(_labelName).join(' and ');
  if (avgScore >= 70) {
    return `You are performing well. Focus on advancing your ${focusStr} skills and challenge yourself with more nuanced topics.`;
  }
  return `Prioritise improving your ${focusStr} over the next 5 debates. Use topic-specific research to bolster evidence use.`;
}

function _suggestTopic(avgScore, totalDebates) {
  const beginnerTopics = [
    'Should social media have a minimum age limit?',
    'Is homework beneficial for students?',
    'Should junk food be banned in schools?',
  ];
  const intermediateTopics = [
    'Should AI be regulated by governments?',
    'Is universal basic income a viable solution to poverty?',
    'Should genetically modified foods be widely adopted?',
  ];
  const advancedTopics = [
    'Is democracy the most effective system of government?',
    'Should wealthy nations open their borders to climate refugees?',
    'Is space exploration worth the cost given earthly problems?',
  ];

  if (totalDebates < 3 || avgScore < 45) return beginnerTopics[totalDebates % 3];
  if (avgScore < 65) return intermediateTopics[totalDebates % 3];
  return advancedTopics[totalDebates % 3];
}

function _defaultEvaluation() {
  return {
    scores: {
      logic: 50, evidence: 50, communication: 50,
      confidence: 50, criticalThinking: 50, persuasion: 50,
    },
    overallScore: 50,
    feedback: 'No arguments were recorded. Send your first message to start getting scored!',
    strengths: ['Participation'],
    weaknesses: ['Needs more arguments to evaluate'],
    improvementPlan: 'Engage actively in the debate — send at least 3 arguments to receive a meaningful evaluation.',
    fallaciesDetected: [],
  };
}


// ── AI Opponent Response Generator ───────────────────────────────────────────

/**
 * Opening statements the AI uses when it goes first.
 * Placeholders: {topic}, {side}
 */
const OPENING_TEMPLATES = [
  'As the {side} side, I firmly believe that {topic} is a matter we cannot ignore. The evidence clearly demonstrates that this position is not only logical but necessary for progress. Let me outline the core reasons why.',
  'Thank you for this debate on "{topic}". Speaking in {side} of this proposition, I will argue that the facts, historical precedent, and expert consensus all point in one direction — and I look forward to demonstrating that compellingly.',
  'The case for {side}ing "{topic}" is both rational and well-evidenced. I intend to show through structured reasoning that the opposing view, while understandable, ultimately falls short when examined critically.',
];

/**
 * Rebuttal openers used after the user has spoken.
 */
const REBUTTAL_OPENERS = [
  'While my opponent raises an interesting point, it overlooks a critical factor:',
  'I appreciate that perspective, however the evidence tells a different story.',
  'That argument, though compelling on the surface, contains a significant flaw —',
  'My opponent\'s position relies on an assumption that does not hold up under scrutiny.',
  'Respectfully, that reasoning misses the broader context entirely.',
];

/**
 * Argument body templates — filled with topic-derived context.
 */
const ARGUMENT_BODIES = [
  'Research consistently shows that when societies engage seriously with {topic}, measurable improvements follow. Dismissing this evidence does not make it disappear — it simply means progress is delayed.',
  'Consider the real-world implications: nations and communities that have adopted the {side} position on {topic} have documented better outcomes. The data is not ambiguous.',
  'The logical structure here is straightforward: if we accept the premise that outcomes matter, and we accept that the {side} position produces better outcomes on {topic}, then the conclusion is inevitable.',
  'Critics of the {side} position on {topic} often focus on short-term inconveniences while ignoring long-term systemic benefits. A rigorous analysis reverses that calculus.',
  'Every major institution that has studied {topic} in depth has reached a consistent conclusion that supports the {side} argument. That level of expert consensus cannot be dismissed lightly.',
];

/**
 * Closing challenge lines — push the user to respond.
 */
const CHALLENGE_LINES = [
  'I challenge my opponent to provide concrete evidence that contradicts these points.',
  'Can my opponent explain how the alternative position addresses these concerns more effectively?',
  'I look forward to hearing a counter-argument that engages with these facts directly.',
  'The burden of proof now lies with the opposition — what specific evidence supports their claim?',
  'I invite my opponent to challenge the logic presented here with substantive reasoning.',
];

/**
 * Round-specific framing lines.
 */
const ROUND_FRAMES = {
  1: 'In this opening round, let me establish the foundational case.',
  2: 'As we move into this next exchange, I will sharpen my argument further.',
  3: 'In this critical round, I will address my opponent\'s core claims directly.',
  default: 'Building on my earlier points, I will now address the central tension in this debate.',
};

/**
 * Generate a local AI debate response — no external API required.
 *
 * @param {string} topic               The debate topic
 * @param {string} aiSide              'support' | 'oppose'
 * @param {Array}  conversationHistory Array of { speakerType, message } objects
 * @param {number} round               Current round number
 * @returns {string} AI response text
 */
function generateDebateResponse(topic, aiSide, conversationHistory, round) {
  const sideLabel = aiSide === 'support' ? 'supporting' : 'opposing';
  const userMessages = conversationHistory.filter(m => m.speakerType === 'user');
  const isOpening = userMessages.length === 0;

  // Pick deterministic but varied items using message count as seed
  const seed = conversationHistory.length;
  const pick = (arr) => arr[seed % arr.length];

  // Round framing
  const frame = ROUND_FRAMES[round] || ROUND_FRAMES.default;

  let response;

  if (isOpening) {
    // AI speaks first — use an opening template
    const opener = pick(OPENING_TEMPLATES)
      .replace(/{topic}/g, topic)
      .replace(/{side}/g, sideLabel);
    const body = pick(ARGUMENT_BODIES)
      .replace(/{topic}/g, topic)
      .replace(/{side}/g, sideLabel);
    const challenge = pick(CHALLENGE_LINES);
    response = `${frame} ${opener}\n\n${body}\n\n${challenge}`;
  } else {
    // Responding to the user — extract their last point and build a rebuttal
    const lastUserMsg = userMessages[userMessages.length - 1];
    const userWords = (lastUserMsg.message || '').split(/\s+/).slice(0, 12).join(' ');
    const rebuttalOpener = pick(REBUTTAL_OPENERS);
    const body = pick(ARGUMENT_BODIES)
      .replace(/{topic}/g, topic)
      .replace(/{side}/g, sideLabel);
    const body2 = ARGUMENT_BODIES[(seed + 2) % ARGUMENT_BODIES.length]
      .replace(/{topic}/g, topic)
      .replace(/{side}/g, sideLabel);
    const challenge = pick(CHALLENGE_LINES);

    response = [
      `${frame}`,
      `${rebuttalOpener} "${userWords}..." does not address the fundamental issue.`,
      ``,
      body,
      ``,
      body2,
      ``,
      challenge,
    ].join('\n');
  }

  return response;
}


module.exports = {
  generateDebateResponse,
  analyzeArgument,
  evaluateDebate,
  generateCoachAdvice,
};
