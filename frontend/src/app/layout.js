import './globals.css';

export const metadata = {
  title: 'StockSense — Intelligent Inventory Management System',
  description: 'AI-Powered, Real-Time 3D Inventory & Delivery Operations Management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#09090b] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
