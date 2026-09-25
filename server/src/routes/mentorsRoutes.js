import express from 'express';
import { mentorService } from '../services/mentorService.js';

const router = express.Router();

/**
 * GET /api/mentors
 * Query param: date (YYYY-MM-DD in IST, optional)
 * Returns all 10 mentors with today's quota utilization (0/2, 1/2, 2/2)
 */
router.get('/mentors', (req, res) => {
  try {
    const { date } = req.query;
    const mentors = mentorService.getMentorsWithDailyStats(date);

    return res.json({
      success: true,
      totalMentors: mentors.length,
      data: mentors
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/mentors/:id/schedule
 * Query params: date (optional), viewTimezone (optional, default 'Asia/Kolkata')
 */
router.get('/mentors/:id/schedule', (req, res) => {
  try {
    const { id } = req.params;
    const { date, viewTimezone } = req.query;

    const schedule = mentorService.getMentorSchedule(id, date, viewTimezone);
    return res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    return res.status(404).json({ success: false, error: error.message });
  }
});

export default router;
