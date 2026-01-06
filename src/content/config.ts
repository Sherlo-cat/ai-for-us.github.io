// Content Collections Configuration

import { defineCollection, z } from 'astro:content';

// Blog posts collection schema
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('AI Engineer'),
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    tags: z.array(z.string()).default([]),
    language: z.enum(['en', 'zh', 'ja', 'es']),
    draft: z.boolean().default(false),
  }),
});

// Export all collections
export const collections = {
  blog: blogCollection,
};
