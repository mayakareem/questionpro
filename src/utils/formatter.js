/**
 * Output formatting utilities
 */
export class Formatter {
  /**
   * Format recommendation response for display
   */
  static formatResponse(response) {
    // If response is already formatted text (from LLM), return as-is
    if (typeof response === 'string') {
      return response;
    }

    // Otherwise, build structured response from recommendation engine output
    const sections = [];

    sections.push('='.repeat(80));
    sections.push('RESEARCH METHODOLOGY RECOMMENDATION');
    sections.push('='.repeat(80));
    sections.push('');

    if (response.objective) {
      sections.push('RESEARCH OBJECTIVE');
      sections.push('-'.repeat(80));
      sections.push(response.objective);
      sections.push('');
    }

    if (response.methodologies && response.methodologies.length > 0) {
      sections.push('RECOMMENDED METHODOLOGIES');
      sections.push('-'.repeat(80));
      response.methodologies.forEach((method, index) => {
        sections.push(`${index + 1}. ${method.name}`);
        sections.push(`   ${method.description}`);
        sections.push('');
      });
    }

    if (response.rationale) {
      sections.push('WHY THESE METHODS FIT');
      sections.push('-'.repeat(80));
      sections.push(response.rationale);
      sections.push('');
    }

    if (response.methodologies && response.methodologies.length > 0) {
      sections.push('HOW TO CONDUCT IN QUESTIONPRO');
      sections.push('-'.repeat(80));
      response.methodologies.forEach(method => {
        if (method.features && method.features.length > 0) {
          sections.push(`For ${method.name}:`);
          method.features.forEach(feature => {
            sections.push(`  • ${feature.feature_name}: ${feature.description}`);
            if (feature.how_to_use) {
              sections.push(`    ${feature.how_to_use}`);
            }
          });
          sections.push('');
        }
      });
    }

    if (response.methodologies && response.methodologies.length > 0) {
      sections.push('EXPECTED OUTPUTS');
      sections.push('-'.repeat(80));
      response.methodologies.forEach(method => {
        sections.push(`${method.name}:`);
        method.typical_outputs.forEach(output => {
          sections.push(`  • ${output}`);
        });
        sections.push('');
      });
    }

    sections.push('='.repeat(80));

    return sections.join('\n');
  }

  /**
   * Format error message
   */
  static formatError(error) {
    return `\n❌ Error: ${error}\n`;
  }

  /**
   * Format validation errors
   */
  static formatValidationErrors(errors) {
    const lines = ['\n❌ Validation errors:'];
    errors.forEach(err => {
      lines.push(`  • ${err}`);
    });
    lines.push('');
    return lines.join('\n');
  }

  /**
   * Format welcome message
   */
  static formatWelcome() {
    return `
╔════════════════════════════════════════════════════════════════════════════╗
║                      AI RESEARCH GUIDE                                     ║
║                                                                            ║
║  Get expert research methodology recommendations for your business         ║
║  questions about products, markets, pricing, CX, and feature decisions.    ║
╚════════════════════════════════════════════════════════════════════════════╝

Type your question or 'exit' to quit.
`;
  }
}

export default Formatter;
