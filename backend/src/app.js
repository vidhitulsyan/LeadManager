import express from 'express';
import leadsRouter from './routes/leads.routes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/leads', leadsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
