import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT;

const serverStart = async () => {
	await connectDB();

	app.listen(PORT, () => {
		console.log(`server is running on port ${PORT}...`);
	});
};

serverStart();
