import { config } from "./config.js";
import { llm } from "./services/AssistantService.js";
import { transcribe } from "./services/SpeechService.js";
import { speak } from "./services/TTSService.js";
import {
  startAudioEngine,
  waitForAudio,
} from "./services/audiodetectionservice.js";
import { unlink } from "fs/promises";

startAudioEngine();

while (true) {
  try {
    const recording = await waitForAudio();

    process.stdout.write("transcribing...");
    const msg = await transcribe(recording, config.whisper.model);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);

    await unlink(recording);

    console.log(`User: ${msg}`);

    process.stdout.write("waiting for reply...");
    const reply = await llm(config.llm.model, msg);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);

    console.log(`Assistant: ${reply.message.content}`);

    await speak(reply.message.content);
  } catch (err) {
    console.error(err);
  }
}
