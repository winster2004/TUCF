import { SKILL_CATEGORIES } from './constants.js';

/** Groups missing keywords into readable skill-gap buckets. */
export function buildSkillGapAnalysis(missingKeywords) {
  const grouped = Object.entries(SKILL_CATEGORIES).map(([category, skills]) => ({
    category,
    missing: missingKeywords.filter((keyword) => skills.includes(keyword)),
  }));

  return grouped.filter((entry) => entry.missing.length > 0);
}

/** Builds actionable suggestions from the scoring output. */
export function buildSuggestions({
  missingKeywords,
  semanticScore,
  experienceScore,
  stuffing,
  sections,
  synonymMatches,
  resumeWordCount,
}) {
  const suggestions = [];

  if (!sections.summary?.wordCount) {
    suggestions.push('Add a short professional summary near the top of the resume to improve ATS context.');
  }

  if (!sections.skills?.wordCount) {
    suggestions.push('Include a dedicated skills section so recruiters and ATS systems can scan your stack quickly.');
  }

  if (missingKeywords.length > 0) {
    suggestions.push(`Add evidence for missing requirements such as ${missingKeywords.slice(0, 5).join(', ')} where they truthfully apply.`);
  }

  if (synonymMatches.length > 0) {
    suggestions.push('Use the exact wording from the job description for a few matched skills instead of relying only on synonyms.');
  }

  if (semanticScore < 60) {
    suggestions.push('Your resume language is not closely aligned with the job post. Rewrite the summary and experience bullets using the role vocabulary.');
  }

  if (experienceScore < 70) {
    suggestions.push('Highlight tenure, ownership, and measurable outcomes more clearly to close the experience gap.');
  }

  if (resumeWordCount < 250) {
    suggestions.push('The resume is short. Add quantified achievements, project impact, and tool-specific responsibilities.');
  }

  if (stuffing.flagged) {
    suggestions.push('Reduce repeated keyword blocks. ATS systems reward relevance, not unnatural repetition.');
  }

  if (suggestions.length === 0) {
    suggestions.push('Baseline alignment is strong. Tailor project bullets and achievements for this specific role to push the score higher.');
  }

  return suggestions;
}

/** Converts analysis gaps into transparent, capped improvement estimates. */
export function buildImprovementPlan({
  missingKeywords,
  semanticScore,
  experienceScore,
  sections,
  resumeWordCount,
  stuffing,
}) {
  const plan = [];
  const add = (entry) => plan.push(entry);

  if (missingKeywords.length > 0) {
    add({
      category: 'skills',
      title: 'Add relevant job skills',
      action: `Add only skills you can support with evidence: ${missingKeywords.slice(0, 6).join(', ')}.`,
      estimatedPoints: Math.min(15, missingKeywords.length * 2),
      priority: 'high',
    });
  }
  if (!sections.summary?.wordCount) {
    add({
      category: 'wording',
      title: 'Write a targeted summary',
      action: 'Add 3-4 lines naming your role, strongest tools, domain, and one measurable outcome.',
      estimatedPoints: 5,
      priority: 'high',
    });
  }
  if (semanticScore < 70) {
    add({
      category: 'wording',
      title: 'Align wording to the job',
      action: 'Rewrite the first bullets under each role using the job post language without copying full sentences.',
      estimatedPoints: 8,
      priority: 'high',
    });
  }
  if (experienceScore < 70) {
    add({
      category: 'impact',
      title: 'Quantify experience',
      action: 'Add scale, speed, revenue, reliability, or time saved to 2-3 relevant bullets.',
      estimatedPoints: 8,
      priority: 'medium',
    });
  }
  if (!sections.skills?.wordCount) {
    add({
      category: 'structure',
      title: 'Add a dedicated skills section',
      action: 'Use a simple comma-separated list grouped by languages, frameworks, data, and platforms.',
      estimatedPoints: 5,
      priority: 'high',
    });
  }
  if (!sections.education?.wordCount || !sections.projects?.wordCount || resumeWordCount < 250) {
    add({
      category: 'structure',
      title: 'Complete the core sections',
      action: 'Keep Summary, Skills, Experience, Education, and Projects clearly labeled and in a standard order.',
      estimatedPoints: 6,
      priority: 'medium',
    });
  }
  if (stuffing.flagged) {
    add({
      category: 'wording',
      title: 'Reduce keyword repetition',
      action: 'Replace repeated keyword blocks with natural achievement statements and varied verbs.',
      estimatedPoints: 4,
      priority: 'medium',
    });
  }

  return plan.slice(0, 8);
}

export function buildFormattingChecks({ sections, resumeWordCount }) {
  return [
    {
      label: 'Standard section headings',
      status: sections.experience?.wordCount && sections.skills?.wordCount ? 'pass' : 'review',
      detail: sections.experience?.wordCount && sections.skills?.wordCount
        ? 'Experience and Skills headings were detected.'
        : 'Use conventional headings such as Summary, Skills, Experience, Education, and Projects.',
    },
    {
      label: 'Readable resume length',
      status: resumeWordCount >= 250 && resumeWordCount <= 1100 ? 'pass' : 'review',
      detail: resumeWordCount >= 250 && resumeWordCount <= 1100
        ? 'The extracted text length is in a typical ATS-friendly range.'
        : 'Aim for roughly 250-1,100 words and remove filler before adding more keywords.',
    },
    {
      label: 'ATS-safe layout',
      status: 'review',
      detail: 'PDF text extraction cannot verify font size, columns, tables, icons, or spacing. Prefer one column, 10-12pt body text, standard fonts, and consistent dates.',
    },
  ];
}

