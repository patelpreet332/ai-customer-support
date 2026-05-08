export interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_calls?: any[];
  tool_call_id?: string;
  name?: string;
}

export interface AIResponse {
  content: string;
  metadata?: Record<string, any>;
}

export interface Sentiment {
  score: number;
  emotion: 'anger' | 'frustration' | 'neutral' | 'satisfaction' | 'urgency';
  label: 'negative' | 'neutral' | 'positive';
}

export interface OrchestratorContext {
  conversationId: string;
  history: Message[];
  sentiment?: Sentiment;
  language?: string;
}
