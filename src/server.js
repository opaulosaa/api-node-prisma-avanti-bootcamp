import express from 'express';
import router from './routes/index.js';
import cors from 'cors';
import { process } from 'process';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});