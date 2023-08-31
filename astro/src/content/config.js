import { defineCollection, z } from 'astro:content'

const workshops = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    thumbnail: z.string()
  })
})

export const collections = { workshops }