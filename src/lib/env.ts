"use client";

import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT_URL: z
    .string()
    .url("Invalid API endpoint URL")
    .transform((val) => val.replace(/\/+$/, "")), // Remove trailing slashes
});

// Parse and validate environment variables
export const env = (() => {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_API_ENDPOINT_URL: process.env.NEXT_PUBLIC_API_ENDPOINT_URL,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new Error(`Invalid environment configuration:
        ${err.errors.map((e) => `${e.path}: ${e.message}`).join("\n")}`);
    }
    throw err;
  }
})();

// Helper function to get API endpoint
export const getApiEndpoint = () => {
  return `${env.NEXT_PUBLIC_API_ENDPOINT_URL}`;
};
