import ollama from "ollama";

export async function llm(model: string, message: string) {
  return await ollama.chat({
    model,
    think: false,
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
  });
}
