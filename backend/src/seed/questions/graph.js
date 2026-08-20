// ── GRAPH — 10 Questions ──
// Input convention: first line = n m (vertices 0 to n-1, m edges), next m lines = edges
// For deterministic traversals: process neighbors in ascending order
const graphProblems = [
  // Q86 — BFS Traversal
  {
    title: 'BFS Traversal',
    difficulty: 'Medium',
    description:
      'Given an undirected graph represented as an adjacency list, perform a Breadth-First Search (BFS) traversal starting from a given source vertex.\n\nProcess neighbors in ascending order to ensure a deterministic output.\n\nPrint the BFS traversal order.',
    inputFormat: 'First line: two integers n and m (number of vertices and edges)\nNext m lines: two integers u and v (an undirected edge between u and v)\nLast line: integer src (source vertex)',
    outputFormat: 'A single line containing the BFS traversal order, values separated by spaces',
    constraints: '1 ≤ n ≤ 10^4\n0 ≤ m ≤ 10^5\n0 ≤ u, v < n\n0 ≤ src < n\nNo self-loops or duplicate edges.',
    tags: ['Graph', 'BFS'],
    sampleTestCases: [
      {
        input: '5 6\n0 1\n0 2\n1 3\n2 3\n2 4\n3 4\n0',
        expectedOutput: '0 1 2 3 4',
        isSample: true,
        explanation: 'BFS from 0: visit 0, then neighbors 1,2, then 3 (from 1), then 4 (from 2)',
      },
      {
        input: '3 2\n0 1\n1 2\n0',
        expectedOutput: '0 1 2',
        isSample: true,
        explanation: 'BFS from 0: visit 0, then 1, then 2',
      },
    ],
    hiddenTestCases: [
      { input: '1 0\n0', expectedOutput: '0', isSample: false },
      { input: '4 3\n0 1\n0 2\n0 3\n0', expectedOutput: '0 1 2 3', isSample: false },
      { input: '4 4\n0 1\n1 2\n2 3\n3 0\n2', expectedOutput: '2 1 3 0', isSample: false },
      { input: '6 5\n0 1\n0 2\n1 3\n2 4\n4 5\n0', expectedOutput: '0 1 2 3 4 5', isSample: false },
      { input: '5 4\n0 1\n1 2\n2 3\n3 4\n4', expectedOutput: '4 3 2 1 0', isSample: false },
    ],
  },

  // Q87 — DFS Traversal
  {
    title: 'DFS Traversal',
    difficulty: 'Medium',
    description:
      'Given an undirected graph represented as an adjacency list, perform a Depth-First Search (DFS) traversal starting from a given source vertex.\n\nProcess neighbors in ascending order to ensure a deterministic output.\n\nPrint the DFS traversal order.',
    inputFormat: 'First line: two integers n and m (number of vertices and edges)\nNext m lines: two integers u and v (an undirected edge between u and v)\nLast line: integer src (source vertex)',
    outputFormat: 'A single line containing the DFS traversal order, values separated by spaces',
    constraints: '1 ≤ n ≤ 10^4\n0 ≤ m ≤ 10^5\n0 ≤ u, v < n\n0 ≤ src < n\nNo self-loops or duplicate edges.',
    tags: ['Graph', 'DFS'],
    sampleTestCases: [
      {
        input: '5 6\n0 1\n0 2\n1 3\n2 3\n2 4\n3 4\n0',
        expectedOutput: '0 1 3 2 4',
        isSample: true,
        explanation: 'DFS from 0: visit 0→1→3→2→4 (ascending neighbor order)',
      },
      {
        input: '3 2\n0 1\n1 2\n0',
        expectedOutput: '0 1 2',
        isSample: true,
        explanation: 'DFS from 0: visit 0→1→2',
      },
    ],
    hiddenTestCases: [
      { input: '1 0\n0', expectedOutput: '0', isSample: false },
      { input: '4 3\n0 1\n0 2\n0 3\n0', expectedOutput: '0 1 2 3', isSample: false },
      { input: '4 4\n0 1\n1 2\n2 3\n3 0\n2', expectedOutput: '2 1 0 3', isSample: false },
      { input: '6 5\n0 1\n0 2\n1 3\n2 4\n4 5\n0', expectedOutput: '0 1 3 2 4 5', isSample: false },
      { input: '5 4\n0 1\n1 2\n2 3\n3 4\n0', expectedOutput: '0 1 2 3 4', isSample: false },
    ],
  },

  // Q88 — Detect Cycle in Undirected Graph
  {
    title: 'Detect Cycle in Undirected Graph',
    difficulty: 'Medium',
    description:
      'Given an undirected graph, determine if it contains a cycle.\n\nPrint "true" if a cycle exists, otherwise print "false".',
    inputFormat: 'First line: two integers n and m (number of vertices and edges)\nNext m lines: two integers u and v (an undirected edge)',
    outputFormat: 'Print "true" if the graph contains a cycle, otherwise print "false"',
    constraints: '1 ≤ n ≤ 10^4\n0 ≤ m ≤ 10^5\n0 ≤ u, v < n\nNo self-loops or duplicate edges.',
    tags: ['Graph', 'DFS', 'Union Find'],
    sampleTestCases: [
      { input: '4 4\n0 1\n1 2\n2 3\n3 0', expectedOutput: 'true', isSample: true, explanation: 'Cycle: 0→1→2→3→0' },
      { input: '3 2\n0 1\n1 2', expectedOutput: 'false', isSample: true, explanation: 'No cycle, this is a simple path' },
    ],
    hiddenTestCases: [
      { input: '1 0', expectedOutput: 'false', isSample: false },
      { input: '2 1\n0 1', expectedOutput: 'false', isSample: false },
      { input: '3 3\n0 1\n1 2\n2 0', expectedOutput: 'true', isSample: false },
      { input: '5 4\n0 1\n1 2\n2 3\n3 4', expectedOutput: 'false', isSample: false },
      { input: '5 5\n0 1\n1 2\n2 3\n3 4\n4 1', expectedOutput: 'true', isSample: false },
    ],
  },

  // Q89 — Detect Cycle in Directed Graph
  {
    title: 'Detect Cycle in Directed Graph',
    difficulty: 'Medium',
    description:
      'Given a directed graph, determine if it contains a cycle.\n\nPrint "true" if a cycle exists, otherwise print "false".',
    inputFormat: 'First line: two integers n and m (number of vertices and edges)\nNext m lines: two integers u and v (a directed edge from u to v)',
    outputFormat: 'Print "true" if the graph contains a cycle, otherwise print "false"',
    constraints: '1 ≤ n ≤ 10^4\n0 ≤ m ≤ 10^5\n0 ≤ u, v < n',
    tags: ['Graph', 'DFS', 'Topological Sort'],
    sampleTestCases: [
      { input: '4 4\n0 1\n1 2\n2 3\n3 1', expectedOutput: 'true', isSample: true, explanation: 'Cycle: 1→2→3→1' },
      { input: '3 2\n0 1\n1 2', expectedOutput: 'false', isSample: true, explanation: 'No cycle, DAG' },
    ],
    hiddenTestCases: [
      { input: '1 0', expectedOutput: 'false', isSample: false },
      { input: '2 2\n0 1\n1 0', expectedOutput: 'true', isSample: false },
      { input: '4 4\n0 1\n0 2\n1 3\n2 3', expectedOutput: 'false', isSample: false },
      { input: '3 3\n0 1\n1 2\n2 0', expectedOutput: 'true', isSample: false },
      { input: '5 5\n0 1\n1 2\n2 3\n3 4\n4 2', expectedOutput: 'true', isSample: false },
    ],
  },

  // Q90 — Number of Islands
  {
    title: 'Number of Islands',
    difficulty: 'Medium',
    description:
      'Given a 2D grid of 1s (land) and 0s (water), count the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are surrounded by water.',
    inputFormat: 'First line: two integers n and m (rows and columns)\nNext n lines: m space-separated integers (0 or 1)',
    outputFormat: 'A single integer — the number of islands',
    constraints: '1 ≤ n, m ≤ 300\ngrid[i][j] ∈ {0, 1}',
    tags: ['Graph', 'DFS', 'BFS'],
    sampleTestCases: [
      {
        input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0',
        expectedOutput: '1',
        isSample: true,
        explanation: 'All 1s are connected, forming one island',
      },
      {
        input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1',
        expectedOutput: '3',
        isSample: true,
        explanation: 'Three separate islands',
      },
    ],
    hiddenTestCases: [
      { input: '1 1\n0', expectedOutput: '0', isSample: false },
      { input: '1 1\n1', expectedOutput: '1', isSample: false },
      { input: '3 3\n1 0 1\n0 0 0\n1 0 1', expectedOutput: '4', isSample: false },
      { input: '3 3\n1 1 1\n1 1 1\n1 1 1', expectedOutput: '1', isSample: false },
      { input: '2 4\n1 0 1 0\n0 1 0 1', expectedOutput: '4', isSample: false },
    ],
  },

  // Q91 — Shortest Path in Unweighted Graph
  {
    title: 'Shortest Path in Unweighted Graph',
    difficulty: 'Medium',
    description:
      'Given an undirected unweighted graph, find the shortest path length from a source vertex to a destination vertex.\n\nIf no path exists, print -1.',
    inputFormat: 'First line: two integers n and m (number of vertices and edges)\nNext m lines: two integers u and v (an undirected edge)\nLast line: two integers src and dest (source and destination)',
    outputFormat: 'A single integer — the shortest path length (number of edges), or -1 if unreachable',
    constraints: '1 ≤ n ≤ 10^4\n0 ≤ m ≤ 10^5\n0 ≤ u, v, src, dest < n',
    tags: ['Graph', 'BFS'],
    sampleTestCases: [
      {
        input: '6 7\n0 1\n0 2\n1 3\n2 3\n3 4\n4 5\n2 5\n0 5',
        expectedOutput: '2',
        isSample: true,
        explanation: 'Shortest path: 0→2→5, length = 2',
      },
      {
        input: '4 2\n0 1\n2 3\n0 3',
        expectedOutput: '-1',
        isSample: true,
        explanation: 'No path from 0 to 3',
      },
    ],
    hiddenTestCases: [
      { input: '1 0\n0 0', expectedOutput: '0', isSample: false },
      { input: '2 1\n0 1\n0 1', expectedOutput: '1', isSample: false },
      { input: '5 4\n0 1\n1 2\n2 3\n3 4\n0 4', expectedOutput: '4', isSample: false },
      { input: '4 4\n0 1\n0 2\n1 3\n2 3\n0 3', expectedOutput: '2', isSample: false },
      { input: '3 0\n0 2', expectedOutput: '-1', isSample: false },
    ],
  },

  // Q92 — Dijkstra's Shortest Path
  {
    title: "Dijkstra's Shortest Path",
    difficulty: 'Hard',
    description:
      "Given a weighted directed graph, find the shortest distance from a source vertex to all other vertices using Dijkstra's algorithm.\n\nIf a vertex is unreachable from the source, its distance should be -1.",
    inputFormat: 'First line: two integers n and m (number of vertices and edges)\nNext m lines: three integers u, v, w (directed edge from u to v with weight w)\nLast line: integer src (source vertex)',
    outputFormat: 'A single line containing n space-separated integers — shortest distance from src to each vertex (0 to n-1). Use -1 for unreachable vertices.',
    constraints: '1 ≤ n ≤ 10^4\n0 ≤ m ≤ 10^5\n0 ≤ u, v < n\n1 ≤ w ≤ 10^4',
    tags: ['Graph', 'Dijkstra', 'Heap'],
    sampleTestCases: [
      {
        input: '5 7\n0 1 1\n0 2 4\n1 2 2\n1 3 6\n2 3 3\n3 4 1\n2 4 5\n0',
        expectedOutput: '0 1 3 6 7',
        isSample: true,
        explanation: 'Distances: 0→0=0, 0→1=1, 0→1→2=3, 0→1→2→3=6, 0→1→2→3→4=7',
      },
      {
        input: '3 1\n0 1 5\n0',
        expectedOutput: '0 5 -1',
        isSample: true,
        explanation: 'Vertex 2 is unreachable',
      },
    ],
    hiddenTestCases: [
      { input: '1 0\n0', expectedOutput: '0', isSample: false },
      { input: '2 1\n0 1 10\n0', expectedOutput: '0 10', isSample: false },
      { input: '4 5\n0 1 1\n0 2 3\n1 2 1\n1 3 5\n2 3 2\n0', expectedOutput: '0 1 2 4', isSample: false },
      { input: '3 3\n0 1 2\n1 2 3\n0 2 10\n0', expectedOutput: '0 2 5', isSample: false },
      { input: '4 4\n0 1 10\n0 2 5\n2 1 3\n1 3 1\n0', expectedOutput: '0 8 5 9', isSample: false },
    ],
  },

  // Q93 — Topological Sort
  {
    title: 'Topological Sort',
    difficulty: 'Medium',
    description:
      "Given a Directed Acyclic Graph (DAG), perform a topological sort.\n\nUse Kahn's algorithm (BFS-based) and always pick the smallest numbered vertex first when there are multiple vertices with in-degree 0. This ensures a unique, deterministic output.\n\nThe graph is guaranteed to be a DAG.",
    inputFormat: 'First line: two integers n and m (number of vertices and edges)\nNext m lines: two integers u and v (a directed edge from u to v)',
    outputFormat: 'A single line containing the topological ordering, values separated by spaces',
    constraints: '1 ≤ n ≤ 10^4\n0 ≤ m ≤ 10^5\n0 ≤ u, v < n\nThe graph is a DAG.',
    tags: ['Graph', 'Topological Sort', 'BFS'],
    sampleTestCases: [
      {
        input: '6 6\n5 2\n5 0\n4 0\n4 1\n2 3\n3 1',
        expectedOutput: '4 5 0 2 3 1',
        isSample: true,
        explanation: 'Using Kahn\'s with smallest vertex first: 4,5 have in-degree 0 → pick 4, then 5, etc.',
      },
      {
        input: '4 3\n0 1\n0 2\n1 3',
        expectedOutput: '0 1 2 3',
        isSample: true,
        explanation: 'Only vertex 0 has in-degree 0 initially',
      },
    ],
    hiddenTestCases: [
      { input: '1 0', expectedOutput: '0', isSample: false },
      { input: '3 2\n0 1\n0 2', expectedOutput: '0 1 2', isSample: false },
      { input: '4 4\n0 1\n0 2\n1 3\n2 3', expectedOutput: '0 1 2 3', isSample: false },
      { input: '3 0', expectedOutput: '0 1 2', isSample: false },
      { input: '5 4\n4 3\n3 2\n2 1\n1 0', expectedOutput: '4 3 2 1 0', isSample: false },
    ],
  },

  // Q94 — Course Schedule
  {
    title: 'Course Schedule',
    difficulty: 'Medium',
    description:
      'There are a total of n courses you have to take, labeled from 0 to n-1.\n\nSome courses have prerequisites. Given the total number of courses and a list of prerequisite pairs, determine if it is possible to finish all courses.\n\nEach prerequisite pair [a, b] means: to take course a, you must first take course b (i.e., b → a).',
    inputFormat: 'First line: integer n (number of courses)\nSecond line: integer m (number of prerequisites)\nNext m lines: two integers a and b (prerequisite pair: must take b before a)',
    outputFormat: 'Print "true" if all courses can be finished, otherwise print "false"',
    constraints: '1 ≤ n ≤ 10^4\n0 ≤ m ≤ 10^5\n0 ≤ a, b < n',
    tags: ['Graph', 'Topological Sort', 'DFS'],
    sampleTestCases: [
      { input: '2\n1\n1 0', expectedOutput: 'true', isSample: true, explanation: 'Take course 0 first, then course 1' },
      { input: '2\n2\n1 0\n0 1', expectedOutput: 'false', isSample: true, explanation: 'Circular dependency: 0 requires 1, 1 requires 0' },
    ],
    hiddenTestCases: [
      { input: '1\n0', expectedOutput: 'true', isSample: false },
      { input: '3\n3\n1 0\n2 1\n0 2', expectedOutput: 'false', isSample: false },
      { input: '4\n3\n1 0\n2 0\n3 1', expectedOutput: 'true', isSample: false },
      { input: '5\n0', expectedOutput: 'true', isSample: false },
      { input: '3\n2\n1 0\n2 1', expectedOutput: 'true', isSample: false },
    ],
  },

  // Q95 — Minimum Spanning Tree
  {
    title: 'Minimum Spanning Tree',
    difficulty: 'Hard',
    description:
      "Given a connected, undirected, weighted graph, find the total weight of the Minimum Spanning Tree (MST).\n\nYou may use Kruskal's or Prim's algorithm.",
    inputFormat: 'First line: two integers n and m (number of vertices and edges)\nNext m lines: three integers u, v, w (undirected edge between u and v with weight w)',
    outputFormat: 'A single integer — the total weight of the MST',
    constraints: '2 ≤ n ≤ 10^4\nn - 1 ≤ m ≤ 10^5\n0 ≤ u, v < n\n1 ≤ w ≤ 10^4\nThe graph is connected.',
    tags: ['Graph', 'Minimum Spanning Tree', 'Greedy'],
    sampleTestCases: [
      {
        input: '4 5\n0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4',
        expectedOutput: '19',
        isSample: true,
        explanation: 'MST edges: (2,3,4), (0,3,5), (0,1,10). Total = 4 + 5 + 10 = 19',
      },
      {
        input: '3 3\n0 1 1\n1 2 2\n0 2 3',
        expectedOutput: '3',
        isSample: true,
        explanation: 'MST edges: (0,1,1), (1,2,2). Total = 3',
      },
    ],
    hiddenTestCases: [
      { input: '2 1\n0 1 5', expectedOutput: '5', isSample: false },
      { input: '4 6\n0 1 1\n0 2 2\n0 3 3\n1 2 4\n1 3 5\n2 3 6', expectedOutput: '6', isSample: false },
      { input: '5 7\n0 1 2\n0 3 6\n1 2 3\n1 3 8\n1 4 5\n2 4 7\n3 4 9', expectedOutput: '16', isSample: false },
      { input: '3 3\n0 1 5\n1 2 5\n0 2 5', expectedOutput: '10', isSample: false },
      { input: '4 4\n0 1 1\n1 2 2\n2 3 3\n0 3 10', expectedOutput: '6', isSample: false },
    ],
  },
];

module.exports = graphProblems;
