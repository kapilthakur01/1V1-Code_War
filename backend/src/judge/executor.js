const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { promisify } = require('util');

const execAsync = promisify(exec);

const TEMP_DIR = path.resolve(process.env.TEMP_DIR || './temp');
const TIME_LIMIT_MS = parseInt(process.env.JUDGE_TIMEOUT_MS || '2000');
const MEMORY_MB = parseInt(process.env.JUDGE_MEMORY_MB || '256');

// Ensure temp dir exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

/**
 * Execute code in a Docker sandbox
 * @param {string} code - Source code
 * @param {string} language - 'cpp17' | 'java17'
 * @param {string} input - stdin input
 * @returns {Promise<{stdout, stderr, exitCode, executionTime, verdict}>}
 */
async function executeCode(code, language, input) {
  const submissionId = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const workDir = path.join(TEMP_DIR, submissionId);

  try {
    fs.mkdirSync(workDir, { recursive: true });

    if (language === 'cpp17') {
      return await executeCpp(code, input, workDir, submissionId);
    } else if (language === 'java17') {
      return await executeJava(code, input, workDir, submissionId);
    } else {
      throw new Error(`Unsupported language: ${language}`);
    }
  } finally {
    // Cleanup
    try {
      fs.rmSync(workDir, { recursive: true, force: true });
    } catch (_) {}
  }
}

async function executeCpp(code, input, workDir, submissionId) {
  const srcFile = path.join(workDir, 'main.cpp');
  const outFile = path.join(workDir, 'main');
  const inputFile = path.join(workDir, 'input.txt');

  fs.writeFileSync(srcFile, code, 'utf8');
  fs.writeFileSync(inputFile, input || '', 'utf8');

  // Use Docker if available, else fallback to local
  const useDocker = await isDockerAvailable();

  if (useDocker) {
    // Compile inside Docker
    const compileCmd = `docker run --rm --network none --memory ${MEMORY_MB}m --cpus 0.5 \
      -v "${workDir}:/code" gcc:12 \
      g++ -std=c++17 -O2 -o /code/main /code/main.cpp 2>&1`;

    let compileResult;
    try {
      compileResult = await execWithTimeout(compileCmd, 30000);
    } catch (err) {
      return {
        stdout: '',
        stderr: err.stderr || err.message,
        exitCode: 1,
        executionTime: 0,
        verdict: 'Compilation Error',
        compileError: err.stderr || err.message,
      };
    }

    if (compileResult.stderr && compileResult.stderr.trim()) {
      return {
        stdout: '',
        stderr: compileResult.stderr,
        exitCode: 1,
        executionTime: 0,
        verdict: 'Compilation Error',
        compileError: compileResult.stderr,
      };
    }

    // Run inside Docker
    const runCmd = `docker run --rm --network none --memory ${MEMORY_MB}m --cpus 0.5 \
      -v "${workDir}:/code" gcc:12 \
      sh -c "timeout ${TIME_LIMIT_MS / 1000} /code/main < /code/input.txt" 2>&1`;

    const start = Date.now();
    try {
      const runResult = await execWithTimeout(runCmd, TIME_LIMIT_MS + 5000);
      const executionTime = Date.now() - start;
      return {
        stdout: runResult.stdout || '',
        stderr: runResult.stderr || '',
        exitCode: 0,
        executionTime,
        verdict: null, // to be determined by test comparison
      };
    } catch (err) {
      const executionTime = Date.now() - start;
      if (executionTime >= TIME_LIMIT_MS) {
        return { stdout: '', stderr: 'Time limit exceeded', exitCode: 124, executionTime, verdict: 'Time Limit Exceeded' };
      }
      return { stdout: '', stderr: err.message, exitCode: 1, executionTime, verdict: 'Runtime Error' };
    }
  } else {
    // Fallback: local execution (non-containerized)
    return await executeLocalCpp(code, input, workDir);
  }
}

async function executeJava(code, input, workDir, submissionId) {
  const srcFile = path.join(workDir, 'Main.java');
  const inputFile = path.join(workDir, 'input.txt');

  fs.writeFileSync(srcFile, code, 'utf8');
  fs.writeFileSync(inputFile, input || '', 'utf8');

  const useDocker = await isDockerAvailable();

  if (useDocker) {
    const compileCmd = `docker run --rm --network none --memory ${MEMORY_MB}m --cpus 0.5 \
      -v "${workDir}:/code" openjdk:17-slim \
      javac /code/Main.java 2>&1`;

    let compileResult;
    try {
      compileResult = await execWithTimeout(compileCmd, 30000);
    } catch (err) {
      return {
        stdout: '',
        stderr: err.stderr || err.message,
        exitCode: 1,
        executionTime: 0,
        verdict: 'Compilation Error',
        compileError: err.stderr || err.message,
      };
    }

    if (compileResult.stderr && compileResult.stderr.trim()) {
      return {
        stdout: '',
        stderr: compileResult.stderr,
        exitCode: 1,
        executionTime: 0,
        verdict: 'Compilation Error',
        compileError: compileResult.stderr,
      };
    }

    const runCmd = `docker run --rm --network none --memory ${MEMORY_MB}m --cpus 0.5 \
      -v "${workDir}:/code" openjdk:17-slim \
      sh -c "timeout ${TIME_LIMIT_MS / 1000} java -cp /code Main < /code/input.txt" 2>&1`;

    const start = Date.now();
    try {
      const runResult = await execWithTimeout(runCmd, TIME_LIMIT_MS + 5000);
      const executionTime = Date.now() - start;
      return {
        stdout: runResult.stdout || '',
        stderr: runResult.stderr || '',
        exitCode: 0,
        executionTime,
        verdict: null,
      };
    } catch (err) {
      const executionTime = Date.now() - start;
      if (executionTime >= TIME_LIMIT_MS) {
        return { stdout: '', stderr: 'Time limit exceeded', exitCode: 124, executionTime, verdict: 'Time Limit Exceeded' };
      }
      return { stdout: '', stderr: err.message, exitCode: 1, executionTime, verdict: 'Runtime Error' };
    }
  } else {
    return await executeLocalJava(code, input, workDir);
  }
}

// Local fallback for when Docker is not available (dev mode)
async function executeLocalCpp(code, input, workDir) {
  const srcFile = path.join(workDir, 'main.cpp');
  const outFile = path.join(workDir, 'main');
  const inputFile = path.join(workDir, 'input.txt');
  fs.writeFileSync(srcFile, code);
  fs.writeFileSync(inputFile, input || '');
  
  try {
    await execAsync(`g++ -std=c++17 -O2 -o "${outFile}" "${srcFile}"`, { timeout: 30000 });
  } catch (err) {
    return { stdout: '', stderr: err.stderr || '', exitCode: 1, executionTime: 0, verdict: 'Compilation Error', compileError: err.stderr || '' };
  }
  
  const start = Date.now();
  try {
    const { stdout, stderr } = await execAsync(`"${outFile}" < "${inputFile}"`, { timeout: TIME_LIMIT_MS + 1000 });
    return { stdout, stderr, exitCode: 0, executionTime: Date.now() - start, verdict: null };
  } catch (err) {
    const ms = Date.now() - start;
    if (ms >= TIME_LIMIT_MS) return { stdout: '', stderr: '', exitCode: 124, executionTime: ms, verdict: 'Time Limit Exceeded' };
    return { stdout: err.stdout || '', stderr: err.stderr || '', exitCode: 1, executionTime: ms, verdict: 'Runtime Error' };
  }
}

async function executeLocalJava(code, input, workDir) {
  const srcFile = path.join(workDir, 'Main.java');
  const inputFile = path.join(workDir, 'input.txt');
  fs.writeFileSync(srcFile, code);
  fs.writeFileSync(inputFile, input || '');

  try {
    await execAsync(`javac "${srcFile}"`, { cwd: workDir, timeout: 30000 });
  } catch (err) {
    return { stdout: '', stderr: err.stderr || '', exitCode: 1, executionTime: 0, verdict: 'Compilation Error', compileError: err.stderr || '' };
  }

  const start = Date.now();
  try {
    const { stdout, stderr } = await execAsync(`java -cp "${workDir}" Main < "${inputFile}"`, { timeout: TIME_LIMIT_MS + 1000 });
    return { stdout, stderr, exitCode: 0, executionTime: Date.now() - start, verdict: null };
  } catch (err) {
    const ms = Date.now() - start;
    if (ms >= TIME_LIMIT_MS) return { stdout: '', stderr: '', exitCode: 124, executionTime: ms, verdict: 'Time Limit Exceeded' };
    return { stdout: err.stdout || '', stderr: err.stderr || '', exitCode: 1, executionTime: ms, verdict: 'Runtime Error' };
  }
}

function execWithTimeout(cmd, timeoutMs) {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: timeoutMs, maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) {
        err.stdout = stdout;
        err.stderr = stderr;
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

let dockerAvailable = null;
async function isDockerAvailable() {
  if (dockerAvailable !== null) return dockerAvailable;
  try {
    await execAsync('docker info', { timeout: 5000 });
    dockerAvailable = true;
  } catch {
    dockerAvailable = false;
    console.warn('⚠️  Docker not available — using local execution (insecure, dev only)');
  }
  return dockerAvailable;
}

/**
 * Run code against multiple test cases and return results
 */
async function judgeCode(code, language, testCases) {
  const results = [];
  let allPassed = true;
  let totalTime = 0;
  let firstVerdict = null;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const result = await executeCode(code, language, tc.input);

    // Normalize output (trim whitespace, normalize line endings)
    const actualOut = normalizeOutput(result.stdout);
    const expectedOut = normalizeOutput(tc.expectedOutput);
    const passed = result.verdict === null && actualOut === expectedOut;

    let verdict;
    if (result.verdict) {
      verdict = result.verdict;
    } else if (passed) {
      verdict = 'Accepted';
    } else {
      verdict = 'Wrong Answer';
    }

    if (!firstVerdict && verdict !== 'Accepted') firstVerdict = verdict;
    if (!passed) allPassed = false;
    totalTime += result.executionTime;

    results.push({
      testCaseIndex: i,
      passed,
      executionTime: result.executionTime,
      input: tc.isSample ? tc.input : '(hidden)',
      expectedOutput: tc.isSample ? tc.expectedOutput : '(hidden)',
      actualOutput: tc.isSample ? actualOut : '(hidden)',
      isHidden: !tc.isSample,
      verdict,
    });
  }

  const testsPassed = results.filter((r) => r.passed).length;
  const finalVerdict = allPassed
    ? 'Accepted'
    : firstVerdict || 'Wrong Answer';

  return {
    results,
    testsPassed,
    totalTests: testCases.length,
    executionTime: totalTime,
    verdict: finalVerdict,
  };
}

function normalizeOutput(str = '') {
  return str.replace(/\r\n/g, '\n').trim();
}

module.exports = { executeCode, judgeCode };
