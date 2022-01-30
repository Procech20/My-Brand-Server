import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
        userId: { type: mongoose.SchemaTypes.ObjectId, ref: "id", allowedNull: false },
        title: { type: String, min: 10, unique: false, allowedNull: false },
        description: { type: String, min: 250, unique: false, allowedNull: false, },
        imageId: {type: String},
        imageUrl: {type: String},
        createdAt: { type: Date, default: Date.now, immutable: true }
})


export default mongoose.model('Blog', blogSchema)
