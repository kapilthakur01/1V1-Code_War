// ── HASHING — 10 Questions ──
const hashingProblems = [
  // Q61 — Count Frequency of Elements
  {
    title: 'Count Frequency of Elements',
    difficulty: 'Easy',
    description:
      'Given an array of integers, count the frequency of each element and print them sorted by element value.\n\nPrint each element and its frequency on a separate line in the format "element count".',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers',
    outputFormat: 'Each line contains an element followed by a space and its frequency, sorted by element value in ascending order',
    constraints: '1 ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    tags: ['Hash Table', 'Sorting'],
    sampleTestCases: [
      { input: '6\n1 2 2 3 3 3', expectedOutput: '1 1\n2 2\n3 3', isSample: true, explanation: '1 appears 1 time, 2 appears 2 times, 3 appears 3 times' },
      { input: '4\n5 5 5 5', expectedOutput: '5 4', isSample: true, explanation: '5 appears 4 times' },
    ],
    hiddenTestCases: [
      { input: '1\n42', expectedOutput: '42 1', isSample: false },
      { input: '5\n3 1 2 1 3', expectedOutput: '1 2\n2 1\n3 2', isSample: false },
      { input: '3\n-1 0 -1', expectedOutput: '-1 2\n0 1', isSample: false },
      { input: '6\n10 20 10 30 20 10', expectedOutput: '10 3\n20 2\n30 1', isSample: false },
      { input: '4\n1 2 3 4', expectedOutput: '1 1\n2 1\n3 1\n4 1', isSample: false },
    ],
  },

  // Q62 — Find Duplicate Elements
  {
    title: 'Find Duplicate Elements',
    difficulty: 'Easy',
    description:
      'Given an array of integers, find all elements that appear more than once. Print the duplicate elements in sorted order.\n\nIf there are no duplicates, print -1.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers',
    outputFormat: 'A single line containing the duplicate elements sorted in ascending order, or -1 if none',
    constraints: '1 ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    tags: ['Hash Table', 'Sorting'],
    sampleTestCases: [
      { input: '7\n1 2 3 2 4 3 5', expectedOutput: '2 3', isSample: true, explanation: '2 and 3 appear more than once' },
      { input: '4\n1 2 3 4', expectedOutput: '-1', isSample: true, explanation: 'No duplicates' },
    ],
    hiddenTestCases: [
      { input: '1\n5', expectedOutput: '-1', isSample: false },
      { input: '3\n1 1 1', expectedOutput: '1', isSample: false },
      { input: '6\n5 3 5 3 5 3', expectedOutput: '3 5', isSample: false },
      { input: '5\n-1 -1 0 0 1', expectedOutput: '-1 0', isSample: false },
      { input: '8\n1 2 3 4 1 2 3 4', expectedOutput: '1 2 3 4', isSample: false },
    ],
  },

  // Q63 — Find First Unique Element
  {
    title: 'Find First Unique Element',
    difficulty: 'Easy',
    description:
      'Given an array of integers, find the first element that appears exactly once.\n\nIf there is no unique element, print -1.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers',
    outputFormat: 'A single integer — the first unique element, or -1 if none exists',
    constraints: '1 ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    tags: ['Hash Table'],
    sampleTestCases: [
      { input: '7\n4 5 1 2 1 4 2', expectedOutput: '5', isSample: true, explanation: '5 is the first element that appears exactly once' },
      { input: '4\n1 1 2 2', expectedOutput: '-1', isSample: true, explanation: 'All elements repeat' },
    ],
    hiddenTestCases: [
      { input: '1\n42', expectedOutput: '42', isSample: false },
      { input: '5\n1 2 3 4 5', expectedOutput: '1', isSample: false },
      { input: '5\n2 2 3 3 4', expectedOutput: '4', isSample: false },
      { input: '6\n1 1 1 1 1 1', expectedOutput: '-1', isSample: false },
      { input: '6\n5 3 5 3 2 1', expectedOutput: '2', isSample: false },
    ],
  },

  // Q64 — Two Sum Using HashMap
  {
    title: 'Two Sum Using HashMap',
    difficulty: 'Easy',
    description:
      'Given an array of integers and a target sum, determine if there exist two distinct elements in the array whose sum equals the target.\n\nPrint "true" if such a pair exists, otherwise print "false".',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers\nThird line: integer target',
    outputFormat: 'Print "true" or "false"',
    constraints: '2 ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9\n-10^9 ≤ target ≤ 10^9',
    tags: ['Hash Table', 'Array'],
    sampleTestCases: [
      { input: '4\n2 7 11 15\n9', expectedOutput: 'true', isSample: true, explanation: '2 + 7 = 9' },
      { input: '3\n1 2 3\n7', expectedOutput: 'false', isSample: true, explanation: 'No pair sums to 7' },
    ],
    hiddenTestCases: [
      { input: '2\n1 1\n2', expectedOutput: 'true', isSample: false },
      { input: '5\n-1 -2 -3 -4 -5\n-8', expectedOutput: 'true', isSample: false },
      { input: '3\n0 0 0\n0', expectedOutput: 'true', isSample: false },
      { input: '4\n1 2 3 4\n10', expectedOutput: 'false', isSample: false },
      { input: '5\n5 3 1 7 9\n12', expectedOutput: 'true', isSample: false },
    ],
  },

  // Q65 — Group Anagrams
  {
    title: 'Group Anagrams',
    difficulty: 'Medium',
    description:
      'Given an array of strings, group the anagrams together.\n\nAn anagram is a word formed by rearranging the letters of another word.\n\nWithin each group, sort the words alphabetically. Sort the groups by their first word alphabetically. Print each group on a separate line with words separated by spaces.',
    inputFormat: 'First line: integer n (number of strings)\nNext n lines: one string per line (lowercase English letters)',
    outputFormat: 'Each line contains one group of anagrams, words sorted alphabetically within the group, groups sorted by first word',
    constraints: '1 ≤ n ≤ 10^4\n1 ≤ strs[i].length ≤ 100\nstrs[i] consists of lowercase English letters.',
    tags: ['Hash Table', 'String', 'Sorting'],
    sampleTestCases: [
      {
        input: '6\neat\ntea\ntan\nate\nnat\nbat',
        expectedOutput: 'ate eat tea\nbat\nnat tan',
        isSample: true,
        explanation: 'Groups: {eat, tea, ate} sorted → ate eat tea; {tan, nat} → nat tan; {bat} → bat',
      },
      {
        input: '1\na',
        expectedOutput: 'a',
        isSample: true,
        explanation: 'Single word forms its own group',
      },
    ],
    hiddenTestCases: [
      { input: '3\nabc\nbca\ncab', expectedOutput: 'abc bca cab', isSample: false },
      { input: '2\nab\nba', expectedOutput: 'ab ba', isSample: false },
      { input: '4\ndog\ngod\ncat\ntac', expectedOutput: 'cat tac\ndog god', isSample: false },
      { input: '3\naaa\naaa\naaa', expectedOutput: 'aaa aaa aaa', isSample: false },
      { input: '5\nlisten\nsilent\nhello\nworld\nenlist', expectedOutput: 'hello\nenlist listen silent\nworld', isSample: false },
    ],
  },

  // Q66 — Longest Consecutive Sequence (duplicate of Q18, will be skipped)
  {
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    description:
      'Given an unsorted array of integers, find the length of the longest consecutive elements sequence.\n\nYour algorithm should run in O(n) time.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers',
    outputFormat: 'A single integer — the length of the longest consecutive sequence',
    constraints: '1 ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    tags: ['Hash Table', 'Array'],
    sampleTestCases: [
      { input: '6\n100 4 200 1 3 2', expectedOutput: '4', isSample: true, explanation: 'Longest consecutive sequence is [1, 2, 3, 4]' },
      { input: '1\n0', expectedOutput: '1', isSample: true, explanation: 'Single element' },
    ],
    hiddenTestCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '5', isSample: false },
      { input: '8\n10 5 12 3 55 30 2 4', expectedOutput: '4', isSample: false },
      { input: '7\n0 -1 1 -2 2 -3 3', expectedOutput: '7', isSample: false },
      { input: '5\n5 5 5 5 5', expectedOutput: '1', isSample: false },
      { input: '6\n1 9 3 10 4 20', expectedOutput: '2', isSample: false },
    ],
  },

  // Q67 — Subarray Sum Equals K
  {
    title: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    description:
      'Given an array of integers and an integer k, find the total number of contiguous subarrays whose sum equals k.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers\nThird line: integer k',
    outputFormat: 'A single integer — the number of subarrays with sum equal to k',
    constraints: '1 ≤ n ≤ 10^4\n-1000 ≤ arr[i] ≤ 1000\n-10^7 ≤ k ≤ 10^7',
    tags: ['Hash Table', 'Prefix Sum'],
    sampleTestCases: [
      { input: '3\n1 1 1\n2', expectedOutput: '2', isSample: true, explanation: 'Subarrays [1,1] at indices (0,1) and (1,2)' },
      { input: '3\n1 2 3\n3', expectedOutput: '2', isSample: true, explanation: 'Subarrays [1,2] and [3]' },
    ],
    hiddenTestCases: [
      { input: '1\n5\n5', expectedOutput: '1', isSample: false },
      { input: '1\n5\n3', expectedOutput: '0', isSample: false },
      { input: '5\n1 -1 1 -1 1\n0', expectedOutput: '4', isSample: false },
      { input: '4\n0 0 0 0\n0', expectedOutput: '10', isSample: false },
      { input: '5\n3 4 7 2 -3\n7', expectedOutput: '3', isSample: false },
    ],
  },

  // Q68 — Count Pairs With Given Sum
  {
    title: 'Count Pairs With Given Sum',
    difficulty: 'Medium',
    description:
      'Given an array of integers and an integer target, count the number of pairs (i, j) where i < j and arr[i] + arr[j] = target.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers\nThird line: integer target',
    outputFormat: 'A single integer — the number of pairs with the given sum',
    constraints: '2 ≤ n ≤ 10^4\n-10^9 ≤ arr[i] ≤ 10^9\n-10^9 ≤ target ≤ 10^9',
    tags: ['Hash Table', 'Array'],
    sampleTestCases: [
      { input: '4\n1 5 7 -1\n6', expectedOutput: '2', isSample: true, explanation: 'Pairs: (1,5) and (7,-1)' },
      { input: '4\n1 1 1 1\n2', expectedOutput: '6', isSample: true, explanation: 'All C(4,2) = 6 pairs sum to 2' },
    ],
    hiddenTestCases: [
      { input: '2\n1 2\n3', expectedOutput: '1', isSample: false },
      { input: '3\n1 2 3\n10', expectedOutput: '0', isSample: false },
      { input: '5\n0 0 0 0 0\n0', expectedOutput: '10', isSample: false },
      { input: '5\n-1 -2 3 4 -3\n1', expectedOutput: '2', isSample: false },
      { input: '6\n1 2 3 4 5 6\n7', expectedOutput: '3', isSample: false },
    ],
  },

  // Q69 — Common Elements in Three Arrays
  {
    title: 'Common Elements in Three Arrays',
    difficulty: 'Medium',
    description:
      'Given three sorted arrays, find all common elements that appear in all three arrays.\n\nEach element in the result should appear only once. Print the result in sorted order.\n\nIf there are no common elements, print -1.',
    inputFormat: 'First line: integer n1 (size of first array)\nSecond line: n1 space-separated sorted integers\nThird line: integer n2 (size of second array)\nFourth line: n2 space-separated sorted integers\nFifth line: integer n3 (size of third array)\nSixth line: n3 space-separated sorted integers',
    outputFormat: 'A single line containing the common elements sorted in ascending order, or -1 if none',
    constraints: '1 ≤ n1, n2, n3 ≤ 10^4\n-10^9 ≤ arr[i] ≤ 10^9\nArrays are sorted in non-decreasing order.',
    tags: ['Hash Table', 'Array', 'Sorting'],
    sampleTestCases: [
      { input: '6\n1 5 10 20 40 80\n5\n6 7 20 80 100\n8\n3 4 15 20 30 70 80 120', expectedOutput: '20 80', isSample: true, explanation: '20 and 80 appear in all three arrays' },
      { input: '3\n1 2 3\n3\n4 5 6\n3\n7 8 9', expectedOutput: '-1', isSample: true, explanation: 'No common elements' },
    ],
    hiddenTestCases: [
      { input: '1\n1\n1\n1\n1\n1', expectedOutput: '1', isSample: false },
      { input: '3\n1 2 3\n3\n2 3 4\n3\n3 4 5', expectedOutput: '3', isSample: false },
      { input: '4\n1 1 2 2\n4\n1 1 2 2\n4\n1 1 2 2', expectedOutput: '1 2', isSample: false },
      { input: '3\n-3 -2 -1\n3\n-3 -1 0\n3\n-3 -1 1', expectedOutput: '-3 -1', isSample: false },
      { input: '5\n1 2 3 4 5\n5\n1 2 3 4 5\n5\n1 2 3 4 5', expectedOutput: '1 2 3 4 5', isSample: false },
    ],
  },

  // Q70 — Top K Frequent Elements
  {
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    description:
      'Given an integer array and an integer k, return the k most frequent elements.\n\nSort the result by frequency in descending order. If two elements have the same frequency, sort them by value in ascending order.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers\nThird line: integer k',
    outputFormat: 'A single line containing k space-separated integers — the top k frequent elements',
    constraints: '1 ≤ k ≤ number of unique elements ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    tags: ['Hash Table', 'Heap', 'Sorting'],
    sampleTestCases: [
      { input: '6\n1 1 1 2 2 3\n2', expectedOutput: '1 2', isSample: true, explanation: '1 appears 3 times, 2 appears 2 times' },
      { input: '1\n1\n1', expectedOutput: '1', isSample: true, explanation: 'Only one element' },
    ],
    hiddenTestCases: [
      { input: '4\n1 2 3 4\n4', expectedOutput: '1 2 3 4', isSample: false },
      { input: '7\n3 3 3 1 1 2 2\n2', expectedOutput: '3 1', isSample: false },
      { input: '5\n5 5 5 5 5\n1', expectedOutput: '5', isSample: false },
      { input: '8\n1 2 2 3 3 3 4 4\n3', expectedOutput: '3 2 4', isSample: false },
      { input: '6\n-1 -1 2 2 3 3\n2', expectedOutput: '-1 2', isSample: false },
    ],
  },
];

module.exports = hashingProblems;
