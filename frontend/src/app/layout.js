import './globals.css';

export const metadata = {
  title: 'StockSense | Black & White Inventory System',
  description: 'AI-Powered Intelligent Inventory Management System',
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
