```typescript title="WASM"
// The WASM crate does not export a standalone embedding function:
// the ONNX Runtime models that back native `embedTexts` are excluded
// from the WASM target. Use an external embedding service from the
// host that loads kreuzberg-wasm.
//
// Example: call OpenAI's embeddings endpoint from the same Node host.
async function embedTexts(texts: string[]): Promise<number[][]> {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: texts,
    }),
  });
  const json = (await response.json()) as { data: Array<{ embedding: number[] }> };
  return json.data.map((entry) => entry.embedding);
}

const embeddings = await embedTexts(["Hello, world!", "Kreuzberg is fast"]);
console.log(embeddings.length);        // 2
console.log(embeddings[0].length);     // depends on the chosen model
```

<!-- snippet:syntax-only --> The WASM target ships without ONNX Runtime, so kreuzberg-wasm has no `embedTexts` export. Generate embeddings from an external service or a native binding.
