import './globals.css';

export const metadata = {
  title: 'INCA Construcciones — Construcción, remodelación y mantenimiento',
  description:
    'Construcción, remodelación y mantenimiento residencial, comercial e industrial. Albañilería, electricidad, plomería, azulejos, planos arquitectónicos y en 3D.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;800;900&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
