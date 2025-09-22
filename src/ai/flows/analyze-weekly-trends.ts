'use server';
/**
 * @fileOverview A weekly trend analysis AI agent.
 *
 * - analyzeWeeklyTrends - A function that handles the weekly trend analysis process.
 * - WeeklyAnalysisInput - The input type for the analyzeWeeklyTrends function.
 * - WeeklyAnalysisOutput - The return type for the analyzeWeeklyTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeeklyAnalysisInputSchema = z.object({
  currentWeekData: z.any().describe('The data for the current week.'),
  previousWeekData: z.any().describe('The data for the previous week.'),
});
export type WeeklyAnalysisInput = z.infer<typeof WeeklyAnalysisInputSchema>;

const WeeklyAnalysisOutputSchema = z.object({
  insights: z.array(z.string()).describe('Actionable insights based on the weekly data comparison.'),
  topPriorities: z.array(z.string()).describe('Top 3 priorities for the upcoming week.'),
});
export type WeeklyAnalysisOutput = z.infer<typeof WeeklyAnalysisOutputSchema>;

export async function analyzeWeeklyTrends(input: WeeklyAnalysisInput): Promise<WeeklyAnalysisOutput> {
  return analyzeWeeklyTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeWeeklyTrendsPrompt',
  input: {schema: WeeklyAnalysisInputSchema},
  output: {schema: WeeklyAnalysisOutputSchema},
  prompt: `You are a retail operations analyst. Compare the following two weeks of data and provide actionable insights and top priorities.

Current Week Data:
{{{json currentWeekData}}}

Previous Week Data:
{{{json previousWeekData}}}

Based on the comparison, identify key trends, anomalies, and areas for improvement. Generate a list of actionable insights and then list the top 3 priorities for the store manager for the next week.`,
});

const analyzeWeeklyTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeWeeklyTrendsFlow',
    inputSchema: WeeklyAnalysisInputSchema,
    outputSchema: WeeklyAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
