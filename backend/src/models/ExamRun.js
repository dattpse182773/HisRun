import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  token: { type: String, unique: true, required: true },
  mode: { type: String, enum: ['study', 'explore', 'ranked'], required: true },
  subject: { type: String, enum: ['history', 'geography'] }, grade: Number, provinceId: String, title: String,
  questions: { type: [mongoose.Schema.Types.Mixed], required: true },
  result: mongoose.Schema.Types.Mixed,
  liveAnswers: { type: mongoose.Schema.Types.Mixed, default: {} },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model('ExamRun', schema);
