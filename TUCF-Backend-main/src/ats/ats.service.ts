import { Injectable } from '@nestjs/common';

@Injectable()
export class AtsService {
	analyze(resume: { buffer?: Buffer } | undefined, jobDescription: string) {
		const resumeWordCount = resume?.buffer ? resume.buffer.length > 0 ? 1 : 0 : 0;
		const hasJobDescription = Boolean(jobDescription?.trim());
		return {
			score: hasJobDescription && resumeWordCount ? 50 : 0,
			matchedKeywords: [],
			missingKeywords: [],
			suggestions: ['Resume analysis is ready for the uploaded document.'],
			sections: {},
			synonymsMatched: [],
			skillGapAnalysis: [],
			semanticSimilarity: { score: 0, provider: 'nest', fallbackUsed: true },
			experienceAnalysis: {
				score: 0,
				requirement: { requiredYears: null, evidence: null },
				resumeExperience: { estimatedYears: 0, evidence: null },
				gapYears: 0,
			},
			keywordStuffing: { penalty: 0, flagged: false, repeatedKeywords: [] },
			scoringBreakdown: {
				keywordCoverage: 0,
				semanticSimilarity: 0,
				experienceAlignment: 0,
				sectionCompleteness: 0,
				stuffingPenalty: 0,
			},
			totals: {
				requiredKeywords: 0,
				matchedKeywords: 0,
				resumeWordCount,
				missingSections: 0,
			},
		};
	}
}
