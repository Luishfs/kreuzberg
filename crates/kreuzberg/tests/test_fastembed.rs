//! Integration tests for the vendored embedding engine.
//! Tests verify that the embedding pipeline works end-to-end via the public API.

#[cfg(feature = "embeddings")]
#[tokio::test]
async fn test_generate_embeddings_for_chunks_basic() {
    use kreuzberg::core::config::{EmbeddingConfig, EmbeddingModelType};
    use kreuzberg::embeddings::generate_embeddings_for_chunks;
    use kreuzberg::types::{Chunk, ChunkMetadata};

    let mut chunks = vec![
        Chunk {
            content: "Hello world, this is the first chunk.".to_string(),
            embedding: None,
            metadata: ChunkMetadata {
                byte_start: 0,
                byte_end: 38,
                chunk_index: 0,
                total_chunks: 1,
                token_count: None,
                first_page: None,
                last_page: None,
                heading_context: None,
            },
        },
        Chunk {
            content: "This is the second chunk with different content.".to_string(),
            embedding: None,
            metadata: ChunkMetadata {
                byte_start: 39,
                byte_end: 87,
                chunk_index: 1,
                total_chunks: 1,
                token_count: None,
                first_page: None,
                last_page: None,
                heading_context: None,
            },
        },
        Chunk {
            content: "And this is the third and final chunk.".to_string(),
            embedding: None,
            metadata: ChunkMetadata {
                byte_start: 88,
                byte_end: 126,
                chunk_index: 2,
                total_chunks: 1,
                token_count: None,
                first_page: None,
                last_page: None,
                heading_context: None,
            },
        },
    ];

    let config = EmbeddingConfig {
        model: EmbeddingModelType::Preset {
            name: "fast".to_string(),
        },
        batch_size: 32,
        normalize: false,
        show_download_progress: false,
        cache_dir: None,
    };

    let result = generate_embeddings_for_chunks(&mut chunks, &config);
    assert!(result.is_ok(), "Failed to generate embeddings: {:?}", result.err());

    for (i, chunk) in chunks.iter().enumerate() {
        assert!(chunk.embedding.is_some(), "Chunk {} missing embedding", i);

        let embedding = chunk.embedding.as_ref().expect("Operation failed");
        assert_eq!(embedding.len(), 384, "Chunk {} has wrong embedding dimensions", i);

        let sum: f32 = embedding.iter().sum();
        assert!(sum.abs() > 0.0001, "Chunk {} embedding appears to be all zeros", i);
    }
}

#[cfg(feature = "embeddings")]
#[tokio::test]
async fn test_generate_embeddings_for_chunks_normalization() {
    use kreuzberg::core::config::{EmbeddingConfig, EmbeddingModelType};
    use kreuzberg::embeddings::generate_embeddings_for_chunks;
    use kreuzberg::types::{Chunk, ChunkMetadata};

    let test_text = "This is a test sentence for normalization testing.";

    let mut chunks_no_norm = vec![Chunk {
        content: test_text.to_string(),
        embedding: None,
        metadata: ChunkMetadata {
            byte_start: 0,
            byte_end: test_text.len(),
            chunk_index: 0,
            total_chunks: 1,
            token_count: None,
            first_page: None,
            last_page: None,
            heading_context: None,
        },
    }];

    let config_no_norm = EmbeddingConfig {
        model: EmbeddingModelType::Preset {
            name: "fast".to_string(),
        },
        batch_size: 32,
        normalize: false,
        show_download_progress: false,
        cache_dir: None,
    };

    generate_embeddings_for_chunks(&mut chunks_no_norm, &config_no_norm)
        .expect("Failed to generate non-normalized embeddings");

    let mut chunks_norm = vec![Chunk {
        content: test_text.to_string(),
        embedding: None,
        metadata: ChunkMetadata {
            byte_start: 0,
            byte_end: test_text.len(),
            chunk_index: 0,
            total_chunks: 1,
            token_count: None,
            first_page: None,
            last_page: None,
            heading_context: None,
        },
    }];

    let config_norm = EmbeddingConfig {
        model: EmbeddingModelType::Preset {
            name: "fast".to_string(),
        },
        batch_size: 32,
        normalize: true,
        show_download_progress: false,
        cache_dir: None,
    };

    generate_embeddings_for_chunks(&mut chunks_norm, &config_norm).expect("Failed to generate normalized embeddings");

    let embedding_norm = chunks_norm[0].embedding.as_ref().expect("Operation failed");

    let magnitude_norm: f32 = embedding_norm.iter().map(|x| x * x).sum::<f32>().sqrt();

    assert!(
        (magnitude_norm - 1.0).abs() < 0.01,
        "Normalized embedding should have unit magnitude (got {})",
        magnitude_norm
    );
}

#[cfg(feature = "embeddings")]
#[tokio::test]
async fn test_generate_embeddings_for_chunks_empty_input() {
    use kreuzberg::core::config::{EmbeddingConfig, EmbeddingModelType};
    use kreuzberg::embeddings::generate_embeddings_for_chunks;
    use kreuzberg::types::Chunk;

    let mut empty_chunks: Vec<Chunk> = vec![];

    let config = EmbeddingConfig {
        model: EmbeddingModelType::Preset {
            name: "fast".to_string(),
        },
        batch_size: 32,
        normalize: false,
        show_download_progress: false,
        cache_dir: None,
    };

    let result = generate_embeddings_for_chunks(&mut empty_chunks, &config);
    assert!(result.is_ok(), "Empty input should be handled gracefully");
}

#[cfg(feature = "embeddings")]
#[tokio::test]
async fn test_generate_embeddings_for_chunks_invalid_preset() {
    use kreuzberg::core::config::{EmbeddingConfig, EmbeddingModelType};
    use kreuzberg::embeddings::generate_embeddings_for_chunks;
    use kreuzberg::types::{Chunk, ChunkMetadata};

    let mut chunks = vec![Chunk {
        content: "Test content".to_string(),
        embedding: None,
        metadata: ChunkMetadata {
            byte_start: 0,
            byte_end: 12,
            chunk_index: 0,
            total_chunks: 1,
            token_count: None,
            first_page: None,
            last_page: None,
            heading_context: None,
        },
    }];

    let config = EmbeddingConfig {
        model: EmbeddingModelType::Preset {
            name: "nonexistent_preset".to_string(),
        },
        batch_size: 32,
        normalize: false,
        show_download_progress: false,
        cache_dir: None,
    };

    let result = generate_embeddings_for_chunks(&mut chunks, &config);
    assert!(result.is_err(), "Should return error for unknown preset");
}

#[cfg(feature = "embeddings")]
#[tokio::test]
async fn test_generate_embeddings_for_chunks_batch_size() {
    use kreuzberg::core::config::{EmbeddingConfig, EmbeddingModelType};
    use kreuzberg::embeddings::generate_embeddings_for_chunks;
    use kreuzberg::types::{Chunk, ChunkMetadata};

    let mut chunks: Vec<Chunk> = (0..10)
        .map(|i| Chunk {
            content: format!("This is test chunk number {}.", i),
            embedding: None,
            metadata: ChunkMetadata {
                byte_start: i * 30,
                byte_end: (i + 1) * 30,
                chunk_index: i,
                total_chunks: 10,
                token_count: None,
                first_page: None,
                last_page: None,
                heading_context: None,
            },
        })
        .collect();

    let config = EmbeddingConfig {
        model: EmbeddingModelType::Preset {
            name: "fast".to_string(),
        },
        batch_size: 3, // small batch to test multi-batch path
        normalize: false,
        show_download_progress: false,
        cache_dir: None,
    };

    let result = generate_embeddings_for_chunks(&mut chunks, &config);
    assert!(result.is_ok(), "Processing failed: {:?}", result.err());

    for (i, chunk) in chunks.iter().enumerate() {
        assert!(chunk.embedding.is_some(), "Chunk {} missing embedding", i);
        assert_eq!(chunk.embedding.as_ref().unwrap().len(), 384, "Chunk {} wrong dims", i);
    }
}

#[cfg(all(feature = "embeddings", feature = "chunking"))]
#[tokio::test]
async fn test_generate_embeddings_chunking_integration() {
    use kreuzberg::chunking::{ChunkingConfig, chunk_text};
    use kreuzberg::core::config::{EmbeddingConfig, EmbeddingModelType};
    use kreuzberg::embeddings::generate_embeddings_for_chunks;

    let text = "This is a test document. It has multiple sentences. \
                Each sentence should be chunked appropriately. \
                The chunking system should create overlapping chunks. \
                Finally, we will generate embeddings for each chunk.";

    let chunking_config = ChunkingConfig {
        max_characters: 50,
        overlap: 10,
        ..Default::default()
    };

    let mut chunking_result = chunk_text(text, &chunking_config, None).expect("Chunking failed");

    assert!(chunking_result.chunks.len() > 1, "Should create multiple chunks");

    let embedding_config = EmbeddingConfig {
        model: EmbeddingModelType::Preset {
            name: "fast".to_string(),
        },
        batch_size: 32,
        normalize: true,
        show_download_progress: false,
        cache_dir: None,
    };

    let result = generate_embeddings_for_chunks(&mut chunking_result.chunks, &embedding_config);
    assert!(result.is_ok(), "Embedding generation failed: {:?}", result.err());

    for (i, chunk) in chunking_result.chunks.iter().enumerate() {
        assert!(chunk.embedding.is_some(), "Chunk {} missing embedding", i);

        let embedding = chunk.embedding.as_ref().unwrap();
        assert_eq!(embedding.len(), 384, "Chunk {} wrong dims", i);

        let magnitude: f32 = embedding.iter().map(|x| x * x).sum::<f32>().sqrt();
        assert!(
            (magnitude - 1.0).abs() < 0.01,
            "Chunk {} not normalized (magnitude={})",
            i,
            magnitude
        );
    }
}
