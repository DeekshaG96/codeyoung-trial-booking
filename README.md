# Codeyoung 1:1 Live Coding Trial Class Appointment Booking System

> **Full-Stack Engineering Task Submission for Codeyoung Recruitment Drive (2027 Batch)**  
> **Candidate:** Deeksha G  
> **Institute:** Srinivas Institute of Technology, Mangaluru (SITMNG)  
> **Submission Email Target:** `campus.ka@talentiseglobal.com`  
> **Email Subject:** `Codeyoung Assignment Task - Deeksha G - SIT Mangaluru (SITMNG)`

---

## 🌟 Executive Summary & Problem Scope

At **Codeyoung**, parents book a 1:1 "trial class" to experience the platform, meet our mentors, and explore hands-on STEM & coding coaching for their children before subscribing.

### Key Operational Constraints & Requirements:
- **10 Mentors Available:** Located in India (**Asia/Kolkata - IST**, UTC+05:30).
- **20 Parents Booking Per Day:** Primarily located across the **United States (EDT/EST, CDT/CST, MDT/MST, PDT/PST)** and the **United Kingdom (BST/GMT)**.
- **Strict Mentor Cap:** Mentors take **at most 2 demo classes per day**.
- **System Capacity Alignment:** `10 Mentors × 2 Demos/Day = 20 Demo Classes Maximum Capacity/Day`.
- **Time Zones & Daylight Saving Time (DST):** Mentors and parents operate across different hemispheres. Clocks in the US and UK change with DST, whereas India does **not** observe DST. All times must be displayed accurately in local time with clear dual-timezone context.
- **Working Dummy Live Class Link:** Each booking generates a unique link (e.g., `https://meet.codeyoung.com/demo/CY-TR-xxxxxx`) connecting both parties to an interactive demo classroom.
- **Empathetic Error Handling:** If no mentors are available for a requested slot or daily quotas are reached, provide smart nearest-slot alternatives and a priority waitlist option.

---

## 🏗️ Architecture & Technology Stack

```
codeyoung-trial-booking/
├── server/                          # Backend API Engine (NodeJS + Express)
│   ├── src/
│   │   ├── config/timezones.js      # IANA timezones, DST calculation engine
│   │   ├── data/
│   │   │   ├── mentorsData.js       # 10 Mentors with IST shift allocations & specialties
│   │   │   └── store.js             # Collision detection, shift-date tracking & state store
│   │   ├── services/
│   │   │   ├── timezoneService.js   # Slot generator, DST detector, .ics iCalendar generator
│   │   │   ├── mentorService.js     # Schedule aggregator & daily quota analytics
│   │   │   ├── bookingService.js    # Smart mentor matching, 2-demo daily cap enforcement
│   │   │   ├── notificationService.js # Simulated email dispatch with localized times
│   │   │   └── simulationService.js # 20-Parent batch load test runner
│   │   └── routes/                  # Modular RESTful API endpoints
│   └── server.js                    # Express application entrypoint
│
└── client/                          # Frontend Application (React + Vite)
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx           # Multi-portal switcher (Booking, Mentors, Classroom, Simulation, Emails)
    │   │   ├── ParentBooking/       # 4-Step Booking Wizard with real-time DST badges
    │   │   ├── MentorDashboard/     # 10 Mentors grid, daily quota progress bars, schedule inspector
    │   │   ├── VirtualClassroom/    # Interactive 1:1 Live Classroom preview (video, Python editor)
    │   │   └── EmailSimulator/      # Live viewer of dispatched parent & mentor emails
    │   ├── services/api.js          # Centralized API client with Vite proxy
    │   └── index.css                # Custom modern design system (Outfit & Plus Jakarta Sans)
```

### Technology Choices:
1. **Frontend:** React 19 (Vite), modern CSS design system, Lucide React icons, Luxon for timezone calculations, Canvas-Confetti for celebratory confirmation.
2. **Backend:** Node.js, Express, Luxon (IANA time zone database & DST handling).
3. **Calendar Integration:** RFC 5545 compliant `.ics` iCalendar generation for 1-click addition to Google Calendar, Apple Calendar, and Outlook.

---

## ⏰ Time Zones & Daylight Saving Time (DST) Strategy

### The "DST Niggle" Explained:
- Parents in the US experience DST shifts (e.g. EDT is UTC-4 in summer, EST is UTC-5 in winter).
- Parents in the UK experience DST shifts (BST is UTC+1 in summer, GMT is UTC+0 in winter).
- Mentors in India are **always on fixed UTC+05:30 (IST)** with **no DST**.
- **Common Failure Mode:** Applications that hardcode fixed offsets (e.g. `IST = EST + 10.5 hours`) break as soon as clocks change in March or November.

### Our Solution:
1. **Canonical UTC Storage:** Every slot, booking, and mentor session is stored internally as an ISO-8601 UTC timestamp (`YYYY-MM-DDTHH:mm:ss.sssZ`).
2. **Dynamic IANA Timezone Resolution:** We utilize the IANA Time Zone Database via Luxon. When a parent requests `2026-09-26` in `America/New_York`, the engine queries `zone.isInDST` to calculate the exact offset (`-04:00` for EDT) and formats the visual indicator pill (`☀️ Daylight Saving Time Active: EDT`).
3. **Shift Date Normalization Across Midnight:**
   - A US evening slot (e.g. 5:00 PM EDT on Saturday) corresponds to early morning (02:30 AM IST on Sunday) in India.
   - If mentor demo limits were calculated by pure calendar date in IST, a mentor working a night shift could take 2 sessions before midnight and 2 sessions after midnight (4 sessions in one shift!).
   - Our system implements `getOperationalShiftDate()`: sessions occurring between `00:00` and `07:00 AM IST` count toward the **shift date of the evening when the shift started**, strictly capping mentors at **2 demos per work shift**.

---

## 👨‍🏫 Mentor Rules & Assignment Algorithm

### Pre-seeded 10 Mentors:
Each mentor has defined working hours in IST to cover European and North American peak parent hours:
- **UK & EMEA Shifts (13:00 - 22:00 IST):** Aarav Sharma, Priya Nair.
- **UK & US Morning Shifts (14:00 - 23:00 IST):** Rohan Mukherjee, Ananya Rao.
- **US Prime Evening Shifts (18:00 - 03:00 IST):** Vikramaditya Iyer, Neha Gupta, Siddharth Verma, Kavya Patel.
- **US West Coast & Late Night Shifts (21:00 - 06:00 IST):** Aditya Kulkarni, Tanvi Joshi.

### Assignment Logic (`BookingService`):
When a parent selects a slot:
1. **Shift Check:** Validates that the slot is within the mentor's operational shift hours in IST.
2. **Collision Check:** Checks for time overlaps with confirmed bookings (`max(start1, start2) < min(end1, end2)`).
3. **Strict 2-Demo Limit:** Ensures `bookingsOnShiftDate.length < 2`. If a mentor has already taken 2 demos, they are excluded.
4. **Smart Load Balancing:** Candidate mentors are ranked:
   - *Primary:* Mentors with 0 demos booked today are prioritized over mentors with 1 demo.
   - *Secondary:* Mentors with specialized expertise in the chosen subject (Scratch, Python, Web Dev, Robotics, Math Olympiad, Roblox).
   - *Tertiary:* Highest teacher rating.

---

## 🛡️ Empathetic Error Handling & Edge Cases

When all 10 mentors are fully booked or have reached their daily 2-demo capacity:
1. **User-Friendly Error Message:** "All 10 mentors are either fully booked or have reached their maximum daily capacity of 2 demo classes for this time slot."
2. **Smart Alternative Suggestions:** The API automatically computes the 3 nearest available slots on the same date or the following day and presents them as 1-click selectable chips.
3. **Priority Waitlist:** Parents can join the waitlist with their ideal time window, notifying academic counselors for VIP slot accommodation.

---

## 💻 Virtual Live Classroom Demo

Clicking the dummy link (`https://meet.codeyoung.com/demo/CY-TR-xxxxxx`) opens our **interactive 1:1 Live Classroom preview**:
- Live session countdown timer (45:00 minutes).
- Mentor and Student video feeds with active audio indicators.
- **Interactive Python & Scratch Editor:** Parents and students can edit Python code and click **"Run Code"** to execute it in a simulated browser terminal.
- Milestone progress checklist tracking curriculum progress.
- Live chat channel.

---

## ⚡ 20-Parent Booking Simulation Test

To prove compliance with the prompt's volume requirement (**20 parents/day across 10 mentors capped at 2 demos**):
- Navigate to the **"20-Parent Test"** tab in the navbar.
- Click **"Simulate 20 Parents Booking"**.
- The engine runs 20 simultaneous parent requests from New York, Chicago, Denver, Los Angeles, and London.
- The audit report proves:
  - Exactly 20 trial classes are booked.
  - Every mentor takes at most 2 demos (`demosBooked <= 2`).
  - When an additional (21st) parent tries to book, the system handles the limit gracefully.

---

## 🚀 Setup & Local Execution Guide

### Prerequisites:
- **Node.js:** v18.0.0 or higher (Tested on v24.16.0)
- **npm:** v9.0.0 or higher (Tested on v11.13.0)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/DeekshaG96/codeyoung-trial-booking.git
cd codeyoung-trial-booking

# Install dependencies for both server and client in one command
npm run install:all
```

*(Alternatively, install individually: `cd server && npm install && cd ../client && npm install`)*

### 2. Run the Application

You can start both the backend API and frontend Vite dev server concurrently:

```bash
# From the root directory:
node start-dev.js
```

Or run them in separate terminal windows:

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
# Server starts at http://localhost:5001
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Vite client starts at http://localhost:3000
```

### 3. Open in Browser:
Visit **`http://localhost:3000`** in Google Chrome or any modern web browser.

---

## 🧪 Automated Testing Suite (Vitest)

The project includes an automated test suite with **23 Vitest unit tests** covering mathematical DST transitions, timezone precision, load balancing, collision avoidance, and system capacity limits:

```bash
# Run the test suite from root
npm test

# Or directly in the server directory
cd server && npm test
```

### Test Coverage Highlights:
- **`src/tests/dst.test.js` (8 tests):**
  - Mathematical proof that US "spring forward" (March 8, 2026) is a 23-hour day in UTC.
  - Proof that US "fall back" (November 1, 2026) is a 25-hour day in UTC.
  - Proof that UK "spring forward" & "fall back" days are 23h and 25h in UTC.
  - Verifies India (`Asia/Kolkata`) has NO DST (always fixed 24h, UTC+05:30).
  - Verifies that a fixed mentor instant in IST shifts clock hour in New York before vs after Nov 1, 2026 (EDT vs EST).
  - Dynamic `isInDST` detection and accurate offset formatting.
- **`src/tests/bookingService.test.js` (7 tests):**
  - Validation of mandatory input fields and timestamps.
  - Successful booking creation and dummy link generation.
  - **Strict 2-demo daily cap** enforcement per mentor.
  - **Load-balanced assignment:** prioritizes mentors with 0 demos over mentors with 1 demo.
  - **Collision avoidance:** prevents overlapping bookings for the same mentor.
  - Empathetic error state returning nearest slot recommendations and waitlist.
- **`src/tests/capacityAndSimulation.test.js` (3 tests):**
  - Automated 20-parent stress test proving all 20 bookings succeed across 10 mentors with `demosBooked <= 2`.
  - Rejection of the 21st parent overflow.
  - Midnight boundary normalization: `getOperationalShiftDate()` correctly groups 00:00–07:00 IST sessions to prevent exceeding 2 demos per shift.
- **`src/tests/timezoneService.test.js` (5 tests):**
  - Slot generation with dual-timezone metadata.
  - Subject filtering and RFC 5545 `.ics` iCalendar export format validation.

---

## 📡 API Reference Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint returning server status & mentor count |
| `GET` | `/api/available-slots?timezone=America/New_York&date=YYYY-MM-DD` | Returns prospective slots with DST metadata & mentor availability |
| `GET` | `/api/timezones` | Lists all supported international timezones with DST flags |
| `POST` | `/api/bookings` | Books trial class, matches mentor, enforces 2-demo cap, generates meeting link |
| `GET` | `/api/bookings` | Lists all confirmed bookings |
| `GET` | `/api/bookings/:id` | Retrieves specific booking details |
| `GET` | `/api/bookings/:id/calendar.ics` | Downloads RFC 5545 iCalendar invite |
| `POST` | `/api/bookings/waitlist` | Registers parent on priority waitlist |
| `GET` | `/api/mentors?date=YYYY-MM-DD` | Lists all 10 mentors with daily 2-demo quota meters |
| `GET` | `/api/mentors/:id/schedule` | Retrieves localized schedule for a specific mentor |
| `POST` | `/api/simulate/20-parents` | Triggers automated batch stress test of 20 parents |
| `POST` | `/api/reset-data` | Resets store back to initial seed state |
| `GET` | `/api/notifications` | Returns logs of dispatched localized emails |

---

## 📝 Submission Checklist

- [x] Full-Stack App: React frontend + Node.js Express backend.
- [x] 10 Mentors seeded with IST working hours and profiles.
- [x] Strict business rule enforced: mentors have at most 2 demo classes a day.
- [x] Time zones and Daylight Saving Time (DST) handled dynamically via Luxon.
- [x] Working dummy link generated (`https://meet.codeyoung.com/demo/:id`) taking users to a live interactive classroom.
- [x] Empathetic error handling with smart nearest available slot recommendations.
- [x] Automated 20-parent booking batch simulation test suite.
- [x] `README.md` complete with architecture, design rationale, and setup guide.
- [x] `TRANSCRIPT.md` included documenting AI pair-programming session.

---

*Engineered with precision by **Deeksha G** (SIT Mangaluru - 2027 Batch).*
