import dotenv from 'dotenv';

dotenv.config();

export const config = {
  llm: {
    provider: process.env.LLM_PROVIDER || 'anthropic',
    apiKey: process.env.LLM_PROVIDER === 'openai'
      ? process.env.OPENAI_API_KEY
      : process.env.ANTHROPIC_API_KEY,
    model: process.env.MODEL_NAME || 'claude-sonnet-4-6',
    maxTokens: parseInt(process.env.MAX_TOKENS) || 4000,
    temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
  },

  validation: {
    minQueryLength: 10,
    maxQueryLength: 500,
  },
};

export function validateConfig() {
  const { provider, apiKey } = config.llm;

  if (!apiKey) {
    throw new Error(
      `Missing API key for ${provider}. Please set ${provider === 'openai' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY'} in your .env file.`
    );
  }

  if (!['anthropic', 'openai'].includes(provider)) {
    throw new Error(`Invalid LLM_PROVIDER: ${provider}. Must be 'anthropic' or 'openai'.`);
  }

  return true;
}
