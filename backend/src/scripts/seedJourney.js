import { readFile } from 'node:fs/promises';
import mongoose from 'mongoose';
import Question from '../models/Question.js';
import { connectDatabase } from '../config/database.js';
import { JOURNEY_MAPS, SCHOOL_LEVELS } from '../../../shared/journey.js';
try {
  const rows = JSON.parse(await readFile(new URL('../data/questions/journey.json', import.meta.url), 'utf8'));
  await Promise.all(rows.map(row => new Question(row).validate()));
  const keys = new Set(rows.map(row => row.contentKey));
  if (keys.size !== rows.length) throw new Error('Duplicate content key');
  for (const map of JOURNEY_MAPS) for (const landmark of map.landmarks) for (const school of SCHOOL_LEVELS) for (const subject of ['history', 'geography']) {
    if (!rows.some(row => row.mapId === map.id && row.landmarkId === landmark.id && row.schoolLevel === school.id && row.subject === subject)) throw new Error('Missing curriculum coverage');
  }
  await connectDatabase();
  const result = await Question.bulkWrite(rows.map(row => ({ updateOne: { filter: { contentKey: row.contentKey }, update: { $set: row }, upsert: true } })));
  console.log(`Journey ready: ${rows.length} questions, ${JOURNEY_MAPS.length} maps, 3 school levels. Inserted ${result.upsertedCount}. Existing questions preserved.`);
} catch (error) { console.error('Journey seed failed:', error.name); process.exitCode = 1; }
finally { await mongoose.disconnect(); }
