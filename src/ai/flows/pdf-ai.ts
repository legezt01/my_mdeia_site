// src/ai/flows/pdf-ai.ts
'use server';
/**
 * @fileOverview A PDF querying AI agent.
 *
 * - pdfQuery - A function that handles the PDF querying process.
 * - PdfQueryInput - The input type for the pdfQuery function.
 * - PdfQueryOutput - The return type for the pdfQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PdfQueryInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  query: z.string().describe('The query to ask about the PDF document.'),
});
export type PdfQueryInput = z.infer<typeof PdfQueryInputSchema>;

const PdfQueryOutputSchema = z.object({
  answer: z.string().describe('The answer to the query about the PDF document.'),
});
export type PdfQueryOutput = z.infer<typeof PdfQueryOutputSchema>;

export async function pdfQuery(input: PdfQueryInput): Promise<PdfQueryOutput> {
  return pdfQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pdfQueryPrompt',
  input: {schema: PdfQueryInputSchema},
  output: {schema: PdfQueryOutputSchema},
  prompt: `You are an expert AI assistant specializing in answering questions about PDF documents.

You will be provided with a PDF document and a query. You will answer the query based on the information in the PDF document.

Use the following as the primary source of information about the PDF document.

PDF Document: {{media url=pdfDataUri}}

Query: {{{query}}}`,
});

const pdfQueryFlow = ai.defineFlow(
  {
    name: 'pdfQueryFlow',
    inputSchema: PdfQueryInputSchema,
    outputSchema: PdfQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
