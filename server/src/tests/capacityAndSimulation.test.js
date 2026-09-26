import { beforeEach, describe, expect, it } from 'vitest';
import { DateTime } from 'luxon';
import { store } from '../data/store.js';
import { simulationService } from '../services/simulationService.js';
import { getOperationalShiftDate, isTimeWithinShift } from '../services/timezoneService.js';

describe('System Capacity & 20-Parent Volume Compliance Tests', () => {
  const SIM_DATE = '2026-10-20';

  beforeEach(() => {
    store.reset();
  });

  it('runs automated 20-parent simulation and verifies exactly 20 demos booked with 0 mentors exceeding 2 demos', async () => {
    const report = await simulationService.run20ParentsSimulation(SIM_DATE);

    expect(report.totalAttempted).toBe(21);
    expect(report.successfulBookings).toBe(20);
    expect(report.rejectedOrWaitlisted).toBe(1);
    expect(report.systemCapacityDailyMax).toBe(20);

    // Verify mentor audit: EVERY mentor must have <= 2 demos booked
    for (const mentorStat of report.mentorUsageSummary) {
      expect(mentorStat.demosBooked).toBeLessThanOrEqual(2);
      expect(mentorStat.maxDemos).toBe(2);
    }

    // Verify 21st parent overflow rejection
    const overflowResult = report.log.find(r => r.status === 'REJECTED_CAP_REACHED');
    expect(overflowResult).toBeDefined();
    expect(overflowResult.parentName).toBe('Victoria Adams');
    expect(overflowResult.reason).toContain('maximum daily capacity');
  });

  it('verifies operational shift date logic (getOperationalShiftDate) handles overnight shifts correctly', () => {
    // A booking at 02:30 AM IST on Sunday Oct 25 belongs to the Saturday Oct 24 evening shift!
    const sunday2AM = DateTime.fromISO('2026-10-25T02:30:00', { zone: 'Asia/Kolkata' });
    const shiftDate = getOperationalShiftDate(sunday2AM);
    expect(shiftDate).toBe('2026-10-24');

    // A booking at 10:00 AM IST on Sunday Oct 25 belongs to Sunday Oct 25
    const sunday10AM = DateTime.fromISO('2026-10-25T10:00:00', { zone: 'Asia/Kolkata' });
    expect(getOperationalShiftDate(sunday10AM)).toBe('2026-10-25');

    // A booking at 18:00 (6:00 PM) IST on Saturday Oct 24 belongs to Saturday Oct 24
    const saturday6PM = DateTime.fromISO('2026-10-24T18:00:00', { zone: 'Asia/Kolkata' });
    expect(getOperationalShiftDate(saturday6PM)).toBe('2026-10-24');
  });

  it('correctly determines whether an IST time slot falls within regular and overnight shifts', () => {
    // Shift A: Regular day shift (13:00 - 22:00 IST)
    const slot1Start = DateTime.fromISO('2026-10-20T14:00:00', { zone: 'Asia/Kolkata' });
    const slot1End = DateTime.fromISO('2026-10-20T15:00:00', { zone: 'Asia/Kolkata' });
    expect(isTimeWithinShift(slot1Start, slot1End, '13:00', '22:00')).toBe(true);

    const slotOutOfDay = DateTime.fromISO('2026-10-20T10:00:00', { zone: 'Asia/Kolkata' });
    const slotOutOfDayEnd = DateTime.fromISO('2026-10-20T11:00:00', { zone: 'Asia/Kolkata' });
    expect(isTimeWithinShift(slotOutOfDay, slotOutOfDayEnd, '13:00', '22:00')).toBe(false);

    // Shift B: Overnight shift (18:00 - 03:00 IST next morning)
    // 20:00 IST (evening) -> within shift
    const eveningSlot = DateTime.fromISO('2026-10-20T20:00:00', { zone: 'Asia/Kolkata' });
    const eveningSlotEnd = DateTime.fromISO('2026-10-20T21:00:00', { zone: 'Asia/Kolkata' });
    expect(isTimeWithinShift(eveningSlot, eveningSlotEnd, '18:00', '03:00')).toBe(true);

    // 01:00 AM IST (past midnight) -> within shift
    const earlyMorningSlot = DateTime.fromISO('2026-10-21T01:00:00', { zone: 'Asia/Kolkata' });
    const earlyMorningSlotEnd = DateTime.fromISO('2026-10-21T02:00:00', { zone: 'Asia/Kolkata' });
    expect(isTimeWithinShift(earlyMorningSlot, earlyMorningSlotEnd, '18:00', '03:00')).toBe(true);

    // 05:00 AM IST -> outside shift
    const outsideOvernight = DateTime.fromISO('2026-10-21T05:00:00', { zone: 'Asia/Kolkata' });
    const outsideOvernightEnd = DateTime.fromISO('2026-10-21T06:00:00', { zone: 'Asia/Kolkata' });
    expect(isTimeWithinShift(outsideOvernight, outsideOvernightEnd, '18:00', '03:00')).toBe(false);
  });
});
