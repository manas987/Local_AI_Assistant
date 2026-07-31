import { KokoroTTS } from "kokoro-js";
import { spawn } from "child_process";
import { promises as fs } from "fs";
import { join } from "path";
import { tmpdir } from "os";

const tts = await KokoroTTS.from_pretrained(
  "onnx-community/Kokoro-82M-v1.0-ONNX",
  {
    device: "cpu",
    dtype: "q8",
  },
);

export async function speak(text: string) {
  const audio = await tts.generate(text, {
    voice: "af_bella",
  });

  const file = join(tmpdir(), "jarlvis.wav");

  await audio.save(file);

  await new Promise<void>((resolve, reject) => {
    const player = spawn("afplay", [file]);

    player.on("close", () => resolve());
    player.on("error", reject);
  });

  await fs.unlink(file).catch(() => {});
}
