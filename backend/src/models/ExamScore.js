import mongoose from 'mongoose';
const schema = new mongoose.Schema({ runId: { type: String, unique: true, required: true }, name: String, correct: Number, total: Number, duration: Number }, { timestamps: true });
schema.index({ correct: -1, duration: 1 });
export default mongoose.model('ExamScore', schema);
