```r title="R"
library(kreuzberg)

embedding <- embedding_config(
  model = list(preset = list(name = "balanced")),
  normalize = TRUE
)

chunking_cfg <- chunking_config(
  max_characters = 500L,
  overlap = 50L,
  embedding = embedding
)

config <- extraction_config(chunking = chunking_cfg)
result <- extract_file_sync("research_paper.pdf", "application/pdf", config)

for (i in seq_along(result$chunks)) {
  chunk <- result$chunks[[i]]
  cat(sprintf("Chunk %d/%d\n", i, length(result$chunks)))
  cat(sprintf("  Length: %d characters\n", nchar(chunk$content)))
  if (!is.null(chunk$embedding)) {
    cat(sprintf("  Embedding: %d dimensions\n", length(chunk$embedding)))
  }
}
```
