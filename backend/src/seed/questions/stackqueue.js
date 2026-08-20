// ── STACK AND QUEUE — 10 Questions ──
const stackQueueProblems = [
  // Q51 — Implement Stack Using Array
  {
    title: 'Implement Stack Using Array',
    difficulty: 'Easy',
    description:
      'Implement a stack using an array. Support the following operations:\n\n- push X: Push integer X onto the stack.\n- pop: Remove and print the top element. Print -1 if the stack is empty.\n- top: Print the top element without removing it. Print -1 if the stack is empty.\n- isEmpty: Print "true" if the stack is empty, "false" otherwise.\n\nOnly pop, top, and isEmpty produce output.',
    inputFormat: 'First line: integer q (number of operations)\nNext q lines: one operation per line',
    outputFormat: 'For each pop, top, or isEmpty operation, print the result on a new line',
    constraints: '1 ≤ q ≤ 10^4\n-10^9 ≤ X ≤ 10^9',
    tags: ['Stack', 'Array'],
    sampleTestCases: [
      {
        input: '8\npush 5\npush 3\ntop\npop\ntop\npop\npop\nisEmpty',
        expectedOutput: '3\n3\n5\n5\n-1\ntrue',
        isSample: true,
        explanation: 'Push 5, push 3. Top=3, pop=3, top=5, pop=5, pop on empty=-1, isEmpty=true',
      },
      {
        input: '4\nisEmpty\npush 10\ntop\nisEmpty',
        expectedOutput: 'true\n10\nfalse',
        isSample: true,
        explanation: 'Empty at start, push 10, top=10, not empty',
      },
    ],
    hiddenTestCases: [
      { input: '1\nisEmpty', expectedOutput: 'true', isSample: false },
      { input: '3\npush 1\npush 2\ntop', expectedOutput: '2', isSample: false },
      { input: '5\npush 1\npush 2\npush 3\npop\ntop', expectedOutput: '3\n2', isSample: false },
      { input: '2\npop\ntop', expectedOutput: '-1\n-1', isSample: false },
      { input: '6\npush -5\npush 0\ntop\npop\ntop\nisEmpty', expectedOutput: '0\n0\n-5\nfalse', isSample: false },
    ],
  },

  // Q52 — Implement Queue Using Array
  {
    title: 'Implement Queue Using Array',
    difficulty: 'Easy',
    description:
      'Implement a queue using an array. Support the following operations:\n\n- enqueue X: Add integer X to the back of the queue.\n- dequeue: Remove and print the front element. Print -1 if the queue is empty.\n- front: Print the front element without removing it. Print -1 if the queue is empty.\n- isEmpty: Print "true" if the queue is empty, "false" otherwise.\n\nOnly dequeue, front, and isEmpty produce output.',
    inputFormat: 'First line: integer q (number of operations)\nNext q lines: one operation per line',
    outputFormat: 'For each dequeue, front, or isEmpty operation, print the result on a new line',
    constraints: '1 ≤ q ≤ 10^4\n-10^9 ≤ X ≤ 10^9',
    tags: ['Queue', 'Array'],
    sampleTestCases: [
      {
        input: '7\nenqueue 1\nenqueue 2\nfront\ndequeue\nfront\ndequeue\nisEmpty',
        expectedOutput: '1\n1\n2\n2\ntrue',
        isSample: true,
        explanation: 'Enqueue 1, 2. Front=1, dequeue=1, front=2, dequeue=2, isEmpty=true',
      },
      {
        input: '3\ndequeue\nisEmpty\nfront',
        expectedOutput: '-1\ntrue\n-1',
        isSample: true,
        explanation: 'All operations on empty queue',
      },
    ],
    hiddenTestCases: [
      { input: '1\nisEmpty', expectedOutput: 'true', isSample: false },
      { input: '3\nenqueue 5\nfront\nisEmpty', expectedOutput: '5\nfalse', isSample: false },
      { input: '5\nenqueue 1\nenqueue 2\nenqueue 3\ndequeue\nfront', expectedOutput: '1\n2', isSample: false },
      { input: '4\nenqueue 10\ndequeue\ndequeue\nisEmpty', expectedOutput: '10\n-1\ntrue', isSample: false },
      { input: '6\nenqueue -1\nenqueue 0\nenqueue 1\ndequeue\ndequeue\nfront', expectedOutput: '-1\n0\n1', isSample: false },
    ],
  },

  // Q53 — Implement Stack Using Queue
  {
    title: 'Implement Stack Using Queue',
    difficulty: 'Medium',
    description:
      'Implement a last-in-first-out (LIFO) stack using only queue operations.\n\nSupport the following operations:\n- push X: Push integer X onto the stack.\n- pop: Remove and print the top element. Print -1 if the stack is empty.\n- top: Print the top element without removing it. Print -1 if the stack is empty.\n- isEmpty: Print "true" if the stack is empty, "false" otherwise.',
    inputFormat: 'First line: integer q (number of operations)\nNext q lines: one operation per line',
    outputFormat: 'For each pop, top, or isEmpty operation, print the result on a new line',
    constraints: '1 ≤ q ≤ 10^4\n-10^9 ≤ X ≤ 10^9',
    tags: ['Stack', 'Queue'],
    sampleTestCases: [
      {
        input: '6\npush 1\npush 2\ntop\npop\ntop\nisEmpty',
        expectedOutput: '2\n2\n1\nfalse',
        isSample: true,
        explanation: 'Stack behavior: push 1, push 2 → top=2, pop=2, top=1, not empty',
      },
      {
        input: '4\npush 10\npop\npop\nisEmpty',
        expectedOutput: '10\n-1\ntrue',
        isSample: true,
        explanation: 'Push 10, pop=10, pop on empty=-1, isEmpty=true',
      },
    ],
    hiddenTestCases: [
      { input: '1\nisEmpty', expectedOutput: 'true', isSample: false },
      { input: '5\npush 1\npush 2\npush 3\npop\ntop', expectedOutput: '3\n2', isSample: false },
      { input: '3\npush 5\ntop\ntop', expectedOutput: '5\n5', isSample: false },
      { input: '2\npop\ntop', expectedOutput: '-1\n-1', isSample: false },
      { input: '7\npush 3\npush 7\npop\npush 5\ntop\npop\ntop', expectedOutput: '7\n5\n5\n3', isSample: false },
    ],
  },

  // Q54 — Implement Queue Using Stack
  {
    title: 'Implement Queue Using Stack',
    difficulty: 'Medium',
    description:
      'Implement a first-in-first-out (FIFO) queue using only stack operations.\n\nSupport the following operations:\n- enqueue X: Add integer X to the back of the queue.\n- dequeue: Remove and print the front element. Print -1 if the queue is empty.\n- front: Print the front element without removing it. Print -1 if the queue is empty.\n- isEmpty: Print "true" if the queue is empty, "false" otherwise.',
    inputFormat: 'First line: integer q (number of operations)\nNext q lines: one operation per line',
    outputFormat: 'For each dequeue, front, or isEmpty operation, print the result on a new line',
    constraints: '1 ≤ q ≤ 10^4\n-10^9 ≤ X ≤ 10^9',
    tags: ['Stack', 'Queue'],
    sampleTestCases: [
      {
        input: '6\nenqueue 1\nenqueue 2\nfront\ndequeue\nfront\nisEmpty',
        expectedOutput: '1\n1\n2\nfalse',
        isSample: true,
        explanation: 'Queue behavior: enqueue 1, 2 → front=1, dequeue=1, front=2, not empty',
      },
      {
        input: '4\nenqueue 10\ndequeue\ndequeue\nisEmpty',
        expectedOutput: '10\n-1\ntrue',
        isSample: true,
        explanation: 'Enqueue 10, dequeue=10, dequeue on empty=-1, isEmpty=true',
      },
    ],
    hiddenTestCases: [
      { input: '1\nisEmpty', expectedOutput: 'true', isSample: false },
      { input: '5\nenqueue 1\nenqueue 2\nenqueue 3\ndequeue\nfront', expectedOutput: '1\n2', isSample: false },
      { input: '3\nenqueue 5\nfront\nfront', expectedOutput: '5\n5', isSample: false },
      { input: '2\ndequeue\nfront', expectedOutput: '-1\n-1', isSample: false },
      { input: '7\nenqueue 3\nenqueue 7\ndequeue\nenqueue 5\nfront\ndequeue\nfront', expectedOutput: '3\n7\n7\n5', isSample: false },
    ],
  },

  // Q55 — Valid Parentheses (duplicate of existing, will be skipped)
  {
    title: 'Valid Parentheses',
    difficulty: 'Medium',
    description:
      'Given a string s containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    inputFormat: 'A single line containing the string s',
    outputFormat: 'Print "true" if valid, "false" otherwise',
    constraints: '1 ≤ s.length ≤ 10^4\ns consists of parentheses only ()[]{}',
    tags: ['String', 'Stack'],
    sampleTestCases: [
      { input: '()', expectedOutput: 'true', isSample: true, explanation: 'Single valid pair' },
      { input: '(]', expectedOutput: 'false', isSample: true, explanation: 'Mismatched brackets' },
    ],
    hiddenTestCases: [
      { input: '()[]{}', expectedOutput: 'true', isSample: false },
      { input: '([)]', expectedOutput: 'false', isSample: false },
      { input: '{[]}', expectedOutput: 'true', isSample: false },
      { input: '((((', expectedOutput: 'false', isSample: false },
      { input: '({[]})', expectedOutput: 'true', isSample: false },
    ],
  },

  // Q56 — Min Stack
  {
    title: 'Min Stack',
    difficulty: 'Medium',
    description:
      'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.\n\n- push X: Push element X onto the stack. No output.\n- pop: Remove the top element. No output.\n- top: Print the top element.\n- getMin: Print the minimum element in the stack.\n\nAll top and getMin operations are guaranteed to be called on a non-empty stack.',
    inputFormat: 'First line: integer q (number of operations)\nNext q lines: one operation per line',
    outputFormat: 'For each top or getMin operation, print the result on a new line',
    constraints: '1 ≤ q ≤ 10^4\n-10^9 ≤ X ≤ 10^9\ntop and getMin are only called when stack is non-empty.',
    tags: ['Stack', 'Design'],
    sampleTestCases: [
      {
        input: '7\npush -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin',
        expectedOutput: '-3\n0\n-2',
        isSample: true,
        explanation: 'After pushes: stack=[-2,0,-3]. getMin=-3, pop -3, top=0, getMin=-2',
      },
      {
        input: '5\npush 2\npush 1\ngetMin\npop\ngetMin',
        expectedOutput: '1\n2',
        isSample: true,
        explanation: 'Push 2,1. getMin=1, pop 1, getMin=2',
      },
    ],
    hiddenTestCases: [
      { input: '3\npush 5\ntop\ngetMin', expectedOutput: '5\n5', isSample: false },
      { input: '5\npush 3\npush 3\npush 3\ngetMin\ntop', expectedOutput: '3\n3', isSample: false },
      { input: '7\npush 1\npush 2\npush 3\ngetMin\npop\npop\ngetMin', expectedOutput: '1\n1', isSample: false },
      { input: '5\npush -1\npush -2\ngetMin\npop\ngetMin', expectedOutput: '-2\n-1', isSample: false },
      { input: '9\npush 5\npush 3\npush 7\npush 1\ngetMin\npop\ngetMin\npop\ngetMin', expectedOutput: '1\n3\n3', isSample: false },
    ],
  },

  // Q57 — Next Greater Element
  {
    title: 'Next Greater Element',
    difficulty: 'Medium',
    description:
      'Given an array of integers, find the Next Greater Element (NGE) for every element.\n\nThe next greater element for an element x is the first element to its right that is greater than x. If no greater element exists, the answer is -1.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers',
    outputFormat: 'A single line containing n space-separated integers — the NGE for each element',
    constraints: '1 ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    tags: ['Stack', 'Array'],
    sampleTestCases: [
      { input: '4\n4 5 2 25', expectedOutput: '5 25 25 -1', isSample: true, explanation: 'NGE of 4 is 5, 5 is 25, 2 is 25, 25 has none' },
      { input: '4\n13 7 6 12', expectedOutput: '-1 12 12 -1', isSample: true, explanation: 'NGE of 13 is none, 7 is 12, 6 is 12, 12 has none' },
    ],
    hiddenTestCases: [
      { input: '1\n5', expectedOutput: '-1', isSample: false },
      { input: '3\n3 2 1', expectedOutput: '-1 -1 -1', isSample: false },
      { input: '3\n1 2 3', expectedOutput: '2 3 -1', isSample: false },
      { input: '5\n1 3 2 4 1', expectedOutput: '3 4 4 -1 -1', isSample: false },
      { input: '5\n5 5 5 5 5', expectedOutput: '-1 -1 -1 -1 -1', isSample: false },
    ],
  },

  // Q58 — Evaluate Postfix Expression
  {
    title: 'Evaluate Postfix Expression',
    difficulty: 'Medium',
    description:
      'Given a postfix (Reverse Polish Notation) expression as a string of space-separated tokens, evaluate it and print the result.\n\nSupported operators: +, -, *, /\n\nInteger division truncates toward zero.',
    inputFormat: 'A single line containing space-separated tokens (integers and operators)',
    outputFormat: 'A single integer — the result of the expression',
    constraints: '1 ≤ number of tokens ≤ 10^4\n-1000 ≤ operands ≤ 1000\nDivision by zero will not occur.\nThe expression is always valid.',
    tags: ['Stack', 'Math'],
    sampleTestCases: [
      { input: '2 3 +', expectedOutput: '5', isSample: true, explanation: '2 + 3 = 5' },
      { input: '2 3 1 * + 9 -', expectedOutput: '-4', isSample: true, explanation: '3*1=3, 2+3=5, 5-9=-4' },
    ],
    hiddenTestCases: [
      { input: '5', expectedOutput: '5', isSample: false },
      { input: '10 20 +', expectedOutput: '30', isSample: false },
      { input: '4 2 / 3 *', expectedOutput: '6', isSample: false },
      { input: '5 1 2 + 4 * + 3 -', expectedOutput: '14', isSample: false },
      { input: '10 2 * 3 + 4 -', expectedOutput: '19', isSample: false },
    ],
  },

  // Q59 — Infix to Postfix
  {
    title: 'Infix to Postfix',
    difficulty: 'Medium',
    description:
      'Convert a given infix expression to postfix (Reverse Polish Notation).\n\nSupported operators: +, -, *, /, ^ (exponentiation)\n\nPrecedence (highest to lowest): ^ > *, / > +, -\n\nAssociativity: ^ is right-associative, all others are left-associative.\n\nOperands are single uppercase English letters (A-Z). Parentheses are supported.\n\nPrint the postfix expression as a string of characters (no spaces).',
    inputFormat: 'A single line containing the infix expression',
    outputFormat: 'A single line containing the postfix expression',
    constraints: '1 ≤ expression length ≤ 200\nOperands are uppercase letters A-Z.\nOperators are +, -, *, /, ^\nParentheses may be present.',
    tags: ['Stack', 'String'],
    sampleTestCases: [
      { input: 'A+B*C', expectedOutput: 'ABC*+', isSample: true, explanation: 'B*C evaluated first, then A+result' },
      { input: '(A+B)*C', expectedOutput: 'AB+C*', isSample: true, explanation: 'A+B in parentheses first, then multiply by C' },
    ],
    hiddenTestCases: [
      { input: 'A', expectedOutput: 'A', isSample: false },
      { input: 'A+B', expectedOutput: 'AB+', isSample: false },
      { input: 'A*(B+C)', expectedOutput: 'ABC+*', isSample: false },
      { input: 'A+B-C', expectedOutput: 'AB+C-', isSample: false },
      { input: 'A*B+C*D', expectedOutput: 'AB*CD*+', isSample: false },
    ],
  },

  // Q60 — Largest Rectangle in Histogram
  {
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    description:
      'Given an array of integers representing the heights of bars in a histogram where each bar has width 1, find the area of the largest rectangle that can be formed in the histogram.',
    inputFormat: 'First line: integer n (number of bars)\nSecond line: n space-separated non-negative integers representing bar heights',
    outputFormat: 'A single integer — the area of the largest rectangle',
    constraints: '1 ≤ n ≤ 10^5\n0 ≤ heights[i] ≤ 10^4',
    tags: ['Stack', 'Array'],
    sampleTestCases: [
      { input: '6\n2 1 5 6 2 3', expectedOutput: '10', isSample: true, explanation: 'Rectangle of height 5 and width 2 (bars at index 2 and 3)' },
      { input: '2\n2 4', expectedOutput: '4', isSample: true, explanation: 'Either single bar of height 4 or both bars with height 2 (area=4)' },
    ],
    hiddenTestCases: [
      { input: '1\n5', expectedOutput: '5', isSample: false },
      { input: '3\n3 3 3', expectedOutput: '9', isSample: false },
      { input: '5\n1 2 3 4 5', expectedOutput: '9', isSample: false },
      { input: '5\n5 4 3 2 1', expectedOutput: '9', isSample: false },
      { input: '7\n6 2 5 4 5 1 6', expectedOutput: '12', isSample: false },
    ],
  },
];

module.exports = stackQueueProblems;
