import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import passport from './config/passport.js';

import routes from './routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { apiLimiter } from './middlewares/rateLimit.middleware.js';
import { env } from './config/env.js';

const app = express();

/* ── CORS ── */
app.use(cors({
  origin: env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

/* ── Body parsing ── */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

/* ── Logging (dev only) ── */
if (env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/* ── Passport (OAuth, no sessions) ── */
app.use(passport.initialize());

/* ── Global rate limiter ── */
app.use('/api', apiLimiter);

/* ── API Routes ── */
app.use('/api', routes);

/* ── Health check ── */
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (_, res) => {
  res.send('LogicCafe API is running 🚀');
});

/* ── Global error handler ── */
app.use(errorHandler);

export default app;
