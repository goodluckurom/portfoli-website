import { inter, poppins, dmSans, sourceSans, jetbrainsMono, ibmPlexMono, sourceCodePro } from '@/lib/fonts';
import { ThemeProvider } from '@/providers/ThemeProvider';
import MainLayout from '@/components/layout/MainLayout';
import './globals.css';
import 'highlight.js/styles/github-dark.css';
import { FloatingBall } from '@/components/FloatingBall';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Goodluck Urom',
  description: "Goodluck Urom's portfolio website",
  keywords: ['portfolio', 'web development', 'full-stack', 'developer'],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-180.png', sizes: '180x180', type: 'image/png' }
    ]
  }
};

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

      <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} ${dmSans.variable} ${sourceSans.variable} ${jetbrainsMono.variable} ${ibmPlexMono.variable} ${sourceCodePro.variable}`}>
        <body>
          <ThemeProvider>
          <MainLayout>
            <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
            <div className="absolute inset-0">
          <FloatingBall
            size="600px"
            initialX={0}
            initialY={0}
            color="bg-primary-300"
            shape="blob"
            speed={15}
            opacity={0.1}
            blur="blur-3xl"
          />
          <FloatingBall
            size="500px"
            initialX={600}
            initialY={500}
            color="bg-accent-300"
            shape="blob"
            speed={20}
            opacity={0.08}
            blur="blur-2xl"
          />
          <FloatingBall
            size="400px"
            initialX={300}
            initialY={200}
            color="bg-primary-200"
            shape="square"
            speed={25}
            opacity={0.05}
            blur="blur-xl"
          />
          <FloatingBall
            size="300px"
            initialX={800}
            initialY={100}
            color="bg-accent-200"
            shape="triangle"
            speed={18}
            opacity={0.07}
            blur="blur-2xl"
          />
          <FloatingBall
            size="200px"
            initialX={200}
            initialY={500}
            color="bg-primary-400"
            shape="circle"
            speed={22}
            opacity={0.06}
            blur="blur-xl"
          />
        </div>
            </div>
            {children}
            </MainLayout>
          </ThemeProvider>
        </body>
      </html>
  );
}
