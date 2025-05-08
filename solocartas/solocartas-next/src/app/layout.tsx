import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'SoloCartas',
  description: 'Compara precios de cartas TCG en tiendas chilenas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
