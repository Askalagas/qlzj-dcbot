import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

// ===== CONFIG =====
export * from './constants.js';

// ===== OPENAI INSTANCE =====
export const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });