```r title="R"
library(kreuzberg)

llm <- llm_config(model = "openai/gpt-4o-mini")
schema <- list(
  type = "object",
  properties = list(
    title = list(type = "string"),
    authors = list(type = "array", items = list(type = "string")),
    date = list(type = "string")
  ),
  required = c("title", "authors", "date"),
  additionalProperties = FALSE
)

structured <- structured_extraction_config(
  schema = schema,
  llm = llm,
  strict = TRUE
)

config <- extraction_config(structured_extraction = structured)
result <- extract_file_sync("paper.pdf", "application/pdf", config)

cat(result$structured_output, "\n")
```

<!-- snippet:syntax-only --> Requires network access to the configured LLM provider and a valid API key in the host environment.
