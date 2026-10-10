import mongoose from 'mongoose';
const number = { type: Number, required: true, min: 0, validate: Number.isInteger };
const schema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  runId: { type: String, required: true },
  mode: { type: String, enum: ['endless', 'history', 'geography', 'mixed', 'grade', 'journey', 'world'], required: true },
  mapId: String,
  schoolLevel: { type: String, enum: ['primary', 'middle', 'high'] },
  completed: { type: Boolean, default: false },
  score: number, distance: number, coins: number, correctAnswers: number, wrongAnswers: number,
  penalties: { type: Number, default: 0, min: 0, validate: Number.isInteger },
  historyCorrect: number, geographyCorrect: number, bestCombo: number,
  duration: { type: Number, required: true, min: 0 },
  verified: { type: Boolean, default: false },
}, { timestamps: true });
schema.index({ playerId: 1, runId: 1 }, { unique: true });
schema.index({ playerId: 1, createdAt: -1 });
schema.index({ score: -1 });
export default mongoose.model('GameResult', schema);
