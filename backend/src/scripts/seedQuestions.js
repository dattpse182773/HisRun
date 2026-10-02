import { readFile } from 'node:fs/promises';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import Question from '../models/Question.js';

try {
  const groups = await Promise.all(['history', 'geography'].map(async subject => {
    const rows = JSON.parse(await readFile(new URL(`../data/questions/${subject}.json`, import.meta.url), 'utf8'));
    if (!Array.isArray(rows) || rows.length !== 20 || rows.some(row => row.subject !== subject)) throw new Error('Invalid sample dataset');
    return rows;
  }));
  const rows = groups.flat();
  await Promise.all(rows.map(row => new Question(row).validate()));
  await connectDatabase();
  const result = await Question.bulkWrite(rows.map(row => ({ updateOne: { filter: { subject: row.subject, question: row.question, source: row.source }, update: { $set: row }, upsert: true } })));
  console.log(`Seed complete: ${rows.length} validated samples, ${result.upsertedCount} inserted. Existing non-sample questions preserved.`);
} catch {
  console.error('Seed failed. Check MongoDB connection and the two sample JSON files.');
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
