import express from 'express';
import cors from 'cors';
import slotsRoutes from './src/routes/slotsRoutes.js';
import bookingsRoutes from './src/routes/bookingsRoutes.js';
import mentorsRoutes from './src/routes/mentorsRoutes.js';
import simulateRoutes from './src/routes/simulateRoutes.js';
import notificationsRoutes from './src/routes/notificationsRoutes.js';
import analyticsRoutes from './src/routes/analyticsRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Mount modular API routes
app.use('/api', slotsRoutes);
app.use('/api', bookingsRoutes);
app.use('/api', mentorsRoutes);
app.use('/api', simulateRoutes);
app.use('/api', notificationsRoutes);
app.use('/api', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'Codeyoung Trial Booking Engine',
    timestamp: new Date().toISOString(),
    mentorsCount: 10,
    maxDailyDemosPerMentor: 2,
    mentorTimezone: 'Asia/Kolkata (IST)'
  });
});

// Serve production client build if client/dist exists
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../client/dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Codeyoung Trial Class Booking API is running!`);
  console.log(`📍 Endpoint: http://localhost:${PORT}`);
  console.log(`⏰ Timezone Engine: Luxon IANA + Dynamic DST Handler`);
  console.log(`👨‍🏫 Mentors: 10 Preloaded (Max 2 Demos/Day IST Cap)`);
  console.log(`======================================================\n`);
});
