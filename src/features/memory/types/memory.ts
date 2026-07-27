export type MemoryType = 'long_term' | 'short_term' | 'conversation' | 'knowledge_base';

export interface MemoryItem {
  id: string;
  type: MemoryType;
  title: string;
  content: string;
  tags: string[];
  embeddingVector?: number[]; // Representational 128-dim embedding
  sourceDocumentId?: string;
  importanceScore: number; // 1 to 10
  accessCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeDocument {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'word' | 'txt' | 'ocr_image';
  fileSize: number;
  uploadedAt: string;
  extractedText: string;
  ocrConfidence?: number;
  chunkCount: number;
  tags: string[];
  status: 'processing' | 'indexed' | 'failed';
  summary?: string;
}

export interface SemanticSearchResult {
  memoryItem?: MemoryItem;
  documentChunk?: {
    documentId: string;
    documentName: string;
    text: string;
    chunkIndex: number;
  };
  similarityScore: number; // 0.0 to 1.0
  matchedKeywords: string[];
}
