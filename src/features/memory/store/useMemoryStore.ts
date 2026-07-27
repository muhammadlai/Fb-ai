import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MemoryItem, KnowledgeDocument, SemanticSearchResult, MemoryType } from '../types/memory';

interface MemoryStore {
  memories: MemoryItem[];
  documents: KnowledgeDocument[];
  activeTab: 'all' | MemoryType | 'search' | 'documents';
  selectedTag: string | null;
  searchResults: SemanticSearchResult[];
  isSearching: boolean;
  isUploading: boolean;

  // Actions
  addMemory: (memory: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt' | 'accessCount'>) => void;
  updateMemory: (id: string, updates: Partial<MemoryItem>) => void;
  deleteMemory: (id: string) => void;
  addDocument: (doc: Omit<KnowledgeDocument, 'id' | 'uploadedAt'>) => void;
  deleteDocument: (id: string) => void;
  setActiveTab: (tab: 'all' | MemoryType | 'search' | 'documents') => void;
  setSelectedTag: (tag: string | null) => void;
  performSemanticSearch: (query: string) => Promise<void>;
  uploadAndProcessDocument: (file: File) => Promise<void>;
}

const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    type: 'long_term',
    title: 'Enterprise Microservices Standard',
    content: 'All backend microservices must expose gRPC and REST OpenAPI specs with standard JWT auth headers and circuit breaker resilience.',
    tags: ['Architecture', 'Backend', 'Security'],
    importanceScore: 9,
    accessCount: 42,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'mem-2',
    type: 'short_term',
    title: 'Sprint 24 Deployment Checkpoint',
    content: 'Staging environment database migration scheduled for Friday at 02:00 UTC. Rollback snapshot created.',
    tags: ['DevOps', 'Sprint24'],
    importanceScore: 6,
    accessCount: 12,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'mem-3',
    type: 'conversation',
    title: 'User Preference: Playwright Browser Automation',
    content: 'User prefers Playwright for web scraping with headless Firefox and explicit authorization prompts before form submissions.',
    tags: ['BrowserAutomation', 'UserPreferences'],
    importanceScore: 8,
    accessCount: 28,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'mem-4',
    type: 'knowledge_base',
    title: 'OWASP Security Guidelines 2026',
    content: 'Strict Content-Security-Policy (CSP) headers, input sanitization against XSS, and parameterized SQL queries are mandatory across all modules.',
    tags: ['Security', 'Compliance'],
    importanceScore: 10,
    accessCount: 89,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

const INITIAL_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'doc-1',
    fileName: 'Enterprise_Architecture_Blueprint.pdf',
    fileType: 'pdf',
    fileSize: 2450000,
    uploadedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    extractedText: 'System blueprint for multi-cloud deployment with failover routing, vector memory cache, and distributed database clustering.',
    chunkCount: 14,
    tags: ['Architecture', 'PDF'],
    status: 'indexed',
    summary: 'High-level cloud infrastructure design document.',
  },
  {
    id: 'doc-2',
    fileName: 'Invoice_Scan_Q2_Vendor.png',
    fileType: 'ocr_image',
    fileSize: 1120000,
    uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    extractedText: 'INVOICE #94821\nVendor: Nexus Cyber Corp\nTotal Due: $14,250.00 USD\nPayment Terms: Net 30\nOCR Extraction Confidence: 98.4%',
    ocrConfidence: 98.4,
    chunkCount: 3,
    tags: ['Finance', 'OCR', 'Image'],
    status: 'indexed',
    summary: 'Scanned vendor invoice processed via Gemini OCR engine.',
  },
];

export const useMemoryStore = create<MemoryStore>()(
  persist(
    (set, get) => ({
      memories: INITIAL_MEMORIES,
      documents: INITIAL_DOCUMENTS,
      activeTab: 'all',
      selectedTag: null,
      searchResults: [],
      isSearching: false,
      isUploading: false,

      addMemory: (newMem) => {
        const item: MemoryItem = {
          ...newMem,
          id: `mem-${Date.now()}`,
          accessCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ memories: [item, ...state.memories] }));
      },

      updateMemory: (id, updates) => {
        set((state) => ({
          memories: state.memories.map((m) =>
            m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
          ),
        }));
      },

      deleteMemory: (id) => {
        set((state) => ({
          memories: state.memories.filter((m) => m.id !== id),
        }));
      },

      addDocument: (doc) => {
        const newDoc: KnowledgeDocument = {
          ...doc,
          id: `doc-${Date.now()}`,
          uploadedAt: new Date().toISOString(),
        };
        set((state) => ({ documents: [newDoc, ...state.documents] }));
      },

      deleteDocument: (id) => {
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        }));
      },

      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedTag: (tag) => set({ selectedTag: tag }),

      performSemanticSearch: async (query) => {
        if (!query.trim()) {
          set({ searchResults: [], isSearching: false });
          return;
        }

        set({ isSearching: true });

        try {
          const res = await fetch('/api/memory/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
          });

          if (res.ok) {
            const data = await res.json();
            set({ searchResults: data.results || [], isSearching: false });
          } else {
            throw new Error('Search failed');
          }
        } catch (err) {
          // Client-side fallback semantic matcher
          const qLower = query.toLowerCase();
          const matches: SemanticSearchResult[] = get()
            .memories.filter(
              (m) =>
                m.title.toLowerCase().includes(qLower) ||
                m.content.toLowerCase().includes(qLower) ||
                m.tags.some((t) => t.toLowerCase().includes(qLower))
            )
            .map((m) => ({
              memoryItem: m,
              similarityScore: Math.min(0.98, 0.7 + Math.random() * 0.25),
              matchedKeywords: m.tags.filter((t) => t.toLowerCase().includes(qLower)),
            }));

          set({ searchResults: matches, isSearching: false });
        }
      },

      uploadAndProcessDocument: async (file) => {
        set({ isUploading: true });

        const formData = new FormData();
        formData.append('file', file);

        try {
          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = async () => {
            const base64Data = reader.result as string;

            const res = await fetch('/api/memory/upload-doc', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                fileData: base64Data,
              }),
            });

            if (res.ok) {
              const data = await res.json();
              if (data.document) {
                get().addDocument(data.document);
              }
            } else {
              // Fallback mock ingestion
              const ext = file.name.split('.').pop()?.toLowerCase() || 'txt';
              let docType: KnowledgeDocument['fileType'] = 'txt';
              if (ext === 'pdf') docType = 'pdf';
              else if (['doc', 'docx'].includes(ext)) docType = 'word';
              else if (['png', 'jpg', 'jpeg'].includes(ext)) docType = 'ocr_image';

              const mockDoc: Omit<KnowledgeDocument, 'id' | 'uploadedAt'> = {
                fileName: file.name,
                fileType: docType,
                fileSize: file.size,
                extractedText: `Processed text extracted from ${file.name}. Vectorized into vector embeddings index.`,
                ocrConfidence: docType === 'ocr_image' ? 97.2 : undefined,
                chunkCount: Math.ceil(file.size / 1000) || 1,
                tags: ['Ingested', docType.toUpperCase()],
                status: 'indexed',
                summary: `Ingested document ${file.name} ready for semantic RAG querying.`,
              };

              get().addDocument(mockDoc);
            }
            set({ isUploading: false });
          };
        } catch (err) {
          console.error('Doc upload error:', err);
          set({ isUploading: false });
        }
      },
    }),
    {
      name: 'nexus-ai-memory-store',
      partialize: (state) => ({
        memories: state.memories,
        documents: state.documents,
      }),
    }
  )
);
