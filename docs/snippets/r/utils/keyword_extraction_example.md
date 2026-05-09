```r title="R"
library(kreuzberg)

keywords_cfg <- keyword_config(
  algorithm = "yake",
  max_keywords = 10L,
  min_score = 0.3
)

config <- extraction_config(keywords = keywords_cfg)
result <- extract_file_sync("research_paper.pdf", "application/pdf", config)

cat(sprintf("Content length: %d characters\n", nchar(result$content)))
if (!is.null(result$metadata$keywords)) {
  for (kw in result$metadata$keywords) {
    cat(sprintf("  - %s\n", kw))
  }
}
```
