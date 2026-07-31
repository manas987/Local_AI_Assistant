export const config = {
  whisper: {
    model: "models/whisper/ggml-small-q8_0.bin",
  },

  recording: {
    sampleRate: 16000,
    channels: 1,
    seconds: 5,
  },

  llm: {
    model: "qwen3:1.7b",
  },
};
