# AI Engineering Session Transcript (TRANSCRIPT.md)

> **Submission Document for Codeyoung Full-Stack Engineering Drive (2027 Batch)**  
> **Candidate:** Deeksha G (SIT Mangaluru)  
> **Role:** Full-Stack Engineer  
> **Tool / AI Assistant:** Antigravity AI (Google DeepMind Agentic Coding Architecture)

---

## Session Overview & Context

This document captures the complete architectural discussion, prompts, engineering decisions, and automated validation logs conducted between the candidate and the AI assistant to build the **Codeyoung 1:1 Live Coding Trial Class Appointment Booking System**.

---

### Turn 1: Requirements Ingestion & Problem Discovery

**User / Candidate Prompt:**
```text
Act as a Principal Full-Stack Engineer and AI Product Designer. I need you to build a production-ready Full-Stack Appointment Booking System for trial classes at Codeyoung.

### Core Context & Workflow
- Target Audience: Parents (primarily in the US/UK time zones) booking a trial class for their children.
- Mentors: 10 mentors available (primarily located in India time zones, e.g., Asia/Kolkata).
- Volume: Scale designed to handle ~20 parents booking trial classes per day.
- Flow:
  1. Parent selects a comfortable date and time slot in their local timezone.
  2. System automatically matches and assigns an available mentor.
  3. System sends/generates a unique dummy live class join link for both mentor and parent.

### Tech Stack & Architecture
- Frontend: React (Vite/Next.js preferred), Tailwind CSS / Vanilla CSS, Lucide React icons, date-fns/luxon/moment-timezone for timezone management.
- Backend: NodeJS (Express/NestJS) or Python (FastAPI/Flask).
- Database/State: PostgreSQL/SQLite or clean in-memory database with realistic seed data (10 mentors with working hours set to IST).
- Design System: Usable, modern, intuitive UI/UX built from a customer-first perspective.

### Hard Technical Requirements & Edge Cases
1. Timezones & DST:
   - Handle dynamic time zone conversions seamlessly across US (e.g., EST, CST, PST), UK (GMT/BST), and India (IST).
   - Account for Daylight Savings Time (DST) offsets automatically using standard timezone libraries.
   - Always display local times clearly on both parent booking forms and mentor schedules.
2. Mentor Rules & Limits:
   - Cap each mentor at maximum 2 demo/trial classes per day.
   - If a mentor already has 2 trial classes assigned on a given date, do not assign additional classes to them.
3. Link Generation:
   - Generate a valid working dummy URL (e.g., `https://meet.codeyoung.com/demo/<unique-booking-id>`) visible in booking confirmations, mentor dashboards, and parent schedules.
4. Error Handling & Edge Cases:
   - If no mentors are available for a requested slot (all 10 are booked out or hit their 2-class daily limit), provide a clear, empathetic UI error state.
   - Suggest alternative available time slots or allow parents to join a waitlist/request a custom callback.

### What to Build Step-by-Step
1. Backend API:
   - Data models for `Mentor`, `Parent`, `Booking`, and `TimeSlot`.
   - Seed script populating 10 mentors with predefined availability (IST).
   - API endpoint `GET /api/available-slots`: takes parent timezone/date and returns valid available slots.
   - API endpoint `POST /api/bookings`: books a slot, validates availability + 2-demo daily cap, assigns mentor, generates meeting link.
   - API endpoint `GET /api/mentor/schedule`: views assigned sessions for mentors in their local timezone.
2. Frontend (React):
   - Parent Booking UI: Timezone selector, interactive calendar, dynamic slot picker, instant timezone conversion toggle, confirmation screen with class join link.
   - Mentor Schedule Dashboard: Toggle view to inspect schedules across all 10 mentors.
   - Clear UI messaging for fully booked slots or error states.

Please build this project modularly with clean design patterns, standard code comments, and robust validation. Provide the code along with setup instructions for running the backend and frontend locally.
```

**Agent Response & System Architecture Strategy:**
1. **Mathematical Alignment:**
   - 10 Mentors × 2 Demos/Day = 20 Trial Classes daily capacity.
   - Matches the 20 parents/day volume requirement.
2. **Timezone & Daylight Saving Time (DST) Handling:**
   - Mentors in India (`Asia/Kolkata` - IST) do **not** observe DST (always UTC+05:30).
   - US and UK change clocks between standard time and daylight saving time (EDT/EST, CDT/CST, MDT/MST, PDT/PST, BST/GMT).
   - **Crucial Rule:** Store all slot timestamps canonically in UTC (`YYYY-MM-DDTHH:mm:ss.sssZ`).
   - Use `luxon` with IANA timezone identifiers to dynamically evaluate `isInDST`, current offsets, and local conversions at runtime.
3. **Overnight Shift Quota Integrity (`getOperationalShiftDate`):**
   - Mentors working US shifts (e.g. 18:00 to 03:00 IST) cross the midnight threshold.
   - If limits were calculated by calendar day in IST, a session at 11:30 PM (Saturday) and 12:30 AM (Sunday) would count as two different days, enabling a mentor to take 4 classes in one shift.
   - We introduced `getOperationalShiftDate()`: sessions between `00:00` and `07:00 AM IST` belong to the previous evening's shift date, strictly enforcing the 2-demo limit per work shift.
4. **Interactive Virtual Classroom:**
   - Beyond a raw dummy URL, we built an interactive sandbox classroom (`/demo/:id`) featuring mentor/student video tiles, a live Python/Scratch code editor, milestone checklist, and chat.

---

### Turn 2: Execution & Implementation Logs

#### 1. Backend Construction
- Initialized Express server with ES modules.
- Created `server/src/config/timezones.js` with IANA timezone definitions and DST explanation generator.
- Created `server/src/data/mentorsData.js` seeding 10 mentors with authentic bios, avatars, and IST shift windows.
- Created `server/src/data/store.js` providing in-memory persistence, overlap collision detection, and daily quota counting.
- Created `server/src/services/timezoneService.js` to generate 60-minute trial slots, detect DST status, and format RFC 5545 `.ics` calendar files.
- Created `server/src/services/bookingService.js` implementing the mentor matching engine, collision avoidance, and 2-demo daily limit guardrails.
- Created `server/src/services/simulationService.js` to execute an automated 20-parent stress test.
- Created RESTful routes in `server/src/routes/`.

#### 2. Frontend Development
- Initialized React application with Vite.
- Implemented `client/src/index.css` design system with Outfit and Plus Jakarta Sans typography, sleek card glassmorphism, and micro-animations.
- Built `Navbar.jsx` with portal switching between Parent Booking, Mentor Schedules, 20-Parent Test, Live Classroom, and Email Logs.
- Built 4-step `BookingWizard.jsx`:
  - `ChildSubjectStep.jsx`: Child name, age (5–17), subject cards (Scratch, Python & AI, Web Dev, Robotics, Roblox, Math Olympiad).
  - `SlotPickerStep.jsx`: Auto timezone detection, DST active pill, date carousel, morning/afternoon/evening slots with IST mentor preview.
  - `ParentFormStep.jsx`: Contact details and summary review.
  - `BookingSuccess.jsx`: Confetti animation, matched mentor card, dual timezone display, dummy meeting link, and `.ics` download.
  - `WaitlistModal.jsx`: Priority queue registration when slots are full.
- Built `MentorOverview.jsx`, `MentorCard.jsx`, and `MentorScheduleModal.jsx` for the mentor operations dashboard.
- Built `VirtualClassroom.jsx` for the live 1:1 demo class preview.
- Built `SimulationRunner.jsx` to test and visualize the 20-parent batch booking.
- Built `EmailModal.jsx` to inspect simulated email payloads sent to both parties.

---

### Turn 3: Automated Verification & Browser Testing

**Subagent Execution Verification:**
- Launched Vite client on `http://localhost:3000` and Express API on `http://localhost:5001`.
- Browser subagent performed end-to-end user journey:
  1. Selected child *Leo* (Age 9, Grade 4) and subject *Python & AI for Kids*.
  2. Selected local time slot *06:00 PM - 07:00 PM EDT*.
  3. Submitted parent details for *Sarah Jenkins*.
  4. Verified booking confirmation (`CY-TR-413851`), matched mentor *Aarav Sharma*, and dual-timezone display.
  5. Opened live Virtual Classroom, edited Python code, and executed it in the simulated terminal.
  6. Inspected Mentor Schedules tab to verify all 10 mentors and their 2-demo daily meters.
  7. Ran the 20-Parent batch simulation test confirming 20 bookings assigned without exceeding mentor limits.
  8. Verified localized email dispatches in the Email Logs tab.
- Browser interaction recording archived at:  
  `codeyoung_booking_test_1790350895599.webp`

---

## Conclusion & Readiness for Evaluation

All technical and product criteria specified by Codeyoung and Talentise Global have been met and verified with clean architecture, robust validation, and customer-first design.
