// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting prompts to the user in the AI Chat interface.
 *
 * - `suggestPrompts`: An exported function that calls the `suggestPromptsFlow` and returns suggested prompts.
 * - `SuggestedPromptsInput`: The input type for the `suggestPrompts` function.
 * - `SuggestedPromptsOutput`: The output type for the `suggestPrompts` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestedPromptsInputSchema = z.object({
  context: z
    .string()
    .describe(
      'The current context of the user, which can be used to tailor prompts to their needs.'
    )
    .optional(),
});
export type SuggestedPromptsInput = z.infer<typeof SuggestedPromptsInputSchema>;

const SuggestedPromptsOutputSchema = z.object({
  prompts: z
    .array(z.string())
    .describe('An array of suggested prompts for the user.'),
});
export type SuggestedPromptsOutput = z.infer<typeof SuggestedPromptsOutputSchema>;

export async function suggestPrompts(input: SuggestedPromptsInput): Promise<SuggestedPromptsOutput> {
  return suggestPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPromptsPrompt',
  input: {schema: SuggestedPromptsInputSchema},
  output: {schema: SuggestedPromptsOutputSchema},
  prompt: `You are an AI assistant that suggests prompts for an AI chat interface.

  The goal is to provide the user with relevant and useful prompts based on the current context.

  Here are some example prompts:
  - "Summarize the key points of the document."
  - "Translate this text into Spanish."
  - "Write a short poem about nature."
  - "Generate a marketing plan for a new product."

  Context: {{context}}

  Suggest 3 prompts that the user might find helpful. Consider common use-cases for the AI chat interface.
  Format your response as a JSON array of strings.
  `,
});

const suggestPromptsFlow = ai.defineFlow(
  {
    name: 'suggestPromptsFlow',
    inputSchema: SuggestedPromptsInputSchema,
    outputSchema: SuggestedPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
