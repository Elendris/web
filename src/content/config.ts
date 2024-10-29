import { defineCollection, z } from 'astro:content';

const aboutCollection = defineCollection({
  schema: z.object({
    title: z.string(),
  })
});

export const collections = {
  'about': aboutCollection
};