import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import generateToken from '../utils/generateToken';

interface RegisterBody {
	name: string;
	email: string;
	password: string;
}

export const registerUser = async (req: Request, res: Response) => {
	try {
		const { name, email, password } = req.body as RegisterBody;

		if (!name || !email || !password) {
			return res.status(400).json({ message: 'All fields are required' });
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(400).json({ message: 'User already exists' });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		res.status(201).json({
			message: 'User registered successfully',
			user: { id: user._id, name: user.name, email: user.email },
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

export const loginUser = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body as {
			email: string;
			password: string;
		};

		if (!email || !password) {
			return res.status(400).json({ message: 'All fields are required' });
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const token = generateToken(user._id.toString());

		res.status(200).json({
			message: 'Login successful',
			token,
			user: { id: user._id, name: user.name, email: user.email },
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};
