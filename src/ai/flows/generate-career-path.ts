// src/ai/flows/generate-career-path.ts
'use server';
/**
 * @fileOverview Generates potential career paths based on user interests and hobbies.
 *
 * - generateCareerPath - A function that handles the career path generation process.
 * - GenerateCareerPathInput - The input type for the generateCareerPath function.
 * - GenerateCareerPathOutput - The return type for the generateCareerPath function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateCareerPathInputSchema = z.object({
  interests: z
    .string()
    .describe('A comma separated list of interests, hobbies, and skills.'),
});
export type GenerateCareerPathInput = z.infer<typeof GenerateCareerPathInputSchema>;

const GenerateCareerPathOutputSchema = z.object({
  careerPaths: z
    .array(
      z.object({
        title: z.string().describe('The title of the career path.'),
        description: z.string().describe('A short description of the career path.'),
      })
    )
    .describe('A list of potential career paths that align with the user profile.'),
});
export type GenerateCareerPathOutput = z.infer<typeof GenerateCareerPathOutputSchema>;

export async function generateCareerPath(input: GenerateCareerPathInput): Promise<GenerateCareerPathOutput> {
  return generateCareerPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCareerPathPrompt',
  input: {
    schema: z.object({
      interests: z
        .string()
        .describe('A comma separated list of interests, hobbies, and skills.'),
    }),
  },
  output: {
    schema: z.object({
      careerPaths: z
        .array(
          z.object({
            title: z.string().describe('The title of the career path.'),
            description: z.string().describe('A short description of the career path.'),
          })
        )
        .describe('A list of potential career paths that align with the user profile.'),
    }),
  },
  prompt: `You are a career counselor. A user will provide a list of their interests, hobbies, and skills. You will generate a list of potential career paths that align with their profile.

Interests, hobbies, and skills: {{{interests}}}

Respond with a list of career paths in JSON format.
`,
});

const generateCareerPathFlow = ai.defineFlow<
  typeof GenerateCareerPathInputSchema,
  typeof GenerateCareerPathOutputSchema
>({
  name: 'generateCareerPathFlow',
  inputSchema: GenerateCareerPathInputSchema,
  outputSchema: GenerateCareerPathOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
