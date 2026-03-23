export * from './recipe';
export * from './quotation';

// Legacy state type — kept for compatibility
export type AppState = 'HOME' | 'IDLE' | 'XML' | 'PROCESSING' | 'EDITING' | 'PREVIEW' | 'HISTORY';
