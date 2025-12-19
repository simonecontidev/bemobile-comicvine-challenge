import "./globals.css";
import { Header } from "@/components/Header/Header";
import { FavoritesProvider } from "@/features/favorites/FavoritesContext";
import { LoadingProvider } from "@/features/loading/LoadingContext";
import { Roboto_Condensed } from "next/font/google";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={robotoCondensed.className} suppressHydrationWarning>
        <LoadingProvider>
          <FavoritesProvider>
            <Header />
            <main className="page">
              <div className="panel">{children}</div>
            </main>
          </FavoritesProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}