/*
==========================================
AI CUSTOMER SUPPORT ORCHESTRATOR
==========================================

Includes:
- Sentiment Analysis
- Language Detection
- Intent Detection
- Tone Engine
- AI Response Generation
- Hallucination Prevention
- Structured Types

==========================================
*/
import dotenv from 'dotenv';
dotenv.config();
import { Groq } from 'groq-sdk';
import { languageDetector } from './languageDetector';
import { sentimentAnalyzer } from './sentimentAnalyzer';

/* ==========================================
   TYPES
========================================== */

export interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';

  content: string;

  tool_calls?: any[];

  tool_call_id?: string;

  name?: string;

  timestamp?: string;
}

export interface AIResponse {
  content: string;

  metadata?: {
    language?: string;

    sentiment?: {
      emotion: string;
      score: number;
      label: string;
    };

    confidence?: number;

    tone?: string;

    intent?: string;
  };
}

export interface Sentiment {
  score: number;

  emotion:
  | 'anger'
  | 'frustration'
  | 'disappointment'
  | 'urgency'
  | 'confusion'
  | 'sadness'
  | 'happiness'
  | 'satisfaction'
  | 'neutral'
  | 'sarcasm';

  label: 'negative' | 'neutral' | 'positive';

  confidence: number;
}

export interface OrchestratorContext {
  conversationId: string;

  history: Message[];

  sentiment?: Sentiment;

  language?: string;

  customerId?: string;

  orderId?: string;

  intent?: string;

  currentFlow?:
  | 'tracking'
  | 'refund'
  | 'cancel'
  | 'payment'
  | 'general';

  escalationRequired?: boolean;
}

/* ==========================================
   AI ORCHESTRATOR
========================================== */

export class AIOrchestrator {
  private groq: Groq;

  constructor() {
    const key = (process.env.GROQ_API_KEY || '').trim();
    // console.log(`[GROQ-DEBUG] Using API Key: ${key.substring(0, 8)}...${key.substring(key.length - 4)}`);

    this.groq = new Groq({
      apiKey: key,
    });
  }

  /* ==========================================
     MAIN HANDLER
  ========================================== */

  async handleMessage(
    userMessage: string,
    context: OrchestratorContext,
    orderInfo: any
  ): Promise<AIResponse> {

    // ---------------------------------------
    // Detect Language
    // ---------------------------------------

    const language = await this.detectLanguage(userMessage, context.language);

    // ---------------------------------------
    // Detect Sentiment
    // ---------------------------------------

    const sentiment = await this.analyzeSentiment(userMessage);

    // ---------------------------------------
    // Detect Intent
    // ---------------------------------------

    const intent = this.detectIntent(userMessage);

    // ---------------------------------------
    // Tone Mapping
    // ---------------------------------------

    const tone = this.getTone(sentiment);

    // ---------------------------------------
    // Build Factual Data
    // IMPORTANT:
    // Backend controls truth
    // ---------------------------------------

    const factualData = this.buildFactualData(intent, orderInfo);

    // ---------------------------------------
    // Strong System Prompt
    // ---------------------------------------

    const systemPrompt = `
You are a professional multilingual ecommerce customer support assistant.

STRICT BOUNDARY RULES:
1. ONLY assist with ecommerce topics: orders, status, tracking, products, payments, refunds, and cancellations.
2. If the user asks an "out-of-boundary" question (e.g., recipes, general knowledge, jokes, unrelated advice), politely state that you are an order support assistant and can ONLY help with their orders.
3. NEVER provide instructions for cooking, coding, or any non-ecommerce tasks.

CORE RULES:
1. ONLY use FACTUAL_DATA provided below.
2. NEVER invent tracking numbers, prices, or status.
3. If FACTUAL_DATA is NOT empty, acknowledge that you have their order details.
4. If FACTUAL_DATA is empty, you MUST ASK the user for their Order ID or Email.
5. Respond in the user's preferred language (Current detected language: ${language}). If the user asks to switch to another language, comply immediately.
6. You are CAPABLE of speaking many languages including Hindi, English, Gujarati, etc. NEVER say you are restricted to English.
7. Tone must be ${tone}.
8. Keep response short and natural.
`;

    // ---------------------------------------
    // Build Messages
    // ---------------------------------------

    const safeHistory = context.history
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-6);

    const messages = [
      {
        role: 'system',
        content: systemPrompt,
      },

      {
        role: 'system',
        content: factualData
          ? `FACTUAL_DATA:\n${factualData}`
          : `MISSING_INFORMATION_WARNING: No order data is available yet. You MUST ask the user for their Order ID or Email to proceed.`,
      },

      ...safeHistory.map((m) => ({
        role: m.role,
        content: m.content,
      })),

      {
        role: 'user',
        content: userMessage,
      },
    ];

    // ---------------------------------------
    // Debug Logs
    // ---------------------------------------

    /*
    console.log('\n====================================');
    console.log('FULL AI PAYLOAD');
    console.log('====================================');
    console.log(JSON.stringify(messages, null, 2));
    console.log('====================================\n');
    */

    // ---------------------------------------
    // AI Completion
    // ---------------------------------------

    const completion = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',

      temperature: 0,

      top_p: 0.1,

      messages: messages as any,
    });

    // ---------------------------------------
    // Final Response
    // ---------------------------------------

    return {
      content: completion.choices[0].message.content || '',

      metadata: {
        language,
        sentiment: {
          emotion: sentiment.emotion,
          score: sentiment.score,
          label: sentiment.label,
        },
        confidence: sentiment.confidence,
        tone,
        intent,
      },
    };
  }

  /* ==========================================
     LANGUAGE DETECTOR
  ========================================== */

  async detectLanguage(message: string, preferredLanguage?: string): Promise<string> {
    // If a preferred language is provided (e.g. from frontend), consider it
    if (preferredLanguage) {
      const normalizedPref = preferredLanguage.toLowerCase();
      if (normalizedPref.includes('hi')) return 'Hindi';
      if (normalizedPref.includes('gu')) return 'Gujarati';
    }

    // Try the advanced LLM-based detector first
    try {
      const detected = await languageDetector.detect(message);
      if (detected && detected !== 'English') return detected;
    } catch (e) {
      console.error("[LANG-DETECTOR] Error:", e);
    }

    // Fallback to regex for common Indian scripts
    if (/[\u0900-\u097F]/.test(message)) return 'Hindi/Marathi';
    if (/[\u0A80-\u0AFF]/.test(message)) return 'Gujarati';
    if (/[\u0600-\u06FF]/.test(message)) return 'Arabic';
    if (/[\u0C00-\u0C7F]/.test(message)) return 'Telugu';

    if (preferredLanguage && preferredLanguage !== 'auto') {
        return preferredLanguage.charAt(0).toUpperCase() + preferredLanguage.slice(1);
    }

    return 'English';
  }

  /* ==========================================
     SENTIMENT ANALYZER
  ========================================== */

  async analyzeSentiment(message: string): Promise<Sentiment> {
    try {
      const result = await sentimentAnalyzer.analyze(message);
      return {
        score: result.score ?? 0,
        emotion: result.emotion ?? 'neutral',
        label: result.label ?? 'neutral',
        confidence: result.confidence ?? 0.5,
      } as Sentiment;
    } catch {
      return {
        score: 0,
        emotion: 'neutral',
        label: 'neutral',
        confidence: 0.5,
      } as Sentiment;
    }
  }

  /* ==========================================
     INTENT DETECTOR
  ========================================== */

  detectIntent(message: string): string {

    const text = message.toLowerCase();

    if (
      text.includes('where') ||
      text.includes('track') ||
      text.includes('status') ||
      text.includes('courier') ||
      text.includes('delivery') ||
      text.includes('ship') ||
      text.includes('when') ||
      text.includes('receive') ||
      text.includes('reach')
    ) {
      return 'tracking';
    }

    if (
      text.includes('refund')
    ) {
      return 'refund';
    }

    if (
      text.includes('cancel')
    ) {
      return 'cancel';
    }

    if (
      text.includes('payment') ||
      text.includes('paid')
    ) {
      return 'payment';
    }

    if (
      text.includes('price') ||
      text.includes('amount') ||
      text.includes('cost')
    ) {
      return 'pricing';
    }

    return 'general';
  }

  /* ==========================================
     TONE ENGINE
  ========================================== */

  getTone(sentiment: Sentiment): string {

    switch (sentiment.emotion) {

      case 'anger':
        return 'extremely calm and apologetic';

      case 'frustration':
        return 'empathetic and solution-focused';

      case 'confusion':
        return 'clear and explanatory';

      case 'urgency':
        return 'fast and reassuring';

      case 'sadness':
        return 'warm and supportive';

      default:
        return 'professional';
    }
  }

  /* ==========================================
     FACT BUILDER
     IMPORTANT:
     BACKEND CONTROLS FACTS
  ========================================== */

  buildFactualData(intent: string, order: any): string {

    if (!order) {
      return '';
    }

    const formatDate = (date: any) => {
      if (!date) return 'N/A';
      try {
        return new Date(date).toLocaleString();
      } catch {
        return 'N/A';
      }
    };

    // Handle Multiple Orders
    if (Array.isArray(order)) {
      if (order.length === 0) return '';
      if (order.length > 1) {
        let summary = `USER ORDER HISTORY (${order.length} Orders Found):\n`;
        order.forEach((o, index) => {
          summary += `\n[Order ${index + 1}]
ID: ${o.orderId}
STATUS: ${o.orderStatus}
DATE: ${formatDate(o.createdAt)}
ITEMS: ${o.products?.map((p: any) => p.productName).join(', ')}
TOTAL_AMOUNT: ${o.pricing?.totalAmount} ${o.pricing?.currency}
PAYMENT_METHOD: ${o.payment?.method}
COURIER: ${o.shipping?.courierPartner}
TRACKING_NUMBER: ${o.shipping?.trackingNumber}
-------------------`;
        });
        // console.log("--- FACTUAL_DATA (SUMMARY) ---\n", summary);
        return summary;
      }
      order = order[0]; // If only 1 order in array, proceed with single order logic
    }

    // ... (rest of the detailed logic)
    // console.log("--- FACTUAL_DATA (DETAILED) ---\n", "Order ID: " + order.orderId);

    const baseInfo = `
Order ID: ${order.orderId}
Customer ID: ${order.customer?.customerId}
Customer Name: ${order.customer?.name}
Customer Email: ${order.customer?.email}
Customer Phone: ${order.customer?.phone}
Order Date: ${formatDate(order.createdAt)}
Status: ${order.orderStatus}
Total Amount: ${order.pricing?.totalAmount} ${order.pricing?.currency}
Items: ${order.products?.map((p: any) => `${p.productName} (Brand: ${p.brand}, Category: ${p.category}, Qty: ${p.quantity}, Price: ${p.price} ${p.currency})`).join(' | ')}
`;

    const subtotal = order.products?.reduce((acc: number, p: any) => acc + (p.price * p.quantity), 0) || 0;
    const tax = (order.pricing?.totalAmount || 0) - subtotal;

    const pricingInfo = `
BILL BREAKDOWN:
- Items Subtotal: ${subtotal} ${order.pricing?.currency}
- Estimated Tax (GST 18%): ${tax} ${order.pricing?.currency}
- Grand Total: ${order.pricing?.totalAmount} ${order.pricing?.currency}
`;

    const shippingInfo = `
Courier: ${order.shipping?.courierPartner}
Tracking Number: ${order.shipping?.trackingNumber}
Address: ${order.shipping?.address?.city}, ${order.shipping?.address?.state}, ${order.shipping?.address?.country}
Delivered At: ${formatDate(order.shipping?.deliveredAt)}
`;

    const paymentInfo = `
Payment Method: ${order.payment?.method}
Payment Status: ${order.payment?.status}
Payment Date: ${formatDate(order.payment?.paidAt)}
`;

    switch (intent) {
      case 'tracking':
        return `${baseInfo}\nSHIPPING DETAILS:\n${shippingInfo}`;
      case 'pricing':
      case 'payment':
        return `${baseInfo}\n${pricingInfo}\nPAYMENT DETAILS:\n${paymentInfo}`;
      case 'refund':
      case 'cancel':
        return `${baseInfo}\nNote: Check if status allows ${intent}. Current status is ${order.orderStatus}.`;
      default:
        return `${baseInfo}\n${shippingInfo}\n${paymentInfo}`;
    }
  }
}

/* ==========================================
   EXPORT SINGLE INSTANCE
========================================== */

export const aiOrchestrator = new AIOrchestrator();