import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://face-code-xi.vercel.app'

const RESULT_CODES = [
  'RLOH', 'RLOM', 'RLSH', 'RLSM',
  'RGOH', 'RGOM', 'RGSH', 'RGSM',
  'ALOH', 'ALOM', 'ALSH', 'ALSM',
  'AGOH', 'AGOM', 'AGSH', 'AGSM',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const resultPages: MetadataRoute.Sitemap = RESULT_CODES.map((code) => ({
    url: `${BASE_URL}/result/${code}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/diagnose`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/tokutei`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...resultPages,
  ]
}
