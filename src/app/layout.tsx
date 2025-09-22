import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/auth-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

    