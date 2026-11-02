import './globals.css';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space',
  display: 'swap',
});

export const metadata = {
  title: "DAFIAN — Portfolio '26 | 3D Cosmic Universe",
  description:
    'Interactive 3D Cosmic Scrollytelling Portfolio of Muhammad Dafian — Full Stack Developer, Web3, AI & 3D WebGL.',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`dark ${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
    >
      <body className="relative w-full h-full overflow-hidden bg-[#020205] text-[#F5F7FA]">
        {children}
      </body>
    </html>
  );
}
