import { validateConfig } from './config/settings.js';
import LLMService from './services/llm-service.js';
import Parser from './services/parser.js';
import Validator from './utils/validator.js';
import Formatter from './utils/formatter.js';

/**
 * Main application class
 */
class AIResearchGuide {
  constructor() {
    this.llmService = null;
    this.parser = new Parser();
  }

  /**
   * Initialize the application
   */
  async initialize() {
    try {
      validateConfig();
      this.llmService = new LLMService();
      console.log('✓ AI Research Guide initialized successfully');
    } catch (error) {
      console.error('✗ Initialization failed:', error.message);
      throw error;
    }
  }

  /**
   * Process a user query and return recommendation
   */
  async processQuery(query) {
    // Validate input
    const validation = Validator.validateQuery(query);
    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors,
      };
    }

    // Parse query to extract context
    const parsedQuery = this.parser.parse(validation.sanitized);

    try {
      // Get recommendation from LLM
      const recommendation = await this.llmService.getRecommendation(
        validation.sanitized
      );

      return {
        success: true,
        recommendation,
        metadata: {
          decisionType: parsedQuery.decisionType,
          timestamp: parsedQuery.timestamp,
        },
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message],
      };
    }
  }
}

export default AIResearchGuide;

// If running directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  const app = new AIResearchGuide();

  app.initialize()
    .then(() => {
      console.log('Application ready. Import this module or use the CLI.');
    })
    .catch(error => {
      console.error('Failed to start:', error.message);
      process.exit(1);
    });
}
