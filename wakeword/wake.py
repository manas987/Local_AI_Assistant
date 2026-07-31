import os
import time
from collections import deque

import numpy as np
import sounddevice as sd
import soundfile as sf
import torch

import openwakeword.utils
from openwakeword.model import Model
from silero_vad import load_silero_vad

# ==========================
# Config
# ==========================

SAMPLE_RATE = 16000
WAKE_BLOCKSIZE = 1280
VAD_BLOCKSIZE = 512

WAKE_THRESHOLD = 0.5
WAKE_COOLDOWN = 5.0

SPEECH_THRESHOLD = 0.5
START_FRAMES = 3
END_SILENCE_FRAMES = 25

PRE_ROLL = 10

os.makedirs("recordings", exist_ok=True)

# ==========================
# Models
# ==========================

openwakeword.utils.download_models()

wake_model = Model(
    wakeword_models=["hey_jarvis"],
    inference_framework="onnx",
)

vad_model = load_silero_vad()

last_wake = 0


# ==========================
# Wait for wake word
# ==========================

def wait_for_wake():
    global last_wake

    detected = False

    def callback(indata, frames, time_info, status):
        nonlocal detected
        global last_wake

        if detected:
            return

        score = wake_model.predict(indata[:, 0])["hey_jarvis"]

        if score > 0.35:
            print(f"SCORE: {score:.3f}")

        now = time.time()

        if (
            score > WAKE_THRESHOLD
            and now - last_wake > WAKE_COOLDOWN
        ):
            last_wake = now
            detected = True

    with sd.InputStream(
        samplerate=SAMPLE_RATE,
        channels=1,
        dtype="int16",
        blocksize=WAKE_BLOCKSIZE,
        callback=callback,
    ):
        while not detected:
            time.sleep(0.01)


# ==========================
# Record until silence
# ==========================

def record_until_silence():

    recording = False

    speech_frames = 0
    silence_frames = 0

    pre_buffer = deque(maxlen=PRE_ROLL)
    frames = []

    with sd.InputStream(
        samplerate=SAMPLE_RATE,
        channels=1,
        dtype="float32",
        blocksize=VAD_BLOCKSIZE,
    ) as stream:

        while True:

            audio, _ = stream.read(VAD_BLOCKSIZE)

            pre_buffer.append(audio.copy())

            chunk = torch.from_numpy(audio[:, 0])

            prob = vad_model(chunk, SAMPLE_RATE).item()

            if not recording:

                if prob > SPEECH_THRESHOLD:

                    speech_frames += 1

                    if speech_frames >= START_FRAMES:
                        recording = True
                        frames.extend(pre_buffer)
                        silence_frames = 0

                        print("Recording...", flush=True)

                else:
                    speech_frames = 0

                continue

            frames.append(audio.copy())

            if prob > SPEECH_THRESHOLD:
                silence_frames = 0
            else:
                silence_frames += 1

                if silence_frames >= END_SILENCE_FRAMES:
                    break

    audio = np.concatenate(frames, axis=0)

    filename = f"recordings/{int(time.time())}.wav"

    sf.write(filename, audio, SAMPLE_RATE)

    return filename


# ==========================
# Main
# ==========================

print("READY", flush=True)

while True:

    # Start every wake cycle with a fresh model state
    wake_model.reset()

    wait_for_wake()

    filename = record_until_silence()

    # Clear all wake-word history before listening again
    wake_model.reset()

    print(f"AUDIO_READY {filename}", flush=True)