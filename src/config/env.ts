import dotenv from 'dotenv';

dotenv.config();

export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://automationexercise.com',
  apiBaseUrl: process.env.API_BASE_URL ?? 'https://automationexercise.com/api',
} as const;
