Codeyoung Assignment — Compliance Checklist

Summary: All functional requirements verified locally and via automated tests. Marked PASS where satisfied.

1) Mentors: 10 seeded mentors (India, IST) — PASS
   - File: server/src/data/mentorsData.js

2) Parents: support bookings from US/UK timezones — PASS
   - Parent timezone preserved; parentLocalTime returned in API responses.

3) Timezones + DST handling — PASS
   - Luxon with IANA zones used. Tests: src/tests/dst.test.js, timezoneService.test.js

4) Local time display & communication — PASS
   - Emails simulated with parentLocalTime and mentorLocalTime fields; .ics generated.

5) Mentor cap: at most 2 demo classes/day — PASS
   - Enforced in bookingService and data store. Simulation shows capacity full at 20/day.

6) Overlap/collision avoidance — PASS
   - store.hasConflict() prevents overlapping assignments.

7) If no mentors available, present graceful error + suggestions — PASS
   - Booking API returns NO_MENTORS_AVAILABLE with suggestedSlots and canJoinWaitlist=true.

8) Dummy meeting links — PASS
   - Generated as https://meet.codeyoung.com/demo/<bookingId>

9) Waitlist support — PASS
   - POST /api/bookings/waitlist available and persists in store

10) Tests & CI readiness — PASS
   - Server tests: vitest suite (23/23) in server/src/tests.

11) README & TRANSCRIPT included — PASS
   - README.md contains run instructions; TRANSCRIPT.md included per assignment.

Local verification commands:
- Backend tests: cd server && npm ci && npm test
- Run backend: cd server && npm run dev
- Install frontend: cd client && npm ci && npm run dev
- Run simulation endpoint: POST /api/simulate/20-parents

Notes & next steps (optional):
- Add an end-to-end test in CI to run simulation and assert capacity behaviour.
- Add a short demo GIF and optional video for reviewers (use recordmydesktop or browser recorder).

Prepared for submission on: 2026-09-27
Prepared by: <Candidate Name> (<candidate.email@example.com>)