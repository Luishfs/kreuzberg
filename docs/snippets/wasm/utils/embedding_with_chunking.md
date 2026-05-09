```typescript title="WASM"
import init, { extractFile } from "kreuzberg-wasm";

await init();

// The WASM build can carry chunk metadata, but does not produce embeddings
// on its own — embedding requires ONNX Runtime models that are excluded
// from the WASM target. Generate embeddings from `chunk.content` using an
// external service (e.g. OpenAI embeddings, a Hugging Face Inference
// endpoint, or a separate native runtime).
const config = {
  chunking: {
    maxChars: 1024,
    chunkOverlap: 100,
  },
};

const result = await extractFile("document.pdf", undefined, config);
const chunks = result.chunks ?? [];
console.log(`Chunks: ${chunks.length}`);

const texts = chunks.map((chunk) => chunk.content);
console.log(`Text chunks ready for an external embedding service: ${texts.length}`);
```

<!-- snippet:syntax-only --> Embeddings are not generated in WASM. Pass `texts` to an external embedding service to attach vectors to each chunk.
