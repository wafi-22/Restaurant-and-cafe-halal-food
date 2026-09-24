// server/config/gemini.js
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('⚠️  WARNING: GEMINI_API_KEY environment variable is not defined. The system will operate with dynamic heuristic verification fallback until an API key is configured.');
}

// Instantiate official Google GenAI SDK if key is provided
export const ai = apiKey
  ? new GoogleGenAI({ apiKey })
  : null;

// Enforce standard default model as required by specifications
export const GEMINI_MODEL = 'gemini-2.5-flash';
