import express, { Express } from 'express';
import projectRouter from './presentation/routes/project.route';
import aiRouter from './presentation/routes/ai.route';
import { dbConnect } from './infrastructure/db/mongoose';
import { errorHandler } from './presentation/middlewares/errorHandler.middleware';
import { env } from './infrastructure/config/env.config';

const app: Express = express();
const PORT = env.PORT;
const API_PREFIX = '/api';

dbConnect();

app.use(express.json());

app.use(`${API_PREFIX}/projects`, projectRouter);
app.use(`${API_PREFIX}/ai`, aiRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`⚡️ Server is running at ${PORT}`);
});