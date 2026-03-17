import type { ResearchPlan } from '@/types'

/**
 * Parse the LLM response into structured sections
 */
export function parseResearchPlan(response: string): ResearchPlan {
  const sections = {
    decision: extractSection(response, "WHAT YOU'RE TRYING TO DECIDE", "RESEARCH OBJECTIVE"),
    objective: extractSection(response, "RESEARCH OBJECTIVE", "RECOMMENDED METHODOLOGY"),
    methodologies: extractMethodologies(response),
    rationale: extractSection(response, "WHY THESE METHODS FIT", "HOW TO CONDUCT"),
    implementation: extractSection(response, "HOW TO CONDUCT IN QUESTIONPRO", "WHAT OUTPUTS"),
    outputs: extractSection(response, "WHAT OUTPUTS YOU'LL SEE", "WHAT DECISION THESE OUTPUTS SUPPORT"),
    decisionSupport: extractSection(response, "WHAT DECISION THESE OUTPUTS SUPPORT", null),
  }

  return sections
}

function extractSection(text: string, startHeader: string, endHeader: string | null): string {
  const startPattern = new RegExp(`\\*\\*${startHeader}\\*\\*|${startHeader}`, 'i')
  const startMatch = text.search(startPattern)

  if (startMatch === -1) {
    return ''
  }

  let endMatch = text.length
  if (endHeader) {
    const endPattern = new RegExp(`\\*\\*${endHeader}\\*\\*|${endHeader}`, 'i')
    const foundEnd = text.slice(startMatch + 1).search(endPattern)
    if (foundEnd !== -1) {
      endMatch = startMatch + 1 + foundEnd
    }
  }

  const section = text.slice(startMatch, endMatch)

  // Remove the header line and clean up
  const lines = section.split('\n').filter(line => {
    const trimmed = line.trim()
    return trimmed &&
           !trimmed.match(startPattern) &&
           !trimmed.match(/^[\*\-=]+$/) // Remove separator lines
  })

  return lines.join('\n').trim()
}

function extractMethodologies(text: string): string[] {
  const section = extractSection(text, "RECOMMENDED METHODOLOGY", "WHY THESE METHODS FIT")

  if (!section) {
    return []
  }

  // Extract methodologies from list format
  const methodologies: string[] = []
  const lines = section.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    // Match bullet points or numbered lists
    const match = trimmed.match(/^[\-\*\d\.]+\s+(.+)/)
    if (match) {
      methodologies.push(match[1].trim())
    } else if (trimmed && !trimmed.includes(':')) {
      // Simple line with methodology name
      methodologies.push(trimmed)
    }
  }

  return methodologies
}
