import './globals.css';
import Navbar from './components/Navbar';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext'; 

export const metadata = {
  title: 'SoloCartas',
  description: 'Compara precios de cartas TCG en tiendas chilenas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="pt-16"> {/* Add padding-top if navbar is fixed, adjust as needed */}
            {children}
          </main>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
