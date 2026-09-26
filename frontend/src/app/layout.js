import './globals.css';

export const metadata = {
  title: 'StockSense — Intelligent Inventory & 3D Digital Twin',
  description:
    'Real-time inventory ledger, 3D warehouse twin, predictive stock forecasting, and AI-assisted warehouse operations.',
  keywords: ['inventory management', '3D warehouse', 'digital twin', 'ERP', 'stock forecasting'],
  authors: [{ name: 'StockSense Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
