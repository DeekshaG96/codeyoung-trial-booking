import express from 'express';
import { simulationService } from '../services/simulationService.js';
import { store } from '../data/store.js';

const router = express.Router();

/**
 * POST /api/simulate/20-parents
 * Executes automated batch simulation of 20 parents booking trial classes
 */
router.post('/simulate/20-parents', async (req, res) => {
  try {
    const { targetDate } = req.body || {};
    const report = await simulationService.run20ParentsSimulation(targetDate);
    return res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Error running 20 parents simulation:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/reset-data
 * Resets bookings and waitlists back to initial state
 */
router.post('/reset-data', (req, res) => {
  try {
    store.reset();
    return res.json({
      success: true,
      message: 'System data reset to initial seed state successfully.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
