import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();

/**
 * GET /api/notifications
 * Retrieves log of dispatched simulation emails (parent + mentor)
 */
router.get('/notifications', (req, res) => {
  try {
    const logs = store.getNotificationLog();
    return res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
