import "./globals.css";
import { Header } from "@/components/Header/Header";
import { LoadingProvider } from "@/features/loading/LoadingContext";
import { FavoritesProvider } from "@/features/favorites/FavoritesContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <FavoritesProvider>
          <LoadingProvider>
            <Header />
            <main className="app-main">{children}</main>
          </LoadingProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}