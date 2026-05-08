import { Groq } from 'groq-sdk';
import { Sentiment } from '../types';

export class SentimentAnalyzer {
  private _groq: Groq | null = null;

  private get groq(): Groq {
    if (!this._groq) {
      if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not defined in environment variables");
      }
      this._groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    return this._groq;
  }

  async analyze(message: string): Promise<Sentiment> {
    try {
      const completion = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { 
            role: 'system', 
            content: 'Analyze sentiment. Return JSON: {"score": number, "emotion": "anger"|"frustration"|"neutral"|"satisfaction"|"urgency", "label": "negative"|"neutral"|"positive"}' 
          },
          { role: 'user', content: message }
        ],
        response_format: { type: 'json_object' }
      });
      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch (e) {
      console.error("[SENTIMENT-ANALYZER] Error:", e);
      return { score: 0, emotion: 'neutral', label: 'neutral' };
    }
  }
}
export const sentimentAnalyzer = new SentimentAnalyzer();
