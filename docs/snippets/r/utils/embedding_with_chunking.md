```r title="R"
library(kreuzberg)

embedding <- embedding_config(
  model = list(preset = list(name = "balanced")),
  normalize = TRUE,
  batch_size = 32L
)

chunking_cfg <- chunking_config(
  max_characters = 1024L,
  overlap = 100L,
  embedding = embedding
)

config <- extraction_config(chunking = chunking_cfg)
result <- extract_file_sync("document.pdf", "application/pdf", config)

cat(sprintf("Chunks with embeddings: %d\n", length(result$chunks)))
```
