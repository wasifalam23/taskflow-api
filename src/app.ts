import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
	res.send('API is running 🚀');
});

export default app;
