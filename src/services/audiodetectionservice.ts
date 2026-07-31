import { spawn } from "child_process";
import type { ChildProcessWithoutNullStreams } from "child_process";
import { EventEmitter } from "events";

const events = new EventEmitter();

let engine: ChildProcessWithoutNullStreams;

export function startAudioEngine() {
  engine = spawn(
    "./wakeword/.venv/bin/python",
    ["-u", "./wakeword/wake.py"],
  );

  engine.stdout.setEncoding("utf8");
  engine.stderr.setEncoding("utf8");

  engine.stdout.on("data", (data) => {
    for (const line of data.toString().trim().split("\n")) {

      if (line === "READY") {
        console.log("Audio engine ready");
        continue;
      }

      if (line.startsWith("AUDIO_READY ")) {
        const path = line.substring("AUDIO_READY ".length);
        events.emit("audio", path);
        continue;
      }

      console.log("PY:", line);
    }
  });

  engine.stderr.on("data", (data) => {
    console.error(data.toString());
  });
}

export function waitForAudio(): Promise<string> {
  return new Promise((resolve) => {
    events.once("audio", resolve);
  });
}