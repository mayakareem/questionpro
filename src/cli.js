import readline from 'readline';
import AIResearchGuide from './index.js';
import Formatter from './utils/formatter.js';

/**
 * Interactive CLI for AI Research Guide
 */
class CLI {
  constructor() {
    this.app = new AIResearchGuide();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Start the interactive CLI
   */
  async start() {
    console.clear();
    console.log(Formatter.formatWelcome());

    try {
      await this.app.initialize();
      console.log('');
      this.promptUser();
    } catch (error) {
      console.error(Formatter.formatError(error.message));
      console.log('Please check your .env configuration and try again.\n');
      this.rl.close();
      process.exit(1);
    }
  }

  /**
   * Prompt user for input
   */
  promptUser() {
    this.rl.question('\n> Your question: ', async (input) => {
      const trimmed = input.trim();

      // Check for exit
      if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
        console.log('\nThank you for using AI Research Guide! Goodbye.\n');
        this.rl.close();
        return;
      }

      // Check for empty input
      if (!trimmed) {
        this.promptUser();
        return;
      }

      // Process query
      await this.handleQuery(trimmed);

      // Continue prompting
      this.promptUser();
    });
  }

  /**
   * Handle a user query
   */
  async handleQuery(query) {
    console.log('\n⏳ Analyzing your question...\n');

    const result = await this.app.processQuery(query);

    if (result.success) {
      console.log(Formatter.formatResponse(result.recommendation));
      if (result.metadata) {
        console.log(`\n[Decision type detected: ${result.metadata.decisionType}]`);
      }
    } else {
      console.log(Formatter.formatValidationErrors(result.errors));
    }
  }
}

// Run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new CLI();
  cli.start().catch(error => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });
}

export default CLI;
