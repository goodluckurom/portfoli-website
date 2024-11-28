import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Goodluck Urom - Portfolio',
    short_name: 'GoodluckUrom',
    description: "Goodluck Urom's portfolio website",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait',
    categories: ['portfolio', 'development', 'technology'],
    prefer_related_applications: false,
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable' 
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'  
      },
      {
        src: '/icon-180.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ]
  }
}