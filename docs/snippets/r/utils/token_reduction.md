```r title="R"
library(kreuzberg)

reduction <- token_reduction_options(
  mode = "moderate",
  preserve_important_words = TRUE
)

config <- extraction_config(token_reduction = reduction)
result <- extract_file_sync("document.pdf", "application/pdf", config)

cat(result$content)
```
