import { spawn } from "child_process";

export async function transcribe(audioPath: string, modelPath: string) {
  return new Promise<string>((resolve, reject) => {
    const whisper = spawn("whisper-cli", [
      "-m",
      modelPath,
      "-f",
      audioPath,
      "-l",
      "auto",
      "-nt",
    ]);

    let transcript = "";
    let errorOutput = "";

    whisper.stdout.on("data", (data) => {
      transcript += data.toString();
    });

    whisper.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    whisper.on("error", reject);

    whisper.on("close", (code) => {
      if (code === 0) {
        resolve(transcript.trim());
      } else {
        reject(new Error(`Whisper exited with code ${code}\n${errorOutput}`));
      }
    });
  });
}
