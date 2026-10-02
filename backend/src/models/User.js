import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, minlength: 2, maxlength: 24 },
  tokenHash: { type: String, required: true, select: false },
}, { timestamps: true });
export default mongoose.model('User', schema);
