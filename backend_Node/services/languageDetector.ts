import { Groq } from 'groq-sdk';

export class LanguageDetector {
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

  async detect(message: string): Promise<string> {
    try {
      const completion = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Respond with ONLY the language name of the user message (e.g. English, Hindi, Arabic).' },
          { role: 'user', content: message }
        ],
      });
      return completion.choices[0].message.content?.trim() || 'English';
    } catch (e) {
      console.error("[LANG-DETECTOR] Error during detection:", e);
      return 'English';
    }
  }
}
export const languageDetector = new LanguageDetector();
