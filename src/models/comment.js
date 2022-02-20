import mongoose from 'mongoose';
const commentSchema = mongoose.Schema({
	message: { type: String, required: true },
	commentedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Comment', commentSchema);
