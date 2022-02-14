import mongoose from 'mongoose';

const querrySchema = new mongoose.Schema({
	names: {
		type: String,
		required: 'Name can not be empty',
		allowedNull: false,
	},
	email: {
		type: String,
		required: 'Please add an email address',
		allowedNull: true,
		lowercase: true,
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			'Please fill a valid email address',
		],
	},

	project: {
		type: String,
		required: 'Please mention the project',
		allowedNull: false,
	},
	message: { type: String },
	createdAt: { type: Date, default: Date.now, immutable: true },
});

export default mongoose.model('Querry', querrySchema);
