```swift title="Swift"
import Kreuzberg

// Clear all registered plugins in each registry
try Kreuzberg.clearDocumentExtractors()
try Kreuzberg.clearRenderers()
try Kreuzberg.clearOcrBackends()
try Kreuzberg.clearPostProcessors()
try Kreuzberg.clearValidators()
try Kreuzberg.clearEmbeddingBackends()

print("All plugins cleared")
```
