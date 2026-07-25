const Problem = require('../models/Problem');

const problems = [
  {
    title: 'Two Sum',
    difficulty: 'Easy',
    description:
      'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    inputFormat:
      'First line: integer n (size of array)\nSecond line: n space-separated integers\nThird line: integer target',
    outputFormat: 'Two space-separated integers — the indices of the two numbers (0-indexed)',
    constraints: '2 ≤ n ≤ 10^4\n-10^9 ≤ nums[i] ≤ 10^9\n-10^9 ≤ target ≤ 10^9\nExactly one valid answer exists.',
    tags: ['Array', 'Hash Table'],
    sampleTestCases: [
      {
        input: '4\n2 7 11 15\n9',
        expectedOutput: '0 1',
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9',
        isSample: true,
      },
      {
        input: '3\n3 2 4\n6',
        expectedOutput: '1 2',
        explanation: 'nums[1] + nums[2] = 2 + 4 = 6',
        isSample: true,
      },
    ],
    hiddenTestCases: [
      { input: '2\n3 3\n6', expectedOutput: '0 1', isSample: false },
      { input: '5\n1 2 3 4 5\n9', expectedOutput: '3 4', isSample: false },
      { input: '4\n-1 -2 -3 -4\n-7', expectedOutput: '2 3', isSample: false },
    ],
  },
  {
    title: 'Reverse String',
    difficulty: 'Easy',
    description:
      'Write a function that reverses a string. Given a string s, return the reversed version of it.\n\nDo not allocate extra space for another array. Modify the string in-place with O(1) extra memory.',
    inputFormat: 'A single line containing the string s',
    outputFormat: 'The reversed string on a single line',
    constraints: '1 ≤ s.length ≤ 10^5\ns[i] is a printable ASCII character.',
    tags: ['String', 'Two Pointers'],
    sampleTestCases: [
      { input: 'hello', expectedOutput: 'olleh', isSample: true },
      { input: 'Hannah', expectedOutput: 'hannaH', isSample: true },
    ],
    hiddenTestCases: [
      { input: 'abcdefg', expectedOutput: 'gfedcba', isSample: false },
      { input: 'A', expectedOutput: 'A', isSample: false },
      { input: 'racecar', expectedOutput: 'racecar', isSample: false },
    ],
  },
  {
    title: 'Fibonacci Number',
    difficulty: 'Easy',
    description:
      'The Fibonacci numbers, commonly denoted F(n) form a sequence such that each number is the sum of the two preceding ones, starting from 0 and 1:\n\nF(0) = 0, F(1) = 1\nF(n) = F(n-1) + F(n-2), for n > 1\n\nGiven n, calculate F(n).',
    inputFormat: 'A single integer n',
    outputFormat: 'A single integer — F(n)',
    constraints: '0 ≤ n ≤ 30',
    tags: ['Math', 'Dynamic Programming', 'Recursion'],
    sampleTestCases: [
      { input: '2', expectedOutput: '1', explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1', isSample: true },
      { input: '3', expectedOutput: '2', explanation: 'F(3) = F(2) + F(1) = 1 + 1 = 2', isSample: true },
      { input: '4', expectedOutput: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3', isSample: true },
    ],
    hiddenTestCases: [
      { input: '0', expectedOutput: '0', isSample: false },
      { input: '1', expectedOutput: '1', isSample: false },
      { input: '10', expectedOutput: '55', isSample: false },
      { input: '20', expectedOutput: '6765', isSample: false },
      { input: '30', expectedOutput: '832040', isSample: false },
    ],
  },
  {
    title: 'Valid Parentheses',
    difficulty: 'Medium',
    description:
      'Given a string s containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    inputFormat: 'A single line containing the string s',
    outputFormat: 'Print "true" if valid, "false" otherwise',
    constraints: '1 ≤ s.length ≤ 10^4\ns consists of parentheses only ()[]{} ',
    tags: ['String', 'Stack'],
    sampleTestCases: [
      { input: '()', expectedOutput: 'true', isSample: true },
      { input: '()[]{} ', expectedOutput: 'true', isSample: true },
      { input: '(]', expectedOutput: 'false', isSample: true },
    ],
    hiddenTestCases: [
      { input: '([)]', expectedOutput: 'false', isSample: false },
      { input: '{[]}', expectedOutput: 'true', isSample: false },
      { input: ' ', expectedOutput: 'true', isSample: false },
      { input: '((((', expectedOutput: 'false', isSample: false },
    ],
  },
  {
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    description:
      'Given an integer array nums, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.',
    inputFormat:
      'First line: integer n (size of array)\nSecond line: n space-separated integers',
    outputFormat: 'A single integer — the maximum subarray sum',
    constraints: '1 ≤ n ≤ 10^5\n-10^4 ≤ nums[i] ≤ 10^4',
    tags: ['Array', 'Dynamic Programming', "Kadane's Algorithm"],
    sampleTestCases: [
      {
        input: '9\n-2 1 -3 4 -1 2 1 -5 4',
        expectedOutput: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum = 6',
        isSample: true,
      },
      { input: '1\n1', expectedOutput: '1', isSample: true },
      { input: '5\n5 4 -1 7 8', expectedOutput: '23', isSample: true },
    ],
    hiddenTestCases: [
      { input: '3\n-2 -1 -3', expectedOutput: '-1', isSample: false },
      { input: '6\n1 2 3 -2 5 -1', expectedOutput: '9', isSample: false },
      { input: '4\n-1 -2 -3 -4', expectedOutput: '-1', isSample: false },
      { input: '5\n1 -1 1 -1 1', expectedOutput: '1', isSample: false },
    ],
  },
];

async function seed() {
  await Problem.deleteMany({});
  await Problem.insertMany(problems);
  console.log(`✅ Seeded ${problems.length} problems`);
}

async function seedCLI() {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
  const connectDB = require('../config/db');
  await connectDB();
  await seed();
  process.exit(0);
}

module.exports = seed;

if (require.main === module) {
  seedCLI();
}
