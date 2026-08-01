import ollama from "ollama";
import { SYSTEM_PROMPT } from "../SystemPrompt.js";
import { messages } from "./MemoryService.js";

export async function llm(model: string) {
  return await ollama.chat({
    model,
    think: false,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...messages,
    ],
  });
}