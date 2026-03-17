/**
 * Parser service to extract intent and context from user queries
 */

export class Parser {
  constructor() {
    this.decisionKeywords = {
      pricing: ['price', 'pricing', 'charge', 'cost', 'tier', 'subscription', 'fee'],
      features: ['feature', 'functionality', 'capability', 'prioritize', 'build', 'develop'],
      satisfaction: ['satisfied', 'satisfaction', 'happy', 'unhappy', 'csat'],
      loyalty: ['loyal', 'loyalty', 'nps', 'recommend', 'churn', 'retention', 'retain'],
      brand: ['brand', 'awareness', 'perception', 'reputation', 'positioning'],
      segmentation: ['segment', 'persona', 'target', 'audience', 'customer type'],
      cx: ['experience', 'journey', 'touchpoint', 'friction', 'effort', 'ces'],
      competitive: ['competitor', 'competitive', 'versus', 'vs', 'comparison', 'compare'],
      launch: ['launch', 'new product', 'market entry', 'go-to-market'],
      testing: ['test', 'which performs', 'a/b', 'variant', 'optimize'],
    };
  }

  /**
   * Extract potential decision type from query
   */
  extractDecisionType(query) {
    const lowerQuery = query.toLowerCase();
    const matches = [];

    for (const [type, keywords] of Object.entries(this.decisionKeywords)) {
      const matchCount = keywords.filter(keyword =>
        lowerQuery.includes(keyword)
      ).length;

      if (matchCount > 0) {
        matches.push({ type, score: matchCount });
      }
    }

    matches.sort((a, b) => b.score - a.score);
    return matches.length > 0 ? matches[0].type : 'general';
  }

  /**
   * Extract key entities and context
   */
  extractContext(query) {
    const context = {
      hasComparison: /versus|vs\.?|compared to|compare/i.test(query),
      hasSegment: /enterprise|smb|customer type|segment/i.test(query),
      hasTiming: /when|timing|now|future|next/i.test(query),
      hasQuantitative: /how much|how many|what percent/i.test(query),
      hasWhy: /why|reason|cause|driver/i.test(query),
    };

    return context;
  }

  /**
   * Parse user query
   */
  parse(query) {
    return {
      originalQuery: query,
      decisionType: this.extractDecisionType(query),
      context: this.extractContext(query),
      queryLength: query.length,
      timestamp: new Date().toISOString(),
    };
  }
}

export default Parser;
