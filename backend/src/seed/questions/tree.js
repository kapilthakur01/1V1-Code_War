// ── BINARY TREE AND BST — 15 Questions ──
// Input convention: level-order traversal with -1 for null nodes
// Example: "1 2 3 -1 -1 4 5" means root=1, left=2 (no children), right=3 (left=4, right=5)
const treeProblems = [
  // Q71 — Inorder Traversal
  {
    title: 'Inorder Traversal',
    difficulty: 'Easy',
    description:
      'Given a binary tree represented in level-order format, perform an inorder traversal (Left, Root, Right) and print the values.\n\nThe tree is given as space-separated integers in level-order. Use -1 to represent null nodes.',
    inputFormat: 'A single line of space-separated integers representing the binary tree in level-order. -1 denotes a null node.',
    outputFormat: 'A single line containing the inorder traversal values separated by spaces',
    constraints: '1 ≤ number of nodes ≤ 10^4\n-10^9 ≤ node value ≤ 10^9\nNode values will not be -1.',
    tags: ['Binary Tree', 'Recursion'],
    sampleTestCases: [
      { input: '1 2 3 4 5', expectedOutput: '4 2 5 1 3', isSample: true, explanation: 'Inorder: left subtree (4,2,5), root (1), right subtree (3)' },
      { input: '1 -1 2 -1 3', expectedOutput: '1 2 3', isSample: true, explanation: 'Right-skewed tree, inorder is 1, 2, 3' },
    ],
    hiddenTestCases: [
      { input: '1', expectedOutput: '1', isSample: false },
      { input: '1 2 3', expectedOutput: '2 1 3', isSample: false },
      { input: '5 3 7 2 4 6 8', expectedOutput: '2 3 4 5 6 7 8', isSample: false },
      { input: '1 2 -1 3 -1', expectedOutput: '3 2 1', isSample: false },
      { input: '10 5 15 3 7 12 20', expectedOutput: '3 5 7 10 12 15 20', isSample: false },
    ],
  },

  // Q72 — Preorder Traversal
  {
    title: 'Preorder Traversal',
    difficulty: 'Easy',
    description:
      'Given a binary tree represented in level-order format, perform a preorder traversal (Root, Left, Right) and print the values.\n\nThe tree is given as space-separated integers in level-order. Use -1 to represent null nodes.',
    inputFormat: 'A single line of space-separated integers representing the binary tree in level-order. -1 denotes a null node.',
    outputFormat: 'A single line containing the preorder traversal values separated by spaces',
    constraints: '1 ≤ number of nodes ≤ 10^4\n-10^9 ≤ node value ≤ 10^9\nNode values will not be -1.',
    tags: ['Binary Tree', 'Recursion'],
    sampleTestCases: [
      { input: '1 2 3 4 5', expectedOutput: '1 2 4 5 3', isSample: true, explanation: 'Preorder: root (1), left subtree (2,4,5), right subtree (3)' },
      { input: '1 -1 2 -1 3', expectedOutput: '1 2 3', isSample: true, explanation: 'Right-skewed tree' },
    ],
    hiddenTestCases: [
      { input: '1', expectedOutput: '1', isSample: false },
      { input: '1 2 3', expectedOutput: '1 2 3', isSample: false },
      { input: '5 3 7 2 4 6 8', expectedOutput: '5 3 2 4 7 6 8', isSample: false },
      { input: '1 2 -1 3 -1', expectedOutput: '1 2 3', isSample: false },
      { input: '10 5 15 3 7 12 20', expectedOutput: '10 5 3 7 15 12 20', isSample: false },
    ],
  },

  // Q73 — Postorder Traversal
  {
    title: 'Postorder Traversal',
    difficulty: 'Easy',
    description:
      'Given a binary tree represented in level-order format, perform a postorder traversal (Left, Right, Root) and print the values.\n\nThe tree is given as space-separated integers in level-order. Use -1 to represent null nodes.',
    inputFormat: 'A single line of space-separated integers representing the binary tree in level-order. -1 denotes a null node.',
    outputFormat: 'A single line containing the postorder traversal values separated by spaces',
    constraints: '1 ≤ number of nodes ≤ 10^4\n-10^9 ≤ node value ≤ 10^9\nNode values will not be -1.',
    tags: ['Binary Tree', 'Recursion'],
    sampleTestCases: [
      { input: '1 2 3 4 5', expectedOutput: '4 5 2 3 1', isSample: true, explanation: 'Postorder: left subtree (4,5,2), right subtree (3), root (1)' },
      { input: '1 -1 2 -1 3', expectedOutput: '3 2 1', isSample: true, explanation: 'Right-skewed tree' },
    ],
    hiddenTestCases: [
      { input: '1', expectedOutput: '1', isSample: false },
      { input: '1 2 3', expectedOutput: '2 3 1', isSample: false },
      { input: '5 3 7 2 4 6 8', expectedOutput: '2 4 3 6 8 7 5', isSample: false },
      { input: '1 2 -1 3 -1', expectedOutput: '3 2 1', isSample: false },
      { input: '10 5 15 3 7 12 20', expectedOutput: '3 7 5 12 20 15 10', isSample: false },
    ],
  },

  // Q74 — Level Order Traversal
  {
    title: 'Level Order Traversal',
    difficulty: 'Easy',
    description:
      'Given a binary tree represented in level-order format, perform a level-order traversal (BFS) and print the node values level by level.\n\nPrint each level on a separate line with values separated by spaces.',
    inputFormat: 'A single line of space-separated integers representing the binary tree in level-order. -1 denotes a null node.',
    outputFormat: 'Each line contains the node values of one level, separated by spaces',
    constraints: '1 ≤ number of nodes ≤ 10^4\n-10^9 ≤ node value ≤ 10^9\nNode values will not be -1.',
    tags: ['Binary Tree', 'BFS'],
    sampleTestCases: [
      { input: '3 9 20 -1 -1 15 7', expectedOutput: '3\n9 20\n15 7', isSample: true, explanation: 'Level 0: [3], Level 1: [9, 20], Level 2: [15, 7]' },
      { input: '1', expectedOutput: '1', isSample: true, explanation: 'Single node' },
    ],
    hiddenTestCases: [
      { input: '1 2 3', expectedOutput: '1\n2 3', isSample: false },
      { input: '1 2 3 4 5 6 7', expectedOutput: '1\n2 3\n4 5 6 7', isSample: false },
      { input: '1 2 -1 3 -1', expectedOutput: '1\n2\n3', isSample: false },
      { input: '1 -1 2 -1 3', expectedOutput: '1\n2\n3', isSample: false },
      { input: '5 3 8 1 4 7 9', expectedOutput: '5\n3 8\n1 4 7 9', isSample: false },
    ],
  },

  // Q75 — Maximum Depth of Binary Tree
  {
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    description:
      'Given a binary tree, find its maximum depth.\n\nThe maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
    inputFormat: 'A single line of space-separated integers representing the binary tree in level-order. -1 denotes a null node.',
    outputFormat: 'A single integer — the maximum depth of the tree',
    constraints: '1 ≤ number of nodes ≤ 10^4\n-10^9 ≤ node value ≤ 10^9\nNode values will not be -1.',
    tags: ['Binary Tree', 'Recursion', 'DFS'],
    sampleTestCases: [
      { input: '3 9 20 -1 -1 15 7', expectedOutput: '3', isSample: true, explanation: 'Depth: root(3) → 20 → 15 or 7, depth = 3' },
      { input: '1', expectedOutput: '1', isSample: true, explanation: 'Single node has depth 1' },
    ],
    hiddenTestCases: [
      { input: '1 2 3', expectedOutput: '2', isSample: false },
      { input: '1 2 -1 3 -1', expectedOutput: '3', isSample: false },
      { input: '1 2 3 4 5 6 7', expectedOutput: '3', isSample: false },
      { input: '1 -1 2 -1 3 -1 4', expectedOutput: '4', isSample: false },
      { input: '5 3 8 1 4 7 9', expectedOutput: '3', isSample: false },
    ],
  },

  // Q76 — Count Leaf Nodes
  {
    title: 'Count Leaf Nodes',
    difficulty: 'Easy',
    description:
      'Given a binary tree, count the number of leaf nodes.\n\nA leaf node is a node with no children (both left and right children are null).',
    inputFormat: 'A single line of space-separated integers representing the binary tree in level-order. -1 denotes a null node.',
    outputFormat: 'A single integer — the number of leaf nodes',
    constraints: '1 ≤ number of nodes ≤ 10^4\n-10^9 ≤ node value ≤ 10^9\nNode values will not be -1.',
    tags: ['Binary Tree', 'Recursion'],
    sampleTestCases: [
      { input: '1 2 3 4 5', expectedOutput: '3', isSample: true, explanation: 'Leaf nodes: 4, 5, 3' },
      { input: '1', expectedOutput: '1', isSample: true, explanation: 'Single node is a leaf' },
    ],
    hiddenTestCases: [
      { input: '1 2 3', expectedOutput: '2', isSample: false },
      { input: '1 2 3 4 5 6 7', expectedOutput: '4', isSample: false },
      { input: '1 2 -1 3 -1', expectedOutput: '1', isSample: false },
      { input: '1 -1 2 -1 3', expectedOutput: '1', isSample: false },
      { input: '5 3 8 1 4 7 9', expectedOutput: '4', isSample: false },
    ],
  },

  // Q77 — Sum of All Nodes
  {
    title: 'Sum of All Nodes',
    difficulty: 'Easy',
    description:
      'Given a binary tree, find the sum of all node values.',
    inputFormat: 'A single line of space-separated integers representing the binary tree in level-order. -1 denotes a null node.',
    outputFormat: 'A single integer — the sum of all node values',
    constraints: '1 ≤ number of nodes ≤ 10^4\n-10^9 ≤ node value ≤ 10^9\nNode values will not be -1.',
    tags: ['Binary Tree', 'Recursion'],
    sampleTestCases: [
      { input: '1 2 3 4 5', expectedOutput: '15', isSample: true, explanation: '1 + 2 + 3 + 4 + 5 = 15' },
      { input: '10', expectedOutput: '10', isSample: true, explanation: 'Single node' },
    ],
    hiddenTestCases: [
      { input: '1 2 3', expectedOutput: '6', isSample: false },
      { input: '5 3 7 2 4 6 8', expectedOutput: '35', isSample: false },
      { input: '0 0 0', expectedOutput: '0', isSample: false },
      { input: '1 -1 2 -1 3', expectedOutput: '6', isSample: false },
      { input: '100 50 150 25 75', expectedOutput: '400', isSample: false },
    ],
  },

  // Q78 — Mirror Binary Tree
  {
    title: 'Mirror Binary Tree',
    difficulty: 'Medium',
    description:
      'Given a binary tree, convert it to its mirror image (swap left and right children of every node).\n\nPrint the inorder traversal of the mirrored tree.\n\nNote: The inorder traversal of the mirrored tree is the reverse of the inorder traversal of the original tree.',
    inputFormat: 'A single line of space-separated integers representing the binary tree in level-order. -1 denotes a null node.',
    outputFormat: 'A single line containing the inorder traversal of the mirrored tree, values separated by spaces',
    constraints: '1 ≤ number of nodes ≤ 10^4\n-10^9 ≤ node value ≤ 10^9\nNode values will not be -1.',
    tags: ['Binary Tree', 'Recursion'],
    sampleTestCases: [
      { input: '1 2 3 4 5', expectedOutput: '3 1 5 2 4', isSample: true, explanation: 'Original inorder: 4 2 5 1 3. Mirrored inorder (reversed): 3 1 5 2 4' },
      { input: '1', expectedOutput: '1', isSample: true, explanation: 'Single node, mirror is itself' },
    ],
    hiddenTestCases: [
      { input: '1 2 3', expectedOutput: '3 1 2', isSample: false },
      { input: '5 3 7 2 4 6 8', expectedOutput: '8 7 6 5 4 3 2', isSample: false },
      { input: '1 2 -1', expectedOutput: '1 2', isSample: false },
      { input: '1 -1 2', expectedOutput: '2 1', isSample: false },
      { input: '4 2 6 1 3 5 7', expectedOutput: '7 6 5 4 3 2 1', isSample: false },
    ],
  },

  // Q79 — Check Identical Trees
  {
    title: 'Check Identical Trees',
    difficulty: 'Easy',
    description:
      'Given two binary trees, check whether they are identical.\n\nTwo trees are identical if they have the same structure and the same node values.',
    inputFormat: 'First line: space-separated integers for tree 1 in level-order (-1 for null)\nSecond line: space-separated integers for tree 2 in level-order (-1 for null)',
    outputFormat: 'Print "true" if the trees are identical, otherwise print "false"',
    constraints: '1 ≤ number of nodes in each tree ≤ 10^4\n-10^9 ≤ node value ≤ 10^9\nNode values will not be -1.',
    tags: ['Binary Tree', 'Recursion'],
    sampleTestCases: [
      { input: '1 2 3\n1 2 3', expectedOutput: 'true', isSample: true, explanation: 'Both trees have the same structure and values' },
      { input: '1 2 3\n1 3 2', expectedOutput: 'false', isSample: true, explanation: 'Left and right children are swapped' },
    ],
    hiddenTestCases: [
      { input: '1\n1', expectedOutput: 'true', isSample: false },
      { input: '1\n2', expectedOutput: 'false', isSample: false },
      { input: '1 2 -1\n1 -1 2', expectedOutput: 'false', isSample: false },
      { input: '1 2 3 4 5\n1 2 3 4 5', expectedOutput: 'true', isSample: false },
      { input: '1 2 3\n1 2 3 4', expectedOutput: 'false', isSample: false },
    ],
  },

  // Q80 — Check Balanced Binary Tree
  {
    title: 'Check Balanced Binary Tree',
    difficulty: 'Medium',
    description:
      'Given a binary tree, determine if it is height-balanced.\n\nA height-balanced binary tree is a tree in which the depth of the two subtrees of every node never differs by more than one.',
    inputFormat: 'A single line of space-separated integers representing the binary tree in level-order. -1 denotes a null node.',
    outputFormat: 'Print "true" if the tree is balanced, otherwise print "false"',
    constraints: '1 ≤ number of nodes ≤ 10^4\n-10^9 ≤ node value ≤ 10^9\nNode values will not be -1.',
    tags: ['Binary Tree', 'Recursion', 'DFS'],
    sampleTestCases: [
      { input: '3 9 20 -1 -1 15 7', expectedOutput: 'true', isSample: true, explanation: 'Height difference at every node is at most 1' },
      { input: '1 2 2 3 3 -1 -1 4 4', expectedOutput: 'false', isSample: true, explanation: 'Left subtree is 2 levels deeper than right at the root' },
    ],
    hiddenTestCases: [
      { input: '1', expectedOutput: 'true', isSample: false },
      { input: '1 2 3', expectedOutput: 'true', isSample: false },
      { input: '1 2 -1 3 -1 4 -1', expectedOutput: 'false', isSample: false },
      { input: '1 2 3 4 5 6 7', expectedOutput: 'true', isSample: false },
      { input: '1 2 3 4 -1 -1 -1 5', expectedOutput: 'false', isSample: false },
    ],
  },

  // Q81 — Diameter of Binary Tree
  {
    title: 'Diameter of Binary Tree',
    difficulty: 'Medium',
    description:
      'Given a binary tree, find its diameter.\n\nThe diameter of a binary tree is the length of the longest path between any two nodes in the tree. This path may or may not pass through the root.\n\nThe length of a path is measured by the number of edges between nodes.',
    inputFormat: 'A single line of space-separated integers representing the binary tree in level-order. -1 denotes a null node.',
    outputFormat: 'A single integer — the diameter (number of edges on the longest path)',
    constraints: '1 ≤ number of nodes ≤ 10^4\n-10^9 ≤ node value ≤ 10^9\nNode values will not be -1.',
    tags: ['Binary Tree', 'Recursion', 'DFS'],
    sampleTestCases: [
      { input: '1 2 3 4 5', expectedOutput: '3', isSample: true, explanation: 'Longest path: 4→2→1→3 or 5→2→1→3, length = 3 edges' },
      { input: '1 2 -1', expectedOutput: '1', isSample: true, explanation: 'Path: 2→1, length = 1 edge' },
    ],
    hiddenTestCases: [
      { input: '1', expectedOutput: '0', isSample: false },
      { input: '1 2 3', expectedOutput: '2', isSample: false },
      { input: '1 2 3 4 5 6 7', expectedOutput: '4', isSample: false },
      { input: '1 2 -1 3 -1 4 -1', expectedOutput: '3', isSample: false },
      { input: '1 2 3 -1 4 -1 -1 -1 5', expectedOutput: '4', isSample: false },
    ],
  },

  // Q82 — Lowest Common Ancestor
  {
    title: 'Lowest Common Ancestor',
    difficulty: 'Medium',
    description:
      'Given a binary tree and two node values p and q, find the lowest common ancestor (LCA) of the two nodes.\n\nThe LCA is the deepest node that is an ancestor of both p and q. A node can be an ancestor of itself.\n\nBoth p and q are guaranteed to exist in the tree.',
    inputFormat: 'First line: space-separated integers representing the binary tree in level-order (-1 for null)\nSecond line: two space-separated integers p and q',
    outputFormat: 'A single integer — the value of the LCA node',
    constraints: '2 ≤ number of nodes ≤ 10^4\n-10^9 ≤ node value ≤ 10^9\nAll node values are unique.\nNode values will not be -1.\np and q exist in the tree.',
    tags: ['Binary Tree', 'Recursion', 'DFS'],
    sampleTestCases: [
      { input: '3 5 1 6 2 0 8 -1 -1 7 4\n5 1', expectedOutput: '3', isSample: true, explanation: 'LCA of 5 and 1 is root 3' },
      { input: '3 5 1 6 2 0 8 -1 -1 7 4\n5 4', expectedOutput: '5', isSample: true, explanation: '4 is in the subtree of 5, so LCA is 5' },
    ],
    hiddenTestCases: [
      { input: '1 2 3\n2 3', expectedOutput: '1', isSample: false },
      { input: '1 2 3\n1 2', expectedOutput: '1', isSample: false },
      { input: '3 5 1 6 2 0 8 -1 -1 7 4\n6 4', expectedOutput: '5', isSample: false },
      { input: '3 5 1 6 2 0 8 -1 -1 7 4\n7 8', expectedOutput: '3', isSample: false },
      { input: '3 5 1 6 2 0 8 -1 -1 7 4\n7 4', expectedOutput: '2', isSample: false },
    ],
  },

  // Q83 — Validate Binary Search Tree
  {
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    description:
      'Given a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST has the following properties:\n- The left subtree of a node contains only nodes with values less than the node\'s value.\n- The right subtree of a node contains only nodes with values greater than the node\'s value.\n- Both left and right subtrees must also be BSTs.',
    inputFormat: 'A single line of space-separated integers representing the binary tree in level-order. -1 denotes a null node.',
    outputFormat: 'Print "true" if the tree is a valid BST, otherwise print "false"',
    constraints: '1 ≤ number of nodes ≤ 10^4\n-10^9 ≤ node value ≤ 10^9\nNode values will not be -1.\nAll node values are unique.',
    tags: ['Binary Search Tree', 'Recursion', 'DFS'],
    sampleTestCases: [
      { input: '2 1 3', expectedOutput: 'true', isSample: true, explanation: 'Left child 1 < root 2 < right child 3' },
      { input: '5 1 4 -1 -1 3 6', expectedOutput: 'false', isSample: true, explanation: 'Right child 4 < root 5, but 3 in right subtree is also < 5' },
    ],
    hiddenTestCases: [
      { input: '1', expectedOutput: 'true', isSample: false },
      { input: '5 3 7 2 4 6 8', expectedOutput: 'true', isSample: false },
      { input: '10 5 15 -1 -1 6 20', expectedOutput: 'false', isSample: false },
      { input: '3 1 5 0 2 4 6', expectedOutput: 'true', isSample: false },
      { input: '1 1 -1', expectedOutput: 'false', isSample: false },
    ],
  },

  // Q84 — Search in BST
  {
    title: 'Search in BST',
    difficulty: 'Easy',
    description:
      'Given a binary search tree and a target value, determine if the target exists in the BST.\n\nPrint "true" if found, otherwise print "false".',
    inputFormat: 'First line: space-separated integers representing the BST in level-order (-1 for null)\nSecond line: integer target (the value to search)',
    outputFormat: 'Print "true" if the value exists in the BST, otherwise print "false"',
    constraints: '1 ≤ number of nodes ≤ 10^4\n-10^9 ≤ node value ≤ 10^9\nNode values will not be -1.',
    tags: ['Binary Search Tree'],
    sampleTestCases: [
      { input: '4 2 7 1 3\n2', expectedOutput: 'true', isSample: true, explanation: '2 is in the BST' },
      { input: '4 2 7 1 3\n5', expectedOutput: 'false', isSample: true, explanation: '5 is not in the BST' },
    ],
    hiddenTestCases: [
      { input: '1\n1', expectedOutput: 'true', isSample: false },
      { input: '1\n2', expectedOutput: 'false', isSample: false },
      { input: '5 3 7 2 4 6 8\n6', expectedOutput: 'true', isSample: false },
      { input: '5 3 7 2 4 6 8\n9', expectedOutput: 'false', isSample: false },
      { input: '10 5 15 3 7 12 20\n12', expectedOutput: 'true', isSample: false },
    ],
  },

  // Q85 — Convert Sorted Array to BST
  {
    title: 'Convert Sorted Array to BST',
    difficulty: 'Medium',
    description:
      'Given a sorted array of integers in ascending order, convert it to a height-balanced binary search tree.\n\nA height-balanced BST is one where the depth of the two subtrees of every node never differs by more than one.\n\nAlways choose the lower median (middle element with lower index) as the root when the subarray has even length.\n\nPrint the preorder traversal of the resulting BST.',
    inputFormat: 'First line: integer n (size of array)\nSecond line: n space-separated sorted integers',
    outputFormat: 'A single line containing the preorder traversal of the BST, values separated by spaces',
    constraints: '1 ≤ n ≤ 10^4\n-10^9 ≤ arr[i] ≤ 10^9\nArray is sorted in ascending order with unique elements.',
    tags: ['Binary Search Tree', 'Recursion', 'Array'],
    sampleTestCases: [
      { input: '7\n1 2 3 4 5 6 7', expectedOutput: '4 2 1 3 6 5 7', isSample: true, explanation: 'Root=4, left subtree root=2 (1,3), right subtree root=6 (5,7)' },
      { input: '5\n-10 -3 0 5 9', expectedOutput: '0 -10 -3 5 9', isSample: true, explanation: 'Root=0, left subtree: -10→-3, right subtree: 5→9' },
    ],
    hiddenTestCases: [
      { input: '1\n1', expectedOutput: '1', isSample: false },
      { input: '3\n1 2 3', expectedOutput: '2 1 3', isSample: false },
      { input: '2\n1 2', expectedOutput: '1 2', isSample: false },
      { input: '4\n1 2 3 4', expectedOutput: '2 1 3 4', isSample: false },
      { input: '6\n1 2 3 4 5 6', expectedOutput: '3 1 2 5 4 6', isSample: false },
    ],
  },
];

module.exports = treeProblems;
