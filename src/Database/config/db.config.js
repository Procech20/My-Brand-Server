import { config } from 'dotenv';
import mongoose from 'mongoose';

config();

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(
			process.env.NODE_ENV === 'production'
				? process.env.MONGO_PROD_URL
				: process.env.NODE_ENV === 'test'
				? process.env.MONGO_TEST_URL
				: process.env.MONGO_DEV_URL,
			{ useNewUrlParser: true },
		);

		console.log(
			'Connection has been established successfully...'.cyan.underline.bold,
		);
	} catch (err) {
		console.log(`Error: ${err.message}`.red);
		process.exit(1);
	}
};

export default connectDB;
