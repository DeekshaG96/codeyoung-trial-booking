import express from 'express';
import { bookingService } from '../services/bookingService.js';
import { store } from '../data/store.js';
import { timezoneService } from '../services/timezoneService.js';

const router = express.Router();

/**
 * POST /api/bookings
 * Book a trial class, assign mentor, enforce 2-demo daily cap, generate dummy link.
 */
router.post('/bookings', async (req, res) => {
  try {
    const result = await bookingService.createBooking(req.body);

    if (!result.success && result.error === 'NO_MENTORS_AVAILABLE') {
      return res.status(200).json(result); // Return graceful payload with alternatives
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(400).json({
      success: false,
      error: 'BOOKING_FAILED',
      message: error.message || 'Unable to complete trial booking.'
    });
  }
});

/**
 * GET /api/bookings
 * List all bookings
 */
router.get('/bookings', (req, res) => {
  try {
    const bookings = store.getBookings();
    return res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/bookings/:id
 * Retrieve specific booking
 */
router.get('/bookings/:id', (req, res) => {
  try {
    const booking = store.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found.' });
    }
    return res.json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/bookings/:id/calendar.ics
 * Downloadable iCalendar file for Google/Apple/Outlook
 */
router.get('/bookings/:id/calendar.ics', (req, res) => {
  try {
    const booking = store.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).send('Booking not found');
    }

    const icsContent = timezoneService.generateIcsCalendar({
      id: booking.id,
      childName: booking.childName,
      subject: booking.subject,
      startUtc: booking.startUtc,
      endUtc: booking.endUtc,
      meetingLink: booking.meetingLink,
      parentName: booking.parentName,
      mentorName: booking.mentorName
    });

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="codeyoung-trial-${booking.id}.ics"`);
    return res.send(icsContent);
  } catch (error) {
    return res.status(500).send('Error generating calendar file.');
  }
});

/**
 * POST /api/bookings/waitlist
 * Register on priority waitlist if slots are full
 */
router.post('/bookings/waitlist', (req, res) => {
  try {
    const result = bookingService.joinWaitlist(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
