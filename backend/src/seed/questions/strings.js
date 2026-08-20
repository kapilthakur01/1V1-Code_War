// ── STRINGS — 15 Questions ──
const stringProblems = [
  // Q21 — Reverse a String
  {
    title: 'Reverse a String',
    difficulty: 'Easy',
    description:
      'Given a string s, reverse it and print the reversed string.',
    inputFormat: 'A single line containing the string s',
    outputFormat: 'The reversed string on a single line',
    constraints: '1 ≤ s.length ≤ 10^5\ns consists of printable ASCII characters.',
    tags: ['String'],
    sampleTestCases: [
      { input: 'hello', expectedOutput: 'olleh', isSample: true, explanation: 'Reversed: olleh' },
      { input: 'world', expectedOutput: 'dlrow', isSample: true, explanation: 'Reversed: dlrow' },
    ],
    hiddenTestCases: [
      { input: 'a', expectedOutput: 'a', isSample: false },
      { input: 'ab', expectedOutput: 'ba', isSample: false },
      { input: 'racecar', expectedOutput: 'racecar', isSample: false },
      { input: 'AbCdEf', expectedOutput: 'fEdCbA', isSample: false },
      { input: '12345', expectedOutput: '54321', isSample: false },
    ],
  },

  // Q22 — Check Palindrome String
  {
    title: 'Check Palindrome String',
    difficulty: 'Easy',
    description:
      'Given a string s, determine whether it is a palindrome. A palindrome reads the same forward and backward.\n\nThe comparison is case-sensitive.',
    inputFormat: 'A single line containing the string s',
    outputFormat: 'Print "true" if the string is a palindrome, otherwise print "false"',
    constraints: '1 ≤ s.length ≤ 10^5\ns consists of lowercase English letters.',
    tags: ['String', 'Two Pointers'],
    sampleTestCases: [
      { input: 'madam', expectedOutput: 'true', isSample: true, explanation: '"madam" reads the same forwards and backwards' },
      { input: 'hello', expectedOutput: 'false', isSample: true, explanation: '"hello" reversed is "olleh", not the same' },
    ],
    hiddenTestCases: [
      { input: 'a', expectedOutput: 'true', isSample: false },
      { input: 'ab', expectedOutput: 'false', isSample: false },
      { input: 'abba', expectedOutput: 'true', isSample: false },
      { input: 'abcba', expectedOutput: 'true', isSample: false },
      { input: 'abcda', expectedOutput: 'false', isSample: false },
    ],
  },

  // Q23 — Count Vowels and Consonants
  {
    title: 'Count Vowels and Consonants',
    difficulty: 'Easy',
    description:
      'Given a string consisting of lowercase English letters, count and print the number of vowels and consonants.\n\nVowels are: a, e, i, o, u. All other lowercase letters are consonants.',
    inputFormat: 'A single line containing the string s (only lowercase English letters)',
    outputFormat: 'First line: "Vowels: X" where X is the count of vowels\nSecond line: "Consonants: Y" where Y is the count of consonants',
    constraints: '1 ≤ s.length ≤ 10^5\ns consists of lowercase English letters only.',
    tags: ['String'],
    sampleTestCases: [
      { input: 'hello', expectedOutput: 'Vowels: 2\nConsonants: 3', isSample: true, explanation: 'e, o are vowels (2); h, l, l are consonants (3)' },
      { input: 'aeiou', expectedOutput: 'Vowels: 5\nConsonants: 0', isSample: true, explanation: 'All characters are vowels' },
    ],
    hiddenTestCases: [
      { input: 'a', expectedOutput: 'Vowels: 1\nConsonants: 0', isSample: false },
      { input: 'b', expectedOutput: 'Vowels: 0\nConsonants: 1', isSample: false },
      { input: 'bcdfg', expectedOutput: 'Vowels: 0\nConsonants: 5', isSample: false },
      { input: 'programming', expectedOutput: 'Vowels: 3\nConsonants: 8', isSample: false },
      { input: 'abcdefghij', expectedOutput: 'Vowels: 3\nConsonants: 7', isSample: false },
    ],
  },

  // Q24 — Count Character Frequency
  {
    title: 'Count Character Frequency',
    difficulty: 'Easy',
    description:
      'Given a string consisting of lowercase English letters, count the frequency of each character and print them in alphabetical order.\n\nPrint each character and its frequency on a separate line in the format "c X" where c is the character and X is its count.',
    inputFormat: 'A single line containing the string s (only lowercase English letters)',
    outputFormat: 'Each line contains a character followed by a space and its frequency, sorted alphabetically by character',
    constraints: '1 ≤ s.length ≤ 10^5\ns consists of lowercase English letters only.',
    tags: ['String', 'Hash Table'],
    sampleTestCases: [
      { input: 'abcabc', expectedOutput: 'a 2\nb 2\nc 2', isSample: true, explanation: 'Each of a, b, c appears twice' },
      { input: 'aab', expectedOutput: 'a 2\nb 1', isSample: true, explanation: 'a appears 2 times, b appears 1 time' },
    ],
    hiddenTestCases: [
      { input: 'a', expectedOutput: 'a 1', isSample: false },
      { input: 'zzz', expectedOutput: 'z 3', isSample: false },
      { input: 'abcdef', expectedOutput: 'a 1\nb 1\nc 1\nd 1\ne 1\nf 1', isSample: false },
      { input: 'banana', expectedOutput: 'a 3\nb 1\nn 2', isSample: false },
      { input: 'mississippi', expectedOutput: 'i 4\nm 1\np 2\ns 4', isSample: false },
    ],
  },

  // Q25 — Check Anagram
  {
    title: 'Check Anagram',
    difficulty: 'Easy',
    description:
      'Given two strings s and t, determine if t is an anagram of s.\n\nAn anagram is a word formed by rearranging the letters of another word, using all the original letters exactly once.',
    inputFormat: 'First line: string s\nSecond line: string t',
    outputFormat: 'Print "true" if t is an anagram of s, otherwise print "false"',
    constraints: '1 ≤ s.length, t.length ≤ 10^5\nBoth strings consist of lowercase English letters.',
    tags: ['String', 'Hash Table', 'Sorting'],
    sampleTestCases: [
      { input: 'anagram\nnagaram', expectedOutput: 'true', isSample: true, explanation: '"nagaram" is a rearrangement of "anagram"' },
      { input: 'rat\ncar', expectedOutput: 'false', isSample: true, explanation: 'Different characters' },
    ],
    hiddenTestCases: [
      { input: 'a\na', expectedOutput: 'true', isSample: false },
      { input: 'a\nb', expectedOutput: 'false', isSample: false },
      { input: 'listen\nsilent', expectedOutput: 'true', isSample: false },
      { input: 'hello\nworld', expectedOutput: 'false', isSample: false },
      { input: 'ab\nba', expectedOutput: 'true', isSample: false },
    ],
  },

  // Q26 — First Non-Repeating Character
  {
    title: 'First Non-Repeating Character',
    difficulty: 'Easy',
    description:
      'Given a string s, find the first non-repeating character in it and print it.\n\nIf there is no non-repeating character, print -1.',
    inputFormat: 'A single line containing the string s (only lowercase English letters)',
    outputFormat: 'A single character — the first non-repeating character, or -1 if all characters repeat',
    constraints: '1 ≤ s.length ≤ 10^5\ns consists of lowercase English letters.',
    tags: ['String', 'Hash Table'],
    sampleTestCases: [
      { input: 'leetcode', expectedOutput: 'l', isSample: true, explanation: 'l is the first character that appears only once' },
      { input: 'aabb', expectedOutput: '-1', isSample: true, explanation: 'All characters repeat' },
    ],
    hiddenTestCases: [
      { input: 'a', expectedOutput: 'a', isSample: false },
      { input: 'aabbc', expectedOutput: 'c', isSample: false },
      { input: 'abacabad', expectedOutput: 'c', isSample: false },
      { input: 'aabbcc', expectedOutput: '-1', isSample: false },
      { input: 'abcabc', expectedOutput: '-1', isSample: false },
    ],
  },

  // Q27 — Remove Duplicate Characters
  {
    title: 'Remove Duplicate Characters',
    difficulty: 'Easy',
    description:
      'Given a string s, remove all duplicate characters from it. Keep only the first occurrence of each character and maintain the original order.',
    inputFormat: 'A single line containing the string s (only lowercase English letters)',
    outputFormat: 'The string after removing duplicate characters',
    constraints: '1 ≤ s.length ≤ 10^5\ns consists of lowercase English letters.',
    tags: ['String', 'Hash Table'],
    sampleTestCases: [
      { input: 'abcabc', expectedOutput: 'abc', isSample: true, explanation: 'Keep first occurrence of each character' },
      { input: 'banana', expectedOutput: 'ban', isSample: true, explanation: 'First occurrences: b, a, n' },
    ],
    hiddenTestCases: [
      { input: 'a', expectedOutput: 'a', isSample: false },
      { input: 'aaaa', expectedOutput: 'a', isSample: false },
      { input: 'abcdef', expectedOutput: 'abcdef', isSample: false },
      { input: 'programming', expectedOutput: 'proganmi', isSample: false },
      { input: 'aabbccdd', expectedOutput: 'abcd', isSample: false },
    ],
  },

  // Q28 — Find First Repeating Character
  {
    title: 'Find First Repeating Character',
    difficulty: 'Easy',
    description:
      'Given a string s, find the first character that repeats (appears more than once). Print the character.\n\nIf no character repeats, print -1.\n\n"First repeating" means the character whose first occurrence comes earliest among all characters that repeat.',
    inputFormat: 'A single line containing the string s (only lowercase English letters)',
    outputFormat: 'A single character — the first repeating character, or -1 if none',
    constraints: '1 ≤ s.length ≤ 10^5\ns consists of lowercase English letters.',
    tags: ['String', 'Hash Table'],
    sampleTestCases: [
      { input: 'abcabc', expectedOutput: 'a', isSample: true, explanation: 'a is the first character that repeats (appears at index 0 and 3)' },
      { input: 'abcdef', expectedOutput: '-1', isSample: true, explanation: 'No character repeats' },
    ],
    hiddenTestCases: [
      { input: 'a', expectedOutput: '-1', isSample: false },
      { input: 'aa', expectedOutput: 'a', isSample: false },
      { input: 'abba', expectedOutput: 'a', isSample: false },
      { input: 'abcdb', expectedOutput: 'b', isSample: false },
      { input: 'aabbcc', expectedOutput: 'a', isSample: false },
    ],
  },

  // Q29 — Longest Common Prefix
  {
    title: 'Longest Common Prefix',
    difficulty: 'Medium',
    description:
      'Given an array of strings, find the longest common prefix string amongst them.\n\nIf there is no common prefix, print "NONE".',
    inputFormat: 'First line: integer n (number of strings)\nNext n lines: one string per line',
    outputFormat: 'A single line containing the longest common prefix, or "NONE" if no common prefix exists.',
    constraints: '1 ≤ n ≤ 200\n1 ≤ strs[i].length ≤ 200\nstrs[i] consists of lowercase English letters only.',
    tags: ['String'],
    sampleTestCases: [
      { input: '3\nflower\nflow\nflight', expectedOutput: 'fl', isSample: true, explanation: '"fl" is the longest common prefix' },
      { input: '3\ndog\nracecar\ncar', expectedOutput: 'NONE', isSample: true, explanation: 'No common prefix' },
    ],
    hiddenTestCases: [
      { input: '1\nhello', expectedOutput: 'hello', isSample: false },
      { input: '2\nabc\nabc', expectedOutput: 'abc', isSample: false },
      { input: '3\na\nab\nabc', expectedOutput: 'a', isSample: false },
      { input: '2\nab\ncd', expectedOutput: 'NONE', isSample: false },
      { input: '4\ninterspecies\ninterstellar\ninterstate\ninternet', expectedOutput: 'inter', isSample: false },
    ],
  },

  // Q30 — Reverse Words in a String
  {
    title: 'Reverse Words in a String',
    difficulty: 'Medium',
    description:
      'Given a string s, reverse the order of the words.\n\nA word is a sequence of non-space characters. The words in s are separated by single spaces.\n\nReturn the string with words in reverse order, separated by single spaces.',
    inputFormat: 'A single line containing the string s',
    outputFormat: 'A single line containing the words in reverse order',
    constraints: '1 ≤ s.length ≤ 10^4\ns contains only lowercase English letters and spaces.\nWords are separated by single spaces.\nNo leading or trailing spaces.',
    tags: ['String'],
    sampleTestCases: [
      { input: 'the sky is blue', expectedOutput: 'blue is sky the', isSample: true, explanation: 'Words reversed' },
      { input: 'hello world', expectedOutput: 'world hello', isSample: true, explanation: 'Two words swapped' },
    ],
    hiddenTestCases: [
      { input: 'hello', expectedOutput: 'hello', isSample: false },
      { input: 'a b c d', expectedOutput: 'd c b a', isSample: false },
      { input: 'alice loves bob', expectedOutput: 'bob loves alice', isSample: false },
      { input: 'i am a student', expectedOutput: 'student a am i', isSample: false },
      { input: 'one two three four five', expectedOutput: 'five four three two one', isSample: false },
    ],
  },

  // Q31 — Valid Parentheses (duplicate of existing, will be skipped)
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

  // Q32 — Longest Substring Without Repeating Characters
  {
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    description:
      'Given a string s, find the length of the longest substring without repeating characters.',
    inputFormat: 'A single line containing the string s',
    outputFormat: 'A single integer — the length of the longest substring without repeating characters',
    constraints: '1 ≤ s.length ≤ 10^5\ns consists of English letters, digits, symbols and spaces.',
    tags: ['String', 'Hash Table', 'Sliding Window'],
    sampleTestCases: [
      { input: 'abcabcbb', expectedOutput: '3', isSample: true, explanation: 'Longest substring is "abc" with length 3' },
      { input: 'bbbbb', expectedOutput: '1', isSample: true, explanation: 'Longest substring is "b" with length 1' },
    ],
    hiddenTestCases: [
      { input: 'a', expectedOutput: '1', isSample: false },
      { input: 'pwwkew', expectedOutput: '3', isSample: false },
      { input: 'abcdef', expectedOutput: '6', isSample: false },
      { input: 'abba', expectedOutput: '2', isSample: false },
      { input: 'dvdf', expectedOutput: '3', isSample: false },
    ],
  },

  // Q33 — Longest Palindromic Substring
  {
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    description:
      'Given a string s, return the longest palindromic substring in s.\n\nIf there are multiple substrings of the same maximum length, return the one with the smallest starting index.',
    inputFormat: 'A single line containing the string s (only lowercase English letters)',
    outputFormat: 'A single line containing the longest palindromic substring',
    constraints: '1 ≤ s.length ≤ 1000\ns consists of lowercase English letters only.',
    tags: ['String', 'Dynamic Programming'],
    sampleTestCases: [
      { input: 'babad', expectedOutput: 'bab', isSample: true, explanation: '"bab" is a palindrome of length 3 starting at index 0' },
      { input: 'cbbd', expectedOutput: 'bb', isSample: true, explanation: '"bb" is the longest palindromic substring' },
    ],
    hiddenTestCases: [
      { input: 'a', expectedOutput: 'a', isSample: false },
      { input: 'ac', expectedOutput: 'a', isSample: false },
      { input: 'racecar', expectedOutput: 'racecar', isSample: false },
      { input: 'abcba', expectedOutput: 'abcba', isSample: false },
      { input: 'aacabdkacaa', expectedOutput: 'aca', isSample: false },
    ],
  },

  // Q34 — Check String Rotation
  {
    title: 'Check String Rotation',
    difficulty: 'Easy',
    description:
      'Given two strings s1 and s2, check if s2 is a rotation of s1.\n\nA string s2 is a rotation of s1 if s2 can be obtained by moving some characters from the beginning of s1 to its end.\n\nFor example, "waterbottle" is a rotation of "erbottlewat".',
    inputFormat: 'First line: string s1\nSecond line: string s2',
    outputFormat: 'Print "true" if s2 is a rotation of s1, otherwise print "false"',
    constraints: '1 ≤ s1.length, s2.length ≤ 10^5\nBoth strings consist of lowercase English letters.',
    tags: ['String'],
    sampleTestCases: [
      { input: 'waterbottle\nerbottlewat', expectedOutput: 'true', isSample: true, explanation: 'Rotating "waterbottle" gives "erbottlewat"' },
      { input: 'hello\nworld', expectedOutput: 'false', isSample: true, explanation: 'Not a rotation' },
    ],
    hiddenTestCases: [
      { input: 'a\na', expectedOutput: 'true', isSample: false },
      { input: 'ab\nba', expectedOutput: 'true', isSample: false },
      { input: 'abc\ncab', expectedOutput: 'true', isSample: false },
      { input: 'abc\nbca', expectedOutput: 'true', isSample: false },
      { input: 'abc\nabc', expectedOutput: 'true', isSample: false },
    ],
  },

  // Q35 — String Compression
  {
    title: 'String Compression',
    difficulty: 'Easy',
    description:
      'Implement basic string compression using the counts of repeated characters.\n\nFor example, the string "aabcccccaaa" would become "a2b1c5a3".\n\nIf the compressed string is not shorter than the original string, return the original string.',
    inputFormat: 'A single line containing the string s (only lowercase English letters)',
    outputFormat: 'The compressed string, or the original string if compression does not make it shorter',
    constraints: '1 ≤ s.length ≤ 10^5\ns consists of lowercase English letters only.',
    tags: ['String'],
    sampleTestCases: [
      { input: 'aabcccccaaa', expectedOutput: 'a2b1c5a3', isSample: true, explanation: 'Compressed from length 11 to length 8' },
      { input: 'abc', expectedOutput: 'abc', isSample: true, explanation: 'Compressed "a1b1c1" (length 6) is not shorter than "abc" (length 3)' },
    ],
    hiddenTestCases: [
      { input: 'a', expectedOutput: 'a', isSample: false },
      { input: 'aa', expectedOutput: 'aa', isSample: false },
      { input: 'aaa', expectedOutput: 'a3', isSample: false },
      { input: 'aaabbbccc', expectedOutput: 'a3b3c3', isSample: false },
      { input: 'abcd', expectedOutput: 'abcd', isSample: false },
    ],
  },
];

module.exports = stringProblems;
