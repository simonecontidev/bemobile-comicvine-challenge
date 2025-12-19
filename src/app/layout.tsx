import "./globals.css";
import { Header } from "@/components/Header/Header";
import { LoadingProvider } from "@/features/loading/LoadingContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LoadingProvider>
          <Header />
          <main className="app-main">{children}</main>
        </LoadingProvider>
      </body>
    </html>
  );
}