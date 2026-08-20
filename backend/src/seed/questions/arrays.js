// ── ARRAYS — 20 Questions ──
const arrayProblems = [
  // Q1 — Two Sum (duplicate of existing, will be skipped)
  {
    title: 'Two Sum',
    difficulty: 'Easy',
    description:
      'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nReturn the indices in ascending order.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers\nThird line: integer target',
    outputFormat: 'Two space-separated integers — the indices of the two numbers (0-indexed, in ascending order)',
    constraints: '2 ≤ n ≤ 10^4\n-10^9 ≤ nums[i] ≤ 10^9\nExactly one valid answer exists.',
    tags: ['Array', 'Hash Table'],
    sampleTestCases: [
      { input: '4\n2 7 11 15\n9', expectedOutput: '0 1', isSample: true, explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: '3\n3 2 4\n6', expectedOutput: '1 2', isSample: true, explanation: 'nums[1] + nums[2] = 2 + 4 = 6' },
    ],
    hiddenTestCases: [
      { input: '2\n3 3\n6', expectedOutput: '0 1', isSample: false },
      { input: '5\n1 2 3 4 5\n9', expectedOutput: '3 4', isSample: false },
      { input: '4\n-1 -2 -3 -4\n-7', expectedOutput: '2 3', isSample: false },
      { input: '6\n0 4 3 0 7 1\n0', expectedOutput: '0 3', isSample: false },
      { input: '5\n1 5 3 7 2\n8', expectedOutput: '1 2', isSample: false },
    ],
  },

  // Q2 — Reverse an Array
  {
    title: 'Reverse an Array',
    difficulty: 'Easy',
    description:
      'Given an array of integers, reverse the array and print the reversed array.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers',
    outputFormat: 'A single line containing the reversed array elements separated by spaces',
    constraints: '1 ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    tags: ['Array'],
    sampleTestCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1', isSample: true, explanation: 'The array reversed is [5, 4, 3, 2, 1]' },
      { input: '3\n10 20 30', expectedOutput: '30 20 10', isSample: true, explanation: 'The array reversed is [30, 20, 10]' },
    ],
    hiddenTestCases: [
      { input: '1\n42', expectedOutput: '42', isSample: false },
      { input: '2\n1 2', expectedOutput: '2 1', isSample: false },
      { input: '6\n-1 0 1 -2 0 2', expectedOutput: '2 0 -2 1 0 -1', isSample: false },
      { input: '4\n5 5 5 5', expectedOutput: '5 5 5 5', isSample: false },
      { input: '7\n1 2 3 4 5 6 7', expectedOutput: '7 6 5 4 3 2 1', isSample: false },
    ],
  },

  // Q3 — Find Maximum Element
  {
    title: 'Find Maximum Element',
    difficulty: 'Easy',
    description:
      'Given an array of integers, find and print the maximum element in the array.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers',
    outputFormat: 'A single integer — the maximum element',
    constraints: '1 ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    tags: ['Array'],
    sampleTestCases: [
      { input: '5\n3 1 4 1 5', expectedOutput: '5', isSample: true, explanation: 'The maximum element is 5' },
      { input: '3\n-1 -2 -3', expectedOutput: '-1', isSample: true, explanation: 'Among negatives, -1 is the largest' },
    ],
    hiddenTestCases: [
      { input: '1\n42', expectedOutput: '42', isSample: false },
      { input: '4\n7 7 7 7', expectedOutput: '7', isSample: false },
      { input: '5\n-10 -20 -5 -30 -1', expectedOutput: '-1', isSample: false },
      { input: '6\n1 2 3 4 5 6', expectedOutput: '6', isSample: false },
      { input: '3\n100 50 100', expectedOutput: '100', isSample: false },
    ],
  },

  // Q4 — Find Minimum Element
  {
    title: 'Find Minimum Element',
    difficulty: 'Easy',
    description:
      'Given an array of integers, find and print the minimum element in the array.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers',
    outputFormat: 'A single integer — the minimum element',
    constraints: '1 ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    tags: ['Array'],
    sampleTestCases: [
      { input: '5\n3 1 4 1 5', expectedOutput: '1', isSample: true, explanation: 'The minimum element is 1' },
      { input: '3\n-1 -2 -3', expectedOutput: '-3', isSample: true, explanation: 'The minimum element is -3' },
    ],
    hiddenTestCases: [
      { input: '1\n42', expectedOutput: '42', isSample: false },
      { input: '4\n7 7 7 7', expectedOutput: '7', isSample: false },
      { input: '5\n-10 -20 -5 -30 -1', expectedOutput: '-30', isSample: false },
      { input: '6\n6 5 4 3 2 1', expectedOutput: '1', isSample: false },
      { input: '3\n0 -1 1', expectedOutput: '-1', isSample: false },
    ],
  },

  // Q5 — Find Second Largest Element
  {
    title: 'Find Second Largest Element',
    difficulty: 'Easy',
    description:
      'Given an array of integers, find the second largest distinct element. If no second largest element exists (all elements are the same or array has only one element), print -1.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers',
    outputFormat: 'A single integer — the second largest distinct element, or -1 if it does not exist',
    constraints: '1 ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    tags: ['Array'],
    sampleTestCases: [
      { input: '5\n12 35 1 10 34', expectedOutput: '34', isSample: true, explanation: 'Largest is 35, second largest is 34' },
      { input: '3\n10 10 10', expectedOutput: '-1', isSample: true, explanation: 'All elements are same, no second largest' },
    ],
    hiddenTestCases: [
      { input: '1\n5', expectedOutput: '-1', isSample: false },
      { input: '2\n5 10', expectedOutput: '5', isSample: false },
      { input: '4\n1 2 2 3', expectedOutput: '2', isSample: false },
      { input: '5\n-1 -2 -3 -4 -5', expectedOutput: '-2', isSample: false },
      { input: '6\n5 5 4 4 3 3', expectedOutput: '4', isSample: false },
    ],
  },

  // Q6 — Check if Array is Sorted
  {
    title: 'Check if Array is Sorted',
    difficulty: 'Easy',
    description:
      'Given an array of integers, check whether the array is sorted in non-decreasing order.\n\nPrint "true" if the array is sorted in non-decreasing order, otherwise print "false".',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers',
    outputFormat: 'Print "true" or "false"',
    constraints: '1 ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    tags: ['Array'],
    sampleTestCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: 'true', isSample: true, explanation: 'Array is in non-decreasing order' },
      { input: '4\n1 3 2 4', expectedOutput: 'false', isSample: true, explanation: '3 > 2, so not sorted' },
    ],
    hiddenTestCases: [
      { input: '1\n5', expectedOutput: 'true', isSample: false },
      { input: '3\n1 1 1', expectedOutput: 'true', isSample: false },
      { input: '5\n5 4 3 2 1', expectedOutput: 'false', isSample: false },
      { input: '4\n1 2 2 3', expectedOutput: 'true', isSample: false },
      { input: '3\n1 2 1', expectedOutput: 'false', isSample: false },
    ],
  },

  // Q7 — Remove Duplicates from Sorted Array
  {
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    description:
      'Given a sorted array of integers, remove the duplicates and print the resulting array containing only unique elements.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated sorted integers',
    outputFormat: 'A single line containing the unique elements separated by spaces',
    constraints: '1 ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9\nArray is sorted in non-decreasing order.',
    tags: ['Array', 'Two Pointers'],
    sampleTestCases: [
      { input: '7\n1 1 2 2 3 4 4', expectedOutput: '1 2 3 4', isSample: true, explanation: 'After removing duplicates: [1, 2, 3, 4]' },
      { input: '5\n1 2 3 4 5', expectedOutput: '1 2 3 4 5', isSample: true, explanation: 'No duplicates to remove' },
    ],
    hiddenTestCases: [
      { input: '1\n5', expectedOutput: '5', isSample: false },
      { input: '3\n1 1 1', expectedOutput: '1', isSample: false },
      { input: '6\n-3 -3 -1 0 0 2', expectedOutput: '-3 -1 0 2', isSample: false },
      { input: '8\n1 1 2 3 3 3 4 5', expectedOutput: '1 2 3 4 5', isSample: false },
      { input: '2\n5 5', expectedOutput: '5', isSample: false },
    ],
  },

  // Q8 — Move All Zeros to End
  {
    title: 'Move All Zeros to End',
    difficulty: 'Easy',
    description:
      'Given an array of integers, move all zeros to the end of the array while maintaining the relative order of the non-zero elements.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers',
    outputFormat: 'A single line containing the modified array elements separated by spaces',
    constraints: '1 ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    tags: ['Array', 'Two Pointers'],
    sampleTestCases: [
      { input: '5\n0 1 0 3 12', expectedOutput: '1 3 12 0 0', isSample: true, explanation: 'Non-zero elements [1, 3, 12] maintain order, zeros moved to end' },
      { input: '1\n0', expectedOutput: '0', isSample: true, explanation: 'Single zero remains' },
    ],
    hiddenTestCases: [
      { input: '4\n1 2 3 4', expectedOutput: '1 2 3 4', isSample: false },
      { input: '3\n0 0 0', expectedOutput: '0 0 0', isSample: false },
      { input: '6\n0 1 0 2 0 3', expectedOutput: '1 2 3 0 0 0', isSample: false },
      { input: '5\n1 0 0 0 2', expectedOutput: '1 2 0 0 0', isSample: false },
      { input: '2\n0 1', expectedOutput: '1 0', isSample: false },
    ],
  },

  // Q9 — Find Missing Number
  {
    title: 'Find Missing Number',
    difficulty: 'Easy',
    description:
      'Given an array containing n distinct numbers from the range [0, n], find the one number that is missing from the array.',
    inputFormat: 'First line: integer n\nSecond line: n space-separated distinct integers from the range [0, n]',
    outputFormat: 'A single integer — the missing number',
    constraints: '1 ≤ n ≤ 10^5\n0 ≤ arr[i] ≤ n\nAll elements are distinct.',
    tags: ['Array', 'Math', 'Bit Manipulation'],
    sampleTestCases: [
      { input: '3\n3 0 1', expectedOutput: '2', isSample: true, explanation: 'Range is [0, 3], missing number is 2' },
      { input: '2\n0 1', expectedOutput: '2', isSample: true, explanation: 'Range is [0, 2], missing number is 2' },
    ],
    hiddenTestCases: [
      { input: '1\n0', expectedOutput: '1', isSample: false },
      { input: '1\n1', expectedOutput: '0', isSample: false },
      { input: '4\n0 1 3 4', expectedOutput: '2', isSample: false },
      { input: '5\n5 3 0 1 2', expectedOutput: '4', isSample: false },
      { input: '3\n1 2 3', expectedOutput: '0', isSample: false },
    ],
  },

  // Q10 — Find Duplicate Number
  {
    title: 'Find Duplicate Number',
    difficulty: 'Medium',
    description:
      'Given an array of n + 1 integers where each integer is in the range [1, n] inclusive, there is exactly one repeated number. Find and return this duplicate number.\n\nYou must not modify the array and should use only constant extra space.',
    inputFormat: 'First line: integer m (size of array, which is n + 1)\nSecond line: m space-separated integers',
    outputFormat: 'A single integer — the duplicate number',
    constraints: '2 ≤ m ≤ 10^5\n1 ≤ arr[i] ≤ m - 1\nExactly one duplicate exists.',
    tags: ['Array', 'Two Pointers', 'Binary Search'],
    sampleTestCases: [
      { input: '5\n1 3 4 2 2', expectedOutput: '2', isSample: true, explanation: '2 appears twice' },
      { input: '5\n3 1 3 4 2', expectedOutput: '3', isSample: true, explanation: '3 appears twice' },
    ],
    hiddenTestCases: [
      { input: '2\n1 1', expectedOutput: '1', isSample: false },
      { input: '4\n1 2 3 1', expectedOutput: '1', isSample: false },
      { input: '6\n1 2 3 4 5 3', expectedOutput: '3', isSample: false },
      { input: '3\n2 2 2', expectedOutput: '2', isSample: false },
      { input: '7\n1 2 3 4 5 6 4', expectedOutput: '4', isSample: false },
    ],
  },

  // Q11 — Majority Element
  {
    title: 'Majority Element',
    difficulty: 'Easy',
    description:
      'Given an array of integers, find the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times.\n\nYou may assume that the majority element always exists in the array.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers',
    outputFormat: 'A single integer — the majority element',
    constraints: '1 ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9\nMajority element is guaranteed to exist.',
    tags: ['Array', 'Hash Table', 'Sorting'],
    sampleTestCases: [
      { input: '3\n3 2 3', expectedOutput: '3', isSample: true, explanation: '3 appears 2 times which is more than 3/2 = 1' },
      { input: '7\n2 2 1 1 1 2 2', expectedOutput: '2', isSample: true, explanation: '2 appears 4 times which is more than 7/2 = 3' },
    ],
    hiddenTestCases: [
      { input: '1\n5', expectedOutput: '5', isSample: false },
      { input: '5\n1 1 1 2 3', expectedOutput: '1', isSample: false },
      { input: '9\n5 5 5 5 5 1 2 3 4', expectedOutput: '5', isSample: false },
      { input: '3\n-1 -1 2', expectedOutput: '-1', isSample: false },
      { input: '5\n7 7 7 7 1', expectedOutput: '7', isSample: false },
    ],
  },

  // Q12 — Maximum Subarray Sum
  {
    title: 'Maximum Subarray Sum',
    difficulty: 'Medium',
    description:
      'Given an integer array, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\nUse Kadane\'s algorithm for an efficient solution.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers',
    outputFormat: 'A single integer — the maximum subarray sum',
    constraints: '1 ≤ n ≤ 10^5\n-10^4 ≤ arr[i] ≤ 10^4',
    tags: ['Array', 'Dynamic Programming', "Kadane's Algorithm"],
    sampleTestCases: [
      { input: '8\n-2 -3 4 -1 -2 1 5 -3', expectedOutput: '7', isSample: true, explanation: 'Subarray [4, -1, -2, 1, 5] has sum 7' },
      { input: '5\n1 2 3 -2 5', expectedOutput: '9', isSample: true, explanation: 'Subarray [1, 2, 3, -2, 5] has sum 9' },
    ],
    hiddenTestCases: [
      { input: '1\n-5', expectedOutput: '-5', isSample: false },
      { input: '3\n-1 -2 -3', expectedOutput: '-1', isSample: false },
      { input: '6\n2 3 -1 4 -6 7', expectedOutput: '9', isSample: false },
      { input: '4\n5 -2 3 -1', expectedOutput: '6', isSample: false },
      { input: '5\n-1 2 3 -4 5', expectedOutput: '6', isSample: false },
    ],
  },

  // Q13 — Rotate Array by K
  {
    title: 'Rotate Array by K',
    difficulty: 'Medium',
    description:
      'Given an array of integers and an integer k, rotate the array to the right by k steps.\n\nFor example, with k = 3, the array [1,2,3,4,5,6,7] becomes [5,6,7,1,2,3,4].',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers\nThird line: integer k',
    outputFormat: 'A single line containing the rotated array elements separated by spaces',
    constraints: '1 ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9\n0 ≤ k ≤ 10^9',
    tags: ['Array'],
    sampleTestCases: [
      { input: '7\n1 2 3 4 5 6 7\n3', expectedOutput: '5 6 7 1 2 3 4', isSample: true, explanation: 'Rotate right 3: last 3 elements [5,6,7] move to front' },
      { input: '4\n-1 -100 3 99\n2', expectedOutput: '3 99 -1 -100', isSample: true, explanation: 'Rotate right 2: [3, 99, -1, -100]' },
    ],
    hiddenTestCases: [
      { input: '1\n1\n0', expectedOutput: '1', isSample: false },
      { input: '3\n1 2 3\n3', expectedOutput: '1 2 3', isSample: false },
      { input: '5\n1 2 3 4 5\n7', expectedOutput: '4 5 1 2 3', isSample: false },
      { input: '2\n1 2\n1', expectedOutput: '2 1', isSample: false },
      { input: '6\n10 20 30 40 50 60\n4', expectedOutput: '30 40 50 60 10 20', isSample: false },
    ],
  },

  // Q14 — Merge Two Sorted Arrays
  {
    title: 'Merge Two Sorted Arrays',
    difficulty: 'Easy',
    description:
      'Given two sorted arrays of integers, merge them into a single sorted array and print the result.',
    inputFormat: 'First line: integer n (size of first array)\nSecond line: n space-separated sorted integers\nThird line: integer m (size of second array)\nFourth line: m space-separated sorted integers',
    outputFormat: 'A single line containing the merged sorted array elements separated by spaces',
    constraints: '1 ≤ n, m ≤ 10^4\n-10^9 ≤ arr[i] ≤ 10^9\nBoth arrays are sorted in non-decreasing order.',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    sampleTestCases: [
      { input: '3\n1 3 5\n3\n2 4 6', expectedOutput: '1 2 3 4 5 6', isSample: true, explanation: 'Merged: [1, 2, 3, 4, 5, 6]' },
      { input: '4\n1 2 3 4\n2\n5 6', expectedOutput: '1 2 3 4 5 6', isSample: true, explanation: 'Second array entirely after first' },
    ],
    hiddenTestCases: [
      { input: '1\n1\n1\n2', expectedOutput: '1 2', isSample: false },
      { input: '3\n1 1 1\n2\n1 1', expectedOutput: '1 1 1 1 1', isSample: false },
      { input: '3\n-3 -1 0\n3\n-2 0 2', expectedOutput: '-3 -2 -1 0 0 2', isSample: false },
      { input: '4\n1 2 3 4\n1\n0', expectedOutput: '0 1 2 3 4', isSample: false },
      { input: '2\n5 10\n3\n1 7 12', expectedOutput: '1 5 7 10 12', isSample: false },
    ],
  },

  // Q15 — Intersection of Two Arrays
  {
    title: 'Intersection of Two Arrays',
    difficulty: 'Medium',
    description:
      'Given two integer arrays, find their intersection. Each element in the result must be unique and the result should be sorted in ascending order.\n\nIf there is no intersection, print -1.',
    inputFormat: 'First line: integer n (size of first array)\nSecond line: n space-separated integers\nThird line: integer m (size of second array)\nFourth line: m space-separated integers',
    outputFormat: 'A single line containing the unique intersection elements sorted in ascending order, or -1 if no intersection exists',
    constraints: '1 ≤ n, m ≤ 10^4\n0 ≤ arr[i] ≤ 10^9',
    tags: ['Array', 'Hash Table', 'Sorting'],
    sampleTestCases: [
      { input: '4\n1 2 2 1\n2\n2 2', expectedOutput: '2', isSample: true, explanation: 'Only 2 is common to both' },
      { input: '4\n4 9 5 9\n3\n9 4 9', expectedOutput: '4 9', isSample: true, explanation: 'Common elements are 4 and 9' },
    ],
    hiddenTestCases: [
      { input: '3\n1 2 3\n3\n4 5 6', expectedOutput: '-1', isSample: false },
      { input: '1\n5\n1\n5', expectedOutput: '5', isSample: false },
      { input: '5\n1 2 3 4 5\n5\n3 4 5 6 7', expectedOutput: '3 4 5', isSample: false },
      { input: '4\n1 1 1 1\n3\n1 1 1', expectedOutput: '1', isSample: false },
      { input: '3\n0 2 4\n4\n1 2 3 4', expectedOutput: '2 4', isSample: false },
    ],
  },

  // Q16 — Union of Two Arrays
  {
    title: 'Union of Two Arrays',
    difficulty: 'Medium',
    description:
      'Given two integer arrays, find their union. Each element in the result must appear only once and the result should be sorted in ascending order.',
    inputFormat: 'First line: integer n (size of first array)\nSecond line: n space-separated integers\nThird line: integer m (size of second array)\nFourth line: m space-separated integers',
    outputFormat: 'A single line containing the unique union elements sorted in ascending order',
    constraints: '1 ≤ n, m ≤ 10^4\n-10^9 ≤ arr[i] ≤ 10^9',
    tags: ['Array', 'Hash Table', 'Sorting'],
    sampleTestCases: [
      { input: '5\n1 2 3 4 5\n3\n1 2 3', expectedOutput: '1 2 3 4 5', isSample: true, explanation: 'Union of both arrays with unique elements' },
      { input: '3\n1 2 3\n3\n4 5 6', expectedOutput: '1 2 3 4 5 6', isSample: true, explanation: 'No overlap, union is all elements' },
    ],
    hiddenTestCases: [
      { input: '1\n5\n1\n5', expectedOutput: '5', isSample: false },
      { input: '3\n1 1 1\n3\n2 2 2', expectedOutput: '1 2', isSample: false },
      { input: '4\n-2 0 2 4\n3\n-1 1 3', expectedOutput: '-2 -1 0 1 2 3 4', isSample: false },
      { input: '3\n10 20 30\n1\n20', expectedOutput: '10 20 30', isSample: false },
      { input: '2\n1 2\n2\n3 4', expectedOutput: '1 2 3 4', isSample: false },
    ],
  },

  // Q17 — Best Time to Buy and Sell Stock
  {
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    description:
      'You are given an array where the i-th element is the price of a given stock on day i.\n\nYou want to maximize your profit by choosing a single day to buy and a single day in the future to sell.\n\nReturn the maximum profit you can achieve. If no profit is possible, return 0.',
    inputFormat: 'First line: integer n (number of days)\nSecond line: n space-separated integers representing prices',
    outputFormat: 'A single integer — the maximum profit',
    constraints: '1 ≤ n ≤ 10^5\n0 ≤ prices[i] ≤ 10^4',
    tags: ['Array', 'Greedy'],
    sampleTestCases: [
      { input: '6\n7 1 5 3 6 4', expectedOutput: '5', isSample: true, explanation: 'Buy at price 1 (day 2), sell at price 6 (day 5), profit = 5' },
      { input: '5\n7 6 4 3 1', expectedOutput: '0', isSample: true, explanation: 'Prices only decrease, no profit possible' },
    ],
    hiddenTestCases: [
      { input: '1\n5', expectedOutput: '0', isSample: false },
      { input: '2\n1 5', expectedOutput: '4', isSample: false },
      { input: '2\n5 1', expectedOutput: '0', isSample: false },
      { input: '6\n3 3 3 3 3 3', expectedOutput: '0', isSample: false },
      { input: '5\n2 4 1 7 5', expectedOutput: '6', isSample: false },
    ],
  },

  // Q18 — Longest Consecutive Sequence
  {
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    description:
      'Given an unsorted array of integers, find the length of the longest consecutive elements sequence.\n\nFor example, given [100, 4, 200, 1, 3, 2], the longest consecutive sequence is [1, 2, 3, 4], which has length 4.\n\nYour algorithm should run in O(n) time.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers',
    outputFormat: 'A single integer — the length of the longest consecutive sequence',
    constraints: '1 ≤ n ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    tags: ['Array', 'Hash Table'],
    sampleTestCases: [
      { input: '6\n100 4 200 1 3 2', expectedOutput: '4', isSample: true, explanation: 'Longest consecutive sequence is [1, 2, 3, 4]' },
      { input: '1\n0', expectedOutput: '1', isSample: true, explanation: 'Only one element' },
    ],
    hiddenTestCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '5', isSample: false },
      { input: '8\n10 5 12 3 55 30 2 4', expectedOutput: '4', isSample: false },
      { input: '6\n1 9 3 10 4 20', expectedOutput: '2', isSample: false },
      { input: '7\n0 -1 1 -2 2 -3 3', expectedOutput: '7', isSample: false },
      { input: '5\n5 5 5 5 5', expectedOutput: '1', isSample: false },
    ],
  },

  // Q19 — Product of Array Except Self
  {
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    description:
      'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\n\nYou must solve it without using division and in O(n) time.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers',
    outputFormat: 'A single line containing n space-separated integers — the product array',
    constraints: '2 ≤ n ≤ 10^5\n-30 ≤ nums[i] ≤ 30\nThe product of any prefix or suffix fits in a 32-bit integer.',
    tags: ['Array', 'Prefix Sum'],
    sampleTestCases: [
      { input: '4\n1 2 3 4', expectedOutput: '24 12 8 6', isSample: true, explanation: 'Products: [2*3*4, 1*3*4, 1*2*4, 1*2*3]' },
      { input: '5\n-1 1 0 -3 3', expectedOutput: '0 0 9 0 0', isSample: true, explanation: 'Zero makes most products 0; product excluding 0 is (-1)*1*(-3)*3 = 9' },
    ],
    hiddenTestCases: [
      { input: '2\n2 3', expectedOutput: '3 2', isSample: false },
      { input: '4\n1 1 1 1', expectedOutput: '1 1 1 1', isSample: false },
      { input: '3\n0 0 1', expectedOutput: '0 0 0', isSample: false },
      { input: '5\n2 3 4 5 6', expectedOutput: '360 240 180 144 120', isSample: false },
      { input: '4\n-1 -2 -3 -4', expectedOutput: '-24 -12 -8 -6', isSample: false },
    ],
  },

  // Q20 — Sort 0s, 1s and 2s
  {
    title: 'Sort 0s, 1s and 2s',
    difficulty: 'Easy',
    description:
      'Given an array consisting of only 0s, 1s, and 2s, sort the array in-place.\n\nUse the Dutch National Flag algorithm to solve this in a single pass with O(1) extra space.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated integers (each 0, 1, or 2)',
    outputFormat: 'A single line containing the sorted array elements separated by spaces',
    constraints: '1 ≤ n ≤ 10^5\narr[i] ∈ {0, 1, 2}',
    tags: ['Array', 'Sorting', 'Two Pointers'],
    sampleTestCases: [
      { input: '6\n2 0 2 1 1 0', expectedOutput: '0 0 1 1 2 2', isSample: true, explanation: 'Sorted: all 0s, then 1s, then 2s' },
      { input: '5\n0 1 2 0 1', expectedOutput: '0 0 1 1 2', isSample: true, explanation: 'Sorted array' },
    ],
    hiddenTestCases: [
      { input: '1\n0', expectedOutput: '0', isSample: false },
      { input: '3\n2 2 2', expectedOutput: '2 2 2', isSample: false },
      { input: '6\n0 0 0 0 0 0', expectedOutput: '0 0 0 0 0 0', isSample: false },
      { input: '8\n2 1 0 2 1 0 2 1', expectedOutput: '0 0 1 1 1 2 2 2', isSample: false },
      { input: '4\n1 0 2 1', expectedOutput: '0 1 1 2', isSample: false },
    ],
  },
];

module.exports = arrayProblems;
