// ── HEAP / PRIORITY QUEUE — 5 Questions ──
const heapProblems = [
  // Q96 — Kth Largest Element
  {
    title: 'Kth Largest Element',
    difficulty: 'Medium',
    description:
      'Given an unsorted array of integers and an integer k, find the kth largest element in the array.\n\nThe kth largest element is the kth element in sorted descending order (1-indexed).',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers\nThird line: integer k',
    outputFormat: 'A single integer — the kth largest element',
    constraints: '1 ≤ k ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    tags: ['Heap', 'Sorting'],
    sampleTestCases: [
      { input: '6\n3 2 1 5 6 4\n2', expectedOutput: '5', isSample: true, explanation: 'Sorted descending: [6,5,4,3,2,1], 2nd largest is 5' },
      { input: '9\n3 2 3 1 2 4 5 5 6\n4', expectedOutput: '4', isSample: true, explanation: 'Sorted descending: [6,5,5,4,3,3,2,2,1], 4th largest is 4' },
    ],
    hiddenTestCases: [
      { input: '1\n5\n1', expectedOutput: '5', isSample: false },
      { input: '3\n1 1 1\n1', expectedOutput: '1', isSample: false },
      { input: '5\n-1 -2 -3 -4 -5\n3', expectedOutput: '-3', isSample: false },
      { input: '7\n7 6 5 4 3 2 1\n7', expectedOutput: '1', isSample: false },
      { input: '5\n10 20 30 40 50\n1', expectedOutput: '50', isSample: false },
    ],
  },

  // Q97 — Kth Smallest Element
  {
    title: 'Kth Smallest Element',
    difficulty: 'Easy',
    description:
      'Given an unsorted array of integers and an integer k, find the kth smallest element in the array.\n\nThe kth smallest element is the kth element in sorted ascending order (1-indexed).',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers\nThird line: integer k',
    outputFormat: 'A single integer — the kth smallest element',
    constraints: '1 ≤ k ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    tags: ['Heap', 'Sorting'],
    sampleTestCases: [
      { input: '6\n7 10 4 3 20 15\n3', expectedOutput: '7', isSample: true, explanation: 'Sorted: [3,4,7,10,15,20], 3rd smallest is 7' },
      { input: '5\n7 10 4 20 15\n4', expectedOutput: '15', isSample: true, explanation: 'Sorted: [4,7,10,15,20], 4th smallest is 15' },
    ],
    hiddenTestCases: [
      { input: '1\n5\n1', expectedOutput: '5', isSample: false },
      { input: '3\n1 1 1\n2', expectedOutput: '1', isSample: false },
      { input: '5\n-1 -2 -3 -4 -5\n2', expectedOutput: '-4', isSample: false },
      { input: '7\n1 2 3 4 5 6 7\n1', expectedOutput: '1', isSample: false },
      { input: '5\n50 40 30 20 10\n5', expectedOutput: '50', isSample: false },
    ],
  },

  // Q98 — K Largest Elements
  {
    title: 'K Largest Elements',
    difficulty: 'Medium',
    description:
      'Given an unsorted array of integers and an integer k, find the k largest elements.\n\nPrint the k largest elements in descending order.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers\nThird line: integer k',
    outputFormat: 'A single line containing k space-separated integers in descending order',
    constraints: '1 ≤ k ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    tags: ['Heap', 'Sorting'],
    sampleTestCases: [
      { input: '7\n11 3 2 1 15 5 4\n3', expectedOutput: '15 11 5', isSample: true, explanation: 'Top 3: 15, 11, 5' },
      { input: '5\n1 2 3 4 5\n2', expectedOutput: '5 4', isSample: true, explanation: 'Top 2: 5, 4' },
    ],
    hiddenTestCases: [
      { input: '1\n5\n1', expectedOutput: '5', isSample: false },
      { input: '5\n5 5 5 5 5\n3', expectedOutput: '5 5 5', isSample: false },
      { input: '5\n-1 -2 -3 -4 -5\n2', expectedOutput: '-1 -2', isSample: false },
      { input: '6\n10 20 30 40 50 60\n6', expectedOutput: '60 50 40 30 20 10', isSample: false },
      { input: '4\n3 1 4 2\n1', expectedOutput: '4', isSample: false },
    ],
  },

  // Q99 — K Smallest Elements
  {
    title: 'K Smallest Elements',
    difficulty: 'Easy',
    description:
      'Given an unsorted array of integers and an integer k, find the k smallest elements.\n\nPrint the k smallest elements in ascending order.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers\nThird line: integer k',
    outputFormat: 'A single line containing k space-separated integers in ascending order',
    constraints: '1 ≤ k ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    tags: ['Heap', 'Sorting'],
    sampleTestCases: [
      { input: '7\n11 3 2 1 15 5 4\n3', expectedOutput: '1 2 3', isSample: true, explanation: 'Bottom 3: 1, 2, 3' },
      { input: '5\n5 4 3 2 1\n2', expectedOutput: '1 2', isSample: true, explanation: 'Bottom 2: 1, 2' },
    ],
    hiddenTestCases: [
      { input: '1\n5\n1', expectedOutput: '5', isSample: false },
      { input: '5\n5 5 5 5 5\n3', expectedOutput: '5 5 5', isSample: false },
      { input: '5\n-1 -2 -3 -4 -5\n2', expectedOutput: '-5 -4', isSample: false },
      { input: '6\n60 50 40 30 20 10\n6', expectedOutput: '10 20 30 40 50 60', isSample: false },
      { input: '4\n3 1 4 2\n1', expectedOutput: '1', isSample: false },
    ],
  },

  // Q100 — Minimum Cost to Connect Ropes
  {
    title: 'Minimum Cost to Connect Ropes',
    difficulty: 'Medium',
    description:
      'Given an array of integers representing the lengths of ropes, connect all ropes into one rope with minimum cost.\n\nThe cost of connecting two ropes is the sum of their lengths. You must connect exactly two ropes at a time.\n\nFind the minimum total cost to connect all ropes into one.\n\nIf there is only one rope, the cost is 0.',
    inputFormat: 'First line: integer n (number of ropes)\nSecond line: n space-separated integers (rope lengths)',
    outputFormat: 'A single integer — the minimum cost to connect all ropes',
    constraints: '1 ≤ n ≤ 10^5\n1 ≤ rope[i] ≤ 10^4',
    tags: ['Heap', 'Greedy'],
    sampleTestCases: [
      { input: '4\n4 3 2 6', expectedOutput: '29', isSample: true, explanation: 'Connect 2+3=5 (cost 5), 4+5=9 (cost 9), 6+9=15 (cost 15). Total = 5+9+15 = 29' },
      { input: '3\n1 2 3', expectedOutput: '9', isSample: true, explanation: 'Connect 1+2=3 (cost 3), 3+3=6 (cost 6). Total = 3+6 = 9' },
    ],
    hiddenTestCases: [
      { input: '1\n5', expectedOutput: '0', isSample: false },
      { input: '2\n3 4', expectedOutput: '7', isSample: false },
      { input: '5\n1 1 1 1 1', expectedOutput: '12', isSample: false },
      { input: '3\n5 5 5', expectedOutput: '25', isSample: false },
      { input: '4\n1 2 5 10', expectedOutput: '30', isSample: false },
    ],
  },
];

module.exports = heapProblems;
