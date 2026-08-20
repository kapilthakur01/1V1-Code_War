/**
 * seedQuestions.js — Insert 100 coding questions into MongoDB
 *
 * Usage:  node src/seed/seedQuestions.js
 *
 * This script:
 *   1. Connects to MongoDB using the existing .env config
 *   2. Reads existing problem titles (case-insensitive)
 *   3. Deduplicates within the 100-question list
 *   4. Inserts only new questions, preserving existing data
 *   5. Prints a detailed summary
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Problem = require('../models/Problem');

// ── Import all topic questions ──
const arrayProblems = require('./questions/arrays');
const stringProblems = require('./questions/strings');
const linkedListProblems = require('./questions/linkedlist');
const stackQueueProblems = require('./questions/stackqueue');
const hashingProblems = require('./questions/hashing');
const treeProblems = require('./questions/tree');
const graphProblems = require('./questions/graph');
const heapProblems = require('./questions/heap');

// ── Combine all 100 questions ──
const allQuestions = [
  ...arrayProblems,       // 20
  ...stringProblems,      // 15
  ...linkedListProblems,  // 15
  ...stackQueueProblems,  // 10
  ...hashingProblems,     // 10
  ...treeProblems,        // 15
  ...graphProblems,       // 10
  ...heapProblems,        //  5
];

async function main() {
  console.log('🔌 Connecting to MongoDB...');
  await connectDB();

  // ── Step 1: Inspect existing questions ──
  const existingDocs = await Problem.find({}, { title: 1 }).lean();
  const existingTitlesSet = new Set(existingDocs.map((p) => p.title.toLowerCase().trim()));
  const existingCount = existingDocs.length;

  console.log(`\n📊 Existing questions in database: ${existingCount}`);
  if (existingCount > 0) {
    existingDocs.forEach((p) => console.log(`   • ${p.title}`));
  }

  // ── Step 2: Deduplicate and filter ──
  const seenTitles = new Set();
  const toInsert = [];
  const skippedDuplicates = [];

  for (const q of allQuestions) {
    const key = q.title.toLowerCase().trim();

    if (existingTitlesSet.has(key)) {
      skippedDuplicates.push({ title: q.title, reason: 'already in database' });
    } else if (seenTitles.has(key)) {
      skippedDuplicates.push({ title: q.title, reason: 'duplicate in question list' });
    } else {
      seenTitles.add(key);
      toInsert.push(q);
    }
  }

  // ── Step 3: Insert new questions ──
  console.log(`\n🆕 Questions to insert: ${toInsert.length}`);
  console.log(`⏭️  Duplicates to skip: ${skippedDuplicates.length}`);

  if (toInsert.length > 0) {
    await Problem.insertMany(toInsert);
    console.log(`\n✅ Successfully inserted ${toInsert.length} questions!`);
  } else {
    console.log('\n⚠️  No new questions to insert.');
  }

  // ── Step 4: Verify ──
  const finalCount = await Problem.countDocuments();

  // ── Step 5: Print report ──
  console.log('\n' + '═'.repeat(60));
  console.log('                    INSERTION REPORT');
  console.log('═'.repeat(60));
  console.log(`Existing questions: ${existingCount}`);
  console.log(`New questions inserted: ${toInsert.length}`);
  console.log(`Duplicates skipped: ${skippedDuplicates.length}`);
  console.log(`Final questions: ${finalCount}`);
  console.log('═'.repeat(60));

  if (skippedDuplicates.length > 0) {
    console.log('\n⏭️  Skipped duplicates:');
    skippedDuplicates.forEach((d) => console.log(`   • "${d.title}" — ${d.reason}`));
  }

  console.log('\n📋 Inserted questions:');
  toInsert.forEach((q) => {
    console.log(`   [${q.difficulty}] ${q.title} (${q.tags.join(', ')})`);
  });

  // ── Step 6: Print full 100-question manifest ──
  console.log('\n' + '═'.repeat(60));
  console.log('            ALL 100 QUESTION TITLES');
  console.log('═'.repeat(60));

  const topics = [
    { name: 'ARRAYS', problems: arrayProblems },
    { name: 'STRINGS', problems: stringProblems },
    { name: 'LINKED LIST', problems: linkedListProblems },
    { name: 'STACK AND QUEUE', problems: stackQueueProblems },
    { name: 'HASHING', problems: hashingProblems },
    { name: 'BINARY TREE AND BST', problems: treeProblems },
    { name: 'GRAPH', problems: graphProblems },
    { name: 'HEAP / PRIORITY QUEUE', problems: heapProblems },
  ];

  let num = 1;
  for (const topic of topics) {
    console.log(`\n── ${topic.name} (${topic.problems.length}) ──`);
    for (const p of topic.problems) {
      const status = existingTitlesSet.has(p.title.toLowerCase().trim()) ? '(existing)' : '(new)';
      console.log(`   ${num}. [${p.difficulty}] ${p.title} ${status}`);
      num++;
    }
  }

  console.log(`\n✅ Total questions listed: ${num - 1}`);
  console.log(`✅ Final database count: ${finalCount}`);

  await mongoose.disconnect();
  console.log('\n🔌 Disconnected from MongoDB.');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
