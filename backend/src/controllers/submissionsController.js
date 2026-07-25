const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const Room = require('../models/Room');
const { executeCode, judgeCode } = require('../judge/executor');

// POST /api/submissions/run  — run with custom input
const runCode = async (req, res) => {
  try {
    const { code, language, input, problemId } = req.body;

    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required' });
    }

    if (!['cpp17', 'java17'].includes(language)) {
      return res.status(400).json({ message: 'Unsupported language' });
    }

    const result = await executeCode(code, language, input || '');

    // Save as a "run" submission for logging
    try {
      await Submission.create({
        userId: req.user._id,
        problemId: problemId || null,
        code,
        language,
        verdict: result.verdict || 'Pending',
        executionTime: result.executionTime,
        isRun: true,
        customInput: input || '',
        customOutput: result.stdout || '',
      });
    } catch (_) {}

    res.json({
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      exitCode: result.exitCode,
      executionTime: result.executionTime,
      verdict: result.verdict,
      compileError: result.compileError || '',
    });
  } catch (err) {
    console.error('runCode error:', err);
    res.status(500).json({ message: 'Execution failed', error: err.message });
  }
};

// POST /api/submissions/submit  — judge against hidden test cases
const submitCode = async (req, res) => {
  try {
    const { code, language, problemId, roomId } = req.body;

    if (!code || !language || !problemId) {
      return res.status(400).json({ message: 'Code, language, and problemId are required' });
    }

    if (!['cpp17', 'java17'].includes(language)) {
      return res.status(400).json({ message: 'Unsupported language' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const allTestCases = [
      ...problem.sampleTestCases.map((tc) => ({ ...tc.toObject(), isSample: true })),
      ...problem.hiddenTestCases.map((tc) => ({ ...tc.toObject(), isSample: false })),
    ];

    if (allTestCases.length === 0) {
      return res.status(400).json({ message: 'No test cases available for this problem' });
    }

    const judgeResult = await judgeCode(code, language, allTestCases);

    const submission = await Submission.create({
      userId: req.user._id,
      roomId: roomId || null,
      problemId,
      code,
      language,
      verdict: judgeResult.verdict,
      testsPassed: judgeResult.testsPassed,
      totalTests: judgeResult.totalTests,
      executionTime: judgeResult.executionTime,
      testResults: judgeResult.results,
      isRun: false,
    });

    res.json({
      submissionId: submission._id,
      verdict: judgeResult.verdict,
      testsPassed: judgeResult.testsPassed,
      totalTests: judgeResult.totalTests,
      executionTime: judgeResult.executionTime,
      testResults: judgeResult.results,
    });
  } catch (err) {
    console.error('submitCode error:', err);
    res.status(500).json({ message: 'Submission failed', error: err.message });
  }
};

module.exports = { runCode, submitCode };
