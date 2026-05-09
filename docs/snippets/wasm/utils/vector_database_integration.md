```typescript title="WASM"
import init, { extractFile } from "kreuzberg-wasm";

await init();

const config = {
  chunking: {
    maxChars: 512,
    chunkOverlap: 50,
  },
};

const result = await extractFile("document.pdf", undefined, config);

if (result.chunks) {
  // The WASM crate does not generate embeddings — produce them externally
  // and upsert into your vector database alongside the chunk content and
  // metadata fields exposed below.
  for (const chunk of result.chunks) {
    console.log(`Chunk: ${chunk.content.slice(0, 100)}...`);
    console.log(`Position: ${chunk.metadata.byteStart}-${chunk.metadata.byteEnd}`);
  }
}
```

<!-- snippet:syntax-only --> WASM has no built-in embedding model; pair this snippet with an external embedding service before writing to a vector store.
