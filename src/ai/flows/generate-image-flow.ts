// src/ai/flows/generate-image-flow.ts
'use server';
/**
 * @fileOverview An AI image generation agent.
 *
 * - generateImages - A function that handles image generation.
 * - GenerateImagesInput - The input type for the generateImages function.
 * - GenerateImagesOutput - The return type for the generateImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImagesInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
  count: z.number().describe('The number of images to generate.').min(1).max(5),
});
export type GenerateImagesInput = z.infer<typeof GenerateImagesInputSchema>;

const GeneratedImageSchema = z.object({
    url: z.string().describe("A data URI of the generated image. Expected format: 'data:image/png;base64,<encoded_data>'."),
});

const GenerateImagesOutputSchema = z.object({
  images: z.array(GeneratedImageSchema).describe('An array of generated images.'),
});
export type GenerateImagesOutput = z.infer<typeof GenerateImagesOutputSchema>;


export async function generateImages(input: GenerateImagesInput): Promise<GenerateImagesOutput> {
  return generateImagesFlow(input);
}


const generateImagesFlow = ai.defineFlow(
  {
    name: 'generateImagesFlow',
    inputSchema: GenerateImagesInputSchema,
    outputSchema: GenerateImagesOutputSchema,
  },
  async (input) => {
    const generationJobs = Array.from({ length: input.count }, () => {
        return ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: input.prompt,
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        });
    });

    const results = await Promise.all(generationJobs);
    
    const images = results.map(result => {
        if (!result.media) {
            throw new Error('Image generation failed to return media.');
        }
        return { url: result.media.url };
    });

    return { images };
  }
);
