import mongoose from 'mongoose';

const integer = { validator: Number.isInteger, message: 'Must be an integer' };
const questionSchema = new mongoose.Schema({
  subject: { type: String, enum: ['history', 'geography'], required: true },
  grade: { type: Number, min: 4, max: 12, required: true, validate: integer },
  curriculum: { type: String, default: 'sample' },
  schoolLevel: { type: String, enum: ['primary', 'middle', 'high'] },
  mapId: { type: String },
  landmarkId: { type: String },
  contentKey: { type: String },
  sourceUrl: { type: String },
  sourceTitle: { type: String },
  textbookVerified: { type: Boolean, default: false },
  difficulty: { type: Number, min: 1, max: 5, required: true, validate: integer },
  topic: { type: String, required: true, trim: true, maxlength: 200 },
  question: { type: String, required: true, trim: true, maxlength: 2000 },
  answers: {
    type: [String], required: true,
    validate: { validator: value => value.length === 4 && value.every(answer => answer.trim().length > 0), message: 'Question must contain exactly 4 non-empty answers' },
  },
  correctAnswer: { type: Number, required: true, min: 0, max: 3, validate: integer, select: false },
  explanation: { type: String, default: '', select: false },
  source: { type: String, default: 'SGK' },
  chapter: { type: String, default: '' },
  active: { type: Boolean, default: true },
}, { timestamps: true });
questionSchema.index({ subject: 1, grade: 1, difficulty: 1 });
questionSchema.index({ curriculum: 1, mapId: 1, landmarkId: 1, schoolLevel: 1, subject: 1 });
questionSchema.index({ contentKey: 1 }, { unique: true, sparse: true });
export default mongoose.model('Question', questionSchema);
