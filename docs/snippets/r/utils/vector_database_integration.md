```r title="R"
library(kreuzberg)

document_id <- "doc-001"

embedding <- embedding_config(
  model = list(preset = list(name = "balanced")),
  normalize = TRUE,
  batch_size = 32L
)

chunking_cfg <- chunking_config(
  max_characters = 512L,
  overlap = 50L,
  embedding = embedding
)

config <- extraction_config(chunking = chunking_cfg)
result <- extract_file_sync("document.pdf", "application/pdf", config)

# Each chunk has $content, $embedding, and $metadata. Pass these directly
# to a vector database client (pgvector, Qdrant, Pinecone, etc.) along with
# the document_id stored as a metadata field.
cat(sprintf("document_id: %s\n", document_id))
cat(sprintf("chunks ready for upsert: %d\n", length(result$chunks)))

if (length(result$chunks) > 0L) {
  first <- result$chunks[[1]]
  cat(sprintf("first chunk: %d chars, embedding dim = %d\n",
              nchar(first$content),
              if (is.null(first$embedding)) 0L else length(first$embedding)))
}
```
