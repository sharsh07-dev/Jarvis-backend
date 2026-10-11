# JARVIS — Smart College Assistant Backend

An AI-powered conversational helpdesk backend and knowledge retrieval service developed for **Navsahyadri Education Society's Group of Institutions (NESGI), Pune**.

JARVIS pairs **Firebase Cloud Firestore** (holding verified college records) with **Google Gemini (`gemini-3.5-flash-lite`)** via the modern `@google/genai` SDK to deliver accurate, grounded answers for students, staff, and hardware clients like ESP32 microcontrollers.

---

## Architecture Overview

```
                      +-----------------------------+
                      |   Client Applications       |
                      | (Web / Mobile / ESP32-WROOM)|
                      +--------------+--------------+
                                     |
                               POST /ask
                                     v
                      +-----------------------------+
                      |     Express.js Server       |
                      |  - In-Memory Rate Limiter   |
                      |  - 16KB Request Body Limit  |
                      |  - Deterministic Routing    |
                      |  - 5-Min TTL In-Memory Cache|
                      +-------+-------------+-------+
                              |             |
           Targeted Evidence  |             | Grounded Prompt + Boundary Tags
                              v             v
       +------------------------+     +-------------------------------+
       | Firebase Cloud         |     | Google Gemini API             |
       | Firestore DB           |     | - gemini-3.5-flash-lite       |
       | (Verified Collections) |     | - System Prompt Isolation     |
       +------------------------+     | - Grounded Context Only       |
                                      +-------------------------------+
```

---

## Features

- **Grounded RAG Pipeline**: Queries are dynamically routed to relevant database collections (locations, faculty, admissions, placements, departments, courses, contact info) rather than dumping the whole database into every prompt.
- **Prompt Injection Defense**: Untrusted user inputs are segregated into `<student_question>` tags, and database evidence is strictly encapsulated in `<verified_college_records>` tags with system-level instruction guardrails.
- **Strict Anti-Hallucination**: If evidence is missing, contradictory, or insufficient, JARVIS responds with a standardized fallback message.
- **Deterministic Edge Handling**: Instant local greeting responses without wasting LLM tokens or incurring database reads.
- **ESP32 & Hardware Ready**: Responses are concise, factual, and formatted as natural sentences (1–3 sentences) optimal for OLED display screens and text-to-speech audio playback.
- **Performance Optimized**: 5-minute TTL caching eliminates redundant Firestore roundtrips, reducing latency from ~7s to under 1s.
- **Security Hardened**: In-memory rate limiting (60 requests/minute per IP), 16KB JSON payload limit, 12s execution timeout, and sanitization of internal error stacks.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Basic server status and model information |
| `GET` | `/health` | Server and Firestore connectivity check with cached counts |
| `GET` | `/college` | Returns official contact, address, and college details |
| `GET` | `/departments` | Lists academic departments and department heads |
| `GET` | `/courses` | Lists degrees and courses offered |
| `GET` | `/locations` | Campus room directory, labs, and classrooms |
| `GET` | `/faculty` | Faculty members, designations, and subjects taught |
| `GET` | `/admissions` | Admission procedures, eligibility, and required documents |
| `GET` | `/placements` | Placement packages, top recruiters, and training programs |
| `POST` | `/ask` | AI question-answering endpoint with RAG context injection |
| `POST` | `/voice` | Voice endpoint: accepts audio -> Groq STT -> JARVIS answer -> Groq TTS |
| `POST` | `/ask-voice` | Alias for `/voice` supporting multipart and raw audio |
| `POST` | `/speech` | Direct text-to-speech generation via Groq |


---

## Getting Started

### Prerequisites
- Node.js (v18+)
- Firebase project with Cloud Firestore
- Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sharsh07-dev/Jarvis-backend.git
   cd Jarvis-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-3.5-flash-lite
   PORT=3000
   CORS_ORIGIN=*
   FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
   ```

4. Place your Firebase service account private key at `./serviceAccountKey.json`.

5. Start the server:
   ```bash
   npm start
   ```

6. Run the automated non-destructive test suite:
   ```bash
   npm test
   ```

---

## Testing `POST /ask`

```bash
curl -X POST http://localhost:3000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Where is classroom 213 located?"}'
```

Response:
```json
{
  "answer": "Room 213 is designated as the SE A classroom for the Computer Engineering department, corresponding to the Second Year."
}
```

---

## License

This project is licensed under the MIT License.
