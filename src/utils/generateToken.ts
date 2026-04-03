import jwt from 'jsonwebtoken';

const generateToken = (userId: string) => {
	const secret = process.env.JWT_SECRET as string;

	return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
};

export default generateToken;
