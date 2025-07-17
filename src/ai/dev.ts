import { config } from 'dotenv';
import path from 'path';

// Explicitly point to the .env file in the project root
config({ path: path.resolve(process.cwd(), '.env') });

import '@/ai/flows/pdf-ai.ts';
import '@/ai/flows/suggested-prompts.ts';
import '@/ai/flows/ai-chat.ts';
import '@/ai/flows/generate-image-flow.ts';
import '@/ai/flows/youtube-search-flow.ts';
