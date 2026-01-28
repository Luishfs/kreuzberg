/**
 * Configuration interfaces for Kreuzberg extraction options.
 *
 * These types define all configurable parameters for document extraction,
 * including OCR, chunking, image processing, and post-processing options.
 */

// ============================================================================
// ============================================================================

export interface TesseractConfig {
	psm?: number;
	enableTableDetection?: boolean;
	tesseditCharWhitelist?: string;
}

export interface OcrConfig {
	backend: string;
	language?: string;
	tesseractConfig?: TesseractConfig;
}

export interface ChunkingConfig {
	maxChars?: number;
	maxOverlap?: number;
	/**
	 * @deprecated Since 4.2.0, use `maxChars` instead
	 */
	chunkSize?: number;
	/**
	 * @deprecated Since 4.2.0, use `maxOverlap` instead
	 */
	chunkOverlap?: number;
	preset?: string;
	embedding?: Record<string, unknown>;
	enabled?: boolean;
}

export interface LanguageDetectionConfig {
	enabled?: boolean;
	minConfidence?: number;
	detectMultiple?: boolean;
}

export interface TokenReductionConfig {
	mode?: string;
	preserveImportantWords?: boolean;
}

export interface FontConfig {
	enabled?: boolean;
	customFontDirs?: string[];
}

export interface PdfConfig {
	extractImages?: boolean;
	passwords?: string[];
	extractMetadata?: boolean;
	fontConfig?: FontConfig;
}

export interface ImageExtractionConfig {
	extractImages?: boolean;
	targetDpi?: number;
	maxImageDimension?: number;
	autoAdjustDpi?: boolean;
	minDpi?: number;
	maxDpi?: number;
}

export interface PostProcessorConfig {
	enabled?: boolean;
	enabledProcessors?: string[];
	disabledProcessors?: string[];
}

export interface HtmlPreprocessingOptions {
	enabled?: boolean;
	preset?: "minimal" | "standard" | "aggressive";
	removeNavigation?: boolean;
	removeForms?: boolean;
}

export interface HtmlConversionOptions {
	headingStyle?: "atx" | "underlined" | "atx_closed";
	listIndentType?: "spaces" | "tabs";
	listIndentWidth?: number;
	bullets?: string;
	strongEmSymbol?: string;
	escapeAsterisks?: boolean;
	escapeUnderscores?: boolean;
	escapeMisc?: boolean;
	escapeAscii?: boolean;
	codeLanguage?: string;
	autolinks?: boolean;
	defaultTitle?: boolean;
	brInTables?: boolean;
	hocrSpatialTables?: boolean;
	highlightStyle?: "double_equal" | "html" | "bold" | "none";
	extractMetadata?: boolean;
	whitespaceMode?: "normalized" | "strict";
	stripNewlines?: boolean;
	wrap?: boolean;
	wrapWidth?: number;
	convertAsInline?: boolean;
	subSymbol?: string;
	supSymbol?: string;
	newlineStyle?: "spaces" | "backslash";
	codeBlockStyle?: "indented" | "backticks" | "tildes";
	keepInlineImagesIn?: string[];
	encoding?: string;
	debug?: boolean;
	stripTags?: string[];
	preserveTags?: string[];
	preprocessing?: HtmlPreprocessingOptions;
}

/**
 * Keyword extraction algorithm type.
 *
 * Supported algorithms:
 * - "yake": YAKE (Yet Another Keyword Extractor) - statistical approach
 * - "rake": RAKE (Rapid Automatic Keyword Extraction) - co-occurrence based
 */
export type KeywordAlgorithm = "yake" | "rake";

/**
 * YAKE algorithm-specific parameters.
 */
export interface YakeParams {
	/** Window size for co-occurrence analysis (default: 2) */
	windowSize?: number;
}

/**
 * RAKE algorithm-specific parameters.
 */
export interface RakeParams {
	/** Minimum word length to consider (default: 1) */
	minWordLength?: number;

	/** Maximum words in a keyword phrase (default: 3) */
	maxWordsPerPhrase?: number;
}

/**
 * Keyword extraction configuration.
 *
 * Controls how keywords are extracted from text, including algorithm selection,
 * scoring thresholds, n-gram ranges, and language-specific settings.
 */
export interface KeywordConfig {
	/** Algorithm to use for extraction (default: "yake") */
	algorithm?: KeywordAlgorithm;

	/** Maximum number of keywords to extract (default: 10) */
	maxKeywords?: number;

	/** Minimum score threshold 0.0-1.0 (default: 0.0) */
	minScore?: number;

	/** N-gram range [min, max] for keyword extraction (default: [1, 3]) */
	ngramRange?: [number, number];

	/** Language code for stopword filtering (e.g., "en", "de", "fr") */
	language?: string;

	/** YAKE-specific tuning parameters */
	yakeParams?: YakeParams;

	/** RAKE-specific tuning parameters */
	rakeParams?: RakeParams;
}

/**
 * Extracted keyword with relevance metadata.
 *
 * Represents a single keyword extracted from text along with its relevance score,
 * the algorithm that extracted it, and optional position information.
 */
export interface ExtractedKeyword {
	/** The keyword text */
	text: string;

	/** Relevance score (higher is better, algorithm-specific range) */
	score: number;

	/** Algorithm that extracted this keyword */
	algorithm: KeywordAlgorithm;

	/** Optional positions where keyword appears in text (character offsets) */
	positions?: number[];
}

/**
 * Page extraction and tracking configuration.
 *
 * Controls whether Kreuzberg tracks page boundaries and optionally inserts page markers
 * into the extracted content.
 *
 * @example
 * ```typescript
 * // Basic page tracking
 * const config: PageConfig = {
 *   extractPages: true,
 *   insertPageMarkers: false
 * };
 *
 * // With custom page marker format
 * const config: PageConfig = {
 *   extractPages: true,
 *   insertPageMarkers: true,
 *   markerFormat: '\\n--- Page {page_num} ---\\n'
 * };
 * ```
 */
export interface PageConfig {
	/**
	 * Enable page tracking and per-page extraction.
	 * Default: false
	 */
	extractPages?: boolean;

	/**
	 * Insert page markers into the main content string.
	 * Default: false
	 */
	insertPageMarkers?: boolean;

	/**
	 * Template for page markers containing {page_num} placeholder.
	 * Default: "\n\n<!-- PAGE {page_num} -->\n\n"
	 */
	markerFormat?: string;
}

export interface ExtractionConfig {
	useCache?: boolean;
	enableQualityProcessing?: boolean;
	ocr?: OcrConfig;
	forceOcr?: boolean;
	chunking?: ChunkingConfig;
	images?: ImageExtractionConfig;
	pdfOptions?: PdfConfig;
	tokenReduction?: TokenReductionConfig;
	languageDetection?: LanguageDetectionConfig;
	postprocessor?: PostProcessorConfig;
	htmlOptions?: HtmlConversionOptions;
	keywords?: KeywordConfig;
	pages?: PageConfig;
	maxConcurrentExtractions?: number;

	/**
	 * Content text format (default: Plain).
	 * Controls the format of the extracted content:
	 * - "plain": Raw extracted text (default)
	 * - "markdown": Markdown formatted output
	 * - "djot": Djot markup format
	 * - "html": HTML formatted output
	 *
	 * @example
	 * ```typescript
	 * // Get markdown formatted output
	 * const config: ExtractionConfig = {
	 *   outputFormat: "markdown"
	 * };
	 * ```
	 */
	outputFormat?: "plain" | "markdown" | "djot" | "html";

	/**
	 * Result structure format (default: Unified).
	 * Controls whether results are returned in unified format with all
	 * content in the content field, or element-based format with semantic
	 * elements (for Unstructured-compatible output).
	 *
	 * - "unified": All content in the content field with metadata at result level (default)
	 * - "element_based": Semantic elements (headings, paragraphs, tables, etc.) for Unstructured compatibility
	 *
	 * @example
	 * ```typescript
	 * // Get element-based output for Unstructured compatibility
	 * const config: ExtractionConfig = {
	 *   resultFormat: "element_based"
	 * };
	 * ```
	 */
	resultFormat?: "unified" | "element_based";

	/**
	 * Serialize the configuration to a JSON string.
	 *
	 * Converts this configuration object to its JSON representation.
	 * The JSON can be used to create a new config via fromJson() or
	 * passed to extraction functions that accept JSON configs.
	 *
	 * @returns JSON string representation of the configuration
	 *
	 * @example
	 * ```typescript
	 * const config: ExtractionConfig = { useCache: true };
	 * const json = config.toJson();
	 * console.log(json); // '{"useCache":true,...}'
	 * ```
	 */
	toJson(): string;

	/**
	 * Get a configuration field by name (dot notation supported).
	 *
	 * Retrieves a nested configuration field using dot notation
	 * (e.g., "ocr.backend", "images.targetDpi").
	 *
	 * @param fieldName - The field path to retrieve
	 * @returns The field value as a JSON string, or null if not found
	 *
	 * @example
	 * ```typescript
	 * const config: ExtractionConfig = {
	 *   ocr: { backend: 'tesseract' }
	 * };
	 * const backend = config.getField('ocr.backend');
	 * console.log(backend); // '"tesseract"'
	 *
	 * const missing = config.getField('nonexistent');
	 * console.log(missing); // null
	 * ```
	 */
	getField(fieldName: string): string | null;

	/**
	 * Merge another configuration into this one.
	 *
	 * Performs a shallow merge where fields from the other config
	 * take precedence over this config's fields. Modifies this config
	 * in-place.
	 *
	 * @param other - Configuration to merge in (takes precedence)
	 *
	 * @example
	 * ```typescript
	 * const base: ExtractionConfig = { useCache: true, forceOcr: false };
	 * const override: ExtractionConfig = { forceOcr: true };
	 * base.merge(override);
	 * console.log(base.useCache); // true
	 * console.log(base.forceOcr); // true
	 * ```
	 */
	merge(other: ExtractionConfig): void;
}
