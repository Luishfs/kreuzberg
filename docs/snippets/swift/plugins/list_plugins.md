```swift title="Swift"
import Kreuzberg

let extractors = try Kreuzberg.listDocumentExtractors()
let renderers = try Kreuzberg.listRenderers()
let processors = try Kreuzberg.listPostProcessors()
let ocrBackends = try Kreuzberg.listOcrBackends()
let validators = try Kreuzberg.listValidators()
let embeddingBackends = try Kreuzberg.listEmbeddingBackends()

print("Extractors: \(extractors)")
print("Renderers: \(renderers)")
print("Processors: \(processors)")
print("OCR backends: \(ocrBackends)")
print("Validators: \(validators)")
print("Embedding backends: \(embeddingBackends)")
```
