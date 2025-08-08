import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LinkedIn Prospector - Plateforme de prospection IA",
  description: "Plateforme SaaS de prospection automatisée avec IA pour LinkedIn, Email et WhatsApp",
};

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Campagnes', href: '/campaigns' },
  { name: 'Prospects', href: '/prospects' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Configuration IA', href: '/ai-config' },
  { name: 'Paramètres', href: '/settings' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 rounded bg-blue-600 inline-block" />
                  <span className="text-xl font-bold text-gray-900">Prospector</span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <span className="w-5 h-5 mr-3 rounded bg-gray-300 inline-block" />
                    {item.name}
                  </a>
                ))}
              </nav>

              {/* Connected Channels */}
              <div className="px-4 py-4 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Canaux connectés
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">LinkedIn</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Email</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-400">WhatsApp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="pl-64">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
