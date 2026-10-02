import express from 'express';
import cors from 'cors';
import slotsRoutes from '../server/src/routes/slotsRoutes.js';
import bookingsRoutes from '../server/src/routes/bookingsRoutes.js';
import mentorsRoutes from '../server/src/routes/mentorsRoutes.js';
import simulateRoutes from '../server/src/routes/simulateRoutes.js';
import notificationsRoutes from '../server/src/routes/notificationsRoutes.js';
import analyticsRoutes from '../server/src/routes/analyticsRoutes.js';
import authRoutes from '../server/src/routes/authRoutes.js';
import aiRoutes from '../server/src/routes/aiRoutes.js';
import codeRoutes from '../server/src/routes/codeRoutes.js';
import storageRoutes from '../server/src/routes/storageRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Mount modular API routes
app.use('/api', slotsRoutes);
app.use('/api', bookingsRoutes);
app.use('/api', mentorsRoutes);
app.use('/api', simulateRoutes);
app.use('/api', notificationsRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', authRoutes);
app.use('/api', aiRoutes);
app.use('/api', codeRoutes);
app.use('/api', storageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'Codeyoung Trial Booking Engine',
    timestamp: new Date().toISOString(),
    mentorsCount: 10,
    maxDailyDemosPerMentor: 2,
    mentorTimezone: 'Asia/Kolkata (IST)',
    deployment: 'Vercel Serverless'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred.'
  });
});

export default app;
