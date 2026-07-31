# Bella

Jarlvis is a fully local AI voice assistant built with **TypeScript**, **Python**, **Whisper.cpp**, **Ollama**, **OpenWakeWord**, **Silero VAD**, and **Kokoro TTS**.

The goal is to create a privacy-first, Jarvis-like assistant that runs completely on your machine with support for wake words, speech, memory, reasoning, and tool use.

---

# Features

## Voice

- Wake word detection (OpenWakeWord)
- Voice Activity Detection (Silero VAD)
- Record until silence
- Whisper.cpp speech-to-text
- Kokoro text-to-speech
- Fully offline speech pipeline

## AI

- Local LLM using Ollama
- Qwen3
- Configurable system prompt _(planned)_
- Conversation memory _(planned)_
- Context window management _(planned)_

## Architecture

- Fastify backend
- TypeScript orchestration
- Python audio engine
- One microphone owner architecture
- Offline-first

---

# Current Pipeline

```text
          Microphone
               │
               ▼
      Python Audio Engine
               │
     ┌─────────┴─────────┐
     │                   │
OpenWakeWord        Silero VAD
     │                   │
     └─────────┬─────────┘
               ▼
      Record Until Silence
               │
               ▼
           WAV Recording
               │
               ▼
          Whisper.cpp
               │
               ▼
            Ollama
               │
               ▼
             Qwen3
               │
               ▼
          Kokoro TTS
               │
               ▼
            Speakers
```

---

# Roadmap

## Phase 1 — Core Infrastructure

- [x] Create backend (Fastify/Node)
- [x] Integrate Ollama
- [x] Download Qwen3 1.7B
- [x] Create configuration system
- [x] Add logging
- [x] Add environment variables
- [ ] Run as background service (launchd)

---

## Phase 2 — Voice

### Speech-to-Text

- [x] Install Whisper.cpp
- [x] Record microphone
- [x] Convert speech to text
- [x] Add wake word detection
- [x] Ignore background speech

### Text-to-Speech

- [x] Install Kokoro TTS
- [x] Generate speech
- [x] Stream speech
- [ ] Stop speaking if interrupted

---

## Phase 3 — Local LLM

### Ollama

- [x] Load Qwen3 1.7B
- [ ] System prompt
- [ ] Conversation history
- [ ] Context window management

### Thinking Router

- [ ] Simple Tool
- [ ] Fast Mode
- [ ] Thinking Mode

Example:

```
Pause music
        ↓
Simple Tool

------------------------

Hello
        ↓
Fast

------------------------

Plan my trip
        ↓
Thinking
```

---

## Phase 4 — Tool System

Every capability will be implemented as a tool.

```ts
interface Tool {
  name: string;
  description: string;
  execute(args): Promise<any>;
}
```

Planned tools:

- Terminal
- Browser
- Filesystem
- Spotify
- Calendar
- Notes
- Clipboard
- Email
- Weather
- Search
- App launcher
- Window management
- System controls

---

# Installation

## Clone

```bash
git clone https://github.com/<username>/bella.git
cd bella
```

---

## Install Node dependencies

```bash
npm install
```

---

## Install Ollama

Install Ollama and download the model.

```bash
ollama pull qwen3:1.7b
```

---

## Python Audio Engine

```bash
cd wakeword

python3.11 -m venv .venv

source .venv/bin/activate

pip install --upgrade pip

pip install \
openwakeword \
sounddevice \
soundfile \
onnxruntime \
silero-vad \
torch \
numpy
```

---

## Environment

Create a `.env`

```env
OLLAMA_MODEL=qwen3:1.7b
```

---

## Run

```bash
npx tsx src/index.ts
```

---

# Project Structure

```text
bella/
│
├── src/
│   ├── config.ts
│   ├── index.ts
│   └── services/
│       ├── AssistantService.ts
│       ├── AudioEngine.ts
│       ├── SpeechService.ts
│       └── TTSService.ts
│
├── wakeword/
│   ├── wake.py
│   └── .venv/
│
├── recordings/
├── models/
├── .env
├── package.json
└── README.md
```

---

# Design Philosophy

Bella is built around four principles.

- Completely offline
- Modular architecture
- Fast local inference
- Privacy first

The microphone is owned exclusively by the Python audio engine while Node.js focuses on orchestration, LLM inference, tools, and TTS.

---

# Planned Features

- Background service
- Interruptible speech
- Long-term memory
- Context management
- Thinking router
- Tool calling
- Browser automation
- Terminal automation
- Vision
- Multi-agent architecture
- Plugin system
- Custom wake words
- Streaming LLM responses
- Streaming TTS
- Cross-platform support

---

# Tech Stack

- TypeScript
- Fastify
- Python
- Whisper.cpp
- Ollama
- Qwen3
- OpenWakeWord
- Silero VAD
- Kokoro TTS
- ONNX Runtime

---

# License

MIT
