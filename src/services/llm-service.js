import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/settings.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class LLMService {
  constructor() {
    if (config.llm.provider === 'anthropic') {
      this.client = new Anthropic({
        apiKey: config.llm.apiKey,
      });
    } else {
      throw new Error('OpenAI provider not yet implemented');
    }

    this.systemPrompt = this.loadSystemPrompt();
    this.examples = this.loadExamples();
  }

  loadSystemPrompt() {
    const promptPath = join(__dirname, '../prompts/system-prompt.txt');
    return readFileSync(promptPath, 'utf-8');
  }

  loadExamples() {
    const examplesPath = join(__dirname, '../prompts/examples.json');
    return JSON.parse(readFileSync(examplesPath, 'utf-8'));
  }

  buildMessages(userQuery) {
    const messages = [];

    // Add few-shot examples
    for (const example of this.examples.few_shot_examples) {
      messages.push({
        role: 'user',
        content: example.user_query
      });
      messages.push({
        role: 'assistant',
        content: example.assistant_response
      });
    }

    // Add current user query
    messages.push({
      role: 'user',
      content: userQuery
    });

    return messages;
  }

  async getRecommendation(userQuery) {
    try {
      const messages = this.buildMessages(userQuery);

      const response = await this.client.messages.create({
        model: config.llm.model,
        max_tokens: config.llm.maxTokens,
        temperature: config.llm.temperature,
        system: this.systemPrompt,
        messages: messages,
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Error calling LLM API:', error.message);
      throw new Error(`Failed to get recommendation: ${error.message}`);
    }
  }
}

export default LLMService;
