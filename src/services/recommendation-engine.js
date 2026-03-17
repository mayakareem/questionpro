import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Recommendation engine that maps queries to methodologies
 * This provides fallback logic when LLM is not available or for validation
 */
export class RecommendationEngine {
  constructor() {
    this.methodologies = this.loadMethodologies();
    this.decisionFrameworks = this.loadDecisionFrameworks();
    this.features = this.loadFeatures();
  }

  loadMethodologies() {
    const path = join(__dirname, '../knowledge/methodologies.json');
    return JSON.parse(readFileSync(path, 'utf-8'));
  }

  loadDecisionFrameworks() {
    const path = join(__dirname, '../knowledge/decision-frameworks.json');
    return JSON.parse(readFileSync(path, 'utf-8'));
  }

  loadFeatures() {
    const path = join(__dirname, '../knowledge/questionpro-features.json');
    return JSON.parse(readFileSync(path, 'utf-8'));
  }

  /**
   * Get methodology details by ID
   */
  getMethodology(methodologyId) {
    return this.methodologies.methodologies.find(m => m.id === methodologyId);
  }

  /**
   * Get QuestionPro features for a methodology
   */
  getFeatures(methodologyId) {
    const mapping = this.features.feature_mappings.find(
      f => f.methodology_id === methodologyId
    );
    return mapping ? mapping.questionpro_features : [];
  }

  /**
   * Get decision framework by type
   */
  getDecisionFramework(decisionType) {
    // Try exact match first
    let framework = this.decisionFrameworks.decision_frameworks.find(
      f => f.decision_type === decisionType
    );

    // If no exact match, look for partial matches
    if (!framework) {
      framework = this.decisionFrameworks.decision_frameworks.find(
        f => f.decision_type.includes(decisionType) ||
            decisionType.includes(f.decision_type)
      );
    }

    return framework;
  }

  /**
   * Generate recommendation based on parsed query
   */
  recommend(parsedQuery) {
    const framework = this.getDecisionFramework(parsedQuery.decisionType);

    if (!framework) {
      return {
        success: false,
        message: 'Could not determine appropriate research methodology',
      };
    }

    const methodologyDetails = framework.recommended_methodologies.map(id => ({
      ...this.getMethodology(id),
      features: this.getFeatures(id),
    }));

    return {
      success: true,
      decisionType: framework.decision_type,
      objective: framework.research_objective,
      methodologies: methodologyDetails,
      rationale: framework.rationale,
      framework,
    };
  }
}

export default RecommendationEngine;
