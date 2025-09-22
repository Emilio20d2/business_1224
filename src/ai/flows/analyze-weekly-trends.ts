'use server';

/**
 * @fileOverview AI-powered tool that analyzes weekly variation percentages in business metrics.
 *
 * - analyzeWeeklyTrends - Analyzes weekly trends and suggests reasons for observed trends.
 * - AnalyzeWeeklyTrendsInput - The input type for the analyzeWeeklyTrends function.
 * - AnalyzeWeeklyTrendsOutput - The return type for the analyzeWeeklyTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeWeeklyTrendsInputSchema = z.object({
  varPorcEuros: z.number().describe('The variation percentage for total euros.'),
  varPorcUnidades: z.number().describe('The variation percentage for total units.'),
  varPorcTrafico: z.number().describe('The variation percentage for traffic.'),
  varPorcConversion: z.number().describe('The variation percentage for conversion rate.'),
});
export type AnalyzeWeeklyTrendsInput = z.infer<typeof AnalyzeWeeklyTrendsInputSchema>;

const AnalyzeWeeklyTrendsOutputSchema = z.object({
  analysis: z.string().describe('The analysis of the weekly trends, including potential reasons for observed trends, highlighting both positive and negative aspects.'),
});
export type AnalyzeWeeklyTrendsOutput = z.infer<typeof AnalyzeWeeklyTrendsOutputSchema>;

export async function analyzeWeeklyTrends(input: AnalyzeWeeklyTrendsInput): Promise<AnalyzeWeeklyTrendsOutput> {
  return analyzeWeeklyTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeWeeklyTrendsPrompt',
  input: {schema: AnalyzeWeeklyTrendsInputSchema},
  output: {schema: AnalyzeWeeklyTrendsOutputSchema},
  prompt: `You are a business analyst who analyzes weekly business metric trends and provides insights.

  Analyze the following weekly variation percentages and suggest potential reasons for the observed trends, highlighting both positive and negative aspects.

  Total Euros Variation: {{varPorcEuros}}%
  Total Units Variation: {{varPorcUnidades}}%
  Traffic Variation: {{varPorcTrafico}}%
  Conversion Rate Variation: {{varPorcConversion}}%

  Provide a concise analysis that helps the user quickly understand performance drivers and areas for improvement.`,
});

const analyzeWeeklyTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeWeeklyTrendsFlow',
    inputSchema: AnalyzeWeeklyTrendsInputSchema,
    outputSchema: AnalyzeWeeklyTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
