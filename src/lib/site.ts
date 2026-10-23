import { z } from 'astro/zod';
import aboutFile from '../content/about.json';
import settingsFile from '../content/settings.json';

// Keystatic omits empty optional fields when saving. Normalize them once.
export const about = z.object({
  heading: z.string(),
  intro: z.string().default(''),
  note: z.string().default(''),
  certificates: z.array(z.object({
    image: z.string().nullish(),
  })).default([]),
  timeline: z.array(z.object({
    period: z.string().default(''), title: z.string(), description: z.string().default(''),
  })).default([]),
}).parse(aboutFile);
export const settings = z.object({
  github: z.url().nullish(), linkedin: z.url().nullish(),
  email: z.string().default(''), footer: z.string().default(''),
}).parse(settingsFile);

