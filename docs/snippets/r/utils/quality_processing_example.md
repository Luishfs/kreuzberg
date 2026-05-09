```r title="R"
library(kreuzberg)

config <- extraction_config(enable_quality_processing = TRUE)
result <- extract_file_sync("scanned_document.pdf", "application/pdf", config)

cat(sprintf("Content length: %d characters\n", nchar(result$content)))
if (!is.null(result$quality_score)) {
  cat(sprintf("Quality score: %.2f\n", result$quality_score))
  if (result$quality_score < 0.5) {
    cat("Warning: low quality extraction\n")
  }
}
```
