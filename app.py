import os
import tempfile
import requests
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Environment Variables
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY") or os.environ.get("GROK_API_KEY") or os.environ.get("XAI_API_KEY", "")

GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.5-flash-lite")
GEMINI_STT_MODEL = os.environ.get("GEMINI_STT_MODEL", "gemini-3.5-flash-lite")
GROQ_STT_MODEL = os.environ.get("GROQ_STT_MODEL", "whisper-large-v3")
GROQ_CHAT_MODEL = os.environ.get("GROQ_CHAT_MODEL", "qwen/qwen3.8-27b")

SYSTEM_PROMPT = (
    "You are Jarvis, the official Smart College Assistant for "
    "Navsahyadri Education Society's Group of Institutions (NESGI), Pune. "
    "Keep your answers extremely brief and punchy (under 30 words). "
    "Never use emojis or special markdown formatting, as your text will be "
    "displayed on a basic 16x2 character LCD screen."
)

# ----------------------------------------------------
# Audio-to-Text (STT) Functions with Fallback
# ----------------------------------------------------
def transcribe_audio_gemini(file_path, mime_type="audio/wav"):
    """Transcribe audio using Google Gemini multimodal inline data."""
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not configured")

    import base64
    with open(file_path, "rb") as f:
        audio_b64 = base64.b64encode(f.read()).decode("utf-8")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_STT_MODEL}:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": audio_b64
                        }
                    },
                    {
                        "text": "Transcribe this audio recording verbatim. Output only the exact transcribed speech, nothing else. If silent, return an empty string."
                    }
                ]
            }
        ]
    }
    resp = requests.post(url, json=payload, timeout=15)
    resp.raise_for_status()
    data = resp.json()
    candidates = data.get("candidates", [])
    if candidates and "content" in candidates[0]:
        parts = candidates[0]["content"].get("parts", [])
        if parts and "text" in parts[0]:
            return parts[0]["text"].strip()
    return ""

def transcribe_audio_groq(file_path):
    """Transcribe audio using Groq Whisper Cloud API."""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not configured")

    url = "https://api.groq.com/openai/v1/audio/transcriptions"
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
    with open(file_path, "rb") as f:
        files = {"file": ("audio.wav", f, "audio/wav")}
        data = {"model": GROQ_STT_MODEL, "temperature": "0"}
        resp = requests.post(url, headers=headers, files=files, data=data, timeout=15)
    resp.raise_for_status()
    result = resp.json()
    return result.get("text", "").strip()

def transcribe_audio_with_fallback(file_path, mime_type="audio/wav"):
    """Tries Gemini first, falls back to Groq Whisper (or vice-versa)."""
    errors = []

    # Attempt 1: Gemini
    if GEMINI_API_KEY:
        try:
            text = transcribe_audio_gemini(file_path, mime_type)
            if text:
                return text, "gemini"
        except Exception as e:
            print(f"[STT] Gemini failed ({e}). Falling back to Groq Whisper...")
            errors.append(f"Gemini: {e}")

    # Attempt 2: Groq Whisper
    if GROQ_API_KEY:
        try:
            text = transcribe_audio_groq(file_path)
            if text:
                return text, "groq"
        except Exception as e:
            print(f"[STT] Groq Whisper failed ({e}).")
            errors.append(f"Groq: {e}")

    raise RuntimeError(f"STT failed across all providers: {errors}")

# ----------------------------------------------------
# Text-to-Text (LLM) Functions with Fallback
# ----------------------------------------------------
def answer_query_gemini(question):
    """Generate Jarvis response using Gemini."""
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not configured")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": [{"parts": [{"text": question}]}],
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 80}
    }
    resp = requests.post(url, json=payload, timeout=15)
    resp.raise_for_status()
    data = resp.json()
    candidates = data.get("candidates", [])
    if candidates and "content" in candidates[0]:
        parts = candidates[0]["content"].get("parts", [])
        if parts and "text" in parts[0]:
            return parts[0]["text"].strip()
    return "I am JARVIS, the Smart College Assistant."

def answer_query_groq(question):
    """Generate Jarvis response using Groq / Grok (OpenAI compatible)."""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not configured")

    is_xai = GROQ_API_KEY.startswith("xai-")
    endpoint = "https://api.x.ai/v1/chat/completions" if is_xai else "https://api.groq.com/openai/v1/chat/completions"
    model = os.environ.get("GROK_MODEL", "grok-beta") if is_xai else GROQ_CHAT_MODEL

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": question}
        ],
        "max_tokens": 80,
        "temperature": 0.2
    }
    resp = requests.post(endpoint, headers=headers, json=payload, timeout=15)
    resp.raise_for_status()
    data = resp.json()
    return data["choices"][0]["message"]["content"].strip()

def answer_query_with_fallback(question):
    """Tries Gemini first, falls back to Groq / Grok."""
    errors = []

    # Attempt 1: Gemini
    if GEMINI_API_KEY:
        try:
            ans = answer_query_gemini(question)
            if ans:
                return ans, "gemini"
        except Exception as e:
            print(f"[LLM] Gemini failed ({e}). Falling back to Groq/Grok...")
            errors.append(f"Gemini: {e}")

    # Attempt 2: Groq / Grok
    if GROQ_API_KEY:
        try:
            ans = answer_query_groq(question)
            if ans:
                return ans, "groq"
        except Exception as e:
            print(f"[LLM] Groq failed ({e}).")
            errors.append(f"Groq: {e}")

    raise RuntimeError(f"LLM failed across all providers: {errors}")

# ----------------------------------------------------
# Route: POST /api/jarvis
# ----------------------------------------------------
@app.route("/api/jarvis", methods=["POST"])
def handle_jarvis_query():
    # 1. Check if the audio file was sent
    audio_file = request.files.get("audio") or request.files.get("file")
    if not audio_file:
        return jsonify({"answer": "Error: No audio received"}), 400

    filename = secure_filename(audio_file.filename or "audio.wav")
    file_path = os.path.join(tempfile.gettempdir(), filename)
    audio_file.save(file_path)

    try:
        # 2. Convert Speech to Text (Gemini <-> Groq Whisper Fallback)
        user_question, stt_prov = transcribe_audio_with_fallback(file_path)
        print(f"[POST /api/jarvis] User asked via {stt_prov}: {user_question}")

        if not user_question.strip():
            return jsonify({"answer": "I didn't catch that.", "question": ""})

        # 3. Generate Jarvis Answer (Gemini <-> Groq/Grok Fallback)
        jarvis_answer, llm_prov = answer_query_with_fallback(user_question)
        print(f"[POST /api/jarvis] Jarvis answered via {llm_prov}: {jarvis_answer}")

        # 4. Return answer in JSON format expected by laptop bridge
        return jsonify({
            "answer": jarvis_answer,
            "question": user_question,
            "stt_provider": stt_prov,
            "llm_provider": llm_prov
        })

    except Exception as e:
        print(f"Error processing audio query: {e}")
        return jsonify({"answer": "Backend processing error."}), 500

    finally:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except OSError:
                pass

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "healthy",
        "service": "Jarvis Python Audio Bridge Backend",
        "fallback_enabled": True,
        "providers": {
            "gemini": bool(GEMINI_API_KEY),
            "groq_grok": bool(GROQ_API_KEY)
        }
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
