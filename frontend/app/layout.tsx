import { Fraunces, Instrument_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/components/app/theme-provider';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { cn } from '@/lib/shadcn/utils';
import '@/styles/globals.css';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
});

const instrumentSans = Instrument_Sans({
  variable: '--font-instrument',
  subsets: ['latin'],
  display: 'swap',
});

const commitMono = localFont({
  display: 'swap',
  variable: '--font-commit-mono',
  src: [
    {
      path: '../fonts/CommitMono-400-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/CommitMono-700-Regular.otf',
      weight: '700',
      style: 'normal',
    },
  ],
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        fraunces.variable,
        instrumentSans.variable,
        commitMono.variable,
        'font-body scroll-smooth antialiased'
      )}
    >
      <head>
        <title>Rosie — The Enchanted Atelier</title>
        <meta
          name="description"
          content="Rosie — An ancient, warm voice assistant in an enchanted storybook atelier."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="relative min-h-screen overflow-x-hidden bg-[#1B1426] text-[#F0E6DA] selection:bg-[#E8A33D]/30 selection:text-[#F4E8D8]">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <header className="fixed top-0 left-0 z-50 flex w-full flex-row items-center justify-between border-b border-[#E8A33D]/10 bg-[#1B1426]/40 px-6 py-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <svg
                className="size-5 text-[#E8A33D]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2%"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-display text-xl font-bold tracking-tight text-[#F4E8D8]">
                Rosie
              </span>
              <span className="font-display hidden rounded-full border border-[#E8A33D]/20 bg-[#E8A33D]/10 px-3 py-0.5 text-xs font-semibold tracking-widest text-[#E8A33D] uppercase md:inline-block">
                Enchanted Atelier
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden font-mono text-xs tracking-wider text-[#8FB8A0] md:inline">
                ✦ Hearth Spirit & Companion
              </span>
            </div>
          </header>

          {children}
          <div className="group fixed right-4 bottom-4 z-50">
            <ThemeToggle className="rounded-full border border-[#E8A33D]/20 bg-[#1B1426]/80 text-[#F0E6DA] shadow-lg shadow-[#1B1426]/50 backdrop-blur-md hover:border-[#E8A33D]/40" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
