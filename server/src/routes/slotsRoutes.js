import express from 'express';
import { timezoneService } from '../services/timezoneService.js';
import { SUPPORTED_TIMEZONES, getTimezoneMeta } from '../config/timezones.js';

const router = express.Router();

/**
 * GET /api/available-slots
 * Query params: timezone, date (YYYY-MM-DD), subject (optional)
 */
router.get('/available-slots', (req, res) => {
  try {
    const { timezone, date, subject } = req.query;

    if (!timezone || !date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required query parameters: "timezone" and "date" (YYYY-MM-DD) are required.'
      });
    }

    const slotData = timezoneService.generateAvailableSlots(timezone, date, subject);
    return res.json({
      success: true,
      data: slotData
    });
  } catch (error) {
    console.error('Error in /api/available-slots:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while computing available slots.'
    });
  }
});

/**
 * GET /api/timezones
 * Returns list of supported timezones with current DST metadata.
 */
router.get('/timezones', (req, res) => {
  try {
    const enrichedZones = SUPPORTED_TIMEZONES.map(z => ({
      ...z,
      meta: getTimezoneMeta(z.id)
    }));

    return res.json({
      success: true,
      data: enrichedZones
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/timezone-info
 * Returns detailed DST and offset analysis for a zone and specific date.
 */
router.get('/timezone-info', (req, res) => {
  try {
    const { timezone, date } = req.query;
    if (!timezone) {
      return res.status(400).json({ success: false, error: 'timezone parameter is required' });
    }

    const meta = getTimezoneMeta(timezone, date ? `${date}T12:00:00` : null);
    return res.json({ success: true, data: meta });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
