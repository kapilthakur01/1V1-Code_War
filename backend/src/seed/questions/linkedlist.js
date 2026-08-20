// ── LINKED LIST — 15 Questions ──
// Input convention: first line = n (number of nodes), second line = n space-separated values
// Output convention: space-separated values of the resulting list
const linkedListProblems = [
  // Q36 — Create and Traverse Linked List
  {
    title: 'Create and Traverse Linked List',
    difficulty: 'Easy',
    description:
      'Given n integers, create a singly linked list from them and traverse it. Print all the elements of the linked list separated by spaces.',
    inputFormat: 'First line: integer n (number of nodes)\nSecond line: n space-separated integers',
    outputFormat: 'A single line containing the linked list elements separated by spaces',
    constraints: '1 ≤ n ≤ 10^4\n-10^9 ≤ value ≤ 10^9',
    tags: ['Linked List'],
    sampleTestCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '1 2 3 4 5', isSample: true, explanation: 'Linked list: 1 -> 2 -> 3 -> 4 -> 5' },
      { input: '3\n10 20 30', expectedOutput: '10 20 30', isSample: true, explanation: 'Linked list: 10 -> 20 -> 30' },
    ],
    hiddenTestCases: [
      { input: '1\n42', expectedOutput: '42', isSample: false },
      { input: '4\n-1 0 1 2', expectedOutput: '-1 0 1 2', isSample: false },
      { input: '2\n100 200', expectedOutput: '100 200', isSample: false },
      { input: '6\n5 5 5 5 5 5', expectedOutput: '5 5 5 5 5 5', isSample: false },
      { input: '3\n-10 0 10', expectedOutput: '-10 0 10', isSample: false },
    ],
  },

  // Q37 — Insert Node at Beginning
  {
    title: 'Insert Node at Beginning',
    difficulty: 'Easy',
    description:
      'Given a linked list and a value, insert a new node with the given value at the beginning of the linked list. Print the resulting linked list.',
    inputFormat: 'First line: integer n (number of nodes)\nSecond line: n space-separated integers (the linked list)\nThird line: integer val (value to insert)',
    outputFormat: 'A single line containing the linked list elements after insertion, separated by spaces',
    constraints: '1 ≤ n ≤ 10^4\n-10^9 ≤ value ≤ 10^9',
    tags: ['Linked List'],
    sampleTestCases: [
      { input: '4\n1 2 3 4\n0', expectedOutput: '0 1 2 3 4', isSample: true, explanation: 'Insert 0 at beginning' },
      { input: '3\n10 20 30\n5', expectedOutput: '5 10 20 30', isSample: true, explanation: 'Insert 5 at beginning' },
    ],
    hiddenTestCases: [
      { input: '1\n1\n0', expectedOutput: '0 1', isSample: false },
      { input: '2\n2 3\n1', expectedOutput: '1 2 3', isSample: false },
      { input: '3\n-1 0 1\n-2', expectedOutput: '-2 -1 0 1', isSample: false },
      { input: '5\n1 2 3 4 5\n100', expectedOutput: '100 1 2 3 4 5', isSample: false },
      { input: '1\n5\n5', expectedOutput: '5 5', isSample: false },
    ],
  },

  // Q38 — Insert Node at End
  {
    title: 'Insert Node at End',
    difficulty: 'Easy',
    description:
      'Given a linked list and a value, insert a new node with the given value at the end of the linked list. Print the resulting linked list.',
    inputFormat: 'First line: integer n (number of nodes)\nSecond line: n space-separated integers (the linked list)\nThird line: integer val (value to insert)',
    outputFormat: 'A single line containing the linked list elements after insertion, separated by spaces',
    constraints: '1 ≤ n ≤ 10^4\n-10^9 ≤ value ≤ 10^9',
    tags: ['Linked List'],
    sampleTestCases: [
      { input: '4\n1 2 3 4\n5', expectedOutput: '1 2 3 4 5', isSample: true, explanation: 'Insert 5 at end' },
      { input: '3\n10 20 30\n40', expectedOutput: '10 20 30 40', isSample: true, explanation: 'Insert 40 at end' },
    ],
    hiddenTestCases: [
      { input: '1\n1\n2', expectedOutput: '1 2', isSample: false },
      { input: '2\n1 2\n3', expectedOutput: '1 2 3', isSample: false },
      { input: '3\n-1 0 1\n2', expectedOutput: '-1 0 1 2', isSample: false },
      { input: '5\n1 2 3 4 5\n0', expectedOutput: '1 2 3 4 5 0', isSample: false },
      { input: '1\n5\n5', expectedOutput: '5 5', isSample: false },
    ],
  },

  // Q39 — Delete a Node
  {
    title: 'Delete a Node',
    difficulty: 'Easy',
    description:
      'Given a linked list and a value, delete the first occurrence of a node with the given value. Print the resulting linked list.\n\nIf the value is not found, print the original list unchanged.\nIf the list becomes empty after deletion, print "EMPTY".',
    inputFormat: 'First line: integer n (number of nodes)\nSecond line: n space-separated integers (the linked list)\nThird line: integer val (value to delete)',
    outputFormat: 'A single line containing the linked list elements after deletion, separated by spaces. Print "EMPTY" if the list becomes empty.',
    constraints: '1 ≤ n ≤ 10^4\n-10^9 ≤ value ≤ 10^9',
    tags: ['Linked List'],
    sampleTestCases: [
      { input: '5\n1 2 3 4 5\n3', expectedOutput: '1 2 4 5', isSample: true, explanation: 'Delete node with value 3' },
      { input: '4\n10 20 30 40\n50', expectedOutput: '10 20 30 40', isSample: true, explanation: 'Value 50 not found, list unchanged' },
    ],
    hiddenTestCases: [
      { input: '1\n5\n5', expectedOutput: 'EMPTY', isSample: false },
      { input: '3\n1 2 3\n1', expectedOutput: '2 3', isSample: false },
      { input: '3\n1 2 3\n3', expectedOutput: '1 2', isSample: false },
      { input: '5\n1 1 1 1 1\n1', expectedOutput: '1 1 1 1', isSample: false },
      { input: '4\n-1 0 1 2\n0', expectedOutput: '-1 1 2', isSample: false },
    ],
  },

  // Q40 — Search in Linked List
  {
    title: 'Search in Linked List',
    difficulty: 'Easy',
    description:
      'Given a linked list and a value, search for the value in the linked list. Print the 0-based index of the first occurrence.\n\nIf the value is not found, print -1.',
    inputFormat: 'First line: integer n (number of nodes)\nSecond line: n space-separated integers (the linked list)\nThird line: integer val (value to search)',
    outputFormat: 'A single integer — the 0-based index of the first occurrence, or -1 if not found',
    constraints: '1 ≤ n ≤ 10^4\n-10^9 ≤ value ≤ 10^9',
    tags: ['Linked List'],
    sampleTestCases: [
      { input: '5\n1 2 3 4 5\n3', expectedOutput: '2', isSample: true, explanation: 'Value 3 is at index 2' },
      { input: '4\n10 20 30 40\n50', expectedOutput: '-1', isSample: true, explanation: 'Value 50 is not in the list' },
    ],
    hiddenTestCases: [
      { input: '1\n5\n5', expectedOutput: '0', isSample: false },
      { input: '3\n1 2 3\n1', expectedOutput: '0', isSample: false },
      { input: '3\n1 2 3\n3', expectedOutput: '2', isSample: false },
      { input: '5\n1 1 1 1 1\n1', expectedOutput: '0', isSample: false },
      { input: '4\n-1 0 1 2\n-1', expectedOutput: '0', isSample: false },
    ],
  },

  // Q41 — Find Length of Linked List
  {
    title: 'Find Length of Linked List',
    difficulty: 'Easy',
    description:
      'Given a linked list, find and print the number of nodes in it.',
    inputFormat: 'First line: integer n (number of nodes)\nSecond line: n space-separated integers (the linked list)',
    outputFormat: 'A single integer — the length of the linked list',
    constraints: '1 ≤ n ≤ 10^4\n-10^9 ≤ value ≤ 10^9',
    tags: ['Linked List'],
    sampleTestCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '5', isSample: true, explanation: 'The linked list has 5 nodes' },
      { input: '3\n10 20 30', expectedOutput: '3', isSample: true, explanation: 'The linked list has 3 nodes' },
    ],
    hiddenTestCases: [
      { input: '1\n42', expectedOutput: '1', isSample: false },
      { input: '2\n1 2', expectedOutput: '2', isSample: false },
      { input: '7\n1 2 3 4 5 6 7', expectedOutput: '7', isSample: false },
      { input: '4\n0 0 0 0', expectedOutput: '4', isSample: false },
      { input: '6\n-1 -2 -3 -4 -5 -6', expectedOutput: '6', isSample: false },
    ],
  },

  // Q42 — Reverse Linked List
  {
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    description:
      'Given a singly linked list, reverse it and print the reversed list.',
    inputFormat: 'First line: integer n (number of nodes)\nSecond line: n space-separated integers (the linked list)',
    outputFormat: 'A single line containing the reversed linked list elements separated by spaces',
    constraints: '1 ≤ n ≤ 10^4\n-10^9 ≤ value ≤ 10^9',
    tags: ['Linked List'],
    sampleTestCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1', isSample: true, explanation: 'Reversed list: 5 -> 4 -> 3 -> 2 -> 1' },
      { input: '3\n10 20 30', expectedOutput: '30 20 10', isSample: true, explanation: 'Reversed list: 30 -> 20 -> 10' },
    ],
    hiddenTestCases: [
      { input: '1\n42', expectedOutput: '42', isSample: false },
      { input: '2\n1 2', expectedOutput: '2 1', isSample: false },
      { input: '4\n-1 0 1 2', expectedOutput: '2 1 0 -1', isSample: false },
      { input: '6\n5 5 5 5 5 5', expectedOutput: '5 5 5 5 5 5', isSample: false },
      { input: '4\n1 3 2 4', expectedOutput: '4 2 3 1', isSample: false },
    ],
  },

  // Q43 — Find Middle of Linked List
  {
    title: 'Find Middle of Linked List',
    difficulty: 'Easy',
    description:
      'Given a singly linked list, find the middle node and print its value.\n\nIf the list has an even number of nodes, return the second middle node.',
    inputFormat: 'First line: integer n (number of nodes)\nSecond line: n space-separated integers (the linked list)',
    outputFormat: 'A single integer — the value of the middle node',
    constraints: '1 ≤ n ≤ 10^4\n-10^9 ≤ value ≤ 10^9',
    tags: ['Linked List', 'Two Pointers'],
    sampleTestCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '3', isSample: true, explanation: 'Middle node has value 3' },
      { input: '6\n1 2 3 4 5 6', expectedOutput: '4', isSample: true, explanation: 'Even length, second middle is 4' },
    ],
    hiddenTestCases: [
      { input: '1\n42', expectedOutput: '42', isSample: false },
      { input: '2\n1 2', expectedOutput: '2', isSample: false },
      { input: '3\n10 20 30', expectedOutput: '20', isSample: false },
      { input: '4\n1 2 3 4', expectedOutput: '3', isSample: false },
      { input: '7\n1 2 3 4 5 6 7', expectedOutput: '4', isSample: false },
    ],
  },

  // Q44 — Detect Cycle in Linked List
  {
    title: 'Detect Cycle in Linked List',
    difficulty: 'Medium',
    description:
      'Given a linked list, determine if it has a cycle in it.\n\nA cycle exists if some node in the list can be reached again by continuously following the next pointer.\n\nThe input provides the linked list values and a position pos. If pos is -1, there is no cycle. Otherwise, pos indicates the 0-based index of the node that the tail connects to.',
    inputFormat: 'First line: integer n (number of nodes)\nSecond line: n space-separated integers (the linked list values)\nThird line: integer pos (-1 if no cycle, otherwise the 0-based index where the tail connects)',
    outputFormat: 'Print "true" if a cycle exists, otherwise print "false"',
    constraints: '1 ≤ n ≤ 10^4\n-10^9 ≤ value ≤ 10^9\n-1 ≤ pos < n',
    tags: ['Linked List', 'Two Pointers'],
    sampleTestCases: [
      { input: '4\n3 2 0 -4\n1', expectedOutput: 'true', isSample: true, explanation: 'Tail connects to node at index 1 (value 2), forming a cycle' },
      { input: '3\n1 2 3\n-1', expectedOutput: 'false', isSample: true, explanation: 'No cycle, pos is -1' },
    ],
    hiddenTestCases: [
      { input: '1\n1\n-1', expectedOutput: 'false', isSample: false },
      { input: '1\n1\n0', expectedOutput: 'true', isSample: false },
      { input: '2\n1 2\n0', expectedOutput: 'true', isSample: false },
      { input: '2\n1 2\n-1', expectedOutput: 'false', isSample: false },
      { input: '5\n1 2 3 4 5\n2', expectedOutput: 'true', isSample: false },
    ],
  },

  // Q45 — Find Start of Cycle
  {
    title: 'Find Start of Cycle',
    difficulty: 'Medium',
    description:
      'Given a linked list that may contain a cycle, find the node where the cycle begins and print its value.\n\nIf there is no cycle, print -1.\n\nThe input provides the linked list values and a position pos. If pos is -1, there is no cycle. Otherwise, pos indicates the 0-based index of the node that the tail connects to.',
    inputFormat: 'First line: integer n (number of nodes)\nSecond line: n space-separated integers (the linked list values)\nThird line: integer pos (-1 if no cycle, otherwise the 0-based index where the tail connects)',
    outputFormat: 'A single integer — the value of the node where the cycle starts, or -1 if no cycle',
    constraints: '1 ≤ n ≤ 10^4\n-10^9 ≤ value ≤ 10^9\n-1 ≤ pos < n',
    tags: ['Linked List', 'Two Pointers'],
    sampleTestCases: [
      { input: '4\n3 2 0 -4\n1', expectedOutput: '2', isSample: true, explanation: 'Cycle starts at node with value 2 (index 1)' },
      { input: '3\n1 2 3\n-1', expectedOutput: '-1', isSample: true, explanation: 'No cycle' },
    ],
    hiddenTestCases: [
      { input: '1\n1\n0', expectedOutput: '1', isSample: false },
      { input: '1\n1\n-1', expectedOutput: '-1', isSample: false },
      { input: '3\n1 2 3\n0', expectedOutput: '1', isSample: false },
      { input: '5\n1 2 3 4 5\n2', expectedOutput: '3', isSample: false },
      { input: '4\n10 20 30 40\n3', expectedOutput: '40', isSample: false },
    ],
  },

  // Q46 — Merge Two Sorted Linked Lists
  {
    title: 'Merge Two Sorted Linked Lists',
    difficulty: 'Easy',
    description:
      'Given two sorted linked lists, merge them into a single sorted linked list. Print the resulting list.',
    inputFormat: 'First line: integer n1 (size of first list)\nSecond line: n1 space-separated sorted integers\nThird line: integer n2 (size of second list)\nFourth line: n2 space-separated sorted integers',
    outputFormat: 'A single line containing the merged sorted linked list elements separated by spaces',
    constraints: '1 ≤ n1, n2 ≤ 10^4\n-10^9 ≤ value ≤ 10^9\nBoth lists are sorted in non-decreasing order.',
    tags: ['Linked List', 'Sorting'],
    sampleTestCases: [
      { input: '3\n1 2 4\n3\n1 3 4', expectedOutput: '1 1 2 3 4 4', isSample: true, explanation: 'Merged: 1 -> 1 -> 2 -> 3 -> 4 -> 4' },
      { input: '2\n1 3\n3\n2 4 6', expectedOutput: '1 2 3 4 6', isSample: true, explanation: 'Merged: 1 -> 2 -> 3 -> 4 -> 6' },
    ],
    hiddenTestCases: [
      { input: '1\n1\n1\n2', expectedOutput: '1 2', isSample: false },
      { input: '3\n1 1 1\n3\n1 1 1', expectedOutput: '1 1 1 1 1 1', isSample: false },
      { input: '2\n-2 0\n2\n-1 1', expectedOutput: '-2 -1 0 1', isSample: false },
      { input: '4\n1 3 5 7\n3\n2 4 6', expectedOutput: '1 2 3 4 5 6 7', isSample: false },
      { input: '1\n5\n1\n5', expectedOutput: '5 5', isSample: false },
    ],
  },

  // Q47 — Remove Nth Node From End
  {
    title: 'Remove Nth Node From End',
    difficulty: 'Medium',
    description:
      'Given a linked list, remove the nth node from the end of the list and print the resulting list.\n\nThe value of n is always valid (1 ≤ n ≤ length of list).',
    inputFormat: 'First line: integer len (number of nodes)\nSecond line: len space-separated integers (the linked list)\nThird line: integer n (position from end to remove)',
    outputFormat: 'A single line containing the linked list elements after removal, separated by spaces. If the list becomes empty, print "EMPTY".',
    constraints: '1 ≤ len ≤ 10^4\n-10^9 ≤ value ≤ 10^9\n1 ≤ n ≤ len',
    tags: ['Linked List', 'Two Pointers'],
    sampleTestCases: [
      { input: '5\n1 2 3 4 5\n2', expectedOutput: '1 2 3 5', isSample: true, explanation: 'Remove 2nd from end (value 4)' },
      { input: '1\n1\n1', expectedOutput: 'EMPTY', isSample: true, explanation: 'Remove only node, list becomes empty' },
    ],
    hiddenTestCases: [
      { input: '2\n1 2\n1', expectedOutput: '1', isSample: false },
      { input: '2\n1 2\n2', expectedOutput: '2', isSample: false },
      { input: '4\n1 2 3 4\n4', expectedOutput: '2 3 4', isSample: false },
      { input: '5\n10 20 30 40 50\n3', expectedOutput: '10 20 40 50', isSample: false },
      { input: '3\n1 2 3\n1', expectedOutput: '1 2', isSample: false },
    ],
  },

  // Q48 — Check Palindrome Linked List
  {
    title: 'Check Palindrome Linked List',
    difficulty: 'Medium',
    description:
      'Given a singly linked list, determine if it is a palindrome.\n\nA linked list is a palindrome if the sequence of values reads the same forward and backward.',
    inputFormat: 'First line: integer n (number of nodes)\nSecond line: n space-separated integers (the linked list)',
    outputFormat: 'Print "true" if the linked list is a palindrome, otherwise print "false"',
    constraints: '1 ≤ n ≤ 10^4\n-10^9 ≤ value ≤ 10^9',
    tags: ['Linked List', 'Two Pointers', 'Stack'],
    sampleTestCases: [
      { input: '5\n1 2 3 2 1', expectedOutput: 'true', isSample: true, explanation: 'Reads same forwards and backwards' },
      { input: '4\n1 2 3 4', expectedOutput: 'false', isSample: true, explanation: 'Not a palindrome' },
    ],
    hiddenTestCases: [
      { input: '1\n1', expectedOutput: 'true', isSample: false },
      { input: '2\n1 1', expectedOutput: 'true', isSample: false },
      { input: '2\n1 2', expectedOutput: 'false', isSample: false },
      { input: '4\n1 2 2 1', expectedOutput: 'true', isSample: false },
      { input: '6\n1 2 3 3 2 1', expectedOutput: 'true', isSample: false },
    ],
  },

  // Q49 — Find Intersection of Two Linked Lists
  {
    title: 'Find Intersection of Two Linked Lists',
    difficulty: 'Medium',
    description:
      'Given two singly linked lists that may share a common tail (intersection), find the value of the node where the intersection begins.\n\nThe input specifies a common part (shared suffix) and two unique prefixes for each list. List 1 = prefix1 + common, List 2 = prefix2 + common.\n\nIf there is no intersection (common part is empty), print -1.',
    inputFormat: 'First line: integer c (number of common nodes, 0 if no intersection)\nIf c > 0, second line: c space-separated integers (common part values)\nNext line: integer a (number of unique prefix nodes for list 1)\nIf a > 0, next line: a space-separated integers (prefix of list 1)\nNext line: integer b (number of unique prefix nodes for list 2)\nIf b > 0, next line: b space-separated integers (prefix of list 2)',
    outputFormat: 'A single integer — the value of the first common node, or -1 if no intersection',
    constraints: '0 ≤ c ≤ 10^4\n0 ≤ a, b ≤ 10^4\n-10^9 ≤ value ≤ 10^9',
    tags: ['Linked List', 'Two Pointers'],
    sampleTestCases: [
      { input: '3\n8 4 5\n2\n4 1\n3\n5 6 1', expectedOutput: '8', isSample: true, explanation: 'List1: 4->1->8->4->5, List2: 5->6->1->8->4->5. Intersection at node 8' },
      { input: '0\n2\n1 2\n2\n3 4', expectedOutput: '-1', isSample: true, explanation: 'No intersection' },
    ],
    hiddenTestCases: [
      { input: '1\n5\n2\n1 2\n2\n3 4', expectedOutput: '5', isSample: false },
      { input: '5\n1 2 3 4 5\n0\n0', expectedOutput: '1', isSample: false },
      { input: '2\n10 20\n1\n5\n1\n15', expectedOutput: '10', isSample: false },
      { input: '0\n3\n1 2 3\n3\n4 5 6', expectedOutput: '-1', isSample: false },
      { input: '1\n100\n3\n1 2 3\n2\n4 5', expectedOutput: '100', isSample: false },
    ],
  },

  // Q50 — Reverse Linked List in Groups of K
  {
    title: 'Reverse Linked List in Groups of K',
    difficulty: 'Hard',
    description:
      'Given a linked list and an integer k, reverse the nodes of the list k at a time and print the modified list.\n\nIf the number of remaining nodes is less than k, leave them as they are.\n\nFor example, given list [1, 2, 3, 4, 5] and k = 2, the result is [2, 1, 4, 3, 5].',
    inputFormat: 'First line: integer n (number of nodes)\nSecond line: n space-separated integers (the linked list)\nThird line: integer k',
    outputFormat: 'A single line containing the modified linked list elements separated by spaces',
    constraints: '1 ≤ n ≤ 10^4\n-10^9 ≤ value ≤ 10^9\n1 ≤ k ≤ n',
    tags: ['Linked List', 'Recursion'],
    sampleTestCases: [
      { input: '5\n1 2 3 4 5\n2', expectedOutput: '2 1 4 3 5', isSample: true, explanation: 'Reverse in groups of 2: [2,1], [4,3], [5]' },
      { input: '5\n1 2 3 4 5\n3', expectedOutput: '3 2 1 4 5', isSample: true, explanation: 'Reverse in groups of 3: [3,2,1], [4,5]' },
    ],
    hiddenTestCases: [
      { input: '1\n1\n1', expectedOutput: '1', isSample: false },
      { input: '4\n1 2 3 4\n4', expectedOutput: '4 3 2 1', isSample: false },
      { input: '6\n1 2 3 4 5 6\n2', expectedOutput: '2 1 4 3 6 5', isSample: false },
      { input: '4\n1 2 3 4\n1', expectedOutput: '1 2 3 4', isSample: false },
      { input: '7\n1 2 3 4 5 6 7\n3', expectedOutput: '3 2 1 6 5 4 7', isSample: false },
    ],
  },
];

module.exports = linkedListProblems;
