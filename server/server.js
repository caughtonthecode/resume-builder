import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = 4000;

app.use(cors());

// CONNCET DB
connectDB();

// MIDDLEWARE
app.use(express.json());
app.use('/api/auth', userRoutes);

// ROUTES
app.get('/', (req, res) => {
  res.send('API WORKING');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
