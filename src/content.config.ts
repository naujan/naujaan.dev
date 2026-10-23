import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const shared = {
  title: z.string(), description: z.string(),
  cover: z.string().nullable().optional(), coverAlt: z.string().default(''),
  draft: z.boolean().default(true), featured: z.boolean().default(false),
  order: z.number().int().nonnegative().default(10), sample: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
};
export const collections = {
  posts: defineCollection({
    loader: glob({ pattern: '**/*.mdoc', base: './src/content/posts' }),
    schema: z.object({ ...shared, date: z.coerce.date() }),
  }),
  projects: defineCollection({
    loader: glob({ pattern: '**/*.mdoc', base: './src/content/projects' }),
    schema: z.object({
      ...shared, year: z.string().default(''),
      repository: z.url().nullable().optional(),
      demo: z.url().nullable().optional(),
    }),
  }),
};

